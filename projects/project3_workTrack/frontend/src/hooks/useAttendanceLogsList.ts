"use client";

import { useCallback, useState } from "react";
import { useGetAttendanceLogsQuery } from "@/src/lib/api/attendance-api";
import type {
  IEmployee,
  TAttendanceLogSortBy,
  TAttendanceSource,
  TAttendanceType,
  TSortOrder,
} from "@/src/lib/api/types";
import { ATTENDANCE_LOGS_PAGE_SIZE } from "@/src/components/AttendanceLogs/constants";

const toStartOfDay = (value: string): string | undefined =>
  value ? `${value}T00:00:00.000Z` : undefined;

const toEndOfDay = (value: string): string | undefined =>
  value ? `${value}T23:59:59.999Z` : undefined;

export const useAttendanceLogsList = () => {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<TAttendanceType | "">("");
  const [source, setSource] = useState<TAttendanceSource | "">("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<TAttendanceLogSortBy>("timestamp");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");

  const query = useGetAttendanceLogsQuery({
    employeeId: employee?.id,
    type: type || undefined,
    source: source || undefined,
    from: toStartOfDay(from),
    to: toEndOfDay(to),
    page,
    limit: ATTENDANCE_LOGS_PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const handleEmployeeChange = useCallback((value: IEmployee | null) => {
    setEmployee(value);
    setPage(1);
  }, []);

  const handleFromChange = useCallback(
    (value: string) => {
      setFrom(value);
      if (value && to && value > to) setTo(value);
      setPage(1);
    },
    [to],
  );

  const handleToChange = useCallback(
    (value: string) => {
      setTo(value);
      if (value && from && value < from) setFrom(value);
      setPage(1);
    },
    [from],
  );

  const handleTypeChange = useCallback((value: TAttendanceType | "") => {
    setType(value);
    setPage(1);
  }, []);

  const handleSourceChange = useCallback((value: TAttendanceSource | "") => {
    setSource(value);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((value: TAttendanceLogSortBy) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback((value: TSortOrder) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  const hasFilters =
    employee !== null ||
    from.length > 0 ||
    to.length > 0 ||
    type.length > 0 ||
    source.length > 0;

  const clearFilters = useCallback(() => {
    setEmployee(null);
    setFrom("");
    setTo("");
    setType("");
    setSource("");
    setPage(1);
  }, []);

  return {
    employee,
    from,
    to,
    type,
    source,
    page,
    sortBy,
    sortOrder,
    query,
    hasFilters,
    setPage,
    handleEmployeeChange,
    handleFromChange,
    handleToChange,
    handleTypeChange,
    handleSourceChange,
    handleSortByChange,
    handleSortOrderChange,
    clearFilters,
  };
};
