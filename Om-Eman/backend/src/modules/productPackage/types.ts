import type { Prisma, ESizeUnit, EStockStatus } from "@prisma/client";
export type {
  ICreateProductPackageInput,
  IListProductPackageQuery,
  IUpdateProductPackageInput,
} from "./validation.js";

export interface IProductPackageResponse {
  id: string;
  productId: string;
  sku: string;
  barcode: string | null;
  nameAr: string | null;
  nameEn: string | null;
  sizeValue: Prisma.Decimal;
  sizeUnit: ESizeUnit;
  sellingPrice: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  saleEndsAt: Date | null;
  stockStatus: EStockStatus;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
