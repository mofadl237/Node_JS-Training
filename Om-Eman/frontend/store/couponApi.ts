import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type { ICouponPreview, ICouponPreviewPayload } from "@/interface";
import {
  couponPreviewSchema,
  couponValidateSchema,
} from "@/validation/coupon";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    validateCoupon: build.mutation<ICouponPreview, ICouponPreviewPayload>({
      query: (payload) => ({
        url: "/store/coupons/validate",
        method: "POST",
        body: couponValidateSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<ICouponPreview>) =>
        couponPreviewSchema.parse(unwrapEnvelope(response).data),
    }),
  }),
  overrideExisting: false,
});

export const { useValidateCouponMutation } = couponApi;
