import fs from "node:fs";
import type { NextFunction, Request, Response } from "express";
import type { IAuthRequest } from "../../middlewares/auth.middleware.js";
import { BadRequestError, UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { UploadService } from "./services.js";
import type { IListUploadsQuery } from "./validation.js";

const getRouteId = (req: Request): string => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

/**
 * لو الـ import فشل قبل ما نسجل الملف في قاعدة البيانات، بنمسح الملف اللي
 * Multer حفظه على الديسك عشان مايفضلش ملفات يتيمة (orphan files).
 */
const cleanupUploadedFile = async (file?: Express.Multer.File): Promise<void> => {
  if (!file) {
    return;
  }

  try {
    await fs.promises.unlink(file.path);
  } catch {
    // مفيش مشكلة لو الملف اتمسح بالفعل أو مش موجود.
  }
};

export class UploadController {
  private readonly uploadService = new UploadService();

  importEmployees = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      if (!req.file) {
        throw new BadRequestError("CSV file is required in the 'file' field", "FILE_REQUIRED");
      }

      const result = await this.uploadService.importEmployees(req.file, req.user.id);
      ApiResponse.created(res, "Employees CSV imported successfully", result);
    } catch (error: unknown) {
      await cleanupUploadedFile(req.file);
      next(error);
    }
  };

  importAttendance = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
      }

      if (!req.file) {
        throw new BadRequestError("CSV file is required in the 'file' field", "FILE_REQUIRED");
      }

      const result = await this.uploadService.importAttendance(req.file, req.user.id);
      ApiResponse.created(res, "Attendance CSV imported successfully", result);
    } catch (error: unknown) {
      await cleanupUploadedFile(req.file);
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IListUploadsQuery;
      const result = await this.uploadService.list(query);
      ApiResponse.paginated(
        res,
        "Uploaded files fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error: unknown) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.uploadService.getById(getRouteId(req));
      ApiResponse.ok(res, "Uploaded file fetched successfully", result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
