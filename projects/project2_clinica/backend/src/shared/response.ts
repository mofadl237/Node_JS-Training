import { Response } from "express";

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== undefined ? { data } : {}),
    });
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  static ok<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 200);
  }
}
