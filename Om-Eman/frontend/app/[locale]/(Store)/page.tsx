import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/ECommerce/Home/HomeSections";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeSections />;
}
