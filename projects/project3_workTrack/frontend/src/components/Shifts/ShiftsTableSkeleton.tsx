"use client";

import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import styles from "./ShiftsTable.module.scss";

const SKELETON_ROWS = [0, 1, 2, 3, 4];

interface IShiftsTableSkeletonProps {
  columns?: number;
}

export function ShiftsTableSkeleton({
  columns = 7,
}: IShiftsTableSkeletonProps) {
  return (
    <div className={styles.wrapper} role="status" aria-busy="true">
      <table className={styles.table}>
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} scope="col">
                <Skeleton className={styles.skeletonShort} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROWS.map((row) => (
            <tr key={row} className={styles.row}>
              {Array.from({ length: columns }, (_, index) => (
                <td key={index}>
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
