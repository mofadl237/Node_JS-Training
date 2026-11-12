"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type {
  TLeaveRecurrence,
  TLeaveScope,
  TLeaveType,
} from "@/src/lib/api/types";
import styles from "./LeavesToolbar.module.scss";

interface ILeavesToolbarProps {
  search: string;
  type: TLeaveType | "";
  scope: TLeaveScope | "";
  recurrence: TLeaveRecurrence | "";
  isActive: "" | "true" | "false";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TLeaveType | "") => void;
  onScopeChange: (value: TLeaveScope | "") => void;
  onRecurrenceChange: (value: TLeaveRecurrence | "") => void;
  onActiveChange: (value: "" | "true" | "false") => void;
  onClearFilters: () => void;
}

export function LeavesToolbar({
  search,
  type,
  scope,
  recurrence,
  isActive,
  hasFilters,
  onSearchChange,
  onTypeChange,
  onScopeChange,
  onRecurrenceChange,
  onActiveChange,
  onClearFilters,
}: ILeavesToolbarProps) {
  const t = useTranslations("Leaves");
  const typeOptions: ISelectOption[] = [
    { value: "", label: t("filters.allTypes") },
    { value: "ANNUAL", label: t("types.ANNUAL") },
    { value: "SICK", label: t("types.SICK") },
    { value: "UNPAID", label: t("types.UNPAID") },
    { value: "ABSENCE", label: t("types.ABSENCE") },
    { value: "OFFICIAL_HOLIDAY", label: t("types.OFFICIAL_HOLIDAY") },
    { value: "WEEKEND", label: t("types.WEEKEND") },
    { value: "CUSTOM", label: t("types.CUSTOM") },
  ];
  const scopeOptions: ISelectOption[] = [
    { value: "", label: t("filters.allScopes") },
    { value: "ALL", label: t("scope.ALL") },
    { value: "DEPARTMENT", label: t("scope.DEPARTMENT") },
    { value: "EMPLOYEE", label: t("scope.EMPLOYEE") },
  ];
  const recurrenceOptions: ISelectOption[] = [
    { value: "", label: t("filters.allRecurrences") },
    { value: "NONE", label: t("recurrence.NONE") },
    { value: "WEEKLY", label: t("recurrence.WEEKLY") },
    { value: "MONTHLY", label: t("recurrence.MONTHLY") },
    { value: "YEARLY", label: t("recurrence.YEARLY") },
  ];
  const activeOptions: ISelectOption[] = [
    { value: "", label: t("filters.allStatuses") },
    { value: "true", label: t("active") },
    { value: "false", label: t("inactive") },
  ];

  return (
    <div className={styles.toolbar}>
      <TextField
        label={t("filters.searchLabel")}
        placeholder={t("filters.searchPlaceholder")}
        leadingIcon={<Search size={16} />}
        value={search}
        containerClassName={styles.search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <SelectField
        label={t("filters.typeLabel")}
        options={typeOptions}
        value={type}
        containerClassName={styles.select}
        onChange={(event) =>
          onTypeChange(event.target.value as TLeaveType | "")
        }
      />

      <SelectField
        label={t("filters.scopeLabel")}
        options={scopeOptions}
        value={scope}
        containerClassName={styles.select}
        onChange={(event) =>
          onScopeChange(event.target.value as TLeaveScope | "")
        }
      />

      <SelectField
        label={t("filters.recurrenceLabel")}
        options={recurrenceOptions}
        value={recurrence}
        containerClassName={styles.select}
        onChange={(event) =>
          onRecurrenceChange(event.target.value as TLeaveRecurrence | "")
        }
      />

      <SelectField
        label={t("filters.statusLabel")}
        options={activeOptions}
        value={isActive}
        containerClassName={styles.select}
        onChange={(event) =>
          onActiveChange(event.target.value as "" | "true" | "false")
        }
      />

      {hasFilters && (
        <Button
          variant="ghost"
          leadingIcon={<X size={16} />}
          onClick={onClearFilters}
        >
          {t("filters.clear")}
        </Button>
      )}
    </div>
  );
}
