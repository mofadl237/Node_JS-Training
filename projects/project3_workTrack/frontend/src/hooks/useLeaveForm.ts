"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useLeaveError } from "@/src/hooks/useLeaveError";
import {
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
} from "@/src/lib/api/leaves-api";
import type { ILeave } from "@/src/lib/api/types";
import { toIsoDateValue } from "@/src/lib/format/date-input";
import type { ILeaveFormValues } from "@/src/lib/validation/leave-schema";

interface IUseLeaveFormArgs {
  leave: ILeave | null;
  onSuccess: () => void;
}

const toOptionalNumber = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

export const useLeaveForm = ({ leave, onSuccess }: IUseLeaveFormArgs) => {
  const t = useTranslations("Leaves.form");
  const localizeError = useLeaveError();
  const [createLeave, createState] = useCreateLeaveMutation();
  const [updateLeave, updateState] = useUpdateLeaveMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: ILeaveFormValues) => {
      setSubmitError(null);

      const recurrence = values.recurrence;
      const body = {
        name: values.name.trim(),
        description: values.description.trim() || null,
        type: values.type,
        scope: values.scope,
        employeeId:
          values.scope === "EMPLOYEE" ? values.employeeId : null,
        departmentId:
          values.scope === "DEPARTMENT" ? values.departmentId : null,
        startDate: toIsoDateValue(values.startDate),
        endDate: values.endDate ? toIsoDateValue(values.endDate) : null,
        isPaid: values.isPaid,
        isDeductible: values.isDeductible,
        isActive: values.isActive,
        recurrence,
        recurrenceDayOfWeek:
          recurrence === "WEEKLY"
            ? toOptionalNumber(values.recurrenceDayOfWeek)
            : null,
        recurrenceDayOfMonth:
          recurrence === "MONTHLY"
            ? toOptionalNumber(values.recurrenceDayOfMonth)
            : null,
        recurrenceMonth:
          recurrence === "YEARLY"
            ? toOptionalNumber(values.recurrenceMonth)
            : null,
        recurrenceDay:
          recurrence === "YEARLY"
            ? toOptionalNumber(values.recurrenceDay)
            : null,
      };

      try {
        if (leave) {
          await updateLeave({ id: leave.id, body }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          await createLeave(body).unwrap();
          toast.success(t("createSuccess"));
        }

        onSuccess();
      } catch (error) {
        const message = localizeError(error);

        setSubmitError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [createLeave, leave, localizeError, onSuccess, t, updateLeave],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
