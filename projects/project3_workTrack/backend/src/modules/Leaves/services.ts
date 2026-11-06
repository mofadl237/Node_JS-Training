import { Prisma } from "@prisma/client";
import type { ELeaveRecurrence, ELeaveScope } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { BadRequestError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateLeaveInput,
  ILeaveCalendarResponse,
  ILeaveCheckResponse,
  ILeaveOccurrence,
  ILeaveOccurrenceLeave,
  ILeaveResponse,
  IUpdateLeaveInput,
} from "./type.js";
import type {
  ILeaveCalendarQuery,
  ILeaveCheckQuery,
  IListLeavesQuery,
} from "./validation.js";

const leaveSelect = {
  id: true,
  name: true,
  description: true,
  type: true,
  scope: true,
  employeeId: true,
  departmentId: true,
  startDate: true,
  endDate: true,
  isPaid: true,
  isDeductible: true,
  isActive: true,
  recurrence: true,
  recurrenceDayOfWeek: true,
  recurrenceDayOfMonth: true,
  recurrenceMonth: true,
  recurrenceDay: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  employee: {
    select: {
      id: true,
      employeeCode: true,
      firstName: true,
      lastName: true,
      email: true,
      departmentId: true,
      jobTitle: true,
    },
  },
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} as const;

const leaveCalendarSelect = {
  id: true,
  name: true,
  type: true,
  scope: true,
  employeeId: true,
  departmentId: true,
  isPaid: true,
  isDeductible: true,
  startDate: true,
  endDate: true,
  recurrence: true,
  recurrenceDayOfWeek: true,
  recurrenceDayOfMonth: true,
  recurrenceMonth: true,
  recurrenceDay: true,
} as const;

const leaveExistingSelect = {
  id: true,
  name: true,
  description: true,
  type: true,
  scope: true,
  employeeId: true,
  departmentId: true,
  startDate: true,
  endDate: true,
  isPaid: true,
  isDeductible: true,
  isActive: true,
  recurrence: true,
  recurrenceDayOfWeek: true,
  recurrenceDayOfMonth: true,
  recurrenceMonth: true,
  recurrenceDay: true,
} as const;

type LeaveCalendarSource = Prisma.LeaveGetPayload<{
  select: typeof leaveCalendarSelect;
}>;

interface IRecurrenceFields {
  recurrenceDayOfWeek: number | null;
  recurrenceDayOfMonth: number | null;
  recurrenceMonth: number | null;
  recurrenceDay: number | null;
}

interface IRecurrenceSource {
  recurrenceDayOfWeek: number | null;
  recurrenceDayOfMonth: number | null;
  recurrenceMonth: number | null;
  recurrenceDay: number | null;
}

interface IRecurrenceInput {
  recurrenceDayOfWeek?: number | null;
  recurrenceDayOfMonth?: number | null;
  recurrenceMonth?: number | null;
  recurrenceDay?: number | null;
}

const startOfUtcDay = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addUtcDays = (date: Date, days: number): Date =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days),
  );

const maxDate = (left: Date, right: Date): Date =>
  left.getTime() >= right.getTime() ? left : right;

const minDate = (left: Date, right: Date): Date =>
  left.getTime() <= right.getTime() ? left : right;

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

export class LeaveService {
  private assertDateRange(startDate: Date, endDate: Date | null): void {
    if (endDate && endDate.getTime() < startDate.getTime()) {
      throw new BadRequestError(
        "endDate must be after or equal to startDate",
        "INVALID_DATE_RANGE",
      );
    }
  }

  private assertScope(
    scope: ELeaveScope,
    employeeId: string | null,
    departmentId: string | null,
  ): void {
    if (scope === "EMPLOYEE" && !employeeId) {
      throw new BadRequestError(
        "employeeId is required when scope is EMPLOYEE",
        "LEAVE_EMPLOYEE_REQUIRED",
      );
    }

    if (scope === "DEPARTMENT" && !departmentId) {
      throw new BadRequestError(
        "departmentId is required when scope is DEPARTMENT",
        "LEAVE_DEPARTMENT_REQUIRED",
      );
    }
  }

  private async ensureEmployeeExists(employeeId: string): Promise<void> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
    }
  }

  private async ensureDepartmentExists(departmentId: string): Promise<void> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
    }
  }

  private getRecurrenceFields(
    recurrence: ELeaveRecurrence,
    startDate: Date,
    dto: IRecurrenceInput,
    existing?: IRecurrenceSource | null,
  ): IRecurrenceFields {
    switch (recurrence) {
      case "WEEKLY":
        return {
          recurrenceDayOfWeek:
            dto.recurrenceDayOfWeek ??
            existing?.recurrenceDayOfWeek ??
            startDate.getUTCDay(),
          recurrenceDayOfMonth: null,
          recurrenceMonth: null,
          recurrenceDay: null,
        };
      case "MONTHLY":
        return {
          recurrenceDayOfWeek: null,
          recurrenceDayOfMonth:
            dto.recurrenceDayOfMonth ??
            existing?.recurrenceDayOfMonth ??
            startDate.getUTCDate(),
          recurrenceMonth: null,
          recurrenceDay: null,
        };
      case "YEARLY":
        return {
          recurrenceDayOfWeek: null,
          recurrenceDayOfMonth: null,
          recurrenceMonth:
            dto.recurrenceMonth ??
            existing?.recurrenceMonth ??
            startDate.getUTCMonth() + 1,
          recurrenceDay:
            dto.recurrenceDay ?? existing?.recurrenceDay ?? startDate.getUTCDate(),
        };
      default:
        return {
          recurrenceDayOfWeek: null,
          recurrenceDayOfMonth: null,
          recurrenceMonth: null,
          recurrenceDay: null,
        };
    }
  }

  private expandLeave(
    leave: LeaveCalendarSource,
    from: Date,
    to: Date,
  ): Date[] {
    const dates: Date[] = [];
    const startDate = startOfUtcDay(leave.startDate);
    const endDate = leave.endDate ? startOfUtcDay(leave.endDate) : null;
    const rangeStart = maxDate(startDate, from);
    const rangeEnd = minDate(endDate ?? to, to);

    if (rangeStart.getTime() > rangeEnd.getTime()) {
      return dates;
    }

    switch (leave.recurrence) {
      case "WEEKLY": {
        const dayOfWeek = leave.recurrenceDayOfWeek ?? startDate.getUTCDay();
        const offset = (dayOfWeek - rangeStart.getUTCDay() + 7) % 7;
        let cursor = addUtcDays(rangeStart, offset);

        while (cursor.getTime() <= rangeEnd.getTime()) {
          dates.push(cursor);
          cursor = addUtcDays(cursor, 7);
        }
        break;
      }
      case "MONTHLY": {
        const dayOfMonth = leave.recurrenceDayOfMonth ?? startDate.getUTCDate();
        let cursor = new Date(
          Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), 1),
        );
        const lastMonth = new Date(
          Date.UTC(rangeEnd.getUTCFullYear(), rangeEnd.getUTCMonth(), 1),
        );

        while (cursor.getTime() <= lastMonth.getTime()) {
          const candidate = new Date(
            Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), dayOfMonth),
          );

          if (
            candidate.getUTCMonth() === cursor.getUTCMonth() &&
            candidate.getTime() >= rangeStart.getTime() &&
            candidate.getTime() <= rangeEnd.getTime()
          ) {
            dates.push(candidate);
          }

          cursor = new Date(
            Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1),
          );
        }
        break;
      }
      case "YEARLY": {
        const month = leave.recurrenceMonth ?? startDate.getUTCMonth() + 1;
        const day = leave.recurrenceDay ?? startDate.getUTCDate();

        for (
          let year = rangeStart.getUTCFullYear();
          year <= rangeEnd.getUTCFullYear();
          year += 1
        ) {
          const candidate = new Date(Date.UTC(year, month - 1, day));

          if (
            candidate.getUTCMonth() === month - 1 &&
            candidate.getTime() >= rangeStart.getTime() &&
            candidate.getTime() <= rangeEnd.getTime()
          ) {
            dates.push(candidate);
          }
        }
        break;
      }
      default: {
        for (
          let cursor = rangeStart;
          cursor.getTime() <= rangeEnd.getTime();
          cursor = addUtcDays(cursor, 1)
        ) {
          dates.push(cursor);
        }
      }
    }

    return dates;
  }

  async create(
    dto: ICreateLeaveInput,
    actorUserId: string,
  ): Promise<ILeaveResponse> {
    const startDate = startOfUtcDay(dto.startDate);
    const inputEndDate = dto.endDate ? startOfUtcDay(dto.endDate) : null;
    const scope = dto.scope ?? "ALL";
    const recurrence = dto.recurrence ?? "NONE";

    let employeeId = dto.employeeId ?? null;
    let departmentId = dto.departmentId ?? null;

    if (scope === "ALL") {
      employeeId = null;
      departmentId = null;
    } else if (scope === "EMPLOYEE") {
      this.assertScope(scope, employeeId, departmentId);
      departmentId = null;
      await this.ensureEmployeeExists(employeeId as string);
    } else {
      this.assertScope(scope, employeeId, departmentId);
      employeeId = null;
      await this.ensureDepartmentExists(departmentId as string);
    }

    const endDate = recurrence === "NONE" ? (inputEndDate ?? startDate) : inputEndDate;
    this.assertDateRange(startDate, endDate);

    const recurrenceFields = this.getRecurrenceFields(recurrence, startDate, dto);

    return prisma.leave.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        type: dto.type,
        scope,
        employeeId,
        departmentId,
        startDate,
        endDate,
        isPaid: dto.isPaid ?? true,
        isDeductible: dto.isDeductible ?? false,
        isActive: dto.isActive ?? true,
        recurrence,
        ...recurrenceFields,
        createdById: actorUserId,
      },
      select: leaveSelect,
    }) as Promise<ILeaveResponse>;
  }

  async list(query: IListLeavesQuery) {
    const where: Prisma.LeaveWhereInput = {};
    const and: Prisma.LeaveWhereInput[] = [];

    if (query.type) {
      where.type = query.type;
    }

    if (query.scope) {
      where.scope = query.scope;
    }

    if (query.employeeId) {
      where.employeeId = query.employeeId;
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.recurrence) {
      where.recurrence = query.recurrence;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    if (query.q) {
      and.push({
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { description: { contains: query.q, mode: "insensitive" } },
        ],
      });
    }

    if (query.to) {
      and.push({ startDate: { lte: query.to } });
    }

    if (query.from) {
      and.push({
        OR: [{ endDate: null }, { endDate: { gte: query.from } }],
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "startDate";
    const sortOrder = query.sortOrder ?? "asc";

    const [leaves, total] = await prisma.$transaction([
      prisma.leave.findMany({
        where,
        select: leaveSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.leave.count({ where }),
    ]);

    return toPaginatedResult(
      leaves as ILeaveResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ILeaveResponse> {
    const leave = await prisma.leave.findUnique({
      where: { id },
      select: leaveSelect,
    });

    if (!leave) {
      throw new NotFoundError("Leave not found", "LEAVE_NOT_FOUND");
    }

    return leave as ILeaveResponse;
  }

  async update(id: string, dto: IUpdateLeaveInput): Promise<ILeaveResponse> {
    const existing = await prisma.leave.findUnique({
      where: { id },
      select: leaveExistingSelect,
    });

    if (!existing) {
      throw new NotFoundError("Leave not found", "LEAVE_NOT_FOUND");
    }

    const scope = dto.scope ?? existing.scope;
    let employeeId =
      dto.employeeId !== undefined ? dto.employeeId : existing.employeeId;
    let departmentId =
      dto.departmentId !== undefined ? dto.departmentId : existing.departmentId;

    if (scope === "ALL") {
      employeeId = null;
      departmentId = null;
    } else if (scope === "EMPLOYEE") {
      this.assertScope(scope, employeeId, departmentId);
      departmentId = null;
      await this.ensureEmployeeExists(employeeId as string);
    } else {
      this.assertScope(scope, employeeId, departmentId);
      employeeId = null;
      await this.ensureDepartmentExists(departmentId as string);
    }

    const startDate = dto.startDate
      ? startOfUtcDay(dto.startDate)
      : startOfUtcDay(existing.startDate);
    const inputEndDate =
      dto.endDate !== undefined
        ? dto.endDate
          ? startOfUtcDay(dto.endDate)
          : null
        : existing.endDate
          ? startOfUtcDay(existing.endDate)
          : null;
    const recurrence = dto.recurrence ?? existing.recurrence;
    const endDate = recurrence === "NONE" ? (inputEndDate ?? startDate) : inputEndDate;
    this.assertDateRange(startDate, endDate);

    const recurrenceFields = this.getRecurrenceFields(
      recurrence,
      startDate,
      dto,
      existing,
    );

    return prisma.leave.update({
      where: { id },
      data: {
        name: dto.name !== undefined ? dto.name.trim() : existing.name,
        description:
          dto.description !== undefined
            ? dto.description?.trim() || null
            : existing.description,
        type: dto.type ?? existing.type,
        scope,
        employeeId,
        departmentId,
        startDate,
        endDate,
        isPaid: dto.isPaid ?? existing.isPaid,
        isDeductible: dto.isDeductible ?? existing.isDeductible,
        isActive: dto.isActive ?? existing.isActive,
        recurrence,
        ...recurrenceFields,
      },
      select: leaveSelect,
    }) as Promise<ILeaveResponse>;
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.leave.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundError("Leave not found", "LEAVE_NOT_FOUND");
    }

    await prisma.leave.delete({ where: { id } });
  }

  async getLeaveMapForDate(
    date: Date,
    employees: Array<{ id: string; departmentId: string }>,
  ): Promise<Map<string, ILeaveOccurrenceLeave[]>> {
    const result = new Map<string, Map<string, ILeaveOccurrenceLeave>>();

    if (employees.length === 0) {
      return new Map();
    }

    const day = startOfUtcDay(date);
    const leaves = await prisma.leave.findMany({
      where: {
        isActive: true,
        startDate: { lte: day },
        OR: [{ endDate: null }, { endDate: { gte: day } }],
      },
      select: leaveCalendarSelect,
    });

    if (leaves.length === 0) {
      return new Map();
    }

    const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

    const addLeave = (employeeId: string, leave: ILeaveOccurrenceLeave): void => {
      const employeeLeaves =
        result.get(employeeId) ?? new Map<string, ILeaveOccurrenceLeave>();
      employeeLeaves.set(leave.id, leave);
      result.set(employeeId, employeeLeaves);
    };

    for (const leave of leaves) {
      if (this.expandLeave(leave, day, day).length === 0) {
        continue;
      }

      const occurrence: ILeaveOccurrenceLeave = {
        id: leave.id,
        name: leave.name,
        type: leave.type,
        scope: leave.scope,
        isPaid: leave.isPaid,
        isDeductible: leave.isDeductible,
      };

      if (leave.scope === "ALL") {
        for (const employee of employees) {
          addLeave(employee.id, occurrence);
        }
      } else if (leave.scope === "DEPARTMENT") {
        for (const employee of employees) {
          if (employee.departmentId === leave.departmentId) {
            addLeave(employee.id, occurrence);
          }
        }
      } else if (leave.employeeId && employeesById.has(leave.employeeId)) {
        addLeave(leave.employeeId, occurrence);
      }
    }

    return new Map(
      Array.from(result.entries()).map(([employeeId, leavesById]) => [
        employeeId,
        Array.from(leavesById.values()),
      ]),
    );
  }

  async calendar(query: ILeaveCalendarQuery): Promise<ILeaveCalendarResponse> {
    const from = startOfUtcDay(query.from);
    const to = startOfUtcDay(query.to);

    let employee: { id: string; departmentId: string } | null = null;

    if (query.employeeId) {
      employee = await prisma.employee.findUnique({
        where: { id: query.employeeId },
        select: { id: true, departmentId: true },
      });

      if (!employee) {
        throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
      }
    }

    if (query.departmentId) {
      await this.ensureDepartmentExists(query.departmentId);
    }

    const departmentIds = new Set<string>();
    if (query.departmentId) {
      departmentIds.add(query.departmentId);
    }
    if (employee) {
      departmentIds.add(employee.departmentId);
    }

    const scopeConditions: Prisma.LeaveWhereInput[] = [{ scope: "ALL" }];

    for (const departmentId of departmentIds) {
      scopeConditions.push({ scope: "DEPARTMENT", departmentId });
    }

    if (query.employeeId) {
      scopeConditions.push({ scope: "EMPLOYEE", employeeId: query.employeeId });
    }

    const where: Prisma.LeaveWhereInput = {
      isActive: true,
      startDate: { lte: to },
      AND: [
        { OR: [{ endDate: null }, { endDate: { gte: from } }] },
        { OR: scopeConditions },
      ],
    };

    const leaves = await prisma.leave.findMany({
      where,
      select: leaveCalendarSelect,
      orderBy: { startDate: "asc" },
    });

    const days: ILeaveOccurrence[] = [];

    for (const leave of leaves) {
      for (const date of this.expandLeave(leave, from, to)) {
        days.push({
          date: formatDate(date),
          leave: {
            id: leave.id,
            name: leave.name,
            type: leave.type,
            scope: leave.scope,
            isPaid: leave.isPaid,
            isDeductible: leave.isDeductible,
          },
        });
      }
    }

    days.sort(
      (left, right) =>
        left.date.localeCompare(right.date) ||
        left.leave.name.localeCompare(right.leave.name),
    );

    return {
      from: formatDate(from),
      to: formatDate(to),
      employeeId: query.employeeId ?? null,
      departmentId: query.departmentId ?? employee?.departmentId ?? null,
      totalDays: days.length,
      days,
    };
  }

  async checkDate(query: ILeaveCheckQuery): Promise<ILeaveCheckResponse> {
    const calendar = await this.calendar({
      from: query.date,
      to: query.date,
      employeeId: query.employeeId,
      departmentId: query.departmentId,
    });

    const leaves = calendar.days.map((day) => day.leave);

    return {
      date: formatDate(startOfUtcDay(query.date)),
      isLeaveDay: leaves.length > 0,
      isPaid: leaves.some((leave) => leave.isPaid),
      isDeductible: leaves.some((leave) => leave.isDeductible),
      leaves,
    };
  }
}
