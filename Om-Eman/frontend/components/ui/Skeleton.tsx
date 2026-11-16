import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TSkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, ...props }: TSkeletonProps) => (
  <div className={cn("skeleton-shimmer rounded-sm bg-surface-2", className)} {...props} />
);
