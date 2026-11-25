import { getLocale, getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/Animation/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getStoreBanners } from "@/lib/server/storeQueries";
import { pickLocalized } from "@/lib/localized";
import { resolveBannerLink } from "@/lib/links";
import { BannerSlider } from "./BannerSlider";

const sectionClass = "mx-auto max-w-6xl px-4";

export const BannerSection = async () => {
  const [result, locale, t] = await Promise.all([
    getStoreBanners(),
    getLocale(),
    getTranslations("home.banners"),
  ]);

  if (!result.ok) {
    return (
      <section aria-label={t("label")} className={sectionClass}>
        <ErrorState title={t("errorTitle")} body={t("errorBody")} />
      </section>
    );
  }

  if (result.data.length === 0) {
    return (
      <section aria-label={t("label")} className={sectionClass}>
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
      </section>
    );
  }

  const items = result.data.map((banner) => ({
    id: banner.id,
    title: pickLocalized(locale, banner.titleAr, banner.titleEn),
    imageUrl: banner.imageUrl,
    mobileImageUrl: banner.mobileImageUrl,
    link: resolveBannerLink(banner.linkUrl),
  }));

  return (
    <FadeIn>
      <BannerSlider items={items} />
    </FadeIn>
  );
};
