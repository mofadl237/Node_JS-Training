"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./DepartmentDetailsSkeleton.module.scss";

export function DepartmentDetailsSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-busy="true">
      <div className={styles.header}>
        <Skeleton className={styles.eyebrow} />
        <Skeleton className={styles.title} />
        <Skeleton className={styles.description} />
      </div>

      <div className={styles.card}>
        <Skeleton className={styles.cardTitle} />
        <Skeleton className={styles.cardDescription} />
        <div className={styles.stats}>
          <Skeleton className={styles.stat} />
          <Skeleton className={styles.stat} />
          <Skeleton className={styles.stat} />
        </div>
      </div>
    </div>
  );
}
