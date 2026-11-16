import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreCategoriesService } from "./service.js";

export class StoreCategoriesController {
  private service = new StoreCategoriesService();

  getTree = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const categories = await this.service.getTree();
      return ApiResponse.ok(res, "Categories fetched successfully", categories);
    } catch (error) {
      next(error);
    }
  };
}
