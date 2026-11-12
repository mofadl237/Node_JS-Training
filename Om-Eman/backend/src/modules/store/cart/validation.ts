import { z } from "zod";

export const guestTokenParamSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{20,64}$/, "guest token is invalid");

export const addCartItemSchema = z.object({
  productPackageId: z.string().min(1, "productPackageId is required"),
  quantity: z.number().positive().max(1000),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().positive().max(1000),
});

export const mergeCartSchema = z.object({
  guestToken: guestTokenParamSchema,
});
