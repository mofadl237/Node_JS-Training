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
          select: { status: true },
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

    const lastStatus = order.payments[0]?.status;
    if (lastStatus === EPaymentStatus.CONFIRMED) {
      throw new BadRequestError(
        "This order is already paid",
        "PAYMENT_ALREADY_CONFIRMED",
      );
    }
    if (
      lastStatus === EPaymentStatus.PROOF_UPLOADED ||
      lastStatus === EPaymentStatus.PENDING
    ) {
      throw new BadRequestError(
        "A payment proof is already under review",
        "PAYMENT_UNDER_REVIEW",
      );
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        method: EPaymentMethod.ONLINE_TRANSFER,
        status: EPaymentStatus.PROOF_UPLOADED,
        amount: dto.amount,
        proofImageUrl: dto.proofImageUrl,
        proofUploadedAt: new Date(),
        transactionReference: dto.transactionReference ?? null,
      },
      select: { id: true },
    });

    const paymentStatus = await refreshOrderPaymentStatus(order.id);

    return { paymentId: payment.id, paymentStatus };
  }
}
