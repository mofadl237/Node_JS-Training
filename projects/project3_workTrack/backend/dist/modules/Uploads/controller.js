import fs from "node:fs";
import { BadRequestError, UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { UploadService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
/**
 * لو الـ import فشل قبل ما نسجل الملف في قاعدة البيانات، بنمسح الملف اللي
 * Multer حفظه على الديسك عشان مايفضلش ملفات يتيمة (orphan files).
 */
const cleanupUploadedFile = async (file) => {
    if (!file) {
        return;
    }
    try {
        await fs.promises.unlink(file.path);
    }
    catch {
        // مفيش مشكلة لو الملف اتمسح بالفعل أو مش موجود.
    }
};
export class UploadController {
    uploadService = new UploadService();
    importEmployees = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
            }
            if (!req.file) {
                throw new BadRequestError("CSV file is required in the 'file' field", "FILE_REQUIRED");
            }
            const result = await this.uploadService.importEmployees(req.file, req.user.id);
            ApiResponse.created(res, "Employees CSV imported successfully", result);
        }
        catch (error) {
            await cleanupUploadedFile(req.file);
            next(error);
        }
    };
    importAttendance = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
            }
            if (!req.file) {
                throw new BadRequestError("CSV file is required in the 'file' field", "FILE_REQUIRED");
            }
            const result = await this.uploadService.importAttendance(req.file, req.user.id);
            ApiResponse.created(res, "Attendance CSV imported successfully", result);
        }
        catch (error) {
            await cleanupUploadedFile(req.file);
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.uploadService.list(query);
            ApiResponse.paginated(res, "Uploaded files fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.uploadService.getById(getRouteId(req));
            ApiResponse.ok(res, "Uploaded file fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map