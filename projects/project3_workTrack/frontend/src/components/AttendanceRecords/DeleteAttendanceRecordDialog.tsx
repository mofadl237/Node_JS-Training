"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAttendanceRecordsError } from "@/src/hooks/useAttendanceRecordsError";
import { useDeleteAttendanceRecordMutation } from "@/src/lib/api/attendance-api";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog/ConfirmDialog";

interface IDeleteAttendanceRecordDialogProps {
  record: IAttendanceRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteAttendanceRecordDialog({
  record,
  onClose,
  onSuccess,
}: IDeleteAttendanceRecordDialogProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const common = useTranslations("Common");
  const locale = useLocale();
  const localizeError = useAttendanceRecordsError();
  const [deleteRecord, { isLoading }] = useDeleteAttendanceRecordMutation();
  const [error, setError] = useState<string | null>(null);

  // 2- handlers
  const handleConfirm = useCallback(async () => {
    if (!record) return;

    setError(null);

    try {
      await deleteRecord(record.id).unwrap();
      toast.success(t("delete.success"));
      onSuccess();
    } catch (deleteError) {
      const message = localizeError(deleteError);

      setError(message);
      toast.error(t("delete.errorTitle"), { description: message });
    }
  }, [deleteRecord, localizeError, onSuccess, record, t]);

  // 3- render
  return (
    <ConfirmDialog
      isOpen={record !== null}
      title={t("delete.title")}
      description={
        record
          ? t("delete.description", {
              name: `${record.employee.firstName} ${record.employee.lastName}`,
              date: formatDateOnly(record.date, locale),
            })
          : ""
      }
      closeLabel={common("close")}
      confirmLabel={isLoading ? t("delete.deleting") : t("delete.confirm")}
      cancelLabel={t("delete.cancel")}
      isConfirming={isLoading}
      error={
        error
          ? { title: t("delete.errorTitle"), message: error }
          : undefined
      }
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
