import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { SearchSection } from "@/components/ECommerce/Search/SearchSection";
import { SearchSkeleton } from "@/components/Skelton/SearchSkeleton";
import { normalizeSearchQuery } from "@/lib/searchQuery";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ params, searchParams }: IProps) {
  const [{ locale }, rawSearchParams] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const query = normalizeSearchQuery(rawSearchParams);
  const queryKey = `${query.q ?? "empty"}-${query.limit}`;

  return (
    <Suspense key={queryKey} fallback={<SearchSkeleton />}>
      <SearchSection locale={locale} query={query} />
    </Suspense>
  );
}
