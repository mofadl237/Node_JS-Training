import { z } from "zod";

export const createOrderAddressSnapshotSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty"),
  recipientName: z.string().trim().min(1, "must not be empty"),
  phone: z.string().trim().min(1, "must not be empty"),
  governorate: z.string().trim().min(1, "must not be empty"),
  city: z.string().trim().min(1, "must not be empty"),
  district: z.string().trim().min(1, "must not be empty").optional().nullable(),
  street: z.string().trim().min(1, "must not be empty"),
  building: z.string().trim().min(1, "must not be empty").optional().nullable(),
  floor: z.string().trim().min(1, "must not be empty").optional().nullable(),
  landmark: z.string().trim().min(1, "must not be empty").optional().nullable(),
  latitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  longitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  sourceAddressId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateOrderAddressSnapshotSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  recipientName: z.string().trim().min(1, "must not be empty").optional(),
  phone: z.string().trim().min(1, "must not be empty").optional(),
  governorate: z.string().trim().min(1, "must not be empty").optional(),
  city: z.string().trim().min(1, "must not be empty").optional(),
  district: z.string().trim().min(1, "must not be empty").optional().nullable(),
  street: z.string().trim().min(1, "must not be empty").optional(),
  building: z.string().trim().min(1, "must not be empty").optional().nullable(),
  floor: z.string().trim().min(1, "must not be empty").optional().nullable(),
  landmark: z.string().trim().min(1, "must not be empty").optional().nullable(),
  latitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  longitude: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  sourceAddressId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const orderAddressSnapshotIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listOrderAddressSnapshotQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "orderId", "recipientName", "phone", "governorate", "city", "district", "street", "building", "floor", "landmark", "latitude", "longitude", "sourceAddressId", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateOrderAddressSnapshotInput = z.infer<typeof createOrderAddressSnapshotSchema>;
export type IUpdateOrderAddressSnapshotInput = z.infer<typeof updateOrderAddressSnapshotSchema>;
export type IOrderAddressSnapshotIdParam = z.infer<typeof orderAddressSnapshotIdParamSchema>;
export type IListOrderAddressSnapshotQuery = z.infer<typeof listOrderAddressSnapshotQuerySchema>;
