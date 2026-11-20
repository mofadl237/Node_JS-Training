import { getTranslations } from "next-intl/server";
import { PriceTag } from "@/components/shared/PriceTag";
import type { IStorefrontBundleComponent } from "@/interface";
import { PackageSize } from "./PackageSize";

interface IProps {
  components: IStorefrontBundleComponent[];
}

export const BundleContents = async ({ components }: IProps) => {
  const t = await getTranslations("productDetail");
  const ordered = [...components].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-ink">{t("bundleTitle")}</h2>
      <ul className="space-y-3">
        {ordered.map((component) => {
          const name = component.componentPackage.nameAr ?? component.componentPackage.sku;
          return (
            <li key={component.componentPackage.sku} className="space-y-2 rounded-xl bg-surface p-4 shadow-rest">
              <p className="font-medium text-ink">
                {t("quantity", { quantity: component.quantity, name })}
              </p>
              <PackageSize
                sizeValue={component.componentPackage.sizeValue}
                sizeUnit={component.componentPackage.sizeUnit}
              />
              <PriceTag price={component.componentPackage.sellingPrice} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
