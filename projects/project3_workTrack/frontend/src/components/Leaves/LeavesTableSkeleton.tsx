"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./LeavesTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const SKELETON_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7];

export function LeavesTableSkeleton() {
  return (
    <div className={styles.wrapper} role="status" aria-busy="true">
      <table className={styles.table}>
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
            <tr key={row} className={styles.row}>
              {SKELETON_COLUMNS.map((column) => (
                <td key={column}>
                  <Skeleton className={styles.skeletonCell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
