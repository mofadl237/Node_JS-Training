"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/Animation/CountUp";
import { calculateSavingsPercent, formatPriceAmount } from "@/lib/price";
import { cn } from "@/lib/utils";

interface IProps {
  price: string;
  compareAt?: string | null;
  className?: string;
}

// Product-card price (C3). Backend sends decimal strings; rendering only —
// the real cart/checkout totals come from the API. Whole amounts show no
// decimals, fractional ones two. `compareAt` renders struck-through plus a
// "saved X%" badge; the currency word comes from messages.
export const PriceTag = ({ price, compareAt = null, className }: IProps) => {
  const t = useTranslations("price");
  const tCommon = useTranslations("common");
  const numericPrice = Number(price);
  const decimals = Number.isInteger(numericPrice) ? 0 : 2;
  const savings = compareAt ? calculateSavingsPercent(price, compareAt) : null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="font-semibold text-ink">
        <CountUp value={numericPrice} decimals={decimals} suffix={` ${tCommon("currencyEgp")}`} />
      </span>
      {savings !== null && compareAt ? (
        <>
          <span className="text-sm text-ink-soft line-through">
            {formatPriceAmount(compareAt)} {tCommon("currencyEgp")}
          </span>
          <Badge variant="accent">{t("savedPercent", { percent: savings })}</Badge>
        </>
      ) : null}
    </div>
  );
};
