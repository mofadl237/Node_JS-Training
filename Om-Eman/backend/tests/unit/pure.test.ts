import { describe, expect, it } from "vitest";
import { deriveOrderPaymentStatus } from "../../src/services/order-payment-status.service.js";
import { normalizePhone } from "../../src/utils/phone.js";
import { generateOpaqueToken, hashToken } from "../../src/utils/secure-token.js";
import { EPaymentStatus } from "@prisma/client";

describe("deriveOrderPaymentStatus", () => {
  it("PENDING when there are no payments", () => {
    expect(deriveOrderPaymentStatus([])).toBe(EPaymentStatus.PENDING);
  });

  it("PENDING when every payment was CANCELED", () => {
    expect(deriveOrderPaymentStatus([EPaymentStatus.CANCELED])).toBe(
      EPaymentStatus.PENDING,
    );
  });

  it("CONFIRMED wins over older rejected attempts", () => {
    expect(
      deriveOrderPaymentStatus([
        EPaymentStatus.REJECTED,
        EPaymentStatus.CONFIRMED,
      ]),
    ).toBe(EPaymentStatus.CONFIRMED);
  });

  it("PROOF_UPLOADED while a proof awaits review", () => {
    expect(deriveOrderPaymentStatus([EPaymentStatus.PROOF_UPLOADED])).toBe(
      EPaymentStatus.PROOF_UPLOADED,
    );
  });

  it("PENDING when pending coexists with rejected", () => {
    expect(
      deriveOrderPaymentStatus([
        EPaymentStatus.REJECTED,
        EPaymentStatus.PENDING,
      ]),
    ).toBe(EPaymentStatus.PENDING);
  });

  it("REJECTED only when all eligible payments are rejected", () => {
    expect(deriveOrderPaymentStatus([EPaymentStatus.REJECTED])).toBe(
      EPaymentStatus.REJECTED,
    );
  });
});

describe("normalizePhone", () => {
  it("strips spaces, dashes and parentheses", () => {
    expect(normalizePhone("010 1234-5678")).toBe("01012345678");
    expect(normalizePhone("(010) 1234 5678")).toBe("01012345678");
  });

  it("rejects garbage", () => {
    expect(() => normalizePhone("not-a-phone")).toThrow();
    expect(() => normalizePhone("12")).toThrow();
  });
});

describe("secure tokens", () => {
  it("tokens are 256-bit and unique", () => {
    const seen = new Set(Array.from({ length: 100 }, () => generateOpaqueToken()));
    expect(seen.size).toBe(100);
    expect(generateOpaqueToken().length).toBeGreaterThanOrEqual(40);
  });

  it("hash is deterministic and does not contain the raw token", () => {
    const token = generateOpaqueToken();
    const hash = hashToken(token);
    expect(hash).toBe(hashToken(token));
    expect(hash).not.toContain(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
