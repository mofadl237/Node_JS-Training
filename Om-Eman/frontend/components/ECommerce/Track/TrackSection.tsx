"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/Animation/FadeIn";
import { Spotlight } from "@/components/Animation/Spotlight";
import TrackItems from "@/components/ECommerce/Track/TrackItems";
import TrackLookupForm from "@/components/ECommerce/Track/TrackLookupForm";
import TrackState from "@/components/ECommerce/Track/TrackState";
import TrackSummary from "@/components/ECommerce/Track/TrackSummary";
import TrackTimeline from "@/components/ECommerce/Track/TrackTimeline";
import { TRACK_CARD_CLASS } from "@/components/ECommerce/Track/trackStyles";
import { useTrackLookup } from "@/hooks/useTrackLookup";

const TrackSection = () => {
  const t = useTranslations("track");
  const lookup = useTrackLookup();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up space-y-2">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="max-w-2xl text-ink-soft">{t("subtitle")}</p>
      </div>

      <Spotlight className={TRACK_CARD_CLASS}>
        <section aria-labelledby="track-lookup-title" className="relative z-10">
          <h2 id="track-lookup-title" className="font-display text-xl text-ink">
            {t("lookup.title")}
          </h2>
          <div className="mt-4">
            <TrackLookupForm
              onLookup={lookup.lookup}
              onUseReceipt={lookup.useReceipt}
              hasReceipt={lookup.hasReceipt}
              isUsingReceipt={lookup.isUsingReceipt}
              isLoading={lookup.isLoading}
              showValidation={lookup.status === "validation"}
            />
          </div>
        </section>
      </Spotlight>

      <TrackState status={lookup.status} errorKey={lookup.errorKey} />

      {lookup.status === "success" && lookup.order ? (
        <FadeIn className="space-y-6" direction="up">
          <TrackSummary order={lookup.order} />
          <TrackTimeline order={lookup.order} />
          <TrackItems items={lookup.order.items} />
        </FadeIn>
      ) : null}
    </div>
  );
};

export default memo(TrackSection);
