import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { WishlistItemController } from "./controller.js";
import {
  createWishlistItemSchema,
  listWishlistItemQuerySchema,
  wishlistItemIdParamSchema,
  updateWishlistItemSchema,
} from "./validation.js";

const router = Router();
const controller = new WishlistItemController();

router.get(
  "/",
  authenticate, validateQuery(listWishlistItemQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(wishlistItemIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createWishlistItemSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(wishlistItemIdParamSchema),
  validateBody(updateWishlistItemSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(wishlistItemIdParamSchema),
  controller.remove,
);

export default router;
