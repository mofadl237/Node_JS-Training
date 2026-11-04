import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateCategoryInput,
  ICategoryResponse,
  IListCategoryQuery,
  IUpdateCategoryInput,
} from "./types.js";

const selectCategory = {
  id: true,
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

export class CategoryService {
  async create(dto: ICreateCategoryInput): Promise<ICategoryResponse> {
    const created = await prisma.category.create({
      data: dto as Prisma.CategoryUncheckedCreateInput,
      select: selectCategory,
    });
    return created as unknown as ICategoryResponse;
  }

  async list(query: IListCategoryQuery = {} as IListCategoryQuery) {
    const where: Prisma.CategoryWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
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
      prisma.category.findMany({
        where,
        select: selectCategory,
        orderBy: { [sortBy]: sortOrder } as Prisma.CategoryOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.category.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICategoryResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICategoryResponse> {
    const item = await prisma.category.findUnique({
      where: { id },
      select: selectCategory,
    });

    if (!item) {
      throw new NotFoundError("Category not found", "CATEGORY_NOT_FOUND");
    }

    return item as unknown as ICategoryResponse;
  }

  async update(id: string, dto: IUpdateCategoryInput): Promise<ICategoryResponse> {
    const updated = await prisma.category.update({
      where: { id },
      data: dto as Prisma.CategoryUncheckedUpdateInput,
      select: selectCategory,
    });
    return updated as unknown as ICategoryResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
