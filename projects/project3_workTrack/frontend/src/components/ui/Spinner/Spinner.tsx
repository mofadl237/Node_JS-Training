import styles from "./Spinner.module.scss";

interface ISpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: ISpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[size], className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
}
