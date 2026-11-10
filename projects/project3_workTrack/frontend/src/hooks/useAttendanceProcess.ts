"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAttendanceProcessError } from "@/src/hooks/useAttendanceProcessError";
import { useProcessAttendanceMutation } from "@/src/lib/api/attendance-api";
import type {
  IAttendanceProcessPayload,
  IAttendanceProcessResult,
} from "@/src/lib/api/types";

export const useAttendanceProcess = () => {
  const t = useTranslations("AttendanceProcess");
  const localizeError = useAttendanceProcessError();
  const [processAttendance, { isLoading }] = useProcessAttendanceMutation();
  const [result, setResult] = useState<IAttendanceProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(
    async (payload: IAttendanceProcessPayload) => {
      setError(null);
      setResult(null);

      try {
        const data = await processAttendance(payload).unwrap();

        setResult(data);
        toast.success(t("successTitle"), {
          description: t("successDescription", { count: data.count }),
        });
      } catch (processError) {
        const message = localizeError(processError);

        setError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [localizeError, processAttendance, t],
  );

  return {
    process,
    result,
    error,
    isProcessing: isLoading,
  };
};
