import { z } from "zod";
import { orderTotalsSchema } from "./checkout";

const TRACKING_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,64}$/;

export const orderReceiptSchema = z.object({
  orderId: z.string().min(1),
  orderNumber: z.string().min(1),
  trackingToken: z.string().regex(TRACKING_TOKEN_PATTERN),
  paymentMethod: z.enum(["COD", "ONLINE_TRANSFER"]),
  paymentId: z.string().min(1),
  totals: orderTotalsSchema,
  storedAt: z.string().datetime(),
});

export type TOrderReceipt = z.infer<typeof orderReceiptSchema>;
