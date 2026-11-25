import type { TPaymentStatus } from "./checkout";

export type TOrderStatus =
  | "RECEIVED"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "FAILED_DELIVERY";

export interface ITrackedOrderItem {
  productNameAr: string;
  sku: string;
  quantity: string;
  lineTotal: string;
}

export interface ITrackedOrder {
  orderNumber: string;
  status: TOrderStatus;
  paymentStatus: TPaymentStatus;
  placedAt: string;
  deliveredAt: string | null;
  etaMinDays: number | null;
  etaMaxDays: number | null;
  items: ITrackedOrderItem[];
}
