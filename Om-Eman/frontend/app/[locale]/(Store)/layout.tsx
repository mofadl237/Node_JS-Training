import { Suspense } from "react";
import type { ReactNode } from "react";
import { ScrollEffects } from "@/components/Animation/ScrollEffects";
import { SkipLink } from "@/components/ECommerce/SkipLink";
import { StoreHeader } from "@/components/ECommerce/Header/StoreHeader";
import { StoreFooter } from "@/components/ECommerce/Footer/StoreFooter";
import { WhatsAppFab } from "@/components/ECommerce/WhatsAppFab";
import { StoreJsonLd } from "@/components/ECommerce/StoreJsonLd";
import { FooterSkeleton } from "@/components/Skelton/FooterSkeleton";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <StoreHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <StoreFooter />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppFab />
      </Suspense>
      <Suspense fallback={null}>
        <StoreJsonLd />
      </Suspense>
      <ScrollEffects />
    </>
  );
}
