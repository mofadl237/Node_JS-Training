"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Shake } from "@/components/Animation/Shake";
import AccountProfile from "@/components/ECommerce/Account/AccountProfile";
import { ACCOUNT_CARD_CLASS } from "@/components/ECommerce/Account/accountStyles";
import AccountSkeleton from "@/components/Skelton/AccountSkeleton";
import { buttonVariants } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Link } from "@/i18n/navigation";
import type { TCustomerAuthStatus } from "@/hooks/useCustomerAuth";
import type { IStoreCustomer } from "@/interface";
import { ACCOUNT_LOGIN_HREF, ACCOUNT_REGISTER_HREF } from "@/lib/routes";

interface IProps {
  customer: IStoreCustomer | null;
  errorKey: string | null;
  isLoggingOut: boolean;
  onLogout: () => void;
  onRetry: () => void;
  status: TCustomerAuthStatus;
}

const AccountState = ({
  customer,
  errorKey,
  isLoggingOut,
  onLogout,
  onRetry,
  status,
}: IProps) => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const tCommon = useTranslations("common");

  if (status === "loading") {
    return (
      <div role="status" aria-live="polite" className="animate-fade-up [animation-delay:60ms]">
        <span className="sr-only">{tCommon("loading")}</span>
        <AccountSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="animate-fade-up [animation-delay:60ms]">
        <Shake isShaking={Boolean(errorKey)}>
          <ErrorState
            title={t("title")}
            body={errorKey ? tRoot(errorKey) : t("errors.unexpected")}
            className={ACCOUNT_CARD_CLASS}
            action={
              <Button type="button" variant="soft" onClick={onRetry}>
                {tRoot("errors.retry")}
              </Button>
            }
          />
        </Shake>
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div className="animate-fade-up [animation-delay:120ms]">
        <EmptyState
          title={t("title")}
          body={t("subtitle")}
          className={ACCOUNT_CARD_CLASS}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={ACCOUNT_LOGIN_HREF} className={buttonVariants()}>
                {t("login.title")}
              </Link>
              <Link href={ACCOUNT_REGISTER_HREF} className={buttonVariants({ variant: "soft" })}>
                {t("register.title")}
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return customer ? (
    <div className="animate-fade-up [animation-delay:120ms]">
      <AccountProfile customer={customer} isLoggingOut={isLoggingOut} onLogout={onLogout} />
    </div>
  ) : null;
};

export default memo(AccountState);
