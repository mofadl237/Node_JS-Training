"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IAttendanceProcessResult } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import { Alert } from "@/src/components/ui/Alert/Alert";
import styles from "./AttendanceProcess.module.scss";

interface IAttendanceProcessResultProps {
  result: IAttendanceProcessResult;
}

export function AttendanceProcessResult({
  result,
}: IAttendanceProcessResultProps) {
  const t = useTranslations("AttendanceProcess");
  const locale = useLocale();

  return (
    <div className={styles.result}>
      <Alert variant="success" title={t("successTitle")}>
        <p className={styles.resultText}>
          {t("successDescription", { count: result.count })}
        </p>

        <div className={styles.dates}>
          <span className={styles.datesLabel}>{t("datesLabel")}</span>
          <div className={styles.chips}>
            {result.dates.map((date) => (
              <span key={date} className={styles.chip}>
                {formatDateOnly(`${date}T00:00:00.000Z`, locale)}
              </span>
            ))}
          </div>
        </div>
      </Alert>

      <Link href="/attendance/records" className={styles.recordsLink}>
        {t("viewRecords")}
      </Link>
    </div>
  );
}
