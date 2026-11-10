import type { Prisma } from "@prisma/client";
export type {
  ICreateCustomerAddressInput,
  IListCustomerAddressQuery,
  IUpdateCustomerAddressInput,
} from "./validation.js";

export interface ICustomerAddressResponse {
  id: string;
  customerId: string;
  label: string | null;
  governorate: string;
  city: string;
  district: string | null;
  street: string;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
