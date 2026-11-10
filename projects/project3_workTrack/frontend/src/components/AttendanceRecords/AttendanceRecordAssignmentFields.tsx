"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type { IAttendanceRecordFormValues } from "@/src/lib/validation/attendance-record-schema";
import styles from "./AttendanceRecordForm.module.scss";

interface IAttendanceRecordAssignmentFieldsProps {
  register: UseFormRegister<IAttendanceRecordFormValues>;
  errors: FieldErrors<IAttendanceRecordFormValues>;
  employeeOptions: ISelectOption[];
  shiftOptions: ISelectOption[];
  employeesError: boolean;
  shiftsError: boolean;
}

export function AttendanceRecordAssignmentFields({
  register,
  errors,
  employeeOptions,
  shiftOptions,
  employeesError,
  shiftsError,
}: IAttendanceRecordAssignmentFieldsProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const statusOptions: ISelectOption[] = [
    { value: "PRESENT", label: t("status.PRESENT") },
    { value: "ABSENT", label: t("status.ABSENT") },
    { value: "LATE", label: t("status.LATE") },
    { value: "HALF_DAY", label: t("status.HALF_DAY") },
    { value: "ON_LEAVE", label: t("status.ON_LEAVE") },
  ];

  // 2- handlers

  // 3- render
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("form.assignmentSection")}</h3>

      <div className={styles.grid}>
        <SelectField
          {...register("employeeId")}
          label={t("form.employeeLabel")}
          options={employeeOptions}
          error={errors.employeeId?.message}
          hint={employeesError ? t("form.employeeUnavailable") : undefined}
          autoFocus
        />

        <SelectField
          {...register("shiftId")}
          label={t("form.shiftLabel")}
          options={shiftOptions}
          error={errors.shiftId?.message}
          hint={shiftsError ? t("form.shiftUnavailable") : undefined}
        />

        <TextField
          {...register("date")}
          label={t("form.dateLabel")}
          error={errors.date?.message}
          type="date"
        />

        <SelectField
          {...register("status")}
          label={t("form.statusLabel")}
          options={statusOptions}
          error={errors.status?.message}
        />
      </div>
    </section>
  );
}
