"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDepartmentError } from "@/src/hooks/useDepartmentError";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/src/lib/api/departments-api";
import type { IDepartment } from "@/src/lib/api/types";
import type { IDepartmentFormValues } from "@/src/lib/validation/department-schema";

interface IUseDepartmentFormArgs {
  department: IDepartment | null;
  onSuccess: () => void;
}

export const useDepartmentForm = ({
  department,
  onSuccess,
}: IUseDepartmentFormArgs) => {
  const t = useTranslations("Departments.form");
  const localizeError = useDepartmentError();
  const [createDepartment, createState] = useCreateDepartmentMutation();
  const [updateDepartment, updateState] = useUpdateDepartmentMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: IDepartmentFormValues) => {
      setSubmitError(null);

      const name = values.name.trim();
      const description = values.description.trim();

      try {
        if (department) {
          await updateDepartment({
            id: department.id,
            body: { name, description: description || null },
          }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          await createDepartment({
            name,
            ...(description ? { description } : {}),
          }).unwrap();
          toast.success(t("createSuccess"));
        }

        onSuccess();
      } catch (error) {
        const message = localizeError(error);

        setSubmitError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [
      createDepartment,
      department,
      localizeError,
      onSuccess,
      t,
      updateDepartment,
    ],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
