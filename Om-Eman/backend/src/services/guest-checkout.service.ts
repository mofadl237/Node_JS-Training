import {
  Prisma,
  ECartStatus,
  EOrderStatus,
  EPaymentStatus,
} from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { BadRequestError } from "../shared/errors.js";
import {
  allocateDocumentNumber,
} from "./document-number.service.js";
import {
  prepareCheckoutItems,
} from "./checkout-items.service.js";
import {
  computeCheckoutTotals,
  buildOrderAddressSnapshot,
} from "./checkout-totals.service.js";
import { generateOpaqueToken } from "../utils/secure-token.js";
import { normalizePhone } from "../utils/phone.js";
import type {
  IGuestCheckoutInput,
  IGuestCheckoutResult,
  TCheckoutPaymentMethod,
} from "./checkout-contracts.js";

// Guest checkout in one transaction:
//   1. find-or-create the Customer by normalized phone (isGuest = true),
//   2. validate packages (saleable AND in stock) and build item snapshots,
//   3. resolve the coupon and its limits,
//   4. compute totals (shipping from tariffs, tax from SystemSetting),
//   5. allocate the order number, create Order + OrderItems +
//      OrderAddressSnapshot + PromotionRedemption + pending Payment,
//   6. mark the guest cart CHECKED_OUT.
// Item/total rules live in checkout-items.service.ts and coupon/shipping
// services; this file only orchestrates the transaction.
export async function createGuestOrder(
  input: IGuestCheckoutInput,
): Promise<IGuestCheckoutResult> {
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

    const packages = await tx.productPackage.findMany({
      where: {
        id: { in: input.items.map((item) => item.productPackageId) },
      },
      select: {
        id: true,
        sku: true,
        nameAr: true,
        nameEn: true,
        sellingPrice: true,
        isActive: true,
        isPublished: true,
        stockStatus: true,
        productId: true,
        product: {
          select: { nameAr: true, nameEn: true, productType: true },
        },
        bundleComponents: {
          select: {
            quantity: true,
            componentPackage: { select: { sku: true, nameAr: true, sellingPrice: true } },
          },
        },
      },
    });

    const { preparedItems, subtotal } = prepareCheckoutItems(input.items, packages);

    const { discountTotal, shippingTotal, taxTotal, grandTotal, coupon } =
      await computeCheckoutTotals(tx, {
        couponCode: input.couponCode,
        customerId: customer.id,
        subtotal,
        address: input.address,
      });

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
          create: buildOrderAddressSnapshot(
            input.address,
            phone,
            input.recipientName,
          ),
        },
        payments: {
          // One pending payment row per checkout. It records the intended
          // method immediately: COD rows get settled by an employee,
          // ONLINE_TRANSFER rows receive the transfer proof.
          create: {
            method: input.paymentMethod,
            status: EPaymentStatus.PENDING,
            amount: grandTotal,
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
      select: {
        id: true,
        payments: { select: { id: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (input.guestToken) {
      await tx.cart.updateMany({
        where: { guestToken: input.guestToken, status: ECartStatus.ACTIVE },
        data: { status: ECartStatus.CHECKED_OUT },
      });
    }

    return {
      orderId: order.id,
      orderNumber,
      trackingToken,
      paymentMethod: input.paymentMethod,
      paymentId: order.payments[0]?.id ?? "",
      totals: {
        subtotal: subtotal.toString(),
        discountTotal: discountTotal.toString(),
        shippingTotal: shippingTotal.toString(),
        taxTotal: taxTotal.toString(),
        grandTotal: grandTotal.toString(),
        currency: env.DEFAULT_CURRENCY,
      },
    };
  });
}
