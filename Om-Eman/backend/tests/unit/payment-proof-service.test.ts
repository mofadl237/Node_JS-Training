import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
  Prisma,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ICustomerAuthRequest } from "../../src/middlewares/customer-auth.middleware.js";
import { buildProofFolder } from "../../src/shared/proof-image.js";
import { generateOpaqueToken } from "../../src/utils/secure-token.js";

process.env.CLOUDINARY_CLOUD_NAME = "proof-cloud";

const mockPrisma = vi.hoisted(() => ({
  order: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  payment: {
    updateMany: vi.fn(),
    create: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("../../src/config/prisma.js", () => ({ prisma: mockPrisma }));

const { StorePaymentService } = await import(
  "../../src/modules/store/payments/service.js"
);

const CLOUD_NAME = "proof-cloud";
const ORDER_ID = "order-1";
const TRACKING_TOKEN = generateOpaqueToken();
const IMAGE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v123/${buildProofFolder(ORDER_ID, TRACKING_TOKEN)}/proofimage123.jpg`;

const request = {
  customer: undefined,
  ip: undefined,
  get: () => undefined,
} as unknown as ICustomerAuthRequest;

const dto = {
  orderId: ORDER_ID,
  trackingToken: TRACKING_TOKEN,
  amount: 100,
  proofImageUrl: IMAGE_URL,
  method: "ONLINE_TRANSFER" as const,
};

function baseOrder(status: EPaymentStatus = EPaymentStatus.PENDING) {
  return {
    id: ORDER_ID,
    status: EOrderStatus.RECEIVED,
    customerId: "customer-1",
    trackingToken: TRACKING_TOKEN,
    payments: [
      {
        id: "payment-1",
        method: EPaymentMethod.ONLINE_TRANSFER,
        status,
      },
    ],
  };
}

describe("StorePaymentService.submitProof", () => {
  let tx: {
    order: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    payment: { updateMany: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
    auditLog: { create: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tx = {
      order: {
        findUnique: vi.fn().mockResolvedValue(baseOrder()),
        update: vi.fn().mockResolvedValue({}),
      },
      payment: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        create: vi.fn().mockResolvedValue({ id: "payment-2" }),
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({}),
      },
    };
    mockPrisma.$transaction.mockImplementation(
      async (callback: (client: unknown) => unknown) => callback(tx),
    );
  });

  it("stores a pending proof, refreshes status and audits without the token", async () => {
    let findCalls = 0;
    tx.order.findUnique.mockImplementation(async () => {
      findCalls += 1;
      return findCalls === 1
        ? baseOrder()
        : {
            ...baseOrder(),
            payments: [
              {
                id: "payment-1",
                method: EPaymentMethod.ONLINE_TRANSFER,
                status: EPaymentStatus.PROOF_UPLOADED,
              },
            ],
          };
    });

    const result = await new StorePaymentService().submitProof(dto, request);

    expect(result).toEqual({
      paymentId: "payment-1",
      paymentStatus: EPaymentStatus.PROOF_UPLOADED,
    });
    expect(tx.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "payment-1",
          status: EPaymentStatus.PENDING,
          proofImageUrl: null,
        }),
      }),
    );
    expect(tx.payment.create).not.toHaveBeenCalled();
    expect(JSON.stringify(tx.auditLog.create.mock.calls)).not.toContain(
      TRACKING_TOKEN,
    );
  });

  it("does not create a second proof when a concurrent update loses", async () => {
    tx.payment.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      new StorePaymentService().submitProof(dto, request),
    ).rejects.toMatchObject({ code: "PAYMENT_UNDER_REVIEW" });

    expect(tx.payment.create).not.toHaveBeenCalled();
    expect(tx.payment.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "PROOF_SUBMISSION_DENIED",
          reason: "PAYMENT_UNDER_REVIEW",
        }),
      }),
    );
  });

  it("retries once after a P2034 serialization failure", async () => {
    const serializationError = new Prisma.PrismaClientKnownRequestError(
      "Could not serialize the transaction",
      { code: "P2034", clientVersion: "test" },
    );
    mockPrisma.$transaction
      .mockRejectedValueOnce(serializationError)
      .mockImplementationOnce(async (callback: (client: unknown) => unknown) =>
        callback(tx),
      );

    const result = await new StorePaymentService().submitProof(dto, request);

    expect(result.paymentId).toBe("payment-1");
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2);
    expect(tx.payment.updateMany).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing order and audits the denial", async () => {
    tx.order.findUnique.mockResolvedValue(null);

    await expect(
      new StorePaymentService().submitProof(dto, request),
    ).rejects.toMatchObject({ code: "ORDER_NOT_FOUND" });

    expect(tx.payment.updateMany).not.toHaveBeenCalled();
    expect(tx.payment.create).not.toHaveBeenCalled();
    expect(tx.auditLog.create).toHaveBeenCalled();
  });
});
