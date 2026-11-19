"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRotatingIndex } from "@/hooks/useRotatingIndex";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/Card/ProductCard";
import { DEMO_PRODUCTS } from "./demoProducts";

export const ProductCardRow = () => {
  // 1- state
  const t = useTranslations("design");
  const locale = useLocale();
  const activeIndex = useRotatingIndex(DEMO_PRODUCTS.length, 3000);

  // 3- render
  return (
    <section>
      <SectionHeading title={t("productCardTitle")} subtitle={t("productCardDemoNote")} />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {DEMO_PRODUCTS.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            isBeamActive={index === activeIndex}
            isDemo
          />
        ))}
      </div>
    </section>
  );
};
