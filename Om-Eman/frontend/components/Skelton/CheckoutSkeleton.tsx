import { Skeleton } from "@/components/ui/Skeleton";

const CheckoutSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    <div className="grid gap-2 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-12 rounded-md" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6 rounded-lg bg-surface p-4 shadow-rest">
        <Skeleton className="h-6 w-1/3" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-3 rounded-md bg-paper p-3">
            <Skeleton className="size-16 shrink-0 rounded-md sm:size-20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3 rounded-lg bg-surface p-4 shadow-rest">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-3 rounded-lg bg-surface p-4 shadow-rest">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-9 w-1/2" />
        </div>
        <div className="space-y-3 rounded-lg bg-surface p-4 shadow-rest">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;
