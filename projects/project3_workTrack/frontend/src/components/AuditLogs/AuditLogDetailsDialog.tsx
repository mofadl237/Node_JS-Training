"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IAuditLog, TRole } from "@/src/lib/api/types";
import { formatDateTime } from "@/src/lib/format/date";
import { Button } from "@/src/components/ui/Button/Button";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { formatAuditDetails, formatAuditValue } from "./format";
import styles from "./AuditLogDetailsDialog.module.scss";

interface IAuditLogDetailsDialogProps {
  log: IAuditLog | null;
  onClose: () => void;
}

export function AuditLogDetailsDialog({
  log,
  onClose,
}: IAuditLogDetailsDialogProps) {
  const t = useTranslations("AuditLogs");
  const common = useTranslations("Common");
  const locale = useLocale();

  if (!log) return null;

  const details = formatAuditDetails(log.details);
  const roleLabels: Record<TRole, string> = {
    ADMIN: t("roles.ADMIN"),
    HR: t("roles.HR"),
    MANAGER: t("roles.MANAGER"),
  };

  return (
    <Modal
      isOpen
      title={t("details.title")}
      description={t("details.description")}
      closeLabel={common("close")}
      footer={
        <Button variant="secondary" onClick={onClose}>
          {t("details.close")}
        </Button>
      }
      onClose={onClose}
    >
      <dl className={styles.meta}>
        <div className={styles.item}>
          <dt>{t("details.action")}</dt>
          <dd>{formatAuditValue(log.action)}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t("details.entity")}</dt>
          <dd>{formatAuditValue(log.entity)}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t("details.entityId")}</dt>
          <dd className={styles.mono}>{log.entityId ?? t("noEntityId")}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t("details.createdAt")}</dt>
          <dd>{formatDateTime(log.createdAt, locale)}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t("details.user")}</dt>
          <dd>{log.user?.name ?? t("system")}</dd>
        </div>
        {log.user && (
          <>
            <div className={styles.item}>
              <dt>{t("details.email")}</dt>
              <dd>{log.user.email}</dd>
            </div>
            <div className={styles.item}>
              <dt>{t("details.role")}</dt>
              <dd>{roleLabels[log.user.role]}</dd>
            </div>
          </>
        )}
      </dl>

      <section className={styles.details}>
        <h3 className={styles.detailsTitle}>{t("details.details")}</h3>
        {details ? (
          <pre className={styles.code}>{details}</pre>
        ) : (
          <p className={styles.empty}>{t("details.noDetails")}</p>
        )}
      </section>
    </Modal>
  );
}
