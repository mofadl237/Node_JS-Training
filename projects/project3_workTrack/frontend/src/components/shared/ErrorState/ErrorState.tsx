"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "../../ui/Button/Button";
import styles from "./ErrorState.module.scss";

interface IErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: IErrorStateProps) {
  return (
    <section className={styles.error} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <AlertCircle size={24} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Button variant="secondary" onClick={onRetry}>
        {retryLabel}
      </Button>
    </section>
  );
}
