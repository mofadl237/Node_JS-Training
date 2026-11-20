"use client";

import { memo, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlowCard } from "@/components/shared/GlowCard";
import { PriceTag } from "@/components/shared/PriceTag";
import { StoreImage } from "@/components/shared/StoreImage";
import { useAddToCart } from "@/hooks/useAddToCart";
import { pickLocalized } from "@/lib/localized";
import { productHref } from "@/lib/routes";
import type { IStoreProductCard } from "@/interface";

interface IProps {
  product: IStoreProductCard;
  locale: string;
  isBeamActive?: boolean;
  isDemo?: boolean;
}

const ProductCardBase = ({ product, locale, isBeamActive = false, isDemo = false }: IProps) => {
  // 1- state
  const t = useTranslations("product");
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const name = pickLocalized(locale, product.nameAr, product.nameEn) ?? product.nameAr;
  const alt = pickLocalized(locale, product.primaryImage?.altAr ?? null, product.primaryImage?.altEn ?? null) ?? name;
  const categoryName = pickLocalized(locale, product.category.nameAr, product.category.nameEn);
  const accent = product.productType === "PREDEFINED_BUNDLE" ? "card-3" : "none";
  const canAddDirect = !isDemo && product.inStock && !product.price.hasMultiplePackages && Boolean(product.defaultPackageId);
  const needsChoice = !isDemo && product.inStock && product.price.hasMultiplePackages;
  const isUnavailable = !product.inStock || !product.defaultPackageId;
  const { addToCart, isAdding, isAdded } = useAddToCart({
    productPackageId: product.defaultPackageId,
    sourceRef: thumbRef,
    canAdd: canAddDirect,
  });

  // 2- handlers
  const onAdd = () => {
    void addToCart();
  };

  // 3- render
  const ctaLabel = isUnavailable ? t("soldOut") : needsChoice ? t("choosePackage") : isAdded ? t("addedToCart") : t("addToCart");

  return (
    <GlowCard accent={accent} isBeamActive={isBeamActive} className="group h-full overflow-hidden">
      <div className="relative aspect-square w-full bg-surface-2">
        <div ref={thumbRef} className="absolute inset-0">
          <StoreImage
            src={product.primaryImage?.url ?? null}
            alt={alt}
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        </div>
        {product.secondaryImage ? (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
            <StoreImage src={product.secondaryImage.url} alt="" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
          </div>
        ) : null}
        <div className="pointer-events-none absolute start-2 top-2 z-10 flex flex-wrap gap-1">
          {product.productType === "PREDEFINED_BUNDLE" ? <Badge variant="bundle">{t("bundle")}</Badge> : null}
          {!product.inStock ? <Badge variant="soldOut">{t("soldOut")}</Badge> : null}
        </div>
      </div>
      <div className="relative flex min-h-[11rem] flex-col p-3">
        <p className="h-4 truncate text-xs text-ink-soft">{categoryName ?? "\u00a0"}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-display text-base leading-snug text-ink">
          <Link href={productHref(product.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {name}
          </Link>
        </h3>
        <p className="mt-1 h-4 text-xs text-ink-soft">
          {product.price.hasMultiplePackages ? t("priceFrom") : "\u00a0"}
        </p>
        <div className="mt-auto space-y-2 pt-1">
          <PriceTag price={product.price.from} compareAt={product.price.compareAtFrom} />
          {needsChoice ? (
            <Link
              href={productHref(product.slug)}
              className="relative z-10 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-surface-2 px-4 text-sm font-semibold text-ink transition-all duration-150 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {ctaLabel}
            </Link>
          ) : (
            <Button
              variant={canAddDirect ? "primary" : "soft"}
              size="sm"
              className="relative z-10 w-full"
              disabled={!canAddDirect || isAdding || isAdded}
              onClick={onAdd}
              aria-label={ctaLabel}
            >
              <ShoppingCart aria-hidden="true" className="size-4" />
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </GlowCard>
  );
};

export const ProductCard = memo(ProductCardBase);
