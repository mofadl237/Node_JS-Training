import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateProductPackageInput,
  IProductPackageResponse,
  IListProductPackageQuery,
  IUpdateProductPackageInput,
} from "./types.js";

const selectProductPackage = {
  id: true,
  productId: true,
  sku: true,
  barcode: true,
  nameAr: true,
  nameEn: true,
  sizeValue: true,
  sizeUnit: true,
  sellingPrice: true,
  compareAtPrice: true,
  saleEndsAt: true,
  stockStatus: true,
  isActive: true,
  isPublished: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProductPackageService {
  async create(dto: ICreateProductPackageInput): Promise<IProductPackageResponse> {
    const created = await prisma.productPackage.create({
      data: dto as Prisma.ProductPackageUncheckedCreateInput,
      select: selectProductPackage,
    });
    return created as unknown as IProductPackageResponse;
  }

  async list(query: IListProductPackageQuery = {} as IListProductPackageQuery) {
    const where: Prisma.ProductPackageWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { productId: { contains: query.q, mode: "insensitive" } },
      { sku: { contains: query.q, mode: "insensitive" } },
      { barcode: { contains: query.q, mode: "insensitive" } },
      { nameAr: { contains: query.q, mode: "insensitive" } },
      { nameEn: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.productPackage.findMany({
        where,
        select: selectProductPackage,
        orderBy: { [sortBy]: sortOrder } as Prisma.ProductPackageOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.productPackage.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IProductPackageResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IProductPackageResponse> {
    const item = await prisma.productPackage.findUnique({
      where: { id },
      select: selectProductPackage,
    });

    if (!item) {
      throw new NotFoundError("ProductPackage not found", "PRODUCTPACKAGE_NOT_FOUND");
    }

    return item as unknown as IProductPackageResponse;
  }

  async update(id: string, dto: IUpdateProductPackageInput): Promise<IProductPackageResponse> {
    const updated = await prisma.productPackage.update({
      where: { id },
      data: dto as Prisma.ProductPackageUncheckedUpdateInput,
      select: selectProductPackage,
    });
    return updated as unknown as IProductPackageResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.productPackage.delete({ where: { id } });
  }
}
