import { Skeleton } from "@/components/ui/Skeleton";

const DashboardLoading = () => (
  <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10">
    <Skeleton className="h-9 w-1/3" />
    <Skeleton className="h-40 w-full" />
  </div>
);

export default DashboardLoading;
