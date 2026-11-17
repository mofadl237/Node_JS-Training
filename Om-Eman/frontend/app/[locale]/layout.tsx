import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getLocaleDirection, isLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { ThemeScript } from "@/components/shared/ThemeScript";
import { ThemeProvider } from "@/Providers/ThemeProvider";
import { ReduxProvider } from "@/Providers/ReduxProvider";
import { MotionProvider } from "@/components/Animation/MotionProvider";
import { Toaster } from "@/components/ui/Toaster";
import { El_Messiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";

const display = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

interface IProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<IProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;

  return buildMetadata({ title: t("title"), description: t("description"), path: "", locale: safeLocale });
}

export default async function LocaleLayout({ children, params }: IProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const dir = getLocaleDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme="zafran"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-paper font-body text-ink antialiased">
        <NextIntlClientProvider>
          <ReduxProvider>
            <ThemeProvider>
              <MotionProvider>
                {children}
                <Toaster />
              </MotionProvider>
            </ThemeProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
