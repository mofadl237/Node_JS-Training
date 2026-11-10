import type { Prisma } from "@prisma/client";
export type {
  ICreateProductBundleComponentInput,
  IListProductBundleComponentQuery,
  IUpdateProductBundleComponentInput,
} from "./validation.js";

export interface IProductBundleComponentResponse {
  id: string;
  bundleProductId: string;
  componentPackageId: string;
  quantity: Prisma.Decimal;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
