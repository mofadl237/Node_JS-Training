import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { MarketingEventController } from "./controller.js";
import {
  createMarketingEventSchema,
  listMarketingEventQuerySchema,
  marketingEventIdParamSchema,
  updateMarketingEventSchema,
} from "./validation.js";

const router = Router();
const controller = new MarketingEventController();

router.get(
  "/",
  authenticate, validateQuery(listMarketingEventQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(marketingEventIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createMarketingEventSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(marketingEventIdParamSchema),
  validateBody(updateMarketingEventSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(marketingEventIdParamSchema),
  controller.remove,
);

export default router;
