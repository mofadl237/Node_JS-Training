import { z } from "zod";

export const createStaticPageSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only"),
  titleAr: z.string().trim().min(1, "must not be empty"),
  titleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  bodyAr: z.string().trim().min(1, "must not be empty"),
  bodyEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitleAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoTitleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoDescriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoDescriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  canonicalUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const updateStaticPageSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only").optional(),
  titleAr: z.string().trim().min(1, "must not be empty").optional(),
  titleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  bodyAr: z.string().trim().min(1, "must not be empty").optional(),
  bodyEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitleAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoTitleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoDescriptionAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  seoDescriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  canonicalUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const staticPageIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listStaticPageQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "slug", "titleAr", "titleEn", "bodyAr", "bodyEn", "status", "seoTitleAr", "seoTitleEn", "seoDescriptionAr", "seoDescriptionEn", "canonicalUrl", "publishedAt", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateStaticPageInput = z.infer<typeof createStaticPageSchema>;
export type IUpdateStaticPageInput = z.infer<typeof updateStaticPageSchema>;
export type IStaticPageIdParam = z.infer<typeof staticPageIdParamSchema>;
export type IListStaticPageQuery = z.infer<typeof listStaticPageQuerySchema>;
