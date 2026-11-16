import { z } from "zod";

// Which Cloudinary folder the asset belongs to. The folder is decided on the
// SERVER from this key - the frontend never picks paths.
export const UPLOAD_KINDS = ["product", "category", "banner"] as const;
export type TUploadKind = (typeof UPLOAD_KINDS)[number];

export const uploadSignSchema = z.object({
  kind: z.enum(UPLOAD_KINDS, {
    message: "kind must be product, category or banner",
  }),
});

export const proofSignSchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  // The tracking token proves the requester owns the order (same rule as the
  // proof upload itself).
  trackingToken: z
    .string()
    .regex(/^[A-Za-z0-9_-]{43,64}$/, "tracking token is invalid"),
});

export type IUploadSignInput = z.infer<typeof uploadSignSchema>;
export type IProofSignInput = z.infer<typeof proofSignSchema>;

export interface IUploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  // The browser POSTs the file here directly - the backend never touches it.
  uploadUrl: string;
}
