import type { ListResult, SortOrder } from "./shared.interfaces.js";

export type ProductSortField =
  | "id"
  | "name"
  | "price"
  | "stock"
  | "category"
  | "createdAt"
  | "updatedAt";

export interface GetProductsOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  category?: string | undefined;
  isActive?: boolean | undefined;
  inStock?: boolean | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sortBy: ProductSortField;
  sortOrder: SortOrder;
}

/** `price` is a validated decimal string (e.g. "149.99"). */
export interface ProductWriteInput {
  name?: string;
  description?: string | null;
  category?: string | null;
  price?: string;
  stock?: number;
  isActive?: boolean;
}

export interface ActivePercentageOfferDto {
  id: string;
  title: string;
  discountPercent: number;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  /** Original menu price. */
  price: number;
  /** Price after the best active PERCENTAGE offer (or `price` when none). */
  finalPrice: number;
  stock: number;
  isActive: boolean;
  activeOffer: ActivePercentageOfferDto | null;
  createdAt: string;
  updatedAt: string;
}

export type GetProductsResult = ListResult<ProductDto>;
