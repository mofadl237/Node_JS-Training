import { Router } from "express";
import { SpecializationController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams } from "../../middlewares/validate.middleware.js";
import { createSpecializationSchema, specializationIdParamSchema, updateSpecializationSchema } from "./validation.js";
const router = Router();
const controller = new SpecializationController();
router.get("/", controller.list);
router.get("/:id", validateParams(specializationIdParamSchema), controller.getById);
router.post("/", authenticate, authorize("ADMIN"), validateBody(createSpecializationSchema), controller.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validateParams(specializationIdParamSchema), validateBody(updateSpecializationSchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(specializationIdParamSchema), controller.remove);
export default router;
//# sourceMappingURL=router.js.map