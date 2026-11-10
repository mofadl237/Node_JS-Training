import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreatePaymentInput,
  IPaymentResponse,
  IListPaymentQuery,
  IUpdatePaymentInput,
} from "./types.js";

const selectPayment = {
  id: true,
  orderId: true,
  method: true,
  status: true,
  amount: true,
  proofImageUrl: true,
  proofUploadedAt: true,
  confirmedAt: true,
  confirmedByEmployeeId: true,
  rejectionReason: true,
  transactionReference: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class PaymentService {
  async create(dto: ICreatePaymentInput): Promise<IPaymentResponse> {
    const created = await prisma.payment.create({
      data: dto as Prisma.PaymentUncheckedCreateInput,
      select: selectPayment,
    });
    return created as unknown as IPaymentResponse;
  }

  async list(query: IListPaymentQuery = {} as IListPaymentQuery) {
    const where: Prisma.PaymentWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { proofImageUrl: { contains: query.q, mode: "insensitive" } },
      { confirmedByEmployeeId: { contains: query.q, mode: "insensitive" } },
      { rejectionReason: { contains: query.q, mode: "insensitive" } },
      { transactionReference: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where,
        select: selectPayment,
        orderBy: { [sortBy]: sortOrder } as Prisma.PaymentOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.payment.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IPaymentResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IPaymentResponse> {
    const item = await prisma.payment.findUnique({
      where: { id },
      select: selectPayment,
    });

    if (!item) {
      throw new NotFoundError("Payment not found", "PAYMENT_NOT_FOUND");
    }

    return item as unknown as IPaymentResponse;
  }

  async update(id: string, dto: IUpdatePaymentInput): Promise<IPaymentResponse> {
    const updated = await prisma.payment.update({
      where: { id },
      data: dto as Prisma.PaymentUncheckedUpdateInput,
      select: selectPayment,
    });
    return updated as unknown as IPaymentResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.payment.delete({ where: { id } });
  }
}
