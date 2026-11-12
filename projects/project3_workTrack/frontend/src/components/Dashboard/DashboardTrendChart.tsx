"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { IDashboardPeriod, IDashboardTrendPoint } from "@/src/lib/api/types";
import { formatDateOnly } from "@/src/lib/format/date";
import { DashboardPanel } from "./DashboardPanel";
import styles from "./DashboardTrendChart.module.scss";

interface IDashboardTrendChartProps {
  trend: IDashboardTrendPoint[];
  period: IDashboardPeriod;
}

const WIDTH = 720;
const HEIGHT = 240;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 16;
const PLOT_TOP = 16;
const PLOT_BOTTOM = 34;
const PLOT_WIDTH = WIDTH - PLOT_LEFT - PLOT_RIGHT;
const PLOT_HEIGHT = HEIGHT - PLOT_TOP - PLOT_BOTTOM;

const clampRate = (value: number): number =>
  Math.min(Math.max(value, 0), 100);

const formatAxisDate = (value: string, locale: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export function DashboardTrendChart({
  trend,
  period,
}: IDashboardTrendChartProps) {
  const t = useTranslations("Dashboard.trend");
  const locale = useLocale();
  const geometry = useMemo(() => {
    const getX = (index: number): number =>
      PLOT_LEFT +
      (trend.length === 1
        ? PLOT_WIDTH / 2
        : (index / (trend.length - 1)) * PLOT_WIDTH);
    const getY = (rate: number): number =>
      PLOT_TOP + (1 - clampRate(rate) / 100) * PLOT_HEIGHT;
    const points = trend.map((point, index) => ({
      x: getX(index),
      y: getY(point.attendanceRate),
      point,
    }));
    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
      )
      .join(" ");
    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(
            PLOT_TOP + PLOT_HEIGHT
          ).toFixed(2)} L ${points[0].x.toFixed(2)} ${(
            PLOT_TOP + PLOT_HEIGHT
          ).toFixed(2)} Z`
        : "";
    const rawLabelIndices = [
      0,
      Math.round((trend.length - 1) / 4),
      Math.round((trend.length - 1) / 2),
      Math.round((trend.length - 1) * 0.75),
      trend.length - 1,
    ];
    const labelIndices = [...new Set(rawLabelIndices)];
    const gridLines = [0, 25, 50, 75, 100].map((rate) => ({
      rate,
      y: getY(rate),
    }));

    return { points, linePath, areaPath, labelIndices, gridLines };
  }, [trend]);

  return (
    <DashboardPanel
      title={t("title")}
      description={t("description", {
        from: formatDateOnly(period.from, locale),
        to: formatDateOnly(period.to, locale),
      })}
    >
      {trend.length === 0 ? (
        <p className={styles.empty}>{t("empty")}</p>
      ) : (
        <div className={styles.chartWrap}>
          <svg
            className={styles.chart}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={t("ariaLabel")}
          >
            {geometry.gridLines.map((line) => (
              <g key={line.rate}>
                <line
                  className={styles.gridLine}
                  x1={PLOT_LEFT}
                  x2={WIDTH - PLOT_RIGHT}
                  y1={line.y}
                  y2={line.y}
                />
                <text
                  className={styles.axisLabel}
                  x={PLOT_LEFT - 8}
                  y={line.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {line.rate}%
                </text>
              </g>
            ))}

            <path className={styles.area} d={geometry.areaPath} />
            <path className={styles.line} d={geometry.linePath} />

            {geometry.labelIndices.map((index) => {
              const point = geometry.points[index];

              if (!point) return null;

              return (
                <g key={point.point.date}>
                  <circle
                    className={styles.point}
                    cx={point.x}
                    cy={point.y}
                    r={3.5}
                  >
                    <title>
                      {formatAxisDate(point.point.date, locale)}:{" "}
                      {point.point.attendanceRate}%
                    </title>
                  </circle>
                  <text
                    className={styles.axisLabel}
                    x={point.x}
                    y={HEIGHT - 10}
                    textAnchor="middle"
                  >
                    {formatAxisDate(point.point.date, locale)}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className={styles.legend}>
            <span className={styles.legendDot} aria-hidden="true" />
            {t("rate")}
          </div>
        </div>
      )}
    </DashboardPanel>
  );
}
