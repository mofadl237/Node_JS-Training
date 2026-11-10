import styles from "./Skeleton.module.scss";

interface ISkeletonProps {
  className?: string;
}

export function Skeleton({ className }: ISkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
