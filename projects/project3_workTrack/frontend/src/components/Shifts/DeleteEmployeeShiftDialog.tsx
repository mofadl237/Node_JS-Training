"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShiftError } from "@/src/hooks/useShiftError";
import { useDeleteEmployeeShiftMutation } from "@/src/lib/api/shifts-api";
import type { IEmployeeShift } from "@/src/lib/api/types";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog/ConfirmDialog";

interface IDeleteEmployeeShiftDialogProps {
  assignment: IEmployeeShift | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteEmployeeShiftDialog({
  assignment,
  onClose,
  onSuccess,
}: IDeleteEmployeeShiftDialogProps) {
  const t = useTranslations("Shifts.assignments.delete");
  const common = useTranslations("Common");
  const localizeError = useShiftError();
  const [deleteAssignment, { isLoading }] = useDeleteEmployeeShiftMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!assignment) return;

    setError(null);

    try {
      await deleteAssignment(assignment.id).unwrap();
      toast.success(t("success"));
      onSuccess();
    } catch (deleteError) {
      const message = localizeError(deleteError);

      setError(message);
      toast.error(t("errorTitle"), { description: message });
    }
  }, [assignment, deleteAssignment, localizeError, onSuccess, t]);

  return (
    <ConfirmDialog
      isOpen={assignment !== null}
      title={t("title")}
      description={
        assignment
          ? t("description", {
              name: `${assignment.employee.firstName} ${assignment.employee.lastName}`,
              shift: assignment.shift.name,
            })
          : ""
      }
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
