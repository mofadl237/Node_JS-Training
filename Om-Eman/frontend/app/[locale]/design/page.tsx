import { setRequestLocale } from "next-intl/server";
import { DesignHeader } from "@/components/design/DesignHeader";
import { ThemeRow } from "@/components/design/ThemeRow";
import { FontRow } from "@/components/design/FontRow";
import { TokenRow } from "@/components/design/TokenRow";
import { UiRow } from "@/components/design/UiRow";
import { ComponentsRow } from "@/components/design/ComponentsRow";
import { MotionRow } from "@/components/design/MotionRow";
import { ScrollEffects } from "@/components/Animation/ScrollEffects";

export { generateMetadata } from "./metadata";
const DesignPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 py-16">
      <DesignHeader locale={locale} />
      <ScrollEffects />
      <ThemeRow />
      <FontRow />
      <TokenRow />
      <UiRow />
      <ComponentsRow />
      <MotionRow />
    </main>
  );
};

export default DesignPage;
