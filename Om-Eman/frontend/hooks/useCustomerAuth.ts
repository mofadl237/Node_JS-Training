"use client";

import { useCallback, useSyncExternalStore } from "react";
import type {
  ICustomerLoginPayload,
  IForgotPasswordPayload,
  IRegisterCustomerPayload,
  IResetPasswordPayload,
  IStoreCustomer,
  IVerifyEmailPayload,
} from "@/interface";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resolveAccountErrorKey } from "@/lib/accountError";
import {
  clearCustomerToken,
  getCustomerSessionSnapshot,
  getServerCustomerSessionSnapshot,
  saveCustomerToken,
  subscribeCustomerSession,
} from "@/lib/customerSession";
import {
  authApi,
  useForgotPasswordMutation,
  useGetCustomerProfileQuery,
  useLoginCustomerMutation,
  useLogoutCustomerMutation,
  useRegisterCustomerMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} from "@/store/authApi";

export type TCustomerAuthStatus = "loading" | "guest" | "authenticated" | "error";
export interface IRegisterActionResult {
  errorKey: string | null;
  devVerificationLink: string | null;
}
export interface IUseCustomerAuthResult {
  status: TCustomerAuthStatus;
  customer: IStoreCustomer | null;
  errorKey: string | null;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRegistering: boolean;
  isVerifying: boolean;
  isRequestingReset: boolean;
  isResetting: boolean;
  login: (values: ICustomerLoginPayload) => Promise<string | null>;
  logout: () => Promise<string | null>;
  register: (values: IRegisterCustomerPayload) => Promise<IRegisterActionResult>;
  verifyEmail: (values: IVerifyEmailPayload) => Promise<string | null>;
  forgotPassword: (values: IForgotPasswordPayload) => Promise<string | null>;
  resetPassword: (values: IResetPasswordPayload) => Promise<string | null>;
  refetchProfile: () => void;
}
type TUnwrappable<TResult> = { unwrap: () => Promise<TResult> };
const runAction = async <TResult,>(
  request: () => TUnwrappable<TResult>,
  onSuccess?: (result: TResult) => void,
): Promise<string | null> => {
  try {
    const result = await request().unwrap();
    onSuccess?.(result);
    return null;
  } catch (error) {
    return resolveAccountErrorKey(error);
  }
};
export const useCustomerAuth = (): IUseCustomerAuthResult => {
  const dispatch = useAppDispatch();
  const token = useSyncExternalStore(
    subscribeCustomerSession,
    getCustomerSessionSnapshot,
    getServerCustomerSessionSnapshot,
  );
  const hasSession = token !== null;
  const profile = useGetCustomerProfileQuery(undefined, { skip: !hasSession });
  const refetchProfile = profile.refetch;
  const [loginRequest, loginState] = useLoginCustomerMutation();
  const [logoutRequest, logoutState] = useLogoutCustomerMutation();
  const [registerRequest, registerState] = useRegisterCustomerMutation();
  const [verifyRequest, verifyState] = useVerifyEmailMutation();
  const [forgotRequest, forgotState] = useForgotPasswordMutation();
  const [resetRequest, resetState] = useResetPasswordMutation();
  const login = useCallback(
    (values: ICustomerLoginPayload) =>
      runAction(() => loginRequest(values), (result) => {
        dispatch(authApi.util.resetApiState());
        saveCustomerToken(result.token);
      }),
    [dispatch, loginRequest],
  );
  const logout = useCallback(async (): Promise<string | null> => {
    const errorKey = await runAction(() => logoutRequest());
    clearCustomerToken();
    dispatch(authApi.util.resetApiState());
    return errorKey;
  }, [dispatch, logoutRequest]);
  const register = useCallback(
    async (values: IRegisterCustomerPayload): Promise<IRegisterActionResult> => {
      let devVerificationLink: string | null = null;
      const errorKey = await runAction(() => registerRequest(values), (result) => {
        devVerificationLink =
          process.env.NODE_ENV === "production" ? null : (result.devVerificationLink ?? null);
      });
      return { errorKey, devVerificationLink };
    },
    [registerRequest],
  );
  const verifyEmail = useCallback(
    (values: IVerifyEmailPayload) => runAction(() => verifyRequest(values)),
    [verifyRequest],
  );
  const forgotPassword = useCallback(
    (values: IForgotPasswordPayload) => runAction(() => forgotRequest(values)),
    [forgotRequest],
  );
  const resetPassword = useCallback(
    (values: IResetPasswordPayload) => runAction(() => resetRequest(values)),
    [resetRequest],
  );
  const errorKey = profile.error ? resolveAccountErrorKey(profile.error) : null;
  const status: TCustomerAuthStatus = !hasSession
    ? "guest"
    : errorKey
      ? "error"
      : profile.data
        ? "authenticated"
        : "loading";

  return {
    status,
    customer: profile.data ?? null,
    errorKey,
    isLoggingIn: loginState.isLoading,
    isLoggingOut: logoutState.isLoading,
    isRegistering: registerState.isLoading,
    isVerifying: verifyState.isLoading,
    isRequestingReset: forgotState.isLoading,
    isResetting: resetState.isLoading,
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refetchProfile,
  };
};
