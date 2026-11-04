import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateSubcategoryInput,
  ISubcategoryResponse,
  IListSubcategoryQuery,
  IUpdateSubcategoryInput,
} from "./types.js";

const selectSubcategory = {
  id: true,
  categoryId: true,
  nameAr: true,
  nameEn: true,
  slug: true,
  descriptionAr: true,
  descriptionEn: true,
  imageUrl: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class SubcategoryService {
  async create(dto: ICreateSubcategoryInput): Promise<ISubcategoryResponse> {
    const created = await prisma.subcategory.create({
      data: dto as Prisma.SubcategoryUncheckedCreateInput,
      select: selectSubcategory,
    });
    return created as unknown as ISubcategoryResponse;
  }

  async list(query: IListSubcategoryQuery = {} as IListSubcategoryQuery) {
    const where: Prisma.SubcategoryWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { categoryId: { contains: query.q, mode: "insensitive" } },
      { nameAr: { contains: query.q, mode: "insensitive" } },
      { nameEn: { contains: query.q, mode: "insensitive" } },
      { slug: { contains: query.q, mode: "insensitive" } },
      { descriptionAr: { contains: query.q, mode: "insensitive" } },
      { descriptionEn: { contains: query.q, mode: "insensitive" } },
      { imageUrl: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.subcategory.findMany({
        where,
        select: selectSubcategory,
        orderBy: { [sortBy]: sortOrder } as Prisma.SubcategoryOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.subcategory.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ISubcategoryResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ISubcategoryResponse> {
    const item = await prisma.subcategory.findUnique({
      where: { id },
      select: selectSubcategory,
    });

    if (!item) {
      throw new NotFoundError("Subcategory not found", "SUBCATEGORY_NOT_FOUND");
    }

    return item as unknown as ISubcategoryResponse;
  }

  async update(id: string, dto: IUpdateSubcategoryInput): Promise<ISubcategoryResponse> {
    const updated = await prisma.subcategory.update({
      where: { id },
      data: dto as Prisma.SubcategoryUncheckedUpdateInput,
      select: selectSubcategory,
    });
    return updated as unknown as ISubcategoryResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.subcategory.delete({ where: { id } });
  }
}
