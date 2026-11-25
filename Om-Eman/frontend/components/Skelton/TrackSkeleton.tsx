import { Skeleton } from "@/components/ui/Skeleton";
import { TRACK_CARD_CLASS } from "@/components/ECommerce/Track/trackStyles";

const TrackSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    <div className="space-y-2">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-4 w-full max-w-xl" />
    </div>
    <div className={TRACK_CARD_CLASS}>
      <Skeleton className="h-5 w-40" />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full sm:w-32" />
      </div>
    </div>
    <div className={TRACK_CARD_CLASS}>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-28 rounded-full bg-primary/10" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    </div>
    <div className={TRACK_CARD_CLASS}>
      <Skeleton className="h-5 w-32" />
      <div className="mt-4 space-y-4 border-s border-primary/15 ps-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export default TrackSkeleton;
