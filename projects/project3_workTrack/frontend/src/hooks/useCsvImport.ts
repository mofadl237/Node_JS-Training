"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useUploadsError } from "@/src/hooks/useUploadsError";
import {
  useImportAttendanceCsvMutation,
  useImportEmployeesCsvMutation,
} from "@/src/lib/api/uploads-api";
import type { IImportResult } from "@/src/lib/api/types";

export type TCsvImportKind = "employees" | "attendance";

export const useCsvImport = (kind: TCsvImportKind) => {
  const t = useTranslations("Uploads");
  const localizeError = useUploadsError();
  const [importEmployees, employeesState] = useImportEmployeesCsvMutation();
  const [importAttendance, attendanceState] = useImportAttendanceCsvMutation();
  const [result, setResult] = useState<IImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setResult(null);

      try {
        const data =
          kind === "employees"
            ? await importEmployees(file).unwrap()
            : await importAttendance(file).unwrap();

        setResult(data);
        toast.success(t("successToast"), {
          description: t("result.summary", {
            success: data.upload.successRows,
            total: data.upload.totalRows,
          }),
        });
      } catch (uploadError) {
        const message = localizeError(uploadError);

        setError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [importAttendance, importEmployees, kind, localizeError, t],
  );

  return {
    upload,
    reset,
    result,
    error,
    isUploading:
      kind === "employees" ? employeesState.isLoading : attendanceState.isLoading,
  };
};
