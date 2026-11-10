import path from "node:path";
import type { RequestHandler } from "express";
import multer from "multer";
import { ValidationError } from "../shared/errors.js";

const MAX_CSV_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "text/csv",
  "text/comma-separated-values",
  "text/plain",
  "application/csv",
  "application/vnd.ms-excel",
  "application/octet-stream",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_CSV_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== ".csv" || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(
        new ValidationError(
          "Only CSV files are allowed",
          "CSV_FILE_TYPE_INVALID",
        ),
      );
      return;
    }

    callback(null, true);
  },
});

export function uploadCsvFile(fieldName = "file"): RequestHandler {
  return (req, res, next): void => {
    upload.single(fieldName)(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          next(
            new ValidationError(
              `CSV file must not exceed ${MAX_CSV_SIZE_BYTES / 1024 / 1024} MB`,
              "CSV_FILE_TOO_LARGE",
            ),
          );
          return;
        }

        next(new ValidationError(error.message, "CSV_UPLOAD_ERROR"));
        return;
      }

      next(error);
    });
  };
}
