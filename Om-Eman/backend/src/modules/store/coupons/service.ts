import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import { resolveCoupon } from "../../../services/coupon.service.js";
import type { ITransactionClient } from "../../../services/document-number.service.js";
import type { IValidateCouponResponse } from "./validation.js";

// Public coupon preview (B8): validates a code against a proposed cart and
// returns the discount WITHOUT writing anything (no redemption, no usage
// counter). Resolution goes through the same shared service checkout uses, so
// a coupon the preview accepts is a coupon checkout accepts.
//
// A guest preview passes an empty customer id: customer-specific coupons are
// rejected for guests, exactly like checkout would after finding/creating the
// customer.

export class StoreCouponsService {
  async validate(
    input: {
      couponCode: string;
      items: { productPackageId: string; quantity: number }[];
    },
    customerId: string,
  ): Promise<IValidateCouponResponse> {
    const packageIds = input.items.map((item) => item.productPackageId);
    const packages = await prisma.productPackage.findMany({
      where: { id: { in: packageIds } },
      select: { id: true, sellingPrice: true, isActive: true, isPublished: true },
    });

    // Only sellable packages contribute to the subtotal, mirroring checkout.
    const pricesById = new Map(
      packages
        .filter((pkg) => pkg.isActive && pkg.isPublished)
        .map((pkg) => [pkg.id, pkg.sellingPrice]),
    );

    let subtotal = new Prisma.Decimal(0);
    for (const item of input.items) {
      const price = pricesById.get(item.productPackageId);
      if (price) {
        subtotal = subtotal.add(
          price.mul(new Prisma.Decimal(item.quantity.toFixed(4))),
        );
      }
    }

    const resolved = await resolveCoupon(
      prisma as ITransactionClient,
      input.couponCode,
      customerId,
      subtotal,
    );

    return {
      valid: resolved !== null,
      couponCode: input.couponCode,
      discountType: resolved?.discountType ?? "FIXED",
      discount: resolved ? resolved.discount.toString() : "0.0000",
      subtotal: subtotal.toString(),
      discountedSubtotal: resolved
        ? resolved.discountedSubtotal.toString()
        : subtotal.toString(),
    };
  }
}
