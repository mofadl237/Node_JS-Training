import { z } from "zod";

export const createShippingTariffSchema = z.object({
  carrierId: z.string().trim().min(1, "must not be empty"),
  governorate: z.string().trim().min(1, "must not be empty"),
  city: z.string().trim().min(1, "must not be empty").optional().nullable(),
  baseCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  etaMinDays: z.coerce.number().int(),
  etaMaxDays: z.coerce.number().int(),
  isActive: z.boolean().optional(),
});

export const updateShippingTariffSchema = z.object({
  carrierId: z.string().trim().min(1, "must not be empty").optional(),
  governorate: z.string().trim().min(1, "must not be empty").optional(),
  city: z.string().trim().min(1, "must not be empty").optional().nullable(),
  baseCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  etaMinDays: z.coerce.number().int().optional(),
  etaMaxDays: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const shippingTariffIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listShippingTariffQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "carrierId", "governorate", "city", "baseCost", "etaMinDays", "etaMaxDays", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateShippingTariffInput = z.infer<typeof createShippingTariffSchema>;
export type IUpdateShippingTariffInput = z.infer<typeof updateShippingTariffSchema>;
export type IShippingTariffIdParam = z.infer<typeof shippingTariffIdParamSchema>;
export type IListShippingTariffQuery = z.infer<typeof listShippingTariffQuerySchema>;
