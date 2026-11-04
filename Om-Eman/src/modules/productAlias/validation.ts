import { z } from "zod";

export const createProductAliasSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty"),
  alias: z.string().trim().min(1, "must not be empty"),
  language: z.enum(["AR", "EN"]),
  normalizedAlias: z.string().trim().min(1, "must not be empty"),
  weight: z.coerce.number().int().optional(),
  isSearchable: z.boolean().optional(),
});

export const updateProductAliasSchema = z.object({
  productId: z.string().trim().min(1, "must not be empty").optional(),
  alias: z.string().trim().min(1, "must not be empty").optional(),
  language: z.enum(["AR", "EN"]).optional(),
  normalizedAlias: z.string().trim().min(1, "must not be empty").optional(),
  weight: z.coerce.number().int().optional(),
  isSearchable: z.boolean().optional(),
});

export const productAliasIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listProductAliasQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "productId", "alias", "language", "normalizedAlias", "weight", "isSearchable", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateProductAliasInput = z.infer<typeof createProductAliasSchema>;
export type IUpdateProductAliasInput = z.infer<typeof updateProductAliasSchema>;
export type IProductAliasIdParam = z.infer<typeof productAliasIdParamSchema>;
export type IListProductAliasQuery = z.infer<typeof listProductAliasQuerySchema>;
