import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import { StoreCartService } from "./service.js";

export class StoreCartController {
  private readonly service: StoreCartService;

  constructor() {
    this.service = new StoreCartService();
  }

  getOrCreate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const guestToken = req.query.guestToken as string | undefined;
      const result = await this.service.getOrCreate(guestToken);
      return ApiResponse.ok(res, "Cart fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  get = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.get(req.params.guestToken as string);
      return ApiResponse.ok(res, "Cart fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  addItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.addItem(
        req.params.guestToken as string,
        req.body.productPackageId,
        req.body.quantity,
      );
      return ApiResponse.ok(res, "Item added to cart", result);
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.updateItem(
        req.params.guestToken as string,
        req.params.itemId as string,
        req.body.quantity,
      );
      return ApiResponse.ok(res, "Cart updated", result);
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.removeItem(
        req.params.guestToken as string,
        req.params.itemId as string,
      );
      return ApiResponse.ok(res, "Item removed from cart", result);
    } catch (error) {
      next(error);
    }
  };

  merge = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.merge(
        req.customer!.id,
        req.body.guestToken,
      );
      return ApiResponse.ok(res, "Guest cart merged successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
