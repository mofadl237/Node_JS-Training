"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/navigation";
import {
  useGetDepartmentByIdQuery,
  useGetDepartmentEmployeeCountQuery,
} from "@/src/lib/api/departments-api";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { useDepartmentError } from "@/src/hooks/useDepartmentError";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { DepartmentDetailsCard } from "./DepartmentDetailsCard";
import { DepartmentDetailsSkeleton } from "./DepartmentDetailsSkeleton";
import { DepartmentFormDialog } from "./DepartmentFormDialog";
import styles from "./DepartmentDetailsScreen.module.scss";

interface IDepartmentDetailsScreenProps {
  departmentId: string;
}

export function DepartmentDetailsScreen({
  departmentId,
}: IDepartmentDetailsScreenProps) {
  // 1- state
  const t = useTranslations("Departments");
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useDepartmentError();
  const { data: department, isLoading, isError, error, refetch } =
    useGetDepartmentByIdQuery(departmentId);
  const employeeCountQuery =
    useGetDepartmentEmployeeCountQuery(departmentId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  // 2- handlers
  const openEdit = useCallback(() => setIsEditOpen(true), []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);
  const openDelete = useCallback(() => setIsDeleteOpen(true), []);
  const closeDelete = useCallback(() => setIsDeleteOpen(false), []);
  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);
  const handleDeleteSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.replace("/departments");
  }, [router]);

  // 3- render
  if (isLoading) return <DepartmentDetailsSkeleton />;

  if (isError || !department) {
    return (
      <ErrorState
        title={t("details.errorTitle")}
        description={
          isError
            ? localizeError(error)
            : t("details.notFoundDescription")
        }
        retryLabel={t("retry")}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("details.eyebrow")}
        title={department.name}
        actions={
          <div className={styles.actions}>
            <Link href="/departments" className={styles.backLink}>
              <ArrowLeft size={17} />
              {t("details.back")}
            </Link>

            {canManage && (
              <Button
                leadingIcon={<Pencil size={16} />}
                onClick={openEdit}
              >
                {t("details.edit")}
              </Button>
            )}

            {canManage && (
              <Button
                variant="danger"
                leadingIcon={<Trash2 size={16} />}
                onClick={openDelete}
              >
                {t("details.delete")}
              </Button>
            )}
          </div>
        }
      />

      {!canManage && (
        <Alert variant="info" title={t("details.readOnly")} />
      )}

      <DepartmentDetailsCard
        department={department}
        employeeCount={employeeCountQuery.data}
        isEmployeeCountLoading={employeeCountQuery.isLoading}
        hasEmployeeCountError={employeeCountQuery.isError}
      />

      <DepartmentFormDialog
        isOpen={isEditOpen}
        department={department}
        onClose={closeEdit}
        onSuccess={closeEdit}
      />

      <DeleteDepartmentDialog
        key={isDeleteOpen ? department.id : "delete"}
        department={isDeleteOpen ? department : null}
        onClose={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
