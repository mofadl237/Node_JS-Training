import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import OrderSuccess from "@/components/ECommerce/Checkout/OrderSuccess";
import CheckoutSuccessSkeleton from "@/components/Skelton/CheckoutSuccessSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutSuccessPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("orderSuccess");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl text-ink">{t("pageTitle")}</h1>
      <p className="mt-2 text-ink-soft">{t("pageSubtitle")}</p>
      <div className="mt-8">
        <Suspense fallback={<CheckoutSuccessSkeleton />}>
          <OrderSuccess />
        </Suspense>
      </div>
    </div>
  );
}
