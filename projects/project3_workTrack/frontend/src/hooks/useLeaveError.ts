"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { normalizeApiError } from "@/src/lib/api/error";

export const useLeaveError = () => {
  const t = useTranslations("Leaves.errors");

  return useCallback(
    (error: unknown): string => {
      const normalized = normalizeApiError(error);

      if (normalized.code === "NETWORK_ERROR") return t("network");
      if (normalized.code === "TIMEOUT_ERROR") return t("timeout");
      if (normalized.code === "LEAVE_NOT_FOUND") return t("notFound");
      if (normalized.code === "EMPLOYEE_NOT_FOUND") return t("employeeNotFound");
      if (normalized.code === "DEPARTMENT_NOT_FOUND") {
        return t("departmentNotFound");
      }
      if (normalized.code === "INVALID_DATE_RANGE") return t("dateRange");
      if (normalized.code === "LEAVE_EMPLOYEE_REQUIRED") {
        return t("employeeRequired");
      }
      if (normalized.code === "LEAVE_DEPARTMENT_REQUIRED") {
        return t("departmentRequired");
      }
      if (normalized.status === 401) return t("unauthorized");
      if (normalized.status === 403) return t("forbidden");
      if (normalized.status === 400) return t("validation");
      if (normalized.status && normalized.status >= 500) {
        return t("unexpected");
      }

      return normalized.message || t("unexpected");
    },
    [t],
  );
};
