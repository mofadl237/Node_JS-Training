"use client";

import { memo } from "react";
import { LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TAttendanceType } from "@/src/lib/api/types";
import styles from "./AttendanceEventBadge.module.scss";

interface IAttendanceEventBadgeProps {
  type: TAttendanceType;
}

export const AttendanceEventBadge = memo(function AttendanceEventBadge({
  type,
}: IAttendanceEventBadgeProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs.type");
  const isCheckIn = type === "CHECK_IN";
  const Icon = isCheckIn ? LogIn : LogOut;

  // 2- handlers

  // 3- render
  return (
    <span
      className={[
        styles.eventBadge,
        isCheckIn ? styles.checkIn : styles.checkOut,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon size={14} strokeWidth={2.4} aria-hidden="true" />
      {isCheckIn ? t("CHECK_IN") : t("CHECK_OUT")}
    </span>
  );
});
