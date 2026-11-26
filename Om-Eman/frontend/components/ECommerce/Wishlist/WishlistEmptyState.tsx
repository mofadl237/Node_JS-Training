import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { PRODUCTS_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const WishlistEmptyState = async () => {
  const t = await getTranslations("wishlist");

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="text-ink-soft">{t("subtitle")}</p>
      </header>
      <div className="rounded-2xl border border-ink/10 bg-surface/60 transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-hover motion-reduce:transform-none motion-reduce:transition-none">
        <EmptyState
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={
            <Link
              href={PRODUCTS_HREF}
              className={cn(
                buttonVariants({ size: "lg" }),
                "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
              )}
            >
              {t("browseCta")}
            </Link>
          }
        />
      </div>
    </section>
  );
};
