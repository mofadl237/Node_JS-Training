import { z } from "zod";

export const createPromotionRedemptionSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty"),
  couponId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  orderId: z.string().trim().min(1, "must not be empty"),
  orderItemId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  customerId: z.string().trim().min(1, "must not be empty"),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  rulesSnapshot: z.unknown().optional().nullable(),
  redeemedAt: z.coerce.date().optional(),
});

export const updatePromotionRedemptionSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty").optional(),
  couponId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  orderItemId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  customerId: z.string().trim().min(1, "must not be empty").optional(),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  rulesSnapshot: z.unknown().optional().nullable(),
  redeemedAt: z.coerce.date().optional(),
});

export const promotionRedemptionIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listPromotionRedemptionQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "promotionId", "couponId", "orderId", "orderItemId", "customerId", "discountAmount", "redeemedAt", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreatePromotionRedemptionInput = z.infer<typeof createPromotionRedemptionSchema>;
export type IUpdatePromotionRedemptionInput = z.infer<typeof updatePromotionRedemptionSchema>;
export type IPromotionRedemptionIdParam = z.infer<typeof promotionRedemptionIdParamSchema>;
export type IListPromotionRedemptionQuery = z.infer<typeof listPromotionRedemptionQuerySchema>;
