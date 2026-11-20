"use client";

import { useTranslations } from "next-intl";
import type { IStorefrontPackage } from "@/interface";
import { ProductPackageOption } from "./ProductPackageOption";

interface IProps {
  locale: string;
  packages: IStorefrontPackage[];
  productName: string;
  selectedId: string | null;
  onSelect: (packageId: string) => void;
}

export const ProductPackages = ({ locale, packages, productName, selectedId, onSelect }: IProps) => {
  const t = useTranslations("productDetail");

  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-ink">{t("packagesTitle")}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {packages.map((pkg) => (
          <li key={pkg.id}>
            <ProductPackageOption
              pkg={pkg}
              locale={locale}
              productName={productName}
              isSelected={pkg.id === selectedId}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
