import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateEmployeeShiftInput,
  ICreateShiftInput,
  IEmployeeShiftResponse,
  IShiftResponse,
  IUpdateEmployeeShiftInput,
  IUpdateShiftInput,
} from "./type.js";
import type {
  IListEmployeeShiftsQuery,
  IListShiftsQuery,
} from "./validation.js";

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
} as const;

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
} as const;

const employeeShiftSelect = {
  id: true,
  employeeId: true,
  shiftId: true,
  startDate: true,
  endDate: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  employee: { select: employeeSummarySelect },
  shift: { select: shiftSelect },
} as const;

export class ShiftService {
  async create(dto: ICreateShiftInput): Promise<IShiftResponse> {
    return prisma.shift.create({
      data: {
        name: dto.name.trim(),
        startTime: dto.startTime.trim(),
        endTime: dto.endTime.trim(),
        ...(dto.graceMinutes !== undefined ? { graceMinutes: dto.graceMinutes } : {}),
        ...(dto.expectedHours !== undefined ? { expectedHours: dto.expectedHours } : {}),
        ...(dto.overtimeAfterMinutes !== undefined
          ? { overtimeAfterMinutes: dto.overtimeAfterMinutes }
          : {}),
        ...(dto.isNightShift !== undefined ? { isNightShift: dto.isNightShift } : {}),
      },
      select: shiftSelect,
    });
  }

  async list(query: IListShiftsQuery) {
    const where: Prisma.ShiftWhereInput = {};

    if (query.q) {
      where.name = { contains: query.q, mode: "insensitive" };
    }

    if (query.isNightShift !== undefined) {
      where.isNightShift = query.isNightShift === "true";
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "name";
    const sortOrder = query.sortOrder ?? "asc";

    const [shifts, total] = await prisma.$transaction([
      prisma.shift.findMany({
        where,
        select: shiftSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.shift.count({ where }),
    ]);

    return toPaginatedResult(
      shifts as IShiftResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IShiftResponse> {
    const shift = await prisma.shift.findUnique({
      where: { id },
      select: shiftSelect,
    });

    if (!shift) {
      throw new NotFoundError("Shift not found", "SHIFT_NOT_FOUND");
    }

    return shift;
  }

  async update(id: string, dto: IUpdateShiftInput): Promise<IShiftResponse> {
    await this.getById(id);

    return prisma.shift.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.startTime !== undefined ? { startTime: dto.startTime.trim() } : {}),
        ...(dto.endTime !== undefined ? { endTime: dto.endTime.trim() } : {}),
        ...(dto.graceMinutes !== undefined ? { graceMinutes: dto.graceMinutes } : {}),
        ...(dto.expectedHours !== undefined ? { expectedHours: dto.expectedHours } : {}),
        ...(dto.overtimeAfterMinutes !== undefined
          ? { overtimeAfterMinutes: dto.overtimeAfterMinutes }
          : {}),
        ...(dto.isNightShift !== undefined ? { isNightShift: dto.isNightShift } : {}),
      },
      select: shiftSelect,
    });
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);

    const [assignmentsCount, recordsCount] = await prisma.$transaction([
      prisma.employeeShift.count({ where: { shiftId: id } }),
      prisma.attendanceRecord.count({ where: { shiftId: id } }),
    ]);

    if (assignmentsCount > 0 || recordsCount > 0) {
      throw new ConflictError(
        "Shift is assigned to employees or used by attendance records and cannot be deleted",
        "SHIFT_IN_USE",
      );
    }

    await prisma.shift.delete({ where: { id } });
  }
}

export class EmployeeShiftService {
  private async ensureEmployeeExists(employeeId: string): Promise<void> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
    }
  }

  private async ensureShiftExists(shiftId: string): Promise<void> {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      select: { id: true },
    });

    if (!shift) {
      throw new NotFoundError("Shift not found", "SHIFT_NOT_FOUND");
    }
  }

  private assertDateRange(startDate: Date, endDate: Date | null | undefined): void {
    if (endDate && endDate.getTime() < startDate.getTime()) {
      throw new BadRequestError(
        "endDate must be after or equal to startDate",
        "INVALID_DATE_RANGE",
      );
    }
  }

  async create(dto: ICreateEmployeeShiftInput): Promise<IEmployeeShiftResponse> {
    await this.ensureEmployeeExists(dto.employeeId);
    await this.ensureShiftExists(dto.shiftId);
    this.assertDateRange(dto.startDate, dto.endDate);

    return prisma.employeeShift.create({
      data: {
        employeeId: dto.employeeId,
        shiftId: dto.shiftId,
        startDate: dto.startDate,
        ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      select: employeeShiftSelect,
    });
  }

  async list(query: IListEmployeeShiftsQuery) {
    const where: Prisma.EmployeeShiftWhereInput = {};

    if (query.employeeId) {
      where.employeeId = query.employeeId;
    }

    if (query.shiftId) {
      where.shiftId = query.shiftId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    if (query.from || query.to) {
      where.startDate = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "startDate";
    const sortOrder = query.sortOrder ?? "desc";

    const [assignments, total] = await prisma.$transaction([
      prisma.employeeShift.findMany({
        where,
        select: employeeShiftSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.employeeShift.count({ where }),
    ]);

    return toPaginatedResult(
      assignments as IEmployeeShiftResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IEmployeeShiftResponse> {
    const assignment = await prisma.employeeShift.findUnique({
      where: { id },
      select: employeeShiftSelect,
    });

    if (!assignment) {
      throw new NotFoundError(
        "Employee shift assignment not found",
        "EMPLOYEE_SHIFT_NOT_FOUND",
      );
    }

    return assignment;
  }

  async update(id: string, dto: IUpdateEmployeeShiftInput): Promise<IEmployeeShiftResponse> {
    const existing = await prisma.employeeShift.findUnique({
      where: { id },
      select: { id: true, startDate: true, endDate: true },
    });

    if (!existing) {
      throw new NotFoundError(
        "Employee shift assignment not found",
        "EMPLOYEE_SHIFT_NOT_FOUND",
      );
    }

    if (dto.employeeId !== undefined) {
      await this.ensureEmployeeExists(dto.employeeId);
    }

    if (dto.shiftId !== undefined) {
      await this.ensureShiftExists(dto.shiftId);
    }

    const startDate = dto.startDate ?? existing.startDate;
    const endDate = dto.endDate !== undefined ? dto.endDate : existing.endDate;
    this.assertDateRange(startDate, endDate);

    return prisma.employeeShift.update({
      where: { id },
      data: {
        ...(dto.employeeId !== undefined ? { employeeId: dto.employeeId } : {}),
        ...(dto.shiftId !== undefined ? { shiftId: dto.shiftId } : {}),
        ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
        ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      select: employeeShiftSelect,
    });
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.employeeShift.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundError(
        "Employee shift assignment not found",
        "EMPLOYEE_SHIFT_NOT_FOUND",
      );
    }

    await prisma.employeeShift.delete({ where: { id } });
  }
}
