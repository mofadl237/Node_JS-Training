"use client";

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from "react";
import styles from "./SelectField.module.scss";

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly ISelectOption[];
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, ISelectFieldProps>(
  function SelectField(
    {
      label,
      options,
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
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    return (
      <div
        className={[styles.field, containerClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>

        <select
          {...props}
          ref={ref}
          id={selectId}
          className={[styles.select, error ? styles.invalid : null, className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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
