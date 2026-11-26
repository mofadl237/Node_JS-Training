"use client";

import { memo } from "react";
import { ChevronRight, Heart, HelpCircle, PackageSearch, Store, UserRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { isNavPathActive } from "@/lib/navActive";
import { ACCOUNT_HREF, FAQ_HREF, PRODUCTS_HREF, TRACK_HREF, WISHLIST_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { headerNavLinkActiveClass, headerNavLinkClass } from "./headerStyles";

interface IProps {
  className?: string;
}

interface IHeaderNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

const HeaderNavLinks = ({ className }: IProps) => {
  const pathname = usePathname();
  const t = useTranslations("header");

  const items: IHeaderNavItem[] = [
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
  ];

  return (
    <nav aria-label={t("mainNav")} className={cn("items-center gap-1", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
            className={cn(headerNavLinkClass, item.isActive && headerNavLinkActiveClass)}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 truncate">{item.label}</span>
            <ChevronRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-ink-soft transition-transform duration-150 rtl:rotate-180 group-hover:translate-x-0.5 group-hover:text-primary rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default memo(HeaderNavLinks);
