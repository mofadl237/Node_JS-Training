import { getTranslations, setRequestLocale } from "next-intl/server";
import { WishlistEmptyState } from "@/components/ECommerce/Wishlist/WishlistEmptyState";
import { StoreBreadcrumb } from "@/components/shared/StoreBreadcrumb";
import { WISHLIST_HREF } from "@/lib/routes";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function WishlistPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wishlist");
  const items = [
    { name: t("home"), path: "" },
    { name: t("breadcrumb"), path: WISHLIST_HREF },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <StoreBreadcrumb locale={locale} ariaLabel={t("breadcrumb")} items={items} />
      <WishlistEmptyState />
    </div>
  );
}
