"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { normalizeApiError } from "@/src/lib/api/error";

export const useUploadsError = () => {
  const t = useTranslations("Uploads.errors");

  return useCallback(
    (error: unknown): string => {
      const normalized = normalizeApiError(error);

      if (normalized.code === "NETWORK_ERROR") return t("network");
      if (normalized.code === "TIMEOUT_ERROR") return t("timeout");
      if (normalized.code === "FILE_TOO_LARGE") return t("fileTooLarge");
      if (normalized.code === "INVALID_FILE_TYPE") return t("invalidFileType");
      if (normalized.code === "CSV_EMPTY") return t("emptyFile");
      if (normalized.code === "FILE_REQUIRED") return t("fileRequired");
      if (normalized.status === 401) return t("unauthorized");
      if (normalized.status === 403) return t("forbidden");
      if (normalized.status === 400) return t("validation");
      if (normalized.status && normalized.status >= 500) return t("unexpected");

      return normalized.message || t("unexpected");
    },
    [t],
  );
};
