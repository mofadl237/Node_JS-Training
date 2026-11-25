"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Shake } from "@/components/Animation/Shake";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import TrackSkeleton from "@/components/Skelton/TrackSkeleton";
import { TRACK_CARD_CLASS } from "@/components/ECommerce/Track/trackStyles";
import type { TTrackErrorKey, TTrackLookupStatus } from "@/hooks/useTrackLookup";

interface IProps {
  status: TTrackLookupStatus;
  errorKey: TTrackErrorKey | null;
}

const TrackState = ({ status, errorKey }: IProps) => {
  const t = useTranslations("track");
  const tRoot = useTranslations();
  const tCommon = useTranslations("common");

  if (status === "loading") {
    return (
      <div role="status" aria-live="polite" className="animate-fade-up">
        <span className="sr-only">{tCommon("loading")}</span>
        <TrackSkeleton />
      </div>
    );
  }

  if (status === "initial") {
    return (
      <div className="animate-fade-up">
        <EmptyState
          title={t("lookup.title")}
          body={t("subtitle")}
          className={TRACK_CARD_CLASS}
        />
      </div>
    );
  }

  if (errorKey) {
    return (
      <div role="alert" className="animate-fade-up">
        <Shake isShaking={Boolean(errorKey)}>
          <ErrorState title={t("title")} body={tRoot(errorKey)} className={TRACK_CARD_CLASS} />
        </Shake>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="animate-fade-up">
        <EmptyState
          title={t("items.title")}
          body={t("items.empty")}
          className={TRACK_CARD_CLASS}
        />
      </div>
    );
  }

  return null;
};

export default memo(TrackState);
