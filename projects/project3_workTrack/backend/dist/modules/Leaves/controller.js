import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { LeaveService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
export class LeaveController {
    leaveService = new LeaveService();
    create = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
            }
            const result = await this.leaveService.create(req.body, req.user.id);
            ApiResponse.created(res, "Leave created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.leaveService.list(query);
            ApiResponse.paginated(res, "Leaves fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.leaveService.getById(getRouteId(req));
            ApiResponse.ok(res, "Leave fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.leaveService.update(getRouteId(req), req.body);
            ApiResponse.ok(res, "Leave updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.leaveService.remove(getRouteId(req));
            ApiResponse.ok(res, "Leave deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
    calendar = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.leaveService.calendar(query);
            ApiResponse.ok(res, "Leave calendar fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    checkDate = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.leaveService.checkDate(query);
            ApiResponse.ok(res, "Leave day checked successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map