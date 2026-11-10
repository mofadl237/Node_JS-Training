import type { EOrderStatus, EPaymentStatus, Prisma } from "@prisma/client";
export type {
  ICreateOrderInput,
  IListOrderQuery,
  IUpdateOrderInput,
} from "./validation.js";

export interface IOrderResponse {
  id: string;
  orderNumber: string;
  customerId: string;
  status: EOrderStatus;
  paymentStatus: EPaymentStatus;
  placedAt: Date;
  confirmedAt: Date | null;
  preparedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  canceledAt: Date | null;
  cancelReason: string | null;
  subtotal: Prisma.Decimal;
  discountTotal: Prisma.Decimal;
  shippingTotal: Prisma.Decimal;
  taxTotal: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  customerNotes: string | null;
  internalNotes: string | null;
  fbp: string | null;
  fbc: string | null;
  clientIp: string | null;
  clientUserAgent: string | null;
  eventSourceUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
