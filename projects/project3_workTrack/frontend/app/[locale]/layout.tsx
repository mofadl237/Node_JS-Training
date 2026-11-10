import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Fraunces, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { AuthHydrator } from "@/src/Store/AuthHydrator";
import { StoreProvider } from "@/src/Store/StoreProvider";
import { ThemeController } from "@/src/Store/ThemeController";
import {
  getDirection,
  isAppLocale,
  locales,
} from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";
import "../globals.scss";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

interface ILocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ILocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  const messages = messagesByLocale[locale];

  return {
    title: messages.Metadata.title,
    description: messages.Metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: ILocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);

  const messages = messagesByLocale[locale];

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${manrope.variable} ${fraunces.variable} ${ibmPlexSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("worktrack.theme");if(t!=="dark"&&t!=="light"){t="light";}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();',
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <ThemeController />
            <AuthHydrator />
            {children}
            <Toaster
              position="top-center"
              closeButton
              duration={4200}
              toastOptions={{
                classNames: {
                  toast: "app-toast",
                  title: "app-toast__title",
                  description: "app-toast__description",
                  success: "app-toast--success",
                  error: "app-toast--error",
                },
              }}
            />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
