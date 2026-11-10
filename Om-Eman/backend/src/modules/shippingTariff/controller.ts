import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { ShippingTariffService } from "./service.js";
import type { IListShippingTariffQuery } from "./types.js";

export class ShippingTariffController {
  private readonly service: ShippingTariffService;

  constructor() {
    this.service = new ShippingTariffService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "ShippingTariff created successfully", result);
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
        req.query as unknown as IListShippingTariffQuery,
      );
      return ApiResponse.paginated(
        res,
        "ShippingTariff records fetched successfully",
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
      return ApiResponse.ok(res, "ShippingTariff fetched successfully", result);
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
      return ApiResponse.ok(res, "ShippingTariff updated successfully", result);
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
      return ApiResponse.ok(res, "ShippingTariff deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
