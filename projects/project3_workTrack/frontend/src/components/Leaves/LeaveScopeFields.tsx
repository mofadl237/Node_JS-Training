"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import type { TLeaveScope } from "@/src/lib/api/types";
import type { ILeaveFormValues } from "@/src/lib/validation/leave-schema";
import styles from "./LeaveForm.module.scss";

interface ILeaveScopeFieldsProps {
  scope: TLeaveScope;
  register: UseFormRegister<ILeaveFormValues>;
  errors: FieldErrors<ILeaveFormValues>;
  employeeOptions: ISelectOption[];
  departmentOptions: ISelectOption[];
  employeesError: boolean;
  departmentsError: boolean;
}

export function LeaveScopeFields({
  scope,
  register,
  errors,
  employeeOptions,
  departmentOptions,
  employeesError,
  departmentsError,
}: ILeaveScopeFieldsProps) {
  const t = useTranslations("Leaves");
  const scopeOptions: ISelectOption[] = [
    { value: "ALL", label: t("scope.ALL") },
    { value: "DEPARTMENT", label: t("scope.DEPARTMENT") },
    { value: "EMPLOYEE", label: t("scope.EMPLOYEE") },
  ];

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("form.scopeSection")}</h3>

      <div className={styles.grid}>
        <SelectField
          {...register("scope")}
          label={t("form.scopeLabel")}
          options={scopeOptions}
          error={errors.scope?.message}
        />

        {scope === "DEPARTMENT" && (
          <SelectField
            {...register("departmentId")}
            label={t("form.departmentLabel")}
            options={departmentOptions}
            error={errors.departmentId?.message}
            hint={
              departmentsError ? t("form.departmentUnavailable") : undefined
            }
          />
        )}

        {scope === "EMPLOYEE" && (
          <SelectField
            {...register("employeeId")}
            label={t("form.employeeLabel")}
            options={employeeOptions}
            error={errors.employeeId?.message}
            hint={employeesError ? t("form.employeeUnavailable") : undefined}
          />
        )}
      </div>
    </section>
  );
}
