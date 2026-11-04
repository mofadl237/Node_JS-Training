import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { WishlistItemService } from "./service.js";
import type { IListWishlistItemQuery } from "./types.js";

export class WishlistItemController {
  private readonly service: WishlistItemService;

  constructor() {
    this.service = new WishlistItemService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "WishlistItem created successfully", result);
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
        req.query as unknown as IListWishlistItemQuery,
      );
      return ApiResponse.paginated(
        res,
        "WishlistItem records fetched successfully",
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
      return ApiResponse.ok(res, "WishlistItem fetched successfully", result);
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
      return ApiResponse.ok(res, "WishlistItem updated successfully", result);
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
      return ApiResponse.ok(res, "WishlistItem deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
