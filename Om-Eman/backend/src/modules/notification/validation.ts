import { z } from "zod";

export const createNotificationSchema = z.object({
  recipientType: z.enum(["CUSTOMER", "EMPLOYEE"]),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  employeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  channel: z.enum(["EMAIL", "DASHBOARD", "WHATSAPP", "SMS"]),
  notificationType: z.enum(["ORDER_CONFIRMATION", "ORDER_STATUS", "PAYMENT", "SHIPMENT", "SYSTEM"]),
  title: z.string().trim().min(1, "must not be empty"),
  body: z.string().trim().min(1, "must not be empty"),
  status: z.enum(["PENDING", "SENT", "FAILED", "READ", "CANCELED"]).optional(),
  idempotencyKey: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sentAt: z.coerce.date().optional().nullable(),
  readAt: z.coerce.date().optional().nullable(),
  metadata: z.unknown().optional().nullable(),
});

export const updateNotificationSchema = z.object({
  recipientType: z.enum(["CUSTOMER", "EMPLOYEE"]).optional(),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  employeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  channel: z.enum(["EMAIL", "DASHBOARD", "WHATSAPP", "SMS"]).optional(),
  notificationType: z.enum(["ORDER_CONFIRMATION", "ORDER_STATUS", "PAYMENT", "SHIPMENT", "SYSTEM"]).optional(),
  title: z.string().trim().min(1, "must not be empty").optional(),
  body: z.string().trim().min(1, "must not be empty").optional(),
  status: z.enum(["PENDING", "SENT", "FAILED", "READ", "CANCELED"]).optional(),
  idempotencyKey: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sentAt: z.coerce.date().optional().nullable(),
  readAt: z.coerce.date().optional().nullable(),
  metadata: z.unknown().optional().nullable(),
});

export const notificationIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listNotificationQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "recipientType", "customerId", "employeeId", "channel", "notificationType", "title", "body", "status", "idempotencyKey", "sentAt", "readAt", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type IUpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type INotificationIdParam = z.infer<typeof notificationIdParamSchema>;
export type IListNotificationQuery = z.infer<typeof listNotificationQuerySchema>;
