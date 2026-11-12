"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ITopLateEmployee } from "@/src/lib/api/types";
import { formatMinutes } from "@/src/lib/format/duration";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardPanel } from "@/src/components/Dashboard/DashboardPanel";
import styles from "./HrKpiTables.module.scss";

interface IHrKpiTopLateTableProps {
  items: ITopLateEmployee[];
}

export function HrKpiTopLateTable({ items }: IHrKpiTopLateTableProps) {
  const t = useTranslations("HrKpi");
  const locale = useLocale();

  return (
    <DashboardPanel
      title={t("panels.topLate")}
      description={t("panels.topLateDescription")}
    >
      {items.length === 0 ? (
        <p className={styles.empty}>{t("empty.topLate")}</p>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t("columns.employee")}</th>
                <th scope="col">{t("columns.department")}</th>
                <th scope="col">{t("columns.lateDays")}</th>
                <th scope="col">{t("columns.lateMinutes")}</th>
                <th scope="col">{t("columns.absentDays")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.employeeId}>
                  <td>
                    <span className={styles.primary}>
                      {item.employeeName}
                    </span>
                    <span className={styles.meta}>
                      {item.employeeCode}
                    </span>
                  </td>
                  <td>{item.departmentName}</td>
                  <td className={styles.numeric}>
                    {formatNumber(item.lateDays, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatMinutes(item.lateMinutes)}
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.absentDays, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardPanel>
  );
}
