import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ACCOUNT_HREF, CART_HREF, FAQ_HREF, PRODUCTS_HREF, TRACK_HREF, WISHLIST_HREF } from "@/lib/routes";

const linkClass =
  "rounded-sm text-ink-soft transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const FooterNav = () => {
  const t = useTranslations("footer");

  const links = [
    { href: PRODUCTS_HREF, label: t("nav.shop") },
    { href: TRACK_HREF, label: t("nav.track") },
    { href: ACCOUNT_HREF, label: t("nav.account") },
    { href: CART_HREF, label: t("nav.cart") },
    { href: FAQ_HREF, label: t("nav.faq") },
    { href: WISHLIST_HREF, label: t("nav.wishlist") },
  ];

  return (
    <nav aria-label={t("navTitle")} className="space-y-3">
      <h2 className="font-display text-lg text-ink">{t("navTitle")}</h2>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNav;
