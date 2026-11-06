import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { AuditLogController } from "./controller.js";
import {
  auditLogIdParamSchema,
  createAuditLogSchema,
  listAuditLogsQuerySchema,
} from "./validation.js";

const router = Router();
const controller = new AuditLogController();

router.get(
  "/",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateQuery(listAuditLogsQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateParams(auditLogIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate,
  authorize(ERole.ADMIN, ERole.HR),
  validateBody(createAuditLogSchema),
  controller.create,
);
router.delete(
  "/:id",
  authenticate,
  authorize(ERole.ADMIN),
  validateParams(auditLogIdParamSchema),
  controller.remove,
);

export default router;
