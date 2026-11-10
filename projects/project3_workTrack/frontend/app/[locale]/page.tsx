import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

interface IHomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: IHomePageProps) {
  const { locale } = await params;

  setRequestLocale(locale);
  redirect(`/${locale}/dashboard`);
}
