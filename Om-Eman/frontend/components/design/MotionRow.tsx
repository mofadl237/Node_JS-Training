"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Banknote, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlowCard } from "@/components/shared/GlowCard";
import type { TGlowCardAccent } from "@/components/shared/GlowCard";
import { PulseRing } from "@/components/Animation/PulseRing";
import { CartBounce } from "@/components/Animation/CartBounce";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { Shake } from "@/components/Animation/Shake";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { useConfetti } from "@/hooks/useConfetti";
import { useRotatingIndex } from "@/hooks/useRotatingIndex";

const DEMO_COUPON = "DEMO10";
const BEAM_INTERVAL_MS = 3000;
const GLOW_ACCENTS: readonly TGlowCardAccent[] = ["none", "card-2", "card-3", "card-4"];

interface IProps {
  className?: string;
}

// Living-motion row (D2): fly-to-cart demo, fake local coupon (no API) that
// shakes on failure and fires theme-colored confetti on success, trust strip,
// pulse ring, and 4 glow cards sharing one rotating BorderBeam.
export const MotionRow = ({ className }: IProps) => {
  const t = useTranslations("design");
  // 1- state
  const [pulseKey, setPulseKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [coupon, setCoupon] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const couponButtonRef = useRef<HTMLButtonElement>(null);
  const fly = useFlyToCart();
  const fireConfetti = useConfetti();
  const beamIndex = useRotatingIndex(4, BEAM_INTERVAL_MS);

  // 2- handlers
  const onFly = useCallback(() => {
    if (!cardRef.current) return;
    fly({ source: cardRef.current, onArrive: () => setPulseKey((key) => key + 1) });
  }, [fly]);

  const onCouponSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (coupon.trim().toUpperCase() === DEMO_COUPON) {
        toast.success(t("couponSuccess"));
        const rect = couponButtonRef.current?.getBoundingClientRect();
        if (rect) {
          fireConfetti({ x: rect.left + rect.width / 2, y: rect.top });
        }
      } else {
        toast.error(t("couponWrong"));
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    },
    [coupon, t, fireConfetti],
  );

  // 3- render
  return (
    <section className={className}>
      <SectionHeading title={t("motionTitle")} subtitle={t("motionSubtitle")} />
      <div className="mt-6 space-y-10">
        <div className="flex flex-wrap items-center gap-6">
          <div
            ref={cardRef}
            className="w-40 space-y-2 rounded-lg bg-card-2 p-3 shadow-rest"
          >
            <div className="h-16 rounded-md bg-surface-2" />
            <Button size="sm" onClick={onFly}>
              <ShoppingCart className="size-4" aria-hidden="true" />
              {t("demoAddToCart")}
            </Button>
          </div>
          <CartBounce pulseKey={pulseKey} className="size-14 rounded-full bg-primary p-3">
            <ShoppingCart className="size-full text-on-primary" aria-hidden="true" />
          </CartBounce>
        </div>

        <Shake isShaking={isShaking}>
          <form onSubmit={onCouponSubmit} className="flex max-w-sm gap-2">
            <Input
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder={t("couponPlaceholder")}
            />
            <Button type="submit" variant="soft">
              <span ref={couponButtonRef} className="inline-flex">
                {t("couponCheck")}
              </span>
            </Button>
          </form>
        </Shake>
        <p className="text-xs text-ink-soft">{DEMO_COUPON}</p>

        <TrustStrip
          items={[
            { icon: Banknote, label: t("trustCod") },
            { icon: MessageCircle, label: t("trustWhatsapp") },
          ]}
        />

        <PulseRing className="grid size-16 place-items-center rounded-full bg-whatsapp">
          <MessageCircle className="size-7 text-on-whatsapp" aria-hidden="true" />
        </PulseRing>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((number) => (
            <GlowCard
              key={number}
              accent={GLOW_ACCENTS[number - 1] ?? "none"}
              isBeamActive={beamIndex === number - 1}
              className="p-5"
            >
              <p className="text-ink">{t("glowCard", { number })}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};
