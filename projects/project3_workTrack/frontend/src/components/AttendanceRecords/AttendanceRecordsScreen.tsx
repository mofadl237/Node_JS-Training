"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendanceRecordsError } from "@/src/hooks/useAttendanceRecordsError";
import { useAttendanceRecordsList } from "@/src/hooks/useAttendanceRecordsList";
import type { IAttendanceRecord } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { AttendanceRecordFormDialog } from "./AttendanceRecordFormDialog";
import { AttendanceRecordsTable } from "./AttendanceRecordsTable";
import { AttendanceRecordsTableSkeleton } from "./AttendanceRecordsTableSkeleton";
import { AttendanceRecordsToolbar } from "./AttendanceRecordsToolbar";
import { DeleteAttendanceRecordDialog } from "./DeleteAttendanceRecordDialog";
import styles from "./AttendanceRecordsScreen.module.scss";

export function AttendanceRecordsScreen() {
  // 1- state
  const t = useTranslations("AttendanceRecords");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useAttendanceRecordsError();
  const {
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
  } = useAttendanceRecordsList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<IAttendanceRecord | null>(null);
  const [deletingRecord, setDeletingRecord] =
    useState<IAttendanceRecord | null>(null);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const records = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  // 2- handlers
  const openCreate = useCallback(() => {
    setEditingRecord(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((record: IAttendanceRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  }, []);

  const openDelete = useCallback((record: IAttendanceRecord) => {
    setDeletingRecord(record);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setDeletingRecord(null), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
  const handleDeleteSuccess = useCallback(
    () => setDeletingRecord(null),
    [],
  );
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
        actions={
          canManage ? (
            <Button leadingIcon={<Plus size={18} />} onClick={openCreate}>
              {t("create")}
            </Button>
          ) : undefined
        }
      />

      {!canManage && <Alert variant="info" title={t("readOnly")} />}

      <AttendanceRecordsToolbar
        employee={employee}
        from={from}
        to={to}
        status={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onEmployeeChange={handleEmployeeChange}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onStatusChange={handleStatusChange}
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
        <AttendanceRecordsTableSkeleton />
      ) : records.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck2 size={24} />}
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
            ) : canManage ? (
              <Button leadingIcon={<Plus size={18} />} onClick={openCreate}>
                {t("create")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <AttendanceRecordsTable
            items={records}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <AttendanceRecordFormDialog
        isOpen={isFormOpen}
        record={editingRecord}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteAttendanceRecordDialog
        key={deletingRecord?.id ?? "delete"}
        record={deletingRecord}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
