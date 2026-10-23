/**
 * Shared list-query helper for every "filter + paginate" endpoint.
 * Runs findMany and count concurrently with the SAME where clause, then builds
 * the pagination envelope once so every module reports it identically.
 */
import type { ListResult, PaginationMeta } from "../interfaces/shared.interfaces.js";

export interface ListQueryArgs<T> {
  page: number;
  limit: number;
  fetchRows: () => Promise<T[]>;
  fetchTotal: () => Promise<number>;
}

export async function runListQuery<T>(args: ListQueryArgs<T>): Promise<ListResult<T>> {
  const [rows, total] = await Promise.all([args.fetchRows(), args.fetchTotal()]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / args.limit);

  const pagination: PaginationMeta = {
    page: args.page,
    limit: args.limit,
    total,
    totalPages,
    hasNextPage: args.page < totalPages,
    hasPreviousPage: args.page > 1,
  };

  return { data: rows, pagination };
}
