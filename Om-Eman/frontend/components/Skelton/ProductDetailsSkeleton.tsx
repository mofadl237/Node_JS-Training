import { Skeleton } from "@/components/ui/Skeleton";

export const ProductDetailsSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
    <Skeleton className="h-4 w-48" />
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="col-span-2 aspect-[4/3] w-full rounded-xl" />
        <Skeleton className="aspect-square w-full rounded-xl" />
        <Skeleton className="aspect-square w-full rounded-xl" />
      </div>
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
