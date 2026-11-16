import { z, type ZodSchema } from "zod";
import { env } from "../config/env.js";
import { EEnvironment } from "../enums/EEnvironment.js";

// Image columns store plain URLs pointing at our Cloudinary cloud. Because the
// payment-proof endpoint is public and its URL is rendered inside the employee
// dashboard, every accepted image URL must point at res.cloudinary.com under
// this store's cloud name - no arbitrary external hosts.
const CLOUDINARY_HOST = "res.cloudinary.com";
const URL_MAX_LENGTH = 500;

function parseCloudinaryUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== CLOUDINARY_HOST) {
    return null;
  }
  // Path form: /<cloudName>/image/upload/<transformations>/<publicId>.<ext>
  const segments = url.pathname.split("/").filter(Boolean);
  const [cloudName, kind, upload] = segments;
  if (cloudName !== env.CLOUDINARY_CLOUD_NAME) return null;
  if (kind !== "image" || upload !== "upload") return null;
  return url;
}

function requireCloudinaryConfiguration(_value: string, ctx: z.RefinementCtx): void {
  ctx.addIssue({
    code: "custom",
    message:
      "Image uploads are not configured on the server (CLOUDINARY_CLOUD_NAME is missing)",
  });
}

function isConfiguredCloudinaryUrl(value: string): boolean {
  return parseCloudinaryUrl(value) !== null;
}

export function isCloudinaryUrl(value: string): boolean {
  if (!env.CLOUDINARY_CLOUD_NAME) return false;
  return isConfiguredCloudinaryUrl(value);
}

// Development fallback: without a configured cloud, accept any https URL so
// local work is not blocked. Production must fail loudly instead of accepting
// arbitrary hosts.
function buildBaseSchema(): ZodSchema {
  const base = z
    .string("image URL is required")
    .trim()
    .min(1, "image URL is required")
    .max(URL_MAX_LENGTH, "image URL must not exceed 500 characters")
    .url("must be a valid https URL");

  if (!env.CLOUDINARY_CLOUD_NAME) {
    if (env.NODE_ENV === EEnvironment.PRODUCTION) {
      return base.superRefine(requireCloudinaryConfiguration);
    }
    return base;
  }

  return base.refine(isConfiguredCloudinaryUrl, {
    message: "image URL must be a Cloudinary upload URL for this store",
  });
}

export const cloudinaryUrlSchema = buildBaseSchema();

export const cloudinaryUrlSchemaOptional = cloudinaryUrlSchema
  .optional()
  .nullable();
