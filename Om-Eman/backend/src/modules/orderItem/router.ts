import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { OrderItemController } from "./controller.js";
import {
  createOrderItemSchema,
  listOrderItemQuerySchema,
  orderItemIdParamSchema,
  updateOrderItemSchema,
} from "./validation.js";

const router = Router();
const controller = new OrderItemController();

router.get(
  "/",
  authenticate, validateQuery(listOrderItemQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(orderItemIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createOrderItemSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(orderItemIdParamSchema),
  validateBody(updateOrderItemSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(orderItemIdParamSchema),
  controller.remove,
);

export default router;
