import { StoreImage } from "@/components/shared/StoreImage";
import { pickLocalized } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { IStorefrontImage } from "@/interface";

interface IProps {
  images: IStorefrontImage[];
  locale: string;
  name: string;
  fallbackLabel: string;
}

const SIZES = "(min-width: 1024px) 50vw, 100vw";

export const ProductGallery = ({ images, locale, name, fallbackLabel }: IProps) => {
  const ordered = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  if (ordered.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2 shadow-rest">
        <StoreImage src={null} alt={fallbackLabel} sizes={SIZES} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {ordered.map((image, index) => (
        <div
          key={`${image.url}-${index}`}
          className={cn(
            "relative overflow-hidden rounded-xl bg-surface-2 shadow-rest",
            index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square",
          )}
        >
          <StoreImage
            src={image.url}
            alt={pickLocalized(locale, image.altAr, image.altEn) ?? name}
            sizes={SIZES}
            preload={index === 0}
          />
        </div>
      ))}
    </div>
  );
};
