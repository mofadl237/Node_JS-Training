import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IProps {
  id: string;
  className?: string;
  children: ReactNode;
}

const CheckoutFocusSection = ({ id, className, children }: IProps) => (
  <section
    id={id}
    tabIndex={-1}
    className={cn(
      "rounded-lg bg-surface p-4 shadow-rest outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      className,
    )}
  >
    {children}
  </section>
);

export default CheckoutFocusSection;
