"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IDashboardLeaves } from "@/src/lib/api/types";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardPanel } from "./DashboardPanel";

interface IDashboardLeavesPanelProps {
  leaves: IDashboardLeaves;
}

export function DashboardLeavesPanel({ leaves }: IDashboardLeavesPanelProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const metrics = [
    {
      label: t("metrics.activeLeaves"),
      value: formatNumber(leaves.activeLeaves, locale),
    },
    {
      label: t("metrics.todayLeaves"),
      value: formatNumber(leaves.todayLeaves, locale),
    },
  ];

  return (
    <DashboardPanel
      title={t("panels.leaves")}
      description={t("panels.leavesDescription")}
    >
      <DashboardMetrics items={metrics} />
    </DashboardPanel>
  );
}
