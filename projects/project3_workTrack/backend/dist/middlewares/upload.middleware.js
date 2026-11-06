import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { BadRequestError } from "../shared/errors.js";
/**
 * إعداد Multer لرفع ملفات CSV.
 *
 * ليه Disk Storage؟
 * - بنحتفظ بالملف الأصلي داخل `uploads/csv` عشان يبقى عندنا أثر للـ import
 *   ونقدر نرجع نراجعه بعدين لو حصلت مشكلة.
 * - الاسم اللي بيتخزن على الديسك بيكون unique عشان ملفين بنفس الاسم ميعملوش
 *   overwrite لبعض. الاسم الأصلي بنحتفظ بيه في قاعدة البيانات في `originalName`.
 *
 * ملاحظات أمان:
 * - مسموح `.csv` فقط.
 * - أقصى حجم 5MB.
 * - ملف واحد فقط في كل request، واسم الحقل لازم يكون `file`.
 */
const uploadDirectory = path.resolve(process.cwd(), "uploads", "csv");
fs.mkdirSync(uploadDirectory, { recursive: true });
const safeBaseName = (originalName) => {
    const extension = path.extname(originalName).toLowerCase();
    const base = path
        .basename(originalName, extension)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 60);
    return base || "upload";
};
const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;
        callback(null, `${uniquePrefix}-${safeBaseName(file.originalname)}${extension}`);
    },
});
const csvFileFilter = (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== ".csv") {
        callback(new BadRequestError("Only .csv files are allowed", "INVALID_FILE_TYPE"));
        return;
    }
    callback(null, true);
};
export const uploadCsv = multer({
    storage,
    fileFilter: csvFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
}).single("file");
//# sourceMappingURL=upload.middleware.js.map