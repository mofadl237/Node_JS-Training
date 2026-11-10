import { z } from "zod";

export const createSubcategorySchema = z.object({
  categoryId: z.string().trim().min(1, "must not be empty"),
  nameAr: z.string().trim().min(1, "must not be empty"),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only"),
  descriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  imageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateSubcategorySchema = z.object({
  categoryId: z.string().trim().min(1, "must not be empty").optional(),
  nameAr: z.string().trim().min(1, "must not be empty").optional(),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only").optional(),
  descriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  imageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const subcategoryIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listSubcategoryQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "categoryId", "nameAr", "nameEn", "slug", "descriptionAr", "descriptionEn", "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
export type IUpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
export type ISubcategoryIdParam = z.infer<typeof subcategoryIdParamSchema>;
export type IListSubcategoryQuery = z.infer<typeof listSubcategoryQuerySchema>;
