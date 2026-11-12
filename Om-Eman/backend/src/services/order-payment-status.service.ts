import {
  EOrderStatus,
  EPaymentStatus,
  Prisma,
} from "@prisma/client";
import {
  ConflictError,
  NotFoundError,
} from "../shared/errors.js";
import {
  allocateDocumentNumber,
} from "./document-number.service.js";
import type { ITransactionClient } from "./document-number.service.js";
import { prisma } from "../config/prisma.js";
import { generateOpaqueToken } from "../utils/secure-token.js";

// ---------------------------------------------------------------------------
// Order.paymentStatus derivation
// ---------------------------------------------------------------------------

// Rules (source of truth = Payment rows; Order.paymentStatus is only a cache):
//   - CANCELED payments are ignored entirely (they never happened).
//   - No eligible payments            -> PENDING (fresh order).
//   - Any CONFIRMED                   -> CONFIRMED.
//   - Any PROOF_UPLOADED              -> PROOF_UPLOADED (waiting for review).
//   - Any PENDING                     -> PENDING.
//   - Otherwise (all REJECTED)        -> REJECTED.
// CONFIRMED wins over everything because a single verified payment settles the
// order regardless of older rejected attempts.
export function deriveOrderPaymentStatus(
  statuses: EPaymentStatus[],
): EPaymentStatus {
  const eligible = statuses.filter((status) => status !== "CANCELED");
  if (eligible.length === 0) return EPaymentStatus.PENDING;
  if (eligible.includes(EPaymentStatus.CONFIRMED)) {
    return EPaymentStatus.CONFIRMED;
  }
  if (eligible.includes(EPaymentStatus.PROOF_UPLOADED)) {
    return EPaymentStatus.PROOF_UPLOADED;
  }
  if (eligible.includes(EPaymentStatus.PENDING)) {
    return EPaymentStatus.PENDING;
  }
  return EPaymentStatus.REJECTED;
}

// Recomputes and persists the cached paymentStatus for one order. Call this
// after every Payment create/update. Idempotent and safe to call often.
export async function refreshOrderPaymentStatus(
  orderId: string,
  tx?: ITransactionClient,
): Promise<EPaymentStatus> {
  const client = tx ?? prisma;
  const order = await client.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      payments: { select: { status: true } },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
  }

  const nextStatus = deriveOrderPaymentStatus(
    order.payments.map((payment) => payment.status),
  );

  await client.order.update({
    where: { id: orderId },
    data: { paymentStatus: nextStatus },
  });

  return nextStatus;
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

export interface IMarkOrderDeliveredInput {
  orderId: string;
  changedByEmployeeId?: string;
  notes?: string;
}

const DELIVERED_ALLOWED_FROM: EOrderStatus[] = [
  EOrderStatus.SHIPPED,
  EOrderStatus.FAILED_DELIVERY,
];

// Marks an order DELIVERED and updates the cached customer statistics in the
// SAME transaction, so a crash between the two writes is impossible.
//
// Edge cases:
//   - Order canceled after DELIVERED: cancellations never happen from DELIVERED
//     in this service; if a manual correction is ever required, run
//     recalculateCustomerStats afterwards (see customer-stats.service.ts).
//   - Amount corrected on a delivered order: same answer, recalculate.
export async function markOrderDelivered(
  input: IMarkOrderDeliveredInput,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        status: true,
        customerId: true,
        grandTotal: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }
    if (order.status === EOrderStatus.DELIVERED) {
      // Idempotent: re-marking a delivered order is a no-op.
      return;
    }
    if (!DELIVERED_ALLOWED_FROM.includes(order.status)) {
      throw new ConflictError(
        `Order in status ${order.status} cannot be marked DELIVERED`,
        "ORDER_INVALID_STATUS_TRANSITION",
      );
    }

    const now = new Date();

    await tx.order.update({
      where: { id: order.id },
      data: { status: EOrderStatus.DELIVERED, deliveredAt: now },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: EOrderStatus.DELIVERED,
        changedByEmployeeId: input.changedByEmployeeId ?? null,
        notes: input.notes ?? null,
      },
    });

    const customer = await tx.customer.findUnique({
      where: { id: order.customerId },
      select: { firstOrderAt: true },
    });

    await tx.customer.update({
      where: { id: order.customerId },
      data: {
        completedOrdersCount: { increment: 1 },
        totalSpent: { increment: order.grandTotal },
        firstOrderAt: customer?.firstOrderAt ?? now,
        lastOrderAt: now,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// Order creation helper shared by guest and logged-in checkout
// ---------------------------------------------------------------------------

export interface ICreateOrderRecordInput {
  customerId: string;
  subtotal: Prisma.Decimal;
  discountTotal: Prisma.Decimal;
  shippingTotal: Prisma.Decimal;
  taxTotal: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  customerNotes?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

// Creates the Order row (number + tracking token included) inside the caller's
// transaction. The tracking token is returned once; store it on the response.
export async function createOrderRecord(
  tx: ITransactionClient,
  input: ICreateOrderRecordInput,
): Promise<{ orderId: string; orderNumber: string; trackingToken: string }> {
  const orderNumber = await allocateDocumentNumber(tx, {
    documentType: "ORDER",
    prefix: "ORD",
  });

  const trackingToken = generateOpaqueToken();

  const order = await tx.order.create({
    data: {
      orderNumber,
      trackingToken,
      customerId: input.customerId,
      status: EOrderStatus.RECEIVED,
      paymentStatus: EPaymentStatus.PENDING,
      subtotal: input.subtotal,
      discountTotal: input.discountTotal,
      shippingTotal: input.shippingTotal,
      taxTotal: input.taxTotal,
      grandTotal: input.grandTotal,
      customerNotes: input.customerNotes ?? null,
      clientIp: input.clientIp ?? null,
      clientUserAgent: input.clientUserAgent ?? null,
    },
    select: { id: true },
  });

  return { orderId: order.id, orderNumber, trackingToken };
}
