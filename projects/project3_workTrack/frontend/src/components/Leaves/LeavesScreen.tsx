"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLeaveError } from "@/src/hooks/useLeaveError";
import { useLeavesList } from "@/src/hooks/useLeavesList";
import type { ILeave } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { DeleteLeaveDialog } from "./DeleteLeaveDialog";
import { LeaveFormDialog } from "./LeaveFormDialog";
import { LeavesTable } from "./LeavesTable";
import { LeavesTableSkeleton } from "./LeavesTableSkeleton";
import { LeavesToolbar } from "./LeavesToolbar";
import styles from "./LeavesScreen.module.scss";

export function LeavesScreen() {
  const t = useTranslations("Leaves");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useLeaveError();
  const {
    query,
    search,
    type,
    scope,
    recurrence,
    isActive,
    page,
    hasFilters,
    setPage,
    setSearch,
    setType,
    setScope,
    setRecurrence,
    setIsActive,
    clearFilters,
  } = useLeavesList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<ILeave | null>(null);
  const [deletingLeave, setDeletingLeave] = useState<ILeave | null>(null);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const leaves = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  const openCreate = useCallback(() => {
    setEditingLeave(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((leave: ILeave) => {
    setEditingLeave(leave);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setDeletingLeave(null), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
  const handleDeleteSuccess = useCallback(() => setDeletingLeave(null), []);
  const handleRetry = useCallback(() => {
    void query.refetch();
  }, [query]);

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

      <LeavesToolbar
        search={search}
        type={type}
        scope={scope}
        recurrence={recurrence}
        isActive={isActive}
        hasFilters={hasFilters}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onScopeChange={setScope}
        onRecurrenceChange={setRecurrence}
        onActiveChange={setIsActive}
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
        <LeavesTableSkeleton />
      ) : leaves.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={24} />}
          title={hasFilters ? t("empty.searchTitle") : t("empty.title")}
          description={
            hasFilters ? t("empty.searchDescription") : t("empty.description")
          }
          action={
            canManage && !hasFilters ? (
              <Button leadingIcon={<Plus size={18} />} onClick={openCreate}>
                {t("create")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <LeavesTable
            items={leaves}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={setDeletingLeave}
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

      <LeaveFormDialog
        isOpen={isFormOpen}
        leave={editingLeave}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteLeaveDialog
        key={deletingLeave?.id ?? "delete"}
        leave={deletingLeave}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
