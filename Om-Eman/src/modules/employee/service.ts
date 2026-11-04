import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { hashPassword } from "../../utils/password.js";
import type {
  ICreateEmployeeInput,
  IEmployeeResponse,
  IListEmployeeQuery,
  IUpdateEmployeeInput,
} from "./types.js";

const selectEmployee = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  lastLoginAt: true,
  disabledAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class EmployeeService {
  async create(dto: ICreateEmployeeInput): Promise<IEmployeeResponse> {
    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.EmployeeUncheckedCreateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const created = await prisma.employee.create({
      data,
      select: selectEmployee,
    });
    return created as unknown as IEmployeeResponse;
  }

  async list(query: IListEmployeeQuery = {} as IListEmployeeQuery) {
    const where: Prisma.EmployeeWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { fullName: { contains: query.q, mode: "insensitive" } },
      { email: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        select: selectEmployee,
        orderBy: { [sortBy]: sortOrder } as Prisma.EmployeeOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.employee.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IEmployeeResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IEmployeeResponse> {
    const item = await prisma.employee.findUnique({
      where: { id },
      select: selectEmployee,
    });

    if (!item) {
      throw new NotFoundError("Employee not found", "EMPLOYEE_NOT_FOUND");
    }

    return item as unknown as IEmployeeResponse;
  }

  async update(id: string, dto: IUpdateEmployeeInput): Promise<IEmployeeResponse> {
    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.EmployeeUncheckedUpdateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const updated = await prisma.employee.update({
      where: { id },
      data,
      select: selectEmployee,
    });
    return updated as unknown as IEmployeeResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.employee.delete({ where: { id } });
  }
}
