"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useLeaveError } from "@/src/hooks/useLeaveError";
import { useDeleteLeaveMutation } from "@/src/lib/api/leaves-api";
import type { ILeave } from "@/src/lib/api/types";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog/ConfirmDialog";

interface IDeleteLeaveDialogProps {
  leave: ILeave | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteLeaveDialog({
  leave,
  onClose,
  onSuccess,
}: IDeleteLeaveDialogProps) {
  const t = useTranslations("Leaves.delete");
  const common = useTranslations("Common");
  const localizeError = useLeaveError();
  const [deleteLeave, { isLoading }] = useDeleteLeaveMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!leave) return;

    setError(null);

    try {
      await deleteLeave(leave.id).unwrap();
      toast.success(t("success"));
      onSuccess();
    } catch (deleteError) {
      const message = localizeError(deleteError);

      setError(message);
      toast.error(t("errorTitle"), { description: message });
    }
  }, [deleteLeave, leave, localizeError, onSuccess, t]);

  return (
    <ConfirmDialog
      isOpen={leave !== null}
      title={t("title")}
      description={leave ? t("description", { name: leave.name }) : ""}
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
