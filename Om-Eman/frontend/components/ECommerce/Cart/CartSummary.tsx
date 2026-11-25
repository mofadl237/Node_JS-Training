"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CountUp } from "@/components/Animation/CountUp";
import CartCheckoutLink from "@/components/ECommerce/Cart/CartCheckoutLink";
import { formatPriceAmount } from "@/lib/price";

interface IProps {
  subtotal: string;
  itemsCount: number;
  freeShippingThreshold: string | null;
  showCheckout: boolean;
}

const CartSummary = ({
  subtotal,
  itemsCount,
  freeShippingThreshold,
  showCheckout,
}: IProps) => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const numericSubtotal = Number(subtotal);
  const decimals = Number.isInteger(numericSubtotal) ? 0 : 2;

  return (
    <section className="space-y-3 rounded-lg bg-paper p-4" aria-label={t("summary")}>
      <p className="text-sm text-ink-soft">{t("itemCount", { count: itemsCount })}</p>
      <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <span className="text-ink">{t("subtotal")}</span>
        <CountUp
          value={numericSubtotal}
          decimals={decimals}
          suffix={` ${tCommon("currencyEgp")}`}
          className="font-semibold text-ink"
        />
      </div>
      {freeShippingThreshold !== null ? (
        <p className="text-sm text-success">
          {t("freeShipping", {
            amount: formatPriceAmount(freeShippingThreshold),
            currency: tCommon("currencyEgp"),
          })}
        </p>
      ) : null}
      {showCheckout ? (
        <div className="border-t border-ink/10 pt-3">
          <CartCheckoutLink />
        </div>
      ) : null}
    </section>
  );
};

export default memo(CartSummary);
