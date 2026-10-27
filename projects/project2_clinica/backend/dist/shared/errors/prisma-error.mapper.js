import { Prisma } from '@prisma/client';
import { BadRequestError, ConflictError, NotFoundError, ValidationError } from '../errors.js';
export function mapPrismaError(err) {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        return null;
    }
    switch (err.code) {
        case 'P2002': {
            const target = err.meta?.target?.join(', ');
            return new ConflictError(target ? `Duplicate value for: ${target}` : 'A record with the same unique value already exists', 'CONFLICT');
        }
        case 'P2003': {
            const field = err.meta?.field_name;
            return new BadRequestError(field ? `Invalid reference for field: ${field}` : 'A referenced related record does not exist', 'FOREIGN_KEY_ERROR');
        }
        case 'P2025': {
            return new NotFoundError('The requested record was not found', 'NOT_FOUND');
        }
        case 'P2014': {
            return new BadRequestError('Invalid relation change', 'RELATION_VIOLATION');
        }
        case 'P2000': {
            return new ValidationError('The provided value is too long for the column', 'VALUE_TOO_LONG');
        }
        case 'P2001': {
            return new NotFoundError('The record searched for does not exist', 'RECORD_NOT_FOUND');
        }
        case 'P2011': {
            const constraint = err.meta?.constraint;
            return new ValidationError(constraint ? `Null constraint violation on ${constraint}` : 'Null constraint violation', 'NULL_CONSTRAINT');
        }
        case 'P2012': {
            const path = err.meta?.path;
            return new ValidationError(path ? `Missing required value at ${path}` : 'Missing required value', 'MISSING_REQUIRED_VALUE');
        }
        case 'P2016': {
            return new BadRequestError('Query interpretation error', 'QUERY_INTERPRETATION_ERROR');
        }
        case 'P2021': {
            return new NotFoundError('The table does not exist in the current database', 'TABLE_NOT_FOUND');
        }
        case 'P2022': {
            return new NotFoundError('The column does not exist in the current database', 'COLUMN_NOT_FOUND');
        }
        default:
            return new BadRequestError('Database constraint violation', 'DB_CONSTRAINT_ERROR');
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
//# sourceMappingURL=prisma-error.mapper.js.map