import { Skeleton } from "@/components/ui/Skeleton";

export const BannerSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4">
    <Skeleton className="aspect-[3/1] w-full rounded-lg" />
  </div>
);
