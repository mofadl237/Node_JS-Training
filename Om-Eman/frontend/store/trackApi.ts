import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type { ITrackedOrder } from "@/interface";
import { trackingTokenSchema, trackedOrderSchema } from "@/validation/track";

export const trackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTrackedOrder: build.query<ITrackedOrder, string>({
      query: (trackingToken) => ({
        url: `/store/track/${trackingTokenSchema.parse(trackingToken)}`,
      }),
      transformResponse: (response: IApiSuccess<ITrackedOrder>) =>
        trackedOrderSchema.parse(unwrapEnvelope(response).data),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTrackedOrderQuery } = trackApi;
