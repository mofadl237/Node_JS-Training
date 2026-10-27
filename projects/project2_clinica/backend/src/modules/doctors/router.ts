import { Router } from "express";
import { DoctorsController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import { createDoctorSchema, doctorIdParamSchema, listDoctorsQuerySchema, updateDoctorSchema } from "./validation.js";

const router = Router();
const doctorsController = new DoctorsController();

router.get("/", validateQuery(listDoctorsQuerySchema), doctorsController.list);
router.get("/:id", validateParams(doctorIdParamSchema), doctorsController.getById);

router.post("/", authenticate, authorize("ADMIN"), validateBody(createDoctorSchema), doctorsController.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validateParams(doctorIdParamSchema), validateBody(updateDoctorSchema), doctorsController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(doctorIdParamSchema), doctorsController.remove);

export default router;
