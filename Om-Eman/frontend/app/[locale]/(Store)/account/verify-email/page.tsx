import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import VerifyEmailForm from "@/components/ECommerce/Account/VerifyEmailForm";
import AccountSkeleton from "@/components/Skelton/AccountSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function VerifyEmailPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Suspense fallback={<AccountSkeleton />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
