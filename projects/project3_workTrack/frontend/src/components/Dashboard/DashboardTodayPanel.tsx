"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IDashboardTodayStats } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardPanel } from "./DashboardPanel";

interface IDashboardTodayPanelProps {
  today: IDashboardTodayStats;
}

export function DashboardTodayPanel({ today }: IDashboardTodayPanelProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const date = formatDateOnly(today.date, locale);
  const metrics = [
    {
      label: t("metrics.totalRecords"),
      value: formatNumber(today.totalRecords, locale),
    },
    {
      label: t("metrics.present"),
      value: formatNumber(today.present, locale),
    },
    {
      label: t("metrics.late"),
      value: formatNumber(today.late, locale),
    },
    {
      label: t("metrics.absent"),
      value: formatNumber(today.absent, locale),
    },
    {
      label: t("metrics.halfDay"),
      value: formatNumber(today.halfDay, locale),
    },
    {
      label: t("metrics.onLeave"),
      value: formatNumber(today.onLeave, locale),
    },
    {
      label: t("metrics.attendanceRate"),
      value: `${formatNumber(today.attendanceRate, locale, {
        maximumFractionDigits: 1,
      })}%`,
    },
  ];

  return (
    <DashboardPanel
      title={t("panels.today")}
      description={t("panels.todayDescription", { date })}
    >
      <DashboardMetrics items={metrics} />
    </DashboardPanel>
  );
}
