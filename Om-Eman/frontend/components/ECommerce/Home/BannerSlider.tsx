"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StoreImage } from "@/components/shared/StoreImage";
import { cn } from "@/lib/utils";

interface IBannerItem {
  id: string;
  title: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  link: { kind: "internal"; href: string } | { kind: "external"; href: string } | null;
}

interface IProps {
  items: IBannerItem[];
}

export const BannerSlider = ({ items }: IProps) => {
  // 1- state
  const t = useTranslations("home.banners");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const trackRef = useRef<HTMLUListElement>(null);
  const hasArrows = items.length > 1;

  // 2- handlers
  const onScroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * track.clientWidth * (isRtl ? -1 : 1),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  // 3- render
  return (
    <div aria-roledescription="carousel" aria-label={t("label")} className="relative mx-auto max-w-6xl px-4">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const content = (
            <figure>
              <div className="relative aspect-[16/9] w-full md:hidden">
                <StoreImage
                  src={item.mobileImageUrl ?? item.imageUrl}
                  alt={item.title ?? ""}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative hidden aspect-[3/1] w-full md:block">
                <StoreImage src={item.imageUrl} alt={item.title ?? ""} sizes="(min-width: 1280px) 1152px, 100vw" className="object-cover" />
              </div>
              {item.title ? (
                <figcaption className="bg-surface px-4 py-3 text-center font-display text-lg text-ink">
                  {item.title}
                </figcaption>
              ) : null}
            </figure>
          );
          return (
            <li key={item.id} className="min-w-full snap-center">
              {item.link?.kind === "internal" ? (
                <Link href={item.link.href} className="block focus-visible:outline-2 focus-visible:outline-primary">
                  {content}
                </Link>
              ) : item.link?.kind === "external" ? (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
      {hasArrows ? (
        <>
          <button
            type="button"
            onClick={() => onScroll(-1)}
            aria-label={t("prev")}
            className={cn(
              "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow-rest backdrop-blur transition-transform duration-150 hover:scale-105",
              "start-6",
            )}
          >
            <ChevronLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => onScroll(1)}
            aria-label={t("next")}
            className={cn(
              "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow-rest backdrop-blur transition-transform duration-150 hover:scale-105",
              "end-6",
            )}
          >
            <ChevronRight aria-hidden="true" className="size-5 rtl:rotate-180" />
          </button>
        </>
      ) : null}
    </div>
  );
};
