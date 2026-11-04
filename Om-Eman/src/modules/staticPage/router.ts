import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { StaticPageController } from "./controller.js";
import {
  createStaticPageSchema,
  listStaticPageQuerySchema,
  staticPageIdParamSchema,
  updateStaticPageSchema,
} from "./validation.js";

const router = Router();
const controller = new StaticPageController();

router.get(
  "/",
  validateQuery(listStaticPageQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(staticPageIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createStaticPageSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(staticPageIdParamSchema),
  validateBody(updateStaticPageSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(staticPageIdParamSchema),
  controller.remove,
);

export default router;
