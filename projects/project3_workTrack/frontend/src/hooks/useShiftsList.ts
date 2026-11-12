"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { SHIFTS_PAGE_SIZE } from "@/src/components/Shifts/constants";
import { useGetShiftsQuery } from "@/src/lib/api/shifts-api";

export const useShiftsList = () => {
  const [search, setSearch] = useState("");
  const [isNightShift, setIsNightShift] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);
  const q = deferredSearch.trim();
  const query = useGetShiftsQuery({
    q: q || undefined,
    isNightShift: isNightShift || undefined,
    page,
    limit: SHIFTS_PAGE_SIZE,
    sortBy: "name",
    sortOrder: "asc",
  });
  const hasFilters = q.length > 0 || isNightShift !== "";

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleNightShiftChange = useCallback((value: "" | "true" | "false") => {
    setIsNightShift(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setIsNightShift("");
    setPage(1);
  }, []);

  return {
    query,
    search,
    isNightShift,
    page,
    hasFilters,
    setPage,
    setSearch: handleSearchChange,
    setIsNightShift: handleNightShiftChange,
    clearFilters,
  };
};
