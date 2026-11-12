"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import rowStyles from "./AuditLogRow.module.scss";
import styles from "./AuditLogsTableSkeleton.module.scss";
import tableStyles from "./AuditLogsTable.module.scss";

const SKELETON_COLUMNS = [0, 1, 2, 3, 4, 5];
const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

export function AuditLogsTableSkeleton() {
  return (
    <div className={tableStyles.wrapper} role="status" aria-busy="true">
      <table className={tableStyles.table}>
        <thead>
          <tr>
            {SKELETON_COLUMNS.map((column) => (
              <th key={column} scope="col">
                <Skeleton className={styles.skeletonShort} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROWS.map((row) => (
            <tr key={row} className={rowStyles.row}>
              <td>
                <Skeleton className={styles.skeletonDate} />
              </td>
              <td>
                <Skeleton className={styles.skeletonBadge} />
              </td>
              <td>
                <Skeleton className={styles.skeletonEntity} />
              </td>
              <td>
                <Skeleton className={styles.skeletonEntityId} />
              </td>
              <td>
                <Skeleton className={styles.skeletonUser} />
              </td>
              <td>
                <Skeleton className={styles.skeletonAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
