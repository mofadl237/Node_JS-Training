"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import type { TEmployeeStatus } from "@/src/lib/api/types";
import styles from "./EmployeesTable.module.scss";

interface IEmployeeStatusBadgeProps {
  status: TEmployeeStatus;
}

export const EmployeeStatusBadge = memo(function EmployeeStatusBadge({
  status,
}: IEmployeeStatusBadgeProps) {
  // 1- state
  const t = useTranslations("Employees.status");
  const isActive = status === "ACTIVE";

  // 2- handlers

  // 3- render
  return (
    <span
      className={[styles.status, isActive ? styles.active : styles.inactive]
        .filter(Boolean)
        .join(" ")}
    >
      {isActive ? t("active") : t("inactive")}
    </span>
  );
});
