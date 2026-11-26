"use client";

import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { PRODUCTS_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";

const HeroCta = () => {
  const t = useTranslations("home.hero");
  const reduceMotion = useReducedMotion();

  return (
    <div className="animate-fade-up relative flex justify-center motion-reduce:animation-none">
      <m.span
        aria-hidden="true"
        className="absolute -inset-3 -z-10 rounded-full bg-primary/25 blur-xl"
        animate={reduceMotion ? undefined : { opacity: [0.25, 0.6, 0.25], scale: [1, 1.07, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        initial={false}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="relative z-10"
      >
        <Link
          href={PRODUCTS_HREF}
          className={cn(
            buttonVariants({ size: "lg" }),
            "group relative isolate flex items-center gap-2 overflow-hidden rounded-full px-8 shadow-floating ring-1 ring-on-primary/20",
          )}
        >
          <m.span
            aria-hidden="true"
            className="absolute inset-y-0 -start-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-on-primary/30 to-transparent"
            animate={reduceMotion ? undefined : { x: ["0%", "400%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
          />
          <span className="relative z-10">{t("cta")}</span>
          <ArrowRight
            aria-hidden="true"
            className="relative z-10 size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      </m.div>
    </div>
  );
};

export default memo(HeroCta);
