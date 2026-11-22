import {
  SEARCH_LIMIT_DEFAULT,
  searchLimitSchema,
  searchTextSchema,
} from "@/validation";

export interface INormalizedSearchQuery {
  q: string | null;
  limit: number;
  isValid: boolean;
}

interface ISearchQueryInput {
  q?: unknown;
  limit?: unknown;
}

const firstString = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
};

export const normalizeSearchQuery = (input: ISearchQueryInput): INormalizedSearchQuery => {
  const parsedQ = searchTextSchema.safeParse(firstString(input.q) ?? "");
  const parsedLimit = searchLimitSchema.safeParse(firstString(input.limit) ?? undefined);

  return {
    q: parsedQ.success ? parsedQ.data : null,
    limit: parsedLimit.success ? parsedLimit.data : SEARCH_LIMIT_DEFAULT,
    isValid: parsedQ.success,
  };
};

export const buildStoreSearchPath = (query: INormalizedSearchQuery): string | null => {
  if (!query.isValid || !query.q) return null;
  const params = new URLSearchParams({ q: query.q, limit: String(query.limit) });
  return `store/search?${params.toString()}`;
};
