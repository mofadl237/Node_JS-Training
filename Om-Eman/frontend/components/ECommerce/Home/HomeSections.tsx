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
    <Suspense fallback={<TrustSkeletonInline />}>
      <HomeTrust />
    </Suspense>
    <Suspense fallback={<BannerSkeleton />}>
      <BannerSection />
    </Suspense>
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesSection />
    </Suspense>
    <Suspense fallback={<FeaturedSkeleton />}>
      <FeaturedSection />
    </Suspense>
  </div>
);
