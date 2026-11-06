import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateQuery } from "../../middlewares/validate.middleware.js";
import { DashboardController } from "./controller.js";
import { dashboardQuerySchema } from "./validation.js";
const router = Router();
const controller = new DashboardController();
router.get("/summary", authenticate, authorize(ERole.ADMIN, ERole.HR, ERole.MANAGER), validateQuery(dashboardQuerySchema), controller.summary);
router.get("/hr-kpi", authenticate, authorize(ERole.ADMIN, ERole.HR), validateQuery(dashboardQuerySchema), controller.hrKpi);
export default router;
//# sourceMappingURL=routes.js.map