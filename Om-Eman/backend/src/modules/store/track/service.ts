import { prisma } from "../../../config/prisma.js";
import { NotFoundError } from "../../../shared/errors.js";
import type { ITrackedOrder } from "./types.js";

// Tracking returns the minimum needed to reassure the customer about the
// order. It must never leak customer identity, address, or phone: the
// trackingToken is a capability anyone holding the link can use.
export class StoreTrackService {
  async track(trackingToken: string): Promise<ITrackedOrder> {
    const order = await prisma.order.findUnique({
      where: { trackingToken },
      select: {
        orderNumber: true,
        status: true,
        paymentStatus: true,
        placedAt: true,
        deliveredAt: true,
        shipments: {
          select: { etaMinDays: true, etaMaxDays: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        items: {
          select: {
            productNameArSnapshot: true,
            skuSnapshot: true,
            quantity: true,
            lineTotal: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      placedAt: order.placedAt,
      deliveredAt: order.deliveredAt,
      etaMinDays: order.shipments[0]?.etaMinDays ?? null,
      etaMaxDays: order.shipments[0]?.etaMaxDays ?? null,
      items: order.items.map((item) => ({
        productNameAr: item.productNameArSnapshot,
        sku: item.skuSnapshot,
        quantity: item.quantity.toString(),
        lineTotal: item.lineTotal.toString(),
      })),
    };
  }
}
