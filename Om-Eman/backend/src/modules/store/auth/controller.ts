import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { env } from "../../../config/env.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import { StoreAuthService } from "./service.js";

export class StoreAuthController {
  private readonly service: StoreAuthService;

  constructor() {
    this.service = new StoreAuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.register(req.body);
      return ApiResponse.created(
        res,
        "Registration successful. Check your email to verify your account.",
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.service.verifyEmail(req.body.token);
      return ApiResponse.ok(res, "Email verified successfully");
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.resendVerification(
        req.body.email,
        req.body.locale,
      );
      return ApiResponse.ok(
        res,
        "If the account is waiting for verification, a new link was sent.",
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.login(req.body);
      return ApiResponse.ok(res, "Login successful", {
        ...result,
        expiresInDays: env.SESSION_TTL_DAYS,
      });
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.googleLogin(req.body.credential);
      return ApiResponse.ok(res, "Login successful", {
        ...result,
        expiresInDays: env.SESSION_TTL_DAYS,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.service.forgotPassword(req.body.email, req.body.locale);
      return ApiResponse.ok(
        res,
        "If the email exists, a reset link was sent.",
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.service.resetPassword(req.body.token, req.body.password);
      return ApiResponse.ok(res, "Password reset successfully");
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.service.logout(req.customer!.sessionId);
      return ApiResponse.ok(res, "Logout successful");
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const customer = await this.service.me(req.customer!.id);
      return ApiResponse.ok(res, "Customer fetched successfully", customer);
    } catch (error) {
      next(error);
    }
  };
}
