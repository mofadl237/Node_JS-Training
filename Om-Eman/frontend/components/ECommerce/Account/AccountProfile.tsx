"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import AccountProfileDetails from "@/components/ECommerce/Account/AccountProfileDetails";
import AccountQuickLinks from "@/components/ECommerce/Account/AccountQuickLinks";
import AccountStatusPill from "@/components/ECommerce/Account/AccountStatusPill";
import { ACCOUNT_GLOW_CARD_CLASS } from "@/components/ECommerce/Account/accountStyles";
import { GlowCard } from "@/components/shared/GlowCard";
import { Button } from "@/components/ui/Button";
import type { IStoreCustomer } from "@/interface";

interface IProps {
  customer: IStoreCustomer;
  isLoggingOut: boolean;
  onLogout: () => void;
}

const AccountProfile = ({ customer, isLoggingOut, onLogout }: IProps) => {
  const t = useTranslations("account");
  const isVerified = Boolean(customer.emailVerifiedAt);

  return (
    <GlowCard accent="card-1" isBeamActive className={ACCOUNT_GLOW_CARD_CLASS}>
      <section aria-labelledby="account-profile-title" className="relative z-10">
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
          <h2 id="account-profile-title" className="font-display text-xl text-ink">
            {t("profile.title")}
          </h2>
          <AccountStatusPill isVerified={isVerified} />
        </div>
        <AccountProfileDetails customer={customer} isVerified={isVerified} />
        <AccountQuickLinks />
        <Button
          type="button"
          variant="soft"
          onClick={onLogout}
          isLoading={isLoggingOut}
          className="animate-fade-up [animation-delay:360ms] mt-6 transition-all duration-200 hover:shadow-hover"
        >
          <LogOut aria-hidden className="size-4" />
          {t("actions.logout")}
        </Button>
      </section>
    </GlowCard>
  );
};

export default memo(AccountProfile);
