import type { TOrderStatus } from "@/interface";

export type TTrackStatusTone = "neutral" | "success" | "danger";

const DANGER_STATUSES: ReadonlySet<TOrderStatus> = new Set<TOrderStatus>([
  "CANCELED",
  "FAILED_DELIVERY",
]);

export const trackStatusTone = (status: TOrderStatus): TTrackStatusTone => {
  if (status === "DELIVERED") return "success";
  if (DANGER_STATUSES.has(status)) return "danger";
  return "neutral";
};
