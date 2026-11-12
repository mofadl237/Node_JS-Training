"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IDashboardAttendanceStats } from "@/src/lib/api/types";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardPanel } from "./DashboardPanel";
import styles from "./DashboardAttendancePanel.module.scss";

interface IDashboardAttendancePanelProps {
  stats: IDashboardAttendanceStats;
}

type TAttendanceTone = "success" | "warning" | "danger" | "info" | "brand";

export function DashboardAttendancePanel({
  stats,
}: IDashboardAttendancePanelProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const rows: Array<{
    key: string;
    label: string;
    value: number;
    tone: TAttendanceTone;
  }> = [
    {
      key: "present",
      label: t("metrics.present"),
      value: stats.present,
      tone: "success",
    },
    {
      key: "late",
      label: t("metrics.late"),
      value: stats.late,
      tone: "warning",
    },
    {
      key: "absent",
      label: t("metrics.absent"),
      value: stats.absent,
      tone: "danger",
    },
    {
      key: "halfDay",
      label: t("metrics.halfDay"),
      value: stats.halfDay,
      tone: "info",
    },
    {
      key: "onLeave",
      label: t("metrics.onLeave"),
      value: stats.onLeave,
      tone: "brand",
    },
  ];
  const total = stats.totalRecords;

  return (
    <DashboardPanel
      title={t("panels.attendance")}
      description={t("panels.attendanceDescription")}
    >
      <div className={styles.total}>
        <span>{t("metrics.totalRecords")}</span>
        <strong>{formatNumber(total, locale)}</strong>
      </div>

      <div className={styles.list}>
        {rows.map((row) => {
          const percentage = total > 0 ? (row.value / total) * 100 : 0;

          return (
            <div key={row.key} className={styles.row}>
              <div className={styles.rowHeader}>
                <span>{row.label}</span>
                <strong>{formatNumber(row.value, locale)}</strong>
              </div>
              <div className={styles.track}>
                <span
                  className={[styles.fill, styles[row.tone]].join(" ")}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardPanel>
  );
}
