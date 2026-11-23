import { Skeleton } from "@/components/ui/Skeleton";

const CheckoutSuccessSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
    <Skeleton className="h-9 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="rounded-lg bg-surface p-5 shadow-rest">
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
    <Skeleton className="h-11 w-40" />
  </div>
);

export default CheckoutSuccessSkeleton;
