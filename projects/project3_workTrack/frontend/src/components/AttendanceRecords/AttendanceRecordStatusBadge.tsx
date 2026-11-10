"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import type { TAttendanceStatus } from "@/src/lib/api/types";
import styles from "./AttendanceRecordStatusBadge.module.scss";

interface IAttendanceRecordStatusBadgeProps {
  status: TAttendanceStatus;
}

export const AttendanceRecordStatusBadge = memo(
  function AttendanceRecordStatusBadge({
    status,
  }: IAttendanceRecordStatusBadgeProps) {
    // 1- state
    const t = useTranslations("AttendanceRecords.status");

    // 2- handlers

    // 3- render
    return (
      <span className={[styles.badge, styles[status.toLowerCase()]].join(" ")}>
        {t(status)}
      </span>
    );
  },
);
