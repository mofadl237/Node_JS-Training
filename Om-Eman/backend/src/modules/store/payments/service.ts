import { EPaymentMethod, EPaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import { BadRequestError, NotFoundError } from "../../../shared/errors.js";
import { refreshOrderPaymentStatus } from "../../../services/order-payment-status.service.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";

export class StorePaymentService {
  // A customer (or a guest holding the tracking token) uploads the transfer
  // proof. Ownership check: the tracking token must match the order, or the
  // authenticated customer must own the order. Creating a second proof row
  // while one is under review is allowed only after a rejection.
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
    const order = await prisma.order.findUnique({
      where: { id: dto.orderId },
      select: {
        id: true,
        customerId: true,
        trackingToken: true,
        payments: {
          select: { id: true, method: true, status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }

    const ownsByToken = order.trackingToken === dto.trackingToken;
    const ownsBySession = req.customer?.id === order.customerId;
    if (!ownsByToken && !ownsBySession) {
      throw new BadRequestError(
        "You do not have access to this order",
        "ORDER_ACCESS_DENIED",
      );
    }

    const lastPayment = order.payments[0];
    const lastStatus = lastPayment?.status;
    if (lastStatus === EPaymentStatus.CONFIRMED) {
      throw new BadRequestError(
        "This order is already paid",
        "PAYMENT_ALREADY_CONFIRMED",
      );
    }
    if (lastStatus === EPaymentStatus.PROOF_UPLOADED) {
      throw new BadRequestError(
        "A payment proof is already under review",
        "PAYMENT_UNDER_REVIEW",
      );
    }
    // COD orders are settled with the courier, not with a transfer proof.
    if (lastPayment?.method === EPaymentMethod.COD) {
      throw new BadRequestError(
        "This order is cash on delivery; no transfer proof is needed",
        "PAYMENT_METHOD_NOT_ONLINE",
      );
    }

    const proofData = {
      amount: dto.amount,
      proofImageUrl: dto.proofImageUrl,
      proofUploadedAt: new Date(),
      transactionReference: dto.transactionReference ?? null,
    } as const;

    // Checkout creates a pending ONLINE_TRANSFER payment row (B10). The first
    // proof fills that row instead of creating a second one; a new row is only
    // needed after an employee REJECTED the previous proof.
    const payment =
      lastPayment && lastStatus === EPaymentStatus.PENDING
        ? await prisma.payment.update({
            where: { id: lastPayment.id },
            data: { ...proofData, status: EPaymentStatus.PROOF_UPLOADED },
            select: { id: true },
          })
        : await prisma.payment.create({
            data: {
              orderId: order.id,
              method: EPaymentMethod.ONLINE_TRANSFER,
              status: EPaymentStatus.PROOF_UPLOADED,
              ...proofData,
            },
            select: { id: true },
          });

    const paymentStatus = await refreshOrderPaymentStatus(order.id);

    return { paymentId: payment.id, paymentStatus };
  }
}
