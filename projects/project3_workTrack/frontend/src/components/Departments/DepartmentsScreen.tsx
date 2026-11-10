"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDepartmentsList } from "@/src/hooks/useDepartmentsList";
import { useDepartmentError } from "@/src/hooks/useDepartmentError";
import type { IDepartment } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { DepartmentsTable } from "./DepartmentsTable";
import { DepartmentsTableSkeleton } from "./DepartmentsTableSkeleton";
import { DepartmentsToolbar } from "./DepartmentsToolbar";
import styles from "./DepartmentsScreen.module.scss";

export function DepartmentsScreen() {
  // 1- state
  const t = useTranslations("Departments");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useDepartmentError();
  const {
    search,
    page,
    sortBy,
    sortOrder,
    query,
    setPage,
    handleSearchChange,
    handleSortByChange,
    handleSortOrderChange,
  } = useDepartmentsList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<IDepartment | null>(null);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const departments = query.data?.items ?? [];
  const meta = query.data?.meta;
  const hasSearch = search.trim().length > 0;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  // 2- handlers
  const openCreate = useCallback(() => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((department: IDepartment) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  }, []);

  const openDelete = useCallback((department: IDepartment) => {
    setDeletingDepartment(department);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closeDelete = useCallback(() => setDeletingDepartment(null), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
  const handleDeleteSuccess = useCallback(
    () => setDeletingDepartment(null),
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

      <DepartmentsToolbar
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
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
        <DepartmentsTableSkeleton />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={<Building2 size={24} />}
          title={hasSearch ? t("empty.searchTitle") : t("empty.title")}
          description={
            hasSearch
              ? t("empty.searchDescription")
              : t("empty.description")
          }
          action={
            canManage && !hasSearch ? (
              <Button leadingIcon={<Plus size={18} />} onClick={openCreate}>
                {t("create")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <DepartmentsTable
            items={departments}
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

      <DepartmentFormDialog
        isOpen={isFormOpen}
        department={editingDepartment}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteDepartmentDialog
        key={deletingDepartment?.id ?? "delete"}
        department={deletingDepartment}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
