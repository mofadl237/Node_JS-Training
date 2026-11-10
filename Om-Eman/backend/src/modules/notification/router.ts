import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { NotificationController } from "./controller.js";
import {
  createNotificationSchema,
  listNotificationQuerySchema,
  notificationIdParamSchema,
  updateNotificationSchema,
} from "./validation.js";

const router = Router();
const controller = new NotificationController();

router.get(
  "/",
  authenticate, validateQuery(listNotificationQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(notificationIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createNotificationSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(notificationIdParamSchema),
  validateBody(updateNotificationSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(notificationIdParamSchema),
  controller.remove,
);

export default router;
