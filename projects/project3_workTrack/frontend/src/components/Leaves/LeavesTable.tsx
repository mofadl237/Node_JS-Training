"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ILeave } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import styles from "./LeavesTable.module.scss";

interface ILeavesTableProps {
  items: ILeave[];
  canManage: boolean;
  onEdit: (leave: ILeave) => void;
  onDelete: (leave: ILeave) => void;
}

export function LeavesTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: ILeavesTableProps) {
  const t = useTranslations("Leaves");
  const locale = useLocale();

  const getScopeTarget = (leave: ILeave): string => {
    if (leave.scope === "DEPARTMENT") {
      return leave.department?.name ?? "—";
    }

    if (leave.scope === "EMPLOYEE") {
      return leave.employee
        ? `${leave.employee.firstName} ${leave.employee.lastName}`
        : "—";
    }

    return t("scope.allEmployees");
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.name")}</th>
            <th scope="col">{t("columns.type")}</th>
            <th scope="col">{t("columns.scope")}</th>
            <th scope="col">{t("columns.dates")}</th>
            <th scope="col">{t("columns.recurrence")}</th>
            <th scope="col">{t("columns.flags")}</th>
            <th scope="col">{t("columns.status")}</th>
            <th scope="col" className={styles.actionsCell}>
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((leave) => (
            <tr key={leave.id} className={styles.row}>
              <td>
                <span className={styles.name}>{leave.name}</span>
                {leave.description && (
                  <span className={styles.meta}>{leave.description}</span>
                )}
              </td>
              <td>{t(`types.${leave.type}`)}</td>
              <td>
                <span className={styles.name}>
                  {t(`scope.${leave.scope}`)}
                </span>
                <span className={styles.meta}>{getScopeTarget(leave)}</span>
              </td>
              <td className={styles.dates}>
                {formatDateOnly(leave.startDate, locale)}
                <span className={styles.meta}>
                  {leave.endDate
                    ? formatDateOnly(leave.endDate, locale)
                    : t("noEndDate")}
                </span>
              </td>
              <td>{t(`recurrence.${leave.recurrence}`)}</td>
              <td>
                <div className={styles.flags}>
                  <span
                    className={
                      leave.isPaid ? styles.paidBadge : styles.unpaidBadge
                    }
                  >
                    {leave.isPaid ? t("paid") : t("unpaid")}
                  </span>
                  {leave.isDeductible && (
                    <span className={styles.deductibleBadge}>
                      {t("deductible")}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span
                  className={
                    leave.isActive
                      ? styles.activeBadge
                      : styles.inactiveBadge
                  }
                >
                  {leave.isActive ? t("active") : t("inactive")}
                </span>
              </td>
              <td className={styles.actionsCell}>
                {canManage && (
                  <>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("edit", { name: leave.name })}
                      onClick={() => onEdit(leave)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className={[styles.iconButton, styles.danger].join(" ")}
                      aria-label={t("delete.action", { name: leave.name })}
                      onClick={() => onDelete(leave)}
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
