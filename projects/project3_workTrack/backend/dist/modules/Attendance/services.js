import { prisma } from "../../config/prisma.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
const employeeSummarySelect = {
    id: true,
    employeeCode: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    departmentId: true,
    jobTitle: true,
    status: true,
};
const shiftSelect = {
    id: true,
    name: true,
    startTime: true,
    endTime: true,
    graceMinutes: true,
    expectedHours: true,
    overtimeAfterMinutes: true,
    isNightShift: true,
    createdAt: true,
    updatedAt: true,
};
const userSummarySelect = {
    id: true,
    name: true,
    email: true,
    role: true,
};
const attendanceLogSelect = {
    id: true,
    employeeId: true,
    type: true,
    timestamp: true,
    source: true,
    createdById: true,
    createdAt: true,
    employee: { select: employeeSummarySelect },
    createdBy: { select: userSummarySelect },
};
const attendanceRecordSelect = {
    id: true,
    employeeId: true,
    shiftId: true,
    date: true,
    checkIn: true,
    checkOut: true,
    status: true,
    workingMinutes: true,
    lateMinutes: true,
    earlyLeaveMinutes: true,
    overtimeMinutes: true,
    notes: true,
    processedAt: true,
    createdAt: true,
    updatedAt: true,
    employee: { select: employeeSummarySelect },
    shift: { select: shiftSelect },
};
const normalizeDate = (value) => new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
const calculateWorkingMinutes = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) {
        return 0;
    }
    return Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 60000));
};
const assertCheckRange = (checkIn, checkOut) => {
    if (checkIn && checkOut && checkOut.getTime() < checkIn.getTime()) {
        throw new BadRequestError("checkOut must be after or equal to checkIn", "INVALID_TIME_RANGE");
    }
};
const ensureEmployeeExists = async (employeeId) => {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: { id: true },
    });
    if (!employee) {
        throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
    }
};
const ensureShiftExists = async (shiftId) => {
    const shift = await prisma.shift.findUnique({
        where: { id: shiftId },
        select: { id: true },
    });
    if (!shift) {
        throw new NotFoundError("Shift not found", "SHIFT_NOT_FOUND");
    }
};
export class AttendanceLogService {
    async create(dto, actorUserId) {
        await ensureEmployeeExists(dto.employeeId);
        return prisma.attendanceLog.create({
            data: {
                employeeId: dto.employeeId,
                type: dto.type,
                timestamp: dto.timestamp,
                ...(dto.source !== undefined ? { source: dto.source } : {}),
                createdById: actorUserId,
            },
            select: attendanceLogSelect,
        });
    }
    async list(query) {
        const where = {};
        if (query.employeeId) {
            where.employeeId = query.employeeId;
        }
        if (query.departmentId) {
            where.employee = { is: { departmentId: query.departmentId } };
        }
        if (query.type) {
            where.type = query.type;
        }
        if (query.source) {
            where.source = query.source;
        }
        if (query.from || query.to) {
            where.timestamp = {
                ...(query.from ? { gte: new Date(query.from) } : {}),
                ...(query.to ? { lte: new Date(query.to) } : {}),
            };
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "timestamp";
        const sortOrder = query.sortOrder ?? "desc";
        const [logs, total] = await prisma.$transaction([
            prisma.attendanceLog.findMany({
                where,
                select: attendanceLogSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.attendanceLog.count({ where }),
        ]);
        return toPaginatedResult(logs, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const log = await prisma.attendanceLog.findUnique({
            where: { id },
            select: attendanceLogSelect,
        });
        if (!log) {
            throw new NotFoundError("Attendance log not found", "ATTENDANCE_LOG_NOT_FOUND");
        }
        return log;
    }
    async remove(id) {
        await this.getById(id);
        await prisma.attendanceLog.delete({ where: { id } });
    }
}
export class AttendanceRecordService {
    async findExistingForDate(employeeId, date) {
        return prisma.attendanceRecord.findUnique({
            where: { employeeId_date: { employeeId, date } },
            select: { id: true },
        });
    }
    async create(dto) {
        await ensureEmployeeExists(dto.employeeId);
        if (dto.shiftId !== undefined && dto.shiftId !== null) {
            await ensureShiftExists(dto.shiftId);
        }
        assertCheckRange(dto.checkIn, dto.checkOut);
        const date = normalizeDate(dto.date);
        const existingRecord = await this.findExistingForDate(dto.employeeId, date);
        if (existingRecord) {
            throw new ConflictError("Attendance record already exists for this employee and date", "ATTENDANCE_RECORD_EXISTS");
        }
        const workingMinutes = dto.workingMinutes ?? calculateWorkingMinutes(dto.checkIn ?? null, dto.checkOut ?? null);
        return prisma.attendanceRecord.create({
            data: {
                employeeId: dto.employeeId,
                date,
                workingMinutes,
                ...(dto.shiftId !== undefined ? { shiftId: dto.shiftId } : {}),
                ...(dto.checkIn !== undefined ? { checkIn: dto.checkIn } : {}),
                ...(dto.checkOut !== undefined ? { checkOut: dto.checkOut } : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.lateMinutes !== undefined ? { lateMinutes: dto.lateMinutes } : {}),
                ...(dto.earlyLeaveMinutes !== undefined
                    ? { earlyLeaveMinutes: dto.earlyLeaveMinutes }
                    : {}),
                ...(dto.overtimeMinutes !== undefined ? { overtimeMinutes: dto.overtimeMinutes } : {}),
                ...(dto.notes !== undefined ? { notes: dto.notes?.trim() || null } : {}),
                ...(dto.processedAt !== undefined ? { processedAt: dto.processedAt } : {}),
            },
            select: attendanceRecordSelect,
        });
    }
    async list(query) {
        const where = {};
        if (query.employeeId) {
            where.employeeId = query.employeeId;
        }
        if (query.departmentId) {
            where.employee = { is: { departmentId: query.departmentId } };
        }
        if (query.shiftId) {
            where.shiftId = query.shiftId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.from || query.to) {
            where.date = {
                ...(query.from ? { gte: normalizeDate(new Date(query.from)) } : {}),
                ...(query.to ? { lte: normalizeDate(new Date(query.to)) } : {}),
            };
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "date";
        const sortOrder = query.sortOrder ?? "desc";
        const [records, total] = await prisma.$transaction([
            prisma.attendanceRecord.findMany({
                where,
                select: attendanceRecordSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.attendanceRecord.count({ where }),
        ]);
        return toPaginatedResult(records, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const record = await prisma.attendanceRecord.findUnique({
            where: { id },
            select: attendanceRecordSelect,
        });
        if (!record) {
            throw new NotFoundError("Attendance record not found", "ATTENDANCE_RECORD_NOT_FOUND");
        }
        return record;
    }
    async update(id, dto) {
        const existing = await prisma.attendanceRecord.findUnique({
            where: { id },
            select: {
                id: true,
                employeeId: true,
                date: true,
                checkIn: true,
                checkOut: true,
            },
        });
        if (!existing) {
            throw new NotFoundError("Attendance record not found", "ATTENDANCE_RECORD_NOT_FOUND");
        }
        if (dto.employeeId !== undefined) {
            await ensureEmployeeExists(dto.employeeId);
        }
        if (dto.shiftId !== undefined && dto.shiftId !== null) {
            await ensureShiftExists(dto.shiftId);
        }
        const employeeId = dto.employeeId ?? existing.employeeId;
        const date = dto.date !== undefined ? normalizeDate(dto.date) : existing.date;
        const checkIn = dto.checkIn !== undefined ? dto.checkIn : existing.checkIn;
        const checkOut = dto.checkOut !== undefined ? dto.checkOut : existing.checkOut;
        assertCheckRange(checkIn, checkOut);
        const dateChanged = employeeId !== existing.employeeId || date.getTime() !== existing.date.getTime();
        if (dateChanged) {
            const conflict = await this.findExistingForDate(employeeId, date);
            if (conflict && conflict.id !== id) {
                throw new ConflictError("Attendance record already exists for this employee and date", "ATTENDANCE_RECORD_EXISTS");
            }
        }
        let workingMinutes = dto.workingMinutes;
        if (workingMinutes === undefined && (dto.checkIn !== undefined || dto.checkOut !== undefined)) {
            workingMinutes = calculateWorkingMinutes(checkIn, checkOut);
        }
        return prisma.attendanceRecord.update({
            where: { id },
            data: {
                ...(dto.employeeId !== undefined ? { employeeId: dto.employeeId } : {}),
                ...(dto.date !== undefined ? { date } : {}),
                ...(dto.shiftId !== undefined ? { shiftId: dto.shiftId } : {}),
                ...(dto.checkIn !== undefined ? { checkIn: dto.checkIn } : {}),
                ...(dto.checkOut !== undefined ? { checkOut: dto.checkOut } : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(workingMinutes !== undefined ? { workingMinutes } : {}),
                ...(dto.lateMinutes !== undefined ? { lateMinutes: dto.lateMinutes } : {}),
                ...(dto.earlyLeaveMinutes !== undefined
                    ? { earlyLeaveMinutes: dto.earlyLeaveMinutes }
                    : {}),
                ...(dto.overtimeMinutes !== undefined ? { overtimeMinutes: dto.overtimeMinutes } : {}),
                ...(dto.notes !== undefined ? { notes: dto.notes?.trim() || null } : {}),
                ...(dto.processedAt !== undefined ? { processedAt: dto.processedAt } : {}),
            },
            select: attendanceRecordSelect,
        });
    }
    async remove(id) {
        await this.getById(id);
        await prisma.attendanceRecord.delete({ where: { id } });
    }
}
//# sourceMappingURL=services.js.map