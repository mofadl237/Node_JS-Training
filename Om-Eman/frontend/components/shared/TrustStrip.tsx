import type { LucideIcon } from "lucide-react";
import { Marquee } from "@/components/Animation/Marquee";
import { cn } from "@/lib/utils";

export interface ITrustItem {
  icon: LucideIcon;
  label: string;
}

interface IProps {
  items: ITrustItem[];
  className?: string;
}

// Trust badges row (C5): a static row on desktop, a Marquee on mobile. The
// caller passes translated labels — this component never invents copy, and
// demo content must use only real backend facts (e.g. COD, WhatsApp).
const TrustChip = ({ icon: Icon, label }: ITrustItem) => (
  <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-rest">
    <Icon className="size-4 text-accent" aria-hidden="true" />
    {label}
  </span>
);

export const TrustStrip = ({ items, className }: IProps) => (
  <div className={cn("gap-4", className)}>
    <div className="hidden flex-wrap items-center justify-center gap-4 sm:flex">
      {items.map((item) => (
        <TrustChip key={item.label} {...item} />
      ))}
    </div>
    <Marquee className="sm:hidden" durationSeconds={22}>
      {items.map((item) => (
        <TrustChip key={item.label} {...item} />
      ))}
    </Marquee>
  </div>
);
