import { Skeleton } from "@/components/ui/Skeleton";

export const CatalogSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-10 w-56" />
    <div className="flex flex-wrap gap-3">
      <Skeleton className="h-10 w-40 rounded-md" />
      <Skeleton className="h-10 w-40 rounded-md" />
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg bg-surface shadow-rest">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
