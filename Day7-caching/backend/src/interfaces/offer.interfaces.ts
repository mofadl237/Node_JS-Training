import type { ListResult, SortOrder } from "./shared.interfaces.js";

export const OFFER_TYPES = ["PERCENTAGE", "BUNDLE"] as const;
export type OfferTypeValue = (typeof OFFER_TYPES)[number];

export type OfferSortField =
  | "id"
  | "title"
  | "type"
  | "bundlePrice"
  | "discountPercent"
  | "createdAt"
  | "updatedAt";

export interface OfferItemInput {
  productId: bigint;
  quantity: number;
}

export interface GetOffersOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  type?: OfferTypeValue | undefined;
  isActive?: boolean | undefined;
  /** Matches a PERCENTAGE target OR a product inside a BUNDLE. */
  productId?: bigint | undefined;
  activeOnly?: boolean | undefined;
  sortBy: OfferSortField;
  sortOrder: SortOrder;
}

export interface OfferWriteInput {
  title?: string;
  description?: string | null;
  discountPercent?: string;
  bundlePrice?: string;
  productId?: bigint;
  items?: OfferItemInput[];
  isActive?: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
}

export interface CreateOfferInput extends OfferWriteInput {
  title: string;
  type: OfferTypeValue;
}

export interface UpdateOfferInput extends OfferWriteInput {}

/** Merged shape used by the type-specific consistency validator. */
export interface OfferShape {
  type: OfferTypeValue;
  discountPercent?: string | undefined;
  bundlePrice?: string | undefined;
  productId?: bigint | undefined;
  items?: OfferItemInput[] | undefined;
  startsAt?: Date | null | undefined;
  endsAt?: Date | null | undefined;
}

export interface OfferItemDto {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
  };
}

export interface OfferDto {
  id: string;
  title: string;
  description: string | null;
  type: OfferTypeValue;
  discountPercent: number | null;
  bundlePrice: number | null;
  productId: string | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Present for PERCENTAGE offers. */
  product: { id: string; name: string; price: number } | null;
  /** Present for BUNDLE offers. */
  items: OfferItemDto[];
  /** Sum of bundle item prices before the unified bundle price. */
  originalBundlePrice: number | null;
  /** originalBundlePrice - bundlePrice, never negative. */
  savings: number | null;
  /** Product price after a PERCENTAGE discount. */
  finalProductPrice: number | null;
}

export type GetOffersResult = ListResult<OfferDto>;
