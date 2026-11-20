import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";
import type { INormalizedCatalogQuery } from "@/lib/catalogQuery";
import type { IPaginationMeta } from "@/interface";

interface IProps {
  query: INormalizedCatalogQuery;
  meta: IPaginationMeta;
}

const pageHref = (query: INormalizedCatalogQuery, page: number) => {
  const q: Record<string, string | number> = { sort: query.sort, page };
  if (query.category) q.category = query.category;
  if (query.subcategory) q.subcategory = query.subcategory;
  return { pathname: "/products" as const, query: q };
};

export const CatalogPagination = async ({ query, meta }: IProps) => {
  const t = await getTranslations("catalog");
  if (meta.totalPages <= 1) return null;

  const base = buttonVariants({ variant: "soft", size: "sm" });
  return (
    <nav className="flex items-center justify-between gap-4 pt-4" aria-label={t("title")}>
      {meta.hasPreviousPage ? (
        <Link href={pageHref(query, meta.page - 1)} className={base}>
          <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          {t("previousPage")}
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-ink-soft">{t("pageLabel", { page: meta.page, total: meta.totalPages })}</p>
      {meta.hasNextPage ? (
        <Link href={pageHref(query, meta.page + 1)} className={base}>
          {t("nextPage")}
          <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};
