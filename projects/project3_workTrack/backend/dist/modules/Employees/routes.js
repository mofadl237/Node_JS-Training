import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery, } from "../../middlewares/validate.middleware.js";
import { EmployeeController } from "./controller.js";
import { createEmployeeSchema, employeeIdParamSchema, listEmployeesQuerySchema, updateEmployeeSchema, } from "./validation.js";
const router = Router();
const controller = new EmployeeController();
router.get("/", authenticate, validateQuery(listEmployeesQuerySchema), controller.list);
router.get("/:id", authenticate, validateParams(employeeIdParamSchema), controller.getById);
router.post("/", authenticate, authorize(ERole.ADMIN, ERole.HR), validateBody(createEmployeeSchema), controller.create);
router.patch("/:id", authenticate, authorize(ERole.ADMIN, ERole.HR), validateParams(employeeIdParamSchema), validateBody(updateEmployeeSchema), controller.update);
router.delete("/:id", authenticate, authorize(ERole.ADMIN, ERole.HR), validateParams(employeeIdParamSchema), controller.remove);
export default router;
//# sourceMappingURL=routes.js.map