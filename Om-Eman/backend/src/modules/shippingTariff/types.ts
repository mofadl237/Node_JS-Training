import type { Prisma } from "@prisma/client";
export type {
  ICreateShippingTariffInput,
  IListShippingTariffQuery,
  IUpdateShippingTariffInput,
} from "./validation.js";

export interface IShippingTariffResponse {
  id: string;
  carrierId: string;
  governorate: string;
  city: string | null;
  baseCost: Prisma.Decimal;
  etaMinDays: number;
  etaMaxDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
