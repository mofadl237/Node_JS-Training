import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./HrKpiSkeleton.module.scss";

const KPI_SKELETONS = 4;
const PANEL_SKELETONS = 2;

export function HrKpiSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.kpis}>
        {Array.from({ length: KPI_SKELETONS }, (_, index) => (
          <Skeleton key={index} className={styles.kpi} />
        ))}
      </div>

      <div className={styles.panels}>
        {Array.from({ length: PANEL_SKELETONS }, (_, index) => (
          <Skeleton key={index} className={styles.panel} />
        ))}
      </div>
    </div>
  );
}
