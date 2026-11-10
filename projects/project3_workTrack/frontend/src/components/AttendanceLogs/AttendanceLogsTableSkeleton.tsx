"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import rowStyles from "./AttendanceLogRow.module.scss";
import styles from "./AttendanceLogsTableSkeleton.module.scss";
import tableStyles from "./AttendanceLogsTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

export function AttendanceLogsTableSkeleton() {
  return (
    <div className={tableStyles.wrapper} role="status" aria-busy="true">
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
            <th scope="col">
              <Skeleton className={styles.skeletonShort} />
            </th>
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROWS.map((row) => (
            <tr key={row} className={rowStyles.row}>
              <td className={rowStyles.employeeCell}>
                <Skeleton className={styles.skeletonAvatar} />
                <Skeleton className={styles.skeletonName} />
              </td>
              <td>
                <Skeleton className={styles.skeletonBadge} />
              </td>
              <td>
                <Skeleton className={styles.skeletonDate} />
              </td>
              <td>
                <Skeleton className={styles.skeletonBadge} />
              </td>
              <td>
                <Skeleton className={styles.skeletonActor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
