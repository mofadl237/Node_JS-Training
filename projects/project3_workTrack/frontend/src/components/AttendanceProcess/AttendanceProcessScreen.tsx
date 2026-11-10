"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { AttendanceProcessForm } from "./AttendanceProcessForm";
import styles from "./AttendanceProcess.module.scss";

export function AttendanceProcessScreen() {
  const t = useTranslations("AttendanceProcess");

  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <Alert variant="info" title={t("infoTitle")}>
        {t("infoDescription")}
      </Alert>

      <AttendanceProcessForm />
    </div>
  );
}
