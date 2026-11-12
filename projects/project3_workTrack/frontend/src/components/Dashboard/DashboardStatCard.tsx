import type { ReactNode } from "react";
import styles from "./DashboardStatCard.module.scss";

type TStatTone = "brand" | "success" | "warning" | "danger" | "info";

interface IDashboardStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: TStatTone;
}

export function DashboardStatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: IDashboardStatCardProps) {
  return (
    <article className={[styles.card, styles[tone]].join(" ")}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </article>
  );
}
