"use client";

import { useGetDepartmentsQuery } from "@/src/lib/api/departments-api";

export const useDepartmentOptions = () => {
  const query = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  return {
    departments: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
