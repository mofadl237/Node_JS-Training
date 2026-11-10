import { z } from "zod";

export const createMarketingEventSchema = z.object({
  eventName: z.enum(["VIEW_CONTENT", "SEARCH", "ADD_TO_CART", "INITIATE_CHECKOUT", "PURCHASE"]),
  eventId: z.string().trim().min(1, "must not be empty"),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sessionId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  orderId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  value: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  contentIds: z.unknown().optional().nullable(),
  searchString: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbc: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientIp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientUserAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
  eventSourceUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  hashedUserData: z.unknown().optional().nullable(),
  status: z.enum(["PENDING", "SENT", "FAILED", "SKIPPED"]).optional(),
  attempts: z.coerce.number().int().optional(),
  lastError: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sentAt: z.coerce.date().optional().nullable(),
  occurredAt: z.coerce.date().optional(),
});

export const updateMarketingEventSchema = z.object({
  eventName: z.enum(["VIEW_CONTENT", "SEARCH", "ADD_TO_CART", "INITIATE_CHECKOUT", "PURCHASE"]).optional(),
  eventId: z.string().trim().min(1, "must not be empty").optional(),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sessionId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  orderId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  value: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  contentIds: z.unknown().optional().nullable(),
  searchString: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  fbc: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientIp: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clientUserAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
  eventSourceUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  hashedUserData: z.unknown().optional().nullable(),
  status: z.enum(["PENDING", "SENT", "FAILED", "SKIPPED"]).optional(),
  attempts: z.coerce.number().int().optional(),
  lastError: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sentAt: z.coerce.date().optional().nullable(),
  occurredAt: z.coerce.date().optional(),
});

export const marketingEventIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listMarketingEventQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "eventName", "eventId", "customerId", "sessionId", "orderId", "productId", "productPackageId", "value", "searchString", "fbp", "fbc", "clientIp", "clientUserAgent", "eventSourceUrl", "status", "attempts", "lastError", "sentAt", "occurredAt", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateMarketingEventInput = z.infer<typeof createMarketingEventSchema>;
export type IUpdateMarketingEventInput = z.infer<typeof updateMarketingEventSchema>;
export type IMarketingEventIdParam = z.infer<typeof marketingEventIdParamSchema>;
export type IListMarketingEventQuery = z.infer<typeof listMarketingEventQuerySchema>;
