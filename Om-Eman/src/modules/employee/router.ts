import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { EmployeeController } from "./controller.js";
import {
  createEmployeeSchema,
  listEmployeeQuerySchema,
  employeeIdParamSchema,
  updateEmployeeSchema,
} from "./validation.js";

const router = Router();
const controller = new EmployeeController();

router.get(
  "/",
  authenticate, validateQuery(listEmployeeQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(employeeIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createEmployeeSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(employeeIdParamSchema),
  validateBody(updateEmployeeSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(employeeIdParamSchema),
  controller.remove,
);

export default router;
