import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { BannerSkeleton } from "@/components/Skelton/BannerSkeleton";
import { CategoriesSkeleton } from "@/components/Skelton/CategoriesSkeleton";
import { FeaturedSkeleton } from "@/components/Skelton/FeaturedSkeleton";
import { Hero } from "./Hero";
import { HomeTrust } from "./HomeTrust";
import { BannerSection } from "./BannerSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturedSection } from "./FeaturedSection";

const TrustSkeletonInline = () => (
  <div className="mx-auto max-w-6xl px-4">
    <Skeleton className="h-12 w-full rounded-full" />
  </div>
);

export const HomeSections = () => (
  <div className="space-y-16 pb-16 md:space-y-24">
    <Hero />
    <div className="animate-fade-up [animation-delay:80ms] motion-reduce:animation-none">
      <Suspense fallback={<TrustSkeletonInline />}>
        <HomeTrust />
      </Suspense>
    </div>
    <div className="animate-fade-up [animation-delay:160ms] motion-reduce:animation-none">
      <Suspense fallback={<BannerSkeleton />}>
        <BannerSection />
      </Suspense>
    </div>
    <div className="animate-fade-up [animation-delay:240ms] motion-reduce:animation-none">
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>
    </div>
    <div className="animate-fade-up [animation-delay:320ms] motion-reduce:animation-none">
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
    </div>
  </div>
);
