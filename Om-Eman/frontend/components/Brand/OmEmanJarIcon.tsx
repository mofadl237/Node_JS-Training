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
          <g className="jar-spice-fill">
            <rect x="12" y="24" width="40" height="58" className="fill-primary/15" />
            <rect x="12" y="36" width="40" height="46" className="fill-accent/25" />
            <circle cx="21" cy="48" r="2.1" className="fill-primary/70 spice-grain" />
            <circle cx="30" cy="44" r="1.7" className="fill-accent/80 spice-grain" style={{ animationDelay: "0.3s" }} />
            <ellipse cx="40" cy="50" rx="2.6" ry="1.6" className="fill-primary/65 spice-grain" style={{ animationDelay: "0.6s" }} />
            <circle cx="25" cy="57" r="2.4" className="fill-accent/80 spice-grain" style={{ animationDelay: "0.9s" }} />
            <circle cx="36" cy="59" r="1.9" className="fill-primary/75 spice-grain" style={{ animationDelay: "1.2s" }} />
            <ellipse cx="46" cy="62" rx="2.2" ry="1.4" className="fill-accent/70 spice-grain" style={{ animationDelay: "0.45s" }} />
            <circle cx="19" cy="67" r="1.8" className="fill-primary/70 spice-grain" style={{ animationDelay: "0.75s" }} />
            <circle cx="33" cy="70" r="2.3" className="fill-accent/80 spice-grain" style={{ animationDelay: "1.05s" }} />
            <ellipse cx="43" cy="73" rx="2.5" ry="1.5" className="fill-primary/70 spice-grain" style={{ animationDelay: "1.35s" }} />
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
