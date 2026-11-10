import { z } from "zod";

export const createProductPackageSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty"),
  sku: z.string().trim().min(1, "must not be empty"),
  barcode: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nameAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sizeValue: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  sizeUnit: z.enum(["G", "KG", "ML", "L", "PIECE", "PACK", "OTHER"]),
  sellingPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  compareAtPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  saleEndsAt: z.coerce.date().optional().nullable(),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const updateProductPackageSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty").optional(),
  sku: z.string().trim().min(1, "must not be empty").optional(),
  barcode: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nameAr: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nameEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sizeValue: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  sizeUnit: z.enum(["G", "KG", "ML", "L", "PIECE", "PACK", "OTHER"]).optional(),
  sellingPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  compareAtPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  saleEndsAt: z.coerce.date().optional().nullable(),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const productPackageIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listProductPackageQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "productId", "sku", "barcode", "nameAr", "nameEn", "sizeValue", "sizeUnit", "sellingPrice", "compareAtPrice", "saleEndsAt", "stockStatus", "isActive", "isPublished", "sortOrder", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateProductPackageInput = z.infer<typeof createProductPackageSchema>;
export type IUpdateProductPackageInput = z.infer<typeof updateProductPackageSchema>;
export type IProductPackageIdParam = z.infer<typeof productPackageIdParamSchema>;
export type IListProductPackageQuery = z.infer<typeof listProductPackageQuerySchema>;
