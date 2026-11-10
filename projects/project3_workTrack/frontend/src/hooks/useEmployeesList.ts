"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { useGetEmployeesQuery } from "@/src/lib/api/employees-api";
import type {
  TEmployeeSortBy,
  TEmployeeStatus,
  TSortOrder,
} from "@/src/lib/api/types";
import { EMPLOYEES_PAGE_SIZE } from "@/src/components/Employees/constants";

export const useEmployeesList = () => {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState<TEmployeeStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<TEmployeeSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const deferredSearch = useDeferredValue(search);

  const query = useGetEmployeesQuery({
    q: deferredSearch.trim() || undefined,
    departmentId: departmentId || undefined,
    status: status || undefined,
    page,
    limit: EMPLOYEES_PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setDepartmentId(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: TEmployeeStatus | "") => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((value: TEmployeeSortBy) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback((value: TSortOrder) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  const hasFilters =
    search.trim().length > 0 || departmentId.length > 0 || status.length > 0;

  const clearFilters = useCallback(() => {
    setSearch("");
    setDepartmentId("");
    setStatus("");
    setPage(1);
  }, []);

  return {
    search,
    departmentId,
    status,
    page,
    sortBy,
    sortOrder,
    query,
    hasFilters,
    setPage,
    handleSearchChange,
    handleDepartmentChange,
    handleStatusChange,
    handleSortByChange,
    handleSortOrderChange,
    clearFilters,
  };
};
