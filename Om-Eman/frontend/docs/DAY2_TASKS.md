# اليوم 2 — إكمال الـ Foundation (مسار A) — تاسكات تنفيذية

> آخر تحديث: 2026-11-16. ملف مكتفٍ لوحده: أي AI ينفذه من غير ما يعتمد على الشات.
> **المدير/المراجع:** Claude (في نفس الشات). **المنفّذ:** أي AI تاني. **المالك:** صاحب المشروع (هو اللي بيشوف المتصفح ويقرر الشكل والحركة).

## 0) قواعد التعامل (اقراها الأول)

1. **الملفات هي مصدر الحقيقة، مش الشات.** لو الشات فيه كلام بيخالف الملفات → الملفات هي الصح. لو مش فاهم حاجة: اسأل، متخمّنش.
2. **منفّذ واحد بس بيعدّل في نفس الوقت.** لو المالك بدّل الموديل في نص التاسك: الموديل الجديد يبدأ بقراءة `docs/PROGRESS.md` (قسم "سجل اليوم 2") ويكمل من أول صف مش ✅. ممنوع يعيد شغل متسجل ✅.
3. **ممنوع تقول "تم" لأي حاجة بصرية.** أي مكون شكل/حركة آخر حالة ليه `🟡 كود جاهز — بانتظار موافقة المالك`. علامة ✅ بس للي اتأكد منه بأوامر (lint/build/check) أو بـ curl.
4. **ممنوع تلمس الباك** (`Om-Eman/backend`) — قراءة بس. لو لقيت تعارض في العقد: سجّله في PROGRESS وقول للمدير.
5. **ممنوع تبدأ اليوم 3** ولا تغيّر الخط ولا الثيم الافتراضي ولا أي لون موجود في `styles/themes.css` (قرارات المالك لسه معلّقة).
6. بعد **كل خطوة**: حدّث `docs/PROGRESS.md` (الملفات اللي اتعملت بأسماءها + أي انحراف + السبب) وشغّل `npm run check`.
7. المسموح تضيفه كـ dependency: **لا شيء**. (`package.json` يتغير في `scripts` بس لو لزم.)

### رسالة جاهزة تديها للـ AI المنفّذ
> أنت المنفّذ. اقرا `Om-Eman/frontend/docs/DAY2_TASKS.md` كله وابدأ من القسم 1. الملفات هي مصدر الحقيقة. قف عند كل Gate واكتب في `docs/PROGRESS.md` إنك واقف. ممنوع تبدأ تكتب كود قبل ما تجاوب أسئلة القسم 1.2 في PROGRESS ويوافق المدير.

---

## 1) قبل أي كود — Pre-flight (Gate 0)

### 1.1 اقرا بالترتيب ده (ومعاه إيه تطلّع منه)

| # | الملف | طلّع منه إيه |
| --- | --- | --- |
| 1 | `frontend/AGENTS.md` (كله) | قواعد التقطيع 150/200، I/T، الألوان من tokens بس، شجرة الملفات [exists]/[planned]، §18 anti-patterns |
| 2 | `frontend/docs/PROGRESS.md` | اللي اتعمل، واللي لسه "غير مكتمل" (ماتعتبرش البصري ولا الباك مكتملين) |
| 3 | `frontend/docs/DESIGN_SYSTEM.md` | §1 المبادئ، §2 tokens، §5 كتالوج الحركة والأداء، §6 "مفيش قيم وهمية"، §7 recipes، §8 الميزانية |
| 4 | `frontend/docs/DAY1_TASKS.md` | الشكل والتنسيق بس (اليوم 1 خلص) |
| 5 | `frontend/docs/FRONTEND_TASKS_10_DAYS.md` §0 و§2 و§3 و§6 | الخطة وشكل الـ envelope ومعايير القبول |
| 6 | الكود: `styles/*.css`، `lib/{theme,motion,utils,locale}.ts`، `components/Animation/*`، `components/ui/*`، `components/design/UiRow.tsx`، `store/baseApi.ts`، `interface/api.ts`، `app/[locale]/layout.tsx` | إيه الموجود عشان تعيد استخدامه ومتكررش |
| 7 | **الباك — قراءة بس:** `backend/src/modules/store/products/card.ts`، `backend/src/modules/store/settings/service.ts`، `backend/src/config/swagger-store.ts` (ابحث `StoreProductCard` و`StoreSettings` و`/store/products`)، `backend/AGENTS.md` قسم 7.5 | الأنواع الحقيقية للـ API وقاعدة "الفلوس decimal strings" |

### 1.2 أسئلة لازم تجاوبها كتابةً في PROGRESS (قسم "Day 2 — Pre-flight") قبل ما تكتب كود

1. إيه ملف الـ root layout، وليه مفيش `app/layout.tsx`؟
2. ليه ممنوع `cookies()` في الـ layout، وإزاي الثيم بيتطبق قبل أول paint؟
3. تستورد الحركة من فين، وليه `m.*` مش `motion.*`؟
4. `baseApi` بيرجّع إيه لما `success:false`؟ و`unwrapEnvelope` بيرجّع إيه للقايمة، و`meta` فين في الـ response؟
5. فين بس مسموح يتكتب لون hex؟ وإزاي تكتب كلاس Tailwind بلون من الـ tokens؟
6. ليه شارة "آخر قطع" (`lastItems`) المذكورة في DESIGN_SYSTEM §7 **ممنوع** نبنيها؟ (ارجع §6)
7. إيه الملفين اللي هتبني منهم `interface/store.ts`؟
8. إيه اللي `npm run check` بيفشل عليه؟

⛔ **Gate 0:** بعد الإجابات اكتب `STOP — بانتظار موافقة المدير` وقف. المدير بيراجع الإجابات.

### 1.3 حالة البداية (شغّلها واكتب النتيجة)

```bash
cd Om-Eman/frontend
npm run lint && npm run build && npm run check
```
المتوقع: lint ✅، build ✅، check = 0 failures و1 warning (`design/page.tsx` 45 سطر).

---

## 2) حقائق اتأكد منها المدير (2026-11-16) — ابنِ عليها

1. **شكل الـ API الحقيقي:** القوائم بترجع `{ success, message, data: [...], meta }` — يعني `data` مصفوفة و`meta` على مستوى الـ envelope (من `ApiResponse.paginated`). `unwrapEnvelope` بيرجّع `{ data, meta }`. `IPaginated {items, meta}` اللي في `interface/api.ts` **مش** شكل الـ wire (Swagger كاتب `items` جوه `data` — غالبًا غلط).
2. **`IStoreSettings` الحقيقي** (من `settings/service.ts`): `currency: string`، `taxRate: number | null`، `freeShippingThreshold: string | null`، `contact: {whatsapp, phone, email, workingHours, address}` (كلها `string | null`)، `social: {facebook, instagram, tiktok, youtube}` (`string | null`). Swagger كاتب `taxRate` string و`contact` nullable — **غلط**. اعتمد على الكود/الرد الحي، مش Swagger.
3. **`IStoreProductCard`** موجود حرفيًا في `card.ts` (id, slug, nameAr, nameEn, brand, productType, isFeatured, primaryImage, secondaryImage, price{from, compareAtFrom, hasMultiplePackages}, defaultPackageId, saleEndsAt, inStock, subcategory, category). الفلوس strings.
4. **مشكلة SEO لازم تتحل:** `FadeIn`/`Stagger` بيطلّعوا `style="opacity:0;transform:translateY(16px)"` في HTML السيرفر (اتأكدت في `.next/server/app/ar/design.html` — 4 مرات). يعني المحتوى مخفي لحد ما الـ JS يشتغل → LCP وSEO وno-JS بيتأذوا. **قاعدة جديدة:** أي حاجة فوق الـ fold تتكشف بـ **CSS animation** (بتبدأ من opacity 0 لكن بتشتغل بدون JS)، و`FadeIn`/`Stagger` (motion + whileInView) للأقسام اللي تحت الـ fold بس.
5. `ScrollProgressBar` و`BackToTop` و`Shake` اتبنوا في اليوم 1 **ومش متركّبين في أي صفحة** — المالك مشافهمش.
6. `hooks/useAppDispatch.ts` بيصدّر `useAppSelector` كمان (مخالفة ملف لكل مسؤولية).
7. `app/[locale]/design/page.tsx` = 45 سطر (الهدف 30). الباك الأساسي ممكن يكون واقف — فحص الاتصال شرطه إن `localhost:3000` شغال.

---

## 3) الجزء A — سباكة وتنظيف (من غير قرارات تصميم) — Gate 1

| # | المهمة | الملفات | التفاصيل |
| --- | --- | --- | --- |
| A1 | فصل الـ hook | `hooks/useAppSelector.ts` (جديد)، `hooks/useAppDispatch.ts` | انقل `useAppSelector` لملفه. `grep` يثبت إن مفيش مستهلكين. |
| A2 | تقطيع صفحة `/design` | `app/[locale]/design/metadata.ts` (جديد)، `app/[locale]/design/page.tsx` | انقل `generateMetadata` لـ `metadata.ts` وفي الصفحة: `export { generateMetadata } from "./metadata";`. لو الـ build رفض الـ re-export سجّل وارجع للوضع الحالي. |
| A3 | Toaster | `components/ui/Toaster.tsx` (جديد)، `app/[locale]/layout.tsx` | لف `Toaster` من `sonner` بألوان tokens (`bg-surface`, `text-ink`, حد `border-ink/15`) وبـ `dir` من `useLocale()` + `getLocaleDirection`. ركّبه جوه الـ providers جنب `children`. ممنوع لون خام. |
| A4 | العقود | `interface/store.ts` (جديد)، `interface/index.ts` (جديد — barrel)، `interface/api.ts` | `store.ts`: `TStoreProductType`, `IStoreProductImageSnapshot`, `IStoreProductPrice`, `IStoreProductCategoryRef`, `IStoreProductCard`, `IStoreContact`, `IStoreSocial`, `IStoreSettings` — **نسخ حرفي من الباك (قسم 2)**. احذف `IPaginated` من `api.ts` بعد `grep` يثبت إنه غير مستخدم. `index.ts` يعمل `export type { ... }`. |
| A5 | فحص الاتصال بالباك | `docs/PROGRESS.md` فقط | **شرطه** إن الباك شغال. جرّب: `curl -s localhost:3000/api/store/settings` — لو مفيش رد: سجّل `⛔ blocked — الباك واقف` وكمّل (ممنوع تألف ردود). لو شغال: (1) سجّل أول 300 حرف من `settings` و`products?page=1&limit=1`، (2) قارنهم بـ `interface/store.ts` وصلّح الـ interfaces، (3) جرّب `curl -s localhost:3000/api/store/products/does-not-exist` وتأكد من `{success:false, code}`، (4) `curl -si -H "Origin: http://localhost:3001" localhost:3000/api/store/settings` وسجّل `access-control-allow-origin`. سجّل أي تعارض مع Swagger للمدير. |

**Check A:** `npm run lint && npm run build && npm run check` — صفر failures، وتحذير `design/page.tsx` يختفي لو A2 نجح.
⛔ **Gate 1:** حدّث PROGRESS (صفوف A1–A5) واكتب `STOP — Gate 1`.

---

## 4) الجزء B — باقي مجموعة الحركة (DESIGN_SYSTEM §5) — Gate 2

> **مبدأ المالك:** الهيكل والـ wrappers النهارده، والشكل والإحساس النهائي بيتضبطوا معاه في المتصفح. اشتغل بالقيم الافتراضية الموصوفة تحت وسجّل أي رقم اخترته. كل البنود دي آخر حالة ليها 🟡.

قواعد ثابتة لكل بند: transform + opacity بس في أي حركة متكررة · تتوقف مع `prefers-reduced-motion` · تتوقف برّه الشاشة · ملف ≤150 سطر · نصوص من messages · ألوان من tokens بس · RTL (logical).

| # | المهمة | الملفات | المواصفات |
| --- | --- | --- | --- |
| B0 | قاعدة الـ SSR-visible | `styles/animations.css`، `styles/tokens.css` | أضف keyframes `fade-up` (opacity 0→1 + translateY 16→0) و`page-in` (translateY 8→0، النهاية `transform: none`) + `--animate-fade-up` و`--animate-page-in` في `@theme` (مدة `--dur-base`، `ease-out`، `animation-fill-mode: both`). كلاسات Tailwind: `animate-fade-up`. تتعطل مع reduced-motion. **ماتلمسش `FadeIn`/`Stagger`** — بس وثّق القاعدة (انظر D3). |
| B1 | `Spotlight` | `components/Animation/Spotlight.tsx` + CSS | wrapper `relative` فيه overlay `pointer-events-none` بـ `radial-gradient(circle at var(--mx) var(--my), <glow 25%>, transparent 60%)`. `onPointerMove` بيكتب `--mx/--my` على الـ element بـ `ref.style.setProperty` (**مفيش useState**). الـ CSS جوه `@media (hover: hover)` — يعني مفيش على الموبايل. اللون من `--color-glow` (`color-mix`). |
| B2 | `BorderBeam` | `components/Animation/BorderBeam.tsx` + `@property --beam-angle` في `animations.css` | بوردر `conic-gradient` بـ mask (`mask-composite`) بيلف بتحريك `--beam-angle`. prop `isActive`: لو false → `opacity:0` و`animation-play-state: paused`. يرث `rounded-lg`. لو `@property` مش مدعومة: بوردر ثابت. لون من `--color-glow`/`--color-accent`. |
| B3 | `useRotatingIndex` | `hooks/useRotatingIndex.ts` | `(count, intervalMs) => number` — بيلف على index (بيحدد أي كارت فيه beam، **كارت واحد في الشاشة**). بيقف لو `document.hidden` أو reduced-motion. `setState` جوه callback الـ interval بس (مش sync في effect). |
| B4 | `PulseRing` | `components/Animation/PulseRing.tsx`، تعديل keyframes `pulse-ring` + `--animate-pulse-ring` | حلقتين (delay 0 و0.3s) بتتحركوا **كل 6 ثواني** مش مستمر: غيّر الدورة لـ 6s والحركة الفعلية في أول ~35%. بيقف برّه الشاشة (`useInView` من `motion/react` → `data-paused`). لون الحلقة prop `ringClassName` (افتراضي `bg-primary`). مفيش زرار واتساب كامل النهارده (محتاج رقم من الـ settings). |
| B5 | `Marquee` | `components/Animation/Marquee.tsx` + CSS `marquee` | بيكرر الـ children مرتين (النسخة التانية `aria-hidden`)، `translateX(0 → -50%)`، بيتعكس في RTL، يقف عند hover، حواف بـ `mask-image` fade. reduced-motion: من غير حركة والعناصر `flex-wrap`. prop `durationSeconds`. |
| B6 | `Confetti` | `lib/confetti.ts` (محرك canvas)، `hooks/useConfetti.ts` | **من غير مكتبة.** الهوك بيعمل `import("@/lib/confetti")` ديناميك عند أول `fire({x,y})`. ألوان الجزيئات بتتقرا وقت الإطلاق من `getComputedStyle` (`--color-primary/accent/glow`) → بتتبع الثيم. حد أقصى 60 جزيء، DPR ≤ 2، الـ canvas يتشال بعد ~1.5s. مفيش إطلاق مع reduced-motion. |
| B7 | `FlyToCart` | `hooks/useFlyToCart.ts`، `components/Animation/CartBounce.tsx` | `fly({ source: HTMLElement, onArrive? })`: يقرا `getBoundingClientRect` للمصدر، يعمل **clone واحد** `position:fixed; pointer-events:none; z-index` عالي، ويحرّكه بـ `animate` من `motion/react` لحد أول عنصر `[data-cart-target]` — `x` و`y` بـ easings مختلفة (مسار منحني) + `scale ↓` + `opacity`، ~700ms. بعدها يشيل الـ clone ويستدعي `onArrive`. مفيش هدف أو reduced-motion → `onArrive` فورًا من غير حركة. `CartBounce`: غلاف للـ icon فيه `data-cart-target` وprop `pulseKey: number`، لما يتغير يعمل bounce (`useAnimate`، **من غير remount**). سجّل إن الاسم اختلف عن "FlyToCart" في DESIGN_SYSTEM §5.5. |
| B8 | `PageTransition` | `app/[locale]/template.tsx`، `components/Animation/PageTransition.tsx` (لو لزم) | **حكم المدير:** CSS فقط — `<div className="animate-page-in">` في `template.tsx` (يتعمل remount مع كل تنقل). دخول بس، من غير exit، من غير motion. تحقق بـ `curl` إن HTML مفيهوش `opacity:0` inline على المحتوى. لو بوّظ أي حاجة (hydration/ثابتة/`position:fixed`) → امسحه وسجّل `DROPPED + السبب`. |

**Check B:** `npm run lint && npm run build && npm run check` + `curl` على `/ar/design` المبني: `grep -c 'style="opacity:0'` للمحتوى فوق الـ fold = 0.
⛔ **Gate 2:** سجّل الصفوف (🟡 للبصري) واكتب `STOP — Gate 2`.

---

## 5) الجزء C — الـ recipes المشتركة (DESIGN_SYSTEM §7) — Gate 3

كلها في `components/shared/` (أو `ui/` للـ primitives)، Card = presentational + `memo` + من غير API.

| # | المهمة | الملفات | المواصفات |
| --- | --- | --- | --- |
| C1 | `Button`: variant `whatsapp` + shine | `components/ui/Button.tsx`، `styles/tokens.css`، `styles/animations.css` | token ثابت في **كل الثيمات** (مكانه `tokens.css` مش `themes.css`): `--color-whatsapp: #25d366` و`--color-on-whatsapp: #0b2e13` (قيم مقترحة — المالك يعدّلها). shine = pseudo-element بيعدّي بـ `transform` عند hover (`@media (hover:hover)`). **ماتغيّرش سلوك الـ variants الحالية.** |
| C2 | `Badge` | `components/ui/Badge.tsx` | زوّد `bundle` (`bg-card-3 text-ink`) و`soldOut` (`bg-surface-2 text-ink-soft`). `new` = `primary` و`sale` = `accent` الموجودين. **ممنوع `lastItems`** (مفيش عدّاد مخزون). |
| C3 | `lib/price.ts` + `PriceTag` + `CountUp decimals` | `lib/price.ts`، `components/shared/PriceTag.tsx`، `components/Animation/CountUp.tsx` | `calculateSavingsPercent(price, compareAt): number \| null` (عدد صحيح، `null` لو `compareAt` مش أكبر من `price`). **العرض بس** — الإجماليات الحقيقية بتيجي من الباك. `formatPriceAmount`: صحيح → من غير كسور، غير كده كسرين (الباك بيبعت strings زي `"45.0000"` — اتأكد من الرد الحي). `CountUp`: زوّد `decimals` (افتراضي 0 → **السلوك الحالي ثابت**). `PriceTag`: السعر + مشطوب (`line-through text-ink-soft`) + `Badge` "وفّرت X٪" من messages، والعملة من `common.currencyEgp`. |
| C4 | `SectionHeading` | `components/shared/SectionHeading.tsx` | `title` + `subtitle?` + `as: "h1" \| "h2"` + خط زخرفي بيتملّي بـ `scaleX` عند الظهور (`whileInView` مرة واحدة، `origin` من البداية حسب الاتجاه). |
| C5 | `TrustStrip` | `components/shared/TrustStrip.tsx` | `items: ITrustItem[]` (`{ icon: LucideIcon; label: string }`). ديسكتوب: صف ثابت. موبايل: `Marquee`. **المحتوى مش بيتألّف:** الـ demo في `/design` بيستخدم "الدفع عند الاستلام" (موجود فعلًا في الباك) وواتساب بس. |
| C6 | `EmptyState` / `ErrorState` | `components/shared/{EmptyState,ErrorState,EmptyIllustration,ErrorIllustration}.tsx` | `title`, `body`, `action?: ReactNode` (النصوص بتيجي مترجمة من المستدعي). الرسومة SVG بسيطة بـ tokens (`currentColor`/`text-accent`) ≤60 سطر لكل ملف. **ماتبدّلش `error.tsx`/`not-found.tsx` النهارده.** |
| C7 | `GlowCard` | `components/shared/GlowCard.tsx` | غلاف: `bg-surface rounded-lg shadow-rest` + hover (`-translate-y-1 shadow-hover` بـ transform، 150-300ms). props: `accent: "none" \| "card-1" \| "card-2" \| "card-3" \| "card-4"` (**خريطة كلاسات static**)، `hasSpotlight` (افتراضي true) و`isBeamActive` (افتراضي false) — بيركّب `Spotlight` و`BorderBeam`. `memo`. |

**Check C:** `npm run lint && npm run build && npm run check`.
⛔ **Gate 3:** سجّل الصفوف (🟡 للبصري) واكتب `STOP — Gate 3`.

---

## 6) الجزء D — شاشة القرار + الإقفال

| # | المهمة | الملفات | المواصفات |
| --- | --- | --- | --- |
| D1 | تركيب مؤثرات السكرول على `/design` | `components/design/DesignEffects.tsx` | client يركّب `ScrollProgressBar` و`BackToTop` (على `/design` بس — الـ layout العام قرار الأيام الجاية). |
| D2 | صفوف `/design` الجديدة | `components/design/ComponentsRow.tsx` (PriceTag + Badges + SectionHeading + Empty/ErrorState + Button whatsapp)، `components/design/MotionRow.tsx` (client: FlyToCart demo بكارت صغير + أيقونة سلة `CartBounce`، Confetti، **Shake** مع input كوبون وهمي محلي من غير API، Marquee/TrustStrip، PulseRing، 4 `GlowCard` بـ `useRotatingIndex` و`BorderBeam`)، `app/[locale]/design/page.tsx` | الصفحة ≤30 سطر (بعد A2). كل نص جديد في `messages/ar.json` و`en.json` بنفس المفاتيح. الصفحة طويلة كفاية عشان السكرول يبان. |
| D3 | توثيق | `AGENTS.md`، `docs/PROGRESS.md` | في `AGENTS.md`: أضف جدول §3.2 العناصر الجديدة + قاعدة SSR-visible (فوق الـ fold = CSS animation، تحت = `FadeIn`/`Stagger`) + منع `lastItems`. في PROGRESS: كل صف، الانحرافات، وقائمة "محتاج المالك يشوف" بالتفصيل. |

**Check D:** `npm run lint && npm run build && npm run check`، و`git diff package.json` يظهر `scripts` بس (لا dependencies جديدة).
⛔ **Gate 4 (النهائي):** اكتب التقرير (القسم 8) واقف. المدير بيراجع، والمالك بيجرّب.

---

## 7) بروتوكول مراجعة المدير (للشفافية — بيتشغّل بعد كل Gate)

```bash
cd Om-Eman/frontend
npm run lint && npm run build && npm run check      # لازم 0 failure
git diff --stat -- package.json                      # scripts بس
grep -rn "framer-motion" --include=*.ts --include=*.tsx app components lib hooks   # لازم يرجع فاضي
grep -c 'style="opacity:0' .next/server/app/ar/design.html   # مراجعة المحتوى فوق الـ fold
```
ويراجع يدويًا: الملفات ≤150، مفيش لون خام، `ar.json`/`en.json` متطابقين، `m.*` مش `motion.*`، تسمية I/T، كل بند 🟡 فعلًا مكتوب إنه بانتظار المالك، ومفيش حاجة اتعملت برّه القسم.

## 8) تقرير الإنهاء (الشكل المطلوب في آخر PROGRESS)

1. جدول: كل مهمة (A1…D3) ← الحالة (✅/🟡/⛔/DROPPED) ← الملفات بأسماءها.
2. نتيجة `lint` و`build` و`check` (انسخ آخر سطور الإخراج الحقيقية).
3. الانحرافات عن الملف ده + السبب.
4. قيم اخترتها (مدد/أحجام/ألوان) عشان المالك يعدّلها.
5. قائمة "محتاج المالك يشوف في المتصفح": كل مكون + إيه الإحساس المطلوب يتقيّم (موبايل + RTL + 4 ثيمات).
6. تعارضات مع الباك/Swagger اتلاقت.

## 9) معايير القبول

- [ ] `npm run lint` + `npm run build` + `npm run check` = 0 failures.
- [ ] ملف ≤150 سطر (خطر 200) · صفحات ≤30 · ملف = مسؤولية واحدة · `I`/`T` · مفيش `any`/`console.log`/كود معلق.
- [ ] مفيش لون خام · مفيش نص hard-coded (حتى وحدات/عملات) · `ar.json` = `en.json`.
- [ ] مفيش dependency جديدة · مفيش تعديل في الباك · الخط والثيم الافتراضي والقيم الحالية في `themes.css` زي ما هي.
- [ ] كل حركة: transform+opacity، reduced-motion، تقف برّه الشاشة، `m.*`.
- [ ] المحتوى فوق الـ fold مش `opacity:0` في HTML السيرفر.
- [ ] `PROGRESS.md` متحدّث وصادق: البصري 🟡، واتصال الباك مسجل فعليًا أو ⛔.

## 10) ممنوعات

1. اليوم 3 أو أي شاشة متجر/لوحة · أي endpoint hooks (`storeApi`) — من غير مستهلك = dead code.
2. `validation/` — مفيش schema حقيقي لسه (مفيش قيم أعمال تتألف).
3. `lastItems`/عدّاد مخزون/حد شحن مجاني مفترض — القيم الحقيقية من الـ API أو مفيش.
4. `framer-motion` مباشرة · `middleware.ts` · SASS · مكتبة confetti · shadcn CLI.
5. تغيير `error.tsx`/`not-found.tsx` · تغيير الخطوط · تغيير ألوان الثيمات الأربعة.
