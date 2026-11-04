import type { Prisma } from "@prisma/client";
export type {
  ICreateOrderAddressSnapshotInput,
  IListOrderAddressSnapshotQuery,
  IUpdateOrderAddressSnapshotInput,
} from "./validation.js";

export interface IOrderAddressSnapshotResponse {
  id: string;
  orderId: string;
  recipientName: string;
  phone: string;
  governorate: string;
  city: string;
  district: string | null;
  street: string;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;
  sourceAddressId: string | null;
  createdAt: Date;
}
