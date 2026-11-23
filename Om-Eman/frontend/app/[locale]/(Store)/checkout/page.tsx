import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CheckoutSection from "@/components/ECommerce/Checkout/CheckoutSection";
import CheckoutSkeleton from "@/components/Skelton/CheckoutSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
      <p className="mt-2 text-ink-soft">{t("subtitle")}</p>
      <div className="mt-8">
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutSection />
        </Suspense>
      </div>
    </div>
  );
}
