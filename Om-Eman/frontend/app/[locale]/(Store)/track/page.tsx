import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import TrackSection from "@/components/ECommerce/Track/TrackSection";
import TrackSkeleton from "@/components/Skelton/TrackSkeleton";

export { generateMetadata } from "./metadata";

interface IProps {
  params: Promise<{ locale: string }>;
}

export default async function TrackPage({ params }: IProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Suspense fallback={<TrackSkeleton />}>
        <TrackSection />
      </Suspense>
    </div>
  );
}
