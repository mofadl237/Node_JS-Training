import { Clock3 } from "lucide-react";
import styles from "./BrandMark.module.scss";

interface IBrandMarkProps {
  name: string;
  tagline: string;
  tone?: "dark" | "light";
  compact?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function BrandMark({
  name,
  tagline,
  tone = "dark",
  compact = false,
  iconOnly = false,
  className,
}: IBrandMarkProps) {
  return (
    <div
      className={[styles.brand, styles[tone], className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.mark} aria-hidden="true">
        <Clock3 size={21} strokeWidth={2.2} />
      </span>
      {!iconOnly && (
        <span className={styles.copy}>
          <span className={styles.name}>{name}</span>
          {!compact && <span className={styles.tagline}>{tagline}</span>}
        </span>
      )}
    </div>
  );
}
