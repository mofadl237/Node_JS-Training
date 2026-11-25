"use client";

import { memo } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CountUp } from "@/components/Animation/CountUp";
import { Spotlight } from "@/components/Animation/Spotlight";
import TrackStatusBadge from "@/components/ECommerce/Track/TrackStatusBadge";
import {
  TRACK_CARD_CLASS,
  TRACK_MUTED_CARD_CLASS,
} from "@/components/ECommerce/Track/trackStyles";
import type { ITrackedOrder } from "@/interface";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import {
  formatTrackDate,
  trackEtaMessage,
  trackPaymentStatusKey,
  trackStatusKey,
} from "@/lib/trackFormat";
import { cn } from "@/lib/utils";

interface IProps {
  order: ITrackedOrder;
}

const TrackSummary = ({ order }: IProps) => {
  const t = useTranslations("track");
  const tRoot = useTranslations();
  const locale = useLocale();
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const placedAt = formatTrackDate(order.placedAt, safeLocale);
  const deliveredAt = formatTrackDate(order.deliveredAt, safeLocale);
  const eta = trackEtaMessage(order.etaMinDays, order.etaMaxDays);
  const statusText = tRoot(trackStatusKey(order.status));

  const etaText = (): string => {
    if (eta.key === "track.eta.pending" || !eta.values) return tRoot(eta.key);
    if (eta.key === "track.eta.single" && eta.values.days !== undefined) {
      return tRoot(eta.key, { days: eta.values.days });
    }
    if (eta.values.min !== undefined && eta.values.max !== undefined) {
      return tRoot("track.eta.range", { min: eta.values.min, max: eta.values.max });
    }
    return tRoot("track.eta.pending");
  };

  const etaVisual = (): ReactNode => {
    if (eta.key === "track.eta.pending" || !eta.values) return etaText();
    if (eta.key === "track.eta.single" && eta.values.days !== undefined) {
      return (
        <span className="inline-flex items-center gap-1">
          <CountUp value={eta.values.days} />
          <span>{t("eta.unit")}</span>
        </span>
      );
    }
    if (eta.values.min !== undefined && eta.values.max !== undefined) {
      return (
        <span className="inline-flex flex-wrap items-center gap-1">
          <CountUp value={eta.values.min} />
          <span>{t("eta.to")}</span>
          <CountUp value={eta.values.max} />
          <span>{t("eta.unit")}</span>
        </span>
      );
    }
    return etaText();
  };

  return (
    <Spotlight className={TRACK_CARD_CLASS}>
      <section aria-labelledby="track-summary-title" className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="track-summary-title" className="font-display text-xl text-ink">
            {t("title")}
          </h2>
          <TrackStatusBadge status={order.status} label={statusText} />
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className={TRACK_MUTED_CARD_CLASS}>
            <dt className="text-ink-soft">{t("summary.orderNumber")}</dt>
            <dd className="break-all font-semibold text-ink">{order.orderNumber}</dd>
          </div>
          <div className={TRACK_MUTED_CARD_CLASS}>
            <dt className="text-ink-soft">{t("summary.status")}</dt>
            <dd className="font-semibold text-ink">{statusText}</dd>
          </div>
          <div className={TRACK_MUTED_CARD_CLASS}>
            <dt className="text-ink-soft">{t("summary.paymentStatus")}</dt>
            <dd className="font-semibold text-ink">
              {tRoot(trackPaymentStatusKey(order.paymentStatus))}
            </dd>
          </div>
          {placedAt ? (
            <div className={TRACK_MUTED_CARD_CLASS}>
              <dt className="text-ink-soft">{t("summary.placedAt")}</dt>
              <dd className="font-semibold text-ink">{placedAt}</dd>
            </div>
          ) : null}
          <div className={TRACK_MUTED_CARD_CLASS}>
            <dt className="text-ink-soft">{t("summary.deliveredAt")}</dt>
            <dd className="font-semibold text-ink">{deliveredAt ?? t("summary.notDelivered")}</dd>
          </div>
          <div className={cn(TRACK_MUTED_CARD_CLASS, "bg-primary/10")}>
            <dt className="text-ink-soft">{t("eta.title")}</dt>
            <dd className="font-semibold text-ink">
              <span className="sr-only">{etaText()}</span>
              <span aria-hidden="true">{etaVisual()}</span>
            </dd>
          </div>
        </dl>
      </section>
    </Spotlight>
  );
};

export default memo(TrackSummary);
