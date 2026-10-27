import { DoctorServiceService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";
export class DoctorServiceController {
    service;
    constructor() {
        this.service = new DoctorServiceService();
    }
    create = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const result = await this.service.create(req.body, auth);
            return ApiResponse.created(res, "Doctor service created successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const auth = req.user ? { userId: req.user.userId, role: req.user.role } : undefined;
            const query = req.query;
            const result = await this.service.list(query, auth);
            return ApiResponse.ok(res, "Doctor services fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const params = req.params;
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const result = await this.service.getById(id);
            return ApiResponse.ok(res, "Doctor service fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const params = req.params;
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const result = await this.service.update(id, req.body, auth);
            return ApiResponse.ok(res, "Doctor service updated successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            const auth = { userId: req.user.userId, role: req.user.role };
            const params = req.params;
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            await this.service.remove(id, auth);
            return ApiResponse.ok(res, "Doctor service deleted successfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map