import { getTranslations } from "next-intl/server";
import { FaqItem } from "@/components/ECommerce/FAQ/FaqItem";

export const FaqSection = async () => {
  const t = await getTranslations("faq");

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <p className="text-ink-soft">{t("subtitle")}</p>
      </header>
      <div className="space-y-3">
        <FaqItem question={t("items.products.question")} answer={t("items.products.answer")} />
        <FaqItem question={t("items.contact.question")} answer={t("items.contact.answer")} />
        <FaqItem question={t("items.wishlist.question")} answer={t("items.wishlist.answer")} />
      </div>
    </section>
  );
};
