import type { NextFunction, Request, Response } from "express";
import { isRedisReady } from "../../config/redis.js";
import { enqueueAttendanceDate } from "../../jobs/attendance/queue.js";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { AttendanceLogService, AttendanceRecordService } from "./services.js";
import type {
  IListAttendanceLogsQuery,
  IListAttendanceRecordsQuery,
  IProcessAttendanceInput,
} from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

const DAY_MS = 86_400_000;

const buildDateRange = (from: string, to: string): string[] => {
  const dates: string[] = [];
  const start = new Date(`${from}T00:00:00.000Z`).getTime();
  const end = new Date(`${to}T00:00:00.000Z`).getTime();

  for (let time = start; time <= end; time += DAY_MS) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }

  return dates;
};

export class AttendanceLogController {
  private readonly attendanceLogService = new AttendanceLogService();

  create = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      const result = await this.attendanceLogService.create(req.body, req.user.id);
      ApiResponse.created(res, "Attendance log created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListAttendanceLogsQuery;
      const result = await this.attendanceLogService.list(query);
      ApiResponse.paginated(
        res,
        "Attendance logs fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.attendanceLogService.getById(getRouteId(req));
      ApiResponse.ok(res, "Attendance log fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.attendanceLogService.remove(getRouteId(req));
      ApiResponse.ok(res, "Attendance log deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}

export class AttendanceAutomationController {
  process = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!isRedisReady()) {
        throw new ServiceUnavailableError(
          "Attendance queue is unavailable",
          "ATTENDANCE_QUEUE_UNAVAILABLE",
        );
      }

      const input = req.body as IProcessAttendanceInput;
      const dates = input.date
        ? [input.date]
        : buildDateRange(input.from as string, input.to as string);
      const jobIds: string[] = [];

      for (const date of dates) {
        try {
          const jobId = await enqueueAttendanceDate({
            date,
            employeeIds: input.employeeIds,
            reason: "manual",
          });
          jobIds.push(jobId);
        } catch {
          throw new ServiceUnavailableError(
            "Failed to enqueue attendance processing job",
            "ATTENDANCE_QUEUE_UNAVAILABLE",
          );
        }
      }

      ApiResponse.success(
        res,
        "Attendance processing jobs enqueued successfully",
        {
          dates,
          jobIds,
          count: jobIds.length,
        },
        202,
      );
    } catch (error: unknown) {
      next(error);
    }
  };
}

export class AttendanceRecordController {
  private readonly attendanceRecordService = new AttendanceRecordService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.attendanceRecordService.create(req.body);
      ApiResponse.created(res, "Attendance record created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListAttendanceRecordsQuery;
      const result = await this.attendanceRecordService.list(query);
      ApiResponse.paginated(
        res,
        "Attendance records fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.attendanceRecordService.getById(getRouteId(req));
      ApiResponse.ok(res, "Attendance record fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.attendanceRecordService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Attendance record updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.attendanceRecordService.remove(getRouteId(req));
      ApiResponse.ok(res, "Attendance record deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}
