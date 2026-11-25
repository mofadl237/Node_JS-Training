"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Spotlight } from "@/components/Animation/Spotlight";
import { EmptyState } from "@/components/shared/EmptyState";
import { TRACK_CARD_CLASS } from "@/components/ECommerce/Track/trackStyles";
import type { ITrackedOrderItem } from "@/interface";

interface IProps {
  items: ITrackedOrderItem[];
}

const TrackItems = ({ items }: IProps) => {
  const t = useTranslations("track");
  const tCommon = useTranslations("common");

  if (items.length === 0) {
    return (
      <EmptyState
        title={t("items.title")}
        body={t("items.empty")}
        className={TRACK_CARD_CLASS}
      />
    );
  }

  return (
    <Spotlight className={TRACK_CARD_CLASS}>
      <section aria-labelledby="track-items-title" className="relative z-10">
        <h2 id="track-items-title" className="font-display text-xl text-ink">
          {t("items.title")}
        </h2>
        <ul className="animate-fade-up mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.sku}
              className="rounded-md bg-paper p-3 transition-colors duration-200 hover:bg-surface-2"
            >
              <p className="break-words font-semibold text-ink">{item.productNameAr}</p>
              <p className="break-all text-sm text-ink-soft">{item.sku}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                <span>{t("items.quantity", { quantity: item.quantity })}</span>
                <span>
                  {t("items.lineTotal", {
                    amount: item.lineTotal,
                    currency: tCommon("currencyEgp"),
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Spotlight>
  );
};

export default memo(TrackItems);
