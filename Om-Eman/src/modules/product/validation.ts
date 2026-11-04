import { z } from "zod";

export const createProductSchema = z.object({
  primarySubcategoryId: z.string().trim().min(1, "must not be empty"),
  nameAr: z.string().trim().min(1, "must not be empty"),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only"),
  descriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productType: z.enum(["FINISHED", "PREDEFINED_BUNDLE"]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  brand: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchNameArNormalized: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchNameEnNormalized: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchKeywords: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchText: z.string().trim().min(1, "must not be empty").optional().nullable(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  archivedAt: z.coerce.date().optional().nullable(),
});

export const updateProductSchema = z.object({
  primarySubcategoryId: z.string().trim().min(1, "must not be empty").optional(),
  nameAr: z.string().trim().min(1, "must not be empty").optional(),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only").optional(),
  descriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productType: z.enum(["FINISHED", "PREDEFINED_BUNDLE"]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  brand: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchNameArNormalized: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchNameEnNormalized: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchKeywords: z.string().trim().min(1, "must not be empty").optional().nullable(),
  searchText: z.string().trim().min(1, "must not be empty").optional().nullable(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  archivedAt: z.coerce.date().optional().nullable(),
});

export const productIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listProductQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "primarySubcategoryId", "nameAr", "nameEn", "slug", "descriptionAr", "descriptionEn", "productType", "status", "brand", "searchNameArNormalized", "searchNameEnNormalized", "searchKeywords", "searchText", "isFeatured", "publishedAt", "archivedAt", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateProductInput = z.infer<typeof createProductSchema>;
export type IUpdateProductInput = z.infer<typeof updateProductSchema>;
export type IProductIdParam = z.infer<typeof productIdParamSchema>;
export type IListProductQuery = z.infer<typeof listProductQuerySchema>;
