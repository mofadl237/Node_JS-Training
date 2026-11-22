import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL } from "@/lib/config";
import { SEARCH_PATH } from "@/lib/routes";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/jsonld";
import { getStoreSettings } from "@/lib/server/storeQueries";

export const StoreJsonLd = async () => {
  // 1- state
  const [locale, t, settingsResult] = await Promise.all([
    getLocale(),
    getTranslations("brand"),
    getStoreSettings(),
  ]);
  const name = t("name");
  const settings = settingsResult.ok ? settingsResult.data : null;

  // 3- render
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd({ siteUrl: SITE_URL, locale, name, settings })} />
      <JsonLd data={buildWebSiteJsonLd({ siteUrl: SITE_URL, locale, name, searchPath: SEARCH_PATH })} />
    </>
  );
};
