"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./EmployeeDetailsSkeleton.module.scss";

export function EmployeeDetailsSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-busy="true">
      <div className={styles.header}>
        <Skeleton className={styles.eyebrow} />
        <Skeleton className={styles.title} />
        <Skeleton className={styles.description} />
      </div>

      <div className={styles.card}>
        <div className={styles.profile}>
          <Skeleton className={styles.avatar} />
          <div className={styles.identity}>
            <Skeleton className={styles.name} />
            <Skeleton className={styles.code} />
            <Skeleton className={styles.jobTitle} />
          </div>
        </div>

        <div className={styles.details}>
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className={styles.detail} />
          ))}
        </div>
      </div>
    </div>
  );
}
