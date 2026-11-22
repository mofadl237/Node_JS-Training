import { getTranslations } from "next-intl/server";
import { getStoreSettings } from "@/lib/server/storeQueries";
import CartDrawer from "./CartDrawer";

const CartSection = async () => {
  const [t, settings] = await Promise.all([getTranslations("cart"), getStoreSettings()]);
  const freeShippingThreshold = settings.ok ? settings.data.freeShippingThreshold : null;

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("title")}</h1>
        <p className="text-ink-soft">{t("subtitle")}</p>
      </header>
      <CartDrawer freeShippingThreshold={freeShippingThreshold} />
    </section>
  );
};

export default CartSection;
