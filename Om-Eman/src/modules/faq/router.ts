import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { FaqController } from "./controller.js";
import {
  createFaqSchema,
  listFaqQuerySchema,
  faqIdParamSchema,
  updateFaqSchema,
} from "./validation.js";

const router = Router();
const controller = new FaqController();

router.get(
  "/",
  validateQuery(listFaqQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(faqIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createFaqSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(faqIdParamSchema),
  validateBody(updateFaqSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(faqIdParamSchema),
  controller.remove,
);

export default router;
