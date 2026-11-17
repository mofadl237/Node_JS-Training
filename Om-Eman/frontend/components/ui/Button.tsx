import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:shadow-hover",
        soft: "bg-surface-2 text-ink hover:bg-primary/10",
        ghost: "bg-transparent text-ink hover:bg-surface-2",
        whatsapp: "btn-shine bg-whatsapp text-on-whatsapp hover:shadow-hover",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ...props
}: IButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }), "active:scale-[0.97]", className)}
    disabled={disabled ?? isLoading}
    {...props}
  >
    {isLoading ? <Loader2 className="size-4 animate-spin" /> : children}
  </button>
);
