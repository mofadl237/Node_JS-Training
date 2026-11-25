/**
 * Centralized storefront social links and contact configuration.
 *
 * How to add/update social links:
 * 1) Set the platform URL string (e.g. "https://instagram.com/...") in `SOCIAL_LINKS`.
 * 2) Keep platforms you don't have as `null` (or empty string) — they will NOT render.
 * 3) Save the file: Footer icons appear automatically (no Footer component edits).
 * 4) Do not invent URLs. Only add real, owned/official profiles.
 *
 * Supported platforms: instagram, facebook, tiktok, youtube, x, snapchat, pinterest,
 * threads, linkedin, telegram (add other keys in the same shape if needed and extend
 * FooterSocial icon map).
 */
export type TSocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "x"
  | "snapchat"
  | "pinterest"
  | "threads"
  | "linkedin"
  | "telegram";

export const SOCIAL_LINKS: Record<TSocialPlatform, string | null> = {
  instagram: "https://www.instagram.com/om_eman.herbs/",
  facebook: "https://www.facebook.com/profile.php?id=61596692732641",
  tiktok: "https://www.tiktok.com/@om_eman.herbs",
  youtube: "https://www.youtube.com/@om_eman_herbs",
  x:null, //"https://x.com/omemanherbs"
  linkedin: null,
  telegram: null,

  snapchat: null,
  pinterest: null,
  threads: null,
};

export interface IContactPhone {
  /** Digits as provided/known locally; displayed as-is. */
  display: string;
  /** Message key under `footer` for an accessible label (e.g. "phonePrimary"). */
  labelKey: "phonePrimary" | "phoneSecondary";
  /**
   * If true, this number may be used as a WhatsApp contact (normalized via approved
   * Egyptian M-8 rules). Do NOT assume WhatsApp unless explicitly true.
   */
  isWhatsApp?: boolean;
}

export const CONTACT_PHONES: IContactPhone[] = [
  { display: "01033563649", labelKey: "phonePrimary" },
  { display: "01554491132", labelKey: "phoneSecondary" },
];

/** Explicit WhatsApp contact override (E.164/local, normalized by M-8). null = none configured. */
export const WHATSAPP_CONTACT: string | null = "01033563649";
