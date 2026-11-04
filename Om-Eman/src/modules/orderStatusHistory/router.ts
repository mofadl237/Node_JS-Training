import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { OrderStatusHistoryController } from "./controller.js";
import {
  createOrderStatusHistorySchema,
  listOrderStatusHistoryQuerySchema,
  orderStatusHistoryIdParamSchema,
  updateOrderStatusHistorySchema,
} from "./validation.js";

const router = Router();
const controller = new OrderStatusHistoryController();

router.get(
  "/",
  authenticate, validateQuery(listOrderStatusHistoryQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(orderStatusHistoryIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createOrderStatusHistorySchema),
  controller.create,
);

export default router;
