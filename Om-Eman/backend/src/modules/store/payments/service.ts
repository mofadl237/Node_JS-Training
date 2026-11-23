import { EPaymentMethod, EPaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/errors.js";
import { refreshOrderPaymentStatus } from "../../../services/order-payment-status.service.js";
import {
  writeProofAudit,
  type IProofAuditContext,
} from "../../../services/proof-audit.service.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import type { IProofSubmitOrder } from "./proof-submit-policy.js";
import { evaluateProofSubmit } from "./proof-submit-policy.js";

const SERIALIZABLE_ATTEMPTS = 2;

function isSerializationFailure(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
}

export class StorePaymentService {
  async submitProof(
    dto: {
      orderId: string;
      trackingToken: string;
      amount: number;
      proofImageUrl: string;
      transactionReference?: string;
    },
    req: ICustomerAuthRequest,
  ): Promise<{ paymentId: string; paymentStatus: EPaymentStatus }> {
    const context: IProofAuditContext = {
      actorCustomerId: req.customer?.id ?? null,
      ipAddress: req.ip ?? null,
      userAgent: req.get("user-agent") ?? null,
    };

    for (let attempt = 0; attempt < SERIALIZABLE_ATTEMPTS; attempt += 1) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const order = await tx.order.findUnique({
              where: { id: dto.orderId },
              select: {
                id: true,
                status: true,
                customerId: true,
                trackingToken: true,
                payments: {
                  select: { id: true, method: true, status: true },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            }) as IProofSubmitOrder | null;

            const decision = evaluateProofSubmit(
              dto,
              order,
              {
                customerId: context.actorCustomerId ?? null,
                cloudName: env.CLOUDINARY_CLOUD_NAME,
              },
            );
            if (!decision.ok) throw decision.denial.error;
            if (!order) {
              throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
            }

            const proofData = {
              amount: dto.amount,
              proofImageUrl: dto.proofImageUrl,
              proofUploadedAt: new Date(),
              transactionReference: dto.transactionReference ?? null,
            } as const;

            let paymentId: string;
            if (decision.mode === "update") {
              const updated = await tx.payment.updateMany({
                where: {
                  id: decision.paymentId,
                  method: EPaymentMethod.ONLINE_TRANSFER,
                  status: EPaymentStatus.PENDING,
                  proofImageUrl: null,
                },
                data: {
                  ...proofData,
                  status: EPaymentStatus.PROOF_UPLOADED,
                },
              });
              if (updated.count !== 1) {
                throw new ConflictError(
                  "A payment proof is already under review",
                  "PAYMENT_UNDER_REVIEW",
                );
              }
              paymentId = decision.paymentId;
            } else {
              const created = await tx.payment.create({
                data: {
                  orderId: order.id,
                  method: EPaymentMethod.ONLINE_TRANSFER,
                  status: EPaymentStatus.PROOF_UPLOADED,
                  ...proofData,
                },
                select: { id: true },
              });
              paymentId = created.id;
            }

            const paymentStatus = await refreshOrderPaymentStatus(order.id, tx);
            await writeProofAudit(tx, {
              action: "PROOF_SUBMITTED",
              result: "SUCCESS",
              reason: "PROOF_SUBMITTED",
              entityType: "Payment",
              entityId: paymentId,
              newValues: { paymentStatus },
              ...context,
            });

            return { paymentId, paymentStatus };
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (error) {
        if (isSerializationFailure(error) && attempt < SERIALIZABLE_ATTEMPTS - 1) {
          continue;
        }

        const resolvedError = isSerializationFailure(error)
          ? new ConflictError(
              "This payment proof was changed by another request",
              "PAYMENT_SUBMISSION_CONFLICT",
            )
          : error;
        if (resolvedError instanceof AppError) {
          await this.writeDeniedAudit(context, resolvedError, dto.orderId);
        }
        throw resolvedError;
      }
    }

    throw new ConflictError(
      "This payment proof was changed by another request",
      "PAYMENT_SUBMISSION_CONFLICT",
    );
  }

  private async writeDeniedAudit(
    context: IProofAuditContext,
    error: AppError,
    orderId: string,
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await writeProofAudit(tx, {
          action: "PROOF_SUBMISSION_DENIED",
          result: "DENIED",
          reason: error.code,
          entityType: "Order",
          entityId: orderId,
          ...context,
        });
      });
    } catch {
      return;
    }
  }
}
