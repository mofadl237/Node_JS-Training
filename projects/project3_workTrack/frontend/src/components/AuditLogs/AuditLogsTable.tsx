"use client";

import { useTranslations } from "next-intl";
import type { IAuditLog } from "@/src/lib/api/types";
import { AuditLogRow } from "./AuditLogRow";
import styles from "./AuditLogsTable.module.scss";

interface IAuditLogsTableProps {
  items: IAuditLog[];
  onView: (log: IAuditLog) => void;
}

export function AuditLogsTable({ items, onView }: IAuditLogsTableProps) {
  const t = useTranslations("AuditLogs");

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.timestamp")}</th>
            <th scope="col">{t("columns.action")}</th>
            <th scope="col">{t("columns.entity")}</th>
            <th scope="col">{t("columns.entityId")}</th>
            <th scope="col">{t("columns.user")}</th>
            <th scope="col" className={styles.detailsHeader}>
              {t("columns.details")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((log, index) => (
            <AuditLogRow
              key={log.id}
              log={log}
              index={index}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
