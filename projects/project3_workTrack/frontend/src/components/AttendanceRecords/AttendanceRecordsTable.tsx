"use client";

import { useTranslations } from "next-intl";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import { AttendanceRecordRow } from "./AttendanceRecordRow";
import styles from "./AttendanceRecordsTable.module.scss";

interface IAttendanceRecordsTableProps {
  items: IAttendanceRecord[];
  canManage: boolean;
  onEdit: (record: IAttendanceRecord) => void;
  onDelete: (record: IAttendanceRecord) => void;
}

export function AttendanceRecordsTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: IAttendanceRecordsTableProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");

  // 2- handlers

  // 3- render
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.employee")}</th>
            <th scope="col">{t("columns.date")}</th>
            <th scope="col">{t("columns.checkIn")}</th>
            <th scope="col">{t("columns.checkOut")}</th>
            <th scope="col">{t("columns.working")}</th>
            <th scope="col">{t("columns.status")}</th>
            {canManage && (
              <th scope="col" className={styles.actionsCell}>
                {t("columns.actions")}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((record, index) => (
            <AttendanceRecordRow
              key={record.id}
              record={record}
              index={index}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
