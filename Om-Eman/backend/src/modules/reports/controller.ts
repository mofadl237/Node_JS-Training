import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { ReportsService } from "./service.js";

export class ReportsController {
  private readonly service: ReportsService;

  constructor() {
    this.service = new ReportsService();
  }

  private async respond(
    res: Response,
    next: NextFunction,
    query: () => Promise<unknown>,
    message: string,
  ): Promise<Response | void> {
    try {
      const data = await query();
      return ApiResponse.ok(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  salesDaily = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.salesDaily(), "Sales daily report");

  topProducts = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.topProducts(), "Top products report");

  topProductsMonthly = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.topProductsMonthly(), "Top products monthly report");

  customersSummary = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.customersSummary(), "Customers summary report");

  customerSegments = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.customerSegments(), "Customer segments report");

  paymentsPending = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.paymentsPending(), "Pending payments report");

  promotionsPerformance = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.promotionsPerformance(), "Promotions performance report");

  zeroResultSearches = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.zeroResultSearches(), "Zero-result searches report");

  topSearches = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.topSearches(), "Top searches report");

  codAwaitingSettlement = (req: Request, res: Response, next: NextFunction) =>
    this.respond(res, next, () => this.service.codAwaitingSettlement(), "COD awaiting settlement report");
}
