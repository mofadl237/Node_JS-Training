import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery, } from "../../middlewares/validate.middleware.js";
import { DepartmentController } from "./controller.js";
import { createDepartmentSchema, departmentIdParamSchema, listDepartmentsQuerySchema, updateDepartmentSchema, } from "./validation.js";
const router = Router();
const controller = new DepartmentController();
router.get("/", authenticate, validateQuery(listDepartmentsQuerySchema), controller.list);
router.get("/:id", authenticate, validateParams(departmentIdParamSchema), controller.getById);
router.post("/", authenticate, authorize(ERole.ADMIN, ERole.HR), validateBody(createDepartmentSchema), controller.create);
router.patch("/:id", authenticate, authorize(ERole.ADMIN, ERole.HR), validateParams(departmentIdParamSchema), validateBody(updateDepartmentSchema), controller.update);
router.delete("/:id", authenticate, authorize(ERole.ADMIN, ERole.HR), validateParams(departmentIdParamSchema), controller.remove);
export default router;
//# sourceMappingURL=routes.js.map