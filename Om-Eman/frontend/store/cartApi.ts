import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type { IMergeCartResult, IMergeCartPayload } from "@/interface";
import { mergeCartResultSchema, mergeCartSchema } from "@/validation/cartMerge";

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
    getCartByToken: build.query<IStoreCart, string>({
      query: (guestToken) => ({
        url: `/store/cart/${guestToken}`,
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
    updateCartItem: build.mutation<
      IStoreCart,
      { guestToken: string; itemId: string; quantity: number }
    >({
      query: ({ guestToken, itemId, quantity }) => ({
        url: `/store/cart/${guestToken}/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (res: IApiSuccess<IStoreCart>) => unwrapEnvelope(res).data,
      invalidatesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
    removeCartItem: build.mutation<IStoreCart, { guestToken: string; itemId: string }>({
      query: ({ guestToken, itemId }) => ({
        url: `/store/cart/${guestToken}/items/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (res: IApiSuccess<IStoreCart>) => unwrapEnvelope(res).data,
      invalidatesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
    mergeCart: build.mutation<IMergeCartResult, IMergeCartPayload>({
      query: (payload) => ({
        url: "/store/cart/merge",
        method: "POST",
        body: mergeCartSchema.parse(payload),
      }),
      transformResponse: (res: IApiSuccess<IMergeCartResult>) =>
        mergeCartResultSchema.parse(unwrapEnvelope(res).data),
      invalidatesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrCreateCartQuery,
  useAddCartItemMutation,
  useLazyGetOrCreateCartQuery,
  useGetCartByTokenQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
} = cartApi;
