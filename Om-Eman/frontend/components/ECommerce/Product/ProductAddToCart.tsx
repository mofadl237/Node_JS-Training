"use client";

import type { RefObject } from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useAddToCart } from "@/hooks/useAddToCart";

interface IProps {
  productPackageId: string | null;
  sourceRef: RefObject<HTMLElement | null>;
  canAdd: boolean;
  packageName: string;
}

export const ProductAddToCart = ({ productPackageId, sourceRef, canAdd, packageName }: IProps) => {
  const t = useTranslations("product");
  const tDetail = useTranslations("productDetail");
  const { addToCart, isAdding, isAdded, hasError } = useAddToCart({
    productPackageId,
    sourceRef,
    canAdd,
  });

  const label = !canAdd ? t("soldOut") : isAdded ? t("addedToCart") : t("addToCart");

  return (
    <div className="space-y-2">
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!canAdd || isAdded}
        isLoading={isAdding}
        aria-label={label}
        onClick={() => {
          void addToCart();
        }}
      >
        <ShoppingCart aria-hidden="true" className="size-5" />
        <span>{label}</span>
        <span className="sr-only">{tDetail("quantity", { quantity: 1, name: packageName })}</span>
      </Button>
      {hasError ? (
        <p role="alert" className="text-sm text-danger">
          {t("addToCartError")}
        </p>
      ) : null}
    </div>
  );
};
