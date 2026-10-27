import { Router } from "express";
import { UserController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import { listUsersQuerySchema, updateUserSchema, userIdParamSchema } from "./validation.js";
const router = Router();
const controller = new UserController();
router.get("/me", authenticate, controller.getMe);
router.get("/", authenticate, authorize("ADMIN"), validateQuery(listUsersQuerySchema), controller.getAll);
router.get("/:id", authenticate, validateParams(userIdParamSchema), controller.getById);
router.patch("/:id", authenticate, validateParams(userIdParamSchema), validateBody(updateUserSchema), controller.update);
export default router;
//# sourceMappingURL=router.js.map