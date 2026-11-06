import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { LeaveController } from "./controller.js";
import {
  createLeaveSchema,
  leaveCalendarQuerySchema,
  leaveCheckQuerySchema,
  leaveIdParamSchema,
  listLeavesQuerySchema,
  updateLeaveSchema,
} from "./validation.js";

const router = Router();
const controller = new LeaveController();

router.get(
  "/calendar",
  authenticate,
  validateQuery(leaveCalendarQuerySchema),
  controller.calendar,
);
router.get(
  "/check",
  authenticate,
  validateQuery(leaveCheckQuerySchema),
  controller.checkDate,
);
router.get(
  "/",
  authenticate,
  validateQuery(listLeavesQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate,
  validateParams(leaveIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateBody(createLeaveSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(leaveIdParamSchema),
  validateBody(updateLeaveSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(leaveIdParamSchema),
  controller.remove,
);

export default router;
