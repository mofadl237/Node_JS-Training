import { Skeleton } from "@/components/ui/Skeleton";

export const FooterSkeleton = () => (
  <footer className="border-t border-ink/10 bg-surface">
    <div className="mx-auto grid min-h-56 max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  </footer>
);
