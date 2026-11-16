import type { ECartStatus } from "@prisma/client";

// Package snapshot as the cart drawer renders it. Enriched (B12) with product
// identity and price context so the frontend needs zero extra requests.
export interface ICartPackageSnapshot {
  id: string;
  sku: string;
  sellingPrice: string;
  // Active + published + in stock. Anything else shows as unavailable and
  // checkout rejects it.
  isAvailable: boolean;
  nameAr: string | null;
  productId: string;
  productSlug: string;
  productNameAr: string;
  productNameEn: string | null;
  // Primary product image (null when the product has no images yet).
  imageUrl: string | null;
  sizeValue: string;
  sizeUnit: string;
  compareAtPrice: string | null;
  stockStatus: string;
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
  itemsCount: number;
  lines: ICartLine[];
  subtotal: string;
}
