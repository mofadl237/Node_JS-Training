import { z } from "zod";

export const createOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, "must not be empty"),
  customerId: z.string().trim().min(1, "must not be empty"),
  status: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]).optional(),
  paymentStatus: z.enum(["PENDING", "PROOF_UPLOADED", "CONFIRMED", "REJECTED", "CANCELED"]).optional(),
  placedAt: z.coerce.date().optional(),
  confirmedAt: z.coerce.date().optional().nullable(),
  preparedAt: z.coerce.date().optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  cancelReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  subtotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  discountTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  shippingTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  grandTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  customerNotes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  internalNotes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbc: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientIp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientUserAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
  eventSourceUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
});

export const updateOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, "must not be empty").optional(),
  customerId: z.string().trim().min(1, "must not be empty").optional(),
  status: z.enum(["RECEIVED", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELED", "FAILED_DELIVERY"]).optional(),
  paymentStatus: z.enum(["PENDING", "PROOF_UPLOADED", "CONFIRMED", "REJECTED", "CANCELED"]).optional(),
  placedAt: z.coerce.date().optional(),
  confirmedAt: z.coerce.date().optional().nullable(),
  preparedAt: z.coerce.date().optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  cancelReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  subtotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  discountTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  shippingTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  grandTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  customerNotes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  internalNotes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbc: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientIp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientUserAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
  eventSourceUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
});

export const orderIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listOrderQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "orderNumber", "customerId", "status", "paymentStatus", "placedAt", "confirmedAt", "preparedAt", "shippedAt", "deliveredAt", "canceledAt", "cancelReason", "subtotal", "discountTotal", "shippingTotal", "taxTotal", "grandTotal", "customerNotes", "internalNotes", "fbp", "fbc", "clientIp", "clientUserAgent", "eventSourceUrl", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateOrderInput = z.infer<typeof createOrderSchema>;
export type IUpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type IOrderIdParam = z.infer<typeof orderIdParamSchema>;
export type IListOrderQuery = z.infer<typeof listOrderQuerySchema>;
