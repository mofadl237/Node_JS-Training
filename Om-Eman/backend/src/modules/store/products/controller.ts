import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { StoreProductService } from "./service.js";
import { listStoreProducts } from "./list.js";
import type { IListStoreProductsQuery } from "./validation.js";

export class StoreProductController {
  private service = new StoreProductService();

  getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { slug } = req.params as { slug: string };
      const product = await this.service.getStorefrontDetail(slug);
      return ApiResponse.ok(res, "Product fetched successfully", product);
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
      const query = req.query as unknown as IListStoreProductsQuery;
      const result = await listStoreProducts(
        {
          categorySlug: query.category,
          subcategorySlug: query.subcategory,
          featured: query.featured,
          inStock: query.inStock,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          sort: query.sort,
        },
        query.page,
        query.limit,
      );
      return ApiResponse.paginated(
        res,
        "Products fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error) {
      next(error);
    }
  };
}
