import { baseApi, unwrapEnvelope } from "./baseApi";
import type { IApiSuccess } from "@/interface/api";
import type {
  ICustomerAuthResponse,
  ICustomerLoginPayload,
  ICustomerMessageResponse,
  IForgotPasswordPayload,
  IRegisterCustomerPayload,
  IResetPasswordPayload,
  IStoreCustomer,
  IVerifyEmailPayload,
} from "@/interface";
import {
  customerAuthResponseSchema,
  customerLoginSchema,
  customerMessageResponseSchema,
  forgotPasswordSchema,
  registerCustomerSchema,
  resetPasswordSchema,
  storeCustomerSchema,
  verifyEmailSchema,
} from "@/validation/customerAuth";

const CART_TAG: [{ type: "Cart"; id: "CURRENT" }] = [
  { type: "Cart", id: "CURRENT" },
];

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerCustomer: build.mutation<ICustomerMessageResponse, IRegisterCustomerPayload>({
      query: (payload) => ({
        url: "/store/auth/register",
        method: "POST",
        body: registerCustomerSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<ICustomerMessageResponse>) =>
        customerMessageResponseSchema.parse(unwrapEnvelope(response).data),
    }),
    verifyEmail: build.mutation<void, IVerifyEmailPayload>({
      query: (payload) => ({
        url: "/store/auth/verify-email",
        method: "POST",
        body: verifyEmailSchema.parse(payload),
      }),
    }),
    loginCustomer: build.mutation<ICustomerAuthResponse, ICustomerLoginPayload>({
      query: (payload) => ({
        url: "/store/auth/login",
        method: "POST",
        body: customerLoginSchema.parse(payload),
      }),
      transformResponse: (response: IApiSuccess<ICustomerAuthResponse>) =>
        customerAuthResponseSchema.parse(unwrapEnvelope(response).data),
      invalidatesTags: CART_TAG,
    }),
    forgotPassword: build.mutation<void, IForgotPasswordPayload>({
      query: (payload) => ({
        url: "/store/auth/forgot-password",
        method: "POST",
        body: forgotPasswordSchema.parse(payload),
      }),
    }),
    resetPassword: build.mutation<void, IResetPasswordPayload>({
      query: (payload) => ({
        url: "/store/auth/reset-password",
        method: "POST",
        body: resetPasswordSchema.parse(payload),
      }),
    }),
    logoutCustomer: build.mutation<void, void>({
      query: () => ({
        url: "/store/auth/logout",
        method: "POST",
      }),
      invalidatesTags: CART_TAG,
    }),
    getCustomerProfile: build.query<IStoreCustomer, void>({
      query: () => "/store/auth/me",
      transformResponse: (response: IApiSuccess<IStoreCustomer>) =>
        storeCustomerSchema.parse(unwrapEnvelope(response).data),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterCustomerMutation,
  useVerifyEmailMutation,
  useLoginCustomerMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutCustomerMutation,
  useGetCustomerProfileQuery,
} = authApi;
