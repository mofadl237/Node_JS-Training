import { ApiResponse } from "../../shared/response.js";
import { EmployeeShiftService, ShiftService } from "./services.js";
const getRouteId = (req) => {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] : id;
};
export class ShiftController {
    shiftService = new ShiftService();
    create = async (req, res, next) => {
        try {
            const result = await this.shiftService.create(req.body);
            ApiResponse.created(res, "Shift created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.shiftService.list(query);
            ApiResponse.paginated(res, "Shifts fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.shiftService.getById(getRouteId(req));
            ApiResponse.ok(res, "Shift fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.shiftService.update(getRouteId(req), req.body);
            ApiResponse.ok(res, "Shift updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.shiftService.remove(getRouteId(req));
            ApiResponse.ok(res, "Shift deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
export class EmployeeShiftController {
    employeeShiftService = new EmployeeShiftService();
    create = async (req, res, next) => {
        try {
            const result = await this.employeeShiftService.create(req.body);
            ApiResponse.created(res, "Employee shift assigned successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.employeeShiftService.list(query);
            ApiResponse.paginated(res, "Employee shift assignments fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const result = await this.employeeShiftService.getById(getRouteId(req));
            ApiResponse.ok(res, "Employee shift assignment fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const result = await this.employeeShiftService.update(getRouteId(req), req.body);
            ApiResponse.ok(res, "Employee shift assignment updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await this.employeeShiftService.remove(getRouteId(req));
            ApiResponse.ok(res, "Employee shift assignment deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map