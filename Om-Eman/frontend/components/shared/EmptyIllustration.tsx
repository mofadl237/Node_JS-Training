// Simple empty-state illustration (C6) — tokens only (currentColor), no text.
export const EmptyIllustration = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <rect x="8" y="16" width="80" height="48" rx="8" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 32h32M24 40h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M60 8c-4 6-2 12 2 14 4-2 6-8 2-14h-4Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M62 22v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
