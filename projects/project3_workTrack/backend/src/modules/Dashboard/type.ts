import type { EAttendanceStatus, ERole, Prisma } from "@prisma/client";

export interface IAttendanceStats {
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
  absenceRate: number;
  lateRate: number;
  averageWorkingMinutes: number;
  totalWorkingMinutes: number;
  totalOvertimeMinutes: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
}

export interface ITrendPoint {
  date: string;
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
}

export interface IWorkforceSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalShifts: number;
}

export interface IRecentAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Prisma.JsonValue | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: ERole;
  } | null;
}

export interface ILeaveSummary {
  activeLeaves: number;
  todayLeaves: number;
}

export interface IDepartmentKpi extends IAttendanceStats {
  departmentId: string;
  departmentName: string;
  employees: number;
}

export interface ITopLateEmployee {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  lateDays: number;
  lateMinutes: number;
  absentDays: number;
}

export interface IDashboardFilters {
  departmentId: string | null;
  employeeId: string | null;
}

export interface IDashboardPeriod {
  from: string;
  to: string;
}

export interface IDashboardSummary {
  generatedAt: string;
  period: IDashboardPeriod;
  filters: IDashboardFilters;
  workforce: IWorkforceSummary;
  attendance: IAttendanceStats;
  today: IAttendanceStats & { date: string };
  leaves: ILeaveSummary;
  trend: ITrendPoint[];
  recentAuditLogs: IRecentAuditLog[];
}

export interface IHrKpiReport {
  generatedAt: string;
  period: IDashboardPeriod;
  filters: IDashboardFilters;
  workforce: IWorkforceSummary;
  totals: IAttendanceStats;
  byDepartment: IDepartmentKpi[];
  topLateEmployees: ITopLateEmployee[];
  trend: ITrendPoint[];
  leaves: {
    activeLeaves: number;
  };
}

export interface IStatusGroup {
  status: EAttendanceStatus;
  count: number;
  workingMinutes: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
}
