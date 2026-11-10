import type { Prisma } from "@prisma/client";
export type {
  ICreateCartItemInput,
  IListCartItemQuery,
  IUpdateCartItemInput,
} from "./validation.js";

export interface ICartItemResponse {
  id: string;
  cartId: string;
  productPackageId: string;
  quantity: Prisma.Decimal;
  priceAtAdd: Prisma.Decimal | null;
  createdAt: Date;
  updatedAt: Date;
}
