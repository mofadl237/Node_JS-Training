import type { EOrderStatus, EPaymentStatus } from "@prisma/client";

export interface ITrackedOrderItem {
  productNameAr: string;
  sku: string;
  quantity: string;
  lineTotal: string;
}

export interface ITrackedOrder {
  orderNumber: string;
  status: EOrderStatus;
  paymentStatus: EPaymentStatus;
  placedAt: Date;
  deliveredAt: Date | null;
  etaMinDays: number | null;
  etaMaxDays: number | null;
  items: ITrackedOrderItem[];
}
