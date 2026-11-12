"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEmployeeOptions } from "@/src/hooks/useEmployeeOptions";
import { useEmployeeShiftForm } from "@/src/hooks/useEmployeeShiftForm";
import { useShiftOptions } from "@/src/hooks/useShiftOptions";
import type { IEmployeeShift } from "@/src/lib/api/types";
import {
  getTodayDateInputValue,
  toDateInputValue,
} from "@/src/lib/format/date-input";
import {
  createEmployeeShiftSchema,
  type IEmployeeShiftFormValues,
} from "@/src/lib/validation/employee-shift-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./ShiftForm.module.scss";

interface IEmployeeShiftFormProps {
  assignment: IEmployeeShift | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EmployeeShiftForm({
  assignment,
  onCancel,
  onSuccess,
}: IEmployeeShiftFormProps) {
  const t = useTranslations("Shifts");
  const { employees, isError: employeesError } = useEmployeeOptions();
  const { shifts, isError: shiftsError } = useShiftOptions();
  const { submit, submitError, isSaving } = useEmployeeShiftForm({
    assignment,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createEmployeeShiftSchema({
        employeeRequired: t("validation.employeeRequired"),
        shiftRequired: t("validation.shiftRequired"),
        startDateRequired: t("validation.startDateRequired"),
        dateRangeInvalid: t("validation.dateRangeInvalid"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IEmployeeShiftFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: assignment?.employeeId ?? "",
      shiftId: assignment?.shiftId ?? "",
      startDate: assignment
        ? toDateInputValue(assignment.startDate)
        : getTodayDateInputValue(),
      endDate: assignment?.endDate
        ? toDateInputValue(assignment.endDate)
        : "",
      isActive: assignment?.isActive ?? true,
    },
    mode: "onBlur",
  });
  const employeeOptions: ISelectOption[] = [
    { value: "", label: t("assignmentForm.employeePlaceholder") },
    ...employees.map((employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`,
    })),
  ];
  const shiftOptions: ISelectOption[] = [
    { value: "", label: t("assignmentForm.shiftPlaceholder") },
    ...shifts.map((shift) => ({ value: shift.id, label: shift.name })),
  ];

  if (
    assignment &&
    !employees.some((employee) => employee.id === assignment.employeeId)
  ) {
    employeeOptions.push({
      value: assignment.employeeId,
      label: `${assignment.employee.firstName} ${assignment.employee.lastName} (${assignment.employee.employeeCode})`,
    });
  }

  if (
    assignment &&
    !shifts.some((shift) => shift.id === assignment.shiftId)
  ) {
    shiftOptions.push({
      value: assignment.shiftId,
      label: assignment.shift.name,
    });
  }

  const onSubmit = useCallback(
    (values: IEmployeeShiftFormValues) => submit(values),
    [submit],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert title={t("assignmentForm.errorTitle")}>{submitError}</Alert>
      )}

      <div className={styles.grid}>
        <SelectField
          {...register("employeeId")}
          label={t("assignmentForm.employeeLabel")}
          options={employeeOptions}
          error={errors.employeeId?.message}
          hint={
            employeesError
              ? t("assignmentForm.employeeUnavailable")
              : undefined
          }
          autoFocus
        />

        <SelectField
          {...register("shiftId")}
          label={t("assignmentForm.shiftLabel")}
          options={shiftOptions}
          error={errors.shiftId?.message}
          hint={
            shiftsError ? t("assignmentForm.shiftUnavailable") : undefined
          }
        />

        <TextField
          {...register("startDate")}
          label={t("assignmentForm.startDateLabel")}
          error={errors.startDate?.message}
          type="date"
        />

        <TextField
          {...register("endDate")}
          label={t("assignmentForm.endDateLabel")}
          hint={t("assignmentForm.endDateHint")}
          error={errors.endDate?.message}
          type="date"
        />
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" {...register("isActive")} />
        <span>
          <strong>{t("assignmentForm.activeLabel")}</strong>
          <small>{t("assignmentForm.activeHint")}</small>
        </span>
      </label>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t("assignmentForm.cancel")}
        </Button>
        <Button type="submit" isLoading={isSaving || isSubmitting}>
          {isSaving || isSubmitting
            ? t("assignmentForm.saving")
            : t("assignmentForm.save")}
        </Button>
      </div>
    </form>
  );
}
