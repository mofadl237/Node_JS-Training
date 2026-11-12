import type { ReactNode } from "react";
import styles from "./DashboardPanel.module.scss";

interface IDashboardPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardPanel({
  title,
  description,
  children,
  className,
}: IDashboardPanelProps) {
  return (
    <section
      className={[styles.panel, className].filter(Boolean).join(" ")}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
