import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// Default entropy: 32 bytes = 256 bits. Guessing a tracking or session token is
// computationally infeasible; nothing here may be replaced with a sequential id
// or a timestamp-based value.
const TOKEN_BYTE_LENGTH = 32;

export function generateOpaqueToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
}

// Only the SHA-256 hash may be persisted. The raw token is returned to the
// caller exactly once and never written to the database or to logs.
export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

// Constant-time comparison for tokens read back from user input.
export function tokensMatch(a: string, b: string): boolean {
  const hashA = Buffer.from(hashToken(a), "hex");
  const hashB = Buffer.from(hashToken(b), "hex");
  return hashA.length === hashB.length && timingSafeEqual(hashA, hashB);
}
