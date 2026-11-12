import { Prisma, ECartStatus, EProductType } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { BadRequestError, NotFoundError } from "../shared/errors.js";
import {
  allocateDocumentNumber,
  type ITransactionClient,
} from "./document-number.service.js";
import { generateOpaqueToken } from "../utils/secure-token.js";
import { EOrderStatus, EPaymentStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// Guest checkout
// ---------------------------------------------------------------------------

export interface IGuestAddressInput {
  governorate: string;
  city: string;
  district?: string;
  street: string;
  building?: string;
  floor?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface IGuestCheckoutItemInput {
  productPackageId: string;
  quantity: number;
}

export interface IGuestCheckoutInput {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  recipientName: string;
  address: IGuestAddressInput;
  items: IGuestCheckoutItemInput[];
  couponCode?: string;
  customerNotes?: string;
  // Guest cart token; when provided the checked-out cart is marked CHECKED_OUT.
  guestToken?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

export interface IGuestCheckoutResult {
  orderId: string;
  orderNumber: string;
  trackingToken: string;
}

// Phone is normalized before every lookup/store so "010 1234 5678" and
// "+201012345678" map to the same customer. Keep this in one place.
export function normalizePhone(phone: string): string {
  const normalized = phone.replace(/[\s()-]/g, "").trim();
  if (!/^\+?\d{8,15}$/.test(normalized)) {
    throw new BadRequestError(
      "Invalid phone number format",
      "INVALID_PHONE_FORMAT",
    );
  }
  return normalized;
}

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(4));
}

// Reads the single tax rate from SystemSetting. Missing setting = no tax;
// the MVP never invents a rate.
async function readTaxRate(tx: ITransactionClient): Promise<number> {
  const setting = await tx.systemSetting.findUnique({
    where: { key: "TAX_RATE" },
    select: { value: true },
  });
  const raw = setting?.value as { rate?: unknown } | null | undefined;
  const rate = typeof raw?.rate === "number" ? raw.rate : 0;
  return Math.max(0, Math.min(rate, 1));
}

// Cheapest active tariff for the governorate/city pair. Missing tariff rows
// mean free shipping is NOT implied - it means the store has not configured
// that area yet, and checkout must fail loudly instead of guessing.
async function readShippingTotal(
  tx: ITransactionClient,
  address: IGuestAddressInput,
): Promise<Prisma.Decimal> {
  const tariff = await tx.shippingTariff.findFirst({
    where: {
      isActive: true,
      governorate: address.governorate,
      OR: [
        { city: address.city },
        { city: null },
      ],
      carrier: { isActive: true },
    },
    orderBy: { baseCost: "asc" },
    select: { baseCost: true },
  });

  if (!tariff) {
    throw new BadRequestError(
      `No shipping tariff configured for ${address.governorate} / ${address.city}`,
      "SHIPPING_AREA_NOT_CONFIGURED",
    );
  }

  return tariff.baseCost;
}

interface IResolvedCoupon {
  promotionId: string;
  couponId: string;
  discount: Prisma.Decimal;
}

// Coupon discount with the min() narrowing rule from the schema comments:
// the coupon limit can only tighten the promotion limit. Counting redemptions
// and updating usage in one transaction keeps double-use out; the exact counter
// under heavy contention is protected by re-reading inside the transaction.
async function resolveCoupon(
  tx: ITransactionClient,
  couponCode: string | undefined,
  customerId: string,
  subtotal: Prisma.Decimal,
): Promise<IResolvedCoupon | null> {
  if (!couponCode) return null;

  const coupon = await tx.coupon.findUnique({
    where: { code: couponCode },
    select: {
      id: true,
      isActive: true,
      startsAt: true,
      endsAt: true,
      usageLimit: true,
      perCustomerLimit: true,
      customerId: true,
      promotionId: true,
      promotion: {
        select: {
          isActive: true,
          startsAt: true,
          endsAt: true,
          discountType: true,
          value: true,
          maxDiscountAmount: true,
          minOrderValue: true,
          usageLimitTotal: true,
          usageLimitPerCustomer: true,
        },
      },
    },
  });

  if (!coupon || !coupon.isActive || !coupon.promotion.isActive) {
    throw new BadRequestError("Coupon is not valid", "COUPON_INVALID");
  }

  const now = new Date();
  const windowStart = coupon.startsAt ?? coupon.promotion.startsAt;
  if (windowStart && windowStart > now) {
    throw new BadRequestError("Coupon is not active yet", "COUPON_NOT_ACTIVE");
  }
  if (
    (coupon.endsAt && coupon.endsAt < now) ||
    (coupon.promotion.endsAt && coupon.promotion.endsAt < now)
  ) {
    throw new BadRequestError("Coupon has expired", "COUPON_EXPIRED");
  }
  if (coupon.customerId && coupon.customerId !== customerId) {
    throw new BadRequestError(
      "Coupon is not valid for this customer",
      "COUPON_NOT_FOR_CUSTOMER",
    );
  }
  if (
    coupon.promotion.minOrderValue &&
    subtotal < coupon.promotion.minOrderValue
  ) {
    throw new BadRequestError(
      "Order total does not reach the coupon minimum",
      "COUPON_MIN_ORDER",
    );
  }

  // Effective limits = the tighter (min) of the promotion and coupon levels.
  const effectiveTotal =
    coupon.promotion.usageLimitTotal !== null &&
    coupon.usageLimit !== null
      ? Math.min(coupon.promotion.usageLimitTotal, coupon.usageLimit)
      : (coupon.promotion.usageLimitTotal ?? coupon.usageLimit);
  const effectivePerCustomer =
    coupon.promotion.usageLimitPerCustomer !== null &&
    coupon.perCustomerLimit !== null
      ? Math.min(
          coupon.promotion.usageLimitPerCustomer,
          coupon.perCustomerLimit,
        )
      : (coupon.promotion.usageLimitPerCustomer ?? coupon.perCustomerLimit);

  if (effectiveTotal !== null) {
    const usedTotal = await tx.promotionRedemption.count({
      where: { promotionId: coupon.promotionId },
    });
    if (usedTotal >= effectiveTotal) {
      throw new BadRequestError(
        "Coupon usage limit reached",
        "COUPON_LIMIT_REACHED",
      );
    }
  }
  if (effectivePerCustomer !== null) {
    const usedByCustomer = await tx.promotionRedemption.count({
      where: { promotionId: coupon.promotionId, customerId },
    });
    if (usedByCustomer >= effectivePerCustomer) {
      throw new BadRequestError(
        "You have already used this coupon the maximum number of times",
        "COUPON_PER_CUSTOMER_REACHED",
      );
    }
  }

  let discount: Prisma.Decimal =
    coupon.promotion.discountType === "PERCENTAGE"
      ? subtotal.mul(coupon.promotion.value).div(100)
      : coupon.promotion.value;
  if (
    coupon.promotion.maxDiscountAmount &&
    discount > coupon.promotion.maxDiscountAmount
  ) {
    discount = coupon.promotion.maxDiscountAmount;
  }
  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    promotionId: coupon.promotionId,
    couponId: coupon.id,
    discount,
  };
}

// Guest checkout in one transaction:
//   1. find-or-create the Customer by normalized phone (isGuest = true),
//   2. validate packages and build item snapshots,
//   3. resolve the coupon and its limits,
//   4. compute totals (shipping from tariffs, tax from SystemSetting),
//   5. allocate the order number, create Order + OrderItems +
//      OrderAddressSnapshot + PromotionRedemption,
//   6. mark the guest cart CHECKED_OUT.
// Snapshots guarantee old orders stay correct when prices or names change.
export async function createGuestOrder(
  input: IGuestCheckoutInput,
): Promise<IGuestCheckoutResult> {
  if (!input.items.length) {
    throw new BadRequestError(
      "Checkout requires at least one item",
      "CHECKOUT_EMPTY",
    );
  }
  for (const item of input.items) {
    if (!(item.quantity > 0)) {
      throw new BadRequestError(
        "Item quantities must be greater than zero",
        "CHECKOUT_INVALID_QUANTITY",
      );
    }
  }

  return prisma.$transaction(async (tx) => {
    const phone = normalizePhone(input.phone);

    let customer = await tx.customer.findUnique({ where: { phone } });
    if (customer && !customer.isGuest) {
      // A registered customer is checking out with the same phone: attach the
      // order to the real account instead of creating a duplicate.
    } else if (!customer) {
      customer = await tx.customer.create({
        data: {
          phone,
          isGuest: true,
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
          email: input.email ?? null,
        },
      });
    }

    const packageIds = input.items.map((item) => item.productPackageId);
    const packages = await tx.productPackage.findMany({
      where: { id: { in: packageIds } },
      select: {
        id: true,
        sku: true,
        nameAr: true,
        nameEn: true,
        sellingPrice: true,
        isActive: true,
        isPublished: true,
        productId: true,
        product: {
          select: { nameAr: true, nameEn: true, productType: true },
        },
        bundleComponents: {
          select: {
            quantity: true,
            componentPackage: {
              select: {
                sku: true,
                nameAr: true,
                sellingPrice: true,
              },
            },
          },
        },
      },
    });

    const packagesById = new Map(packages.map((pkg) => [pkg.id, pkg]));
    let subtotal = new Prisma.Decimal(0);

    interface IPreparedItem {
      productPackageId: string;
      productId: string | null;
      productNameArSnapshot: string;
      productNameEnSnapshot: string | null;
      packageNameArSnapshot: string | null;
      packageNameEnSnapshot: string | null;
      skuSnapshot: string;
      quantity: Prisma.Decimal;
      unitPrice: Prisma.Decimal;
      lineTotal: Prisma.Decimal;
      bundleSnapshot: Prisma.InputJsonValue | null;
    }

    const preparedItems: IPreparedItem[] = input.items.map((item) => {
      const pkg = packagesById.get(item.productPackageId);
      if (!pkg) {
        throw new NotFoundError(
          `Package ${item.productPackageId} not found`,
          "PACKAGE_NOT_FOUND",
        );
      }
      if (!pkg.isActive || !pkg.isPublished) {
        throw new BadRequestError(
          `Package ${pkg.sku} is not available for sale`,
          "PACKAGE_NOT_SALEABLE",
        );
      }

      const quantity = toDecimal(item.quantity);
      const unitPrice = pkg.sellingPrice;
      const lineTotal = unitPrice.mul(quantity);
      subtotal = subtotal.add(lineTotal);

      const isBundle = pkg.product.productType === EProductType.PREDEFINED_BUNDLE;
      const bundleSnapshot = isBundle
        ? {
            components: pkg.bundleComponents.map((component) => ({
              sku: component.componentPackage.sku,
              nameAr: component.componentPackage.nameAr,
              quantity: component.quantity.toString(),
              unitPrice: component.componentPackage.sellingPrice.toString(),
            })),
          }
        : null;

      return {
        productPackageId: pkg.id,
        productId: pkg.productId,
        productNameArSnapshot: pkg.product.nameAr,
        productNameEnSnapshot: pkg.product.nameEn,
        packageNameArSnapshot: pkg.nameAr,
        packageNameEnSnapshot: pkg.nameEn,
        skuSnapshot: pkg.sku,
        quantity,
        unitPrice,
        lineTotal,
        bundleSnapshot,
      };
    });

    const coupon = await resolveCoupon(
      tx,
      input.couponCode,
      customer.id,
      subtotal,
    );
    const discountTotal = coupon?.discount ?? new Prisma.Decimal(0);

    const shippingTotal = await readShippingTotal(tx, input.address);
    const taxRate = await readTaxRate(tx);
    const taxable = subtotal.minus(discountTotal);
    const taxTotal = taxable.mul(taxRate);
    const grandTotal = taxable.add(shippingTotal).add(taxTotal);

    const orderNumber = await allocateDocumentNumber(tx, {
      documentType: "ORDER",
      prefix: "ORD",
    });
    const trackingToken = generateOpaqueToken();

    const order = await tx.order.create({
      data: {
        orderNumber,
        trackingToken,
        customerId: customer.id,
        status: EOrderStatus.RECEIVED,
        paymentStatus: EPaymentStatus.PENDING,
        subtotal,
        discountTotal,
        shippingTotal,
        taxTotal,
        grandTotal,
        customerNotes: input.customerNotes ?? null,
        clientIp: input.clientIp ?? null,
        clientUserAgent: input.clientUserAgent ?? null,
        items: {
          create: preparedItems.map((item) => ({
            productId: item.productId,
            productPackageId: item.productPackageId,
            productNameArSnapshot: item.productNameArSnapshot,
            productNameEnSnapshot: item.productNameEnSnapshot,
            packageNameArSnapshot: item.packageNameArSnapshot,
            packageNameEnSnapshot: item.packageNameEnSnapshot,
            skuSnapshot: item.skuSnapshot,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
            ...(item.bundleSnapshot !== null
              ? { bundleSnapshot: item.bundleSnapshot }
              : {}),
          })),
        },
        addressSnapshot: {
          create: {
            recipientName: input.recipientName,
            phone,
            governorate: input.address.governorate,
            city: input.address.city,
            district: input.address.district ?? null,
            street: input.address.street,
            building: input.address.building ?? null,
            floor: input.address.floor ?? null,
            landmark: input.address.landmark ?? null,
            latitude:
              input.address.latitude !== undefined
                ? toDecimal(input.address.latitude)
                : null,
            longitude:
              input.address.longitude !== undefined
                ? toDecimal(input.address.longitude)
                : null,
          },
        },
        ...(coupon
          ? {
              promotionRedemptions: {
                create: {
                  promotionId: coupon.promotionId,
                  couponId: coupon.couponId,
                  customerId: customer.id,
                  discountAmount: coupon.discount,
                  rulesSnapshot: {
                    couponCode: input.couponCode ?? null,
                    discountType: "ORDER_LEVEL",
                  },
                },
              },
            }
          : {}),
      },
      select: { id: true },
    });

    if (input.guestToken) {
      await tx.cart.updateMany({
        where: { guestToken: input.guestToken, status: ECartStatus.ACTIVE },
        data: { status: ECartStatus.CHECKED_OUT },
      });
    }

    return { orderId: order.id, orderNumber, trackingToken };
  });
}
