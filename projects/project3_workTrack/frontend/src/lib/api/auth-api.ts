import { baseApi } from "./base-api";
import type {
  IApiEnvelope,
  IAuthResponse,
  ILoginRequest,
  IAuthSession,
} from "./types";

interface ILogoutRequest {
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<IAuthResponse>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<{ message: string }, ILogoutRequest>({
      query: (body) => ({
        url: "/api/auth/logout",
        method: "POST",
        body,
      }),
      transformResponse: (response: IApiEnvelope<{ message: string }>) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

export type { IAuthSession };
