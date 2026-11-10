import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import styles from "./Alert.module.scss";

type TAlertVariant = "error" | "success" | "info";

interface IAlertProps {
  variant?: TAlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
}

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function Alert({
  variant = "error",
  title,
  children,
  className,
}: IAlertProps) {
  const Icon = icons[variant];

  return (
    <div
      className={[styles.alert, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
}
