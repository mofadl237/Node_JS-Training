"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { useGetDepartmentsQuery } from "@/src/lib/api/departments-api";
import type { TDepartmentSortBy, TSortOrder } from "@/src/lib/api/types";
import { DEPARTMENTS_PAGE_SIZE } from "@/src/components/Departments/constants";

export const useDepartmentsList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<TDepartmentSortBy>("name");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("asc");
  const deferredSearch = useDeferredValue(search);

  const query = useGetDepartmentsQuery({
    q: deferredSearch.trim() || undefined,
    page,
    limit: DEPARTMENTS_PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((value: TDepartmentSortBy) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback((value: TSortOrder) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  return {
    search,
    page,
    sortBy,
    sortOrder,
    query,
    setPage,
    handleSearchChange,
    handleSortByChange,
    handleSortOrderChange,
  };
};
