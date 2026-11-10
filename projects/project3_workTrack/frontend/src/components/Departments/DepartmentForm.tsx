"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useDepartmentForm } from "@/src/hooks/useDepartmentForm";
import type { IDepartment } from "@/src/lib/api/types";
import {
  createDepartmentSchema,
  type IDepartmentFormValues,
} from "@/src/lib/validation/department-schema";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { TextAreaField } from "@/src/components/ui/TextAreaField/TextAreaField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./DepartmentForm.module.scss";

interface IDepartmentFormProps {
  department: IDepartment | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function DepartmentForm({
  department,
  onCancel,
  onSuccess,
}: IDepartmentFormProps) {
  // 1- state
  const t = useTranslations("Departments");
  const { submit, submitError, isSaving } = useDepartmentForm({
    department,
    onSuccess,
  });
  const schema = useMemo(
    () =>
      createDepartmentSchema({
        nameRequired: t("validation.nameRequired"),
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        descriptionMax: t("validation.descriptionMax"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IDepartmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: department?.name ?? "",
      description: department?.description ?? "",
    },
    mode: "onBlur",
  });

  // 2- handlers
  const onSubmit = useCallback(
    (values: IDepartmentFormValues) => submit(values),
    [submit],
  );

  // 3- render
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

      <TextAreaField
        {...register("description")}
        label={t("form.descriptionLabel")}
        placeholder={t("form.descriptionPlaceholder")}
        hint={t("form.descriptionHint")}
        error={errors.description?.message}
        rows={4}
        maxLength={500}
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
