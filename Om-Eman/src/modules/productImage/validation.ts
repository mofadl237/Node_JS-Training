import { z } from "zod";

export const createProductImageSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty"),
  url: z.string().trim().url("must be a valid URL"),
  altAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  altEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const updateProductImageSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty").optional(),
  url: z.string().trim().url("must be a valid URL").optional(),
  altAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  altEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const productImageIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listProductImageQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "productId", "url", "altAr", "altEn", "sortOrder", "isPrimary", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateProductImageInput = z.infer<typeof createProductImageSchema>;
export type IUpdateProductImageInput = z.infer<typeof updateProductImageSchema>;
export type IProductImageIdParam = z.infer<typeof productImageIdParamSchema>;
export type IListProductImageQuery = z.infer<typeof listProductImageQuerySchema>;
