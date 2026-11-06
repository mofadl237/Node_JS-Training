import type { EEmployeeStatus } from "@prisma/client";

export interface ICreateShiftInput {
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes?: number;
  expectedHours?: number;
  overtimeAfterMinutes?: number;
  isNightShift?: boolean;
}

export interface IUpdateShiftInput {
  name?: string;
  startTime?: string;
  endTime?: string;
  graceMinutes?: number;
  expectedHours?: number;
  overtimeAfterMinutes?: number;
  isNightShift?: boolean;
}

export interface IShiftResponse {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  expectedHours: number;
  overtimeAfterMinutes: number;
  isNightShift: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployeeSummary {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  jobTitle: string | null;
  status: EEmployeeStatus;
}

export interface ICreateEmployeeShiftInput {
  employeeId: string;
  shiftId: string;
  startDate: Date;
  endDate?: Date | null;
  isActive?: boolean;
}

export interface IUpdateEmployeeShiftInput {
  employeeId?: string;
  shiftId?: string;
  startDate?: Date;
  endDate?: Date | null;
  isActive?: boolean;
}

export interface IEmployeeShiftResponse {
  id: string;
  employeeId: string;
  shiftId: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee: IEmployeeSummary;
  shift: IShiftResponse;
}
