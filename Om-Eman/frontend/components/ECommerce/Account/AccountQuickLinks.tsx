import { memo } from "react";
import { useTranslations } from "next-intl";
import { House, PackageSearch, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PRODUCTS_HREF, TRACK_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";

const linkClass = cn(
  "group flex items-center gap-3 rounded-md bg-paper p-3 text-sm font-semibold text-ink",
  "transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-surface-2",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
);

const AccountQuickLinks = () => {
  const t = useTranslations("account");

  const links = [
    { href: TRACK_HREF, label: t("actions.trackOrder"), icon: PackageSearch, delay: "[animation-delay:180ms]" },
    { href: PRODUCTS_HREF, label: t("actions.continueShopping"), icon: ShoppingBag, delay: "[animation-delay:240ms]" },
    { href: "/", label: t("actions.backHome"), icon: House, delay: "[animation-delay:300ms]" },
  ];

  return (
    <section aria-labelledby="account-quick-links-title" className="mt-6 space-y-3">
      <h3 id="account-quick-links-title" className="text-sm font-semibold text-ink-soft">
        {t("quickLinksTitle")}
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {links.map(({ href, label, icon: Icon, delay }) => (
          <Link key={href} href={href} className={cn(linkClass, "animate-fade-up", delay)}>
            <Icon aria-hidden="true" className="size-4 text-primary transition-transform duration-200 group-hover:scale-110" />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default memo(AccountQuickLinks);
