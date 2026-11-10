import { setRequestLocale } from "next-intl/server";
import { GuestGuard } from "@/src/components/auth/guards/GuestGuard";
import { LoginScreen } from "@/src/components/auth/Login/LoginScreen";

interface ILoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: ILoginPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <GuestGuard>
      <LoginScreen />
    </GuestGuard>
  );
}
