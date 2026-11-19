import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/Button";
import { BRAND_ASSETS } from "@/lib/brandAssets";

export const Hero = async () => {
  // 1- state
  const t = await getTranslations("home.hero");
  const { desktop, mobile, poster } = BRAND_ASSETS.hero;
  const video = BRAND_ASSETS.brandVideo;
  const hasHeroImage = Boolean(desktop || mobile);

  // 3- render
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[70dvh] items-center overflow-hidden bg-paper px-4 py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {video.src ? (
          <video
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={video.poster ?? poster ?? undefined}
          />
        ) : null}
        {mobile ? (
          <Image
            src={mobile}
            alt=""
            fill
            preload={true}
            sizes="100vw"
            className={`object-cover md:hidden ${video.src ? "motion-safe:hidden" : ""}`}
          />
        ) : null}
        {desktop ? (
          <Image
            src={desktop}
            alt=""
            fill
            preload={true}
            sizes="100vw"
            className={`hidden object-cover md:block ${video.src ? "motion-safe:hidden" : ""}`}
          />
        ) : null}
        {video.poster && !hasHeroImage ? (
          <Image
            src={video.poster}
            alt=""
            fill
            preload={true}
            sizes="100vw"
            className="object-cover motion-safe:hidden"
          />
        ) : null}
        <div className="absolute -start-24 top-10 size-72 rounded-full bg-glow/20 blur-3xl" />
        <div className="absolute -end-20 bottom-10 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute start-1/3 top-1/4 size-40 rounded-full bg-primary/10 blur-2xl" />
        {hasHeroImage || video.src || video.poster ? <div className="absolute inset-0 bg-paper/50" /> : null}
      </div>
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <h1 id="hero-title" className="animate-fade-up font-display text-4xl text-ink md:text-6xl">
          {t("title")}
        </h1>
        <p className="animate-fade-up max-w-2xl text-lg text-ink-soft md:text-xl" style={{ animationDelay: "120ms" }}>
          {t("subtitle")}
        </p>
        <a href="#categories" className={`${buttonVariants({ size: "lg" })} animate-fade-up`} style={{ animationDelay: "240ms" }}>
          {t("cta")}
        </a>
      </div>
    </section>
  );
};
