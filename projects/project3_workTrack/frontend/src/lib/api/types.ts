export type TRole = "ADMIN" | "HR" | "MANAGER";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: TRole;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  user: IAuthUser;
  token: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  refreshExpiresInDays: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IApiErrorPayload {
  success: false;
  message: string;
  code: string;
  details?: {
    retryAfter?: number;
    errors?: Array<{ field: string; message: string }>;
    [key: string]: unknown;
  };
}

export interface IAuthSession {
  user: IAuthUser;
  token: string;
  refreshToken: string;
}

export type TSortOrder = "asc" | "desc";
export type TDepartmentSortBy = "name" | "createdAt" | "updatedAt";
export type TEmployeeStatus = "ACTIVE" | "INACTIVE";
export type TAttendanceType = "CHECK_IN" | "CHECK_OUT";
export type TAttendanceSource = "MANUAL" | "CSV" | "SYSTEM";
export type TAttendanceLogSortBy = "timestamp" | "createdAt";
export type TEmployeeSortBy =
  | "employeeCode"
  | "firstName"
  | "lastName"
  | "hireDate"
  | "createdAt"
  | "updatedAt";

export interface IDepartment {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDepartmentListParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: TDepartmentSortBy;
  sortOrder?: TSortOrder;
}

export interface ICreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface IUpdateDepartmentPayload {
  name?: string;
  description?: string | null;
}

export interface IEmployeeDepartment {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  jobTitle: string | null;
  status: TEmployeeStatus;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
  department?: IEmployeeDepartment;
}

export interface IEmployeeListParams {
  q?: string;
  departmentId?: string;
  status?: TEmployeeStatus;
  page?: number;
  limit?: number;
  sortBy?: TEmployeeSortBy;
  sortOrder?: TSortOrder;
}

export interface ICreateEmployeePayload {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId: string;
  jobTitle?: string;
  status?: TEmployeeStatus;
  hireDate: string;
}

export interface IUpdateEmployeePayload {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  departmentId?: string;
  jobTitle?: string | null;
  status?: TEmployeeStatus;
  hireDate?: string;
}

export interface IUpdateEmployeeArgs {
  id: string;
  body: IUpdateEmployeePayload;
}

export interface IPaginatedResponse<T> {
  items: T[];
  meta: IPaginationMeta;
}

export interface IAttendanceEmployeeSummary {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  jobTitle: string | null;
  status: TEmployeeStatus;
}

export interface IAttendanceUserSummary {
  id: string;
  name: string;
  email: string;
  role: TRole;
}

export interface IAttendanceLog {
  id: string;
  employeeId: string;
  type: TAttendanceType;
  timestamp: string;
  source: TAttendanceSource;
  createdById: string | null;
  createdAt: string;
  employee: IAttendanceEmployeeSummary;
  createdBy: IAttendanceUserSummary | null;
}

export interface IAttendanceLogListParams {
  employeeId?: string;
  departmentId?: string;
  type?: TAttendanceType;
  source?: TAttendanceSource;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: TAttendanceLogSortBy;
  sortOrder?: TSortOrder;
}

export type TAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE";
export type TAttendanceRecordSortBy = "date" | "createdAt" | "updatedAt";
export type TShiftSortBy = "name" | "startTime" | "createdAt" | "updatedAt";

export interface IShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  expectedHours: number;
  overtimeAfterMinutes: number;
  isNightShift: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IShiftListParams {
  q?: string;
  isNightShift?: "true" | "false";
  page?: number;
  limit?: number;
  sortBy?: TShiftSortBy;
  sortOrder?: TSortOrder;
}

export interface IAttendanceRecord {
  id: string;
  employeeId: string;
  shiftId: string | null;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: TAttendanceStatus;
  workingMinutes: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  notes: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employee: IAttendanceEmployeeSummary;
  shift: IShift | null;
}

export interface IAttendanceRecordListParams {
  employeeId?: string;
  departmentId?: string;
  shiftId?: string;
  status?: TAttendanceStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: TAttendanceRecordSortBy;
  sortOrder?: TSortOrder;
}

export interface ICreateAttendanceRecordPayload {
  employeeId: string;
  shiftId?: string | null;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status?: TAttendanceStatus;
  workingMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  notes?: string | null;
  processedAt?: string | null;
}

export interface IUpdateAttendanceRecordPayload {
  employeeId?: string;
  shiftId?: string | null;
  date?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status?: TAttendanceStatus;
  workingMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  notes?: string | null;
  processedAt?: string | null;
}

export interface IUpdateAttendanceRecordArgs {
  id: string;
  body: IUpdateAttendanceRecordPayload;
}

export interface IAttendanceProcessPayload {
  date?: string;
  from?: string;
  to?: string;
  employeeIds?: string[];
}

export interface IAttendanceProcessResult {
  dates: string[];
  jobIds: string[];
  count: number;
}

export interface IApiMessageResponse {
  success: boolean;
  message: string;
}
