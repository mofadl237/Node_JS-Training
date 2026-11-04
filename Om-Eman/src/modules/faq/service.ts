import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import type {
  ICreateFaqInput,
  IFaqResponse,
  IListFaqQuery,
  IUpdateFaqInput,
} from "./types.js";

const selectFaq = {
  id: true,
  questionAr: true,
  questionEn: true,
  answerAr: true,
  answerEn: true,
  category: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class FaqService {
  async create(dto: ICreateFaqInput): Promise<IFaqResponse> {
    const created = await prisma.faq.create({
      data: dto as Prisma.FaqUncheckedCreateInput,
      select: selectFaq,
    });
    return created as unknown as IFaqResponse;
  }

  async list(query: IListFaqQuery = {} as IListFaqQuery) {
    const where: Prisma.FaqWhereInput = {};
    if (query.q) {
      where.OR = [
      { id: { contains: query.q, mode: "insensitive" } },
      { questionAr: { contains: query.q, mode: "insensitive" } },
      { questionEn: { contains: query.q, mode: "insensitive" } },
      { answerAr: { contains: query.q, mode: "insensitive" } },
      { answerEn: { contains: query.q, mode: "insensitive" } },
      { category: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [items, total] = await prisma.$transaction([
      prisma.faq.findMany({
        where,
        select: selectFaq,
        orderBy: { [sortBy]: sortOrder } as Prisma.FaqOrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.faq.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as IFaqResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IFaqResponse> {
    const item = await prisma.faq.findUnique({
      where: { id },
      select: selectFaq,
    });

    if (!item) {
      throw new NotFoundError("Faq not found", "FAQ_NOT_FOUND");
    }

    return item as unknown as IFaqResponse;
  }

  async update(id: string, dto: IUpdateFaqInput): Promise<IFaqResponse> {
    const updated = await prisma.faq.update({
      where: { id },
      data: dto as Prisma.FaqUncheckedUpdateInput,
      select: selectFaq,
    });
    return updated as unknown as IFaqResponse;
  }

  async remove(id: string): Promise<void> {
    await prisma.faq.delete({ where: { id } });
  }
}
