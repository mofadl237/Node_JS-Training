import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { SystemSettingController } from "./controller.js";
import {
  createSystemSettingSchema,
  listSystemSettingQuerySchema,
  systemSettingIdParamSchema,
  updateSystemSettingSchema,
} from "./validation.js";

const router = Router();
const controller = new SystemSettingController();

router.get(
  "/",
  authenticate, validateQuery(listSystemSettingQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(systemSettingIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createSystemSettingSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(systemSettingIdParamSchema),
  validateBody(updateSystemSettingSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(systemSettingIdParamSchema),
  controller.remove,
);

export default router;
