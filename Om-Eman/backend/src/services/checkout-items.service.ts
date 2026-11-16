import { Prisma, EProductType, EStockStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../shared/errors.js";

// Package validation and order-item snapshot preparation for checkout.
// Extracted from guest-checkout.service.ts so each file stays under the
// 200-line limit; customer-claim checkout reuses the same rules.

export interface ICheckoutItemInput {
  productPackageId: string;
  quantity: number;
}

export interface ICheckoutPackageRow {
  id: string;
  sku: string;
  nameAr: string | null;
  nameEn: string | null;
  sellingPrice: Prisma.Decimal;
  isActive: boolean;
  isPublished: boolean;
  stockStatus: EStockStatus;
  productId: string | null;
  product: { nameAr: string; nameEn: string | null; productType: EProductType };
  bundleComponents: {
    quantity: Prisma.Decimal;
    componentPackage: { sku: string; nameAr: string | null; sellingPrice: Prisma.Decimal };
  }[];
}

export interface IPreparedItem {
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

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(4));
}

// Validates every requested package (saleable AND in stock) and builds the
// immutable item snapshots. Snapshots guarantee old orders stay correct when
// prices or names change later.
export function prepareCheckoutItems(
  items: ICheckoutItemInput[],
  packages: ICheckoutPackageRow[],
): { preparedItems: IPreparedItem[]; subtotal: Prisma.Decimal } {
  if (items.length === 0) {
    throw new BadRequestError(
      "Checkout requires at least one item",
      "CHECKOUT_EMPTY",
    );
  }
  const packagesById = new Map(packages.map((pkg) => [pkg.id, pkg]));
  let subtotal = new Prisma.Decimal(0);

  const preparedItems = items.map((item) => {
    if (!(item.quantity > 0)) {
      throw new BadRequestError(
        "Item quantities must be greater than zero",
        "CHECKOUT_INVALID_QUANTITY",
      );
    }
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
    if (pkg.stockStatus === EStockStatus.OUT_OF_STOCK) {
      throw new BadRequestError(
        `Package ${pkg.sku} is currently out of stock`,
        "PACKAGE_OUT_OF_STOCK",
      );
    }

    const quantity = toDecimal(item.quantity);
    const unitPrice = pkg.sellingPrice;
    const lineTotal = unitPrice.mul(quantity);
    subtotal = subtotal.add(lineTotal);

    const bundleSnapshot =
      pkg.product.productType === EProductType.PREDEFINED_BUNDLE
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
    } satisfies IPreparedItem;
  });

  return { preparedItems, subtotal };
}

export { toDecimal };
