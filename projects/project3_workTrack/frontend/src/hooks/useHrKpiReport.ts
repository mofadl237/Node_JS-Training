"use client";

import { useCallback, useState } from "react";
import { useGetHrKpiReportQuery } from "@/src/lib/api/dashboard-api";

const DAY_IN_MS = 86_400_000;
const MAX_RANGE_DAYS = 366;

const isRangeTooLong = (from: string, to: string): boolean => {
  if (!from || !to) return false;

  const start = Date.parse(from);
  const end = Date.parse(to);

  if (Number.isNaN(start) || Number.isNaN(end)) return false;

  return (end - start) / DAY_IN_MS > MAX_RANGE_DAYS;
};

export const useHrKpiReport = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const rangeTooLong = isRangeTooLong(from, to);
  const query = useGetHrKpiReportQuery(
    {
      from: from || undefined,
      to: to || undefined,
      departmentId: departmentId || undefined,
    },
    { skip: rangeTooLong },
  );

  const handleFromChange = useCallback(
    (value: string) => {
      setFrom(value);
      if (value && to && value > to) setTo(value);
    },
    [to],
  );

  const handleToChange = useCallback(
    (value: string) => {
      setTo(value);
      if (value && from && value < from) setFrom(value);
    },
    [from],
  );

  const handleDepartmentChange = useCallback((value: string) => {
    setDepartmentId(value);
  }, []);

  const clearFilters = useCallback(() => {
    setFrom("");
    setTo("");
    setDepartmentId("");
  }, []);

  const hasFilters =
    from.length > 0 || to.length > 0 || departmentId.length > 0;

  return {
    query,
    from,
    to,
    departmentId,
    rangeTooLong,
    hasFilters,
    setFrom: handleFromChange,
    setTo: handleToChange,
    setDepartmentId: handleDepartmentChange,
    clearFilters,
  };
};
