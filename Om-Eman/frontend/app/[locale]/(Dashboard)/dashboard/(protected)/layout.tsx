import { Suspense } from "react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { requireEmployee } from "@/lib/server/requireEmployee";

interface IProps {
  children: ReactNode;
}

const Guard = async ({ children }: IProps) => {
  await requireEmployee();
  return <>{children}</>;
};

const ProtectedLayout = ({ children }: IProps) => (
  <Suspense
    fallback={
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10">
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    }
  >
    <Guard>{children}</Guard>
  </Suspense>
);

export default ProtectedLayout;
