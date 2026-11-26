import { setRequestLocale } from "next-intl/server";
import LoginCard from "@/components/Dashboard/Auth/LoginCard";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/locale";

interface IProps {
  params: Promise<{ locale: string }>;
}

const LoginPage = async ({ params }: IProps) => {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  setRequestLocale(safeLocale);

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <LoginCard />
    </main>
  );
};

export default LoginPage;
