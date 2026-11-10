"use client";

import { forwardRef, useCallback, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField, type ITextFieldProps } from "../TextField/TextField";
import styles from "./PasswordField.module.scss";

interface IPasswordFieldProps
  extends Omit<ITextFieldProps, "type" | "trailingSlot"> {
  showLabel: string;
  hideLabel: string;
}

export const PasswordField = forwardRef<HTMLInputElement, IPasswordFieldProps>(
  function PasswordField({ showLabel, hideLabel, ...props }, ref) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
      setIsVisible((current) => !current);
    }, []);

    return (
      <TextField
        {...props}
        ref={ref}
        type={isVisible ? "text" : "password"}
        dir="ltr"
        trailingSlot={
          <button
            type="button"
            className={styles.toggle}
            onClick={toggleVisibility}
            aria-label={isVisible ? hideLabel : showLabel}
            aria-pressed={isVisible}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
    );
  },
);
