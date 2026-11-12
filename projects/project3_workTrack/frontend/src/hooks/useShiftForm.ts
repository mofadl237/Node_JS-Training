"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShiftError } from "@/src/hooks/useShiftError";
import {
  useCreateShiftMutation,
  useUpdateShiftMutation,
} from "@/src/lib/api/shifts-api";
import type { IShift } from "@/src/lib/api/types";
import type { IShiftFormValues } from "@/src/lib/validation/shift-schema";

interface IUseShiftFormArgs {
  shift: IShift | null;
  onSuccess: () => void;
}

const toNumber = (value: string, fallback: number): number =>
  value.trim() === "" ? fallback : Number(value);

export const useShiftForm = ({ shift, onSuccess }: IUseShiftFormArgs) => {
  const t = useTranslations("Shifts.form");
  const localizeError = useShiftError();
  const [createShift, createState] = useCreateShiftMutation();
  const [updateShift, updateState] = useUpdateShiftMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: IShiftFormValues) => {
      setSubmitError(null);

      const body = {
        name: values.name.trim(),
        startTime: values.startTime,
        endTime: values.endTime,
        graceMinutes: toNumber(values.graceMinutes, 15),
        expectedHours: toNumber(values.expectedHours, 8),
        overtimeAfterMinutes: toNumber(values.overtimeAfterMinutes, 0),
        isNightShift: values.isNightShift,
      };

      try {
        if (shift) {
          await updateShift({ id: shift.id, body }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          await createShift(body).unwrap();
          toast.success(t("createSuccess"));
        }

        onSuccess();
      } catch (error) {
        const message = localizeError(error);

        setSubmitError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [createShift, localizeError, onSuccess, shift, t, updateShift],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
