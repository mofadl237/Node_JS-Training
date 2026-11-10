"use client";

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from "react";
import styles from "./TextAreaField.module.scss";

export interface ITextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  ITextAreaFieldProps
>(function TextAreaField(
  {
    label,
    error,
    hint,
    containerClassName,
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div
      className={[styles.field, containerClassName].filter(Boolean).join(" ")}
    >
      <label className={styles.label} htmlFor={textareaId}>
        {label}
      </label>

      <textarea
        {...props}
        ref={ref}
        id={textareaId}
        className={[styles.textarea, error ? styles.invalid : null, className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
