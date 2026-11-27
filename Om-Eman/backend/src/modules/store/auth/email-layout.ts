import type { TAuthLocale } from "./types.js";

// Email clients ignore external CSS and CSS variables, so the brand palette
// (mirrors the storefront "zafran" theme tokens) is inlined here on purpose.
const COLORS = {
  paper: "#fbf4e6",
  surface: "#fffbf2",
  surface2: "#f3e7ce",
  ink: "#2b1a12",
  inkSoft: "#6e574a",
  primary: "#b8451f",
  onPrimary: "#fff6ea",
  accent: "#e0a100",
} as const;

const FONT_STACK = "Tahoma, 'Segoe UI', Arial, sans-serif";

export interface IEmailLayoutInput {
  locale: TAuthLocale;
  brand: string;
  preheader: string;
  heading: string;
  greeting: string;
  paragraphs: readonly string[];
  ctaLabel: string;
  ctaUrl: string;
  fallbackLabel: string;
  notes: readonly string[];
  footer: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string, color: string, size: number): string {
  return `<p style="margin:0 0 16px;font-size:${size}px;line-height:1.8;color:${color};">${escapeHtml(text)}</p>`;
}

function button(label: string, url: string): string {
  const href = escapeHtml(url);
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;"><tr><td align="center" bgcolor="${COLORS.primary}" style="border-radius:8px;"><a href="${href}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:${COLORS.onPrimary};text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a></td></tr></table>`;
}

export function renderEmailLayout(input: IEmailLayoutInput): string {
  const dir = input.locale === "ar" ? "rtl" : "ltr";
  const align = input.locale === "ar" ? "right" : "left";
  const url = escapeHtml(input.ctaUrl);
  const body = [
    paragraph(input.greeting, COLORS.ink, 16),
    ...input.paragraphs.map((text) => paragraph(text, COLORS.ink, 16)),
    button(input.ctaLabel, input.ctaUrl),
    paragraph(input.fallbackLabel, COLORS.inkSoft, 13),
    `<p dir="ltr" style="margin:0 0 20px;padding:12px;background:${COLORS.surface2};border-radius:6px;font-size:12px;line-height:1.6;color:${COLORS.ink};word-break:break-all;text-align:left;"><a href="${url}" style="color:${COLORS.primary};text-decoration:underline;">${url}</a></p>`,
    ...input.notes.map((text) => paragraph(text, COLORS.inkSoft, 13)),
  ].join("");

  return `<!DOCTYPE html>
<html lang="${input.locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(input.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${COLORS.paper};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:${COLORS.surface};border-radius:12px;overflow:hidden;font-family:${FONT_STACK};direction:${dir};text-align:${align};">
<tr><td style="background:${COLORS.primary};padding:20px 28px;text-align:${align};"><span style="font-size:22px;font-weight:bold;color:${COLORS.onPrimary};">${escapeHtml(input.brand)}</span></td></tr>
<tr><td style="height:4px;background:${COLORS.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:28px;text-align:${align};">
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.5;color:${COLORS.ink};">${escapeHtml(input.heading)}</h1>
${body}
</td></tr>
<tr><td style="padding:16px 28px;background:${COLORS.surface2};text-align:${align};font-size:12px;line-height:1.7;color:${COLORS.inkSoft};">${escapeHtml(input.footer)}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function renderEmailText(input: IEmailLayoutInput): string {
  return [
    input.heading,
    "",
    input.greeting,
    "",
    ...input.paragraphs.flatMap((text) => [text, ""]),
    `${input.ctaLabel}:`,
    input.ctaUrl,
    "",
    ...input.notes.flatMap((text) => [text, ""]),
    "--",
    input.footer,
  ].join("\n");
}
