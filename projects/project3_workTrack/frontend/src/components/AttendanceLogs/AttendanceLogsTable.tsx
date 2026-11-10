"use client";

import { useTranslations } from "next-intl";
import type { IAttendanceLog } from "@/src/lib/api/types";
import { AttendanceLogRow } from "./AttendanceLogRow";
import styles from "./AttendanceLogsTable.module.scss";

interface IAttendanceLogsTableProps {
  items: IAttendanceLog[];
}

export function AttendanceLogsTable({ items }: IAttendanceLogsTableProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs");

  // 2- handlers

  // 3- render
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.employee")}</th>
            <th scope="col">{t("columns.event")}</th>
            <th scope="col">{t("columns.timestamp")}</th>
            <th scope="col">{t("columns.source")}</th>
            <th scope="col">{t("columns.recordedBy")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((log, index) => (
            <AttendanceLogRow key={log.id} log={log} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
