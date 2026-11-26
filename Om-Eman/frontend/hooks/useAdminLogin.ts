"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resolveAdminErrorKey } from "@/lib/adminError";
import { isApiError } from "@/lib/cartError";
import {
  dashboardApi,
  useGetEmployeeSessionQuery,
  useLoginEmployeeMutation,
  useLogoutEmployeeMutation,
} from "@/store/dashboardApi";
import type { TAdminLoginForm } from "@/validation/adminLogin";

export type TAdminSessionStatus = "loading" | "authenticated" | "guest" | "error";

export interface IUseAdminLoginResult {
  errorKey: string | null;
  isShaking: boolean;
  isBusy: boolean;
  isLoggingOut: boolean;
  sessionErrorKey: string | null;
  sessionStatus: TAdminSessionStatus;
  login: (values: TAdminLoginForm) => Promise<string | null>;
  logout: () => Promise<string | null>;
  handleInvalid: () => void;
  refetchSession: () => void;
}

export const useAdminLogin = (): IUseAdminLoginResult => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tRoot = useTranslations();
  const session = useGetEmployeeSessionQuery();
  const [loginRequest, loginState] = useLoginEmployeeMutation();
  const [logoutRequest, logoutState] = useLogoutEmployeeMutation();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeout = useRef<number | null>(null);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    if (shakeTimeout.current !== null) window.clearTimeout(shakeTimeout.current);
    shakeTimeout.current = window.setTimeout(() => setIsShaking(false), 420);
  }, []);

  useEffect(
    () => () => {
      if (shakeTimeout.current !== null) window.clearTimeout(shakeTimeout.current);
    },
    [],
  );

  useEffect(() => {
    if (session.data) router.replace("/dashboard");
  }, [router, session.data]);

  const login = useCallback(
    async (values: TAdminLoginForm): Promise<string | null> => {
      setErrorKey(null);
      try {
        await loginRequest(values).unwrap();
        dispatch(dashboardApi.util.invalidateTags(["AdminSession"]));
        toast.success(tRoot("dashboard.login.status.signedIn"));
        router.replace("/dashboard");
        return null;
      } catch (error) {
        const key = resolveAdminErrorKey(error);
        setErrorKey(key);
        toast.error(tRoot(key));
        triggerShake();
        return key;
      }
    },
    [dispatch, loginRequest, router, tRoot, triggerShake],
  );

  const logout = useCallback(async (): Promise<string | null> => {
    try {
      await logoutRequest().unwrap();
      dispatch(dashboardApi.util.resetApiState());
      toast.success(tRoot("dashboard.login.status.signedOut"));
      router.replace("/dashboard/login");
      return null;
    } catch (error) {
      const key = resolveAdminErrorKey(error);
      toast.error(tRoot(key));
      return key;
    }
  }, [dispatch, logoutRequest, router, tRoot]);

  const handleInvalid = useCallback(() => {
    const key = "dashboard.errors.validation";
    setErrorKey(key);
    toast.error(tRoot(key));
    triggerShake();
  }, [tRoot, triggerShake]);

  const refetchSession = useCallback(() => {
    void session.refetch();
  }, [session]);

  const isSessionFailure = Boolean(session.error) &&
    (!isApiError(session.error) || session.error.status !== 401);
  const sessionStatus: TAdminSessionStatus = session.isLoading
    ? "loading"
    : session.data
      ? "authenticated"
      : isSessionFailure
        ? "error"
        : "guest";

  return {
    errorKey,
    isShaking,
    isBusy: loginState.isLoading || logoutState.isLoading,
    isLoggingOut: logoutState.isLoading,
    sessionErrorKey: session.error ? resolveAdminErrorKey(session.error) : null,
    sessionStatus,
    login,
    logout,
    handleInvalid,
    refetchSession,
  };
};
