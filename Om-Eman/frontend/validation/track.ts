import { z } from "zod";
import { decimalStringSchema } from "./checkout";

export const TRACKING_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,64}$/;

export const trackingTokenSchema = z
  .string()
  .regex(TRACKING_TOKEN_PATTERN, "tracking token is invalid");

const trackedOrderItemSchema = z.object({
  productNameAr: z.string().min(1),
  sku: z.string().min(1),
  quantity: decimalStringSchema,
  lineTotal: decimalStringSchema,
});

export const trackedOrderSchema = z.object({
  orderNumber: z.string().min(1),
  status: z.enum([
    "RECEIVED",
    "CONFIRMED",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "CANCELED",
    "FAILED_DELIVERY",
  ]),
  paymentStatus: z.enum([
    "PENDING",
    "PROOF_UPLOADED",
    "CONFIRMED",
    "REJECTED",
    "CANCELED",
  ]),
  placedAt: z.string().datetime(),
  deliveredAt: z.string().datetime().nullable(),
  etaMinDays: z.number().int().nonnegative().nullable(),
  etaMaxDays: z.number().int().nonnegative().nullable(),
  items: z.array(trackedOrderItemSchema),
});

export type TTrackedOrder = z.infer<typeof trackedOrderSchema>;
