import { ApiResponse } from "../../shared/response.js";
import { EmployeeService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
export class EmployeeController {
    employeeService = new EmployeeService();
    create = async (req, res, next) => {
        try {
            const result = await this.employeeService.create(req.body);
            ApiResponse.created(res, "Employee created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.employeeService.list(query);
            ApiResponse.paginated(res, "Employees fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.employeeService.getById(getRouteId(req));
            ApiResponse.ok(res, "Employee fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.employeeService.update(getRouteId(req), req.body);
            ApiResponse.ok(res, "Employee updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.employeeService.remove(getRouteId(req));
            ApiResponse.ok(res, "Employee deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map