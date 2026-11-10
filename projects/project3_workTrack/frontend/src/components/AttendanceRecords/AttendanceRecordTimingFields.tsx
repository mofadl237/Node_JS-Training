"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type { IAttendanceRecordFormValues } from "@/src/lib/validation/attendance-record-schema";
import styles from "./AttendanceRecordForm.module.scss";

interface IAttendanceRecordTimingFieldsProps {
  register: UseFormRegister<IAttendanceRecordFormValues>;
  errors: FieldErrors<IAttendanceRecordFormValues>;
}

export function AttendanceRecordTimingFields({
  register,
  errors,
}: IAttendanceRecordTimingFieldsProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");

  // 2- handlers

  // 3- render
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("form.timingSection")}</h3>

      <div className={styles.grid}>
        <TextField
          {...register("checkIn")}
          label={t("form.checkInLabel")}
          error={errors.checkIn?.message}
          type="time"
        />

        <TextField
          {...register("checkOut")}
          label={t("form.checkOutLabel")}
          error={errors.checkOut?.message}
          type="time"
        />

        <TextField
          {...register("workingMinutes")}
          label={t("form.workingMinutesLabel")}
          error={errors.workingMinutes?.message}
          hint={t("form.workingMinutesHint")}
          type="number"
          min={0}
          max={10080}
          inputMode="numeric"
        />

        <TextField
          {...register("lateMinutes")}
          label={t("form.lateMinutesLabel")}
          error={errors.lateMinutes?.message}
          type="number"
          min={0}
          max={10080}
          inputMode="numeric"
        />

        <TextField
          {...register("earlyLeaveMinutes")}
          label={t("form.earlyLeaveMinutesLabel")}
          error={errors.earlyLeaveMinutes?.message}
          type="number"
          min={0}
          max={10080}
          inputMode="numeric"
        />

        <TextField
          {...register("overtimeMinutes")}
          label={t("form.overtimeMinutesLabel")}
          error={errors.overtimeMinutes?.message}
          type="number"
          min={0}
          max={10080}
          inputMode="numeric"
        />
      </div>
    </section>
  );
}
