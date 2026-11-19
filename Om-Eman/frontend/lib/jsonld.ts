import type { IStoreSettings } from "@/interface";
import { toSafeExternalUrl } from "./links";

interface IOrganizationProps {
  siteUrl: string;
  locale: string;
  name: string;
  settings: IStoreSettings | null;
}

interface IWebSiteProps {
  siteUrl: string;
  locale: string;
  name: string;
}

export const buildOrganizationJsonLd = ({
  siteUrl,
  locale,
  name,
  settings,
}: IOrganizationProps): Record<string, unknown> => {
  const url = `${siteUrl}/${locale}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (settings) {
    const sameAs = Object.values(settings.social)
      .map((value) => toSafeExternalUrl(value))
      .filter((value): value is string => value !== null);
    if (sameAs.length > 0) data.sameAs = sameAs;

    const contactPoint: Record<string, string> = { "@type": "ContactPoint", contactType: "customer service" };
    if (settings.contact.phone) contactPoint.telephone = settings.contact.phone;
    if (settings.contact.email) contactPoint.email = settings.contact.email;
    if (Object.keys(contactPoint).length > 2) data.contactPoint = contactPoint;
  }

  return data;
};

export const buildWebSiteJsonLd = ({ siteUrl, locale, name }: IWebSiteProps): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name,
  url: `${siteUrl}/${locale}`,
  inLanguage: locale,
});
