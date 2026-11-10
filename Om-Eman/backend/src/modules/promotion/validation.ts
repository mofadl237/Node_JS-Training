import { z } from "zod";

export const createPromotionSchema = z.object({
  name: z.string().trim().min(1, "must not be empty"),
  description: z.string().trim().min(1, "must not be empty").optional().nullable(),
  promotionType: z.enum(["PRODUCT_DISCOUNT", "CATEGORY_DISCOUNT", "STOREWIDE_DISCOUNT", "COUPON", "FREE_SHIPPING"]),
  discountType: z.enum(["FIXED", "PERCENTAGE"]),
  value: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  maxDiscountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  minOrderValue: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  usageLimitTotal: z.coerce.number().int().optional().nullable(),
  usageLimitPerCustomer: z.coerce.number().int().optional().nullable(),
  combinationRules: z.unknown().optional().nullable(),
  allowOnDiscountedItems: z.boolean().optional(),
  audienceMinOrders: z.coerce.number().int().optional().nullable(),
  audienceMaxOrders: z.coerce.number().int().optional().nullable(),
  audienceMinSpent: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updatePromotionSchema = z.object({
  name: z.string().trim().min(1, "must not be empty").optional(),
  description: z.string().trim().min(1, "must not be empty").optional().nullable(),
  promotionType: z.enum(["PRODUCT_DISCOUNT", "CATEGORY_DISCOUNT", "STOREWIDE_DISCOUNT", "COUPON", "FREE_SHIPPING"]).optional(),
  discountType: z.enum(["FIXED", "PERCENTAGE"]).optional(),
  value: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  maxDiscountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  minOrderValue: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional().nullable(),
  usageLimitTotal: z.coerce.number().int().optional().nullable(),
  usageLimitPerCustomer: z.coerce.number().int().optional().nullable(),
  combinationRules: z.unknown().optional().nullable(),
  allowOnDiscountedItems: z.boolean().optional(),
  audienceMinOrders: z.coerce.number().int().optional().nullable(),
  audienceMaxOrders: z.coerce.number().int().optional().nullable(),
  audienceMinSpent: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const promotionIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listPromotionQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "name", "description", "promotionType", "discountType", "value", "maxDiscountAmount", "minOrderValue", "startsAt", "endsAt", "usageLimitTotal", "usageLimitPerCustomer", "allowOnDiscountedItems", "audienceMinOrders", "audienceMaxOrders", "audienceMinSpent", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type IUpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
export type IPromotionIdParam = z.infer<typeof promotionIdParamSchema>;
export type IListPromotionQuery = z.infer<typeof listPromotionQuerySchema>;
