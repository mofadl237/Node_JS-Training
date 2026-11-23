"use client";

import { z } from "zod";
import type { IUploadSignature } from "@/interface";

const MAX_PROOF_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const MIME_TYPES_BY_FORMAT: Record<string, readonly string[]> = {
  jpg: ["image/jpeg", "image/jpg"],
  jpeg: ["image/jpeg", "image/jpg"],
  png: ["image/png"],
  webp: ["image/webp"],
};

const cloudinaryUploadResponseSchema = z.object({
  secure_url: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://res.cloudinary.com/"), "invalid secure URL")
    .optional(),
});

export interface IProofUploadInput {
  file: File;
  signature: IUploadSignature;
}

export type TProofUploadResult =
  | { ok: true; secureUrl: string }
  | { ok: false; errorKey: string };

const getFileExtension = (name: string): string => {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop() ?? "").toLowerCase() : "";
};

const validateProofFile = (file: File, allowedFormats: string): string | null => {
  const extension = getFileExtension(file.name);
  const formats = allowedFormats
    .split(",")
    .map((format) => format.trim().toLowerCase())
    .filter(Boolean);

  if (!extension || !formats.includes(extension)) return "payment.errors.invalidFormat";
  if (!MIME_TYPES_BY_FORMAT[extension]?.includes(file.type)) {
    return "payment.errors.invalidFormat";
  }
  if (file.size === 0) return "payment.errors.invalidFormat";
  if (file.size > MAX_PROOF_FILE_SIZE_BYTES) return "payment.errors.fileTooLarge";
  return null;
};

const isValidUploadUrl = (signature: IUploadSignature): boolean =>
  signature.uploadUrl ===
  `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;

export const uploadProofImage = async ({
  file,
  signature,
}: IProofUploadInput): Promise<TProofUploadResult> => {
  const validationError = validateProofFile(file, signature.allowedFormats);
  if (validationError) return { ok: false, errorKey: validationError };
  if (!isValidUploadUrl(signature)) {
    return { ok: false, errorKey: "payment.errors.uploadFailed" };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("allowed_formats", signature.allowedFormats);

  try {
    const response = await fetch(signature.uploadUrl, { method: "POST", body: formData });
    const payload: unknown = await response.json().catch(() => null);
    const parsed = cloudinaryUploadResponseSchema.safeParse(payload);

    if (!response.ok || !parsed.success || !parsed.data.secure_url) {
      return { ok: false, errorKey: "payment.errors.uploadFailed" };
    }
    return { ok: true, secureUrl: parsed.data.secure_url };
  } catch {
    return { ok: false, errorKey: "payment.errors.networkUnclear" };
  }
};
