import { z } from "zod";

export const createCustomerAddressSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty"),
  label: z.string().trim().min(1, "must not be empty").optional().nullable(),
  governorate: z.string().trim().min(1, "must not be empty"),
  city: z.string().trim().min(1, "must not be empty"),
  district: z.string().trim().min(1, "must not be empty").optional().nullable(),
  street: z.string().trim().min(1, "must not be empty"),
  building: z.string().trim().min(1, "must not be empty").optional().nullable(),
  floor: z.string().trim().min(1, "must not be empty").optional().nullable(),
  landmark: z.string().trim().min(1, "must not be empty").optional().nullable(),
  latitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  longitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateCustomerAddressSchema = z.object({
  customerId: z.string().trim().min(1, "must not be empty").optional(),
  label: z.string().trim().min(1, "must not be empty").optional().nullable(),
  governorate: z.string().trim().min(1, "must not be empty").optional(),
  city: z.string().trim().min(1, "must not be empty").optional(),
  district: z.string().trim().min(1, "must not be empty").optional().nullable(),
  street: z.string().trim().min(1, "must not be empty").optional(),
  building: z.string().trim().min(1, "must not be empty").optional().nullable(),
  floor: z.string().trim().min(1, "must not be empty").optional().nullable(),
  landmark: z.string().trim().min(1, "must not be empty").optional().nullable(),
  latitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  longitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const customerAddressIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listCustomerAddressQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "customerId", "label", "governorate", "city", "district", "street", "building", "floor", "landmark", "latitude", "longitude", "isDefault", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateCustomerAddressInput = z.infer<typeof createCustomerAddressSchema>;
export type IUpdateCustomerAddressInput = z.infer<typeof updateCustomerAddressSchema>;
export type ICustomerAddressIdParam = z.infer<typeof customerAddressIdParamSchema>;
export type IListCustomerAddressQuery = z.infer<typeof listCustomerAddressQuerySchema>;
