import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CustomerController } from "./controller.js";
import {
  createCustomerSchema,
  listCustomerQuerySchema,
  customerIdParamSchema,
  updateCustomerSchema,
} from "./validation.js";

const router = Router();
const controller = new CustomerController();

router.get(
  "/",
  authenticate, validateQuery(listCustomerQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(customerIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCustomerSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(customerIdParamSchema),
  validateBody(updateCustomerSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(customerIdParamSchema),
  controller.remove,
);

export default router;
