import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { EmployeeShiftController, ShiftController } from "./controller.js";
import {
  createEmployeeShiftSchema,
  createShiftSchema,
  employeeShiftIdParamSchema,
  listEmployeeShiftsQuerySchema,
  listShiftsQuerySchema,
  shiftIdParamSchema,
  updateEmployeeShiftSchema,
  updateShiftSchema,
} from "./validation.js";

const router = Router();
const shiftController = new ShiftController();
const employeeShiftController = new EmployeeShiftController();

router.get(
  "/assignments",
  authenticate,
  validateQuery(listEmployeeShiftsQuerySchema),
  employeeShiftController.list,
);
router.get(
  "/assignments/:id",
  authenticate,
  validateParams(employeeShiftIdParamSchema),
  employeeShiftController.getById,
);
router.get(
  "/",
  authenticate,
  validateQuery(listShiftsQuerySchema),
  shiftController.list,
);
router.get(
  "/:id",
  authenticate,
  validateParams(shiftIdParamSchema),
  shiftController.getById,
);

router.post(
  "/assignments",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateBody(createEmployeeShiftSchema),
  employeeShiftController.create,
);
router.post(
  "/",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateBody(createShiftSchema),
  shiftController.create,
);

router.patch(
  "/assignments/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(employeeShiftIdParamSchema),
  validateBody(updateEmployeeShiftSchema),
  employeeShiftController.update,
);
router.patch(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(shiftIdParamSchema),
  validateBody(updateShiftSchema),
  shiftController.update,
);

router.delete(
  "/assignments/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(employeeShiftIdParamSchema),
  employeeShiftController.remove,
);
router.delete(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(shiftIdParamSchema),
  shiftController.remove,
);

export default router;
