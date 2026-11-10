"use client";

import { useTranslations } from "next-intl";
import type { IEmployee } from "@/src/lib/api/types";
import { AttendanceEmployeeFilter } from "@/src/components/AttendanceLogs/AttendanceEmployeeFilter";
import {
  AttendanceRecordsFilters,
  type IAttendanceRecordsFiltersProps,
} from "./AttendanceRecordsFilters";
import styles from "./AttendanceRecordsToolbar.module.scss";

interface IAttendanceRecordsToolbarProps
  extends IAttendanceRecordsFiltersProps {
  employee: IEmployee | null;
  onEmployeeChange: (employee: IEmployee | null) => void;
}

export function AttendanceRecordsToolbar({
  employee,
  onEmployeeChange,
  ...filters
}: IAttendanceRecordsToolbarProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");

  // 2- handlers

  // 3- render
  return (
    <div className={styles.toolbar}>
      <AttendanceEmployeeFilter
        employee={employee}
        labels={{
          label: t("employeeLabel"),
          placeholder: t("employeePlaceholder"),
          clear: t("clearEmployee"),
          loading: t("employeeSearchLoading"),
          empty: t("employeeSearchEmpty"),
          error: t("employeeSearchError"),
          noJobTitle: t("noJobTitle"),
        }}
        onChange={onEmployeeChange}
      />

      <AttendanceRecordsFilters {...filters} />
    </div>
  );
}
