"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import AccountState from "@/components/ECommerce/Account/AccountState";
import { useRouter } from "@/i18n/navigation";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { ACCOUNT_LOGIN_HREF } from "@/lib/routes";

const AccountSection = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const router = useRouter();
  const { customer, errorKey, isLoggingOut, logout, refetchProfile, status } = useCustomerAuth();

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result) {
      toast.error(tRoot(result));
      return;
    }
    toast.success(t("status.loggedOut"));
    router.replace(ACCOUNT_LOGIN_HREF);
  }, [logout, router, t, tRoot]);

  const handleRetry = useCallback(() => {
    refetchProfile();
  }, [refetchProfile]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-up space-y-2">
        <span className="block h-px w-32 rounded-full bg-gradient-to-r from-primary via-accent to-glow rtl:bg-gradient-to-l" aria-hidden="true" />
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="max-w-2xl text-ink-soft">{t("subtitle")}</p>
      </div>
      <AccountState
        customer={customer}
        errorKey={errorKey}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        onRetry={handleRetry}
        status={status}
      />
    </div>
  );
};

export default memo(AccountSection);
