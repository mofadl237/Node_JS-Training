import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { EmployeeService } from "./services.js";
import type { IListEmployeesQuery } from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export class EmployeeController {
  private readonly employeeService = new EmployeeService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeService.create(req.body);
      ApiResponse.created(res, "Employee created successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListEmployeesQuery;
      const result = await this.employeeService.list(query);
      ApiResponse.paginated(res, "Employees fetched successfully", result.items, result.meta);
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeService.getById(getRouteId(req));
      ApiResponse.ok(res, "Employee fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.employeeService.update(getRouteId(req), req.body);
      ApiResponse.ok(res, "Employee updated successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.employeeService.remove(getRouteId(req));
      ApiResponse.ok(res, "Employee deleted successfully");
    } catch (error: unknown) {
      next(error);
    }
  };
}
