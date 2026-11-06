import type { NextFunction, Response } from "express";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { DashboardService } from "./services.js";
import type { IDashboardQuery } from "./validation.js";

export class DashboardController {
  private readonly dashboardService = new DashboardService();

  private getActor(req: IAuthRequest) {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
    }

    return req.user;
  }

  summary = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query as unknown as IDashboardQuery;
      const result = await this.dashboardService.getSummary(query, this.getActor(req));
      ApiResponse.ok(res, "Dashboard summary fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  hrKpi = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query as unknown as IDashboardQuery;
      const result = await this.dashboardService.getHrKpiReport(query, this.getActor(req));
      ApiResponse.ok(res, "HR KPI report fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
