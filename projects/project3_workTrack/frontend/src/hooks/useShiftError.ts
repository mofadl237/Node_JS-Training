"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { normalizeApiError } from "@/src/lib/api/error";

export const useShiftError = () => {
  const t = useTranslations("Shifts.errors");

  return useCallback(
    (error: unknown): string => {
      const normalized = normalizeApiError(error);

      if (normalized.code === "NETWORK_ERROR") return t("network");
      if (normalized.code === "TIMEOUT_ERROR") return t("timeout");
      if (normalized.code === "SHIFT_NOT_FOUND") return t("shiftNotFound");
      if (normalized.code === "SHIFT_IN_USE") return t("shiftInUse");
      if (normalized.code === "EMPLOYEE_SHIFT_NOT_FOUND") {
        return t("assignmentNotFound");
      }
      if (normalized.code === "EMPLOYEE_NOT_FOUND") return t("employeeNotFound");
      if (normalized.code === "INVALID_DATE_RANGE") return t("dateRange");
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
