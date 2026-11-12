"use client";

import { useTranslations } from "next-intl";
import type { IImportResult } from "@/src/lib/api/types";
import { Alert } from "@/src/components/ui/Alert/Alert";
import styles from "./Uploads.module.scss";

interface ICsvImportResultProps {
  result: IImportResult;
}

export function CsvImportResult({ result }: ICsvImportResultProps) {
  const t = useTranslations("Uploads");
  const { upload, errors } = result;
  const variant =
    upload.failedRows === 0
      ? "success"
      : upload.successRows === 0
        ? "error"
        : "info";
  const title =
    upload.failedRows === 0
      ? t("result.successTitle")
      : upload.successRows === 0
        ? t("result.failureTitle")
        : t("result.partialTitle");

  return (
    <div className={styles.result}>
      <Alert variant={variant} title={title}>
        <p className={styles.resultSummary}>
          {t("result.summary", {
            success: upload.successRows,
            total: upload.totalRows,
          })}
        </p>
        <div className={styles.stats}>
          <span className={styles.stat}>
            {t("result.total")}: <strong>{upload.totalRows}</strong>
          </span>
          <span className={styles.stat}>
            {t("result.success")}: <strong>{upload.successRows}</strong>
          </span>
          <span className={styles.stat}>
            {t("result.failed")}: <strong>{upload.failedRows}</strong>
          </span>
        </div>
      </Alert>

      {errors.length > 0 && (
        <div className={styles.errors}>
          <h4 className={styles.errorsTitle}>{t("result.errorsTitle")}</h4>
          <div className={styles.errorsTableWrap}>
            <table className={styles.errorsTable}>
              <thead>
                <tr>
                  <th>{t("result.row")}</th>
                  <th>{t("result.employee")}</th>
                  <th>{t("result.message")}</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error, index) => (
                  <tr key={`${error.row}-${index}`}>
                    <td>{error.row}</td>
                    <td>{error.employeeCode ?? t("result.noEmployee")}</td>
                    <td>{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
