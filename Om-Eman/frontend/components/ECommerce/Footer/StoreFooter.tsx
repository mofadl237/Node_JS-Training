import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getStoreSettings } from "@/lib/server/storeQueries";
import { getCurrentYear } from "@/lib/server/currentYear";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { toSafeExternalUrl } from "@/lib/links";
import { CONTACT_PHONES, SOCIAL_LINKS, WHATSAPP_CONTACT, type TSocialPlatform } from "@/lib/siteContact";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import FooterNav from "./FooterNav";
import { FooterContact } from "./FooterContact";
import { FooterSocial } from "./FooterSocial";

const cleanPhone = (value: string) => value.replace(/[^\d+]/g, "");

const toTelHref = (value: string): string | null => {
  const cleaned = cleanPhone(value);
  return cleaned && /^\+?\d{7,15}$/.test(cleaned) ? cleaned : null;
};

export const StoreFooter = async () => {
  // 1- state
  const [settingsResult, year, tBrand, tFooter] = await Promise.all([
    getStoreSettings(),
    getCurrentYear(),
    getTranslations("brand"),
    getTranslations("footer"),
  ]);
  const settings = settingsResult.ok ? settingsResult.data : null;
  const contact = settings?.contact ?? null;
  const email = contact?.email?.trim() || null;
  const address = contact?.address?.trim() || null;
  const workingHours = contact?.workingHours?.trim() || null;
  const whatsapp = normalizeWhatsAppNumber(WHATSAPP_CONTACT);
  const hasConfiguredPhones = CONTACT_PHONES.some((p) => toTelHref(p.display) !== null);
  const hasContact = hasConfiguredPhones || Boolean(email || whatsapp || address || workingHours);
  const hasSocial = (Object.keys(SOCIAL_LINKS) as TSocialPlatform[]).some(
    (key) => toSafeExternalUrl(SOCIAL_LINKS[key]) !== null,
  );

  // 3- render
  return (
    <footer className="border-t border-ink/10 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <section className="space-y-4">
          <Image
            src={BRAND_ASSETS.fullLogo}
            alt={tBrand("name")}
            width={320}
            height={320}
            sizes="(max-width: 640px) 160px, 200px"
            className="h-auto w-auto max-h-16 max-w-[160px] object-contain sm:max-h-20 sm:max-w-[200px]"
          />
          <p className="max-w-sm text-sm leading-6 text-ink-soft">{tFooter("tagline")}</p>
        </section>
        <FooterNav />
        {hasContact ? (
          <FooterContact email={email} address={address} workingHours={workingHours} />
        ) : null}
        {hasSocial ? <FooterSocial /> : null}
      </div>
      <div className="border-t border-ink/10 px-4 py-4 text-center text-sm text-ink-soft">
        {tFooter("copyright", { year, brand: tBrand("name") })}
      </div>
    </footer>
  );
};
