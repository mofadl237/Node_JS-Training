import { useId } from "react";

interface IProps {
  className?: string;
  size?: number | string;
  decorative?: boolean;
  label?: string;
  animated?: boolean;
}

export const OmEmanJarIcon = ({
  className,
  size = 32,
  decorative = true,
  label = "\u0623\u0645 \u0625\u064A\u0645\u0627\u0646",
  animated = false,
}: IProps) => {
  // 1- state
  const uid = useId().replace(/:/g, "");
  const clipId = `oe-jar-inner-${uid}`;
  const width = typeof size === "number" ? Math.round((size * 64) / 84) : size;
  const height = size;

  // 3- render
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 84"
      width={width}
      height={height}
      className={className}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      focusable="false"
    >
      {decorative ? null : <title>{label}</title>}
      <defs>
        <clipPath id={clipId}>
          <path d="M16 28h32v36a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V28z" />
        </clipPath>
      </defs>
      <rect x="22" y="8" width="20" height="6" rx="2.5" className="fill-surface-2 stroke-ink/20" strokeWidth="1.5" />
      <rect x="19" y="13" width="26" height="7" rx="3" className="fill-surface stroke-ink/25" strokeWidth="1.5" />
      <path
        d="M14 22h36v44a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12V22z"
        className="fill-surface/60 stroke-ink/30"
        strokeWidth="2"
      />
      <g clipPath={`url(#${clipId})`}>
        {animated ? (
          <g className="jar-fill-anim">
            <rect x="12" y="24" width="40" height="58" className="fill-accent/25" />
            <path d="M12 46c6-5 10 5 16 0s10 5 16 0s10 5 16 0v36H12z" className="fill-primary/30" />
            <circle cx="24" cy="52" r="2.2" className="fill-accent/70 herb-float" />
            <circle cx="36" cy="48" r="1.8" className="fill-primary/70 herb-float" style={{ animationDelay: "0.4s" }} />
            <circle cx="42" cy="56" r="1.8" className="fill-accent/70 herb-float" style={{ animationDelay: "0.8s" }} />
            <path d="M29 58c2.5-4 5-4 6.5 0c-2.5 2-4.5 2-6.5 0z" className="fill-primary/60 herb-float" style={{ animationDelay: "1s" }} />
          </g>
        ) : null}
      </g>
      <path d="M19 28c0 14-2 28 3 40" className="stroke-ink/10" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="18" y="40" width="28" height="14" rx="4" className="fill-paper/95 stroke-primary/35" strokeWidth="1.5" />
      <text
        x="32"
        y="49.5"
        textAnchor="middle"
        className="fill-ink font-body text-[7.5px] font-semibold"
      >
        {label}
      </text>
    </svg>
  );
};
