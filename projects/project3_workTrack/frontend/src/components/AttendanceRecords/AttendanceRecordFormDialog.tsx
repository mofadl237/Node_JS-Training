"use client";

import { useTranslations } from "next-intl";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { AttendanceRecordForm } from "./AttendanceRecordForm";

interface IAttendanceRecordFormDialogProps {
  isOpen: boolean;
  record: IAttendanceRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AttendanceRecordFormDialog({
  isOpen,
  record,
  onClose,
  onSuccess,
}: IAttendanceRecordFormDialogProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const common = useTranslations("Common");

  // 2- handlers

  // 3- render
  return (
    <Modal
      isOpen={isOpen}
      title={record ? t("form.editTitle") : t("form.createTitle")}
      description={
        record ? t("form.editDescription") : t("form.createDescription")
      }
      closeLabel={common("close")}
      onClose={onClose}
    >
      <AttendanceRecordForm
        key={record?.id ?? "create"}
        record={record}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
