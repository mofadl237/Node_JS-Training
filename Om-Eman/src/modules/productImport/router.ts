import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { uploadCsvFile } from "../../middlewares/csv-upload.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { ProductImportController } from "./controller.js";

const router = Router();
const controller = new ProductImportController();

router.post(
  "/",
  authenticate,
  authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN),
  uploadCsvFile("file"),
  controller.importCsv,
);

export default router;
