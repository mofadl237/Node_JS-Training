"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShiftError } from "@/src/hooks/useShiftError";
import { useDeleteShiftMutation } from "@/src/lib/api/shifts-api";
import type { IShift } from "@/src/lib/api/types";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog/ConfirmDialog";

interface IDeleteShiftDialogProps {
  shift: IShift | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteShiftDialog({
  shift,
  onClose,
  onSuccess,
}: IDeleteShiftDialogProps) {
  const t = useTranslations("Shifts.shifts.delete");
  const common = useTranslations("Common");
  const localizeError = useShiftError();
  const [deleteShift, { isLoading }] = useDeleteShiftMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!shift) return;

    setError(null);

    try {
      await deleteShift(shift.id).unwrap();
      toast.success(t("success"));
      onSuccess();
    } catch (deleteError) {
      const message = localizeError(deleteError);

      setError(message);
      toast.error(t("errorTitle"), { description: message });
    }
  }, [deleteShift, localizeError, onSuccess, shift, t]);

  return (
    <ConfirmDialog
      isOpen={shift !== null}
      title={t("title")}
      description={shift ? t("description", { name: shift.name }) : ""}
      closeLabel={common("close")}
      confirmLabel={isLoading ? t("deleting") : t("confirm")}
      cancelLabel={t("cancel")}
      isConfirming={isLoading}
      error={error ? { title: t("errorTitle"), message: error } : undefined}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
