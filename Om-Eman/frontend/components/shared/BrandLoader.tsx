"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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
      <svg
        viewBox="0 0 120 160"
        className={cn(compact ? "h-20 w-14" : "h-32 w-24", "text-primary")}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="jar-inner-clip">
            <path d="M34 54h52v70a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14V54z" />
          </clipPath>
        </defs>
        <rect x="40" y="28" width="40" height="10" rx="4" className="fill-surface-2 stroke-ink/20" />
        <rect x="36" y="36" width="48" height="12" rx="5" className="fill-surface stroke-ink/25" />
        <path
          d="M30 50h60v78a16 16 0 0 1-16 16H46a16 16 0 0 1-16-16V50z"
          className="fill-surface/40 stroke-ink/30"
          strokeWidth="2.5"
        />
        <g clipPath="url(#jar-inner-clip)">
          <g className="jar-fill-anim">
            <rect x="28" y="34" width="64" height="110" className="fill-accent/35" />
            <path
              d="M28 58c10-8 18 8 28 0s18 8 28 0s18 8 28 0v80H28z"
              className="fill-primary/35"
            />
            <circle cx="46" cy="78" r="3" className="fill-accent herb-float" />
            <circle cx="66" cy="72" r="2.5" className="fill-primary herb-float" style={{ animationDelay: "0.4s" }} />
            <circle cx="78" cy="86" r="2.5" className="fill-accent herb-float" style={{ animationDelay: "0.8s" }} />
            <path d="M54 86c4-6 8-6 10 0c-4 3-7 3-10 0z" className="fill-primary/70 herb-float" style={{ animationDelay: "1s" }} />
            <path d="M40 96c3-5 7-5 9 0c-3 2-6 2-9 0z" className="fill-accent/70 herb-float" style={{ animationDelay: "1.4s" }} />
          </g>
        </g>
        <path
          d="M38 58c0 20-4 44 6 70M82 58c0 20 4 44-6 70"
          className="stroke-ink/10"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="38" y="88" width="44" height="18" rx="6" className="fill-paper/90 stroke-primary/30" />
        <text x="60" y="100" textAnchor="middle" className="fill-ink font-body text-[9px] font-semibold">
          {"\u0623\u0645 \u0625\u064A\u0645\u0627\u0646"}
        </text>
      </svg>
      <span className={cn(compact ? "text-xs" : "text-sm", "font-medium")}>{resolvedLabel}</span>
    </div>
  );
};
