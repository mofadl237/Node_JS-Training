"use client";

import { Clock3, Timer, UserX, Activity } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { IDashboardAttendanceStats } from "@/src/lib/api/types";
import { formatMinutes } from "@/src/lib/format/duration";
import { DashboardStatCard } from "./DashboardStatCard";
import styles from "./DashboardKpis.module.scss";

interface IDashboardKpisProps {
  stats: IDashboardAttendanceStats;
}

export function DashboardKpis({ stats }: IDashboardKpisProps) {
  const t = useTranslations("Dashboard.kpis");
  const locale = useLocale();
  const formatPercent = (value: number): string =>
    `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(value)}%`;
  const attended = stats.present + stats.late + stats.halfDay;

  return (
    <div className={styles.grid}>
      <DashboardStatCard
        label={t("attendanceRate")}
        value={formatPercent(stats.attendanceRate)}
        hint={t("attendanceHint", {
          attended,
          total: stats.totalRecords,
        })}
        icon={<Activity size={18} />}
        tone="brand"
      />
      <DashboardStatCard
        label={t("lateRate")}
        value={formatPercent(stats.lateRate)}
        hint={t("lateHint", { count: stats.late })}
        icon={<Clock3 size={18} />}
        tone="warning"
      />
      <DashboardStatCard
        label={t("absenceRate")}
        value={formatPercent(stats.absenceRate)}
        hint={t("absenceHint", { count: stats.absent })}
        icon={<UserX size={18} />}
        tone="danger"
      />
      <DashboardStatCard
        label={t("averageWorking")}
        value={formatMinutes(stats.averageWorkingMinutes)}
        hint={t("averageWorkingHint", {
          total: formatMinutes(stats.totalWorkingMinutes),
        })}
        icon={<Timer size={18} />}
        tone="info"
      />
    </div>
  );
}
