import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { CategoryService } from "./service.js";
import type { IListCategoryQuery } from "./types.js";

export class CategoryController {
  private readonly service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "Category created successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.list(
        req.query as unknown as IListCategoryQuery,
      );
      return ApiResponse.paginated(
        res,
        "Category records fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      const result = await this.service.getById(id);
      return ApiResponse.ok(res, "Category fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      const result = await this.service.update(id, req.body);
      return ApiResponse.ok(res, "Category updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      await this.service.remove(id);
      return ApiResponse.ok(res, "Category deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
