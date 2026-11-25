"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check, Clock3 } from "lucide-react";
import { PulseRing } from "@/components/Animation/PulseRing";
import { cn } from "@/lib/utils";

interface IProps {
  isVerified: boolean;
}

const AccountStatusPill = ({ isVerified }: IProps) => {
  const t = useTranslations("account.profile");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-300",
        isVerified ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
      )}
    >
      <PulseRing
        ringClassName={isVerified ? "bg-success" : "bg-primary"}
        className="grid size-4 place-items-center"
      >
        {isVerified ? (
          <Check aria-hidden="true" className="checkout-check-draw size-3.5" strokeWidth={3} />
        ) : (
          <Clock3 aria-hidden="true" className="size-3.5 animate-fade-up" />
        )}
      </PulseRing>
      {isVerified ? t("verified") : t("notVerified")}
    </span>
  );
};

export default memo(AccountStatusPill);
