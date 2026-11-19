import { Banknote, MessageCircle, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TrustStrip, type ITrustItem } from "@/components/shared/TrustStrip";
import { getStoreSettings } from "@/lib/server/storeQueries";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { formatPriceAmount } from "@/lib/price";
import { WHATSAPP_CONTACT } from "@/lib/siteContact";

export const HomeTrust = async () => {
  // 1- state
  const [settingsResult, t, tCommon] = await Promise.all([
    getStoreSettings(),
    getTranslations("home.trust"),
    getTranslations("common"),
  ]);
  const settings = settingsResult.ok ? settingsResult.data : null;
  const items: ITrustItem[] = [{ icon: Banknote, label: t("cod") }];

  if (settings?.freeShippingThreshold !== null && settings?.freeShippingThreshold !== undefined) {
    items.push({
      icon: Truck,
      label: t("freeShipping", {
        amount: formatPriceAmount(settings.freeShippingThreshold),
        currency: tCommon("currencyEgp"),
      }),
    });
  }

  const whatsapp = normalizeWhatsAppNumber(WHATSAPP_CONTACT);
  if (whatsapp) {
    items.push({ icon: MessageCircle, label: t("whatsapp") });
  }

  // 3- render
  return <TrustStrip items={items} className="mx-auto max-w-6xl px-4" />;
};
