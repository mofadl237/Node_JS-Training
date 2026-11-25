import type { TOrderStatus, TPaymentStatus } from "@/interface";
import type { TLocale } from "@/lib/locale";

export type TTrackEtaKey =
  | "track.eta.range"
  | "track.eta.single"
  | "track.eta.pending";

export interface ITrackEtaValues {
  min?: number;
  max?: number;
  days?: number;
}

export interface ITrackEtaMessage {
  key: TTrackEtaKey;
  values?: ITrackEtaValues;
}

const DATE_LOCALES: Record<TLocale, string> = {
  ar: "ar-EG",
  en: "en-GB",
};

export const formatTrackDate = (value: string | null, locale: TLocale): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const trackStatusKey = (status: TOrderStatus): `track.status.${TOrderStatus}` =>
  `track.status.${status}`;

export const trackPaymentStatusKey = (
  status: TPaymentStatus,
): `track.paymentStatus.${TPaymentStatus}` => `track.paymentStatus.${status}`;

export const trackEtaMessage = (
  min: number | null,
  max: number | null,
): ITrackEtaMessage => {
  if (min === null || max === null) return { key: "track.eta.pending" };
  if (min === max) return { key: "track.eta.single", values: { days: min } };
  return { key: "track.eta.range", values: { min, max } };
};
