"use client";

import { memo } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { GlowCard } from "@/components/shared/GlowCard";
import { Skeleton } from "@/components/ui/Skeleton";
import LoginForm from "@/components/Dashboard/Auth/LoginForm";
import { useAdminLogin } from "@/hooks/useAdminLogin";

const LoginCard = () => {
  const t = useTranslations("dashboard.login");
  const tRoot = useTranslations();
  const auth = useAdminLogin();

  const shell = (children: ReactNode) => (
    <GlowCard accent="card-2" className="w-full max-w-md p-6 md:p-8">
      {children}
    </GlowCard>
  );

  if (auth.sessionStatus === "loading") {
    return shell(
      <div className="animate-fade-up space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>,
    );
  }

  if (auth.sessionStatus === "error") {
    return shell(
      <ErrorState
        title={t("sessionError.title")}
        body={auth.sessionErrorKey ? tRoot(auth.sessionErrorKey) : t("sessionError.body")}
        action={
          <Button onClick={auth.refetchSession} variant="soft">
            {t("retry")}
          </Button>
        }
      />,
    );
  }

  if (auth.sessionStatus === "authenticated") {
    return shell(
      <div className="animate-fade-up space-y-4 text-center">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-soft">{t("status.redirecting")}</p>
        <Button
          variant="soft"
          isLoading={auth.isLoggingOut}
          onClick={() => void auth.logout()}
        >
          {t("signOut")}
        </Button>
      </div>,
    );
  }

  return shell(
    <div className="space-y-6">
      <div className="animate-fade-up space-y-1">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <p className="text-sm text-ink-soft">{t("subtitle")}</p>
      </div>
      <LoginForm auth={auth} />
    </div>,
  );
};

export default memo(LoginCard);
