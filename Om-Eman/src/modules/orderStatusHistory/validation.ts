import { z } from "zod";

export const createOrderStatusHistorySchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty"),
  fromStatus: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]).optional().nullable(),
  toStatus: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]),
  changedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateOrderStatusHistorySchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  fromStatus: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]).optional().nullable(),
  toStatus: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]).optional(),
  changedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const orderStatusHistoryIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listOrderStatusHistoryQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "orderId", "fromStatus", "toStatus", "changedByEmployeeId", "notes", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateOrderStatusHistoryInput = z.infer<typeof createOrderStatusHistorySchema>;
export type IUpdateOrderStatusHistoryInput = z.infer<typeof updateOrderStatusHistorySchema>;
export type IOrderStatusHistoryIdParam = z.infer<typeof orderStatusHistoryIdParamSchema>;
export type IListOrderStatusHistoryQuery = z.infer<typeof listOrderStatusHistoryQuerySchema>;
