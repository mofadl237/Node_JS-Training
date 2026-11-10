"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import type { ISelectOption } from "@/src/components/ui/SelectField/SelectField";
import { SelectField } from "@/src/components/ui/SelectField/SelectField";
import type {
  IDepartment,
  TEmployeeSortBy,
  TEmployeeStatus,
  TSortOrder,
} from "@/src/lib/api/types";
import styles from "./EmployeesToolbar.module.scss";

export interface IEmployeesFiltersProps {
  departmentId: string;
  status: TEmployeeStatus | "";
  sortBy: TEmployeeSortBy;
  sortOrder: TSortOrder;
  departments: IDepartment[];
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: TEmployeeStatus | "") => void;
  onSortByChange: (value: TEmployeeSortBy) => void;
  onSortOrderChange: (value: TSortOrder) => void;
}

const isEmployeeStatus = (value: string): value is TEmployeeStatus =>
  value === "ACTIVE" || value === "INACTIVE";

const isEmployeeSortBy = (value: string): value is TEmployeeSortBy =>
  value === "employeeCode" ||
  value === "firstName" ||
  value === "lastName" ||
  value === "hireDate" ||
  value === "createdAt" ||
  value === "updatedAt";

const isSortOrder = (value: string): value is TSortOrder =>
  value === "asc" || value === "desc";

export function EmployeesFilters({
  departmentId,
  status,
  sortBy,
  sortOrder,
  departments,
  onDepartmentChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
}: IEmployeesFiltersProps) {
  // 1- state
  const t = useTranslations("Employees");
  const departmentOptions: ISelectOption[] = [
    { value: "", label: t("allDepartments") },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];
  const statusOptions: ISelectOption[] = [
    { value: "", label: t("allStatuses") },
    { value: "ACTIVE", label: t("status.active") },
    { value: "INACTIVE", label: t("status.inactive") },
  ];
  const sortOptions: ISelectOption[] = [
    { value: "createdAt", label: t("sort.createdAt") },
    { value: "updatedAt", label: t("sort.updatedAt") },
    { value: "employeeCode", label: t("sort.employeeCode") },
    { value: "firstName", label: t("sort.firstName") },
    { value: "lastName", label: t("sort.lastName") },
    { value: "hireDate", label: t("sort.hireDate") },
  ];
  const orderOptions: ISelectOption[] = [
    { value: "asc", label: t("order.asc") },
    { value: "desc", label: t("order.desc") },
  ];

  // 2- handlers
  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onDepartmentChange(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "" || isEmployeeStatus(value)) onStatusChange(value);
  };

  const handleSortByChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (isEmployeeSortBy(value)) onSortByChange(value);
  };

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (isSortOrder(value)) onSortOrderChange(value);
  };

  // 3- render
  return (
    <>
      <SelectField
        label={t("departmentLabel")}
        options={departmentOptions}
        value={departmentId}
        onChange={handleDepartmentChange}
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
