import { ApiResponse } from "../../shared/response.js";
import { DepartmentService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
export class DepartmentController {
    departmentService = new DepartmentService();
    create = async (req, res, next) => {
        try {
            const result = await this.departmentService.create(req.body);
            ApiResponse.created(res, "Department created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.departmentService.list(query);
            ApiResponse.paginated(res, "Departments fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.departmentService.getById(getRouteId(req));
            ApiResponse.ok(res, "Department fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.departmentService.update(getRouteId(req), req.body);
            ApiResponse.ok(res, "Department updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.departmentService.remove(getRouteId(req));
            ApiResponse.ok(res, "Department deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map