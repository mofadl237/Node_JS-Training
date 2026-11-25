import { customerTokenSchema } from "@/validation/customerAuth";

const CUSTOMER_TOKEN_KEY = "oe.customer.session";
const CUSTOMER_SESSION_EVENT = "oe.customer.session.changed";

const notifySessionChange = (): void => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CUSTOMER_SESSION_EVENT));
  }
};

export const saveCustomerToken = (token: string): void => {
  customerTokenSchema.parse(token);
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    notifySessionChange();
  }
};

export const readCustomerToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(CUSTOMER_TOKEN_KEY);
  if (!raw) return null;
  const parsed = customerTokenSchema.safeParse(raw);
  if (!parsed.success) {
    window.sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
    return null;
  }
  return parsed.data;
};

export const clearCustomerToken = (): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
    notifySessionChange();
  }
};

export const subscribeCustomerSession = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent): void => {
    if (event.key === CUSTOMER_TOKEN_KEY) onStoreChange();
  };

  window.addEventListener(CUSTOMER_SESSION_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CUSTOMER_SESSION_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
};

export const getCustomerSessionSnapshot = (): string | null => readCustomerToken();

export const getServerCustomerSessionSnapshot = (): null => null;
