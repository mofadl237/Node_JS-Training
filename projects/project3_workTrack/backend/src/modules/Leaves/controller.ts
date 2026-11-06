import type { NextFunction, Request, Response } from "express";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { LeaveService } from "./services.js";
import type {
  ILeaveCalendarQuery,
  ILeaveCheckQuery,
  IListLeavesQuery,
} from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export class LeaveController {
  private readonly leaveService = new LeaveService();

  create = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      const result = await this.leaveService.create(req.body, req.user.id);
      ApiResponse.created(res, "Leave created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListLeavesQuery;
      const result = await this.leaveService.list(query);
      ApiResponse.paginated(res, "Leaves fetched successfully", result.items, result.meta);
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.leaveService.getById(getRouteId(req));
      ApiResponse.ok(res, "Leave fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.leaveService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Leave updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.leaveService.remove(getRouteId(req));
      ApiResponse.ok(res, "Leave deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };

  calendar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query as unknown as ILeaveCalendarQuery;
      const result = await this.leaveService.calendar(query);
      ApiResponse.ok(res, "Leave calendar fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  checkDate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query as unknown as ILeaveCheckQuery;
      const result = await this.leaveService.checkDate(query);
      ApiResponse.ok(res, "Leave day checked successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
