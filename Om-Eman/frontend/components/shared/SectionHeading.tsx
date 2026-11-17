"use client";

import { useLocale } from "next-intl";
import { m } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { getLocaleDirection, isLocale } from "@/lib/locale";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  className?: string;
}

// Section title (C4) with a decorative rule that fills via scaleX the first
// time it enters the viewport. The fill grows from the reading start side:
// inline-start in RTL (right) vs inline-start in LTR (left).
export const SectionHeading = ({ title, subtitle, as = "h2", className }: IProps) => {
  const locale = useLocale();
  const isRtl = getLocaleDirection(isLocale(locale) ? locale : routing.defaultLocale) === "rtl";
  const Title = as;

  return (
    <div className={cn("space-y-2", className)}>
      <Title className="font-display text-3xl text-ink">{title}</Title>
      <m.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        style={{ transformOrigin: isRtl ? "100% 50%" : "0% 50%" }}
        className="block h-1 w-24 rounded-full bg-accent"
      />
      {subtitle ? <p className="max-w-xl text-ink-soft">{subtitle}</p> : null}
    </div>
  );
};
