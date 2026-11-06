import type { NextFunction, Request, Response } from "express";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { AuthService } from "./services.js";

export class AuthController {
  private readonly authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      ApiResponse.created(res, "User registered successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      ApiResponse.ok(res, "Login successful", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.refresh(req.body);
      ApiResponse.ok(res, "Token refreshed successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.logout(req.body);
      ApiResponse.ok(res, "Logged out successfully");
    } catch (error: unknown) {
      next(error);
    }
  };

  me = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      const user = await this.authService.me(req.user.id);
      ApiResponse.ok(res, "Profile retrieved successfully", user);
    } catch (error: unknown) {
      next(error);
    }
  };
}
