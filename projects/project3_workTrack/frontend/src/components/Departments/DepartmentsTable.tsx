"use client";

import { useTranslations } from "next-intl";
import type { IDepartment } from "@/src/lib/api/types";
import { DepartmentRow } from "./DepartmentRow";
import styles from "./DepartmentsTable.module.scss";

interface IDepartmentsTableProps {
  items: IDepartment[];
  canManage: boolean;
  onEdit: (department: IDepartment) => void;
  onDelete: (department: IDepartment) => void;
}

export function DepartmentsTable({
  items,
  canManage,
  onEdit,
  onDelete,
}: IDepartmentsTableProps) {
  // 1- state
  const t = useTranslations("Departments");

  // 2- handlers

  // 3- render
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t("columns.name")}</th>
            <th scope="col" className={styles.descriptionCell}>
              {t("columns.description")}
            </th>
            <th scope="col" className={styles.dateCell}>
              {t("columns.createdAt")}
            </th>
            <th scope="col" className={styles.dateCell}>
              {t("columns.updatedAt")}
            </th>
            <th scope="col" className={styles.actionsCell}>
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((department) => (
            <DepartmentRow
              key={department.id}
              department={department}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
