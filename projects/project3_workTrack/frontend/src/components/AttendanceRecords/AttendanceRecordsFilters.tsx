"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type {
  TAttendanceRecordSortBy,
  TAttendanceStatus,
  TSortOrder,
} from "@/src/lib/api/types";
import styles from "./AttendanceRecordsToolbar.module.scss";

export interface IAttendanceRecordsFiltersProps {
  from: string;
  to: string;
  status: TAttendanceStatus | "";
  sortBy: TAttendanceRecordSortBy;
  sortOrder: TSortOrder;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onStatusChange: (value: TAttendanceStatus | "") => void;
  onSortByChange: (value: TAttendanceRecordSortBy) => void;
  onSortOrderChange: (value: TSortOrder) => void;
}

const isAttendanceStatus = (value: string): value is TAttendanceStatus =>
  value === "PRESENT" ||
  value === "ABSENT" ||
  value === "LATE" ||
  value === "HALF_DAY" ||
  value === "ON_LEAVE";

const isRecordSortBy = (value: string): value is TAttendanceRecordSortBy =>
  value === "date" || value === "createdAt" || value === "updatedAt";

const isSortOrder = (value: string): value is TSortOrder =>
  value === "asc" || value === "desc";

export function AttendanceRecordsFilters({
  from,
  to,
  status,
  sortBy,
  sortOrder,
  onFromChange,
  onToChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
}: IAttendanceRecordsFiltersProps) {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const statusOptions: ISelectOption[] = [
    { value: "", label: t("allStatuses") },
    { value: "PRESENT", label: t("status.PRESENT") },
    { value: "ABSENT", label: t("status.ABSENT") },
    { value: "LATE", label: t("status.LATE") },
    { value: "HALF_DAY", label: t("status.HALF_DAY") },
    { value: "ON_LEAVE", label: t("status.ON_LEAVE") },
  ];
  const sortOptions: ISelectOption[] = [
    { value: "date", label: t("sort.date") },
    { value: "createdAt", label: t("sort.createdAt") },
    { value: "updatedAt", label: t("sort.updatedAt") },
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

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "" || isAttendanceStatus(value)) onStatusChange(value);
  };

  const handleSortByChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isRecordSortBy(value)) onSortByChange(value);
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
        label={t("statusLabel")}
        options={statusOptions}
        value={status}
        onChange={handleStatusChange}
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
