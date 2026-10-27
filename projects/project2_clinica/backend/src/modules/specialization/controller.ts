import { Request, Response, NextFunction } from "express";
import { SpecializationService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";

export class SpecializationController {
  private service: SpecializationService;

  constructor() {
    this.service = new SpecializationService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "Specialization created successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query: any = req.query;
      const includeInactive = query.includeInactive === "true";
      const result = await this.service.list(includeInactive);
      return ApiResponse.ok(res, "Specializations fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.service.getById(id);
      return ApiResponse.ok(res, "Specialization fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.service.update(id, req.body);
      return ApiResponse.ok(res, "Specialization updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params: any = req.params;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      await this.service.remove(id);
      return ApiResponse.ok(res, "Specialization deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
