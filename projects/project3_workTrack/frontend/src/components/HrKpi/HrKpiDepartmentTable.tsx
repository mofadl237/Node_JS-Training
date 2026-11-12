"use client";

import { useLocale, useTranslations } from "next-intl";
import type { IDepartmentKpi } from "@/src/lib/api/types";
import { formatMinutes } from "@/src/lib/format/duration";
import { formatNumber } from "@/src/lib/format/number";
import { DashboardPanel } from "@/src/components/Dashboard/DashboardPanel";
import styles from "./HrKpiTables.module.scss";

interface IHrKpiDepartmentTableProps {
  items: IDepartmentKpi[];
}

export function HrKpiDepartmentTable({
  items,
}: IHrKpiDepartmentTableProps) {
  const t = useTranslations("HrKpi");
  const locale = useLocale();
  const formatPercent = (value: number): string =>
    `${formatNumber(value, locale, { maximumFractionDigits: 1 })}%`;

  return (
    <DashboardPanel
      title={t("panels.departments")}
      description={t("panels.departmentsDescription")}
    >
      {items.length === 0 ? (
        <p className={styles.empty}>{t("empty.departments")}</p>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t("columns.department")}</th>
                <th scope="col">{t("columns.employees")}</th>
                <th scope="col">{t("columns.records")}</th>
                <th scope="col">{t("columns.present")}</th>
                <th scope="col">{t("columns.late")}</th>
                <th scope="col">{t("columns.absent")}</th>
                <th scope="col">{t("columns.attendanceRate")}</th>
                <th scope="col">{t("columns.lateRate")}</th>
                <th scope="col">{t("columns.averageWorking")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.departmentId}>
                  <td>
                    <span className={styles.primary}>
                      {item.departmentName}
                    </span>
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.employees, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.totalRecords, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.present, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.late, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatNumber(item.absent, locale)}
                  </td>
                  <td className={styles.numeric}>
                    {formatPercent(item.attendanceRate)}
                  </td>
                  <td className={styles.numeric}>
                    {formatPercent(item.lateRate)}
                  </td>
                  <td className={styles.numeric}>
                    {formatMinutes(item.averageWorkingMinutes)}
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
