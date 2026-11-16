"use client";

import { useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { SPRING_CARD } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IProps {
  className?: string;
}

export const BackToTop = ({ className }: IProps) => {
  // 1- state
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("common");
  const { scrollY } = useScroll();

  // 2- handlers
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > window.innerHeight);
  });

  const onScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3- render
  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          type="button"
          onClick={onScrollTop}
          aria-label={t("backToTop")}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={SPRING_CARD}
          className={cn(
            "fixed bottom-6 end-6 z-50 grid size-12 place-items-center rounded-full bg-primary text-on-primary shadow-floating transition-transform duration-150 hover:scale-105",
            className,
          )}
        >
          <ArrowUp className="size-5" />
        </m.button>
      )}
    </AnimatePresence>
  );
};
