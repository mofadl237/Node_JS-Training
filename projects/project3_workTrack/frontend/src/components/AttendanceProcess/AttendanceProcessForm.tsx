"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendanceProcess } from "@/src/hooks/useAttendanceProcess";
import { getTodayDateInputValue } from "@/src/lib/format/date-input";
import type { IAttendanceProcessPayload } from "@/src/lib/api/types";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { TextField } from "@/src/components/ui/TextField/TextField";
import { AttendanceProcessResult } from "./AttendanceProcessResult";
import styles from "./AttendanceProcess.module.scss";

type TProcessMode = "single" | "range";

interface IFormErrors {
  date?: string;
  from?: string;
  to?: string;
}

const MAX_RANGE_DAYS = 31;

const getRangeDiffDays = (from: string, to: string): number => {
  const start = new Date(`${from}T00:00:00.000Z`).getTime();
  const end = new Date(`${to}T00:00:00.000Z`).getTime();

  return Math.round((end - start) / 86_400_000);
};

export function AttendanceProcessForm() {
  const t = useTranslations("AttendanceProcess");
  const { process, result, error, isProcessing } = useAttendanceProcess();
  const today = getTodayDateInputValue();
  const [mode, setMode] = useState<TProcessMode>("single");
  const [date, setDate] = useState(today);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [errors, setErrors] = useState<IFormErrors>({});

  const validate = useCallback((): boolean => {
    const nextErrors: IFormErrors = {};

    if (mode === "single") {
      if (!date) nextErrors.date = t("validation.dateRequired");
    } else {
      if (!from) nextErrors.from = t("validation.fromRequired");
      if (!to) nextErrors.to = t("validation.toRequired");

      if (from && to) {
        if (from > to) {
          nextErrors.to = t("validation.rangeInvalid");
        } else if (getRangeDiffDays(from, to) > MAX_RANGE_DAYS) {
          nextErrors.to = t("validation.rangeTooLong");
        }
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [date, from, mode, t, to]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validate()) return;

      const payload: IAttendanceProcessPayload =
        mode === "single" ? { date } : { from, to };

      void process(payload);
    },
    [date, from, mode, process, to, validate],
  );

  const handleModeChange = useCallback((nextMode: TProcessMode) => {
    setMode(nextMode);
    setErrors({});
  }, []);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{t("cardTitle")}</h3>
        <p className={styles.cardDescription}>{t("cardDescription")}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.modeField}>
          <span className={styles.modeLabel}>{t("modeLabel")}</span>
          <div
            className={styles.modeToggle}
            role="group"
            aria-label={t("modeLabel")}
          >
            <button
              type="button"
              className={[
                styles.modeButton,
                mode === "single" ? styles.modeActive : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={mode === "single"}
              onClick={() => handleModeChange("single")}
            >
              {t("mode.single")}
            </button>
            <button
              type="button"
              className={[
                styles.modeButton,
                mode === "range" ? styles.modeActive : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={mode === "range"}
              onClick={() => handleModeChange("range")}
            >
              {t("mode.range")}
            </button>
          </div>
        </div>

        <div className={styles.fields}>
          {mode === "single" ? (
            <TextField
              label={t("dateLabel")}
              type="date"
              value={date}
              error={errors.date}
              onChange={(event) => {
                setDate(event.target.value);
                setErrors((current) => ({ ...current, date: undefined }));
              }}
            />
          ) : (
            <>
              <TextField
                label={t("fromLabel")}
                type="date"
                value={from}
                error={errors.from}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setErrors((current) => ({ ...current, from: undefined }));
                }}
              />
              <TextField
                label={t("toLabel")}
                type="date"
                value={to}
                error={errors.to}
                onChange={(event) => {
                  setTo(event.target.value);
                  setErrors((current) => ({ ...current, to: undefined }));
                }}
              />
            </>
          )}
        </div>

        {error && <Alert title={t("errorTitle")}>{error}</Alert>}

        {result && <AttendanceProcessResult result={result} />}

        <div className={styles.actions}>
          <Button
            type="submit"
            size="lg"
            isLoading={isProcessing}
            leadingIcon={<Play size={18} />}
          >
            {isProcessing ? t("processing") : t("submit")}
          </Button>
        </div>
      </form>
    </section>
  );
}
