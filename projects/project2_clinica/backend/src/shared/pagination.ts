export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResult<T> {
  items: T[];
  meta: IPaginationMeta;
}

export function resolvePagination(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)));
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

export function buildPaginationMeta(total: number, page: number, limit: number): IPaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
}

export function toPaginatedResult<T>(items: T[], total: number, page: number, limit: number): IPaginatedResult<T> {
  return { items, meta: buildPaginationMeta(total, page, limit) };
}
