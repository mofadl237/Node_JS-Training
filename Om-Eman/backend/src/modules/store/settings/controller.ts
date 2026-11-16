import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreSettingsService } from "./service.js";

export class StoreSettingsController {
  private service = new StoreSettingsService();

  get = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const settings = await this.service.getPublic();
      return ApiResponse.ok(res, "Settings fetched successfully", settings);
    } catch (error) {
      next(error);
    }
  };
}
