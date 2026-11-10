"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDepartmentError } from "@/src/hooks/useDepartmentError";
import { useDeleteDepartmentMutation } from "@/src/lib/api/departments-api";
import type { IDepartment } from "@/src/lib/api/types";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog/ConfirmDialog";

interface IDeleteDepartmentDialogProps {
  department: IDepartment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteDepartmentDialog({
  department,
  onClose,
  onSuccess,
}: IDeleteDepartmentDialogProps) {
  // 1- state
  const t = useTranslations("Departments");
  const common = useTranslations("Common");
  const localizeError = useDepartmentError();
  const [deleteDepartment, { isLoading }] = useDeleteDepartmentMutation();
  const [error, setError] = useState<string | null>(null);

  // 2- handlers
  const handleConfirm = useCallback(async () => {
    if (!department) return;

    setError(null);

    try {
      await deleteDepartment(department.id).unwrap();
      toast.success(t("delete.success"));
      onSuccess();
    } catch (deleteError) {
      const message = localizeError(deleteError);

      setError(message);
      toast.error(t("delete.errorTitle"), { description: message });
    }
  }, [deleteDepartment, department, localizeError, onSuccess, t]);

  // 3- render
  return (
    <ConfirmDialog
      isOpen={department !== null}
      title={t("delete.title")}
      description={
        department
          ? t("delete.description", { name: department.name })
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
