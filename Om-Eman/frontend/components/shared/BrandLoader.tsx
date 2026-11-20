"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { OmEmanJarIcon } from "@/components/Brand/OmEmanJarIcon";

interface IProps {
  className?: string;
  compact?: boolean;
  label?: string;
}

export const BrandLoader = ({ className, compact = false, label }: IProps) => {
  // 1- state
  const t = useTranslations("common");
  const resolvedLabel = label ?? t("loading");

  // 3- render
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("flex flex-col items-center justify-center gap-3 text-ink-soft", className)}
    >
      <OmEmanJarIcon
        animated
        decorative
        size={compact ? 80 : 112}
        className={cn(compact ? "h-20 w-[61px]" : "h-28 w-[85px]", "text-primary")}
      />
      <span className={cn(compact ? "text-xs" : "text-sm", "font-medium")}>{resolvedLabel}</span>
    </div>
  );
};
