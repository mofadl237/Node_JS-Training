import { z } from "zod";

const TRACKING_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,64}$/;

export const proofSignSchema = z.object({
  orderId: z.string().min(1),
  trackingToken: z
    .string()
    .regex(TRACKING_TOKEN_PATTERN, "tracking token is invalid"),
});

export const paymentProofSchema = z.object({
  orderId: z.string().min(1),
  trackingToken: z
    .string()
    .regex(TRACKING_TOKEN_PATTERN, "tracking token is invalid"),
  method: z.literal("ONLINE_TRANSFER"),
  amount: z.number().positive().max(1000000),
  proofImageUrl: z.string().trim().min(1).max(500).url(),
  transactionReference: z.string().trim().max(100).optional(),
});

export const uploadSignatureSchema = z.object({
  cloudName: z.string().min(1),
  apiKey: z.string().min(1),
  timestamp: z.number().int(),
  signature: z.string().min(1),
  folder: z.string().min(1),
  allowedFormats: z.string().min(1),
  uploadUrl: z.string().url(),
});

export const paymentProofResultSchema = z.object({
  paymentId: z.string().min(1),
  paymentStatus: z.enum([
    "PENDING",
    "PROOF_UPLOADED",
    "CONFIRMED",
    "REJECTED",
    "CANCELED",
  ]),
});

export type TProofSignPayload = z.infer<typeof proofSignSchema>;
export type TPaymentProofPayload = z.infer<typeof paymentProofSchema>;
