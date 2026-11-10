import type { IAuthSession, IAuthUser } from "../api/types";

const SESSION_KEY = "worktrack.session";

const isAuthUser = (value: unknown): value is IAuthUser => {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Partial<IAuthUser>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
};

export const tokenStorage = {
  read(): IAuthSession | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as Partial<IAuthSession>;

      if (
        !isAuthUser(parsed.user) ||
        typeof parsed.token !== "string" ||
        typeof parsed.refreshToken !== "string"
      ) {
        window.localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return {
        user: parsed.user,
        token: parsed.token,
        refreshToken: parsed.refreshToken,
      };
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  write(session: IAuthSession): void {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clear(): void {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(SESSION_KEY);
  },
};
