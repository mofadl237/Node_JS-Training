import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type { IDepartmentResponse, ICreateDepartmentInput, IUpdateDepartmentInput } from "./type.js";
import type { IListDepartmentsQuery } from "./validation.js";

const departmentSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class DepartmentService {
  async create(dto: ICreateDepartmentInput): Promise<IDepartmentResponse> {
    const name = dto.name.trim();

    const existingDepartment = await prisma.department.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingDepartment) {
      throw new ConflictError(
        "Department with this name already exists",
        "DEPARTMENT_EXISTS",
      );
    }

    return prisma.department.create({
      data: {
        name,
        description: dto.description?.trim() || null,
      },
      select: departmentSelect,
    });
  }

  async list(query: IListDepartmentsQuery) {
    const where: Prisma.DepartmentWhereInput = {};

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "name";
    const sortOrder = query.sortOrder ?? "asc";

    const [departments, total] = await prisma.$transaction([
      prisma.department.findMany({
        where,
        select: departmentSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.department.count({ where }),
    ]);

    return toPaginatedResult(
      departments as IDepartmentResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IDepartmentResponse> {
    const department = await prisma.department.findUnique({
      where: { id },
      select: departmentSelect,
    });

    if (!department) {
      throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
    }

    return department;
  }

  async update(id: string, dto: IUpdateDepartmentInput): Promise<IDepartmentResponse> {
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingDepartment) {
      throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
    }

    if (dto.name !== undefined) {
      const conflict = await prisma.department.findFirst({
        where: {
          id: { not: id },
          name: { equals: dto.name.trim(), mode: "insensitive" },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new ConflictError(
          "Department with this name already exists",
          "DEPARTMENT_EXISTS",
        );
      }
    }

    return prisma.department.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description?.trim() || null }
          : {}),
      },
      select: departmentSelect,
    });
  }

  async remove(id: string): Promise<void> {
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingDepartment) {
      throw new NotFoundError("Department not found", "DEPARTMENT_NOT_FOUND");
    }

    const employeesCount = await prisma.employee.count({
      where: { departmentId: id },
    });

    if (employeesCount > 0) {
      throw new ConflictError(
        "Department has employees and cannot be deleted",
        "DEPARTMENT_HAS_EMPLOYEES",
      );
    }

    await prisma.department.delete({ where: { id } });
  }
}
