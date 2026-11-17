import type { ReactNode } from "react";

// Entry-only page transition (B8) — pure CSS (animate-page-in, defined in
// styles/animations.css). template.tsx remounts on every navigation, so the
// animation replays per page. No exit, no motion, no inline styles, so the
// server HTML is never stuck at opacity 0 (SSR-visible rule).
export default function PageTransition({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
