import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { BadRequestError, ForbiddenError } from "../../shared/errors.js";
import { prisma } from "../../config/prisma.js";
import { EPaymentMethod, EPaymentStatus } from "@prisma/client";
import type {
  IProofSignInput,
  IUploadSignature,
  TUploadKind,
} from "./validation.js";

// Signed direct uploads (Cloudinary, section 6.2 of the storefront tasks).
// The browser uploads straight to Cloudinary; this backend only mints a
// short-lived signature. The API_SECRET never leaves the server and the
// image bytes never pass through the API (no bandwidth, no multer).

const ALLOWED_FORMATS = "jpg,jpeg,png,webp";
const FOLDERS: Record<TUploadKind, string> = {
  product: "om-eman/products",
  category: "om-eman/categories",
  banner: "om-eman/banners",
};
const PROOF_FOLDER = "om-eman/proofs";

function requireConfiguration(): void {
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", env.CLOUDINARY_CLOUD_NAME],
    ["CLOUDINARY_API_KEY", env.CLOUDINARY_API_KEY],
    ["CLOUDINARY_API_SECRET", env.CLOUDINARY_API_SECRET],
  ].filter(([, value]) => !value);
  if (missing.length > 0) {
    throw new BadRequestError(
      `Image uploads are not configured (missing: ${missing.map(([key]) => key).join(", ")})`,
      "UPLOADS_NOT_CONFIGURED",
    );
  }
}

export interface ISignedUpload {
  folder: string;
  timestamp: number;
  signature: string;
}

function signUpload(folder: string): ISignedUpload {
  requireConfiguration();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder, allowed_formats: ALLOWED_FORMATS, timestamp },
    env.CLOUDINARY_API_SECRET,
  );
  return { folder, timestamp, signature };
}

function buildSignature(signed: ISignedUpload): IUploadSignature {
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp: signed.timestamp,
    signature: signed.signature,
    folder: signed.folder,
    allowedFormats: ALLOWED_FORMATS,
    uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
  };
}

export class UploadsService {
  // Employee uploads (dashboard forms).
  signCatalogAsset(kind: TUploadKind): IUploadSignature {
    return buildSignature(signUpload(FOLDERS[kind]));
  }

  // Payment-proof upload for a specific order. Ownership is proven with the
  // tracking token (same rule as the proof endpoint); the order must be an
  // online-transfer order that is not already confirmed.
  async signProof(
    input: IProofSignInput,
  ): Promise<IUploadSignature> {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        trackingToken: true,
        payments: {
          select: { method: true, status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order || order.trackingToken !== input.trackingToken) {
      throw new ForbiddenError(
        "You do not have access to this order",
        "ORDER_ACCESS_DENIED",
      );
    }

    const lastPayment = order.payments[0];
    if (lastPayment?.method === EPaymentMethod.COD) {
      throw new BadRequestError(
        "This order is cash on delivery; no transfer proof is needed",
        "PAYMENT_METHOD_NOT_ONLINE",
      );
    }
    if (lastPayment?.status === EPaymentStatus.CONFIRMED) {
      throw new BadRequestError(
        "This order is already paid",
        "PAYMENT_ALREADY_CONFIRMED",
      );
    }

    return buildSignature(signUpload(PROOF_FOLDER));
  }
}
