import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import { CART_HREF } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

interface IProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;

  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: CART_HREF,
    locale: safeLocale,
  });
}
