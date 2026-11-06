import type { ERole, Prisma } from "@prisma/client";

export interface ICreateAuditLogInput {
  action: string;
  entity: string;
  entityId?: string | null;
  userId?: string | null;
  details?: Prisma.InputJsonValue | null;
}

export interface IAuditLogUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface IAuditLogResponse {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: Prisma.JsonValue | null;
  createdAt: Date;
  user: IAuditLogUser | null;
}
