"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IEmployee } from "@/src/lib/api/types";
import { formatDate } from "@/src/lib/format/date";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import styles from "./EmployeesTable.module.scss";

interface IEmployeeRowProps {
  employee: IEmployee;
}

export const EmployeeRow = memo(function EmployeeRow({
  employee,
}: IEmployeeRowProps) {
  // 1- state
  const t = useTranslations("Employees");
  const locale = useLocale();
  const hasContact = Boolean(employee.email || employee.phone);

  // 2- handlers

  // 3- render
  return (
    <tr className={styles.row}>
      <td className={styles.employeeCell}>
        <Link
          href={`/employees/${employee.id}`}
          className={styles.employeeName}
          aria-label={t("view")}
        >
          {employee.firstName} {employee.lastName}
        </Link>
        <span className={styles.employeeCode}>{employee.employeeCode}</span>
      </td>
      <td className={styles.departmentCell}>
        {employee.department?.name ?? t("noDepartment")}
      </td>
      <td className={styles.jobTitleCell}>
        {employee.jobTitle || t("noJobTitle")}
      </td>
      <td className={styles.contactCell}>
        {hasContact ? (
          <>
            {employee.email && (
              <span className={styles.contactLine} dir="ltr">
                {employee.email}
              </span>
            )}
            {employee.phone && (
              <span className={styles.contactLine} dir="ltr">
                {employee.phone}
              </span>
            )}
          </>
        ) : (
          t("noContact")
        )}
      </td>
      <td className={styles.statusCell}>
        <EmployeeStatusBadge status={employee.status} />
      </td>
      <td className={styles.dateCell}>
        {formatDate(employee.hireDate, locale)}
      </td>
    </tr>
  );
});
