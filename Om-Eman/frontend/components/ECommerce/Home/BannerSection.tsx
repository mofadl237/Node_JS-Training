import { getLocale } from "next-intl/server";
import { FadeIn } from "@/components/Animation/FadeIn";
import { getStoreBanners } from "@/lib/server/storeQueries";
import { pickLocalized } from "@/lib/localized";
import { resolveBannerLink } from "@/lib/links";
import { BannerSlider } from "./BannerSlider";

export const BannerSection = async () => {
  // 1- state
  const [result, locale] = await Promise.all([getStoreBanners(), getLocale()]);
  if (!result.ok || result.data.length === 0) return null;

  const items = result.data.map((banner) => ({
    id: banner.id,
    title: pickLocalized(locale, banner.titleAr, banner.titleEn),
    imageUrl: banner.imageUrl,
    mobileImageUrl: banner.mobileImageUrl,
    link: resolveBannerLink(banner.linkUrl),
  }));

  // 3- render
  return (
    <FadeIn>
      <BannerSlider items={items} />
    </FadeIn>
  );
};
