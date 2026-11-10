import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./TextField.module.scss";

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
  function TextField(
    {
      label,
      error,
      hint,
      leadingIcon,
      trailingSlot,
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    return (
      <div
        className={[styles.field, containerClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>

        <div
          className={[styles.control, error ? styles.invalid : null]
            .filter(Boolean)
            .join(" ")}
        >
          {leadingIcon && (
            <span className={styles.leading} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            className={[styles.input, className].filter(Boolean).join(" ")}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />

          {trailingSlot && <span className={styles.trailing}>{trailingSlot}</span>}
        </div>

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
  },
);
