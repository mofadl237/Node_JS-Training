import { z } from "zod";

export const createProductBundleComponentSchema = z.object({
  bundleProductId: z.string().trim().min(1, "must not be empty"),
  componentPackageId: z.string().trim().min(1, "must not be empty"),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  sortOrder: z.coerce.number().int().optional(),
});

export const updateProductBundleComponentSchema = z.object({
  bundleProductId: z.string().trim().min(1, "must not be empty").optional(),
  componentPackageId: z.string().trim().min(1, "must not be empty").optional(),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const productBundleComponentIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listProductBundleComponentQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "bundleProductId", "componentPackageId", "quantity", "sortOrder", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateProductBundleComponentInput = z.infer<typeof createProductBundleComponentSchema>;
export type IUpdateProductBundleComponentInput = z.infer<typeof updateProductBundleComponentSchema>;
export type IProductBundleComponentIdParam = z.infer<typeof productBundleComponentIdParamSchema>;
export type IListProductBundleComponentQuery = z.infer<typeof listProductBundleComponentQuerySchema>;
