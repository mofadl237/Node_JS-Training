import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { AuditLogController } from "./controller.js";
import {
  createAuditLogSchema,
  listAuditLogQuerySchema,
  auditLogIdParamSchema,
  updateAuditLogSchema,
} from "./validation.js";

const router = Router();
const controller = new AuditLogController();

router.get(
  "/",
  authenticate, validateQuery(listAuditLogQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(auditLogIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createAuditLogSchema),
  controller.create,
);

export default router;
