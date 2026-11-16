import { getTranslations, setRequestLocale } from "next-intl/server";

interface IProps {
  params: Promise<{ locale: string }>;
}

const Page = async ({ params }: IProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="text-ink-soft">{t("body")}</p>
    </main>
  );
};

export default Page;
