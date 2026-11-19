import { cacheLife, cacheTag } from "next/cache";
import type { IStoreBanner, IStoreCategoryNode, IStoreProductCard, IStoreSettings } from "@/interface";
import { storeFetch, type TStoreResult } from "./storeFetch";

export const getStoreSettings = async (): Promise<TStoreResult<IStoreSettings>> => {
  "use cache";
  cacheTag("store-settings");
  const result = await storeFetch<IStoreSettings>("store/settings");
  cacheLife(result.ok ? "minutes" : "seconds");
  return result;
};

export const getStoreCategories = async (): Promise<TStoreResult<IStoreCategoryNode[]>> => {
  "use cache";
  cacheTag("store-categories");
  const result = await storeFetch<IStoreCategoryNode[]>("store/categories");
  cacheLife(result.ok ? "minutes" : "seconds");
  return result;
};

export const getStoreBanners = async (): Promise<TStoreResult<IStoreBanner[]>> => {
  "use cache";
  cacheTag("store-banners");
  const result = await storeFetch<IStoreBanner[]>("store/banners");
  cacheLife(result.ok ? "minutes" : "seconds");
  return result;
};

export const getFeaturedProducts = async (): Promise<TStoreResult<IStoreProductCard[]>> => {
  "use cache";
  cacheTag("store-products");
  const result = await storeFetch<IStoreProductCard[]>("store/products?featured=true&limit=8&sort=newest");
  cacheLife(result.ok ? "minutes" : "seconds");
  return result;
};
