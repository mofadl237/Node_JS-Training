const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type TCatalogSort = "newest" | "price_asc" | "price_desc" | "name";

const SORTS: readonly TCatalogSort[] = ["newest", "price_asc", "price_desc", "name"];

export interface INormalizedCatalogQuery {
  category?: string;
  subcategory?: string;
  sort: TCatalogSort;
  page: number;
}

type TSearchParam = string | string[] | undefined;

const pickSingle = (value: TSearchParam): string | undefined =>
  typeof value === "string" ? value : undefined;

const pickSlug = (value: TSearchParam): string | undefined => {
  const slug = pickSingle(value)?.trim();
  if (!slug || slug.length > 200 || !SLUG_PATTERN.test(slug)) return undefined;
  return slug;
};

const pickSort = (value: TSearchParam): TCatalogSort => {
  const sort = pickSingle(value);
  return sort && (SORTS as readonly string[]).includes(sort)
    ? (sort as TCatalogSort)
    : "newest";
};

const pickPage = (value: TSearchParam): number => {
  const raw = pickSingle(value);
  if (!raw || !/^\d+$/.test(raw)) return 1;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const normalizeCatalogSearchParams = (
  searchParams: Record<string, TSearchParam>,
): INormalizedCatalogQuery => ({
  category: pickSlug(searchParams.category),
  subcategory: pickSlug(searchParams.subcategory),
  sort: pickSort(searchParams.sort),
  page: pickPage(searchParams.page),
});

export const buildCatalogProductsPath = (query: INormalizedCatalogQuery): string => {
  const params = new URLSearchParams({
    sort: query.sort,
    page: String(query.page),
    limit: "12",
  });
  if (query.category) params.set("category", query.category);
  if (query.subcategory) params.set("subcategory", query.subcategory);
  return `store/products?${params.toString()}`;
};
