# Visual assets (Gate 4 architecture)

Prepared structure for exclusive, owner-supplied visuals. **Do not invent or mark assets as available before they exist.** Only `brand/jar-mark.png` is currently present (derived crop from official `public/logo.png`, no redraw/distortion) — it may be replaced by a dedicated jar-only source asset when supplied.

## Folders
- `hero/` — home hero visuals (separate `hero-desktop.*` / `hero-mobile.*` when supplied). Integrate via Next `<Image>`/`StoreImage` with responsive `sizes`; keep text/logo as real frontend elements (not baked into images). Optional short muted looping brand video: place in `video/` with poster in `hero/` or `video/`.
- `banners/` — promotional/banner imagery (supplement/override store-managed URLs when supplied). Prefer Cloudinary or optimized local assets; below-fold/lazy by default.
- `categories/` — category imagery mapped by slug (e.g. `spices.jpg`, `herbs.jpg`, `gift-bundles.jpg`) when supplied; fallback remains token/icon.
- `brand/` — brand marks and supporting brand graphics derived only from official assets. `jar-mark.png` = crop of official logo for compact placements (pending dedicated jar-only asset if needed).
- `themes/` — optional per-theme decorative/background assets when supplied (must preserve all 4 theme identities).
- `video/` — optional short muted optimized looping brand video(s) + poster frames. No unnecessary autoplay; avoid mobile performance harm (respect `prefers-reduced-motion`, lazy/conditional loading, provide poster fallback).

## Naming
- Use descriptive kebab-case names: `hero-desktop.webp`, `hero-mobile.webp`, `banner-ramadan-desktop.jpg`, `category-spices.jpg`, `theme-zafran-pattern.svg`, `brand-video-poster.jpg`.
- Keep desktop/mobile variants explicit (`*-desktop`, `*-mobile`).

## Performance/implementation rules
- Use Next.js image optimization (`next/image`/`StoreImage`) for raster assets; provide explicit `sizes` and `alt` from content/messages. Mark only true LCP/above-fold hero media as priority/preload when integrated.
- Lazy load below-the-fold images (default). Prefer modern formats (WebP/AVIF) and appropriate dimensions when assets are supplied.
- No placeholder/fake product photography as final assets. Integration points must accept only real supplied paths; until then use existing fallbacks (token gradients/icons/placeholders already in UI).
- Keep all 4 theme identities intact; text and official logo remain frontend elements.
