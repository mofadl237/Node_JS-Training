import type { Prisma } from "@prisma/client";
export type {
  ICreateOrderItemInput,
  IListOrderItemQuery,
  IUpdateOrderItemInput,
} from "./validation.js";

export interface IOrderItemResponse {
  id: string;
  orderId: string;
  productId: string | null;
  productPackageId: string | null;
  productNameArSnapshot: string;
  productNameEnSnapshot: string | null;
  packageNameArSnapshot: string | null;
  packageNameEnSnapshot: string | null;
  skuSnapshot: string;
  quantity: Prisma.Decimal;
  unitPrice: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  taxRateSnapshot: Prisma.Decimal | null;
  taxAmount: Prisma.Decimal;
  lineTotal: Prisma.Decimal;
  bundleSnapshot: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}
