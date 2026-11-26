import { z } from "zod";

export const adminProductQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(200).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z
      .enum([
        "id",
        "primarySubcategoryId",
        "nameAr",
        "nameEn",
        "slug",
        "descriptionAr",
        "descriptionEn",
        "productType",
        "status",
        "brand",
        "searchNameArNormalized",
        "searchNameEnNormalized",
        "searchKeywords",
        "searchText",
        "isFeatured",
        "publishedAt",
        "archivedAt",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export const adminPaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const adminProductRowSchema = z.object({
  id: z.string().trim().min(1),
  primarySubcategoryId: z.string().trim().min(1),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().nullable(),
  slug: z.string().trim().min(1),
  descriptionAr: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  productType: z.enum(["FINISHED", "PREDEFINED_BUNDLE"]),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]),
  brand: z.string().nullable(),
  searchNameArNormalized: z.string().nullable(),
  searchNameEnNormalized: z.string().nullable(),
  searchKeywords: z.string().nullable(),
  searchText: z.string().nullable(),
  isFeatured: z.boolean(),
  publishedAt: z.string().datetime().nullable(),
  archivedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const adminProductListSchema = z.array(adminProductRowSchema);

export type TAdminProductQueryForm = z.infer<typeof adminProductQuerySchema>;
