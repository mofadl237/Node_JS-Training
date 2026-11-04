import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateProductBundleComponentInput,
  IProductBundleComponentResponse,
  IListProductBundleComponentQuery,
  IUpdateProductBundleComponentInput,
} from "./types.js";

const selectProductBundleComponent = {
  id: true,
  bundleProductId: true,
  componentPackageId: true,
  quantity: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ProductBundleComponentService {
  async create(dto: ICreateProductBundleComponentInput): Promise<IProductBundleComponentResponse> {
    const created = await prisma.productBundleComponent.create({
      data: dto as Prisma.ProductBundleComponentUncheckedCreateInput,
      select: selectProductBundleComponent,
    });
    return created as unknown as IProductBundleComponentResponse;
  }

  async list(query: IListProductBundleComponentQuery = {} as IListProductBundleComponentQuery) {
    const where: Prisma.ProductBundleComponentWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { bundleProductId: { contains: query.q, mode: "insensitive" } },
      { componentPackageId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.productBundleComponent.findMany({
        where,
        select: selectProductBundleComponent,
        orderBy: { [sortBy]: sortOrder } as Prisma.ProductBundleComponentOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.productBundleComponent.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IProductBundleComponentResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IProductBundleComponentResponse> {
    const item = await prisma.productBundleComponent.findUnique({
      where: { id },
      select: selectProductBundleComponent,
    });

    if (!item) {
      throw new NotFoundError("ProductBundleComponent not found", "PRODUCTBUNDLECOMPONENT_NOT_FOUND");
    }

    return item as unknown as IProductBundleComponentResponse;
  }

  async update(id: string, dto: IUpdateProductBundleComponentInput): Promise<IProductBundleComponentResponse> {
    const updated = await prisma.productBundleComponent.update({
      where: { id },
      data: dto as Prisma.ProductBundleComponentUncheckedUpdateInput,
      select: selectProductBundleComponent,
    });
    return updated as unknown as IProductBundleComponentResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.productBundleComponent.delete({ where: { id } });
  }
}
