"use client";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { IDepartment } from "@/src/lib/api/types";
import { formatDateTime } from "@/src/lib/format/date";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./DashboardToolbar.module.scss";

interface IDashboardToolbarProps {
  from: string;
  to: string;
  departmentId: string;
  departments: IDepartment[];
  canFilterDepartment: boolean;
  hasFilters: boolean;
  generatedAt?: string;
  namespace?: "Dashboard" | "HrKpi";
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DashboardToolbar({
  from,
  to,
  departmentId,
  departments,
  canFilterDepartment,
  hasFilters,
  generatedAt,
  namespace = "Dashboard",
  onFromChange,
  onToChange,
  onDepartmentChange,
  onClearFilters,
}: IDashboardToolbarProps) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const departmentOptions: ISelectOption[] = [
    { value: "", label: t("filters.allDepartments") },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];

  return (
    <div className={styles.toolbar}>
      <TextField
        label={t("filters.from")}
        type="date"
        value={from}
        containerClassName={styles.field}
        onChange={(event) => onFromChange(event.target.value)}
      />
      <TextField
        label={t("filters.to")}
        type="date"
        value={to}
        containerClassName={styles.field}
        onChange={(event) => onToChange(event.target.value)}
      />

      {canFilterDepartment && (
        <SelectField
          label={t("filters.department")}
          options={departmentOptions}
          value={departmentId}
          containerClassName={styles.department}
          onChange={(event) => onDepartmentChange(event.target.value)}
        />
      )}

      {hasFilters && (
        <Button
          variant="ghost"
          leadingIcon={<X size={16} />}
          onClick={onClearFilters}
        >
          {t("filters.clear")}
        </Button>
      )}

      {generatedAt && (
        <p className={styles.meta}>
          {t("updatedAt", { date: formatDateTime(generatedAt, locale) })}
        </p>
      )}
    </div>
  );
}
