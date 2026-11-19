"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { WHATSAPP_CONTACT } from "@/lib/siteContact";
import { PulseRing } from "@/components/Animation/PulseRing";
import { WhatsAppBrand } from "@/components/shared/SocialIcon";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SPRING_CARD } from "@/lib/motion";

const subscribe = () => () => {};
const THRESHOLD = 10;

const getScrollTop = () =>
  window.scrollY || document.scrollingElement?.scrollTop || document.documentElement.scrollTop || 0;

export const WhatsAppFab = () => {
  // 1- state
  const t = useTranslations("whatsapp");
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [isVisible, setIsVisible] = useState(false);
  const number = normalizeWhatsAppNumber(WHATSAPP_CONTACT);

  // 2- handlers
  useEffect(() => {
    if (!mounted || !number) return;
    const onScroll = () => setIsVisible(getScrollTop() > THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [mounted, number]);

  // 3- render
  if (!number || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible ? (
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={SPRING_CARD}
          className="fixed bottom-6 start-6 z-50"
        >
          <PulseRing ringClassName="bg-whatsapp" className="size-14 rounded-full">
            <a
              href={buildWhatsAppUrl(number, t("prefill"))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("label")}
              className={cn(buttonVariants({ variant: "whatsapp" }), "size-14 rounded-full p-0")}
            >
              <WhatsAppBrand size={28} />
            </a>
          </PulseRing>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
