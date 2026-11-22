import { ProductCard } from "@/components/Card/ProductCard";
import type { IStoreProductCard } from "@/interface";

interface IProps {
  products: IStoreProductCard[];
  locale: string;
  heading?: string;
}

export const SearchResults = ({ products, locale, heading }: IProps) => (
  <section className="space-y-3" aria-label={heading}>
    {heading ? <h2 className="font-display text-xl text-ink">{heading}</h2> : null}
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  </section>
);
