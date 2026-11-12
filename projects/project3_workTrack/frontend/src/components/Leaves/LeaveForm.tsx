"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useDepartmentOptions } from "@/src/hooks/useDepartmentOptions";
import { useEmployeeOptions } from "@/src/hooks/useEmployeeOptions";
import { useLeaveForm } from "@/src/hooks/useLeaveForm";
import type { ILeave } from "@/src/lib/api/types";
import {
  getTodayDateInputValue,
  toDateInputValue,
} from "@/src/lib/format/date-input";
import {
  createLeaveSchema,
  type ILeaveFormValues,
} from "@/src/lib/validation/leave-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextAreaField } from "@/src/components/ui/TextAreaField/TextAreaField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import { LeaveRecurrenceFields } from "./LeaveRecurrenceFields";
import { LeaveScopeFields } from "./LeaveScopeFields";
import styles from "./LeaveForm.module.scss";

interface ILeaveFormProps {
  leave: ILeave | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const toTextValue = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

export function LeaveForm({ leave, onCancel, onSuccess }: ILeaveFormProps) {
  const t = useTranslations("Leaves");
  const { employees, isError: employeesError } = useEmployeeOptions();
  const { departments, isError: departmentsError } = useDepartmentOptions();
  const { submit, submitError, isSaving } = useLeaveForm({
    leave,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createLeaveSchema({
        nameRequired: t("validation.nameRequired"),
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        descriptionMax: t("validation.descriptionMax"),
        employeeRequired: t("validation.employeeRequired"),
        departmentRequired: t("validation.departmentRequired"),
        startDateRequired: t("validation.startDateRequired"),
        dateRangeInvalid: t("validation.dateRangeInvalid"),
        dayOfWeekInvalid: t("validation.dayOfWeekInvalid"),
        dayOfMonthInvalid: t("validation.dayOfMonthInvalid"),
        monthInvalid: t("validation.monthInvalid"),
        dayInvalid: t("validation.dayInvalid"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ILeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: leave?.name ?? "",
      description: leave?.description ?? "",
      type: leave?.type ?? "ANNUAL",
      scope: leave?.scope ?? "ALL",
      employeeId: leave?.employeeId ?? "",
      departmentId: leave?.departmentId ?? "",
      startDate: leave
        ? toDateInputValue(leave.startDate)
        : getTodayDateInputValue(),
      endDate: leave?.endDate ? toDateInputValue(leave.endDate) : "",
      isPaid: leave?.isPaid ?? true,
      isDeductible: leave?.isDeductible ?? false,
      isActive: leave?.isActive ?? true,
      recurrence: leave?.recurrence ?? "NONE",
      recurrenceDayOfWeek: toTextValue(leave?.recurrenceDayOfWeek),
      recurrenceDayOfMonth: toTextValue(leave?.recurrenceDayOfMonth),
      recurrenceMonth: toTextValue(leave?.recurrenceMonth),
      recurrenceDay: toTextValue(leave?.recurrenceDay),
    },
    mode: "onBlur",
  });
  const scope = useWatch({ control, name: "scope" });
  const recurrence = useWatch({ control, name: "recurrence" });
  const typeOptions: ISelectOption[] = [
    { value: "ANNUAL", label: t("types.ANNUAL") },
    { value: "SICK", label: t("types.SICK") },
    { value: "UNPAID", label: t("types.UNPAID") },
    { value: "ABSENCE", label: t("types.ABSENCE") },
    { value: "OFFICIAL_HOLIDAY", label: t("types.OFFICIAL_HOLIDAY") },
    { value: "WEEKEND", label: t("types.WEEKEND") },
    { value: "CUSTOM", label: t("types.CUSTOM") },
  ];
  const employeeOptions: ISelectOption[] = [
    { value: "", label: t("form.employeePlaceholder") },
    ...employees.map((employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`,
    })),
  ];
  const departmentOptions: ISelectOption[] = [
    { value: "", label: t("form.departmentPlaceholder") },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];

  if (
    leave?.employee &&
    !employees.some((employee) => employee.id === leave.employeeId)
  ) {
    employeeOptions.push({
      value: leave.employee.id,
      label: `${leave.employee.firstName} ${leave.employee.lastName} (${leave.employee.employeeCode})`,
    });
  }

  if (
    leave?.department &&
    !departments.some((department) => department.id === leave.departmentId)
  ) {
    departmentOptions.push({
      value: leave.department.id,
      label: leave.department.name,
    });
  }

  const onSubmit = useCallback(
    (values: ILeaveFormValues) => submit(values),
    [submit],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert title={t("form.errorTitle")}>{submitError}</Alert>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("form.detailsSection")}</h3>

        <div className={styles.grid}>
          <TextField
            {...register("name")}
            label={t("form.nameLabel")}
            placeholder={t("form.namePlaceholder")}
            error={errors.name?.message}
            autoFocus
            maxLength={100}
          />

          <SelectField
            {...register("type")}
            label={t("form.typeLabel")}
            options={typeOptions}
            error={errors.type?.message}
          />
        </div>

        <TextAreaField
          {...register("description")}
          label={t("form.descriptionLabel")}
          placeholder={t("form.descriptionPlaceholder")}
          hint={t("form.descriptionHint")}
          error={errors.description?.message}
          rows={3}
          maxLength={500}
        />
      </section>

      <LeaveScopeFields
        scope={scope}
        register={register}
        errors={errors}
        employeeOptions={employeeOptions}
        departmentOptions={departmentOptions}
        employeesError={employeesError}
        departmentsError={departmentsError}
      />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("form.datesSection")}</h3>

        <div className={styles.grid}>
          <TextField
            {...register("startDate")}
            label={t("form.startDateLabel")}
            error={errors.startDate?.message}
            type="date"
          />

          <TextField
            {...register("endDate")}
            label={t("form.endDateLabel")}
            hint={t("form.endDateHint")}
            error={errors.endDate?.message}
            type="date"
          />
        </div>
      </section>

      <LeaveRecurrenceFields
        recurrence={recurrence}
        register={register}
        errors={errors}
      />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("form.flagsSection")}</h3>

        <div className={styles.checkboxes}>
          <label className={styles.checkbox}>
            <input type="checkbox" {...register("isPaid")} />
            <span>
              <strong>{t("form.paidLabel")}</strong>
              <small>{t("form.paidHint")}</small>
            </span>
          </label>

          <label className={styles.checkbox}>
            <input type="checkbox" {...register("isDeductible")} />
            <span>
              <strong>{t("form.deductibleLabel")}</strong>
              <small>{t("form.deductibleHint")}</small>
            </span>
          </label>

          <label className={styles.checkbox}>
            <input type="checkbox" {...register("isActive")} />
            <span>
              <strong>{t("form.activeLabel")}</strong>
              <small>{t("form.activeHint")}</small>
            </span>
          </label>
        </div>
      </section>

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
