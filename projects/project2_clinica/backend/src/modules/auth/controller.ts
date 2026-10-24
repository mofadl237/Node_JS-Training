import { Request, Response, NextFunction } from "express";
import { AuthService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.authService.register(req.body);
      return ApiResponse.created(res, "User registered successfully", result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const result = await this.authService.login(req.body);
      return ApiResponse.ok(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  };
}
