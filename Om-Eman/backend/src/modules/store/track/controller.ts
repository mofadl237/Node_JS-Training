import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreTrackService } from "./service.js";

export class StoreTrackController {
  private readonly service: StoreTrackService;

  constructor() {
    this.service = new StoreTrackService();
  }

  track = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.track(req.params.trackingToken as string);
      return ApiResponse.ok(res, "Order fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
