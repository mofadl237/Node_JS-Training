import { Prisma } from "@prisma/client";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, ServiceUnavailableError, ValidationError, } from "../errors.js";
function getDriverCause(err) {
    const meta = err.meta;
    if (!meta)
        return null;
    const driverError = meta.driverAdapterError;
    if (driverError && typeof driverError === "object") {
        const record = driverError;
        const cause = record.cause;
        if (cause && typeof cause === "object")
            return cause;
        return record;
    }
    const cause = meta.cause;
    if (cause && typeof cause === "object")
        return cause;
    return null;
}
function getPostgresCode(err) {
    const cause = getDriverCause(err);
    return typeof cause?.originalCode === "string" ? cause.originalCode : undefined;
}
function describeConstraint(err) {
    const cause = getDriverCause(err);
    const constraint = cause?.constraint;
    if (constraint) {
        if (Array.isArray(constraint.fields) && constraint.fields.length > 0) {
            return constraint.fields.join(", ");
        }
        if (typeof constraint.fields === "string") {
            return constraint.fields;
        }
        if (typeof constraint.index === "string") {
            return constraint.index;
        }
    }
    const target = err.meta?.target;
    if (Array.isArray(target) && target.length > 0) {
        return target.join(", ");
    }
    if (typeof target === "string") {
        return target;
    }
    return undefined;
}
function mapPostgresCode(code, err) {
    const constraint = describeConstraint(err);
    switch (code) {
        case "23505":
            return new ConflictError(constraint
                ? `Duplicate value for: ${constraint}`
                : "A record with the same unique value already exists", "CONFLICT");
        case "23503":
            return new BadRequestError(constraint
                ? `Invalid reference for: ${constraint}`
                : "A referenced related record does not exist", "FOREIGN_KEY_ERROR");
        case "23502":
            return new ValidationError(constraint ? `Null constraint violation on ${constraint}` : "Null constraint violation", "NULL_CONSTRAINT");
        case "23514":
            return new ValidationError(constraint
                ? `Value violates the check constraint ${constraint}`
                : "Value violates a database check constraint", "CHECK_CONSTRAINT");
        case "23P01":
            return new ConflictError("Data conflicts with an existing record", "DATA_CONFLICT");
        case "22001":
            return new ValidationError("The provided value is too long for the column", "VALUE_TOO_LONG");
        case "22003":
            return new ValidationError("The provided value is out of range", "VALUE_OUT_OF_RANGE");
        case "22P02":
            return new ValidationError("Invalid input syntax for the provided value", "INVALID_INPUT_VALUE");
        case "40001":
        case "40P01":
            return new ConflictError("Transaction conflict; please retry the request", "TRANSACTION_CONFLICT");
        case "42P01":
            return new NotFoundError("The table does not exist in the current database", "TABLE_NOT_FOUND");
        case "42703":
            return new NotFoundError("The column does not exist in the current database", "COLUMN_NOT_FOUND");
        case "53300":
            return new ServiceUnavailableError("Database is accepting too many connections", "DB_TOO_MANY_CONNECTIONS");
        case "57014":
            return new ServiceUnavailableError("Database query was canceled", "DB_QUERY_CANCELED");
        case "57P01":
        case "57P02":
        case "57P03":
            return new ServiceUnavailableError("Database is unavailable", "DB_UNAVAILABLE");
        case "08000":
        case "08001":
        case "08003":
        case "08004":
        case "08006":
        case "08007":
            return new ServiceUnavailableError("Database connection error", "DB_CONNECTION_ERROR");
        default:
            return null;
    }
}
export function mapPrismaError(err) {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        return null;
    }
    const postgresCode = getPostgresCode(err);
    if (postgresCode) {
        const mappedPostgresError = mapPostgresCode(postgresCode, err);
        if (mappedPostgresError)
            return mappedPostgresError;
    }
    const constraint = describeConstraint(err);
    switch (err.code) {
        case "P2002":
            return new ConflictError(constraint
                ? `Duplicate value for: ${constraint}`
                : "A record with the same unique value already exists", "CONFLICT");
        case "P2003":
            return new BadRequestError(constraint
                ? `Invalid reference for: ${constraint}`
                : "A referenced related record does not exist", "FOREIGN_KEY_ERROR");
        case "P2000":
            return new ValidationError("The provided value is too long for the column", "VALUE_TOO_LONG");
        case "P2001":
            return new NotFoundError("The record searched for does not exist", "RECORD_NOT_FOUND");
        case "P2007":
            return new ValidationError("Invalid database input value", "INVALID_INPUT_VALUE");
        case "P2011":
            return new ValidationError(constraint ? `Null constraint violation on ${constraint}` : "Null constraint violation", "NULL_CONSTRAINT");
        case "P2012": {
            const path = err.meta?.path;
            return new ValidationError(path ? `Missing required value at ${path}` : "Missing required value", "MISSING_REQUIRED_VALUE");
        }
        case "P2014":
            return new BadRequestError("Invalid relation change", "RELATION_VIOLATION");
        case "P2016":
            return new BadRequestError("Query interpretation error", "QUERY_INTERPRETATION_ERROR");
        case "P2020":
            return new ValidationError("The provided value is out of range", "VALUE_OUT_OF_RANGE");
        case "P2021":
            return new NotFoundError("The table does not exist in the current database", "TABLE_NOT_FOUND");
        case "P2022":
            return new NotFoundError("The column does not exist in the current database", "COLUMN_NOT_FOUND");
        case "P2023":
            return new InternalServerError("Inconsistent database column data", "INCONSISTENT_COLUMN_DATA");
        case "P2024":
            return new ServiceUnavailableError("Database connection pool timed out", "DB_POOL_TIMEOUT");
        case "P2025":
            return new NotFoundError("The requested record was not found", "NOT_FOUND");
        case "P2034":
            return new ConflictError("Transaction conflict; please retry the request", "TRANSACTION_CONFLICT");
        case "P2037":
            return new ServiceUnavailableError("Database is accepting too many connections", "DB_TOO_MANY_CONNECTIONS");
        case "P2039":
            return new InternalServerError("Database error occurred", "DB_ERROR");
        case "P1000":
        case "P1001":
        case "P1002":
        case "P1003":
        case "P1008":
        case "P1010":
        case "P1011":
        case "P1017":
        case "P1018":
            return new ServiceUnavailableError("Database service unavailable", "DB_UNAVAILABLE");
        default:
            return new BadRequestError("Database constraint violation", "DB_CONSTRAINT_ERROR");
    }
}
export function isPrismaError(err) {
    return err instanceof Prisma.PrismaClientKnownRequestError;
}
export function isPrismaValidationError(err) {
    return err instanceof Prisma.PrismaClientValidationError;
}
export function isPrismaInitializationError(err) {
    return err instanceof Prisma.PrismaClientInitializationError;
}
export function isPrismaRustPanicError(err) {
    return err instanceof Prisma.PrismaClientRustPanicError;
}
export function isPrismaUnknownRequestError(err) {
    return err instanceof Prisma.PrismaClientUnknownRequestError;
}
//# sourceMappingURL=prisma-error.mapper.js.map