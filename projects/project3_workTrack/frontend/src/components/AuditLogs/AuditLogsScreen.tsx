"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuditLogsError } from "@/src/hooks/useAuditLogsError";
import { useAuditLogsList } from "@/src/hooks/useAuditLogsList";
import type { IAuditLog } from "@/src/lib/api/types";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { AuditLogDetailsDialog } from "./AuditLogDetailsDialog";
import { AuditLogsTable } from "./AuditLogsTable";
import { AuditLogsTableSkeleton } from "./AuditLogsTableSkeleton";
import { AuditLogsToolbar } from "./AuditLogsToolbar";
import styles from "./AuditLogsScreen.module.scss";

export function AuditLogsScreen() {
  const t = useTranslations("AuditLogs");
  const localizeError = useAuditLogsError();
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const {
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
  } = useAuditLogsList();
  const logs = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  const handleRetry = useCallback(() => {
    void query.refetch();
  }, [query]);

  const handleView = useCallback((log: IAuditLog) => {
    setSelectedLog(log);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedLog(null);
  }, []);

  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <AuditLogsToolbar
        search={search}
        action={action}
        entity={entity}
        from={from}
        to={to}
        hasFilters={hasFilters}
        onSearchChange={handleSearchChange}
        onActionChange={handleActionChange}
        onEntityChange={handleEntityChange}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onClearFilters={clearFilters}
      />

      {query.isError ? (
        <ErrorState
          title={t("error.title")}
          description={localizeError(query.error)}
          retryLabel={t("retry")}
          onRetry={handleRetry}
        />
      ) : query.isLoading ? (
        <AuditLogsTableSkeleton />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText size={24} />}
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
          <AuditLogsTable items={logs} onView={handleView} />

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <AuditLogDetailsDialog
        log={selectedLog}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
