"use client";

import { memo } from "react";
import { m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { StoreImage } from "@/components/shared/StoreImage";
import { useRotatingIndex } from "@/hooks/useRotatingIndex";
import { HERO_SLIDES } from "@/lib/brandAssets";

const SLIDE_INTERVAL_MS = 3600;

const HeroSlider = () => {
  const t = useTranslations("home.hero");
  const reduceMotion = useReducedMotion();
  const activeIndex = useRotatingIndex(HERO_SLIDES.length, SLIDE_INTERVAL_MS);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-ink">
      {HERO_SLIDES.map((slide, index) => (
        <m.div
          key={slide}
          initial={false}
          animate={{ opacity: index === activeIndex ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <StoreImage
            src={slide}
            alt={t("imageAlt")}
            sizes="100vw"
            preload
            className="object-cover object-center"
          />
        </m.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/15 to-ink/5" />
      <div className="absolute -start-24 top-10 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -end-20 bottom-10 size-72 rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
};

export default memo(HeroSlider);
