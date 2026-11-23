"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import { PriceTag } from "@/components/shared/PriceTag";
import { Skeleton } from "@/components/ui/Skeleton";
import type { IShippingQuote } from "@/interface";

interface IProps {
  governorate: string;
  city: string;
  isLoading: boolean;
  quote: IShippingQuote | null;
  errorKey?: string;
}

const CheckoutShipping = ({
  governorate,
  city,
  isLoading,
  quote,
  errorKey,
}: IProps) => {
  const t = useTranslations();
  const hasSelectedArea = governorate.length > 0 && city.length > 0;

  let content;
  if (!hasSelectedArea) {
    content = <p className="text-sm text-ink-soft">{t("checkout.selectAreaFirst")}</p>;
  } else if (isLoading) {
    content = (
      <div className="space-y-2" aria-hidden="true">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  } else if (errorKey) {
    content = (
      <p role="alert" className="text-sm text-danger">
        {t(errorKey)}
      </p>
    );
  } else if (quote) {
    content = (
      <div className="space-y-2">
        <PriceTag price={quote.cost} />
        <p className="text-sm text-ink-soft">
          {t("checkout.eta", {
            min: quote.etaMinDays,
            max: quote.etaMaxDays,
          })}
        </p>
      </div>
    );
  } else {
    content = (
      <p className="text-sm text-ink-soft">{t("checkout.shippingUnavailable")}</p>
    );
  }

  return (
    <CheckoutFocusSection id="checkout-shipping" className="space-y-3">
      <h2 className="font-display text-xl text-ink">
        {t("checkout.shippingTitle")}
      </h2>
      <div aria-live="polite">{content}</div>
    </CheckoutFocusSection>
  );
};

export default memo(CheckoutShipping);
