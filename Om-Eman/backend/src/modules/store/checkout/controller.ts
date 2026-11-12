import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../shared/response.js";
import { createGuestOrder } from "../../../services/guest-checkout.service.js";

export class StoreCheckoutController {
  checkout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await createGuestOrder({
        ...req.body,
        // Never trust a client-supplied IP: take it from the request.
        clientIp: req.ip,
        clientUserAgent: req.headers["user-agent"],
      });
      return ApiResponse.created(
        res,
        "Order placed successfully",
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
