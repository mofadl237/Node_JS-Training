import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateDocumentSequenceInput,
  IDocumentSequenceResponse,
  IListDocumentSequenceQuery,
  IUpdateDocumentSequenceInput,
} from "./types.js";

const selectDocumentSequence = {
  id: true,
  documentType: true,
  year: true,
  prefix: true,
  nextNumber: true,
  padding: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class DocumentSequenceService {
  async create(dto: ICreateDocumentSequenceInput): Promise<IDocumentSequenceResponse> {
    const created = await prisma.documentSequence.create({
      data: dto as Prisma.DocumentSequenceUncheckedCreateInput,
      select: selectDocumentSequence,
    });
    return created as unknown as IDocumentSequenceResponse;
  }

  async list(query: IListDocumentSequenceQuery = {} as IListDocumentSequenceQuery) {
    const where: Prisma.DocumentSequenceWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { documentType: { contains: query.q, mode: "insensitive" } },
      { prefix: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.documentSequence.findMany({
        where,
        select: selectDocumentSequence,
        orderBy: { [sortBy]: sortOrder } as Prisma.DocumentSequenceOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.documentSequence.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IDocumentSequenceResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IDocumentSequenceResponse> {
    const item = await prisma.documentSequence.findUnique({
      where: { id },
      select: selectDocumentSequence,
    });

    if (!item) {
      throw new NotFoundError("DocumentSequence not found", "DOCUMENTSEQUENCE_NOT_FOUND");
    }

    return item as unknown as IDocumentSequenceResponse;
  }

  async update(id: string, dto: IUpdateDocumentSequenceInput): Promise<IDocumentSequenceResponse> {
    const updated = await prisma.documentSequence.update({
      where: { id },
      data: dto as Prisma.DocumentSequenceUncheckedUpdateInput,
      select: selectDocumentSequence,
    });
    return updated as unknown as IDocumentSequenceResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.documentSequence.delete({ where: { id } });
  }
}
