"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { LEAVES_PAGE_SIZE } from "@/src/components/Leaves/constants";
import { useGetLeavesQuery } from "@/src/lib/api/leaves-api";
import type {
  TLeaveRecurrence,
  TLeaveScope,
  TLeaveType,
} from "@/src/lib/api/types";

export const useLeavesList = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TLeaveType | "">("");
  const [scope, setScope] = useState<TLeaveScope | "">("");
  const [recurrence, setRecurrence] = useState<TLeaveRecurrence | "">("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);
  const q = deferredSearch.trim();
  const query = useGetLeavesQuery({
    q: q || undefined,
    type: type || undefined,
    scope: scope || undefined,
    recurrence: recurrence || undefined,
    isActive: isActive || undefined,
    page,
    limit: LEAVES_PAGE_SIZE,
    sortBy: "startDate",
    sortOrder: "desc",
  });
  const hasFilters =
    q.length > 0 ||
    type !== "" ||
    scope !== "" ||
    recurrence !== "" ||
    isActive !== "";

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((value: TLeaveType | "") => {
    setType(value);
    setPage(1);
  }, []);

  const handleScopeChange = useCallback((value: TLeaveScope | "") => {
    setScope(value);
    setPage(1);
  }, []);

  const handleRecurrenceChange = useCallback(
    (value: TLeaveRecurrence | "") => {
      setRecurrence(value);
      setPage(1);
    },
    [],
  );

  const handleActiveChange = useCallback((value: "" | "true" | "false") => {
    setIsActive(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setType("");
    setScope("");
    setRecurrence("");
    setIsActive("");
    setPage(1);
  }, []);

  return {
    query,
    search,
    type,
    scope,
    recurrence,
    isActive,
    page,
    hasFilters,
    setPage,
    setSearch: handleSearchChange,
    setType: handleTypeChange,
    setScope: handleScopeChange,
    setRecurrence: handleRecurrenceChange,
    setIsActive: handleActiveChange,
    clearFilters,
  };
};
