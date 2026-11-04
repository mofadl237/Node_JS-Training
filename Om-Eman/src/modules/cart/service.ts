import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateCartInput,
  ICartResponse,
  IListCartQuery,
  IUpdateCartInput,
} from "./types.js";

const selectCart = {
  id: true,
  customerId: true,
  guestToken: true,
  status: true,
  mergedIntoCartId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class CartService {
  async create(dto: ICreateCartInput): Promise<ICartResponse> {
    const created = await prisma.cart.create({
      data: dto as Prisma.CartUncheckedCreateInput,
      select: selectCart,
    });
    return created as unknown as ICartResponse;
  }

  async list(query: IListCartQuery = {} as IListCartQuery) {
    const where: Prisma.CartWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { guestToken: { contains: query.q, mode: "insensitive" } },
      { mergedIntoCartId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.cart.findMany({
        where,
        select: selectCart,
        orderBy: { [sortBy]: sortOrder } as Prisma.CartOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.cart.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICartResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICartResponse> {
    const item = await prisma.cart.findUnique({
      where: { id },
      select: selectCart,
    });

    if (!item) {
      throw new NotFoundError("Cart not found", "CART_NOT_FOUND");
    }

    return item as unknown as ICartResponse;
  }

  async update(id: string, dto: IUpdateCartInput): Promise<ICartResponse> {
    const updated = await prisma.cart.update({
      where: { id },
      data: dto as Prisma.CartUncheckedUpdateInput,
      select: selectCart,
    });
    return updated as unknown as ICartResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.cart.delete({ where: { id } });
  }
}
