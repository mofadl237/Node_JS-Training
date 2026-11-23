import type { EAuditResult, Prisma } from "@prisma/client";
import type { ITransactionClient } from "./document-number.service.js";

export type TProofAuditAction =
  | "PROOF_SIGN_ISSUED"
  | "PROOF_SIGN_DENIED"
  | "PROOF_SUBMITTED"
  | "PROOF_SUBMISSION_DENIED";

export interface IProofAuditContext {
  actorCustomerId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface IProofAuditEvent extends IProofAuditContext {
  action: TProofAuditAction;
  result: EAuditResult;
  reason: string;
  entityType: "Order" | "Payment";
  entityId: string | null;
  newValues?: Prisma.InputJsonValue;
}

export async function writeProofAudit(
  tx: ITransactionClient,
  event: IProofAuditEvent,
): Promise<void> {
  await tx.auditLog.create({
    data: {
      actorCustomerId: event.actorCustomerId ?? null,
      action: event.action,
      module: "payments",
      entityType: event.entityType,
      entityId: event.entityId,
      result: event.result,
      reason: event.reason,
      ...(event.newValues ? { newValues: event.newValues } : {}),
      ipAddress: event.ipAddress ?? null,
      userAgent: event.userAgent ?? null,
    },
  });
}
