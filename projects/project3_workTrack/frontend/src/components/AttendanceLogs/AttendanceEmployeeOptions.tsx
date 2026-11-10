"use client";

import { useTranslations } from "next-intl";
import type { IEmployee } from "@/src/lib/api/types";
import styles from "./AttendanceEmployeeFilter.module.scss";

interface IAttendanceEmployeeOptionsLabels {
  loading?: string;
  empty?: string;
  error?: string;
  noJobTitle?: string;
}

interface IAttendanceEmployeeOptionsProps {
  optionsId: string;
  employees: IEmployee[];
  highlightedIndex: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  labels?: IAttendanceEmployeeOptionsLabels;
  onHighlight: (index: number) => void;
  onSelect: (employee: IEmployee) => void;
}

const getInitials = (employee: IEmployee): string =>
  `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

export function AttendanceEmployeeOptions({
  optionsId,
  employees,
  highlightedIndex,
  isLoading,
  isFetching,
  isError,
  labels,
  onHighlight,
  onSelect,
}: IAttendanceEmployeeOptionsProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs");

  // 2- handlers

  // 3- render
  return (
    <div id={optionsId} className={styles.dropdown} role="listbox">
      {isError ? (
        <p className={styles.message}>
          {labels?.error ?? t("employeeSearchError")}
        </p>
      ) : isLoading || isFetching ? (
        <p className={styles.message}>
          {labels?.loading ?? t("employeeSearchLoading")}
        </p>
      ) : employees.length === 0 ? (
        <p className={styles.message}>
          {labels?.empty ?? t("employeeSearchEmpty")}
        </p>
      ) : (
        employees.map((option, index) => (
          <button
            key={option.id}
            id={`${optionsId}-${option.id}`}
            type="button"
            role="option"
            aria-selected={index === highlightedIndex}
            className={[
              styles.option,
              index === highlightedIndex ? styles.highlighted : null,
            ]
              .filter(Boolean)
              .join(" ")}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => onHighlight(index)}
            onClick={() => onSelect(option)}
          >
            <span className={styles.avatar} aria-hidden="true">
              {getInitials(option)}
            </span>
            <span className={styles.optionCopy}>
              <span className={styles.optionName}>
                {option.firstName} {option.lastName}
              </span>
              <span className={styles.optionMeta}>
                {option.employeeCode} ·{" "}
                {option.jobTitle || labels?.noJobTitle || t("noJobTitle")}
              </span>
            </span>
          </button>
        ))
      )}
    </div>
  );
}
