"use client";

import { useRotatingIndex } from "@/hooks/useRotatingIndex";
import { ProductCard } from "@/components/Card/ProductCard";
import type { IStoreProductCard } from "@/interface";

interface IProps {
  products: IStoreProductCard[];
  locale: string;
}

export const FeaturedGrid = ({ products, locale }: IProps) => {
  // 1- state
  const activeIndex = useRotatingIndex(products.length, 3000);

  // 3- render
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} locale={locale} isBeamActive={index === activeIndex} />
      ))}
    </div>
  );
};
