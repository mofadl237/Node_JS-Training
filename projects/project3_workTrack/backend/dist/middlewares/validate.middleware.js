import { ValidationError } from "../shared/errors.js";
const formatZodIssues = (issues) => issues.map((issue) => {
    const path = issue.path && issue.path.length > 0 ? issue.path.map(String).join(".") : "body";
    const message = issue.message || "Validation failed";
    return {
        field: path,
        message: path === "body" ? message : `${path}: ${message}`,
    };
});
const buildValidationMessage = (issues) => {
    const first = issues[0];
    if (!first)
        return "Validation failed";
    const path = first.path && first.path.length > 0 ? first.path.map(String).join(".") : null;
    const message = first.message || "Validation failed";
    return path ? `${path}: ${message}` : message;
};
const assignValidatedValue = (req, key, value) => {
    try {
        req[key] = value;
    }
    catch {
        Object.defineProperty(req, key, {
            value,
            writable: true,
            configurable: true,
        });
    }
};
const validate = (schema, source) => (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        const details = formatZodIssues(result.error.issues);
        const message = buildValidationMessage(result.error.issues);
        next(new ValidationError(message, "VALIDATION_ERROR", { errors: details }));
        return;
    }
    assignValidatedValue(req, source, result.data);
    next();
};
export const validateBody = (schema) => validate(schema, "body");
export const validateQuery = (schema) => validate(schema, "query");
export const validateParams = (schema) => validate(schema, "params");
//# sourceMappingURL=validate.middleware.js.map