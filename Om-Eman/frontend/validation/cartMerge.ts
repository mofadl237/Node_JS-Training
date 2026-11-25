import { z } from "zod";

export const GUEST_TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

export const mergeCartSchema = z.object({
  guestToken: z.string().regex(GUEST_TOKEN_PATTERN, "guest token is invalid"),
});

export const mergeCartResultSchema = z.object({
  mergedCartId: z.string().min(1).nullable(),
});

export type TMergeCartPayload = z.infer<typeof mergeCartSchema>;
