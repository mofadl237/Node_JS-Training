import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import { StorePaymentService } from "./service.js";

export class StorePaymentController {
  private readonly service: StorePaymentService;

  constructor() {
    this.service = new StorePaymentService();
  }

  submitProof = async (
    req: ICustomerAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.submitProof(req.body, req);
      return ApiResponse.created(
        res,
        "Payment proof submitted successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
