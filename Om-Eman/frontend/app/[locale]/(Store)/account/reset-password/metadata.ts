import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";
import { ACCOUNT_RESET_PASSWORD_HREF } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

interface IProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "account" });

  return buildMetadata({
    title: t("resetPassword.title"),
    description: t("metaDescription"),
    path: ACCOUNT_RESET_PASSWORD_HREF,
    locale: safeLocale,
    isNoIndex: true,
  });
}
