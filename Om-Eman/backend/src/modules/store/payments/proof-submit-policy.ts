import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from "@prisma/client";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  type AppError,
} from "../../../shared/errors.js";
import { isProofImageUrl } from "../../../shared/proof-image.js";
import { tokensMatch } from "../../../utils/secure-token.js";

export interface IProofSubmitInputData {
  orderId: string;
  trackingToken: string;
  proofImageUrl: string;
}

export interface IProofSubmitOrder {
  id: string;
  status: EOrderStatus;
  customerId: string;
  trackingToken: string;
  payments: Array<{
    id: string;
    method: EPaymentMethod;
    status: EPaymentStatus;
  }>;
}

export interface IProofSubmitContext {
  customerId?: string | null;
  cloudName: string;
}

export interface IProofSubmitDenial {
  error: AppError;
  reason: string;
}

export type TProofSubmitDecision =
  | { ok: true; mode: "update"; paymentId: string }
  | { ok: true; mode: "create" }
  | { ok: false; denial: IProofSubmitDenial };

function deny(error: AppError): TProofSubmitDecision {
  return { ok: false, denial: { error, reason: error.code } };
}

export function evaluateProofSubmit(
  input: IProofSubmitInputData,
  order: IProofSubmitOrder | null,
  context: IProofSubmitContext,
): TProofSubmitDecision {
  if (!order) {
    return deny(new NotFoundError("Order not found", "ORDER_NOT_FOUND"));
  }

  const ownsByToken = tokensMatch(input.trackingToken, order.trackingToken);
  const ownsBySession = Boolean(
    context.customerId && context.customerId === order.customerId,
  );
  if (!ownsByToken && !ownsBySession) {
    return deny(
      new BadRequestError(
        "You do not have access to this order",
        "ORDER_ACCESS_DENIED",
      ),
    );
  }

  if (
    order.status === EOrderStatus.CANCELED ||
    order.status === EOrderStatus.FAILED_DELIVERY
  ) {
    return deny(
      new BadRequestError(
        "This order can no longer accept payment proof",
        "ORDER_INVALID_STATUS",
      ),
    );
  }

  const lastPayment = order.payments[0];
  if (!lastPayment || lastPayment.method !== EPaymentMethod.ONLINE_TRANSFER) {
    return deny(
      new BadRequestError(
        "This order does not require a transfer proof",
        "PAYMENT_METHOD_NOT_ONLINE",
      ),
    );
  }

  if (lastPayment.status === EPaymentStatus.CONFIRMED) {
    return deny(
      new BadRequestError(
        "This order is already paid",
        "PAYMENT_ALREADY_CONFIRMED",
      ),
    );
  }

  if (lastPayment.status === EPaymentStatus.PROOF_UPLOADED) {
    return deny(
      new ConflictError(
        "A payment proof is already under review",
        "PAYMENT_UNDER_REVIEW",
      ),
    );
  }

  if (
    lastPayment.status !== EPaymentStatus.PENDING &&
    lastPayment.status !== EPaymentStatus.REJECTED
  ) {
    return deny(
      new BadRequestError(
        "This payment cannot accept a new proof",
        "PAYMENT_INVALID_STATUS",
      ),
    );
  }

  if (
    !isProofImageUrl(
      input.proofImageUrl,
      context.cloudName,
      order.id,
      input.trackingToken,
    )
  ) {
    return deny(
      new BadRequestError(
        "The proof image is not linked to this order",
        "PROOF_IMAGE_URL_INVALID",
      ),
    );
  }

  return lastPayment.status === EPaymentStatus.PENDING
    ? { ok: true, mode: "update", paymentId: lastPayment.id }
    : { ok: true, mode: "create" };
}
