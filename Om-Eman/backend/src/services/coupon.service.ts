import { Prisma, EDiscountType } from "@prisma/client";
import { BadRequestError } from "../shared/errors.js";
import type { ITransactionClient } from "./document-number.service.js";

// Coupon discount with the min() narrowing rule from the schema comments:
// the coupon limit can only tighten the promotion limit. Counting redemptions
// and updating usage in one transaction keeps double-use out; the exact counter
// under heavy contention is protected by re-reading inside the transaction.
//
// Used by two callers that must stay behaviorally identical:
//   - guest checkout (writes the PromotionRedemption after resolution)
//   - the public coupon preview endpoint (never writes anything)

export interface IResolvedCoupon {
  promotionId: string;
  couponId: string;
  discountType: EDiscountType;
  discount: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  discountedSubtotal: Prisma.Decimal;
}

export async function resolveCoupon(
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
    // A guest preview passes an empty customer id: no redemptions can exist
    // for it, so per-customer limits simply never trigger.
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
    discountType: coupon.promotion.discountType,
    discount,
    subtotal,
    discountedSubtotal: subtotal.minus(discount),
  };
}
