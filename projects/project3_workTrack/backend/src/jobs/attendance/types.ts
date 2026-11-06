export type AttendanceJobReason = "scheduled" | "manual";

export interface IAttendanceProcessJobData {
  date: string;
  employeeIds?: string[];
  reason?: AttendanceJobReason;
}

export interface IAttendanceProcessError {
  employeeId: string;
  message: string;
}

export interface IAttendanceProcessResult {
  date: string;
  employeesProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  absentRecords: number;
  leaveRecords: number;
  errors: IAttendanceProcessError[];
}
