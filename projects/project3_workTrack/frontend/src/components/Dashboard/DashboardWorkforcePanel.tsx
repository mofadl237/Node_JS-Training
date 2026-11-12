"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IDashboardWorkforce } from "@/src/lib/api/types";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardPanel } from "./DashboardPanel";

interface IDashboardWorkforcePanelProps {
  workforce: IDashboardWorkforce;
}

export function DashboardWorkforcePanel({
  workforce,
}: IDashboardWorkforcePanelProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const metrics = [
    {
      label: t("metrics.totalEmployees"),
      value: formatNumber(workforce.totalEmployees, locale),
    },
    {
      label: t("metrics.activeEmployees"),
      value: formatNumber(workforce.activeEmployees, locale),
    },
    {
      label: t("metrics.inactiveEmployees"),
      value: formatNumber(workforce.inactiveEmployees, locale),
    },
    {
      label: t("metrics.departments"),
      value: formatNumber(workforce.totalDepartments, locale),
    },
    {
      label: t("metrics.shifts"),
      value: formatNumber(workforce.totalShifts, locale),
    },
  ];

  return (
    <DashboardPanel
      title={t("panels.workforce")}
      description={t("panels.workforceDescription")}
    >
      <DashboardMetrics items={metrics} />
    </DashboardPanel>
  );
}
