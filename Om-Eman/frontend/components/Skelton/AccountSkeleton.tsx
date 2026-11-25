import { ACCOUNT_CARD_CLASS } from "@/components/ECommerce/Account/accountStyles";
import { Skeleton } from "@/components/ui/Skeleton";

const AccountSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    <div className={ACCOUNT_CARD_CLASS}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-11 w-32 rounded-md" />
      </div>
    </div>
    <div className={ACCOUNT_CARD_CLASS}>
      <Skeleton className="h-6 w-40" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    </div>
  </div>
);

export default AccountSkeleton;
