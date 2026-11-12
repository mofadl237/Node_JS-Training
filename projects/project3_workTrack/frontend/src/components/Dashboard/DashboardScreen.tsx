"use client";

import { useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDashboardError } from "@/src/hooks/useDashboardError";
import { useDashboardSummary } from "@/src/hooks/useDashboardSummary";
import { useDepartmentOptions } from "@/src/hooks/useDepartmentOptions";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { ErrorState } from "@/src/components/shared/ErrorState/ErrorState";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { DashboardAttendancePanel } from "./DashboardAttendancePanel";
import { DashboardKpis } from "./DashboardKpis";
import { DashboardLeavesPanel } from "./DashboardLeavesPanel";
import { DashboardRecentActivity } from "./DashboardRecentActivity";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardTodayPanel } from "./DashboardTodayPanel";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardTrendChart } from "./DashboardTrendChart";
import { DashboardWorkforcePanel } from "./DashboardWorkforcePanel";
import styles from "./DashboardScreen.module.scss";

export function DashboardScreen() {
  const t = useTranslations("Dashboard");
  const localizeError = useDashboardError();
  const { departments } = useDepartmentOptions();
  const {
    user,
    query,
    from,
    to,
    departmentId,
    canFilterDepartment,
    managerWithoutDepartment,
    rangeTooLong,
    hasFilters,
    setFrom,
    setTo,
    setDepartmentId,
    clearFilters,
  } = useDashboardSummary();
  const data = query.data;
  const isUnavailable = managerWithoutDepartment || rangeTooLong;
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
          isUnavailable ? undefined : (
            <Button
              variant="secondary"
              leadingIcon={<RefreshCw size={16} />}
              isLoading={query.isFetching}
              onClick={handleRefresh}
            >
              {t("refresh")}
            </Button>
          )
        }
      />

      {user?.role === "MANAGER" && !managerWithoutDepartment && (
        <Alert variant="info" title={t("managerScope")} />
      )}

      {managerWithoutDepartment && (
        <Alert variant="error" title={t("errors.managerDepartment")} />
      )}

      {rangeTooLong && (
        <Alert variant="error" title={t("errors.rangeTooLong")} />
      )}

      <DashboardToolbar
        from={from}
        to={to}
        departmentId={departmentId}
        departments={departments}
        canFilterDepartment={canFilterDepartment}
        hasFilters={hasFilters}
        generatedAt={data?.generatedAt}
        onFromChange={setFrom}
        onToChange={setTo}
        onDepartmentChange={setDepartmentId}
        onClearFilters={clearFilters}
      />

      {isUnavailable ? null : query.isError ? (
        <ErrorState
          title={t("errors.title")}
          description={localizeError(query.error)}
          retryLabel={t("retry")}
          onRetry={handleRefresh}
        />
      ) : query.isLoading ? (
        <DashboardSkeleton />
      ) : data ? (
        <>
          <DashboardKpis stats={data.attendance} />

          <div className={styles.panels}>
            <DashboardWorkforcePanel workforce={data.workforce} />
            <DashboardTodayPanel today={data.today} />
            <DashboardAttendancePanel stats={data.attendance} />
            <DashboardLeavesPanel leaves={data.leaves} />
          </div>

          <DashboardTrendChart trend={data.trend} period={data.period} />
          <DashboardRecentActivity logs={data.recentAuditLogs} />
        </>
      ) : null}
    </div>
  );
}
