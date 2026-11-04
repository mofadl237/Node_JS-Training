import type { ECustomerStatus, Prisma } from "@prisma/client";
export type {
  ICreateCustomerInput,
  IListCustomerQuery,
  IUpdateCustomerInput,
} from "./validation.js";

export interface ICustomerResponse {
  id: string;
  phone: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  status: ECustomerStatus;
  isGuest: boolean;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  claimedAt: Date | null;
  lastLoginAt: Date | null;
  mergedIntoCustomerId: string | null;
  completedOrdersCount: number;
  totalSpent: Prisma.Decimal;
  firstOrderAt: Date | null;
  lastOrderAt: Date | null;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
