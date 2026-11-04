import { z } from "zod";

export const createShippingCarrierSchema = z.object({
  name: z.string().trim().min(1, "must not be empty"),
  code: z.string().trim().min(1, "must not be empty"),
  contactPerson: z.string().trim().min(1, "must not be empty").optional().nullable(),
  phone: z.string().trim().min(1, "must not be empty").optional().nullable(),
  email: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  isActive: z.boolean().optional(),
  supportsApi: z.boolean().optional(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateShippingCarrierSchema = z.object({
  name: z.string().trim().min(1, "must not be empty").optional(),
  code: z.string().trim().min(1, "must not be empty").optional(),
  contactPerson: z.string().trim().min(1, "must not be empty").optional().nullable(),
  phone: z.string().trim().min(1, "must not be empty").optional().nullable(),
  email: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  isActive: z.boolean().optional(),
  supportsApi: z.boolean().optional(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const shippingCarrierIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listShippingCarrierQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "name", "code", "contactPerson", "phone", "email", "isActive", "supportsApi", "notes", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateShippingCarrierInput = z.infer<typeof createShippingCarrierSchema>;
export type IUpdateShippingCarrierInput = z.infer<typeof updateShippingCarrierSchema>;
export type IShippingCarrierIdParam = z.infer<typeof shippingCarrierIdParamSchema>;
export type IListShippingCarrierQuery = z.infer<typeof listShippingCarrierQuerySchema>;
