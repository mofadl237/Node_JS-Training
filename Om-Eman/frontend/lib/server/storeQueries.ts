import { cacheLife, cacheTag } from "next/cache";
import type {
  IStoreBanner,
  IStoreCategoryNode,
  IStoreProductCard,
  IStoreSearchResult,
  IStorefrontProduct,
  IStoreSettings,
} from "@/interface";
import { buildCatalogProductsPath, type INormalizedCatalogQuery } from "@/lib/catalogQuery";
import { buildStoreSearchPath } from "@/lib/searchQuery";
import { searchQuerySchema, storeSearchResponseSchema, storefrontProductSchema } from "@/validation";
import { storeFetch, type TStoreResult } from "./storeFetch";

export const getStoreSettings = async (): Promise<TStoreResult<IStoreSettings>> => {
  "use cache";
  cacheTag("store-settings");
  const result = await storeFetch<IStoreSettings>("store/settings");
  if (result.ok) {
    cacheLife("minutes");
  } else {
    cacheLife("seconds");
  }
  return result;
};

export const getStoreCategories = async (): Promise<TStoreResult<IStoreCategoryNode[]>> => {
  "use cache";
  cacheTag("store-categories");
  const result = await storeFetch<IStoreCategoryNode[]>("store/categories");
  if (result.ok) {
    cacheLife("minutes");
  } else {
    cacheLife("seconds");
  }
  return result;
};

export const getStoreBanners = async (): Promise<TStoreResult<IStoreBanner[]>> => {
  "use cache";
  cacheTag("store-banners");
  const result = await storeFetch<IStoreBanner[]>("store/banners");
  if (result.ok) {
    cacheLife("minutes");
  } else {
    cacheLife("seconds");
  }
  return result;
};

export const getFeaturedProducts = async (): Promise<TStoreResult<IStoreProductCard[]>> => {
  "use cache";
  cacheTag("store-products");
  const result = await storeFetch<IStoreProductCard[]>("store/products?featured=true&limit=8&sort=newest");
  if (result.ok) {
    cacheLife("minutes");
  } else {
    cacheLife("seconds");
  }
  return result;
};

export const getStoreProducts = async (
  query: INormalizedCatalogQuery,
): Promise<TStoreResult<IStoreProductCard[]>> => {
  "use cache";
  cacheTag("store-products");
  const result = await storeFetch<IStoreProductCard[]>(buildCatalogProductsPath(query));
  if (result.ok) {
    cacheLife("minutes");
  } else {
    cacheLife("seconds");
  }
  return result;
};

export const getStoreSearch = async (
  q: string,
  limit: number,
): Promise<TStoreResult<IStoreSearchResult>> => {
  const parsedQuery = searchQuerySchema.safeParse({ q, limit });
  if (!parsedQuery.success) {
    return { ok: false, status: 400, code: "VALIDATION_ERROR" };
  }

  const path = buildStoreSearchPath({
    q: parsedQuery.data.q,
    limit: parsedQuery.data.limit,
    isValid: true,
  });
  if (!path) {
    return { ok: false, status: 400, code: "VALIDATION_ERROR" };
  }

  const result = await storeFetch<unknown>(path);
  if (!result.ok) return result;

  const parsed = storeSearchResponseSchema.safeParse(result.data);
  if (!parsed.success) {
    return { ok: false, status: 200, code: "INVALID_RESPONSE" };
  }

  return { ok: true, data: parsed.data };
};

export const getStorefrontProduct = async (
  slug: string,
): Promise<TStoreResult<IStorefrontProduct>> => {
  "use cache";
  cacheTag("store-products", `store-product-${slug}`);
  const result = await storeFetch<unknown>(`store/products/${slug}`);
  if (!result.ok) {
    cacheLife("seconds");
    return result;
  }
  const parsed = storefrontProductSchema.safeParse(result.data);
  if (!parsed.success) {
    cacheLife("seconds");
    return { ok: false, status: 200, code: "INVALID_RESPONSE" };
  }
  cacheLife("minutes");
  return { ok: true, data: parsed.data };
};
