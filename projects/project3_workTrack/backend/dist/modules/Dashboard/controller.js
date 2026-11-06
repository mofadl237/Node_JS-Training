import { UnauthorizedError } from "../../shared/errors.js";
import { ApiResponse } from "../../shared/response.js";
import { DashboardService } from "./services.js";
export class DashboardController {
    dashboardService = new DashboardService();
    getActor(req) {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
        }
        return req.user;
    }
    summary = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.dashboardService.getSummary(query, this.getActor(req));
            ApiResponse.ok(res, "Dashboard summary fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
    hrKpi = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.dashboardService.getHrKpiReport(query, this.getActor(req));
            ApiResponse.ok(res, "HR KPI report fetched successfully", result);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=controller.js.map