import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqSection } from "@/components/ECommerce/FAQ/FaqSection";
import { StoreBreadcrumb } from "@/components/shared/StoreBreadcrumb";
import { FAQ_HREF } from "@/lib/routes";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <StoreBreadcrumb
        locale={locale}
        ariaLabel={t("breadcrumb")}
        items={[
          { name: t("home"), path: "" },
          { name: t("breadcrumb"), path: FAQ_HREF },
        ]}
      />
      <FaqSection />
    </div>
  );
}
