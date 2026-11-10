import type { ReactNode } from "react";
import styles from "./LoginFeatureCard.module.scss";

interface ILoginFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent: "brand" | "amber" | "clay";
  delay?: number;
  className?: string;
}

export function LoginFeatureCard({
  icon,
  title,
  description,
  accent,
  delay = 0,
  className,
}: ILoginFeatureCardProps) {
  return (
    <article
      className={[styles.card, styles[accent], className]
        .filter(Boolean)
        .join(" ")}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
