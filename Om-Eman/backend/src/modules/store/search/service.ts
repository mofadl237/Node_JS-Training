import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";

interface ISearchRow {
  productId: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  isFeatured: boolean;
  matchTier: number;
  score: number;
  matchedTerm: string | null;
}

export interface IStoreSearchResult {
  results: ISearchRow[];
  searchLogId: string | null;
}

// Uses the four-tier search_products() SQL function from
// prisma/mvp/manual_constraints.sql. Every public search is logged to
// SearchLog so the owner can mine "what customers look for and do not find".
export class StoreSearchService {
  async search(
    q: string,
    limit: number,
    req: ICustomerAuthRequest,
  ): Promise<IStoreSearchResult> {
    const rows = await prisma.$queryRaw<ISearchRow[]>`
      SELECT * FROM search_products(${q}, ${limit}::integer)
    `;

    const normalized = await prisma.$queryRaw<{ norm: string }[]>`
      SELECT normalize_arabic(${q}) AS norm
    `;
    const normalizedQuery = normalized[0]?.norm ?? q;

    const log = await prisma.searchLog.create({
      data: {
        rawQuery: q,
        normalizedQuery,
        resultCount: rows.length,
        customerId: req.customer?.id ?? null,
        sessionId: (req.query.sessionId as string | undefined) ?? null,
      },
      select: { id: true },
    });

    return { results: rows, searchLogId: log.id };
  }
}

export type { Prisma };
