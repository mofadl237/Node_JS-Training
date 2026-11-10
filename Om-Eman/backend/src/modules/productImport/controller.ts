import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { ProductImportService } from "./service.js";

export class ProductImportController {
  private readonly service: ProductImportService;

  constructor() {
    this.service = new ProductImportService();
  }

  importCsv = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      if (!req.file) {
        throw new ValidationError(
          'CSV file is required in the "file" field',
          "CSV_FILE_REQUIRED",
        );
      }

      const result = await this.service.importCsv(req.file.buffer);
      return ApiResponse.ok(res, "Product import completed", result);
    } catch (error) {
      next(error);
    }
  };
}
