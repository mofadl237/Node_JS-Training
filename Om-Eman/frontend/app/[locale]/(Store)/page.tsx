import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/ECommerce/Home/HomeSections";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeSections />;
}
