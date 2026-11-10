"use client";

import { useTranslations } from "next-intl";
import type { IEmployee } from "@/src/lib/api/types";
import { EmployeeRow } from "./EmployeeRow";
import styles from "./EmployeesTable.module.scss";

interface IEmployeesTableProps {
  items: IEmployee[];
}

export function EmployeesTable({ items }: IEmployeesTableProps) {
  // 1- state
  const t = useTranslations("Employees");

  // 2- handlers

  // 3- render
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.employee")}</th>
            <th scope="col">{t("columns.department")}</th>
            <th scope="col" className={styles.jobTitleCell}>
              {t("columns.jobTitle")}
            </th>
            <th scope="col">{t("columns.contact")}</th>
            <th scope="col" className={styles.statusCell}>
              {t("columns.status")}
            </th>
            <th scope="col" className={styles.dateCell}>
              {t("columns.hireDate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
