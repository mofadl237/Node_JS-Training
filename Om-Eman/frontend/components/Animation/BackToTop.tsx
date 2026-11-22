"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { SPRING_CARD } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScrollProgressRing } from "./ScrollProgressRing";

interface IProps {
  className?: string;
}

const subscribe = () => () => {};

export const BackToTop = ({ className }: IProps) => {
  // 1- state
  const [isVisible, setIsVisible] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const t = useTranslations("common");
  const { scrollY, scrollYProgress } = useScroll();

  // 2- handlers
  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextVisible = latest > 10;
    setIsVisible((current) => (current === nextVisible ? current : nextVisible));
  });

  const onScrollTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  // 3- render
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible ? (
        <m.button
          type="button"
          onClick={onScrollTop}
          aria-label={t("backToTop")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={SPRING_CARD}
          className={cn(
            "fixed bottom-6 end-6 z-50 grid size-12 cursor-pointer place-items-center overflow-hidden rounded-full bg-transparent text-ink shadow-rest transition-transform duration-150 hover:scale-105",
            className,
          )}
        >
          <ScrollProgressRing progress={scrollYProgress} />
          <ArrowUp aria-hidden="true" className="relative size-5 text-ink-strong" />
        </m.button>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
