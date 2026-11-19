import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";

export interface IStoreCartPackage {
  id: string;
  sku: string | null;
  sellingPrice: string;
  isAvailable: boolean;
  nameAr: string | null;
  productId: string;
  productSlug: string;
  productNameAr: string;
  productNameEn: string | null;
  imageUrl: string | null;
  sizeValue: string;
  sizeUnit: string;
  compareAtPrice: string | null;
  stockStatus: string;
}

export interface IStoreCartLine {
  id: string;
  quantity: string;
  priceAtAdd: string | null;
  package: IStoreCartPackage | null;
}

export interface IStoreCart {
  id: string;
  guestToken: string;
  status: string;
  itemsCount: number;
  lines: IStoreCartLine[];
  subtotal: string;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrCreateCart: build.query<IStoreCart, string | undefined>({
      query: (guestToken) => ({
        url: "/store/cart",
        params: guestToken ? { guestToken } : undefined,
      }),
      transformResponse: (res: IApiSuccess<IStoreCart>) => unwrapEnvelope(res).data,
      providesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
    addCartItem: build.mutation<IStoreCart, { guestToken: string; productPackageId: string; quantity: number }>({
      query: ({ guestToken, productPackageId, quantity }) => ({
        url: `/store/cart/${guestToken}/items`,
        method: "POST",
        body: { productPackageId, quantity },
      }),
      transformResponse: (res: IApiSuccess<IStoreCart>) => unwrapEnvelope(res).data,
      invalidatesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrCreateCartQuery, useAddCartItemMutation, useLazyGetOrCreateCartQuery } = cartApi;
