"use client";

import { useTranslations } from "next-intl";
import type { IDepartment } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { DepartmentForm } from "./DepartmentForm";

interface IDepartmentFormDialogProps {
  isOpen: boolean;
  department: IDepartment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepartmentFormDialog({
  isOpen,
  department,
  onClose,
  onSuccess,
}: IDepartmentFormDialogProps) {
  // 1- state
  const t = useTranslations("Departments");
  const common = useTranslations("Common");

  // 2- handlers

  // 3- render
  return (
    <Modal
      isOpen={isOpen}
      title={
        department ? t("form.editTitle") : t("form.createTitle")
      }
      description={
        department
          ? t("form.editDescription")
          : t("form.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <DepartmentForm
        key={department?.id ?? "create"}
        department={department}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
