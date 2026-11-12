"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShiftOptions } from "@/src/hooks/useShiftOptions";
import type { IEmployee } from "@/src/lib/api/types";
import { Button } from "@/src/components/ui/Button/Button";
import {
  SelectField,
  type ISelectOption,
} from "@/src/components/ui/SelectField/SelectField";
import { AttendanceEmployeeFilter } from "@/src/components/AttendanceLogs/AttendanceEmployeeFilter";
import styles from "./ShiftsToolbar.module.scss";

interface IAssignmentsToolbarProps {
  employee: IEmployee | null;
  shiftId: string;
  isActive: "" | "true" | "false";
  hasFilters: boolean;
  onEmployeeChange: (employee: IEmployee | null) => void;
  onShiftChange: (value: string) => void;
  onActiveChange: (value: "" | "true" | "false") => void;
  onClearFilters: () => void;
}

export function AssignmentsToolbar({
  employee,
  shiftId,
  isActive,
  hasFilters,
  onEmployeeChange,
  onShiftChange,
  onActiveChange,
  onClearFilters,
}: IAssignmentsToolbarProps) {
  const t = useTranslations("Shifts.filters");
  const { shifts, isError } = useShiftOptions();
  const shiftOptions: ISelectOption[] = [
    { value: "", label: t("allShifts") },
    ...shifts.map((shift) => ({ value: shift.id, label: shift.name })),
  ];
  const activeOptions: ISelectOption[] = [
    { value: "", label: t("allStatuses") },
    { value: "true", label: t("active") },
    { value: "false", label: t("inactive") },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.employee}>
        <AttendanceEmployeeFilter
          employee={employee}
          onChange={onEmployeeChange}
          labels={{
            label: t("employeeLabel"),
            placeholder: t("employeePlaceholder"),
            clear: t("clearEmployee"),
            loading: t("employeeLoading"),
            empty: t("employeeEmpty"),
            error: t("employeeError"),
          }}
        />
      </div>

      <SelectField
        label={t("shiftLabel")}
        options={shiftOptions}
        value={shiftId}
        containerClassName={styles.select}
        hint={isError ? t("shiftUnavailable") : undefined}
        onChange={(event) => onShiftChange(event.target.value)}
      />

      <SelectField
        label={t("statusLabel")}
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
          {t("clear")}
        </Button>
      )}
    </div>
  );
}
