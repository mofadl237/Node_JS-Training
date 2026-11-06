import type {
  EAttendanceSource,
  EAttendanceStatus,
  EAttendanceType,
  ERole,
} from "@prisma/client";
import type { IEmployeeSummary, IShiftResponse } from "../Shifts/type.js";

export interface IAttendanceUserSummary {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface ICreateAttendanceLogInput {
  employeeId: string;
  type: EAttendanceType;
  timestamp: Date;
  source?: EAttendanceSource;
}

export interface IAttendanceLogResponse {
  id: string;
  employeeId: string;
  type: EAttendanceType;
  timestamp: Date;
  source: EAttendanceSource;
  createdById: string | null;
  createdAt: Date;
  employee: IEmployeeSummary;
  createdBy: IAttendanceUserSummary | null;
}

export interface ICreateAttendanceRecordInput {
  employeeId: string;
  shiftId?: string | null;
  date: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status?: EAttendanceStatus;
  workingMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  notes?: string | null;
  processedAt?: Date | null;
}

export interface IUpdateAttendanceRecordInput {
  employeeId?: string;
  shiftId?: string | null;
  date?: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status?: EAttendanceStatus;
  workingMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  notes?: string | null;
  processedAt?: Date | null;
}

export interface IAttendanceRecordResponse {
  id: string;
  employeeId: string;
  shiftId: string | null;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: EAttendanceStatus;
  workingMinutes: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  notes: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  employee: IEmployeeSummary;
  shift: IShiftResponse | null;
}
