"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./EmployeesTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export function EmployeesTableSkeleton() {
  return (
    <div className={styles.wrapper} role="status" aria-busy="true">
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.jobTitleCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.statusCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col" className={styles.dateCell}>
              <Skeleton className={styles.skeletonShort} />
            </th>
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROWS.map((row) => (
            <tr key={row} className={styles.row}>
              <td className={styles.employeeCell}>
                <Skeleton className={styles.skeletonName} />
                <Skeleton className={styles.skeletonCode} />
              </td>
              <td>
                <Skeleton className={styles.skeletonDepartment} />
              </td>
              <td className={styles.jobTitleCell}>
                <Skeleton className={styles.skeletonJobTitle} />
              </td>
              <td>
                <Skeleton className={styles.skeletonContact} />
              </td>
              <td className={styles.statusCell}>
                <Skeleton className={styles.skeletonStatus} />
              </td>
              <td className={styles.dateCell}>
                <Skeleton className={styles.skeletonDate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
