"use client";

import { useCallback, useState } from "react";
import { useGetAttendanceRecordsQuery } from "@/src/lib/api/attendance-api";
import type {
  IEmployee,
  TAttendanceRecordSortBy,
  TAttendanceStatus,
  TSortOrder,
} from "@/src/lib/api/types";
import { ATTENDANCE_RECORDS_PAGE_SIZE } from "@/src/components/AttendanceRecords/constants";

export const useAttendanceRecordsList = () => {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<TAttendanceStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] =
    useState<TAttendanceRecordSortBy>("date");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");

  const query = useGetAttendanceRecordsQuery({
    employeeId: employee?.id,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: ATTENDANCE_RECORDS_PAGE_SIZE,
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

  const handleStatusChange = useCallback(
    (value: TAttendanceStatus | "") => {
      setStatus(value);
      setPage(1);
    },
    [],
  );

  const handleSortByChange = useCallback(
    (value: TAttendanceRecordSortBy) => {
      setSortBy(value);
      setPage(1);
    },
    [],
  );

  const handleSortOrderChange = useCallback((value: TSortOrder) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  const hasFilters =
    employee !== null ||
    from.length > 0 ||
    to.length > 0 ||
    status.length > 0;

  const clearFilters = useCallback(() => {
    setEmployee(null);
    setFrom("");
    setTo("");
    setStatus("");
    setPage(1);
  }, []);

  return {
    employee,
    from,
    to,
    status,
    page,
    sortBy,
    sortOrder,
    query,
    hasFilters,
    setPage,
    handleEmployeeChange,
    handleFromChange,
    handleToChange,
    handleStatusChange,
    handleSortByChange,
    handleSortOrderChange,
    clearFilters,
  };
};
