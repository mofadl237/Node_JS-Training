import { Request, Response, NextFunction } from "express";
import { ClinicServiceService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";

export class ClinicServiceController {
  private service: ClinicServiceService;

  constructor() {
    this.service = new ClinicServiceService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "Clinic service created successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query: any = req.query;
      const includeInactive = query.includeInactive === "true";
      const result = await this.service.list(includeInactive);
      return ApiResponse.ok(res, "Clinic services fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.service.getById(id);
      return ApiResponse.ok(res, "Clinic service fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.service.update(id, req.body);
      return ApiResponse.ok(res, "Clinic service updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      await this.service.remove(id);
      return ApiResponse.ok(res, "Clinic service deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
