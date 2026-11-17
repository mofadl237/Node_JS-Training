import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/locale";
import { routing } from "@/i18n/routing";

interface IProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "design" });
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/design",
    locale: safeLocale,
    isNoIndex: true,
  });
}
