"use client";

import { useCallback, useDeferredValue, useState } from "react";
import { AUDIT_LOGS_PAGE_SIZE } from "@/src/components/AuditLogs/constants";
import { useGetAuditLogsQuery } from "@/src/lib/api/audit-api";

const toStartOfDay = (value: string): string | undefined =>
  value ? `${value}T00:00:00.000Z` : undefined;

const toEndOfDay = (value: string): string | undefined =>
  value ? `${value}T23:59:59.999Z` : undefined;

export const useAuditLogsList = () => {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());

  const query = useGetAuditLogsQuery({
    q: deferredSearch || undefined,
    action: action.trim() || undefined,
    entity: entity.trim() || undefined,
    from: toStartOfDay(from),
    to: toEndOfDay(to),
    page,
    limit: AUDIT_LOGS_PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleActionChange = useCallback((value: string) => {
    setAction(value);
    setPage(1);
  }, []);

  const handleEntityChange = useCallback((value: string) => {
    setEntity(value);
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

  const hasFilters =
    search.trim().length > 0 ||
    action.trim().length > 0 ||
    entity.trim().length > 0 ||
    from.length > 0 ||
    to.length > 0;

  const clearFilters = useCallback(() => {
    setSearch("");
    setAction("");
    setEntity("");
    setFrom("");
    setTo("");
    setPage(1);
  }, []);

  return {
    search,
    action,
    entity,
    from,
    to,
    page,
    query,
    hasFilters,
    setPage,
    handleSearchChange,
    handleActionChange,
    handleEntityChange,
    handleFromChange,
    handleToChange,
    clearFilters,
  };
};
