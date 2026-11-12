"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type { TLeaveRecurrence } from "@/src/lib/api/types";
import type { ILeaveFormValues } from "@/src/lib/validation/leave-schema";
import styles from "./LeaveForm.module.scss";

interface ILeaveRecurrenceFieldsProps {
  recurrence: TLeaveRecurrence;
  register: UseFormRegister<ILeaveFormValues>;
  errors: FieldErrors<ILeaveFormValues>;
}

export function LeaveRecurrenceFields({
  recurrence,
  register,
  errors,
}: ILeaveRecurrenceFieldsProps) {
  const t = useTranslations("Leaves");
  const recurrenceOptions: ISelectOption[] = [
    { value: "NONE", label: t("recurrence.NONE") },
    { value: "WEEKLY", label: t("recurrence.WEEKLY") },
    { value: "MONTHLY", label: t("recurrence.MONTHLY") },
    { value: "YEARLY", label: t("recurrence.YEARLY") },
  ];
  const weekDayOptions: ISelectOption[] = [
    { value: "", label: t("form.autoFromStartDate") },
    { value: "0", label: t("weekdays.0") },
    { value: "1", label: t("weekdays.1") },
    { value: "2", label: t("weekdays.2") },
    { value: "3", label: t("weekdays.3") },
    { value: "4", label: t("weekdays.4") },
    { value: "5", label: t("weekdays.5") },
    { value: "6", label: t("weekdays.6") },
  ];

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("form.recurrenceSection")}</h3>

      <div className={styles.grid}>
        <SelectField
          {...register("recurrence")}
          label={t("form.recurrenceLabel")}
          options={recurrenceOptions}
          error={errors.recurrence?.message}
        />

        {recurrence === "WEEKLY" && (
          <SelectField
            {...register("recurrenceDayOfWeek")}
            label={t("form.dayOfWeekLabel")}
            options={weekDayOptions}
            error={errors.recurrenceDayOfWeek?.message}
            hint={t("form.recurrenceHint")}
          />
        )}

        {recurrence === "MONTHLY" && (
          <TextField
            {...register("recurrenceDayOfMonth")}
            label={t("form.dayOfMonthLabel")}
            hint={t("form.recurrenceHint")}
            error={errors.recurrenceDayOfMonth?.message}
            type="number"
            min={1}
            max={31}
            step={1}
          />
        )}

        {recurrence === "YEARLY" && (
          <>
            <TextField
              {...register("recurrenceMonth")}
              label={t("form.monthLabel")}
              hint={t("form.recurrenceHint")}
              error={errors.recurrenceMonth?.message}
              type="number"
              min={1}
              max={12}
              step={1}
            />
            <TextField
              {...register("recurrenceDay")}
              label={t("form.dayLabel")}
              hint={t("form.recurrenceHint")}
              error={errors.recurrenceDay?.message}
              type="number"
              min={1}
              max={31}
              step={1}
            />
          </>
        )}
      </div>
    </section>
  );
}
