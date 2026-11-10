"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import type { TAttendanceSource } from "@/src/lib/api/types";
import styles from "./AttendanceSourceBadge.module.scss";

interface IAttendanceSourceBadgeProps {
  source: TAttendanceSource;
}

export const AttendanceSourceBadge = memo(function AttendanceSourceBadge({
  source,
}: IAttendanceSourceBadgeProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs.source");

  // 2- handlers

  // 3- render
  return <span className={styles.sourceBadge}>{t(source)}</span>;
});
