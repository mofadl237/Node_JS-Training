import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreSitemapService } from "./service.js";

export class StoreSitemapController {
  private service = new StoreSitemapService();

  get = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const sitemap = await this.service.get();
      return ApiResponse.ok(res, "Sitemap fetched successfully", sitemap);
    } catch (error) {
      next(error);
    }
  };
}
