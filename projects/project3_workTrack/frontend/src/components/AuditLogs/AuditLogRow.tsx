"use client";

import { memo } from "react";
import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { IAuditLog } from "@/src/lib/api/types";
import { formatDateTime } from "@/src/lib/format/date";
import { formatAuditValue } from "./format";
import styles from "./AuditLogRow.module.scss";

interface IAuditLogRowProps {
  log: IAuditLog;
  index: number;
  onView: (log: IAuditLog) => void;
}

const getActionTone = (action: string): string => {
  const normalized = action.toUpperCase();

  if (normalized.includes("DELETE") || normalized.includes("REMOVE")) {
    return styles.danger;
  }

  if (
    normalized.includes("CREATE") ||
    normalized.includes("IMPORT") ||
    normalized.includes("ADD")
  ) {
    return styles.success;
  }

  if (normalized.includes("UPDATE") || normalized.includes("PATCH")) {
    return styles.warning;
  }

  if (normalized.includes("PROCESS")) return styles.info;

  return styles.neutral;
};

export const AuditLogRow = memo(function AuditLogRow({
  log,
  index,
  onView,
}: IAuditLogRowProps) {
  const t = useTranslations("AuditLogs");
  const locale = useLocale();

  return (
    <tr className={styles.row} style={{ animationDelay: `${index * 30}ms` }}>
      <td className={styles.timestampCell}>
        <time dateTime={log.createdAt}>
          {formatDateTime(log.createdAt, locale)}
        </time>
      </td>

      <td className={styles.actionCell}>
        <span
          className={[styles.actionBadge, getActionTone(log.action)]
            .filter(Boolean)
            .join(" ")}
        >
          {formatAuditValue(log.action)}
        </span>
      </td>

      <td className={styles.entityCell}>{formatAuditValue(log.entity)}</td>

      <td className={styles.entityIdCell}>
        <span title={log.entityId ?? undefined}>
          {log.entityId ?? t("noEntityId")}
        </span>
      </td>

      <td className={styles.userCell}>
        {log.user ? (
          <>
            <span className={styles.userName}>{log.user.name}</span>
            <span className={styles.userEmail}>{log.user.email}</span>
          </>
        ) : (
          <span className={styles.systemUser}>{t("system")}</span>
        )}
      </td>

      <td className={styles.detailsCell}>
        <button
          type="button"
          className={styles.viewButton}
          aria-label={t("view")}
          title={t("view")}
          onClick={() => onView(log)}
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
});
