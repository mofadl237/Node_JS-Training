import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { API_BASE_URL } from "@/lib/config";
import { readCustomerToken } from "@/lib/customerSession";
import { isEnvelopeFailure } from "@/lib/envelope";
import type { IApiError, IApiSuccess, IUnwrapped } from "@/interface/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = readCustomerToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export type TBaseQuery = BaseQueryFn<string | FetchArgs, unknown, IApiError>;

export const baseQueryWithApiError: TBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const payload: unknown = result.error.data;
    const status = typeof result.error.status === "number" ? result.error.status : 0;

    if (isEnvelopeFailure(payload)) {
      return { error: { status, message: payload.message, code: payload.code } };
    }
    return { error: { status, message: "Request failed", code: "REQUEST_FAILED" } };
  }

  return { data: result.data };
};

export const unwrapEnvelope = <T>(envelope: IApiSuccess<T>): IUnwrapped<T> => ({
  data: envelope.data,
  meta: envelope.meta,
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithApiError,
  tagTypes: ["Cart"],
  endpoints: () => ({}),
});
