"use client";

import { m } from "motion/react";
import {
  ChevronRight,
  Heart,
  HelpCircle,
  PackageSearch,
  ShoppingCart,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { isNavPathActive } from "@/lib/navActive";
import { ACCOUNT_HREF, CART_HREF, FAQ_HREF, PRODUCTS_HREF, TRACK_HREF, WISHLIST_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { mobileNavLinkClass } from "./headerStyles";

interface IProps {
  onClose: () => void;
}

interface IMobileNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

const MobileNavItems = ({ onClose }: IProps) => {
  const pathname = usePathname();
  const t = useTranslations("header");

  const items: IMobileNavItem[] = [
    {
      href: PRODUCTS_HREF,
      label: t("shop"),
      icon: Store,
      isActive: isNavPathActive(pathname, PRODUCTS_HREF),
    },
    {
      href: FAQ_HREF,
      label: t("faq"),
      icon: HelpCircle,
      isActive: isNavPathActive(pathname, FAQ_HREF),
    },
    {
      href: WISHLIST_HREF,
      label: t("wishlist"),
      icon: Heart,
      isActive: isNavPathActive(pathname, WISHLIST_HREF),
    },
    {
      href: TRACK_HREF,
      label: t("track"),
      icon: PackageSearch,
      isActive: isNavPathActive(pathname, TRACK_HREF),
    },
    {
      href: ACCOUNT_HREF,
      label: t("account"),
      icon: UserRound,
      isActive: isNavPathActive(pathname, ACCOUNT_HREF),
    },
    {
      href: CART_HREF,
      label: t("cart"),
      icon: ShoppingCart,
      isActive: isNavPathActive(pathname, CART_HREF),
    },
  ];

  return (
    <nav aria-label={t("mainNav")} className="min-w-0">
      <ul className="space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <m.li
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={item.isActive ? "page" : undefined}
                className={cn(mobileNavLinkClass, item.isActive && "bg-primary text-on-primary shadow-rest")}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-md shadow-rest transition-colors duration-150",
                    item.isActive ? "bg-surface/20 text-on-primary" : "bg-surface/80 text-primary",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-base font-semibold">{item.label}</span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 opacity-60 transition-transform duration-150 rtl:rotate-180 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5"
                />
              </Link>
            </m.li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavItems;
