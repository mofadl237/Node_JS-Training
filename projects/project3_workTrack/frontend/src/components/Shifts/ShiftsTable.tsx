"use client";

import { Moon, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IShift } from "@/src/lib/api/types";
import styles from "./ShiftsTable.module.scss";

interface IShiftsTableProps {
  items: IShift[];
  canManage: boolean;
  onEdit: (shift: IShift) => void;
  onDelete: (shift: IShift) => void;
}

export function ShiftsTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: IShiftsTableProps) {
  const t = useTranslations("Shifts.shifts");

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.name")}</th>
            <th scope="col">{t("columns.time")}</th>
            <th scope="col">{t("columns.grace")}</th>
            <th scope="col">{t("columns.expected")}</th>
            <th scope="col">{t("columns.overtime")}</th>
            <th scope="col">{t("columns.night")}</th>
            <th scope="col" className={styles.actionsCell}>
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((shift) => (
            <tr key={shift.id} className={styles.row}>
              <td>
                <span className={styles.name}>{shift.name}</span>
              </td>
              <td className={styles.time}>
                {shift.startTime} – {shift.endTime}
              </td>
              <td>
                {t("units.minutes", { value: shift.graceMinutes })}
              </td>
              <td>{t("units.hours", { value: shift.expectedHours })}</td>
              <td>
                {t("units.minutes", { value: shift.overtimeAfterMinutes })}
              </td>
              <td>
                {shift.isNightShift ? (
                  <span className={styles.nightBadge}>
                    <Moon size={13} aria-hidden="true" />
                    {t("yes")}
                  </span>
                ) : (
                  <span className={styles.muted}>{t("no")}</span>
                )}
              </td>
              <td className={styles.actionsCell}>
                {canManage && (
                  <>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("edit", { name: shift.name })}
                      onClick={() => onEdit(shift)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className={[styles.iconButton, styles.danger].join(" ")}
                      aria-label={t("delete.action", { name: shift.name })}
                      onClick={() => onDelete(shift)}
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
