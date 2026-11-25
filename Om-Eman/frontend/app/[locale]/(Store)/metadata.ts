import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HOME_OG_ASSET } from "@/lib/brandAssets";
import { SITE_URL } from "@/lib/config";
import { isLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";

interface IProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "home" });

  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "",
    locale: safeLocale,
    ogImage: {
      ...HOME_OG_ASSET,
      url: `${SITE_URL}${HOME_OG_ASSET.url}`,
      alt: t("ogImageAlt"),
    },
  });
}
