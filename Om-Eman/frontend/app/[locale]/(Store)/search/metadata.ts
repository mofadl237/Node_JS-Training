import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import { normalizeSearchQuery } from "@/lib/searchQuery";
import { SEARCH_PATH } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { SEARCH_LIMIT_DEFAULT } from "@/validation";

interface IProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: IProps): Promise<Metadata> {
  const [{ locale }, rawSearchParams] = await Promise.all([params, searchParams]);
  const query = normalizeSearchQuery(rawSearchParams);
  const t = await getTranslations({ locale, namespace: "search" });
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const queryParams = new URLSearchParams();
  if (query.q) queryParams.set("q", query.q);
  if (query.limit !== SEARCH_LIMIT_DEFAULT) queryParams.set("limit", String(query.limit));
  const queryString = queryParams.toString();
  const path = queryString ? `${SEARCH_PATH}?${queryString}` : SEARCH_PATH;

  return buildMetadata({
    title: query.q ? t("metaTitle", { query: query.q }) : t("title"),
    description: query.q ? t("metaDescription", { query: query.q }) : t("description"),
    path,
    locale: safeLocale,
    isNoIndex: true,
  });
}
