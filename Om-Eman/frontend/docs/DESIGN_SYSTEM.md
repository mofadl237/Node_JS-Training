# Design System — أم إيمان (ترشيحات للنقاش، مش قرارات نهائية)

> آخر تحديث: 2026-11-13. ده ملف ترشيحات: إحنا هنثبت كل قسم مع بعض واحدة واحدة، وبعد ما نتفق نكتب الكود.
> **متوقف على اللوجو:** مفيش ملف لوجو في الريبو. الألوان تحت مبنية على "روح العطارة" لحد ما أشوف اللوجو الحقيقي وأعدّلها عليه.
> الهدف: موقع يبان عليه التعب، نضيف، سريع، وكل حركة فيه ليها سبب (تشدّ، تطمّن، أو تبيع).

---

## 1) المبادئ (5 قواعد بس)

1. **لا لون خام في أي component.** كل الألوان بتيجي من semantic tokens (`bg-surface`, `text-ink`, `bg-primary`) — عشان تبديل الثيم يشتغل على الموقع كله من غير ما نلمس component.
2. **الحركة 3 طبقات** (قسم 5): Ambient (CSS بس)، Interactive (hover/press)، Orchestrated (motion). ممنوع نحط Orchestrated في مكان Ambient يكفيه.
3. **transform + opacity بس** في أي animation متكررة. ممنوع نحرّك width/height/top/left/box-shadow في loop.
4. **كل حاجة بتتحرك لازم تحترم `prefers-reduced-motion`** وتتوقف لما تطلع برّه الشاشة.
5. **المصري على موبايل أندرويد متوسط هو المقياس**، مش لابتوبنا. أي effect تقيل بنختبره على الموبايل الأول.

---

## 2) الألوان — Tokens بتتبدّل بالثيم

### 2.1 البنية (Tailwind v4)

```txt
styles/
├── tokens.css      # @theme: الـ semantic names + spacing/radius/shadow/motion (ثابتة)
├── themes.css      # [data-theme="..."] بتغيّر قيم الـ CSS variables بس
└── animations.css  # @keyframes + utilities للـ ambient
app/globals.css     # @import للتلاتة (≤ 30 سطر)
```

الأدوار (نفس الأسماء في كل ثيم):

| Token | الدور |
| --- | --- |
| `--paper` / `--surface` / `--surface-2` | خلفية الصفحة / الكارت / الكارت المرفوع |
| `--ink` / `--ink-soft` | نص أساسي / ثانوي |
| `--primary` / `--on-primary` | الـ CTA الرئيسي ("اطلب دلوقتي") وكتابته |
| `--accent` | لمسة (شارات، خطوط، glow) — **مش للنص** |
| `--glow` | لون الإضاءة المتحركة حوالين الكروت |
| `--success` / `--danger` | ثابتين في كل الثيمات (مش من الأعشاب) |
| `--card-1..4` | 4 ألوان مميزة للكروت (قسم 2.3) |

### 2.2 الثيمات المقترحة (4 ثيمات — العميل يختار)

| الثيم | الفكرة | paper | ink | primary | accent | glow |
| --- | --- | --- | --- | --- | --- | --- |
| **زعفران** (افتراضي) | دافي، بهارات، كريمي | `#FBF4E6` | `#2B1A12` | `#B8451F` | `#E0A100` | `#F2B134` |
| **عطّار** | أعشاب، أخضر زيتي + نحاس | `#F6F3E8` | `#1F2A1C` | `#3F6B3A` | `#C9822B` | `#9BC46B` |
| **قرفة** (داكن) | وضع ليلي دافي، مش أسود بارد | `#1E130E` | `#F6E9D2` | `#E8892B` | `#F2C14E` | `#F59E3B` |
| **كركديه** | أحمر نبيتي + دهب | `#FBF1EE` | `#2A1216` | `#A3203A` | `#D9902F` | `#E5566F` |

اتحسبت الـ contrast فعلًا:

| الثيم | نص/خلفية | نص الزرار/primary | primary/خلفية | accent/خلفية |
| --- | --- | --- | --- | --- |
| زعفران | 15.2 | 5.4 | 4.9 | **2.1** |
| عطّار | 13.4 | 6.2 | 5.6 | **2.8** |
| قرفة | 15.2 | 7.0 | 7.0 | 10.8 |
| كركديه | 15.8 | 7.4 | 6.7 | **2.4** |

> الـ accent في الثيمات الفاتحة تحت 3 → **ديكور وglow وخطوط بس، ممنوع نكتب بيه نص.** الـ primary في زعفران 4.9 يعني نص عادي مقبول (≥ 4.5) بس بالكاد؛ نستخدمه للأزرار والروابط الكبيرة.

### 2.3 ألوان الكروت المميزة

كل نوع كارت ليه هوية ثابتة (من نفس الثيم، مش ألوان عشوائية):

| الكارت | اللون | ليه |
| --- | --- | --- |
| منتج عادي | `--surface` + glow بـ `--glow` | هادي، الصورة هي البطل |
| عرض/خصم | `--primary` خفيف + شريط accent | يشد من غير ما يزعق |
| Bundle | `--card-3` (لون ثالث ثابت) | يتفرّق على طول |
| قسم (Category) | `--card-1..4` بالتناوب حسب `sortOrder` | الهوم يبان ملوّن بس متناسق |

### 2.4 تبديل الثيم بدون وميض

- `data-theme` على `<html>`، والاختيار يتحفظ في cookie.
- **العميل هو اللي يختار (قرار متأكد):** الـ4 ثيمات كلها متاحة للزائر من الموقع نفسه، واختياره بيتحفظ لزيارته الجاية.
- **ThemeSwitcher (الفكرة):** زرار palette في الهيدر بيفتح popover فيه 4 دواير ألوان (كل دايرة نصفين: paper + primary) بـ spring stagger؛ الدايرة المختارة عليها check بيتحرك بـ `layoutId`. عند الاختيار الثيم الجديد **يتوسّع كدايرة من مكان الضغطة** على الصفحة كلها (View Transitions API + `clip-path`، وبديل fade لو المتصفح مش بيدعمها). الثيم الافتراضي: زعفران، ولو `prefers-color-scheme: dark` نقترح "قرفة" في أول زيارة بس.
- **تنبيه تقني:** `next.config.ts` مفعّل فيه `cacheComponents`. لو قرينا الـ cookie في الـ root layout بـ `cookies()` الشِل كله بيبقى dynamic. الترشيح: script صغير inline في `<head>` يقرأ الـ cookie ويحط `data-theme` قبل أول paint (زي next-themes) — والـ layout يفضل static.

---

## 3) الخطوط

| الدور | مرشّحين (نجرب ونثبّت واحد) |
| --- | --- |
| Display (عناوين الهيرو) | **El Messiri** (روح تراثية راقية) / Reem Kufi / Lalezar (أثقل، للأرقام والأسعار) |
| Body | **IBM Plex Sans Arabic** / Readex Pro / Cairo |

- كلهم متاحين في `next/font/google` بـ `subsets: ["arabic","latin"]` و`display: "swap"` → مفيش layout shift.
- حد أقصى **خطين**، وأوزان محددة (400/600/800) عشان الحجم.
- الأرقام: `font-variant-numeric: tabular-nums` على الأسعار والعدّادات عشان ما تهتزش وهي بتتغير.
- تجربة سريعة: صفحة `/design` داخلية تعرض الخطوط والألوان جنب بعض، ونختار بالعين.

---

## 4) باقي الـ tokens

- **Radius:** `sm 8 / md 14 / lg 22 / pill`. الكروت `lg` — ناعمة، مش حادة.
- **Shadows:** ظلال **ملوّنة بالبني الدافي** (`rgb(43 26 18 / .12)`) مش أسود. 3 مستويات: rest / hover / floating.
- **Spacing:** سكيل 4px الافتراضي. الأقسام `py-16 md:py-24` ثابتة عشان الإيقاع.
- **Texture:** خلفية الورق فيها noise خفيف جدًا (SVG صغير inline) بتدّي إحساس ورق/كيس عطارة. اختياري ونقرره بالعين.
- **كل حاجة logical:** `ms/me/ps/pe/start/end` — RTL أولًا.

---

## 5) الحركة — كتالوج + تكلفة

### 5.1 توكنز الحركة

| Token | القيمة | استخدام |
| --- | --- | --- |
| `--dur-fast` | 150ms | hover/press |
| `--dur-base` | 300ms | reveal/transition |
| `--dur-slow` | 600ms | hero/نجاح الطلب |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | الدخول (يحس "ناعم") |
| spring الكروت | `stiffness 300 / damping 24` | hover/تحريك |

### 5.2 الطبقات

| الطبقة | بتتنفذ بـ | مثال |
| --- | --- | --- |
| **A — Ambient** | CSS بس (صفر JS) | glow الكارت، shimmer، pulse الواتساب، marquee الثقة |
| **B — Interactive** | CSS + motion خفيف | hover/press، magnetic button، tilt، ripple |
| **C — Orchestrated** | `motion` | fly-to-cart، count-up، scroll-linked، page/section transitions، تنفيذ الـ checkout |

### 5.3 اللي طلبته → بيتنفذ إزاي

| الإحساس | التنفيذ | الطبقة | ملاحظة أداء |
| --- | --- | --- | --- |
| **المنتج يطير للسلة** | clone للصورة من `getBoundingClientRect` → مسار منحني (x ثم y بـ ease مختلف) + scale ↓ → السلة تعمل bounce + الـ badge يعمل count-up | C | بنحرّك clone واحد بـ transform، مش الكارت نفسه |
| **أرقام بتتحرك** | `<CountUp>` (spring) للسعر/العدّاد/الإجمالي، `tabular-nums` | C | يبدأ لما يظهر في الشاشة بس |
| **خط يزيد مع الـ scroll** | `useScroll` + `scaleX` على bar فوق الهيدر | C | `scaleX` بس، من غير re-render |
| **زرار لفوق + progress حواليه** | ring بـ SVG `strokeDashoffset` مربوط بـ `scrollYProgress`، يظهر بعد أول شاشة | C | نفس الـ hook بتاع الخط |
| **واتساب ليه حياة** | pulse ring (2 دواير بـ `scale+opacity`)، تتحرك كل 6 ثواني مش مستمر + tooltip "اطلب على واتساب" | A | بتقف لو الصفحة مش ظاهرة |
| **الكارت عليه إضاءة/خطوط تتحرك** | border-beam: `conic-gradient` بـ `@property --angle` بيلف حوالين الحدود بـ mask؛ **كارت واحد أو اتنين في الشاشة بس** يعملوا beam بالتناوب | A | الـ beam المستمر على كل الكروت = تقيل؛ الباقي بـ spotlight عند hover |
| **Spotlight تتبّع الماوس** | radial-gradient بـ `--mx/--my` بيتحدثوا بـ `pointermove` | B | `@media (hover:hover)` بس — مش على الموبايل |
| **الأقسام تتحرك بسلاسة** | reveal بـ `whileInView` + stagger، و`Lenis` للـ smooth scroll (اختياري) + scroll-snap خفيف في الهوم | C | `once: true` |
| **تفاصيل الـ hover** | كارت: رفع `-4px` + ظل + صورة `scale 1.05`؛ زرار: shine يعدّي + press `scale .97` | A/B | CSS |
| **الكوبون غلط = زعل** | الحقل `shake` (x: ±8) + حد أحمر + أيقونة وش حزين بتطلع وتختفي + رسالة مصرية | C | ~400ms |
| **الكوبون صح** | الخصم يتحسب بـ count-up + شريط أخضر "وفّرت X ج.م" + confetti خفيف من توابل (نقاط بلون الثيم) | C | confetti canvas بيتحمّل lazy |
| **الـ Checkout كله حيّ** | stepper بخط بيتملّي، الخطوات تنزلق، validation فورية بـ micro-shake، زرار التأكيد بـ loading→check morph، صفحة نجاح بـ check بيترسم (`pathLength`) | C | |
| **Skeleton** | shimmer بـ gradient واحد بيتحرك | A | |
| **Page transitions** | fade + slide 8px بين الصفحات | C | بنقيّم بدقة مع App Router؛ لو بيعمل مشاكل في الـ SSR نكتفي بـ section reveal |

### 5.4 المكتبات

- **`motion`** (الاسم الجديد لـ `framer-motion`، نفس الـ API، من `motion/react`). الـ AGENTS.md كاتب `framer-motion` — **أرشّح `motion`** لأنه الـ maintained. تأكد معايا.
- استخدام `LazyMotion` + `domAnimation` + `m.*` عشان الـ bundle ينزل من ~34KB لـ ~5KB أساسي.
- `lenis` للـ smooth scroll (~3KB) — **اختياري**، بيدّي إحساس فخم بس بيتعارض أحيانًا مع scroll-snap؛ نقرر بعد التجربة.
- مفيش GSAP/Three/Lottie. مش محتاجينهم والـ bundle أهم.

### 5.5 ملفات `components/Animation/` (كل واحد مسؤولية واحدة)

`MotionProvider` · `FadeIn` · `Stagger` · `ScaleOnHover` · `CountUp` · `ScrollProgressBar` · `BackToTop` · `FlyToCart` (+ `useFlyToCart`) · `Shake` · `BorderBeam` · `Spotlight` · `PulseRing` · `Marquee` · `Confetti` · `PageTransition`

---

## 6) سايكولوجي البيع (بنفس مبدأ "مفيش حاجة وهمية")

الباك إند عنده قاعدة: **ممنوع نخترع قيم أعمال**. وده في مصلحتنا — الثقة هي اللي بتبيع في العطارة:

| الأسلوب | يتنفذ إزاي | شرط الصدق |
| --- | --- | --- |
| **Anchoring** | سعر قديم مشطوب جنب الجديد + "وفّرت X%" | من `compareAtPrice` الحقيقي |
| **Scarcity** | شارة "نفد" + زرار "نبّهني" (لاحقًا) | `stockStatus` عندنا `IN_STOCK`/`OUT_OF_STOCK` بس (مفيش مخزون)، فمفيش "آخر قطعتين" — ممنوع عدّاد مخزون مزيّف |
| **Urgency** | countdown للعرض | من `saleEndsAt` / `endsAt` الحقيقي بس |
| **Bundle savings** | "اشتري الباقة ووفّر X" مع الحساب | من مكونات الـ bundle الفعلية |
| **سعر الجرام** | "= X ج.م / 100 جم" تحت كل عبوة | محسوب من `sizeValue`/`sellingPrice` |
| **تقدّم الشحن المجاني** | شريط في السلة | **بس لو الحد موجود في `system-settings`** — لو مش موجود مش هنخترعه |
| **ثقة** | "الدفع عند الاستلام"، استبدال، واتساب ظاهر، سوشال بروف حقيقي | بيانات من الـ settings |
| **تقليل الاحتكاك** | Guest checkout بخطوة، Sticky "أضف للسلة" على الموبايل، زرار "اطلب على واتساب" | |
| **Reciprocity** | وصفة/استخدام صغير مع كل منتج (من الوصف) | محتوى حقيقي من أم إيمان |

---

## 7) Component recipes (اللي هنبنيه في الـ Foundation)

الـ shadcn primitives تفضل زي ما هي ونغيّر الـ tokens بس. فوقها `components/shared/`:

| Component | الفكرة |
| --- | --- |
| `Button` (cva) | variants: `primary / soft / ghost / whatsapp` — shine + press |
| `GlowCard` | غلاف الكارت: surface + radius + spotlight/beam (prop `accent`) |
| `PriceTag` | سعر + مشطوب + نسبة توفير + CountUp |
| `Badge` | `new / sale / bundle / lastItems` بألوان من الـ tokens |
| `SectionHeading` | عنوان + خط زخرفي بيتملّي عند الظهور |
| `TrustStrip` | COD / استبدال / واتساب — marquee على الموبايل |
| `EmptyState` / `ErrorState` | رسوم SVG بسيطة بنفس الهوية |
| `ThemeSwitcher` | 4 دواير ألوان بـ layout animation |

---

## 8) ميزانية الأداء

- LCP < 2.5s، CLS ≈ 0، INP < 200ms (هدف Lighthouse ≥ 95 موبايل).
- JS الخاص بالحركة (motion + lenis + أي helper) **< 40KB gzip** على الهوم.
- أي effect تقيل (confetti, beam) → `dynamic import` وبعد أول تفاعل.
- `will-change` بس أثناء الحركة، مش دايمًا.
- `content-visibility: auto` للأقسام تحت الـ fold.
- الـ Ambient بيتوقف بـ `IntersectionObserver` لما يطلع من الشاشة، وكله يتقفل مع `prefers-reduced-motion`.
- صور: `next/image` + `sizes` + blur placeholder؛ ممنوع صورة بدون أبعاد.

---

## 9) القرارات

**اتأكدت (2026-11-13):**
- 4 ثيمات (زعفران، عطّار، قرفة، كركديه)، والعميل يبدّل بينهم من الموقع (قسم 2.4).
- ترتيب الشغل: الباك يتقفل الأول (`backend/docs/STORE_BACKEND_TASKS.md`)، بعدين المتجر، بعدين اللوحة.
- الصور: URLs نصية في الداتابيز + الأصل على Cloudinary.

**لسه مفتوح (نقرره في Foundation مش دلوقتي):**
1. **اللوجو** (صاحب المشروع شغال عليه) — ممكن يعدّل قيم الألوان النهائية. الـ tokens مصممة إن تعديلها في ملف واحد.
2. `motion` ولا `framer-motion` (ترشيحي `motion`).
3. `lenis` نجرّبه ولا لأ.
4. الخط (El Messiri + IBM Plex Sans Arabic ترشيحي، نشوفهم بالعين في صفحة `/design`).
5. الـ border-beam: كارت/اتنين بالتناوب (ترشيحي).
