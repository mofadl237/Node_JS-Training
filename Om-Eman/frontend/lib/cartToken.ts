const KEY = "om_cart_token";
const CART_TOKEN_CHANGE_EVENT = "cart-token-change";

export const readCartToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(KEY) ?? undefined;
};

export const writeCartToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, token);
    window.dispatchEvent(new Event(CART_TOKEN_CHANGE_EVENT));
  } catch {
    // ignore storage failures (private mode/quota)
  }
};

export const getServerCartToken = (): string | undefined => undefined;

export const subscribeCartToken = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => undefined;
  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(CART_TOKEN_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CART_TOKEN_CHANGE_EVENT, notify);
  };
};
