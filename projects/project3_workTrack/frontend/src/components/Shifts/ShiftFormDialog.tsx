"use client";

import { useTranslations } from "next-intl";
import type { IShift } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { ShiftForm } from "./ShiftForm";

interface IShiftFormDialogProps {
  isOpen: boolean;
  shift: IShift | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ShiftFormDialog({
  isOpen,
  shift,
  onClose,
  onSuccess,
}: IShiftFormDialogProps) {
  const t = useTranslations("Shifts");
  const common = useTranslations("Common");

  return (
    <Modal
      isOpen={isOpen}
      title={shift ? t("form.editTitle") : t("form.createTitle")}
      description={
        shift ? t("form.editDescription") : t("form.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <ShiftForm
        key={shift?.id ?? "create"}
        shift={shift}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
