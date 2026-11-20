import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { CatalogSection } from "@/components/ECommerce/Catalog/CatalogSection";
import { CatalogSkeleton } from "@/components/Skelton/CatalogSkeleton";
import { normalizeCatalogSearchParams } from "@/lib/catalogQuery";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ params, searchParams }: IProps) {
  const [{ locale }, rawSearchParams] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const query = normalizeCatalogSearchParams(rawSearchParams);
  const queryKey = `${query.category ?? "all"}-${query.subcategory ?? "all"}-${query.sort}-${query.page}`;

  return (
    <Suspense key={queryKey} fallback={<CatalogSkeleton />}>
      <CatalogSection locale={locale} query={query} />
    </Suspense>
  );
}
