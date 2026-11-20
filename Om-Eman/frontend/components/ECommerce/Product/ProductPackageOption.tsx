"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/shared/PriceTag";
import { pickLocalized } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { IStorefrontPackage } from "@/interface";
import { PackageSize } from "./PackageSize";

interface IProps {
  pkg: IStorefrontPackage;
  locale: string;
  productName: string;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
}

export const ProductPackageOption = ({ pkg, locale, productName, isSelected, onSelect }: IProps) => {
  const t = useTranslations("product");
  const name = pickLocalized(locale, pkg.nameAr, pkg.nameEn) ?? productName;
  const isAvailable = pkg.stockStatus === "IN_STOCK";
  const inputId = `product-package-${pkg.id}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "block cursor-pointer rounded-xl bg-surface p-4 shadow-rest transition-all duration-150",
        isSelected ? "outline-2 outline-primary" : "hover:bg-surface-2",
        !isAvailable && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        id={inputId}
        type="radio"
        name="product-package"
        value={pkg.id}
        checked={isSelected}
        disabled={!isAvailable}
        onChange={() => onSelect(pkg.id)}
        className="peer sr-only"
      />
      <div className="space-y-2 rounded-lg p-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium text-ink">{name}</p>
          {!isAvailable ? <Badge variant="soldOut">{t("soldOut")}</Badge> : null}
        </div>
        <PackageSize sizeValue={pkg.sizeValue} sizeUnit={pkg.sizeUnit} />
        <PriceTag price={pkg.sellingPrice} compareAt={pkg.compareAtPrice} />
      </div>
    </label>
  );
};
