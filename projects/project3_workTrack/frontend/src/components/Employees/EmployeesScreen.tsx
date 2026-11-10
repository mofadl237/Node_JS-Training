"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDepartmentOptions } from "@/src/hooks/useDepartmentOptions";
import { useEmployeeError } from "@/src/hooks/useEmployeeError";
import { useEmployeesList } from "@/src/hooks/useEmployeesList";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { Pagination } from "@/src/components/ui/Pagination/Pagination";
import { EmptyState } from "@/src/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { EmployeesTable } from "./EmployeesTable";
import { EmployeesTableSkeleton } from "./EmployeesTableSkeleton";
import { EmployeesToolbar } from "./EmployeesToolbar";
import styles from "./EmployeesScreen.module.scss";

export function EmployeesScreen() {
  // 1- state
  const t = useTranslations("Employees");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useEmployeeError();
  const { departments } = useDepartmentOptions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    search,
    departmentId,
    status,
    page,
    sortBy,
    sortOrder,
    query,
    hasFilters,
    setPage,
    handleSearchChange,
    handleDepartmentChange,
    handleStatusChange,
    handleSortByChange,
    handleSortOrderChange,
    clearFilters,
  } = useEmployeesList();
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const employees = query.data?.items ?? [];
  const meta = query.data?.meta;

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  // 2- handlers
  const openCreate = useCallback(() => setIsFormOpen(true), []);
  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const handleFormSuccess = useCallback(() => setIsFormOpen(false), []);
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

      <EmployeesToolbar
        search={search}
        departmentId={departmentId}
        status={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
        departments={departments}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
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
        <EmployeesTableSkeleton />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={<UsersRound size={24} />}
          title={
            hasFilters ? t("empty.searchTitle") : t("empty.title")
          }
          description={
            hasFilters
              ? t("empty.searchDescription")
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
          <EmployeesTable items={employees} />

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <EmployeeFormDialog
        isOpen={isFormOpen}
        employee={null}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
