"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShiftError } from "@/src/hooks/useShiftError";
import {
  useCreateEmployeeShiftMutation,
  useUpdateEmployeeShiftMutation,
} from "@/src/lib/api/shifts-api";
import type { IEmployeeShift } from "@/src/lib/api/types";
import { toIsoDateValue } from "@/src/lib/format/date-input";
import type { IEmployeeShiftFormValues } from "@/src/lib/validation/employee-shift-schema";

interface IUseEmployeeShiftFormArgs {
  assignment: IEmployeeShift | null;
  onSuccess: () => void;
}

export const useEmployeeShiftForm = ({
  assignment,
  onSuccess,
}: IUseEmployeeShiftFormArgs) => {
  const t = useTranslations("Shifts.assignmentForm");
  const localizeError = useShiftError();
  const [createAssignment, createState] = useCreateEmployeeShiftMutation();
  const [updateAssignment, updateState] = useUpdateEmployeeShiftMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: IEmployeeShiftFormValues) => {
      setSubmitError(null);

      const body = {
        employeeId: values.employeeId,
        shiftId: values.shiftId,
        startDate: toIsoDateValue(values.startDate),
        endDate: values.endDate ? toIsoDateValue(values.endDate) : null,
        isActive: values.isActive,
      };

      try {
        if (assignment) {
          await updateAssignment({ id: assignment.id, body }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          await createAssignment(body).unwrap();
          toast.success(t("createSuccess"));
        }

        onSuccess();
      } catch (error) {
        const message = localizeError(error);

        setSubmitError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [assignment, createAssignment, localizeError, onSuccess, t, updateAssignment],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
