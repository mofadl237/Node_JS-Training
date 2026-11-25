import { memo } from "react";
import { useTranslations } from "next-intl";
import { ACCOUNT_MUTED_CARD_CLASS } from "@/components/ECommerce/Account/accountStyles";
import type { IStoreCustomer } from "@/interface";
import { cn } from "@/lib/utils";

interface IProps {
  customer: IStoreCustomer;
  isVerified: boolean;
}

const AccountProfileDetails = ({ customer, isVerified }: IProps) => {
  const t = useTranslations("account.profile");
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  const displayName = name || customer.email || customer.phone || "";

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className={cn(ACCOUNT_MUTED_CARD_CLASS, "animate-fade-up", "[animation-delay:120ms]")}>
        <p className="text-xs text-ink-soft">{t("name")}</p>
        <p className="mt-1 break-words text-ink">{displayName}</p>
      </div>
      {customer.email ? (
        <div className={cn(ACCOUNT_MUTED_CARD_CLASS, "animate-fade-up", "[animation-delay:180ms]")}>
          <p className="text-xs text-ink-soft">{t("email")}</p>
          <p className="mt-1 break-all text-ink">{customer.email}</p>
        </div>
      ) : null}
      {customer.phone ? (
        <div className={cn(ACCOUNT_MUTED_CARD_CLASS, "animate-fade-up", "[animation-delay:240ms]")}>
          <p className="text-xs text-ink-soft">{t("phone")}</p>
          <p className="mt-1 text-ink">{customer.phone}</p>
        </div>
      ) : null}
      <div className={cn(ACCOUNT_MUTED_CARD_CLASS, "animate-fade-up", "[animation-delay:300ms]")}>
        <p className="text-xs text-ink-soft">{t("status")}</p>
        <p className="mt-1 text-ink">{isVerified ? t("verified") : t("notVerified")}</p>
      </div>
    </div>
  );
};

export default memo(AccountProfileDetails);
