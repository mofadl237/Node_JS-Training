import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from "@prisma/client";
import {
  BadRequestError,
  ForbiddenError,
  type AppError,
} from "../../shared/errors.js";
import { tokensMatch } from "../../utils/secure-token.js";
import { buildProofFolder } from "../../shared/proof-image.js";

export interface IProofSignInputData {
  orderId: string;
  trackingToken: string;
}

export interface IProofSignOrder {
  id: string;
  status: EOrderStatus;
  trackingToken: string;
  payments: Array<{
    id: string;
    method: EPaymentMethod;
    status: EPaymentStatus;
  }>;
}

export interface IProofSignDenial {
  error: AppError;
  reason: string;
}

export type TProofSignDecision =
  | { ok: true; folder: string }
  | { ok: false; denial: IProofSignDenial };

function deny(error: AppError): TProofSignDecision {
  return { ok: false, denial: { error, reason: error.code } };
}

export function evaluateProofSign(
  input: IProofSignInputData,
  order: IProofSignOrder | null,
): TProofSignDecision {
  if (!order || !tokensMatch(input.trackingToken, order.trackingToken)) {
    return deny(
      new ForbiddenError(
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
      new BadRequestError(
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

  return { ok: true, folder: buildProofFolder(order.id, input.trackingToken) };
}

export function proofSignMissingOrder(): TProofSignDecision {
  return deny(
    new ForbiddenError(
      "You do not have access to this order",
      "ORDER_ACCESS_DENIED",
    ),
  );
}
