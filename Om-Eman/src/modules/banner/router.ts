import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { BannerController } from "./controller.js";
import {
  createBannerSchema,
  listBannerQuerySchema,
  bannerIdParamSchema,
  updateBannerSchema,
} from "./validation.js";

const router = Router();
const controller = new BannerController();

router.get(
  "/",
  validateQuery(listBannerQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(bannerIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createBannerSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(bannerIdParamSchema),
  validateBody(updateBannerSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(bannerIdParamSchema),
  controller.remove,
);

export default router;
