import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { AppError, BadRequestError, ForbiddenError } from "../../shared/errors.js";
import { prisma } from "../../config/prisma.js";
import type {
  IProofSignInput,
  IUploadSignature,
  TUploadKind,
} from "./validation.js";
import type { IProofAuditContext } from "../../services/proof-audit.service.js";
import { writeProofAudit } from "../../services/proof-audit.service.js";
import type { IProofSignOrder } from "./proof-sign-policy.js";
import {
  evaluateProofSign,
  proofSignMissingOrder,
} from "./proof-sign-policy.js";

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

  async signProof(
    input: IProofSignInput,
    context: IProofAuditContext = {},
  ): Promise<IUploadSignature> {
    let entityId: string | null = null;

    try {
      const signed = await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: input.orderId },
          select: {
            id: true,
            status: true,
            trackingToken: true,
            payments: {
              select: { id: true, method: true, status: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        }) as IProofSignOrder | null;
        entityId = order?.id ?? null;

        const decision = order
          ? evaluateProofSign(input, order)
          : proofSignMissingOrder();
        if (!decision.ok) throw decision.denial.error;
        if (!order) {
          throw new ForbiddenError(
            "You do not have access to this order",
            "ORDER_ACCESS_DENIED",
          );
        }

        const signature = signUpload(decision.folder);
        await writeProofAudit(tx, {
          action: "PROOF_SIGN_ISSUED",
          result: "SUCCESS",
          reason: "PROOF_SIGN_ISSUED",
          entityType: "Order",
          entityId: order.id,
          newValues: { folder: decision.folder },
          ...context,
        });
        return signature;
      });

      return buildSignature(signed);
    } catch (error) {
      if (error instanceof AppError) {
        await this.writeDeniedAudit(context, error, entityId);
      }
      throw error;
    }
  }

  private async writeDeniedAudit(
    context: IProofAuditContext,
    error: AppError,
    entityId: string | null,
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await writeProofAudit(tx, {
          action: "PROOF_SIGN_DENIED",
          result: "DENIED",
          reason: error.code,
          entityType: "Order",
          entityId,
          ...context,
        });
      });
    } catch {
      return;
    }
  }
}
