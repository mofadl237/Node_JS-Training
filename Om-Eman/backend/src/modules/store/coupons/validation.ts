import { z } from "zod";

export const validateCouponSchema = z.object({
  couponCode: z.string("coupon code is required").trim().min(1).max(60),
  items: z
    .array(
      z.object({
        productPackageId: z.string().min(1),
        quantity: z.number().positive().max(1000),
      }),
    )
    .min(1, "at least one item is required")
    .max(50),
});

export type IValidateCouponInput = z.infer<typeof validateCouponSchema>;

export interface IValidateCouponResponse {
  valid: boolean;
  couponCode: string;
  discountType: string;
  // Decimal strings, matching the checkout totals contract.
  discount: string;
  subtotal: string;
  discountedSubtotal: string;
}
