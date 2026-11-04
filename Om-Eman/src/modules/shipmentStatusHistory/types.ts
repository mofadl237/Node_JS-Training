import type { EShipmentStatus } from "@prisma/client";
export type {
  ICreateShipmentStatusHistoryInput,
  IListShipmentStatusHistoryQuery,
  IUpdateShipmentStatusHistoryInput,
} from "./validation.js";

export interface IShipmentStatusHistoryResponse {
  id: string;
  shipmentId: string;
  fromStatus: EShipmentStatus | null;
  toStatus: EShipmentStatus;
  changedByEmployeeId: string | null;
  notes: string | null;
  createdAt: Date;
}
