import styles from "./DashboardMetrics.module.scss";

export interface IDashboardMetric {
  label: string;
  value: string;
  hint?: string;
}

interface IDashboardMetricsProps {
  items: IDashboardMetric[];
}

export function DashboardMetrics({ items }: IDashboardMetricsProps) {
  return (
    <dl className={styles.grid}>
      {items.map((item) => (
        <div key={item.label} className={styles.metric}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
          {item.hint && <dd className={styles.hint}>{item.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}
