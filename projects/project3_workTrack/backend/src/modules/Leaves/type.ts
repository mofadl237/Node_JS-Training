import type { ELeaveRecurrence, ELeaveScope, ELeaveType, ERole } from "@prisma/client";

export interface ICreateLeaveInput {
  name: string;
  description?: string | null;
  type: ELeaveType;
  scope?: ELeaveScope;
  employeeId?: string | null;
  departmentId?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isPaid?: boolean;
  isDeductible?: boolean;
  isActive?: boolean;
  recurrence?: ELeaveRecurrence;
  recurrenceDayOfWeek?: number | null;
  recurrenceDayOfMonth?: number | null;
  recurrenceMonth?: number | null;
  recurrenceDay?: number | null;
}

export interface IUpdateLeaveInput {
  name?: string;
  description?: string | null;
  type?: ELeaveType;
  scope?: ELeaveScope;
  employeeId?: string | null;
  departmentId?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isPaid?: boolean;
  isDeductible?: boolean;
  isActive?: boolean;
  recurrence?: ELeaveRecurrence;
  recurrenceDayOfWeek?: number | null;
  recurrenceDayOfMonth?: number | null;
  recurrenceMonth?: number | null;
  recurrenceDay?: number | null;
}

export interface ILeaveEmployeeSummary {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  departmentId: string;
  jobTitle: string | null;
}

export interface ILeaveDepartmentSummary {
  id: string;
  name: string;
}

export interface ILeaveCreatorSummary {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface ILeaveResponse {
  id: string;
  name: string;
  description: string | null;
  type: ELeaveType;
  scope: ELeaveScope;
  employeeId: string | null;
  departmentId: string | null;
  startDate: Date;
  endDate: Date | null;
  isPaid: boolean;
  isDeductible: boolean;
  isActive: boolean;
  recurrence: ELeaveRecurrence;
  recurrenceDayOfWeek: number | null;
  recurrenceDayOfMonth: number | null;
  recurrenceMonth: number | null;
  recurrenceDay: number | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  employee: ILeaveEmployeeSummary | null;
  department: ILeaveDepartmentSummary | null;
  createdBy: ILeaveCreatorSummary | null;
}

export interface ILeaveOccurrenceLeave {
  id: string;
  name: string;
  type: ELeaveType;
  scope: ELeaveScope;
  isPaid: boolean;
  isDeductible: boolean;
}

export interface ILeaveOccurrence {
  date: string;
  leave: ILeaveOccurrenceLeave;
}

export interface ILeaveCalendarResponse {
  from: string;
  to: string;
  employeeId: string | null;
  departmentId: string | null;
  totalDays: number;
  days: ILeaveOccurrence[];
}

export interface ILeaveCheckResponse {
  date: string;
  isLeaveDay: boolean;
  isPaid: boolean;
  isDeductible: boolean;
  leaves: ILeaveOccurrenceLeave[];
}
