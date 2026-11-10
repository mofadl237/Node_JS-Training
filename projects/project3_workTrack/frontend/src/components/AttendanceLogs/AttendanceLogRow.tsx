"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IAttendanceLog } from "@/src/lib/api/types";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "@/src/lib/format/date";
import { AttendanceEventBadge } from "./AttendanceEventBadge";
import { AttendanceSourceBadge } from "./AttendanceSourceBadge";
import styles from "./AttendanceLogRow.module.scss";

interface IAttendanceLogRowProps {
  log: IAttendanceLog;
  index: number;
}

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export const AttendanceLogRow = memo(function AttendanceLogRow({
  log,
  index,
}: IAttendanceLogRowProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs");
  const locale = useLocale();
  const fullName = `${log.employee.firstName} ${log.employee.lastName}`;

  // 2- handlers

  // 3- render
  return (
    <tr
      className={styles.row}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <td className={styles.employeeCell}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(log.employee.firstName, log.employee.lastName)}
        </span>
        <span className={styles.employeeCopy}>
          <Link
            href={`/employees/${log.employee.id}`}
            className={styles.employeeName}
            aria-label={t("viewEmployee")}
          >
            {fullName}
          </Link>
          <span className={styles.employeeMeta}>
            {log.employee.employeeCode} ·{" "}
            {log.employee.jobTitle || t("noJobTitle")}
          </span>
        </span>
      </td>
      <td className={styles.eventCell}>
        <AttendanceEventBadge type={log.type} />
      </td>
      <td className={styles.timestampCell}>
        <time
          dateTime={log.timestamp}
          title={formatDateTime(log.timestamp, locale)}
        >
          <span className={styles.date}>
            {formatDate(log.timestamp, locale)}
          </span>
          <span className={styles.time}>
            {formatTime(log.timestamp, locale)}
          </span>
        </time>
      </td>
      <td className={styles.sourceCell}>
        <AttendanceSourceBadge source={log.source} />
      </td>
      <td className={styles.actorCell}>
        {log.createdBy?.name ?? t("systemActor")}
      </td>
    </tr>
  );
});
