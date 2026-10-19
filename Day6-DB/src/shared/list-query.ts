/**
 * Shared list-query helper for every "filter + paginate" endpoint.
 *
 * Why: the users service proved the pattern — build one Prisma `where`, run
 * findMany and count concurrently with Promise.all, then derive pagination
 * metadata. Copy-pasting that into profiles and posts would triple the places
 * a bug (e.g. count using a different where) could hide, so it lives here
 * once. Each module only supplies its own where/orderBy/find function.
 */
import type { ListResult, PaginationMeta } from "../interfaces/shared.interfaces.js";

export interface ListQueryArgs<T> {
  page: number;
  limit: number;
  /** Runs findMany with the SAME where used for count — passed in per module. */
  fetchRows: () => Promise<T[]>;
  /** Runs count with the same where. */
  fetchTotal: () => Promise<number>;
}

export async function runListQuery<T>(args: ListQueryArgs<T>): Promise<ListResult<T>> {
  // Independent reads on the same where → run them concurrently.
  const [rows, total] = await Promise.all([args.fetchRows(), args.fetchTotal()]);

  // totalPages is 0 (not 1) for an empty result set so clients don't render
  // a phantom "page 1 of 1" when there is nothing at all.
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
