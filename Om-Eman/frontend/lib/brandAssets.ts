/**
 * Central brand/storefront asset paths (Gate 4).
 * Only list assets that actually exist in `public/`. Do not invent supplied assets.
 * When owner supplies hero/banner/category/theme/video files, add their real paths here
 * and wire components to consume them (fallbacks remain when null).
 */
export const BRAND_ASSETS = {
  // Derived from official public/logo.png (crop, no redraw/distortion). Replace with a
  // dedicated jar-only source asset when provided for optimal small-size clarity.
  jarMark: "/assets/brand/jar-mark.png",
  fullLogo: "/logo.png",
  hero: {
    desktop: null as string | null,
    mobile: null as string | null,
    poster: null as string | null,
  },
  brandVideo: {
    src: null as string | null,
    poster: null as string | null,
  },
} as const;
