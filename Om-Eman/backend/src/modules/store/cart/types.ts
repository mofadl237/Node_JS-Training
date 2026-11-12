import type { ECartStatus } from "@prisma/client";

export interface ICartPackageSnapshot {
  id: string;
  sku: string;
  sellingPrice: string;
  isAvailable: boolean;
  nameAr: string | null;
}

export interface ICartLine {
  id: string;
  quantity: string;
  priceAtAdd: string | null;
  package: ICartPackageSnapshot | null;
}

export interface IStoreCart {
  id: string;
  guestToken: string;
  status: ECartStatus;
  lines: ICartLine[];
  subtotal: string;
}
