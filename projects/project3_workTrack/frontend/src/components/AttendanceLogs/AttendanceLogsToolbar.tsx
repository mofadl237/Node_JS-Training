"use client";

import type { IEmployee } from "@/src/lib/api/types";
import { AttendanceEmployeeFilter } from "./AttendanceEmployeeFilter";
import {
  AttendanceLogsFilters,
  type IAttendanceLogsFiltersProps,
} from "./AttendanceLogsFilters";
import styles from "./AttendanceLogsToolbar.module.scss";

interface IAttendanceLogsToolbarProps extends IAttendanceLogsFiltersProps {
  employee: IEmployee | null;
  onEmployeeChange: (employee: IEmployee | null) => void;
}

export function AttendanceLogsToolbar({
  employee,
  onEmployeeChange,
  ...filters
}: IAttendanceLogsToolbarProps) {
  // 1- state

  // 2- handlers

  // 3- render
  return (
    <div className={styles.toolbar}>
      <AttendanceEmployeeFilter
        employee={employee}
        onChange={onEmployeeChange}
      />

      <AttendanceLogsFilters {...filters} />
    </div>
  );
}
