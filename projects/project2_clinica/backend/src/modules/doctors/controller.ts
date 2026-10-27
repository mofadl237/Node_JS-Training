import { Request, Response, NextFunction } from "express";
import { DoctorsService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";

export class DoctorsController {
  private doctorsService: DoctorsService;

  constructor() {
    this.doctorsService = new DoctorsService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.doctorsService.create(req.body);
      return ApiResponse.created(res, "Doctor created successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = req.query as any;
      const result = await this.doctorsService.list(query);
      return ApiResponse.ok(res, "Doctors fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params = req.params as any;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.doctorsService.getById(id);
      return ApiResponse.ok(res, "Doctor fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params = req.params as any;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const result = await this.doctorsService.update(id, req.body);
      return ApiResponse.ok(res, "Doctor updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const params = req.params as any;
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      await this.doctorsService.remove(id);
      return ApiResponse.ok(res, "Doctor deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
