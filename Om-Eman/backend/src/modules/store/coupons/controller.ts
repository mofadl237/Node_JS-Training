import type { NextFunction, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import { StoreCouponsService } from "./service.js";
import type { IValidateCouponInput } from "./validation.js";

export class StoreCouponsController {
  private service = new StoreCouponsService();

  validate = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body as IValidateCouponInput;
      const result = await this.service.validate(
        { couponCode: input.couponCode, items: input.items },
        req.customer?.id ?? "",
      );
      return ApiResponse.ok(res, "Coupon validated successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
