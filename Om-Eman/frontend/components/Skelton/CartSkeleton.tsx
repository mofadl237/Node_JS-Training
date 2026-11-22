import { Skeleton } from "@/components/ui/Skeleton";

const CartSkeleton = () => (
  <div className="rounded-lg bg-surface p-4 shadow-rest" aria-hidden="true">
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-3 rounded-md bg-paper p-3">
          <Skeleton className="size-20 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <Skeleton className="hidden h-9 w-28 sm:block" />
        </div>
      ))}
    </div>
    <div className="mt-6 space-y-3 border-t border-ink/10 pt-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export default CartSkeleton;
