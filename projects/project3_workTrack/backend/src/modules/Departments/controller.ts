import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { DepartmentService } from "./services.js";
import type { IListDepartmentsQuery } from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export class DepartmentController {
  private readonly departmentService = new DepartmentService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.departmentService.create(req.body);
      ApiResponse.created(res, "Department created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListDepartmentsQuery;
      const result = await this.departmentService.list(query);
      ApiResponse.paginated(
        res,
        "Departments fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.departmentService.getById(getRouteId(req));
      ApiResponse.ok(res, "Department fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.departmentService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Department updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.departmentService.remove(getRouteId(req));
      ApiResponse.ok(res, "Department deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}
