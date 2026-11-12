"use client";

import { useTranslations } from "next-intl";
import type { IEmployeeShift } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { EmployeeShiftForm } from "./EmployeeShiftForm";

interface IEmployeeShiftFormDialogProps {
  isOpen: boolean;
  assignment: IEmployeeShift | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeShiftFormDialog({
  isOpen,
  assignment,
  onClose,
  onSuccess,
}: IEmployeeShiftFormDialogProps) {
  const t = useTranslations("Shifts");
  const common = useTranslations("Common");

  return (
    <Modal
      isOpen={isOpen}
      title={
        assignment
          ? t("assignmentForm.editTitle")
          : t("assignmentForm.createTitle")
      }
      description={
        assignment
          ? t("assignmentForm.editDescription")
          : t("assignmentForm.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <EmployeeShiftForm
        key={assignment?.id ?? "create"}
        assignment={assignment}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
