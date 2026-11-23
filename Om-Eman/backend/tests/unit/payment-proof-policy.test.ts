import {
  EEmployeeRole,
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import paymentRouter from "../../src/modules/payment/router.js";
import { ForbiddenError } from "../../src/shared/errors.js";
import { buildProofFolder } from "../../src/shared/proof-image.js";
import { generateOpaqueToken } from "../../src/utils/secure-token.js";
import { evaluateProofSign, proofSignMissingOrder } from "../../src/modules/uploads/proof-sign-policy.js";
import { evaluateProofSubmit } from "../../src/modules/store/payments/proof-submit-policy.js";

const CLOUD_NAME = "proof-cloud";
const ORDER_ID = "order-1";
const TRACKING_TOKEN = generateOpaqueToken();
const OTHER_TOKEN = generateOpaqueToken();

function imageUrl(orderId = ORDER_ID, token = TRACKING_TOKEN): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v123/${buildProofFolder(orderId, token)}/proofimage123.jpg`;
}

function signOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: ORDER_ID,
    status: EOrderStatus.RECEIVED,
    trackingToken: TRACKING_TOKEN,
    payments: [
      {
        id: "payment-1",
        method: EPaymentMethod.ONLINE_TRANSFER,
        status: EPaymentStatus.PENDING,
      },
    ],
    ...overrides,
  };
}

function submitOrder(overrides: Record<string, unknown> = {}) {
  return {
    ...signOrder(),
    customerId: "customer-1",
    ...overrides,
  };
}

describe("proof sign policy", () => {
  it("rejects COD orders", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: TRACKING_TOKEN },
      signOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.COD,
            status: EPaymentStatus.PENDING,
          },
        ],
      }),
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PAYMENT_METHOD_NOT_ONLINE" },
    });
  });

  it("rejects an invalid tracking token", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: OTHER_TOKEN },
      signOrder(),
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "ORDER_ACCESS_DENIED" },
    });
  });

  it("rejects a missing order", () => {
    expect(proofSignMissingOrder()).toMatchObject({
      ok: false,
      denial: { reason: "ORDER_ACCESS_DENIED" },
    });
  });

  it("rejects a confirmed payment", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: TRACKING_TOKEN },
      signOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.ONLINE_TRANSFER,
            status: EPaymentStatus.CONFIRMED,
          },
        ],
      }),
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PAYMENT_ALREADY_CONFIRMED" },
    });
  });

  it("does not issue another signature for PROOF_UPLOADED", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: TRACKING_TOKEN },
      signOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.ONLINE_TRANSFER,
            status: EPaymentStatus.PROOF_UPLOADED,
          },
        ],
      }),
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PAYMENT_UNDER_REVIEW" },
    });
  });

  it("rejects a canceled order", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: TRACKING_TOKEN },
      signOrder({ status: EOrderStatus.CANCELED }),
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "ORDER_INVALID_STATUS" },
    });
  });

  it("issues an order-bound folder for a pending transfer", () => {
    const decision = evaluateProofSign(
      { orderId: ORDER_ID, trackingToken: TRACKING_TOKEN },
      signOrder(),
    );
    expect(decision).toEqual({
      ok: true,
      folder: buildProofFolder(ORDER_ID, TRACKING_TOKEN),
    });
  });
});

describe("proof submit policy", () => {
  it("rejects an image bound to another order", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl("order-2", TRACKING_TOKEN),
      },
      submitOrder(),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PROOF_IMAGE_URL_INVALID" },
    });
  });

  it("rejects an image bound to another tracking token", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(ORDER_ID, OTHER_TOKEN),
      },
      submitOrder(),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PROOF_IMAGE_URL_INVALID" },
    });
  });

  it("rejects an external host", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: `https://example.com/${buildProofFolder(ORDER_ID, TRACKING_TOKEN)}/proofimage123.jpg`,
      },
      submitOrder(),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PROOF_IMAGE_URL_INVALID" },
    });
  });

  it("rejects proof images when Cloudinary cloud name is missing", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder(),
      { customerId: null, cloudName: "" },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PROOF_IMAGE_URL_INVALID" },
    });
  });

  it("rejects an invalid tracking token", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: OTHER_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder(),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "ORDER_ACCESS_DENIED" },
    });
  });

  it("rejects a confirmed payment", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.ONLINE_TRANSFER,
            status: EPaymentStatus.CONFIRMED,
          },
        ],
      }),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PAYMENT_ALREADY_CONFIRMED" },
    });
  });

  it("rejects a payment already under review", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.ONLINE_TRANSFER,
            status: EPaymentStatus.PROOF_UPLOADED,
          },
        ],
      }),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "PAYMENT_UNDER_REVIEW" },
    });
  });

  it("accepts a pending transfer with a matching image", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder(),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toEqual({ ok: true, mode: "update", paymentId: "payment-1" });
  });

  it("allows a new row only after rejection", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      submitOrder({
        payments: [
          {
            id: "payment-1",
            method: EPaymentMethod.ONLINE_TRANSFER,
            status: EPaymentStatus.REJECTED,
          },
        ],
      }),
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toEqual({ ok: true, mode: "create" });
  });

  it("rejects a missing order", () => {
    const decision = evaluateProofSubmit(
      {
        orderId: ORDER_ID,
        trackingToken: TRACKING_TOKEN,
        proofImageUrl: imageUrl(),
      },
      null,
      { customerId: null, cloudName: CLOUD_NAME },
    );
    expect(decision).toMatchObject({
      ok: false,
      denial: { reason: "ORDER_NOT_FOUND" },
    });
  });
});

describe("employee payment retrieval role", () => {
  function expectStaffDenied(path: string): void {
    const layer = paymentRouter.stack.find(
      (item) => item.route?.path === path && item.route.methods.get,
    );
    const guard = layer?.route?.stack[1]?.handle as
      | ((req: unknown, res: unknown, next: unknown) => void)
      | undefined;
    const next = vi.fn();
    const req = {
      employee: {
        id: "employee-1",
        email: "staff@example.com",
        role: EEmployeeRole.STAFF,
      },
    };

    expect(guard).toBeTypeOf("function");
    expect(() => guard?.(req, {}, next)).toThrow(ForbiddenError);
    expect(next).not.toHaveBeenCalled();
  }

  it("denies STAFF on the payment list endpoint", () => {
    expectStaffDenied("/");
  });

  it("denies STAFF on the payment detail endpoint", () => {
    expectStaffDenied("/:id");
  });
});
