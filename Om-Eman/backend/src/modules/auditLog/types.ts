import type { EAuditResult, Prisma } from "@prisma/client";
export type {
  ICreateAuditLogInput,
  IListAuditLogQuery,
  IUpdateAuditLogInput,
} from "./validation.js";

export interface IAuditLogResponse {
  id: string;
  actorEmployeeId: string | null;
  actorCustomerId: string | null;
  action: string;
  module: string;
  entityType: string | null;
  entityId: string | null;
  result: EAuditResult;
  reason: string | null;
  oldValues: Prisma.JsonValue | null;
  newValues: Prisma.JsonValue | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}
