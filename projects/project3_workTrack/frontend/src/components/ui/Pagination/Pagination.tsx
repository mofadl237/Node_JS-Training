"use client";

import { useTranslations } from "next-intl";
import { Button } from "../Button/Button";
import styles from "./Pagination.module.scss";

interface IPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: IPaginationProps) {
  // 1- state
  const t = useTranslations("Common.pagination");

  // 2- handlers
  const goToPrevious = () => onPageChange(Math.max(1, page - 1));
  const goToNext = () => onPageChange(Math.min(totalPages, page + 1));

  // 3- render
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label={t("label")}>
      <Button
        variant="secondary"
        onClick={goToPrevious}
        disabled={page <= 1}
        aria-label={t("previous")}
      >
        {t("previous")}
      </Button>

      <p className={styles.status} aria-live="polite">
        {t("pageOf", { page, totalPages })}
      </p>

      <Button
        variant="secondary"
        onClick={goToNext}
        disabled={page >= totalPages}
        aria-label={t("next")}
      >
        {t("next")}
      </Button>
    </nav>
  );
}
