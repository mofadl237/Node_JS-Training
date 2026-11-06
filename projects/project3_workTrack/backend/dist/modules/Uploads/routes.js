import { Router } from "express";
import { ERole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { uploadCsv } from "../../middlewares/upload.middleware.js";
import { validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import { UploadController } from "./controller.js";
import { listUploadsQuerySchema, uploadIdParamSchema } from "./validation.js";
const router = Router();
const controller = new UploadController();
/**
 * رفع ملفات CSV.
 * الحقل المطلوب في form-data اسمه `file`.
 * الصلاحية: ADMIN أو HR فقط.
 */
router.post("/employees", authenticate, authorize(ERole.ADMIN, ERole.HR), uploadCsv, controller.importEmployees);
router.post("/attendance", authenticate, authorize(ERole.ADMIN, ERole.HR), uploadCsv, controller.importAttendance);
router.get("/", authenticate, validateQuery(listUploadsQuerySchema), controller.list);
router.get("/:id", authenticate, validateParams(uploadIdParamSchema), controller.getById);
export default router;
//# sourceMappingURL=routes.js.map