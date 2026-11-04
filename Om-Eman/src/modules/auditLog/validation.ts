import { z } from "zod";

export const createAuditLogSchema = z.object({
  actorEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  actorCustomerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  action: z.string().trim().min(1, "must not be empty"),
  module: z.string().trim().min(1, "must not be empty"),
  entityType: z.string().trim().min(1, "must not be empty").optional().nullable(),
  entityId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  result: z.enum(["SUCCESS", "FAILURE", "DENIED"]).optional(),
  reason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  oldValues: z.unknown().optional().nullable(),
  newValues: z.unknown().optional().nullable(),
  ipAddress: z.string().trim().min(1, "must not be empty").optional().nullable(),
  userAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateAuditLogSchema = z.object({
  actorEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  actorCustomerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  action: z.string().trim().min(1, "must not be empty").optional(),
  module: z.string().trim().min(1, "must not be empty").optional(),
  entityType: z.string().trim().min(1, "must not be empty").optional().nullable(),
  entityId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  result: z.enum(["SUCCESS", "FAILURE", "DENIED"]).optional(),
  reason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  oldValues: z.unknown().optional().nullable(),
  newValues: z.unknown().optional().nullable(),
  ipAddress: z.string().trim().min(1, "must not be empty").optional().nullable(),
  userAgent: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const auditLogIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listAuditLogQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "actorEmployeeId", "actorCustomerId", "action", "module", "entityType", "entityId", "result", "reason", "ipAddress", "userAgent", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateAuditLogInput = z.infer<typeof createAuditLogSchema>;
export type IUpdateAuditLogInput = z.infer<typeof updateAuditLogSchema>;
export type IAuditLogIdParam = z.infer<typeof auditLogIdParamSchema>;
export type IListAuditLogQuery = z.infer<typeof listAuditLogQuerySchema>;
