import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { BannerService } from "./service.js";
import type { IListBannerQuery } from "./types.js";

export class BannerController {
  private readonly service: BannerService;

  constructor() {
    this.service = new BannerService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "Banner created successfully", result);
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
        req.query as unknown as IListBannerQuery,
      );
      return ApiResponse.paginated(
        res,
        "Banner records fetched successfully",
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
      return ApiResponse.ok(res, "Banner fetched successfully", result);
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
      return ApiResponse.ok(res, "Banner updated successfully", result);
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
      return ApiResponse.ok(res, "Banner deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
