import { z } from "zod";

export const createBannerSchema = z.object({
  titleAr: z.string().trim().min(1, "must not be empty"),
  titleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  imageUrl: z.string().trim().url("must be a valid URL"),
  mobileImageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  linkUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateBannerSchema = z.object({
  titleAr: z.string().trim().min(1, "must not be empty").optional(),
  titleEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  imageUrl: z.string().trim().url("must be a valid URL").optional(),
  mobileImageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  linkUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const bannerIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listBannerQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "titleAr", "titleEn", "imageUrl", "mobileImageUrl", "linkUrl", "startsAt", "endsAt", "sortOrder", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateBannerInput = z.infer<typeof createBannerSchema>;
export type IUpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type IBannerIdParam = z.infer<typeof bannerIdParamSchema>;
export type IListBannerQuery = z.infer<typeof listBannerQuerySchema>;
