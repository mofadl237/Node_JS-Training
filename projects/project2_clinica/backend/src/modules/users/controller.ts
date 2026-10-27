import { Response, NextFunction } from "express";
import { UserService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";
import { IAuthRequest } from "../../middlewares/auth.middleware.js";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getMe = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.service.getMe(req.user!.userId);
      return ApiResponse.ok(res, "User fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const result = await this.service.getAll(req.query as any, auth);
      return ApiResponse.paginated(res, "Users fetched successfully", result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.getById(id, auth);
      return ApiResponse.ok(res, "User fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const auth = { userId: req.user!.userId, role: req.user!.role };
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await this.service.update(id, req.body, auth);
      return ApiResponse.ok(res, "User updated successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
