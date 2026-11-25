export const categoryHref = (slug: string) => ({
  pathname: "/products",
  query: { category: slug },
});

export const productHref = (slug: string) => `/products/${slug}`;

export const PRODUCTS_HREF = "/products";

export const CART_HREF = "/cart";

export const CHECKOUT_HREF = "/checkout";

export const CHECKOUT_SUCCESS_HREF = "/checkout/success";

export const TRACK_HREF = "/track";

export const ACCOUNT_HREF = "/account";
export const ACCOUNT_LOGIN_HREF = "/account/login";
export const ACCOUNT_REGISTER_HREF = "/account/register";
export const ACCOUNT_VERIFY_EMAIL_HREF = "/account/verify-email";
export const ACCOUNT_FORGOT_PASSWORD_HREF = "/account/forgot-password";
export const ACCOUNT_RESET_PASSWORD_HREF = "/account/reset-password";

export const SEARCH_PATH = "/search";

export const searchHref = (q: string) => ({
  pathname: SEARCH_PATH,
  query: { q: q.trim() },
});
