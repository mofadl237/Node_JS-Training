"use client";

import { Alert } from "../../ui/Alert/Alert";
import { Button } from "../../ui/Button/Button";
import { Modal } from "../../ui/Modal/Modal";

interface IConfirmDialogError {
  title: string;
  message: string;
}

interface IConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  closeLabel: string;
  confirmLabel: string;
  cancelLabel: string;
  isConfirming: boolean;
  error?: IConfirmDialogError;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  closeLabel,
  confirmLabel,
  cancelLabel,
  isConfirming,
  error,
  onConfirm,
  onClose,
}: IConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      closeLabel={closeLabel}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isConfirming}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {error && <Alert title={error.title}>{error.message}</Alert>}
    </Modal>
  );
}
