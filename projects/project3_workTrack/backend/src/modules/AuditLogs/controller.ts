import type { NextFunction, Request, Response } from "express";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { AuditLogService } from "./services.js";
import type { IListAuditLogsQuery } from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export class AuditLogController {
  private readonly auditLogService = new AuditLogService();

  create = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      const result = await this.auditLogService.create(req.body, req.user.id);
      ApiResponse.created(res, "Audit log created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListAuditLogsQuery;
      const result = await this.auditLogService.list(query);
      ApiResponse.paginated(res, "Audit logs fetched successfully", result.items, result.meta);
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.auditLogService.getById(getRouteId(req));
      ApiResponse.ok(res, "Audit log fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.auditLogService.remove(getRouteId(req));
      ApiResponse.ok(res, "Audit log deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}
