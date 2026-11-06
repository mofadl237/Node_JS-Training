import fs from "node:fs";
import csvParser from "csv-parser";

/**
 * أدوات مساعدة للتعامل مع CSV.
 *
 * فكرة العمل:
 * 1. `parseCsvFile` بتقرأ الملف من الديسك وتشغّل عليه `csv-parser`.
 * 2. كل سطر بيرجع كـ object مفاتيحه أسماء الأعمدة.
 * 3. `normalizeRow` بتظبط أسماء الأعمدة عشان `employeeCode` و`employee_code`
 *    و`Employee Code` كلهم يبقوا نفس المفتاح `employeecode`.
 * 4. الدوال اللي تحت بتستخدمها الـ services عشان تتحقق من القيم وترجع
 *    Date / number / boolean بشكل آمن.
 */
export type CsvRow = Record<string, string>;

export const parseCsvFile = (filePath: string): Promise<CsvRow[]> =>
  new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: CsvRow) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (error: Error) => reject(error));
  });

export const normalizeKey = (key: string): string =>
  key
    .replace(/^\uFEFF/, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

export const normalizeRow = (row: CsvRow): CsvRow => {
  const normalized: CsvRow = {};

  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeKey(key)] = typeof value === "string" ? value.trim() : String(value ?? "");
  }

  return normalized;
};

export const getValue = (row: CsvRow, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = row[normalizeKey(key)];

    if (value !== undefined && value !== "") {
      return value;
    }
  }

  return undefined;
};

export const requiredValue = (row: CsvRow, field: string, ...aliases: string[]): string => {
  const value = getValue(row, field, ...aliases);

  if (!value) {
    throw new Error(`${field} is required`);
  }

  return value;
};

export const parseDateValue = (value: string, field: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} must be a valid date`);
  }

  return date;
};

export const requiredDateValue = (row: CsvRow, field: string, ...aliases: string[]): Date =>
  parseDateValue(requiredValue(row, field, ...aliases), field);

export const optionalDateValue = (row: CsvRow, field: string, ...aliases: string[]): Date | undefined => {
  const value = getValue(row, field, ...aliases);
  return value ? parseDateValue(value, field) : undefined;
};

export const optionalIntValue = (row: CsvRow, field: string, ...aliases: string[]): number | undefined => {
  const value = getValue(row, field, ...aliases);

  if (value === undefined) {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${field} must be a non-negative integer`);
  }

  return number;
};

export const optionalFloatValue = (row: CsvRow, field: string, ...aliases: string[]): number | undefined => {
  const value = getValue(row, field, ...aliases);

  if (value === undefined) {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${field} must be a positive number`);
  }

  return number;
};

export const optionalBooleanValue = (row: CsvRow, field: string, ...aliases: string[]): boolean | undefined => {
  const value = getValue(row, field, ...aliases);

  if (value === undefined) {
    return undefined;
  }

  const normalized = value.toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  throw new Error(`${field} must be true or false`);
};

export const optionalTimeValue = (row: CsvRow, field: string, ...aliases: string[]): string | undefined => {
  const value = getValue(row, field, ...aliases);

  if (value === undefined) {
    return undefined;
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new Error(`${field} must be in HH:mm format`);
  }

  return value;
};

export const normalizeUtcDay = (value: Date): Date =>
  new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
