"use client";

import { useCallback, useState } from "react";
import { EMPLOYEE_SHIFTS_PAGE_SIZE } from "@/src/components/Shifts/constants";
import { useGetEmployeeShiftsQuery } from "@/src/lib/api/shifts-api";
import type { IEmployee } from "@/src/lib/api/types";

export const useEmployeeShiftsList = () => {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [shiftId, setShiftId] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const query = useGetEmployeeShiftsQuery({
    employeeId: employee?.id,
    shiftId: shiftId || undefined,
    isActive: isActive || undefined,
    page,
    limit: EMPLOYEE_SHIFTS_PAGE_SIZE,
    sortBy: "startDate",
    sortOrder: "desc",
  });
  const hasFilters = employee !== null || shiftId !== "" || isActive !== "";

  const handleEmployeeChange = useCallback((value: IEmployee | null) => {
    setEmployee(value);
    setPage(1);
  }, []);

  const handleShiftChange = useCallback((value: string) => {
    setShiftId(value);
    setPage(1);
  }, []);

  const handleActiveChange = useCallback((value: "" | "true" | "false") => {
    setIsActive(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setEmployee(null);
    setShiftId("");
    setIsActive("");
    setPage(1);
  }, []);

  return {
    query,
    employee,
    shiftId,
    isActive,
    page,
    hasFilters,
    setPage,
    setEmployee: handleEmployeeChange,
    setShiftId: handleShiftChange,
    setIsActive: handleActiveChange,
    clearFilters,
  };
};
