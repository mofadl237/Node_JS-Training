import { AppointmentService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";
export class AppointmentController {
    service;
    constructor() {
        this.service = new AppointmentService();
    }
    getAvailability = async (req, res, next) => {
        try {
            const result = await this.service.getAvailability(req.query);
            return ApiResponse.ok(res, "Availability fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const result = await this.service.list(req.query, auth);
            return ApiResponse.paginated(res, "Appointments fetched successfully", result.items, result.meta);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.getById(id, auth);
            return ApiResponse.ok(res, "Appointment fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const result = await this.service.create(req.body, auth);
            return ApiResponse.created(res, "Appointment request submitted successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    cancel = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.cancel(id, auth);
            return ApiResponse.ok(res, "Appointment canceled successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    confirm = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await this.service.confirm(id, auth);
            return ApiResponse.ok(res, "Appointment confirmed successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await this.service.remove(id, auth);
            return ApiResponse.ok(res, "Appointment deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map