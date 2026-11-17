import { memo } from "react";
import type { ReactNode } from "react";
import { BorderBeam } from "@/components/Animation/BorderBeam";
import { Spotlight } from "@/components/Animation/Spotlight";
import { cn } from "@/lib/utils";

export type TGlowCardAccent = "none" | "card-1" | "card-2" | "card-3" | "card-4";

interface IProps {
  children: ReactNode;
  className?: string;
  accent?: TGlowCardAccent;
  hasSpotlight?: boolean;
  isBeamActive?: boolean;
}

// Static class map (C7) — no dynamic Tailwind class building, the compiler
// must see every class. The accent tint gives each card type a stable color
// identity (DESIGN_SYSTEM §2.3).
const ACCENT_CLASSES: Record<TGlowCardAccent, string> = {
  none: "bg-surface",
  "card-1": "bg-card-1",
  "card-2": "bg-card-2",
  "card-3": "bg-card-3",
  "card-4": "bg-card-4",
};

// Card wrapper (C7): surface + radius + rest shadow, lifts on hover via
// transform only, composes the Spotlight and the BorderBeam.
export const GlowCard = ({
  children,
  className,
  accent = "none",
  hasSpotlight = true,
  isBeamActive = false,
}: IProps) => {
  const card = (
    <div
      className={cn(
        "relative rounded-lg shadow-rest transition-[transform,box-shadow] duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-hover",
        ACCENT_CLASSES[accent],
        className,
      )}
    >
      {children}
      <BorderBeam isActive={isBeamActive} />
    </div>
  );

  return hasSpotlight ? <Spotlight className="rounded-lg">{card}</Spotlight> : card;
};

export default memo(GlowCard);
