"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { SelectField } from "@/src/components/ui/SelectField/SelectField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import type { TDepartmentSortBy, TSortOrder } from "@/src/lib/api/types";
import styles from "./DepartmentsToolbar.module.scss";

interface IDepartmentsToolbarProps {
  search: string;
  sortBy: TDepartmentSortBy;
  sortOrder: TSortOrder;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: TDepartmentSortBy) => void;
  onSortOrderChange: (value: TSortOrder) => void;
}

const isDepartmentSortBy = (value: string): value is TDepartmentSortBy =>
  value === "name" || value === "createdAt" || value === "updatedAt";

const isSortOrder = (value: string): value is TSortOrder =>
  value === "asc" || value === "desc";

export function DepartmentsToolbar({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: IDepartmentsToolbarProps) {
  // 1- state
  const t = useTranslations("Departments");
  const sortOptions: ISelectOption[] = [
    { value: "name", label: t("sort.name") },
    { value: "createdAt", label: t("sort.createdAt") },
    { value: "updatedAt", label: t("sort.updatedAt") },
  ];
  const orderOptions: ISelectOption[] = [
    { value: "asc", label: t("order.asc") },
    { value: "desc", label: t("order.desc") },
  ];

  // 2- handlers
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleSortByChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (isDepartmentSortBy(value)) onSortByChange(value);
  };

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (isSortOrder(value)) onSortOrderChange(value);
  };

  // 3- render
  return (
    <div className={styles.toolbar}>
      <TextField
        label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={handleSearchChange}
        leadingIcon={<Search size={17} />}
        containerClassName={styles.search}
        type="search"
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
    </div>
  );
}
