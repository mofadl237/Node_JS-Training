import { EEmployeeStatus } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
const employeeSelect = {
    id: true,
    employeeCode: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    departmentId: true,
    jobTitle: true,
    status: true,
    hireDate: true,
    createdAt: true,
    updatedAt: true,
    department: {
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    },
};
const normalizeEmail = (email) => {
    const value = email?.trim().toLowerCase();
    return value ? value : null;
};
export class EmployeeService {
    async create(dto) {
        const employeeCode = dto.employeeCode.trim();
        const email = normalizeEmail(dto.email);
        const department = await prisma.department.findUnique({
            where: { id: dto.departmentId },
            select: { id: true },
        });
        if (!department) {
            throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
        }
        const employeeCodeConflict = await prisma.employee.findUnique({
            where: { employeeCode },
            select: { id: true },
        });
        if (employeeCodeConflict) {
            throw new ConflictError("Employee code already exists", "EMPLOYEE_CODE_EXISTS");
        }
        if (email) {
            const emailConflict = await prisma.employee.findUnique({
                where: { email },
                select: { id: true },
            });
            if (emailConflict) {
                throw new ConflictError("Email already registered", "EMAIL_EXISTS");
            }
        }
        return prisma.employee.create({
            data: {
                employeeCode,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                email,
                phone: dto.phone?.trim() || null,
                departmentId: dto.departmentId,
                jobTitle: dto.jobTitle?.trim() || null,
                status: dto.status ?? EEmployeeStatus.ACTIVE,
                hireDate: dto.hireDate,
            },
            select: employeeSelect,
        });
    }
    async list(query) {
        const where = {};
        if (query.departmentId) {
            where.departmentId = query.departmentId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.q) {
            where.OR = [
                { employeeCode: { contains: query.q, mode: "insensitive" } },
                { firstName: { contains: query.q, mode: "insensitive" } },
                { lastName: { contains: query.q, mode: "insensitive" } },
                { email: { contains: query.q, mode: "insensitive" } },
            ];
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "createdAt";
        const sortOrder = query.sortOrder ?? "desc";
        const [employees, total] = await prisma.$transaction([
            prisma.employee.findMany({
                where,
                select: employeeSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.employee.count({ where }),
        ]);
        return toPaginatedResult(employees, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const employee = await prisma.employee.findUnique({
            where: { id },
            select: employeeSelect,
        });
        if (!employee) {
            throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
        }
        return employee;
    }
    async update(id, dto) {
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingEmployee) {
            throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
        }
        if (dto.departmentId !== undefined) {
            const department = await prisma.department.findUnique({
                where: { id: dto.departmentId },
                select: { id: true },
            });
            if (!department) {
                throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
            }
        }
        if (dto.employeeCode !== undefined) {
            const conflict = await prisma.employee.findFirst({
                where: {
                    id: { not: id },
                    employeeCode: dto.employeeCode.trim(),
                },
                select: { id: true },
            });
            if (conflict) {
                throw new ConflictError("Employee code already exists", "EMPLOYEE_CODE_EXISTS");
            }
        }
        if (dto.email !== undefined) {
            const email = normalizeEmail(dto.email);
            if (email) {
                const conflict = await prisma.employee.findFirst({
                    where: {
                        id: { not: id },
                        email,
                    },
                    select: { id: true },
                });
                if (conflict) {
                    throw new ConflictError("Email already registered", "EMAIL_EXISTS");
                }
            }
        }
        return prisma.employee.update({
            where: { id },
            data: {
                ...(dto.employeeCode !== undefined
                    ? { employeeCode: dto.employeeCode.trim() }
                    : {}),
                ...(dto.firstName !== undefined ? { firstName: dto.firstName.trim() } : {}),
                ...(dto.lastName !== undefined ? { lastName: dto.lastName.trim() } : {}),
                ...(dto.email !== undefined ? { email: normalizeEmail(dto.email) } : {}),
                ...(dto.phone !== undefined ? { phone: dto.phone?.trim() || null } : {}),
                ...(dto.departmentId !== undefined ? { departmentId: dto.departmentId } : {}),
                ...(dto.jobTitle !== undefined ? { jobTitle: dto.jobTitle?.trim() || null } : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.hireDate !== undefined ? { hireDate: dto.hireDate } : {}),
            },
            select: employeeSelect,
        });
    }
    async remove(id) {
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingEmployee) {
            throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
        }
        const [employeeShifts, attendanceLogs, attendanceRecords] = await prisma.$transaction([
            prisma.employeeShift.count({ where: { employeeId: id } }),
            prisma.attendanceLog.count({ where: { employeeId: id } }),
            prisma.attendanceRecord.count({ where: { employeeId: id } }),
        ]);
        if (employeeShifts > 0 || attendanceLogs > 0 || attendanceRecords > 0) {
            throw new ConflictError("Employee has related records and cannot be deleted", "EMPLOYEE_HAS_RELATED_RECORDS");
        }
        await prisma.employee.delete({ where: { id } });
    }
}
//# sourceMappingURL=services.js.map