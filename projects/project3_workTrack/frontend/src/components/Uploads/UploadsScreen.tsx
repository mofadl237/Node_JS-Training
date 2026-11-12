"use client";

import { CalendarClock, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { CsvImportCard } from "./CsvImportCard";
import styles from "./Uploads.module.scss";

export function UploadsScreen() {
  const t = useTranslations("Uploads");

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

      <div className={styles.grid}>
        <CsvImportCard
          kind="employees"
          icon={<Users size={20} />}
          title={t("employees.title")}
          description={t("employees.description")}
          columns={t("employees.columns")}
        />
        <CsvImportCard
          kind="attendance"
          icon={<CalendarClock size={20} />}
          title={t("attendance.title")}
          description={t("attendance.description")}
          columns={t("attendance.columns")}
        />
      </div>
    </div>
  );
}
