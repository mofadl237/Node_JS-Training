import { ValidationError } from "../shared/errors.js";
const formatZodIssues = (issues) => {
    return issues.map((issue) => {
        const path = issue.path && issue.path.length > 0 ? issue.path.join(".") : "body";
        const message = issue.message || "Validation failed";
        return {
            field: path,
            message: path === "body" ? message : `${path}: ${message}`,
        };
    });
};
const buildValidationMessage = (issues) => {
    if (!issues || issues.length === 0) {
        return "Validation failed";
    }
    const first = issues[0];
    const path = first.path && first.path.length > 0 ? first.path.join(".") : null;
    if (path) {
        return `${path}: ${first.message || "Validation failed"}`;
    }
    return first.message || "Validation failed";
};
export const validateBody = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const details = formatZodIssues(result.error.issues);
            const message = buildValidationMessage(result.error.issues);
            throw new ValidationError(message, "VALIDATION_ERROR", { errors: details });
        }
        try {
            req.body = result.data;
        }
        catch {
            Object.defineProperty(req, "body", { value: result.data, writable: true, configurable: true });
        }
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const details = formatZodIssues(result.error.issues);
            const message = buildValidationMessage(result.error.issues);
            throw new ValidationError(message, "VALIDATION_ERROR", { errors: details });
        }
        try {
            req.query = result.data;
        }
        catch {
            Object.defineProperty(req, "query", { value: result.data, writable: true, configurable: true });
        }
        next();
    };
};
export const validateParams = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            const details = formatZodIssues(result.error.issues);
            const message = buildValidationMessage(result.error.issues);
            throw new ValidationError(message, "VALIDATION_ERROR", { errors: details });
        }
        try {
            req.params = result.data;
        }
        catch {
            Object.defineProperty(req, "params", { value: result.data, writable: true, configurable: true });
        }
        next();
    };
};
//# sourceMappingURL=validate.middleware.js.map