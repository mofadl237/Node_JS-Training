"use client";

import { useCallback, useEffect } from "react";
import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendanceLogsError } from "@/src/hooks/useAttendanceLogsError";
import { useAttendanceLogsList } from "@/src/hooks/useAttendanceLogsList";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { AttendanceLogsTable } from "./AttendanceLogsTable";
import { AttendanceLogsTableSkeleton } from "./AttendanceLogsTableSkeleton";
import { AttendanceLogsToolbar } from "./AttendanceLogsToolbar";
import styles from "./AttendanceLogsScreen.module.scss";

export function AttendanceLogsScreen() {
  // 1- state
  const t = useTranslations("AttendanceLogs");
  const localizeError = useAttendanceLogsError();
  const {
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
  } = useAttendanceLogsList();
  const logs = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  // 2- handlers
  const handleRetry = useCallback(() => {
    void query.refetch();
  }, [query]);

  // 3- render
  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <AttendanceLogsToolbar
        employee={employee}
        from={from}
        to={to}
        type={type}
        source={source}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onEmployeeChange={handleEmployeeChange}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onTypeChange={handleTypeChange}
        onSourceChange={handleSourceChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
      />

      {query.isError ? (
        <ErrorState
          title={t("error.title")}
          description={localizeError(query.error)}
          retryLabel={t("retry")}
          onRetry={handleRetry}
        />
      ) : query.isLoading ? (
        <AttendanceLogsTableSkeleton />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<Clock3 size={24} />}
          title={hasFilters ? t("empty.filteredTitle") : t("empty.title")}
          description={
            hasFilters
              ? t("empty.filteredDescription")
              : t("empty.description")
          }
          action={
            hasFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                {t("empty.clearFilters")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <AttendanceLogsTable items={logs} />

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
