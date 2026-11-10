import { z } from "zod";

export const createShipmentStatusHistorySchema = z.object({
  shipmentId: z.string().trim().min(1, "must not be empty"),
  fromStatus: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]).optional().nullable(),
  toStatus: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]),
  changedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateShipmentStatusHistorySchema = z.object({
  shipmentId: z.string().trim().min(1, "must not be empty").optional(),
  fromStatus: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]).optional().nullable(),
  toStatus: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]).optional(),
  changedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const shipmentStatusHistoryIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listShipmentStatusHistoryQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "shipmentId", "fromStatus", "toStatus", "changedByEmployeeId", "notes", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateShipmentStatusHistoryInput = z.infer<typeof createShipmentStatusHistorySchema>;
export type IUpdateShipmentStatusHistoryInput = z.infer<typeof updateShipmentStatusHistorySchema>;
export type IShipmentStatusHistoryIdParam = z.infer<typeof shipmentStatusHistoryIdParamSchema>;
export type IListShipmentStatusHistoryQuery = z.infer<typeof listShipmentStatusHistoryQuerySchema>;
