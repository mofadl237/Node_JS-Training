import { z } from "zod";

export const createCartSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  guestToken: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["ACTIVE", "MERGED", "CHECKED_OUT", "ABANDONED"]).optional(),
  mergedIntoCartId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateCartSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  guestToken: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["ACTIVE", "MERGED", "CHECKED_OUT", "ABANDONED"]).optional(),
  mergedIntoCartId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const cartIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listCartQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "customerId", "guestToken", "status", "mergedIntoCartId", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateCartInput = z.infer<typeof createCartSchema>;
export type IUpdateCartInput = z.infer<typeof updateCartSchema>;
export type ICartIdParam = z.infer<typeof cartIdParamSchema>;
export type IListCartQuery = z.infer<typeof listCartQuerySchema>;
