import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  ICreateInvoiceLineInput,
  IInvoiceLineResponse,
  IListInvoiceLineQuery,
  IUpdateInvoiceLineInput,
} from "./types.js";

const selectInvoiceLine = {
  id: true,
  invoiceId: true,
  orderItemId: true,
  productPackageId: true,
  descriptionAr: true,
  descriptionEn: true,
  sku: true,
  quantity: true,
  unitPrice: true,
  discountAmount: true,
  taxRate: true,
  taxAmount: true,
  lineTotal: true,
  createdAt: true,
} as const;

export class InvoiceLineService {
  async create(dto: ICreateInvoiceLineInput): Promise<IInvoiceLineResponse> {
    const created = await prisma.invoiceLine.create({
      data: dto as Prisma.InvoiceLineUncheckedCreateInput,
      select: selectInvoiceLine,
    });
    return created as unknown as IInvoiceLineResponse;
  }

  async list(query: IListInvoiceLineQuery = {} as IListInvoiceLineQuery) {
    const where: Prisma.InvoiceLineWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { invoiceId: { contains: query.q, mode: "insensitive" } },
      { orderItemId: { contains: query.q, mode: "insensitive" } },
      { productPackageId: { contains: query.q, mode: "insensitive" } },
      { descriptionAr: { contains: query.q, mode: "insensitive" } },
      { descriptionEn: { contains: query.q, mode: "insensitive" } },
      { sku: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.invoiceLine.findMany({
        where,
        select: selectInvoiceLine,
        orderBy: { [sortBy]: sortOrder } as Prisma.InvoiceLineOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.invoiceLine.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IInvoiceLineResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IInvoiceLineResponse> {
    const item = await prisma.invoiceLine.findUnique({
      where: { id },
      select: selectInvoiceLine,
    });

    if (!item) {
      throw new NotFoundError("InvoiceLine not found", "INVOICELINE_NOT_FOUND");
    }

    return item as unknown as IInvoiceLineResponse;
  }

  async update(id: string, dto: IUpdateInvoiceLineInput): Promise<IInvoiceLineResponse> {
    throw new BadRequestError("InvoiceLine is append-only", "APPEND_ONLY");
  }

  async remove(id: string): Promise<void> {
    throw new BadRequestError("InvoiceLine is append-only", "APPEND_ONLY");
  }
}
