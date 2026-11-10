import { z } from "zod";

export const createPromotionTargetSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty"),
  scope: z.enum(["ORDER", "PRODUCT", "PACKAGE", "CATEGORY", "SUBCATEGORY", "SHIPPING"]),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  categoryId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  subcategoryId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updatePromotionTargetSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty").optional(),
  scope: z.enum(["ORDER", "PRODUCT", "PACKAGE", "CATEGORY", "SUBCATEGORY", "SHIPPING"]).optional(),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  categoryId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  subcategoryId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const promotionTargetIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listPromotionTargetQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "promotionId", "scope", "productId", "productPackageId", "categoryId", "subcategoryId", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreatePromotionTargetInput = z.infer<typeof createPromotionTargetSchema>;
export type IUpdatePromotionTargetInput = z.infer<typeof updatePromotionTargetSchema>;
export type IPromotionTargetIdParam = z.infer<typeof promotionTargetIdParamSchema>;
export type IListPromotionTargetQuery = z.infer<typeof listPromotionTargetQuerySchema>;
