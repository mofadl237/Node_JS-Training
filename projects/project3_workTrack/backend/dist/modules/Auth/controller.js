import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { AuthService } from "./services.js";
export class AuthController {
    authService = new AuthService();
    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            ApiResponse.created(res, "User registered successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            ApiResponse.ok(res, "Login successful", result);
        }
        catch (error) {
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const result = await this.authService.refresh(req.body);
            ApiResponse.ok(res, "Token refreshed successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            await this.authService.logout(req.body);
            ApiResponse.ok(res, "Logged out successfully");
        }
        catch (error) {
            next(error);
        }
    };
    me = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
            }
            const user = await this.authService.me(req.user.id);
            ApiResponse.ok(res, "Profile retrieved successfully", user);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map