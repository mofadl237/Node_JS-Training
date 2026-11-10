import {
  Building,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Clock3,
  FileUp,
  LayoutDashboard,
  ScrollText,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { TRole } from "@/src/lib/api/types";

export type TNavigationKey =
  | "dashboard"
  | "hrKpi"
  | "employees"
  | "departments"
  | "shifts"
  | "leaves"
  | "attendanceLogs"
  | "attendanceRecords"
  | "attendanceProcess"
  | "uploads"
  | "auditLogs";

export type TNavigationGroupKey =
  | "overview"
  | "people"
  | "attendance"
  | "administration";

export interface INavigationItem {
  key: TNavigationKey;
  href: string;
  icon: LucideIcon;
  roles: readonly TRole[];
}

export interface INavigationGroup {
  key: TNavigationGroupKey;
  items: INavigationItem[];
}

export const navigationIcons: Record<TNavigationKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  hrKpi: ChartColumn,
  employees: UsersRound,
  departments: Building,
  shifts: CalendarClock,
  leaves: CalendarDays,
  attendanceLogs: Clock3,
  attendanceRecords: ClipboardList,
  attendanceProcess: Workflow,
  uploads: FileUp,
  auditLogs: ScrollText,
};

export const ALL_ROLES: readonly TRole[] = ["ADMIN", "HR", "MANAGER"];

export const MANAGEMENT_ROLES: readonly TRole[] = ["ADMIN", "HR"];

export const navigationGroups: readonly INavigationGroup[] = [
  {
    key: "overview",
    items: [
      {
        key: "dashboard",
        href: "/dashboard",
        icon: navigationIcons.dashboard,
        roles: ALL_ROLES,
      },
      {
        key: "hrKpi",
        href: "/hr-kpi",
        icon: navigationIcons.hrKpi,
        roles: MANAGEMENT_ROLES,
      },
    ],
  },
  {
    key: "people",
    items: [
      {
        key: "employees",
        href: "/employees",
        icon: navigationIcons.employees,
        roles: ALL_ROLES,
      },
      {
        key: "departments",
        href: "/departments",
        icon: navigationIcons.departments,
        roles: ALL_ROLES,
      },
      {
        key: "shifts",
        href: "/shifts",
        icon: navigationIcons.shifts,
        roles: MANAGEMENT_ROLES,
      },
      {
        key: "leaves",
        href: "/leaves",
        icon: navigationIcons.leaves,
        roles: ALL_ROLES,
      },
    ],
  },
  {
    key: "attendance",
    items: [
      {
        key: "attendanceLogs",
        href: "/attendance/logs",
        icon: navigationIcons.attendanceLogs,
        roles: ALL_ROLES,
      },
      {
        key: "attendanceRecords",
        href: "/attendance/records",
        icon: navigationIcons.attendanceRecords,
        roles: ALL_ROLES,
      },
      {
        key: "attendanceProcess",
        href: "/attendance/process",
        icon: navigationIcons.attendanceProcess,
        roles: MANAGEMENT_ROLES,
      },
      {
        key: "uploads",
        href: "/uploads",
        icon: navigationIcons.uploads,
        roles: MANAGEMENT_ROLES,
      },
    ],
  },
  {
    key: "administration",
    items: [
      {
        key: "auditLogs",
        href: "/audit-logs",
        icon: navigationIcons.auditLogs,
        roles: MANAGEMENT_ROLES,
      },
    ],
  },
];

export const getVisibleNavigationGroups = (
  role: TRole,
): INavigationGroup[] =>
  navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);

export const findNavigationItem = (
  pathname: string,
): INavigationItem | undefined =>
  navigationGroups
    .flatMap((group) => group.items)
    .find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
