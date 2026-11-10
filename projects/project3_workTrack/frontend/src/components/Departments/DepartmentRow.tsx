"use client";

import { memo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { IDepartment } from "@/src/lib/api/types";
import { formatDate } from "@/src/lib/format/date";
import styles from "./DepartmentsTable.module.scss";

interface IDepartmentRowProps {
  department: IDepartment;
  canManage: boolean;
  onEdit: (department: IDepartment) => void;
  onDelete: (department: IDepartment) => void;
}

export const DepartmentRow = memo(function DepartmentRow({
  department,
  canManage,
  onEdit,
  onDelete,
}: IDepartmentRowProps) {
  // 1- state
  const t = useTranslations("Departments");
  const locale = useLocale();

  // 2- handlers
  const handleEdit = () => onEdit(department);
  const handleDelete = () => onDelete(department);

  // 3- render
  return (
    <tr className={styles.row}>
      <td className={styles.nameCell}>
        <Link
          href={`/departments/${department.id}`}
          className={styles.nameLink}
        >
          {department.name}
        </Link>
      </td>
      <td className={styles.descriptionCell}>
        {department.description || t("noDescription")}
      </td>
      <td className={styles.dateCell}>
        {formatDate(department.createdAt, locale)}
      </td>
      <td className={styles.dateCell}>
        {formatDate(department.updatedAt, locale)}
      </td>
      <td className={styles.actionsCell}>
        <Link
          href={`/departments/${department.id}`}
          className={styles.iconButton}
          aria-label={t("view")}
          title={t("view")}
        >
          <Eye size={17} />
        </Link>

        {canManage && (
          <>
            <button
              type="button"
              className={styles.iconButton}
              onClick={handleEdit}
              aria-label={t("edit")}
              title={t("edit")}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              className={[styles.iconButton, styles.danger]
                .filter(Boolean)
                .join(" ")}
              onClick={handleDelete}
              aria-label={t("delete")}
              title={t("delete")}
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
});
