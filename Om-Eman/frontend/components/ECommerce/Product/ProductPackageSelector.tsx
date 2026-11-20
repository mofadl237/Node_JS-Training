"use client";

import { useRef, useState } from "react";
import { pickLocalized } from "@/lib/localized";
import type { IStorefrontPackage } from "@/interface";
import { ProductAddToCart } from "./ProductAddToCart";
import { ProductPackages } from "./ProductPackages";

interface IProps {
  locale: string;
  packages: IStorefrontPackage[];
  productName: string;
}

const firstAvailableId = (packages: IStorefrontPackage[]): string | null =>
  packages.find((pkg) => pkg.stockStatus === "IN_STOCK")?.id ?? null;

export const ProductPackageSelector = ({ locale, packages, productName }: IProps) => {
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() => firstAvailableId(packages));
  const selected = packages.find((pkg) => pkg.id === selectedId) ?? null;
  const canAdd = selected?.stockStatus === "IN_STOCK";
  const packageName = selected
    ? pickLocalized(locale, selected.nameAr, selected.nameEn) ?? productName
    : productName;

  return (
    <div ref={sourceRef} className="space-y-4">
      <ProductPackages
        locale={locale}
        packages={packages}
        productName={productName}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ProductAddToCart
        productPackageId={selected?.id ?? null}
        sourceRef={sourceRef}
        canAdd={canAdd}
        packageName={packageName}
      />
    </div>
  );
};
