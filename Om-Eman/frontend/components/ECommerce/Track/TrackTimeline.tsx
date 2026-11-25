"use client";

import { memo } from "react";
import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Spotlight } from "@/components/Animation/Spotlight";
import { TRACK_CARD_CLASS } from "@/components/ECommerce/Track/trackStyles";
import type { ITrackedOrder } from "@/interface";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import { EASE_OUT } from "@/lib/motion";
import { formatTrackDate, trackStatusKey } from "@/lib/trackFormat";
import type { TTrackStatusTone } from "@/lib/trackStatusTone";
import { trackStatusTone } from "@/lib/trackStatusTone";
import { cn } from "@/lib/utils";

interface IProps {
  order: ITrackedOrder;
}

interface ITimelineItem {
  key: string;
  label: string;
  value: string;
  dateTime?: string;
  tone: TTrackStatusTone | "upcoming";
  isCurrent?: boolean;
}

const DOT_CLASS: Record<TTrackStatusTone | "upcoming", string> = {
  neutral: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  upcoming: "bg-ink/20",
};

const TrackTimeline = ({ order }: IProps) => {
  const t = useTranslations("track");
  const tRoot = useTranslations();
  const locale = useLocale();
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const placedAt = formatTrackDate(order.placedAt, safeLocale);
  const deliveredAt = formatTrackDate(order.deliveredAt, safeLocale);
  const statusLabel = tRoot(trackStatusKey(order.status));
  const statusTone = trackStatusTone(order.status);

  const items: ITimelineItem[] = [];

  if (placedAt) {
    items.push({
      key: "placed",
      label: t("summary.placedAt"),
      value: placedAt,
      dateTime: order.placedAt,
      tone: "neutral",
    });
  }

  items.push({
    key: "status",
    label: t("summary.status"),
    value: statusLabel,
    tone: statusTone,
    isCurrent: deliveredAt === null,
  });

  if (deliveredAt) {
    items.push({
      key: "delivered",
      label: t("summary.deliveredAt"),
      value: deliveredAt,
      dateTime: order.deliveredAt ?? undefined,
      tone: "success",
      isCurrent: true,
    });
  } else {
    items.push({
      key: "delivery-pending",
      label: t("summary.deliveredAt"),
      value: t("summary.notDelivered"),
      tone: "upcoming",
    });
  }

  const currentIndex = Math.max(
    0,
    items.findIndex((item) => item.isCurrent),
  );
  const progress = items.length > 1 ? (currentIndex / (items.length - 1)) * 100 : 0;

  return (
    <Spotlight className={TRACK_CARD_CLASS}>
      <section aria-labelledby="track-timeline-title" className="relative z-10">
        <h2 id="track-timeline-title" className="font-display text-xl text-ink">
          {t("summary.status")}
        </h2>
        <ol className="animate-fade-up relative ms-1 space-y-4 border-s border-primary/15 ps-5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute start-0 top-2 w-0.5 rounded-full bg-primary/15"
            style={{ height: `calc(100% - 1rem)` }}
          />
          <m.span
            aria-hidden="true"
            className="pointer-events-none absolute start-0 top-2 w-0.5 origin-top rounded-full bg-primary"
            style={{ height: `${progress}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          />
          {items.map((item) => (
            <li key={item.key} aria-current={item.isCurrent ? "step" : undefined} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute start-0 top-1.5 size-3 -translate-x-1/2 rounded-full ring-4 ring-surface rtl:translate-x-1/2",
                  DOT_CLASS[item.tone],
                )}
              />
              <div className="relative z-10 space-y-1">
                <p className="text-xs text-ink-soft">{item.label}</p>
                <p className="font-semibold text-ink">
                  {item.dateTime ? (
                    <time dateTime={item.dateTime}>{item.value}</time>
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Spotlight>
  );
};

export default memo(TrackTimeline);
