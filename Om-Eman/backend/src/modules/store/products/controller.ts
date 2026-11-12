import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreProductService } from "./service.js";

export class StoreProductController {
  private readonly service: StoreProductService;

  constructor() {
    this.service = new StoreProductService();
  }

  getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.getBySlug(req.params.slug as string);
      return ApiResponse.ok(res, "Product fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
