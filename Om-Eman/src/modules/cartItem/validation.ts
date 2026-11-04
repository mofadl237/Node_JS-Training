import { z } from "zod";

export const createCartItemSchema = z.object({
  cartId: z.string().trim().min(1, "must not be empty"),
  productPackageId: z.string().trim().min(1, "must not be empty"),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  priceAtAdd: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
});

export const updateCartItemSchema = z.object({
  cartId: z.string().trim().min(1, "must not be empty").optional(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional(),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  priceAtAdd: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
});

export const cartItemIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listCartItemQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "cartId", "productPackageId", "quantity", "priceAtAdd", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateCartItemInput = z.infer<typeof createCartItemSchema>;
export type IUpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ICartItemIdParam = z.infer<typeof cartItemIdParamSchema>;
export type IListCartItemQuery = z.infer<typeof listCartItemQuerySchema>;
