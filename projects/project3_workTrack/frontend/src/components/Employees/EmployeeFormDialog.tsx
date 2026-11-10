"use client";

import { useTranslations } from "next-intl";
import type { IEmployee } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { EmployeeForm } from "./EmployeeForm";

interface IEmployeeFormDialogProps {
  isOpen: boolean;
  employee: IEmployee | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeFormDialog({
  isOpen,
  employee,
  onClose,
  onSuccess,
}: IEmployeeFormDialogProps) {
  // 1- state
  const t = useTranslations("Employees");
  const common = useTranslations("Common");

  // 2- handlers

  // 3- render
  return (
    <Modal
      isOpen={isOpen}
      title={employee ? t("form.editTitle") : t("form.createTitle")}
      description={
        employee ? t("form.editDescription") : t("form.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <EmployeeForm
        key={employee?.id ?? "create"}
        employee={employee}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
