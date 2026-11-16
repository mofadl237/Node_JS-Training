# اليوم 1 — Foundation (مسار A) — تاسكتات تنفيذية

> آخر تحديث: 2026-11-16. ده ملف التنفيذ للـ AI — مكتفٍ لوحده.
> المصادر الملزمة (اقراهم الأول):
> 1. `frontend/AGENTS.md` — قواعد التقطيع والتسمية (غير قابلة للنقاش)
> 2. `frontend/docs/DESIGN_SYSTEM.md` — الألوان والثيمات والحركة (الأقسام 1-5)
> 3. `frontend/docs/FRONTEND_TASKS_10_DAYS.md` — القسم 0 والقسم 2 واليوم 1
> 4. `frontend/docs/PROGRESS.md` — سجل اللي تم و اللي فاضل (حدّثه بعد كل خطوة)

---

## 0) سياق المشروع (عشان تعرف بتبني إيه)

- متجر "أم إيمان" للبهارات والأعشاب — أرضي، عطارة، مصري. **ممنوع ألوان purple/template/AI-ish.**
- الباك جاهز بالكامل على `http://localhost:3000`، وكل الـ store API تحت `/api/store/*`
  (العقد الكامل في `backend/src/config/swagger-store.ts` + `backend/docs/STORE_BACKEND_TASKS.md`).
- شكل الرد الموحد: `{ success, message, data?, meta? }` والخطأ `{ success: false, message, code }`.
- الفرونت على **بورت 3001**، والباك 3000 (موجود في CORS).
- البيئة: Next **16.4.5** (مش 15!) + React 19.3 + Tailwind v4 + `cacheComponents: true`.

### فروق Next 16 المهمة (AGENTS.md كاتب Next 15 — طبّق كده بدل كده)
1. ملف الـ middleware اسمه **`proxy.ts`** في جذر المشروع (مش `middleware.ts`).
2. `cacheComponents` مفعّل: أي قراءة `cookies()`/`headers()` في layout/page يخلّي المسار dynamic —
   **ممنوع نقرا cookie الثيم في root layout**؛ استخدم inline script في `<head>` (DESIGN_SYSTEM §2.4).
3. `params` و `searchParams` async: `params: Promise<{ locale: string }>`.

---

## 1) الخطوة 1 — تثبيت المكتبات (قبل أي كود)

```bash
npm install @reduxjs/toolkit react-redux next-intl motion react-hook-form \
  @hookform/resolvers zod sonner lucide-react class-variance-authority \
  clsx tailwind-merge
```

- **`motion`** مش `framer-motion` (الترشيح المعتمد في DESIGN_SYSTEM §5.4 — نفس API، من `motion/react`).
- shadcn primitives (Button, Input, Dialog...) هتتعمل يدوي بـ cva + tailwind — **مش هنستخدم shadcn CLI** عشان نتحكم في الحجم.
- ممنوع تثبيت: recharts (مش محتاجينه اليوم)، lenis (قرار لاحق)، أي حاجة تانية.

**Check 1:** `npm run lint && npm run build` ينجحوا بعد التثبيت.

---

## 2) الخطوة 2 — i18n + RTL (الهيكل الأساسي)

| الملف | المسؤولية |
| --- | --- |
| `i18n/routing.ts` | `defineRouting` — locales `["ar","en"]`, default `"ar"`, `localePrefix: "always"` |
| `i18n/navigation.ts` | `createNavigation(routing)` — Link/redirect/usePathname/useRouter المحلية |
| `i18n/request.ts` | `getRequestConfig` — يقرا الـ locale ويحمّل الـ messages |
| `proxy.ts` | `createMiddleware(routing)` مع matcher يستبعد `_next`, `api`, ملفات static |
| `messages/ar.json` | namespace واحد لليوم ده: `design` (عناوين صفحة /design) + `errors` + `notFound` |
| `messages/en.json` | نفس المفاتيح بالإنجليزي |
| `app/[locale]/layout.tsx` | Root layout: `<html lang dir>` حسب الـ locale (ar→rtl) + الخطوط + Providers — **≤ 40 سطر** |
| `app/[locale]/page.tsx` | صفحة placeholder بسيطة (H1 واحد من الـ messages) — بتتشال في يوم المتجر |

قواعد:
- خطوط `next/font/google` بـ `subsets: ["arabic","latin"]` + `display: "swap"`:
  Display: **El Messiri** (وزن 400/700) · Body: **IBM Plex Sans Arabic** (400/600).
  الاسمين كـ CSS variables: `--font-display`, `--font-body` (نثبّت الاختيار بعد ما نشوفهم في /design).
- ممنوع أي نص عربي hard-coded في JSX — كل حاجة من `useTranslations`.
- `app/layout.tsx` القديم (الجذر) بيتشال — `[locale]/layout.tsx` هو اللي بيقول `<html>`.

**Check 2:** `npm run build` — الصفحة `/ar` تفتح RTL وبـ `/?lang=ar` redirect شغال، و `/en` LTR.

---

## 3) الخطوة 3 — Design Tokens (DESIGN_SYSTEM §2 + §4 — بالقيم حرفيًا)

| الملف | المسؤولية |
| --- | --- |
| `styles/tokens.css` | `@theme`: الأسماء الـ semantic (`--color-paper/surface/surface-2/ink/ink-soft/primary/on-primary/accent/glow/success/danger/card-1..4`) + spacing/radius (`sm 8/md 14/lg 22/pill`)/shadows (ملوّنة بني: `rgb(43 26 18 / .12)` × 3 مستويات)/motion tokens (`--dur-fast 150ms`, `--dur-base 300ms`, `--dur-slow 600ms`, `--ease-out cubic-bezier(.22,1,.36,1)`) |
| `styles/themes.css` | `[data-theme="zafran" | "attar" | "cinnamon" | "hibiscus"]` — القيم من DESIGN_SYSTEM §2.2 **بالحرف** |
| `styles/animations.css` | keyframes للـ ambient بس: shimmer + pulse-ring + (confetti لاحقًا) |
| `app/globals.css` | `@import` للتلاتة + `@import "tailwindcss"` — **≤ 30 سطر** |

قيم الثيمات (§2.2):

```txt
zafran    (افتراضي): paper #FBF4E6  ink #2B1A12  primary #B8451F  accent #E0A100  glow #F2B134
attar     :          paper #F6F3E8  ink #1F2A1C  primary #3F6B3A  accent #C9822B  glow #9BC46B
cinnamon  (داكن):    paper #1E130E  ink #F6E9D2  primary #E8892B  accent #F2C14E  glow #F59E3B
hibiscus  :          paper #FBF1EE  ink #2A1216  primary #A3203A  accent #D9902F  glow #E5566F
```

قواعد صارمة (§1):
- **ممنوع أي لون خام (hex) في أي component** — كل الألوان من tokens (`bg-surface`, `text-ink`, `bg-primary`...).
- `success`/`danger` ثابتين في كل الثيمات.
- ابدأ بأسماء Tailwind v4: داخل `@theme` الاسم `--color-surface` يولّد `bg-surface` أوتوماتيك.
- `font-variant-numeric: tabular-nums` utility للأرقام/الأسعار.
- RTL logical utilities فقط (`ms/me/ps/pe/start/end`).

**Check 3:** كل كلاس من الـ tokens بيظهر في الـ autocomplete وينفع في JSX.

---

## 4) الخطوة 4 — الثيم + ThemeSwitcher (DESIGN_SYSTEM §2.4)

| الملف | المسؤولية |
| --- | --- |
| `lib/theme.ts` | `TThemeName` union + `THEMES` const (الاسم + paper/primary hex للعرض) + قراية/كتابة cookie `oe-theme` (SSR-safe) + `DEFAULT_THEME = "zafran"` |
| `components/shared/ThemeScript.tsx` | inline `<script>` في `<head>` يقرا الـ cookie ويحط `data-theme` على `<html>` **قبل أول paint** (بدون وميض) + لو `prefers-color-scheme: dark` وأول زيارة → "cinnamon" |
| `Providers/ThemeProvider.tsx` | client: يوفّر context صغير (theme + setTheme) يكتب الـ cookie ويحدّث `data-theme` |
| `components/shared/ThemeSwitcher.tsx` | زرار palette يفتح popover فيه 4 دواير (كل دايرة نصفين paper+primary) — stagger + الـ المختارة عليها check بـ `motion/react` |

قواعد:
- **الـ root layout يفضل static** — ممنوع `cookies()` فيه (شوف §0 فروق Next 16).
- الاختيار بيتحفظ في cookie (بيفضل لزيارة جاية).
- transition بين الثيمات: fade بسيط كفاية اليوم (الـ circle-expand من View Transitions API — تأجيل لاحق).

**Check 4:** بدّل الثيم من الـ popover → الموقع كله يتغير من غير reload ومن غير وميض، والثيم بيفضل بعد refresh.

---

## 5) الخطوة 5 — RTK Query + الـ store الأساسي (خطة القسم 2)

| الملف | المسؤولية |
| --- | --- |
| `lib/config.ts` | `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL` (بدون قيمة hard-coded في أي service) |
| `.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3000` + `NEXT_PUBLIC_SITE_URL=http://localhost:3001` |
| `interface/api.ts` | `IApiResponse<T>` + `IApiError` (success/message/code) + `IPaginationMeta` (page/limit/total/totalPages/hasNextPage/hasPreviousPage) + `IPaginated<T>` |
| `store/baseApi.ts` | `createApi` بـ `fetchBaseQuery({ baseUrl })` + `baseQueryWithReauth`-style wrapper يفكّ الـ envelope: يرجّع `data`، ولو `success:false` يرمي `IApiError` مع الـ `code` — **من غير endpoints، بنرث منه لاحقًا** |
| `store/store.ts` | `configureStore` + `baseApi.reducer` + middleware + `RootState`/`AppDispatch` typed |
| `hooks/useAppDispatch.ts` + `hooks/useAppSelector.ts` | typed hooks |
| `Providers/ReduxProvider.tsx` | `Provider` client component |

- **تجربة اتصال واحدة ممنوعة تتعمل في component** — بس نجهز الـ baseApi جاهز للاستخدام غدًا.
- لو `NEXT_PUBLIC_API_URL` مش موجود → error واضح وقت البناء (مفيش URL مخفي).

**Check 5:** `npm run build` أخضر والـ store مربوط في الـ Providers.

---

## 6) الخطوة 6 — Animation kit (طبقات DESIGN_SYSTEM §5 — النسخة الأساسية لليوم 1)

> **مهم (كلمة المالك):** مش كل حاجة مرة واحدة — الهيكل الأول، والشكل/الحركة بنضبطها مع بعض
> في المتصفح بعد ما تشوفها. اليوم هنبني الـ wrappers فقط من غير تصميم نهائي.

| الملف (كلهم في `components/Animation/`) | الطبقة | مسؤولية |
| --- | --- | --- |
| `MotionProvider.tsx` | — | `LazyMotion` + `domAnimation` + `MotionConfig` (يحترم `prefers-reduced-motion`) |
| `FadeIn.tsx` | C | ظهور بـ `--dur-base` + `--ease-out` (prop: delay/direction) |
| `Stagger.tsx` | C | container variant + `StaggerItem` |
| `ScaleOnHover.tsx` | B | scale 1.02 + spring (stiffness 300 / damping 24) |
| `Shake.tsx` | C | x ±8 (للكوبون الغلط لاحقًا) |
| `CountUp.tsx` | C | رقم spring بـ `tabular-nums` — يبدأ لما يظهر (whileInView once) |
| `ScrollProgressBar.tsx` | C | `useScroll` + `scaleX` bar فوق الشاشة |
| `BackToTop.tsx` | C | يظهر بعد أول شاشة (الـ ring/progress حواليه تأجيل) |
| `Skeleton` shimmer utility | A | keyframe في `animations.css` — بيتستخدم في `components/ui/Skeleton.tsx` |

مؤجلة (مش النهاردة): FlyToCart · BorderBeam · Spotlight · PulseRing · Marquee · Confetti · PageTransition.

قواعد (§1 + §8):
- الـ ambient = CSS فقط، الحركة المتكررة transform+opacity بس، وكل حاجة توقف مع `prefers-reduced-motion`.

**Check 6:** تجربة سريعة في `/design`: FadeIn + Stagger + ScaleOnHover شغالين على موبايل.

---

## 7) الخطوة 7 — UI primitives (شكل شادcn يدوي بـ cva)

`components/ui/`: `Button.tsx` (variants: primary/soft/ghost + size sm/md/lg + press scale .97) ·
`Input.tsx` (forwardRef) · `Skeleton.tsx` (shimmer) · `Badge.tsx` (variants من tokens).

(Dialog/Table/Tabs/Select/Sheet/Toaster sonner → يوم 2 وقت ما اللوحة تحتاجهم — **ممنوع بناء عالِم**.)

**Check 7:** Button/Input/Badge/Skeleton ظاهرين في `/design`.

---

## 8) الخطوة 8 — صفحة `/design` (شاشة القرار — من DESIGN_SYSTEM §3)

`app/[locale]/design/page.tsx` (**≤ 30 سطر**) بتولّف sections من `components/design/`:

| الملف | المسؤولية |
| --- | --- |
| `components/design/ThemeRow.tsx` | الدواير الـ 4 من `THEMES` + ThemeSwitcher |
| `components/design/FontRow.tsx` | عينة عربية من El Messiri (display) و IBM Plex Sans Arabic (body) بجنب بعض |
| `components/design/TokenRow.tsx` | swatches لكل semantic token في الثيم الحالي |
| `components/design/UiRow.tsx` | Button variants + Input + Badge + Skeleton + FadeIn/Stagger/CountUp demo |

الهدف: المالك يفتح `/ar/design` ويقرر (الخط + الثيم الافتراضي) بالعين.

---

## 9) الخطوة 9 — SEO base + صفحات الخطأ (من خطة اليوم 1)

| الملف | المسؤولية |
| --- | --- |
| `lib/seo.ts` | `buildMetadata({ title, description, path, locale })` → Metadata مع canonical + `alternates.languages` (ar/en) + OpenGraph/Twitter — واحدة مكان كل صفحة |
| `components/shared/JsonLd.tsx` | `<script type="application/ld+json">` بـ props: `TOrganization | TJsonLdObject` |
| `app/[locale]/error.tsx` | رسالة مصرية محترمة من messages + زرار رجوع |
| `app/[locale]/not-found.tsx` | صفحة 404 بالاتنين اللغتين |
| `app/sitemap.ts` + `app/robots.ts` | skeleton ثابت لليوم (هيتملى بمنتجات في يوم المتجر) — robots بيسمح كل حاجة ما عدا `/design` |

مؤجل لليوم 8: `interface/index.ts` الكامل (IProduct/ICategory) + `validation/` barrel — **مش هنبني contracts من غير endpoint حقيقي نستهلكه** (قاعدة: من غير invented values).

---

## 10) معايير القبول (مطابقة للخطة §6)

- [ ] `npm run lint` + `npm run build` أخضر.
- [ ] ملفات ≤ 150 (خطر عند 200) — صفحات ≤ 30 سطر — كل ملف جملة واحدة.
- [ ] مفيش `any`/`@ts-ignore`/`as`/نص hard-coded/`console.log`/كود معلق.
- [ ] تسمية `I`/`T` + `camelCase` schemas + `PascalCase` components.
- [ ] RTL سليم (logical properties) + الثيم بيتبدل من غير وميض + `prefers-reduced-motion` محترم.
- [ ] مفيش endpoint مستهلك (baseApi جاهز بس) — مفيش لون خام في أي component.
- [ ] `frontend/docs/PROGRESS.md` اتحدّث: كل ملف اتعمل + ملاحظات + اللي شايله لليوم الجاي.

## 11) ممنوعات نهائية (زوّدت عليها من كلام المالك)

1. ممنوع SASS/SCSS — Tailwind بس مع tokens ثابتة.
2. ممنوع تعمل styles/animation نهائي من غير ما المالك يشوف في المتصفح — الهيكل + wrappers بس.
3. ممنوع ألوان خارج الـ tokens حتى لو "قريبة".
4. ممنوع تلمس `components/ui/*` كarchitecture — tokens وvariants بس.
5. ممنوع تفتح خطوة قبل اللي قبلها تتقفل (checks 1..9 بالترتيب).
