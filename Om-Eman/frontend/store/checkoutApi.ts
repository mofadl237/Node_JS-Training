import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type { ICheckoutResult, IGuestCheckoutPayload } from "@/interface";
import {
  checkoutResultSchema,
  guestCheckoutSchema,
} from "@/validation/checkout";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<ICheckoutResult, IGuestCheckoutPayload>({
      query: (payload) => ({
        url: "/store/checkout",
        method: "POST",
        body: guestCheckoutSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<ICheckoutResult>) =>
        checkoutResultSchema.parse(unwrapEnvelope(response).data),
      invalidatesTags: [{ type: "Cart", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const { usePlaceOrderMutation } = checkoutApi;
