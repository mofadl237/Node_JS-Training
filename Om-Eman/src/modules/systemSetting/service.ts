import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateSystemSettingInput,
  ISystemSettingResponse,
  IListSystemSettingQuery,
  IUpdateSystemSettingInput,
} from "./types.js";

const selectSystemSetting = {
  id: true,
  key: true,
  value: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class SystemSettingService {
  async create(dto: ICreateSystemSettingInput): Promise<ISystemSettingResponse> {
    const created = await prisma.systemSetting.create({
      data: dto as Prisma.SystemSettingUncheckedCreateInput,
      select: selectSystemSetting,
    });
    return created as unknown as ISystemSettingResponse;
  }

  async list(query: IListSystemSettingQuery = {} as IListSystemSettingQuery) {
    const where: Prisma.SystemSettingWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { key: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.systemSetting.findMany({
        where,
        select: selectSystemSetting,
        orderBy: { [sortBy]: sortOrder } as Prisma.SystemSettingOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.systemSetting.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ISystemSettingResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ISystemSettingResponse> {
    const item = await prisma.systemSetting.findUnique({
      where: { id },
      select: selectSystemSetting,
    });

    if (!item) {
      throw new NotFoundError("SystemSetting not found", "SYSTEMSETTING_NOT_FOUND");
    }

    return item as unknown as ISystemSettingResponse;
  }

  async update(id: string, dto: IUpdateSystemSettingInput): Promise<ISystemSettingResponse> {
    const updated = await prisma.systemSetting.update({
      where: { id },
      data: dto as Prisma.SystemSettingUncheckedUpdateInput,
      select: selectSystemSetting,
    });
    return updated as unknown as ISystemSettingResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.systemSetting.delete({ where: { id } });
  }
}
