import { z } from "zod";

export const createWishlistItemSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty"),
  productPackageId: z.string().trim().min(1, "must not be empty"),
});

export const updateWishlistItemSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty").optional(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional(),
});

export const wishlistItemIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listWishlistItemQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "customerId", "productPackageId", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateWishlistItemInput = z.infer<typeof createWishlistItemSchema>;
export type IUpdateWishlistItemInput = z.infer<typeof updateWishlistItemSchema>;
export type IWishlistItemIdParam = z.infer<typeof wishlistItemIdParamSchema>;
export type IListWishlistItemQuery = z.infer<typeof listWishlistItemQuerySchema>;
