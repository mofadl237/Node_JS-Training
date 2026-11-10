"use client";

import type { ReactNode } from "react";
import styles from "./ModulePlaceholder.module.scss";

interface IModulePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  notice: string;
  icon: ReactNode;
}

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  notice,
  icon,
}: IModulePlaceholderProps) {
  return (
    <section className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.notice}>{notice}</p>
    </section>
  );
}
