import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateInvoiceInput,
  IInvoiceResponse,
  IListInvoiceQuery,
  IUpdateInvoiceInput,
} from "./types.js";

const selectInvoice = {
  id: true,
  invoiceNumber: true,
  orderId: true,
  status: true,
  issuedAt: true,
  issuedByEmployeeId: true,
  sellerName: true,
  sellerTaxNumber: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  addressSnapshot: true,
  subtotal: true,
  discountTotal: true,
  shippingTotal: true,
  taxTotal: true,
  grandTotal: true,
  taxRateSnapshot: true,
  taxAmount: true,
  notes: true,
  voidedAt: true,
  voidReason: true,
  pdfUrl: true,
  pdfGeneratedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class InvoiceService {
  async create(dto: ICreateInvoiceInput): Promise<IInvoiceResponse> {
    const created = await prisma.invoice.create({
      data: dto as Prisma.InvoiceUncheckedCreateInput,
      select: selectInvoice,
    });
    return created as unknown as IInvoiceResponse;
  }

  async list(query: IListInvoiceQuery = {} as IListInvoiceQuery) {
    const where: Prisma.InvoiceWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { invoiceNumber: { contains: query.q, mode: "insensitive" } },
      { orderId: { contains: query.q, mode: "insensitive" } },
      { issuedByEmployeeId: { contains: query.q, mode: "insensitive" } },
      { sellerName: { contains: query.q, mode: "insensitive" } },
      { sellerTaxNumber: { contains: query.q, mode: "insensitive" } },
      { customerName: { contains: query.q, mode: "insensitive" } },
      { customerPhone: { contains: query.q, mode: "insensitive" } },
      { customerEmail: { contains: query.q, mode: "insensitive" } },
      { notes: { contains: query.q, mode: "insensitive" } },
      { voidReason: { contains: query.q, mode: "insensitive" } },
      { pdfUrl: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        select: selectInvoice,
        orderBy: { [sortBy]: sortOrder } as Prisma.InvoiceOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.invoice.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IInvoiceResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IInvoiceResponse> {
    const item = await prisma.invoice.findUnique({
      where: { id },
      select: selectInvoice,
    });

    if (!item) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    return item as unknown as IInvoiceResponse;
  }

  async update(id: string, dto: IUpdateInvoiceInput): Promise<IInvoiceResponse> {
    const updated = await prisma.invoice.update({
      where: { id },
      data: dto as Prisma.InvoiceUncheckedUpdateInput,
      select: selectInvoice,
    });
    return updated as unknown as IInvoiceResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.invoice.delete({ where: { id } });
  }
}
