import { z } from "zod";
import { cloudinaryUrlSchema } from "../../../shared/cloudinary-url.js";

export const paymentProofSchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  // The tracking token proves the submitter owns this order. For guests it is
  // the only credential; for logged-in customers it still prevents guessing
  // an order id.
  trackingToken: z
    .string()
    .regex(/^[A-Za-z0-9_-]{43,64}$/, "tracking token is invalid"),
  method: z.literal("ONLINE_TRANSFER"),
  // The amount the customer actually transferred. The employee verifies it
  // against the order grandTotal at confirmation.
  amount: z.number().positive().max(1000000),
  proofImageUrl: cloudinaryUrlSchema,
  transactionReference: z.string().trim().max(100).optional(),
});
