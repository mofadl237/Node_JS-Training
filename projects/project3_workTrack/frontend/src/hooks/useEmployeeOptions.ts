"use client";

import { useGetEmployeesQuery } from "@/src/lib/api/employees-api";

const EMPLOYEE_OPTIONS_LIMIT = 100;

export const useEmployeeOptions = () => {
  const query = useGetEmployeesQuery({
    page: 1,
    limit: EMPLOYEE_OPTIONS_LIMIT,
    sortBy: "firstName",
    sortOrder: "asc",
  });

  return {
    employees: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
