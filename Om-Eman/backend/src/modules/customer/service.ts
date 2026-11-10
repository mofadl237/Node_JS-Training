import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { hashPassword } from "../../utils/password.js";
import type {
  ICreateCustomerInput,
  ICustomerResponse,
  IListCustomerQuery,
  IUpdateCustomerInput,
} from "./types.js";

const selectCustomer = {
  id: true,
  phone: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  isGuest: true,
  emailVerifiedAt: true,
  phoneVerifiedAt: true,
  claimedAt: true,
  lastLoginAt: true,
  mergedIntoCustomerId: true,
  completedOrdersCount: true,
  totalSpent: true,
  firstOrderAt: true,
  lastOrderAt: true,
  marketingConsent: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class CustomerService {
  async create(dto: ICreateCustomerInput): Promise<ICustomerResponse> {
    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.CustomerUncheckedCreateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const created = await prisma.customer.create({
      data,
      select: selectCustomer,
    });
    return created as unknown as ICustomerResponse;
  }

  async list(query: IListCustomerQuery = {} as IListCustomerQuery) {
    const where: Prisma.CustomerWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
      { email: { contains: query.q, mode: "insensitive" } },
      { firstName: { contains: query.q, mode: "insensitive" } },
      { lastName: { contains: query.q, mode: "insensitive" } },
      { mergedIntoCustomerId: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        select: selectCustomer,
        orderBy: { [sortBy]: sortOrder } as Prisma.CustomerOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.customer.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICustomerResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICustomerResponse> {
    const item = await prisma.customer.findUnique({
      where: { id },
      select: selectCustomer,
    });

    if (!item) {
      throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
    }

    return item as unknown as ICustomerResponse;
  }

  async update(id: string, dto: IUpdateCustomerInput): Promise<ICustomerResponse> {
    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.CustomerUncheckedUpdateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const updated = await prisma.customer.update({
      where: { id },
      data,
      select: selectCustomer,
    });
    return updated as unknown as ICustomerResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.customer.delete({ where: { id } });
  }
}
