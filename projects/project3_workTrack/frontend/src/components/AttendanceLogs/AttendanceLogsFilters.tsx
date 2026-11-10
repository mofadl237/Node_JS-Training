"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type {
  TAttendanceLogSortBy,
  TAttendanceSource,
  TAttendanceType,
  TSortOrder,
} from "@/src/lib/api/types";
import styles from "./AttendanceLogsToolbar.module.scss";

export interface IAttendanceLogsFiltersProps {
  from: string;
  to: string;
  type: TAttendanceType | "";
  source: TAttendanceSource | "";
  sortBy: TAttendanceLogSortBy;
  sortOrder: TSortOrder;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onTypeChange: (value: TAttendanceType | "") => void;
  onSourceChange: (value: TAttendanceSource | "") => void;
  onSortByChange: (value: TAttendanceLogSortBy) => void;
  onSortOrderChange: (value: TSortOrder) => void;
}

const isAttendanceType = (value: string): value is TAttendanceType =>
  value === "CHECK_IN" || value === "CHECK_OUT";

const isAttendanceSource = (value: string): value is TAttendanceSource =>
  value === "MANUAL" || value === "CSV" || value === "SYSTEM";

const isAttendanceSortBy = (value: string): value is TAttendanceLogSortBy =>
  value === "timestamp" || value === "createdAt";

const isSortOrder = (value: string): value is TSortOrder =>
  value === "asc" || value === "desc";

export function AttendanceLogsFilters({
  from,
  to,
  type,
  source,
  sortBy,
  sortOrder,
  onFromChange,
  onToChange,
  onTypeChange,
  onSourceChange,
  onSortByChange,
  onSortOrderChange,
}: IAttendanceLogsFiltersProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs");
  const typeOptions: ISelectOption[] = [
    { value: "", label: t("allTypes") },
    { value: "CHECK_IN", label: t("type.CHECK_IN") },
    { value: "CHECK_OUT", label: t("type.CHECK_OUT") },
  ];
  const sourceOptions: ISelectOption[] = [
    { value: "", label: t("allSources") },
    { value: "MANUAL", label: t("source.MANUAL") },
    { value: "CSV", label: t("source.CSV") },
    { value: "SYSTEM", label: t("source.SYSTEM") },
  ];
  const sortOptions: ISelectOption[] = [
    { value: "timestamp", label: t("sort.timestamp") },
    { value: "createdAt", label: t("sort.createdAt") },
  ];
  const orderOptions: ISelectOption[] = [
    { value: "asc", label: t("order.asc") },
    { value: "desc", label: t("order.desc") },
  ];

  // 2- handlers
  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFromChange(event.target.value);
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToChange(event.target.value);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "" || isAttendanceType(value)) onTypeChange(value);
  };

  const handleSourceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "" || isAttendanceSource(value)) onSourceChange(value);
  };

  const handleSortByChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isAttendanceSortBy(value)) onSortByChange(value);
  };

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isSortOrder(value)) onSortOrderChange(value);
  };

  // 3- render
  return (
    <>
      <TextField
        label={t("fromLabel")}
        type="date"
        value={from}
        max={to || undefined}
        onChange={handleFromChange}
        containerClassName={styles.select}
      />

      <TextField
        label={t("toLabel")}
        type="date"
        value={to}
        min={from || undefined}
        onChange={handleToChange}
        containerClassName={styles.select}
      />

      <SelectField
        label={t("typeLabel")}
        options={typeOptions}
        value={type}
        onChange={handleTypeChange}
        containerClassName={styles.select}
      />

      <SelectField
        label={t("sourceLabel")}
        options={sourceOptions}
        value={source}
        onChange={handleSourceChange}
        containerClassName={styles.select}
      />

      <SelectField
        label={t("sortLabel")}
        options={sortOptions}
        value={sortBy}
        onChange={handleSortByChange}
        containerClassName={styles.select}
      />

      <SelectField
        label={t("orderLabel")}
        options={orderOptions}
        value={sortOrder}
        onChange={handleSortOrderChange}
        containerClassName={styles.select}
      />
    </>
  );
}
