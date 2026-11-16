import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DesignHeader } from "@/components/design/DesignHeader";
import { ThemeRow } from "@/components/design/ThemeRow";
import { FontRow } from "@/components/design/FontRow";
import { TokenRow } from "@/components/design/TokenRow";
import { UiRow } from "@/components/design/UiRow";
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

const DesignPage = async ({ params }: IProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 py-16">
      <DesignHeader locale={locale} />
      <ThemeRow />
      <FontRow />
      <TokenRow />
      <UiRow />
    </main>
  );
};

export default DesignPage;
