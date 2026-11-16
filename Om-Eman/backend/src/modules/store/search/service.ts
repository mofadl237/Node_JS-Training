import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import type { ICustomerAuthRequest } from "../../../middlewares/customer-auth.middleware.js";
import {
  SELECT_FRAGMENT,
  JOIN_FRAGMENT,
  mapListRowToCard,
  type IListRow,
  type IStoreProductCard,
} from "../products/card-reexports.js";

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

export interface IStoreSearchResultRow extends IStoreProductCard {
  matchTier: number;
  score: number;
  matchedTerm: string | null;
}

export interface IStoreSearchResult {
  results: IStoreSearchResultRow[];
  suggestions: IStoreProductCard[];
  searchLogId: string | null;
}

// The search_products() SQL function returns product identity only. This
// enriches the matched ids into full storefront cards (image + price +
// category) with ONE extra query, reusing the exact SQL of the product list so
// search results and catalog cards are always identical. Never N+1.
async function enrichRows(rows: ISearchRow[]): Promise<IStoreSearchResultRow[]> {
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.productId);
  const cardRows = await prisma.$queryRaw<IListRow[]>`
    SELECT ${SELECT_FRAGMENT}
    ${JOIN_FRAGMENT}
    WHERE p."id" IN (${Prisma.join(ids)})
  `;

  const cardsById = new Map(
    cardRows.map((row) => [row.id, mapListRowToCard(row)]),
  );

  return rows.flatMap((row) => {
    const card = cardsById.get(row.productId);
    if (!card) return [];
    return [{ ...card, matchTier: row.matchTier, score: row.score, matchedTerm: row.matchedTerm }];
  });
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

    const results = await enrichRows(rows);

    // Zero-result searches fall back to suggest_similar() so the customer
    // still sees something worth clicking (B13).
    const suggestions =
      results.length > 0 ? [] : await this.suggestSimilar(q);

    const normalized = await prisma.$queryRaw<{ norm: string }[]>`
      SELECT normalize_arabic(${q}) AS norm
    `;
    const normalizedQuery = normalized[0]?.norm ?? q;

    const log = await prisma.searchLog.create({
      data: {
        rawQuery: q,
        normalizedQuery,
        resultCount: results.length,
        customerId: req.customer?.id ?? null,
        sessionId: (req.query.sessionId as string | undefined) ?? null,
      },
      select: { id: true },
    });

    return { results, suggestions, searchLogId: log.id };
  }

  private async suggestSimilar(q: string): Promise<IStoreProductCard[]> {
    const rows = await prisma.$queryRaw<{ productId: string }[]>`
      SELECT "productId" FROM suggest_similar(${q}, 5)
    `;
    const enriched = await enrichRows(
      rows.map((row) => ({
        productId: row.productId,
        nameAr: "",
        nameEn: null,
        slug: "",
        isFeatured: false,
        matchTier: 0,
        score: 0,
        matchedTerm: null,
      })),
    );
    return enriched.map((row) => {
      const { matchTier: _matchTier, score: _score, matchedTerm: _matchedTerm, ...card } = row;
      return card;
    });
  }
}
