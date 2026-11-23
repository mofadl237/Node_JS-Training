import CheckoutSkeleton from "@/components/Skelton/CheckoutSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-3 px-4 py-8" aria-hidden="true">
      <Skeleton className="h-9 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-5">
        <CheckoutSkeleton />
      </div>
    </div>
  );
}
