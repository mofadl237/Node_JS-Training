"use client";

import { useTranslations } from "next-intl";
import type { ILeave } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { LeaveForm } from "./LeaveForm";

interface ILeaveFormDialogProps {
  isOpen: boolean;
  leave: ILeave | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveFormDialog({
  isOpen,
  leave,
  onClose,
  onSuccess,
}: ILeaveFormDialogProps) {
  const t = useTranslations("Leaves");
  const common = useTranslations("Common");

  return (
    <Modal
      isOpen={isOpen}
      title={leave ? t("form.editTitle") : t("form.createTitle")}
      description={
        leave ? t("form.editDescription") : t("form.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <LeaveForm
        key={leave?.id ?? "create"}
        leave={leave}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
