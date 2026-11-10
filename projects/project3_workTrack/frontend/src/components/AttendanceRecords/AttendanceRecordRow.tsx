"use client";

import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import {
  formatDateOnly,
  formatTime,
} from "@/src/lib/format/date";
import { formatMinutes } from "@/src/lib/format/duration";
import { AttendanceRecordStatusBadge } from "./AttendanceRecordStatusBadge";
import styles from "./AttendanceRecordRow.module.scss";

interface IAttendanceRecordRowProps {
  record: IAttendanceRecord;
  index: number;
  canManage: boolean;
  onEdit: (record: IAttendanceRecord) => void;
  onDelete: (record: IAttendanceRecord) => void;
}

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export const AttendanceRecordRow = memo(function AttendanceRecordRow({
  record,
  index,
  canManage,
  onEdit,
  onDelete,
}: IAttendanceRecordRowProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const locale = useLocale();
  const fullName = `${record.employee.firstName} ${record.employee.lastName}`;

  // 2- handlers

  // 3- render
  return (
    <tr
      className={styles.row}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <td className={styles.employeeCell}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(record.employee.firstName, record.employee.lastName)}
        </span>
        <span className={styles.employeeCopy}>
          <Link
            href={`/employees/${record.employee.id}`}
            className={styles.employeeName}
            aria-label={t("viewEmployee")}
          >
            {fullName}
          </Link>
          <span className={styles.employeeMeta}>
            {record.employee.employeeCode} ·{" "}
            {record.employee.jobTitle || t("noJobTitle")}
          </span>
        </span>
      </td>
      <td className={styles.dateCell}>
        <time dateTime={record.date}>{formatDateOnly(record.date, locale)}</time>
        <span className={styles.shift}>
          {record.shift?.name ?? t("noShift")}
        </span>
      </td>
      <td className={styles.timeCell}>
        {record.checkIn ? formatTime(record.checkIn, locale) : t("noTime")}
      </td>
      <td className={styles.timeCell}>
        {record.checkOut ? formatTime(record.checkOut, locale) : t("noTime")}
      </td>
      <td className={styles.workingCell}>
        {formatMinutes(record.workingMinutes)}
      </td>
      <td className={styles.statusCell}>
        <AttendanceRecordStatusBadge status={record.status} />
      </td>
      {canManage && (
        <td className={styles.actionsCell}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => onEdit(record)}
            aria-label={t("edit")}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className={[styles.iconButton, styles.danger].join(" ")}
            onClick={() => onDelete(record)}
            aria-label={t("delete")}
          >
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </tr>
  );
});
