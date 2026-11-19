import type { OfferTypeValue } from "./offer.interfaces.js";
import type { ListResult, SortOrder } from "./shared.interfaces.js";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export type OrderSortField = "id" | "createdAt" | "totalAmount" | "status";

export interface OrderItemInput {
  productId: bigint;
  quantity: number;
}

export interface CreateOrderInput {
  userId: bigint;
  items: OrderItemInput[];
}

export interface GetOrdersOptions {
  page: number;
  limit: number;
  userId?: bigint | undefined;
  status?: OrderStatusValue | undefined;
  createdFrom?: Date | undefined;
  createdTo?: Date | undefined;
  minTotal?: number | undefined;
  maxTotal?: number | undefined;
  sortBy: OrderSortField;
  sortOrder: SortOrder;
}

export interface UpdateOrderStatusInput {
  status: OrderStatusValue;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  quantity: number;
  originalUnitPrice: number;
  /** Unit price after applied percentage offers. */
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  product: { id: string; name: string };
}

export interface AppliedOfferDto {
  id: string;
  offerId: string;
  title: string;
  type: OfferTypeValue;
  discountAmount: number;
}

export interface OrderDto {
  id: string;
  userId: string;
  status: OrderStatusValue;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string } | null;
  items: OrderItemDto[];
  appliedOffers: AppliedOfferDto[];
}

export type GetOrdersResult = ListResult<OrderDto>;
