"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./DepartmentsTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export function DepartmentsTableSkeleton() {
  return (
    <div className={styles.wrapper} role="status" aria-busy="true">
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.descriptionCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.dateCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.dateCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.actionsCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROWS.map((row) => (
            <tr key={row} className={styles.row}>
              <td>
                <Skeleton className={styles.skeletonName} />
              </td>
              <td className={styles.descriptionCell}>
                <Skeleton className={styles.skeletonDescription} />
              </td>
              <td className={styles.dateCell}>
                <Skeleton className={styles.skeletonDate} />
              </td>
              <td className={styles.dateCell}>
                <Skeleton className={styles.skeletonDate} />
              </td>
              <td className={styles.actionsCell}>
                <Skeleton className={styles.skeletonActions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
