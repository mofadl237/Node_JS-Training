import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-ink",
        primary: "bg-primary text-on-primary",
        accent: "bg-accent text-ink",
        outline: "border border-primary text-primary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface IBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: IBadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
