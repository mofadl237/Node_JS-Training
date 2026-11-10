"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useEmployeeError } from "@/src/hooks/useEmployeeError";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/src/lib/api/employees-api";
import type {
  ICreateEmployeePayload,
  IEmployee,
  IUpdateEmployeePayload,
} from "@/src/lib/api/types";
import type { IEmployeeFormValues } from "@/src/lib/validation/employee-schema";

interface IUseEmployeeFormArgs {
  employee: IEmployee | null;
  onSuccess: () => void;
}

export const useEmployeeForm = ({
  employee,
  onSuccess,
}: IUseEmployeeFormArgs) => {
  const t = useTranslations("Employees.form");
  const localizeError = useEmployeeError();
  const [createEmployee, createState] = useCreateEmployeeMutation();
  const [updateEmployee, updateState] = useUpdateEmployeeMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: IEmployeeFormValues) => {
      setSubmitError(null);

      const employeeCode = values.employeeCode.trim();
      const firstName = values.firstName.trim();
      const lastName = values.lastName.trim();
      const email = values.email.trim();
      const phone = values.phone.trim();
      const jobTitle = values.jobTitle.trim();

      try {
        if (employee) {
          const body: IUpdateEmployeePayload = {
            employeeCode,
            firstName,
            lastName,
            email: email || null,
            phone: phone || null,
            departmentId: values.departmentId,
            jobTitle: jobTitle || null,
            status: values.status,
            hireDate: values.hireDate,
          };

          await updateEmployee({ id: employee.id, body }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          const body: ICreateEmployeePayload = {
            employeeCode,
            firstName,
            lastName,
            departmentId: values.departmentId,
            status: values.status,
            hireDate: values.hireDate,
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
            ...(jobTitle ? { jobTitle } : {}),
          };

          await createEmployee(body).unwrap();
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
      createEmployee,
      employee,
      localizeError,
      onSuccess,
      t,
      updateEmployee,
    ],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
