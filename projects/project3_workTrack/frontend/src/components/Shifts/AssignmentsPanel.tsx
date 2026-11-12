"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarRange, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEmployeeShiftsList } from "@/src/hooks/useEmployeeShiftsList";
import { useShiftError } from "@/src/hooks/useShiftError";
import type { IEmployeeShift } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { AssignmentsTable } from "./AssignmentsTable";
import { AssignmentsTableSkeleton } from "./AssignmentsTableSkeleton";
import { AssignmentsToolbar } from "./AssignmentsToolbar";
import { DeleteEmployeeShiftDialog } from "./DeleteEmployeeShiftDialog";
import { EmployeeShiftFormDialog } from "./EmployeeShiftFormDialog";
import styles from "./ShiftsPanel.module.scss";

export function AssignmentsPanel() {
  const t = useTranslations("Shifts.assignments");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useShiftError();
  const {
    query,
    employee,
    shiftId,
    isActive,
    page,
    hasFilters,
    setPage,
    setEmployee,
    setShiftId,
    setIsActive,
    clearFilters,
  } = useEmployeeShiftsList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<IEmployeeShift | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<IEmployeeShift | null>(null);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const assignments = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  const openCreate = useCallback(() => {
    setEditingAssignment(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((assignment: IEmployeeShift) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setDeletingAssignment(null), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
  const handleDeleteSuccess = useCallback(
    () => setDeletingAssignment(null),
    [],
  );
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

      <AssignmentsToolbar
        employee={employee}
        shiftId={shiftId}
        isActive={isActive}
        hasFilters={hasFilters}
        onEmployeeChange={setEmployee}
        onShiftChange={setShiftId}
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
        <AssignmentsTableSkeleton />
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={<CalendarRange size={24} />}
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
          <AssignmentsTable
            items={assignments}
            canManage={canManage}
            onEdit={openEdit}
            onDelete={setDeletingAssignment}
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

      <EmployeeShiftFormDialog
        isOpen={isFormOpen}
        assignment={editingAssignment}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteEmployeeShiftDialog
        key={deletingAssignment?.id ?? "delete"}
        assignment={deletingAssignment}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </section>
  );
}
