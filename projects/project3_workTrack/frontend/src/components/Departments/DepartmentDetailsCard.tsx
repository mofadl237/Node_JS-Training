"use client";

import { CalendarDays, Clock3, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import type { IDepartment } from "@/src/lib/api/types";
import { formatDate } from "@/src/lib/format/date";
import styles from "./DepartmentDetailsCard.module.scss";

interface IDepartmentDetailsCardProps {
  department: IDepartment;
  employeeCount?: number;
  isEmployeeCountLoading: boolean;
  hasEmployeeCountError: boolean;
}

export function DepartmentDetailsCard({
  department,
  employeeCount,
  isEmployeeCountLoading,
  hasEmployeeCountError,
}: IDepartmentDetailsCardProps) {
  // 1- state
  const t = useTranslations("Departments");
  const locale = useLocale();
  const employeeValue = hasEmployeeCountError
    ? t("details.employeeCountUnavailable")
    : isEmployeeCountLoading
      ? null
      : String(employeeCount ?? 0);

  // 2- handlers

  // 3- render
  return (
    <section className={styles.card}>
      <div className={styles.about}>
        <h3 className={styles.heading}>{t("details.about")}</h3>
        <p className={styles.description}>
          {department.description || t("noDescription")}
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.icon} aria-hidden="true">
            <UsersRound size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.employees")}</p>
            {isEmployeeCountLoading ? (
              <Skeleton className={styles.skeletonValue} />
            ) : (
              <p className={styles.value}>{employeeValue}</p>
            )}
            <p className={styles.hint}>
              {hasEmployeeCountError
                ? t("details.employeeCountError")
                : t("details.employeesHint")}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <span className={styles.icon} aria-hidden="true">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.createdAt")}</p>
            <p className={styles.value}>
              {formatDate(department.createdAt, locale)}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <span className={styles.icon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.updatedAt")}</p>
            <p className={styles.value}>
              {formatDate(department.updatedAt, locale)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
