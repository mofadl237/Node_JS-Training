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

export interface ICreateShiftPayload {
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes?: number;
  expectedHours?: number;
  overtimeAfterMinutes?: number;
  isNightShift?: boolean;
}

export interface IUpdateShiftPayload {
  name?: string;
  startTime?: string;
  endTime?: string;
  graceMinutes?: number;
  expectedHours?: number;
  overtimeAfterMinutes?: number;
  isNightShift?: boolean;
}

export interface IUpdateShiftArgs {
  id: string;
  body: IUpdateShiftPayload;
}

export type TEmployeeShiftSortBy =
  | "startDate"
  | "endDate"
  | "createdAt"
  | "updatedAt";

export interface IEmployeeShift {
  id: string;
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employee: IAttendanceEmployeeSummary;
  shift: IShift;
}

export interface IEmployeeShiftListParams {
  employeeId?: string;
  shiftId?: string;
  isActive?: "true" | "false";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: TEmployeeShiftSortBy;
  sortOrder?: TSortOrder;
}

export interface ICreateEmployeeShiftPayload {
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate?: string | null;
  isActive?: boolean;
}

export interface IUpdateEmployeeShiftPayload {
  employeeId?: string;
  shiftId?: string;
  startDate?: string;
  endDate?: string | null;
  isActive?: boolean;
}

export interface IUpdateEmployeeShiftArgs {
  id: string;
  body: IUpdateEmployeeShiftPayload;
}

export type TLeaveType =
  | "ANNUAL"
  | "SICK"
  | "UNPAID"
  | "ABSENCE"
  | "OFFICIAL_HOLIDAY"
  | "WEEKEND"
  | "CUSTOM";

export type TLeaveScope = "ALL" | "DEPARTMENT" | "EMPLOYEE";

export type TLeaveRecurrence = "NONE" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type TLeaveSortBy =
  | "name"
  | "startDate"
  | "endDate"
  | "createdAt"
  | "updatedAt";

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
  role: TRole;
}

export interface ILeave {
  id: string;
  name: string;
  description: string | null;
  type: TLeaveType;
  scope: TLeaveScope;
  employeeId: string | null;
  departmentId: string | null;
  startDate: string;
  endDate: string | null;
  isPaid: boolean;
  isDeductible: boolean;
  isActive: boolean;
  recurrence: TLeaveRecurrence;
  recurrenceDayOfWeek: number | null;
  recurrenceDayOfMonth: number | null;
  recurrenceMonth: number | null;
  recurrenceDay: number | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  employee: ILeaveEmployeeSummary | null;
  department: ILeaveDepartmentSummary | null;
  createdBy: ILeaveCreatorSummary | null;
}

export interface ILeaveListParams {
  q?: string;
  type?: TLeaveType;
  scope?: TLeaveScope;
  employeeId?: string;
  departmentId?: string;
  recurrence?: TLeaveRecurrence;
  isActive?: "true" | "false";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: TLeaveSortBy;
  sortOrder?: TSortOrder;
}

export interface ICreateLeavePayload {
  name: string;
  description?: string | null;
  type: TLeaveType;
  scope: TLeaveScope;
  employeeId?: string | null;
  departmentId?: string | null;
  startDate: string;
  endDate?: string | null;
  isPaid?: boolean;
  isDeductible?: boolean;
  isActive?: boolean;
  recurrence: TLeaveRecurrence;
  recurrenceDayOfWeek?: number | null;
  recurrenceDayOfMonth?: number | null;
  recurrenceMonth?: number | null;
  recurrenceDay?: number | null;
}

export interface IUpdateLeavePayload {
  name?: string;
  description?: string | null;
  type?: TLeaveType;
  scope?: TLeaveScope;
  employeeId?: string | null;
  departmentId?: string | null;
  startDate?: string;
  endDate?: string | null;
  isPaid?: boolean;
  isDeductible?: boolean;
  isActive?: boolean;
  recurrence?: TLeaveRecurrence;
  recurrenceDayOfWeek?: number | null;
  recurrenceDayOfMonth?: number | null;
  recurrenceMonth?: number | null;
  recurrenceDay?: number | null;
}

export interface IUpdateLeaveArgs {
  id: string;
  body: IUpdateLeavePayload;
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

export interface IDashboardQueryParams {
  from?: string;
  to?: string;
  departmentId?: string;
  employeeId?: string;
}

export interface IDashboardPeriod {
  from: string;
  to: string;
}

export interface IDashboardFilters {
  departmentId: string | null;
  employeeId: string | null;
}

export interface IDashboardAttendanceStats {
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

export interface IDashboardTodayStats extends IDashboardAttendanceStats {
  date: string;
}

export interface IDashboardTrendPoint {
  date: string;
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
}

export interface IDashboardWorkforce {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalShifts: number;
}

export interface IDashboardLeaves {
  activeLeaves: number;
  todayLeaves: number;
}

export interface IDashboardAuditUser {
  id: string;
  name: string;
  email: string;
  role: TRole;
}

export interface IDashboardAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: unknown;
  createdAt: string;
  user: IDashboardAuditUser | null;
}

export type TAuditLogSortBy = "createdAt" | "action" | "entity";

export interface IAuditLog extends IDashboardAuditLog {
  userId: string | null;
}

export interface IAuditLogListParams {
  q?: string;
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: TAuditLogSortBy;
  sortOrder?: TSortOrder;
}

export interface IDashboardSummary {
  generatedAt: string;
  period: IDashboardPeriod;
  filters: IDashboardFilters;
  workforce: IDashboardWorkforce;
  attendance: IDashboardAttendanceStats;
  today: IDashboardTodayStats;
  leaves: IDashboardLeaves;
  trend: IDashboardTrendPoint[];
  recentAuditLogs: IDashboardAuditLog[];
}

export interface IDepartmentKpi extends IDashboardAttendanceStats {
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

export interface IHrKpiReport {
  generatedAt: string;
  period: IDashboardPeriod;
  filters: IDashboardFilters;
  workforce: IDashboardWorkforce;
  totals: IDashboardAttendanceStats;
  byDepartment: IDepartmentKpi[];
  topLateEmployees: ITopLateEmployee[];
  trend: IDashboardTrendPoint[];
  leaves: {
    activeLeaves: number;
  };
}

export type TUploadType = "EMPLOYEE_IMPORT" | "ATTENDANCE_IMPORT";

export interface IUploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  type: TUploadType;
  uploadedById: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    role: TRole;
  };
}

export interface IImportRowError {
  row: number;
  employeeCode?: string;
  message: string;
}

export interface IImportResult {
  upload: IUploadedFile;
  errors: IImportRowError[];
}

export interface IApiMessageResponse {
  success: boolean;
  message: string;
}
