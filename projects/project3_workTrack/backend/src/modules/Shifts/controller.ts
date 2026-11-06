import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { EmployeeShiftService, ShiftService } from "./services.js";
import type {
  IListEmployeeShiftsQuery,
  IListShiftsQuery,
} from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export class ShiftController {
  private readonly shiftService = new ShiftService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.shiftService.create(req.body);
      ApiResponse.created(res, "Shift created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListShiftsQuery;
      const result = await this.shiftService.list(query);
      ApiResponse.paginated(res, "Shifts fetched successfully", result.items, result.meta);
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.shiftService.getById(getRouteId(req));
      ApiResponse.ok(res, "Shift fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.shiftService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Shift updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.shiftService.remove(getRouteId(req));
      ApiResponse.ok(res, "Shift deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}

export class EmployeeShiftController {
  private readonly employeeShiftService = new EmployeeShiftService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeShiftService.create(req.body);
      ApiResponse.created(res, "Employee shift assigned successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListEmployeeShiftsQuery;
      const result = await this.employeeShiftService.list(query);
      ApiResponse.paginated(
        res,
        "Employee shift assignments fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeShiftService.getById(getRouteId(req));
      ApiResponse.ok(res, "Employee shift assignment fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeShiftService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Employee shift assignment updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.employeeShiftService.remove(getRouteId(req));
      ApiResponse.ok(res, "Employee shift assignment deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}
