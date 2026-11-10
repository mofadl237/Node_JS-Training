import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { AuthService } from "./service.js";

export class AuthController {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.login(req.body);
      return ApiResponse.ok(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.me(req.employee!.id);
      return ApiResponse.ok(res, "Employee fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
