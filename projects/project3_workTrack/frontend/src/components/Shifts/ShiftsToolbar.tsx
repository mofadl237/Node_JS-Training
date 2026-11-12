"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./ShiftsToolbar.module.scss";

interface IShiftsToolbarProps {
  search: string;
  isNightShift: "" | "true" | "false";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onNightShiftChange: (value: "" | "true" | "false") => void;
  onClearFilters: () => void;
}

export function ShiftsToolbar({
  search,
  isNightShift,
  hasFilters,
  onSearchChange,
  onNightShiftChange,
  onClearFilters,
}: IShiftsToolbarProps) {
  const t = useTranslations("Shifts.filters");
  const nightOptions: ISelectOption[] = [
    { value: "", label: t("allShiftTypes") },
    { value: "false", label: t("dayShift") },
    { value: "true", label: t("nightShift") },
  ];

  return (
    <div className={styles.toolbar}>
      <TextField
        label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
        leadingIcon={<Search size={16} />}
        value={search}
        containerClassName={styles.search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <SelectField
        label={t("shiftTypeLabel")}
        options={nightOptions}
        value={isNightShift}
        containerClassName={styles.select}
        onChange={(event) =>
          onNightShiftChange(event.target.value as "" | "true" | "false")
        }
      />

      {hasFilters && (
        <Button
          variant="ghost"
          leadingIcon={<X size={16} />}
          onClick={onClearFilters}
        >
          {t("clear")}
        </Button>
      )}
    </div>
  );
}
