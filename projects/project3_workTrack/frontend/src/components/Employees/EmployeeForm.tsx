"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useDepartmentOptions } from "@/src/hooks/useDepartmentOptions";
import { useEmployeeForm } from "@/src/hooks/useEmployeeForm";
import type { IEmployee } from "@/src/lib/api/types";
import {
  getTodayDateInputValue,
  toDateInputValue,
} from "@/src/lib/format/date-input";
import {
  createEmployeeSchema,
  type IEmployeeFormValues,
} from "@/src/lib/validation/employee-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import type { ISelectOption } from "@/src/components/ui/SelectField/SelectField";
import { SelectField } from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./EmployeeForm.module.scss";

interface IEmployeeFormProps {
  employee: IEmployee | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EmployeeForm({
  employee,
  onCancel,
  onSuccess,
}: IEmployeeFormProps) {
  // 1- state
  const t = useTranslations("Employees");
  const { departments, isError: departmentsError } = useDepartmentOptions();
  const { submit, submitError, isSaving } = useEmployeeForm({
    employee,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createEmployeeSchema({
        employeeCodeRequired: t("validation.employeeCodeRequired"),
        employeeCodeMax: t("validation.employeeCodeMax"),
        firstNameRequired: t("validation.firstNameRequired"),
        firstNameMax: t("validation.firstNameMax"),
        lastNameRequired: t("validation.lastNameRequired"),
        lastNameMax: t("validation.lastNameMax"),
        emailInvalid: t("validation.emailInvalid"),
        phoneInvalid: t("validation.phoneInvalid"),
        departmentRequired: t("validation.departmentRequired"),
        jobTitleMax: t("validation.jobTitleMax"),
        hireDateRequired: t("validation.hireDateRequired"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IEmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeCode: employee?.employeeCode ?? "",
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      email: employee?.email ?? "",
      phone: employee?.phone ?? "",
      departmentId: employee?.departmentId ?? "",
      jobTitle: employee?.jobTitle ?? "",
      status: employee?.status ?? "ACTIVE",
      hireDate: employee
        ? toDateInputValue(employee.hireDate)
        : getTodayDateInputValue(),
    },
    mode: "onBlur",
  });
  const departmentOptions: ISelectOption[] = [
    { value: "", label: t("form.departmentPlaceholder") },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];

  if (
    employee?.department &&
    !departments.some((department) => department.id === employee.department?.id)
  ) {
    departmentOptions.push({
      value: employee.department.id,
      label: employee.department.name,
    });
  }

  const statusOptions: ISelectOption[] = [
    { value: "ACTIVE", label: t("status.active") },
    { value: "INACTIVE", label: t("status.inactive") },
  ];

  // 2- handlers
  const onSubmit = useCallback(
    (values: IEmployeeFormValues) => submit(values),
    [submit],
  );

  // 3- render
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert title={t("form.errorTitle")}>{submitError}</Alert>
      )}

      <div className={styles.grid}>
        <TextField
          {...register("employeeCode")}
          label={t("form.employeeCodeLabel")}
          placeholder={t("form.employeeCodePlaceholder")}
          error={errors.employeeCode?.message}
          autoFocus
          maxLength={50}
        />

        <TextField
          {...register("firstName")}
          label={t("form.firstNameLabel")}
          placeholder={t("form.firstNamePlaceholder")}
          error={errors.firstName?.message}
          maxLength={100}
        />

        <TextField
          {...register("lastName")}
          label={t("form.lastNameLabel")}
          placeholder={t("form.lastNamePlaceholder")}
          error={errors.lastName?.message}
          maxLength={100}
        />

        <TextField
          {...register("email")}
          label={t("form.emailLabel")}
          placeholder={t("form.emailPlaceholder")}
          error={errors.email?.message}
          type="email"
          maxLength={150}
        />

        <TextField
          {...register("phone")}
          label={t("form.phoneLabel")}
          placeholder={t("form.phonePlaceholder")}
          error={errors.phone?.message}
          type="tel"
          maxLength={20}
        />

        <SelectField
          {...register("departmentId")}
          label={t("form.departmentLabel")}
          options={departmentOptions}
          error={errors.departmentId?.message}
          hint={
            departmentsError ? t("form.departmentsUnavailable") : undefined
          }
        />

        <TextField
          {...register("jobTitle")}
          label={t("form.jobTitleLabel")}
          placeholder={t("form.jobTitlePlaceholder")}
          error={errors.jobTitle?.message}
          maxLength={100}
        />

        <TextField
          {...register("hireDate")}
          label={t("form.hireDateLabel")}
          error={errors.hireDate?.message}
          type="date"
        />

        <SelectField
          {...register("status")}
          label={t("form.statusLabel")}
          options={statusOptions}
          error={errors.status?.message}
        />
      </div>

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
