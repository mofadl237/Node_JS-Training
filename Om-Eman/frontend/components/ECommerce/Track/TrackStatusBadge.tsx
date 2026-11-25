"use client";

import { memo } from "react";
import type { TOrderStatus } from "@/interface";
import type { TTrackStatusTone } from "@/lib/trackStatusTone";
import { trackStatusTone } from "@/lib/trackStatusTone";
import { cn } from "@/lib/utils";

interface IProps {
  status: TOrderStatus;
  label: string;
  className?: string;
}

const TONE_CLASS: Record<TTrackStatusTone, string> = {
  neutral: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

const TrackStatusBadge = ({ status, label, className }: IProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
      TONE_CLASS[trackStatusTone(status)],
      className,
    )}
  >
    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
    {label}
  </span>
);

export default memo(TrackStatusBadge);
