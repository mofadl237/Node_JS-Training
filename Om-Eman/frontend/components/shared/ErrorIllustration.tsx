// Simple error-state illustration (C6) — tokens only (currentColor), no text.
export const ErrorIllustration = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <circle cx="48" cy="36" r="26" stroke="currentColor" strokeWidth="2.5" />
    <path d="M38 26l20 20M58 26L38 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 64h68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);
