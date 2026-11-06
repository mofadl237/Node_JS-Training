import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { AuditLogService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
export class AuditLogController {
    auditLogService = new AuditLogService();
    create = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
            }
            const result = await this.auditLogService.create(req.body, req.user.id);
            ApiResponse.created(res, "Audit log created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.auditLogService.list(query);
            ApiResponse.paginated(res, "Audit logs fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.auditLogService.getById(getRouteId(req));
            ApiResponse.ok(res, "Audit log fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.auditLogService.remove(getRouteId(req));
            ApiResponse.ok(res, "Audit log deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map