import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import AccountSection from "@/components/ECommerce/Account/AccountSection";
import AccountSkeleton from "@/components/Skelton/AccountSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountSection />
      </Suspense>
    </div>
  );
}
