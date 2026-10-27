import { AuthService } from "./service.js";
import { ApiResponse } from "../../shared/response.js";
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            return ApiResponse.created(res, "User registered successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            return ApiResponse.ok(res, "Login successful", result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map