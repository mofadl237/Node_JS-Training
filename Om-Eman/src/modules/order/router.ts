import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { OrderController } from "./controller.js";
import {
  createOrderSchema,
  listOrderQuerySchema,
  orderIdParamSchema,
  updateOrderSchema,
} from "./validation.js";

const router = Router();
const controller = new OrderController();

router.get(
  "/",
  authenticate, validateQuery(listOrderQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(orderIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createOrderSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(orderIdParamSchema),
  validateBody(updateOrderSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(orderIdParamSchema),
  controller.remove,
);

export default router;
