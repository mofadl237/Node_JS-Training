"use client";

import { useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHrKpiError } from "@/src/hooks/useHrKpiError";
import { useHrKpiReport } from "@/src/hooks/useHrKpiReport";
import { useDepartmentOptions } from "@/src/hooks/useDepartmentOptions";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { DashboardToolbar } from "@/src/components/Dashboard/DashboardToolbar";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { HrKpiDepartmentTable } from "./HrKpiDepartmentTable";
import { HrKpiKpis } from "./HrKpiKpis";
import { HrKpiSkeleton } from "./HrKpiSkeleton";
import { HrKpiTopLateTable } from "./HrKpiTopLateTable";
import styles from "./HrKpiScreen.module.scss";

export function HrKpiScreen() {
  const t = useTranslations("HrKpi");
  const localizeError = useHrKpiError();
  const { departments } = useDepartmentOptions();
  const {
    query,
    from,
    to,
    departmentId,
    rangeTooLong,
    hasFilters,
    setFrom,
    setTo,
    setDepartmentId,
    clearFilters,
  } = useHrKpiReport();
  const data = query.data;
  const handleRefresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button
            variant="secondary"
            leadingIcon={<RefreshCw size={16} />}
            isLoading={query.isFetching}
            onClick={handleRefresh}
          >
            {t("refresh")}
          </Button>
        }
      />

      {rangeTooLong && (
        <Alert variant="error" title={t("errors.rangeTooLong")} />
      )}

      <DashboardToolbar
        from={from}
        to={to}
        departmentId={departmentId}
        departments={departments}
        canFilterDepartment
        hasFilters={hasFilters}
        generatedAt={data?.generatedAt}
        namespace="HrKpi"
        onFromChange={setFrom}
        onToChange={setTo}
        onDepartmentChange={setDepartmentId}
        onClearFilters={clearFilters}
      />

      {rangeTooLong ? null : query.isError ? (
        <ErrorState
          title={t("errors.title")}
          description={localizeError(query.error)}
          retryLabel={t("retry")}
          onRetry={handleRefresh}
        />
      ) : query.isLoading ? (
        <HrKpiSkeleton />
      ) : data ? (
        <>
          <HrKpiKpis stats={data.totals} />
          <div className={styles.tables}>
            <HrKpiDepartmentTable items={data.byDepartment} />
            <HrKpiTopLateTable items={data.topLateEmployees} />
          </div>
        </>
      ) : null}
    </div>
  );
}
