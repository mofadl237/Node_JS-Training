export const categoryHref = (slug: string) => ({
  pathname: "/products",
  query: { category: slug },
});

export const productHref = (slug: string) => `/products/${slug}`;

export const CART_HREF = "/cart";

export const CHECKOUT_HREF = "/checkout";

export const CHECKOUT_SUCCESS_HREF = "/checkout/success";

export const SEARCH_PATH = "/search";

export const searchHref = (q: string) => ({
  pathname: SEARCH_PATH,
  query: { q: q.trim() },
});
