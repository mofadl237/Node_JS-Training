"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/src/i18n/navigation";
import { useLogoutMutation } from "@/src/lib/api/auth-api";
import { baseApi } from "@/src/lib/api/base-api";
import { tokenStorage } from "@/src/lib/auth/token-storage";
import { clearSession } from "@/src/Store/auth-slice";
import { useAppDispatch } from "@/src/Store/hooks";

export const useLogout = () => {
  const t = useTranslations("Shell");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    const session = tokenStorage.read();

    try {
      if (session?.refreshToken) {
        await logout({ refreshToken: session.refreshToken }).unwrap();
      }

      toast.success(t("logoutSuccess"));
    } catch {
      toast.error(t("logoutError"));
    } finally {
      tokenStorage.clear();
      dispatch(clearSession());
      dispatch(baseApi.util.resetApiState());
      router.replace("/login");
    }
  }, [dispatch, logout, router, t]);

  return { handleLogout, isLoggingOut: isLoading };
};
