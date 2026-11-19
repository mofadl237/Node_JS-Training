export const categoryHref = (slug: string) => ({
  pathname: "/products",
  query: { category: slug },
});

export const productHref = (slug: string) => `/products/${slug}`;

export const CART_HREF = "/cart";
