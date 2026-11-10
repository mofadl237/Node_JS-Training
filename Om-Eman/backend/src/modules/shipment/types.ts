import type { EShipmentStatus, Prisma } from "@prisma/client";
export type {
  ICreateShipmentInput,
  IListShipmentQuery,
  IUpdateShipmentInput,
} from "./validation.js";

export interface IShipmentResponse {
  id: string;
  shipmentNumber: string;
  orderId: string;
  carrierId: string;
  trackingNumber: string | null;
  status: EShipmentStatus;
  expectedCost: Prisma.Decimal | null;
  actualCost: Prisma.Decimal | null;
  codAmount: Prisma.Decimal | null;
  codCollected: Prisma.Decimal | null;
  codSettledAt: Date | null;
  codSettlementReference: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  etaMinDays: number | null;
  etaMaxDays: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
