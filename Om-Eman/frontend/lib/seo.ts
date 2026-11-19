import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import type { TLocale } from "@/lib/locale";

export const BRAND_NAME = "Om Eman";

interface IBuildMetadataProps {
  title: string;
  description: string;
  path?: string;
  locale: TLocale;
  isNoIndex?: boolean;
}

const OTHER_LOCALE: Record<TLocale, TLocale> = { ar: "en", en: "ar" };
const OG_LOCALE: Record<TLocale, string> = { ar: "ar_EG", en: "en_US" };
const DEFAULT_LOCALE: TLocale = "ar";

export const buildMetadata = ({
  title,
  description,
  path = "",
  locale,
  isNoIndex = false,
}: IBuildMetadataProps): Metadata => {
  const canonicalPath = `/${locale}${path}`;
  const otherLocale = OTHER_LOCALE[locale];
  const arabicUrl = `${SITE_URL}/ar${path}`;
  const defaultUrl = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

  return {
    title,
    description,
    robots: isNoIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: {
        [locale]: `${SITE_URL}${canonicalPath}`,
        [otherLocale]: `${SITE_URL}/${otherLocale}${path}`,
        "ar-EG": arabicUrl,
        "x-default": defaultUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: BRAND_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[otherLocale]],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
};
