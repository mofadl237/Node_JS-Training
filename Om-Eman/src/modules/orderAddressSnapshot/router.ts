import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { OrderAddressSnapshotController } from "./controller.js";
import {
  createOrderAddressSnapshotSchema,
  listOrderAddressSnapshotQuerySchema,
  orderAddressSnapshotIdParamSchema,
  updateOrderAddressSnapshotSchema,
} from "./validation.js";

const router = Router();
const controller = new OrderAddressSnapshotController();

router.get(
  "/",
  authenticate, validateQuery(listOrderAddressSnapshotQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(orderAddressSnapshotIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createOrderAddressSnapshotSchema),
  controller.create,
);

export default router;
