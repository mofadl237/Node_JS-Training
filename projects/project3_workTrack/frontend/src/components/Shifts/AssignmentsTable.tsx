"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { IEmployeeShift } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import styles from "./ShiftsTable.module.scss";

interface IAssignmentsTableProps {
  items: IEmployeeShift[];
  canManage: boolean;
  onEdit: (assignment: IEmployeeShift) => void;
  onDelete: (assignment: IEmployeeShift) => void;
}

export function AssignmentsTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: IAssignmentsTableProps) {
  const t = useTranslations("Shifts.assignments");
  const locale = useLocale();

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.employee")}</th>
            <th scope="col">{t("columns.shift")}</th>
            <th scope="col">{t("columns.startDate")}</th>
            <th scope="col">{t("columns.endDate")}</th>
            <th scope="col">{t("columns.status")}</th>
            <th scope="col" className={styles.actionsCell}>
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((assignment) => (
            <tr key={assignment.id} className={styles.row}>
              <td>
                <span className={styles.name}>
                  {assignment.employee.firstName}{" "}
                  {assignment.employee.lastName}
                </span>
                <span className={styles.meta}>
                  {assignment.employee.employeeCode}
                </span>
              </td>
              <td>
                <span className={styles.name}>{assignment.shift.name}</span>
                <span className={styles.meta}>
                  {assignment.shift.startTime} – {assignment.shift.endTime}
                </span>
              </td>
              <td className={styles.time}>
                {formatDateOnly(assignment.startDate, locale)}
              </td>
              <td className={styles.time}>
                {assignment.endDate
                  ? formatDateOnly(assignment.endDate, locale)
                  : "—"}
              </td>
              <td>
                <span
                  className={
                    assignment.isActive
                      ? styles.activeBadge
                      : styles.inactiveBadge
                  }
                >
                  {assignment.isActive ? t("active") : t("inactive")}
                </span>
              </td>
              <td className={styles.actionsCell}>
                {canManage && (
                  <>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("edit", {
                        name: `${assignment.employee.firstName} ${assignment.employee.lastName}`,
                      })}
                      onClick={() => onEdit(assignment)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className={[styles.iconButton, styles.danger].join(" ")}
                      aria-label={t("delete.action", {
                        name: `${assignment.employee.firstName} ${assignment.employee.lastName}`,
                      })}
                      onClick={() => onDelete(assignment)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
