import { Response } from "express";
import { IPaginationMeta } from "./pagination.js";

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200, meta?: unknown): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== undefined ? { data } : {}),
      ...(meta !== undefined ? { meta } : {}),
    });
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  static ok<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 200);
  }

  static paginated<T>(res: Response, message: string, data: T[], meta: IPaginationMeta): Response {
    return this.success(res, message, data, 200, meta);
  }
}
