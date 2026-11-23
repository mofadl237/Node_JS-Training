import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type { IShippingArea, IShippingQuote, IShippingQuoteQuery } from "@/interface";
import {
  shippingAreasSchema,
  shippingQuoteQuerySchema,
  shippingQuoteSchema,
} from "@/validation/shipping";

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShippingAreas: build.query<IShippingArea[], void>({
      query: () => "/store/shipping/areas",
      transformResponse: (response: IApiSuccess<IShippingArea[]>) =>
        shippingAreasSchema.parse(unwrapEnvelope(response).data),
    }),
    getShippingQuote: build.query<IShippingQuote, IShippingQuoteQuery>({
      query: (query) => ({
        url: "/store/shipping/quote",
        params: shippingQuoteQuerySchema.parse(query),
      }),
      transformResponse: (response: IApiSuccess<IShippingQuote>) =>
        shippingQuoteSchema.parse(unwrapEnvelope(response).data),
    }),
  }),
  overrideExisting: false,
});

export const { useGetShippingAreasQuery, useGetShippingQuoteQuery } =
  shippingApi;
