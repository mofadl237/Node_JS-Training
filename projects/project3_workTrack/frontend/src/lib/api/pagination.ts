import type { IPaginationMeta } from "./types";

export const buildFallbackMeta = (total: number): IPaginationMeta => ({
  page: 1,
  limit: total,
  total,
  totalPages: total > 0 ? 1 : 0,
  hasNextPage: false,
  hasPreviousPage: false,
});
