import type { EOrderStatus } from "@prisma/client";
export type {
  ICreateOrderStatusHistoryInput,
  IListOrderStatusHistoryQuery,
  IUpdateOrderStatusHistoryInput,
} from "./validation.js";

export interface IOrderStatusHistoryResponse {
  id: string;
  orderId: string;
  fromStatus: EOrderStatus | null;
  toStatus: EOrderStatus;
  changedByEmployeeId: string | null;
  notes: string | null;
  createdAt: Date;
}
