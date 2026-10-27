import { Response, NextFunction } from "express";
import { AppointmentService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";
import { IAuthRequest } from "../../middlewares/auth.middleware.js";

export class AppointmentController {
  private service: AppointmentService;

  constructor() {
    this.service = new AppointmentService();
  }

  getAvailability = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.service.getAvailability(req.query as any);
      return ApiResponse.ok(res, "Availability fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const result = await this.service.list(req.query as any, auth);
      return ApiResponse.paginated(res, "Appointments fetched successfully", result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getById(id, auth);
      return ApiResponse.ok(res, "Appointment fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const result = await this.service.create(req.body, auth);
      return ApiResponse.created(res, "Appointment booked successfully", result);
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.cancel(id, auth);
      return ApiResponse.ok(res, "Appointment canceled successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
