import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { CONTACT_PHONES, WHATSAPP_CONTACT } from "@/lib/siteContact";

interface IProps {
  email: string | null;
  address: string | null;
  workingHours: string | null;
}

const toTelHref = (value: string): string | null => {
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned && /^\+?\d{7,15}$/.test(cleaned) ? `tel:${cleaned}` : null;
};

export const FooterContact = ({ email, address, workingHours }: IProps) => {
  // 1- state
  const t = useTranslations("footer");
  const phones = CONTACT_PHONES.map((p) => ({ ...p, href: toTelHref(p.display) })).filter(
    (p): p is (typeof CONTACT_PHONES)[number] & { href: string } => p.href !== null,
  );
  const whatsapp = normalizeWhatsAppNumber(WHATSAPP_CONTACT);
  const hasItems = phones.length > 0 || Boolean(email || whatsapp || address || workingHours);

  // 3- render
  if (!hasItems) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg text-ink">{t("contactTitle")}</h2>
      <ul className="space-y-3 text-sm text-ink-soft">
        {phones.map((item) => (
          <li key={item.display}>
            <a
              href={item.href}
              aria-label={`${t(item.labelKey)}: ${item.display}`}
              className="inline-flex items-center gap-2 rounded-md transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Phone aria-hidden="true" className="size-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-ink-soft">{t(item.labelKey)}</span>
                <span dir="ltr" className="font-medium text-ink">{item.display}</span>
              </span>
            </a>
          </li>
        ))}
        {email ? (
          <li>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Mail aria-hidden="true" className="size-4 text-primary" />
              <span>{email}</span>
            </a>
          </li>
        ) : null}
        {whatsapp ? (
          <li>
            <a
              href={buildWhatsAppUrl(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-ink"
            >
              <MessageCircle aria-hidden="true" className="size-4 text-primary" />
              <span>{t("whatsapp")}</span>
            </a>
          </li>
        ) : null}
        {address ? (
          <li className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{address}</span>
          </li>
        ) : null}
        {workingHours ? (
          <li className="flex items-start gap-2">
            <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{workingHours}</span>
          </li>
        ) : null}
      </ul>
    </section>
  );
};
