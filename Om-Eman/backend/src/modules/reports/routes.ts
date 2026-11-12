import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { ReportsController } from "./controller.js";

const router = Router();
const controller = new ReportsController();

router.use(authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN));

router.get("/sales-daily", controller.salesDaily);
router.get("/top-products", controller.topProducts);
router.get("/top-products-monthly", controller.topProductsMonthly);
router.get("/customers-summary", controller.customersSummary);
router.get("/customer-segments", controller.customerSegments);
router.get("/payments-pending", controller.paymentsPending);
router.get("/promotions-performance", controller.promotionsPerformance);
router.get("/zero-result-searches", controller.zeroResultSearches);
router.get("/top-searches", controller.topSearches);
router.get("/cod-awaiting-settlement", controller.codAwaitingSettlement);

export default router;
