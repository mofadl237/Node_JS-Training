"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import rowStyles from "./AttendanceRecordRow.module.scss";
import styles from "./AttendanceRecordsTableSkeleton.module.scss";
import tableStyles from "./AttendanceRecordsTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];
const SKELETON_COLUMNS = [0, 1, 2, 3, 4, 5, 6];

export function AttendanceRecordsTableSkeleton() {
  return (
    <div className={tableStyles.wrapper} role="status" aria-busy="true">
      <table className={tableStyles.table}>
        <thead>
          <tr>
            {SKELETON_COLUMNS.map((cell) => (
              <th key={cell} scope="col">
                <Skeleton className={styles.skeletonShort} />
              </th>
            ))}
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
                <Skeleton className={styles.skeletonDate} />
              </td>
              <td>
                <Skeleton className={styles.skeletonTime} />
              </td>
              <td>
                <Skeleton className={styles.skeletonTime} />
              </td>
              <td>
                <Skeleton className={styles.skeletonWorking} />
              </td>
              <td>
                <Skeleton className={styles.skeletonBadge} />
              </td>
              <td>
                <Skeleton className={styles.skeletonActions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
