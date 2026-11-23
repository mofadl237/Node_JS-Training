import { hashToken } from "../utils/secure-token.js";

const PROOF_FOLDER = "om-eman/proofs";
const PROOF_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const PUBLIC_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const VERSION_PATTERN = /^v\d+$/;
const URL_MAX_LENGTH = 500;

export function buildProofFolder(orderId: string, trackingToken: string): string {
  return `${PROOF_FOLDER}/${hashToken(`${orderId}:${trackingToken}`)}`;
}

export function isProofImageUrl(
  raw: string,
  cloudName: string,
  orderId: string,
  trackingToken: string,
): boolean {
  if (!cloudName || raw.length > URL_MAX_LENGTH) return false;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "res.cloudinary.com" ||
    url.port ||
    url.search ||
    url.hash
  ) {
    return false;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== cloudName || segments[1] !== "image" || segments[2] !== "upload") {
    return false;
  }

  let parts = segments.slice(3);
  if (parts[0] && VERSION_PATTERN.test(parts[0])) {
    parts = parts.slice(1);
  }

  const expected = ["om-eman", "proofs", hashToken(`${orderId}:${trackingToken}`)];
  if (parts.length !== expected.length + 1) return false;
  if (!expected.every((part, index) => parts[index] === part)) return false;

  const fileName = parts[expected.length];
  if (!fileName) return false;

  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0) return false;

  const publicId = fileName.slice(0, lastDot);
  const extension = fileName.slice(lastDot + 1).toLowerCase();
  return PUBLIC_ID_PATTERN.test(publicId) && PROOF_EXTENSIONS.has(extension);
}
