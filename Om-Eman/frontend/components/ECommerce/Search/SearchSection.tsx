import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { INormalizedSearchQuery } from "@/lib/searchQuery";
import { getStoreSearch } from "@/lib/server/storeQueries";
import { SearchResults } from "./SearchResults";
import { SearchState } from "./SearchState";

interface IProps {
  locale: string;
  query: INormalizedSearchQuery;
}

export const SearchSection = async ({ locale, query }: IProps) => {
  const t = await getTranslations("search");
  let content: ReactNode = null;
  let summary: string | null = null;

  if (!query.isValid || !query.q) {
    content = <SearchState kind="error" title={t("invalidTitle")} body={t("invalidBody")} />;
  } else {
    const result = await getStoreSearch(query.q, query.limit);
    if (!result.ok) {
      content = <SearchState kind="error" title={t("errorTitle")} body={t("errorBody")} />;
    } else {
      const { results, suggestions } = result.data;
      summary = t("resultCount", { count: results.length });
      if (results.length > 0) {
        content = <SearchResults products={results} locale={locale} />;
      } else if (suggestions.length > 0) {
        content = (
          <div className="space-y-8">
            <SearchState kind="empty" title={t("emptyTitle")} body={t("emptyBody")} />
            <SearchResults products={suggestions} locale={locale} heading={t("suggestionsTitle")} />
          </div>
        );
      } else {
        content = <SearchState kind="empty" title={t("emptyTitle")} body={t("emptyBody")} />;
      }
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">
          {query.q ? t("queryTitle", { query: query.q }) : t("title")}
        </h1>
        {summary ? <p className="text-sm text-ink-soft">{summary}</p> : null}
      </header>
      {content}
    </section>
  );
};
