"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "../Spinner/Spinner";
import styles from "./PageLoader.module.scss";

export function PageLoader() {
  const t = useTranslations("Common");

  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <Spinner size="lg" />
      <span className={styles.label}>{t("loading")}</span>
    </div>
  );
}
