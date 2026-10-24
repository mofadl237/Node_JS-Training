import { Router } from "express";
import { AuthController } from "./controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./validation.js";

const router = Router();
const authController = new AuthController();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);

export default router;
