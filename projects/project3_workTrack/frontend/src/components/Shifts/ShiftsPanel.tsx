"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShiftsList } from "@/src/hooks/useShiftsList";
import { useShiftError } from "@/src/hooks/useShiftError";
import type { IShift } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { DeleteShiftDialog } from "./DeleteShiftDialog";
import { ShiftFormDialog } from "./ShiftFormDialog";
import { ShiftsTable } from "./ShiftsTable";
import { ShiftsTableSkeleton } from "./ShiftsTableSkeleton";
import { ShiftsToolbar } from "./ShiftsToolbar";
import styles from "./ShiftsPanel.module.scss";

export function ShiftsPanel() {
  const t = useTranslations("Shifts.shifts");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useShiftError();
  const {
    query,
    search,
    isNightShift,
    page,
    hasFilters,
    setPage,
    setSearch,
    setIsNightShift,
    clearFilters,
  } = useShiftsList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<IShift | null>(null);
  const [deletingShift, setDeletingShift] = useState<IShift | null>(null);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const shifts = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  const openCreate = useCallback(() => {
    setEditingShift(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((shift: IShift) => {
    setEditingShift(shift);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setDeletingShift(null), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
  const handleDeleteSuccess = useCallback(() => setDeletingShift(null), []);
  const handleRetry = useCallback(() => {
    void query.refetch();
  }, [query]);

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t("title")}</h3>
          <p className={styles.description}>{t("description")}</p>
        </div>
        {canManage && (
          <Button leadingIcon={<Plus size={18} />} onClick={openCreate}>
            {t("create")}
          </Button>
        )}
      </div>

      {!canManage && <Alert variant="info" title={t("readOnly")} />}

      <ShiftsToolbar
        search={search}
        isNightShift={isNightShift}
        hasFilters={hasFilters}
        onSearchChange={setSearch}
        onNightShiftChange={setIsNightShift}
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
        <ShiftsTableSkeleton />
      ) : shifts.length === 0 ? (
        <EmptyState
          icon={<CalendarClock size={24} />}
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
          <ShiftsTable
            items={shifts}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={setDeletingShift}
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

      <ShiftFormDialog
        isOpen={isFormOpen}
        shift={editingShift}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteShiftDialog
        key={deletingShift?.id ?? "delete"}
        shift={deletingShift}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </section>
  );
}
