import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { NotFoundError } from "../../../shared/errors.js";
import { StoreContentService } from "./service.js";

export class StoreContentController {
  private service = new StoreContentService();

  getBanners = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const banners = await this.service.getBanners();
      return ApiResponse.ok(res, "Banners fetched successfully", banners);
    } catch (error) {
      next(error);
    }
  };

  getFaqs = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const faqs = await this.service.getFaqs();
      return ApiResponse.ok(res, "FAQs fetched successfully", faqs);
    } catch (error) {
      next(error);
    }
  };

  getPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { slug } = req.params as { slug: string };
      const page = await this.service.getPageBySlug(slug);
      if (!page) {
        throw new NotFoundError("Page not found", "PAGE_NOT_FOUND");
      }
      return ApiResponse.ok(res, "Page fetched successfully", page);
    } catch (error) {
      next(error);
    }
  };
}
