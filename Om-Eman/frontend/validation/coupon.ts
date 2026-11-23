import { z } from "zod";
import { decimalStringSchema } from "./checkout";

export const couponValidateSchema = z.object({
  couponCode: z.string("coupon code is required").trim().min(1).max(60),
  items: z
    .array(
      z.object({
        productPackageId: z.string().min(1),
        quantity: z.number().positive().max(1000),
      }),
    )
    .min(1)
    .max(50),
});

export const couponPreviewSchema = z.object({
  valid: z.boolean(),
  couponCode: z.string().min(1),
  discountType: z.string().min(1),
  discount: decimalStringSchema,
  subtotal: decimalStringSchema,
  discountedSubtotal: decimalStringSchema,
});

export type TCouponValidatePayload = z.infer<typeof couponValidateSchema>;
