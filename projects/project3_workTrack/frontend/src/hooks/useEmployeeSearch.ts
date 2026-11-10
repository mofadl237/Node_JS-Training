"use client";

import { useDeferredValue } from "react";
import { useGetEmployeesQuery } from "@/src/lib/api/employees-api";

const EMPLOYEE_SEARCH_LIMIT = 8;

export const useEmployeeSearch = (search: string) => {
  const deferredSearch = useDeferredValue(search.trim());

  const query = useGetEmployeesQuery({
    q: deferredSearch || undefined,
    page: 1,
    limit: EMPLOYEE_SEARCH_LIMIT,
    sortBy: "firstName",
    sortOrder: "asc",
  });

  return {
    employees: query.data?.items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
};
