import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreShippingService, listShippingAreas } from "./service.js";
import type { IShippingQuoteQuery } from "./validation.js";

export class StoreShippingController {
  private service = new StoreShippingService();

  getAreas = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const areas = await listShippingAreas();
      return ApiResponse.ok(res, "Shipping areas fetched successfully", areas);
    } catch (error) {
      next(error);
    }
  };

  getQuote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const query = req.query as unknown as IShippingQuoteQuery;
      const quote = await this.service.quote(query.governorate, query.city);
      return ApiResponse.ok(res, "Shipping quote fetched successfully", quote);
    } catch (error) {
      next(error);
    }
  };
}
