import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateCustomerAddressInput,
  ICustomerAddressResponse,
  IListCustomerAddressQuery,
  IUpdateCustomerAddressInput,
} from "./types.js";

const selectCustomerAddress = {
  id: true,
  customerId: true,
  label: true,
  governorate: true,
  city: true,
  district: true,
  street: true,
  building: true,
  floor: true,
  landmark: true,
  latitude: true,
  longitude: true,
  isDefault: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class CustomerAddressService {
  async create(dto: ICreateCustomerAddressInput): Promise<ICustomerAddressResponse> {
    const created = await prisma.customerAddress.create({
      data: dto as Prisma.CustomerAddressUncheckedCreateInput,
      select: selectCustomerAddress,
    });
    return created as unknown as ICustomerAddressResponse;
  }

  async list(query: IListCustomerAddressQuery = {} as IListCustomerAddressQuery) {
    const where: Prisma.CustomerAddressWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { customerId: { contains: query.q, mode: "insensitive" } },
      { label: { contains: query.q, mode: "insensitive" } },
      { governorate: { contains: query.q, mode: "insensitive" } },
      { city: { contains: query.q, mode: "insensitive" } },
      { district: { contains: query.q, mode: "insensitive" } },
      { street: { contains: query.q, mode: "insensitive" } },
      { building: { contains: query.q, mode: "insensitive" } },
      { floor: { contains: query.q, mode: "insensitive" } },
      { landmark: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.customerAddress.findMany({
        where,
        select: selectCustomerAddress,
        orderBy: { [sortBy]: sortOrder } as Prisma.CustomerAddressOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.customerAddress.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as ICustomerAddressResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<ICustomerAddressResponse> {
    const item = await prisma.customerAddress.findUnique({
      where: { id },
      select: selectCustomerAddress,
    });

    if (!item) {
      throw new NotFoundError("CustomerAddress not found", "CUSTOMERADDRESS_NOT_FOUND");
    }

    return item as unknown as ICustomerAddressResponse;
  }

  async update(id: string, dto: IUpdateCustomerAddressInput): Promise<ICustomerAddressResponse> {
    const updated = await prisma.customerAddress.update({
      where: { id },
      data: dto as Prisma.CustomerAddressUncheckedUpdateInput,
      select: selectCustomerAddress,
    });
    return updated as unknown as ICustomerAddressResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.customerAddress.delete({ where: { id } });
  }
}
