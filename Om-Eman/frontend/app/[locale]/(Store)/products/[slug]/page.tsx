import { Suspense } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductDetails } from "@/components/ECommerce/Product/ProductDetails";
import { ProductDetailsSkeleton } from "@/components/Skelton/ProductDetailsSkeleton";
import { isStoreProductSlug } from "@/lib/storeSlug";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductPage({ params }: IProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!isStoreProductSlug(slug)) notFound();

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails locale={locale} slug={slug} />
    </Suspense>
  );
}
