import { Router } from "express";
import { SpecializationController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import {
  createSpecializationSchema,
  listSpecializationsQuerySchema,
  specializationIdParamSchema,
  updateSpecializationSchema,
} from "./validation.js";

const router = Router();
const controller = new SpecializationController();

router.get("/", validateQuery(listSpecializationsQuerySchema), controller.list);
router.get("/:id", validateParams(specializationIdParamSchema), controller.getById);

router.post("/", authenticate, authorize("ADMIN"), validateBody(createSpecializationSchema), controller.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validateParams(specializationIdParamSchema), validateBody(updateSpecializationSchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(specializationIdParamSchema), controller.remove);

export default router;
