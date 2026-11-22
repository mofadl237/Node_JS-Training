import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import CartSection from "@/components/ECommerce/Cart/CartSection";
import CartSkeleton from "@/components/Skelton/CartSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function CartPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8">
          <CartSkeleton />
        </div>
      }
    >
      <CartSection />
    </Suspense>
  );
}
