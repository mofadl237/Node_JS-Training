import { getTranslations } from "next-intl/server";
import HeroCta from "@/components/ECommerce/Home/HeroCta";
import HeroSlider from "@/components/ECommerce/Home/HeroSlider";

export const Hero = async () => {
  const t = await getTranslations("home.hero");

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate flex min-h-[calc(100dvh-7rem)] items-center justify-center overflow-hidden bg-ink px-4 py-10 sm:min-h-[calc(100dvh-4.5rem)] md:py-14"
    >
      <h1 id="home-hero-title" className="sr-only">
        {t("title")}
      </h1>
      <HeroSlider />
      <HeroCta />
    </section>
  );
};
