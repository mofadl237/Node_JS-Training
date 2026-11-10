"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { TextField } from "@/src/components/ui/TextField/TextField";
import {
  EmployeesFilters,
  type IEmployeesFiltersProps,
} from "./EmployeesFilters";
import styles from "./EmployeesToolbar.module.scss";

interface IEmployeesToolbarProps extends IEmployeesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function EmployeesToolbar({
  search,
  onSearchChange,
  ...filters
}: IEmployeesToolbarProps) {
  // 1- state
  const t = useTranslations("Employees");

  // 2- handlers
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
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

      <EmployeesFilters {...filters} />
    </div>
  );
}
