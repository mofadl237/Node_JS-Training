"use client";

import { Activity } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { IDashboardAuditLog } from "@/src/lib/api/types";
import { formatDateTime } from "@/src/lib/format/date";
import { DashboardPanel } from "./DashboardPanel";
import styles from "./DashboardRecentActivity.module.scss";

interface IDashboardRecentActivityProps {
  logs: IDashboardAuditLog[];
}

const formatAction = (action: string): string =>
  action.replace(/_/g, " ").toLowerCase();

export function DashboardRecentActivity({
  logs,
}: IDashboardRecentActivityProps) {
  const t = useTranslations("Dashboard.audit");
  const locale = useLocale();

  return (
    <DashboardPanel title={t("title")} description={t("description")}>
      {logs.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : (
        <ul className={styles.list}>
          {logs.map((log) => (
            <li key={log.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                <Activity size={16} />
              </span>
              <div className={styles.content}>
                <p className={styles.action}>
                  <strong>{formatAction(log.action)}</strong>
                  <span>{log.entity}</span>
                </p>
                <p className={styles.meta}>
                  {log.user?.name ?? t("system")} ·{" "}
                  {formatDateTime(log.createdAt, locale)}
                </p>
              </div>
              {log.entityId && (
                <span className={styles.entityId} title={log.entityId}>
                  {log.entityId.slice(0, 8)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
