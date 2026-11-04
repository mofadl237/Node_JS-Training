import { z } from "zod";

export const createShipmentSchema = z.object({
  shipmentNumber: z.string().trim().min(1, "must not be empty"),
  orderId: z.string().trim().min(1, "must not be empty"),
  carrierId: z.string().trim().min(1, "must not be empty"),
  trackingNumber: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]).optional(),
  expectedCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  actualCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codCollected: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codSettledAt: z.coerce.date().optional().nullable(),
  codSettlementReference: z.string().trim().min(1, "must not be empty").optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  etaMinDays: z.coerce.number().int().optional().nullable(),
  etaMaxDays: z.coerce.number().int().optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateShipmentSchema = z.object({
  shipmentNumber: z.string().trim().min(1, "must not be empty").optional(),
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  carrierId: z.string().trim().min(1, "must not be empty").optional(),
  trackingNumber: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["PENDING", "PREPARING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "CANCELED"]).optional(),
  expectedCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  actualCost: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codCollected: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  codSettledAt: z.coerce.date().optional().nullable(),
  codSettlementReference: z.string().trim().min(1, "must not be empty").optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  etaMinDays: z.coerce.number().int().optional().nullable(),
  etaMaxDays: z.coerce.number().int().optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const shipmentIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listShipmentQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "shipmentNumber", "orderId", "carrierId", "trackingNumber", "status", "expectedCost", "actualCost", "codAmount", "codCollected", "codSettledAt", "codSettlementReference", "shippedAt", "deliveredAt", "etaMinDays", "etaMaxDays", "notes", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type IUpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
export type IShipmentIdParam = z.infer<typeof shipmentIdParamSchema>;
export type IListShipmentQuery = z.infer<typeof listShipmentQuerySchema>;
