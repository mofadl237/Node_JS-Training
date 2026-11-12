import { prisma } from "../config/prisma.js";
import type { ITransactionClient } from "./document-number.service.js";

// ---------------------------------------------------------------------------
// Cached customer statistics
// ---------------------------------------------------------------------------

// Source of truth: Order rows with status = DELIVERED. The cached columns on
// Customer (completedOrdersCount, totalSpent, firstOrderAt, lastOrderAt) are
// updated inline by markOrderDelivered in the same transaction. Use this
// recalculation for corrections: an order canceled after delivery, a corrected
// grandTotal, a merge, or after restoring from a backup. It is idempotent.
export async function recalculateCustomerStats(
  customerId: string,
  tx?: ITransactionClient,
): Promise<void> {
  const client = tx ?? prisma;

  const aggregate = await client.order.aggregate({
    where: { customerId, status: "DELIVERED" },
    _count: { id: true },
    _sum: { grandTotal: true },
    _min: { deliveredAt: true },
    _max: { deliveredAt: true },
  });

  await client.customer.update({
    where: { id: customerId },
    data: {
      completedOrdersCount: aggregate._count.id,
      totalSpent: aggregate._sum.grandTotal ?? 0,
      firstOrderAt: aggregate._min.deliveredAt,
      lastOrderAt: aggregate._max.deliveredAt,
    },
  });
}

// Convenience wrapper for corrections outside an explicit transaction.
export async function recalculateCustomerStatsStandalone(
  customerId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await recalculateCustomerStats(customerId, tx);
  });
}
