import { Leaf } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlowCard, type TGlowCardAccent } from "@/components/shared/GlowCard";
import { StoreImage } from "@/components/shared/StoreImage";
import { pickLocalized } from "@/lib/localized";
import { categoryHref } from "@/lib/routes";
import type { IStoreCategoryNode } from "@/interface";

interface IProps {
  category: IStoreCategoryNode;
  locale: string;
  accent: TGlowCardAccent;
}

export const CategoryCard = async ({ category, locale, accent }: IProps) => {
  // 1- state
  const t = await getTranslations("home.categories");
  const name = pickLocalized(locale, category.nameAr, category.nameEn) ?? category.nameAr;
  const description = pickLocalized(locale, category.descriptionAr, category.descriptionEn);

  // 3- render
  return (
    <GlowCard accent={accent} className="h-full overflow-hidden">
      <Link href={categoryHref(category.slug)} className="block h-full focus-visible:outline-2 focus-visible:outline-primary">
        <div className="relative aspect-[4/3] w-full">
          {category.imageUrl ? (
            <StoreImage
              src={category.imageUrl}
              alt={name}
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
              <Leaf aria-hidden="true" className="size-10 text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex min-h-[8.5rem] flex-col p-4">
          <h3 className="line-clamp-1 font-display text-lg text-ink">{name}</h3>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-ink-soft">{description ?? "\u00a0"}</p>
          <p className="mt-auto pt-2 text-sm font-medium text-primary">{t("count", { count: category.productsCount })}</p>
        </div>
      </Link>
    </GlowCard>
  );
};
