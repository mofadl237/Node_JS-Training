"use client";

import {
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IEmployee } from "@/src/lib/api/types";
import { formatDate } from "@/src/lib/format/date";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import styles from "./EmployeeDetailsCard.module.scss";

interface IEmployeeDetailsCardProps {
  employee: IEmployee;
}

export function EmployeeDetailsCard({
  employee,
}: IEmployeeDetailsCardProps) {
  // 1- state
  const t = useTranslations("Employees");
  const locale = useLocale();
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;

  // 2- handlers

  // 3- render
  return (
    <section className={styles.card}>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          {initials}
        </span>

        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{fullName}</h3>
            <EmployeeStatusBadge status={employee.status} />
          </div>
          <p className={styles.code} dir="ltr">
            {employee.employeeCode}
          </p>
          <p className={styles.jobTitle}>
            {employee.jobTitle || t("details.noJobTitle")}
          </p>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <Building2 size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.department")}</p>
            {employee.department ? (
              <Link
                href={`/departments/${employee.department.id}`}
                className={styles.link}
              >
                {employee.department.name}
              </Link>
            ) : (
              <p className={styles.value}>{t("noDepartment")}</p>
            )}
          </div>
        </div>

        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <Mail size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.email")}</p>
            {employee.email ? (
              <a
                href={`mailto:${employee.email}`}
                className={styles.link}
                dir="ltr"
              >
                {employee.email}
              </a>
            ) : (
              <p className={styles.value}>{t("details.noEmail")}</p>
            )}
          </div>
        </div>

        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <Phone size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.phone")}</p>
            {employee.phone ? (
              <a
                href={`tel:${employee.phone}`}
                className={styles.link}
                dir="ltr"
              >
                {employee.phone}
              </a>
            ) : (
              <p className={styles.value}>{t("details.noPhone")}</p>
            )}
          </div>
        </div>

        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.hireDate")}</p>
            <p className={styles.value}>
              {formatDate(employee.hireDate, locale)}
            </p>
          </div>
        </div>

        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.createdAt")}</p>
            <p className={styles.value}>
              {formatDate(employee.createdAt, locale)}
            </p>
          </div>
        </div>

        <div className={styles.detail}>
          <span className={styles.icon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <div>
            <p className={styles.label}>{t("details.updatedAt")}</p>
            <p className={styles.value}>
              {formatDate(employee.updatedAt, locale)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerIcon} aria-hidden="true">
          <UserRound size={16} />
        </span>
        <p className={styles.footerText}>
          {t("details.profileHint", { name: fullName })}
        </p>
      </div>
    </section>
  );
}
