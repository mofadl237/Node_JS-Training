import fs from "node:fs";
import csvParser from "csv-parser";
export const parseCsvFile = (filePath) => new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (error) => reject(error));
});
export const normalizeKey = (key) => key
    .replace(/^\uFEFF/, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
export const normalizeRow = (row) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
        normalized[normalizeKey(key)] = typeof value === "string" ? value.trim() : String(value ?? "");
    }
    return normalized;
};
export const getValue = (row, ...keys) => {
    for (const key of keys) {
        const value = row[normalizeKey(key)];
        if (value !== undefined && value !== "") {
            return value;
        }
    }
    return undefined;
};
export const requiredValue = (row, field, ...aliases) => {
    const value = getValue(row, field, ...aliases);
    if (!value) {
        throw new Error(`${field} is required`);
    }
    return value;
};
export const parseDateValue = (value, field) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`${field} must be a valid date`);
    }
    return date;
};
export const requiredDateValue = (row, field, ...aliases) => parseDateValue(requiredValue(row, field, ...aliases), field);
export const optionalDateValue = (row, field, ...aliases) => {
    const value = getValue(row, field, ...aliases);
    return value ? parseDateValue(value, field) : undefined;
};
export const optionalIntValue = (row, field, ...aliases) => {
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
export const optionalFloatValue = (row, field, ...aliases) => {
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
export const optionalBooleanValue = (row, field, ...aliases) => {
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
export const optionalTimeValue = (row, field, ...aliases) => {
    const value = getValue(row, field, ...aliases);
    if (value === undefined) {
        return undefined;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
        throw new Error(`${field} must be in HH:mm format`);
    }
    return value;
};
export const normalizeUtcDay = (value) => new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
//# sourceMappingURL=csv.js.map