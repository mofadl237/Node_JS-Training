"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useGetEmployeeByIdQuery } from "@/src/lib/api/employees-api";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";
import { useEmployeeError } from "@/src/hooks/useEmployeeError";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { EmployeeDetailsCard } from "./EmployeeDetailsCard";
import { EmployeeDetailsSkeleton } from "./EmployeeDetailsSkeleton";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import styles from "./EmployeeDetailsScreen.module.scss";

interface IEmployeeDetailsScreenProps {
  employeeId: string;
}

export function EmployeeDetailsScreen({
  employeeId,
}: IEmployeeDetailsScreenProps) {
  // 1- state
  const t = useTranslations("Employees");
  const user = useAppSelector(selectCurrentUser);
  const localizeError = useEmployeeError();
  const { data: employee, isLoading, isError, error, refetch } =
    useGetEmployeeByIdQuery(employeeId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  // 2- handlers
  const openEdit = useCallback(() => setIsEditOpen(true), []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);
  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  // 3- render
  if (isLoading) return <EmployeeDetailsSkeleton />;

  if (isError || !employee) {
    return (
      <ErrorState
        title={t("details.errorTitle")}
        description={
          isError ? localizeError(error) : t("details.notFoundDescription")
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
        title={`${employee.firstName} ${employee.lastName}`}
        actions={
          <div className={styles.actions}>
            <Link href="/employees" className={styles.backLink}>
              <ArrowLeft size={17} />
              {t("details.back")}
            </Link>

            {canManage && (
              <Button leadingIcon={<Pencil size={16} />} onClick={openEdit}>
                {t("details.edit")}
              </Button>
            )}
          </div>
        }
      />

      {!canManage && <Alert variant="info" title={t("details.readOnly")} />}

      <EmployeeDetailsCard employee={employee} />

      <EmployeeFormDialog
        isOpen={isEditOpen}
        employee={employee}
        onClose={closeEdit}
        onSuccess={closeEdit}
      />
    </div>
  );
}
