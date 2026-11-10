"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAttendanceRecordForm } from "@/src/hooks/useAttendanceRecordForm";
import { useEmployeeOptions } from "@/src/hooks/useEmployeeOptions";
import { useShiftOptions } from "@/src/hooks/useShiftOptions";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import {
  getTodayDateInputValue,
  toDateInputValue,
  toTimeInputValue,
} from "@/src/lib/format/date-input";
import {
  createAttendanceRecordSchema,
  type IAttendanceRecordFormValues,
} from "@/src/lib/validation/attendance-record-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import type { ISelectOption } from "@/src/components/ui/SelectField/SelectField";
import { TextAreaField } from "@/src/components/ui/TextAreaField/TextAreaField";
import { AttendanceRecordAssignmentFields } from "./AttendanceRecordAssignmentFields";
import { AttendanceRecordTimingFields } from "./AttendanceRecordTimingFields";
import styles from "./AttendanceRecordForm.module.scss";

interface IAttendanceRecordFormProps {
  record: IAttendanceRecord | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const toMinutesValue = (value: number | undefined): string =>
  value ? String(value) : "";

export function AttendanceRecordForm({
  record,
  onCancel,
  onSuccess,
}: IAttendanceRecordFormProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const { employees, isError: employeesError } = useEmployeeOptions();
  const { shifts, isError: shiftsError } = useShiftOptions();
  const { submit, submitError, isSaving } = useAttendanceRecordForm({
    record,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createAttendanceRecordSchema({
        employeeRequired: t("validation.employeeRequired"),
        dateRequired: t("validation.dateRequired"),
        timeInvalid: t("validation.timeInvalid"),
        checkOutBeforeCheckIn: t("validation.checkOutBeforeCheckIn"),
        minutesInvalid: t("validation.minutesInvalid"),
        minutesMax: t("validation.minutesMax"),
        notesMax: t("validation.notesMax"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IAttendanceRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: record?.employeeId ?? "",
      shiftId: record?.shiftId ?? "",
      date: record
        ? toDateInputValue(record.date)
        : getTodayDateInputValue(),
      status: record?.status ?? "PRESENT",
      checkIn: toTimeInputValue(record?.checkIn ?? null),
      checkOut: toTimeInputValue(record?.checkOut ?? null),
      workingMinutes: toMinutesValue(record?.workingMinutes),
      lateMinutes: toMinutesValue(record?.lateMinutes),
      earlyLeaveMinutes: toMinutesValue(record?.earlyLeaveMinutes),
      overtimeMinutes: toMinutesValue(record?.overtimeMinutes),
      notes: record?.notes ?? "",
    },
    mode: "onBlur",
  });
  const employeeOptions: ISelectOption[] = [
    { value: "", label: t("form.employeePlaceholder") },
    ...employees.map((employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`,
    })),
  ];
  const shiftOptions: ISelectOption[] = [
    { value: "", label: t("form.shiftPlaceholder") },
    ...shifts.map((shift) => ({ value: shift.id, label: shift.name })),
  ];

  if (
    record &&
    !employees.some((employee) => employee.id === record.employeeId)
  ) {
    employeeOptions.push({
      value: record.employeeId,
      label: `${record.employee.firstName} ${record.employee.lastName} (${record.employee.employeeCode})`,
    });
  }

  if (record?.shift && !shifts.some((shift) => shift.id === record.shift?.id)) {
    shiftOptions.push({
      value: record.shift.id,
      label: record.shift.name,
    });
  }

  // 2- handlers
  const onSubmit = useCallback(
    (values: IAttendanceRecordFormValues) => submit(values),
    [submit],
  );

  // 3- render
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert title={t("form.errorTitle")}>{submitError}</Alert>
      )}

      <AttendanceRecordAssignmentFields
        register={register}
        errors={errors}
        employeeOptions={employeeOptions}
        shiftOptions={shiftOptions}
        employeesError={employeesError}
        shiftsError={shiftsError}
      />

      <AttendanceRecordTimingFields register={register} errors={errors} />

      <TextAreaField
        {...register("notes")}
        label={t("form.notesLabel")}
        placeholder={t("form.notesPlaceholder")}
        hint={t("form.notesHint")}
        error={errors.notes?.message}
        rows={3}
        maxLength={1000}
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t("form.cancel")}
        </Button>
        <Button type="submit" isLoading={isSaving || isSubmitting}>
          {isSaving || isSubmitting ? t("form.saving") : t("form.save")}
        </Button>
      </div>
    </form>
  );
}
