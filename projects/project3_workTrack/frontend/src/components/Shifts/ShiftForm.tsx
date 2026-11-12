"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useShiftForm } from "@/src/hooks/useShiftForm";
import type { IShift } from "@/src/lib/api/types";
import {
  createShiftSchema,
  type IShiftFormValues,
} from "@/src/lib/validation/shift-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./ShiftForm.module.scss";

interface IShiftFormProps {
  shift: IShift | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const toTextValue = (value: number | undefined): string =>
  value === undefined ? "" : String(value);

export function ShiftForm({ shift, onCancel, onSuccess }: IShiftFormProps) {
  const t = useTranslations("Shifts");
  const { submit, submitError, isSaving } = useShiftForm({
    shift,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createShiftSchema({
        nameRequired: t("validation.nameRequired"),
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        timeInvalid: t("validation.timeInvalid"),
        minutesInvalid: t("validation.minutesInvalid"),
        minutesMax: t("validation.minutesMax"),
        hoursInvalid: t("validation.hoursInvalid"),
        hoursMax: t("validation.hoursMax"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IShiftFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: shift?.name ?? "",
      startTime: shift?.startTime ?? "",
      endTime: shift?.endTime ?? "",
      graceMinutes: toTextValue(shift?.graceMinutes ?? 15),
      expectedHours: toTextValue(shift?.expectedHours ?? 8),
      overtimeAfterMinutes: toTextValue(shift?.overtimeAfterMinutes ?? 0),
      isNightShift: shift?.isNightShift ?? false,
    },
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    (values: IShiftFormValues) => submit(values),
    [submit],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert title={t("form.errorTitle")}>{submitError}</Alert>
      )}

      <TextField
        {...register("name")}
        label={t("form.nameLabel")}
        placeholder={t("form.namePlaceholder")}
        error={errors.name?.message}
        autoFocus
        maxLength={100}
      />

      <div className={styles.grid}>
        <TextField
          {...register("startTime")}
          label={t("form.startTimeLabel")}
          error={errors.startTime?.message}
          type="time"
        />

        <TextField
          {...register("endTime")}
          label={t("form.endTimeLabel")}
          error={errors.endTime?.message}
          type="time"
        />

        <TextField
          {...register("graceMinutes")}
          label={t("form.graceLabel")}
          hint={t("form.minutesHint")}
          error={errors.graceMinutes?.message}
          type="number"
          min={0}
          max={1440}
          step={1}
        />

        <TextField
          {...register("expectedHours")}
          label={t("form.expectedHoursLabel")}
          hint={t("form.hoursHint")}
          error={errors.expectedHours?.message}
          type="number"
          min={0.5}
          max={24}
          step={0.5}
        />

        <TextField
          {...register("overtimeAfterMinutes")}
          label={t("form.overtimeLabel")}
          hint={t("form.minutesHint")}
          error={errors.overtimeAfterMinutes?.message}
          type="number"
          min={0}
          max={1440}
          step={1}
        />
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" {...register("isNightShift")} />
        <span>
          <strong>{t("form.nightShiftLabel")}</strong>
          <small>{t("form.nightShiftHint")}</small>
        </span>
      </label>

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
