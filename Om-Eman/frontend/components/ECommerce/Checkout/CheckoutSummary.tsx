"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { BorderBeam } from "@/components/Animation/BorderBeam";
import { Spotlight } from "@/components/Animation/Spotlight";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import { PriceTag } from "@/components/shared/PriceTag";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ICouponPreview, IShippingQuote } from "@/interface";

interface IProps {
  cartSubtotal: string;
  itemsCount: number;
  couponPreview: ICouponPreview | null;
  quote: IShippingQuote | null;
  isQuoteLoading: boolean;
  quoteErrorKey?: string;
}

const CheckoutSummary = ({
  cartSubtotal,
  itemsCount,
  couponPreview,
  quote,
  isQuoteLoading,
  quoteErrorKey,
}: IProps) => {
  const t = useTranslations();
  const hasResponse = Boolean(quote || couponPreview);

  return (
    <CheckoutFocusSection
      id="checkout-summary"
      className="space-y-0 bg-transparent p-0 shadow-none"
    >
      <Spotlight className="rounded-lg">
        <div className="relative space-y-4 rounded-lg bg-surface p-4 shadow-rest">
          <BorderBeam isActive={hasResponse} />
          <h2 className="font-display text-xl text-ink">
            {t("checkout.summaryTitle")}
          </h2>
          <dl className="divide-y divide-ink/10 text-sm">
            <div className="flex items-center justify-between gap-3 py-2">
              <dt className="text-ink-soft">{t("checkout.itemsCount")}</dt>
              <dd className="font-semibold text-ink">{itemsCount}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <dt className="text-ink-soft">{t("checkout.subtotal")}</dt>
              <dd>
                <PriceTag price={couponPreview?.subtotal ?? cartSubtotal} />
              </dd>
            </div>
            {couponPreview ? (
              <>
                <div className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-ink-soft">
                    {t("checkout.discount", { code: couponPreview.couponCode })}
                  </dt>
                  <dd>
                    <PriceTag price={couponPreview.discount} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-ink-soft">{t("checkout.discountedSubtotal")}</dt>
                  <dd>
                    <PriceTag price={couponPreview.discountedSubtotal} />
                  </dd>
                </div>
              </>
            ) : null}
            <div className="flex items-center justify-between gap-3 py-2">
              <dt className="text-ink-soft">{t("checkout.shipping")}</dt>
              <dd>
                {quote ? (
                  <PriceTag price={quote.cost} />
                ) : isQuoteLoading ? (
                  <Skeleton className="h-5 w-20" aria-hidden="true" />
                ) : (
                  <span className="text-ink-soft">
                    {quoteErrorKey ? t(quoteErrorKey) : t("checkout.shippingPending")}
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-ink-soft">{t("checkout.finalTotalNote")}</p>
        </div>
      </Spotlight>
    </CheckoutFocusSection>
  );
};

export default memo(CheckoutSummary);
