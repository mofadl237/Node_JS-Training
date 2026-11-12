import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import { StoreSearchService } from "./service.js";

export class StoreSearchController {
  private readonly service: StoreSearchService;

  constructor() {
    this.service = new StoreSearchService();
  }

  search = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.search(
        req.query.q as string,
        Number(req.query.limit ?? 20),
        req,
      );
      return ApiResponse.ok(res, "Search completed", result);
    } catch (error) {
      next(error);
    }
  };
}
