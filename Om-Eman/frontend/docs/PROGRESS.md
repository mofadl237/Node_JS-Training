# PROGRESS — سجل الشغل (محدَّث بعد كل جلسة)

> ده ملف المتابعة الوحيد: أي AI يقراه يعرف اتعمل إيه بالظبط، وإيه اللي لسه.
> **آخر تحديث (2026-11-26): §63 — `End Day8` closure fixes. Day 8 = SOURCE COMPLETE — PARTIAL HANDOFF، NOT SEALED، ما اتعملوش Browser Verification شامل.** الجدول القديم أدناه (حالة الأيام) تاريخي؛ الحالة الصحيحة في `REVIEW_DAY8.md §3.1` و`§10`، وخطة اليوم التالي في `DAY9_TASKS.md`.
> (تاريخي) آخر تسليم قبل ده: `G6 — DAY 7 FINAL REVIEW & HANDOFF` — مراجعة وثائق/أدلة وتسليم جزئي فقط؛ DAY 7 = PARTIAL HANDOFF. مرجع الخطة: [DAY7_TASKS.md](./DAY7_TASKS.md)؛ اليوم السابق: `DAY6_TASKS.md` §12؛ الخطة الكاملة: `FRONTEND_TASKS_10_DAYS.md` §0.3.
> **رموز الحالة:** ✅ متأكد بأوامر · 🟢 بصري اعتمده المالك · 🟡 بصري بانتظار المالك · ⛔ محجوب · ⚠️ جزئي.
> أداة الفحص الموحدة للمراجعة: `npm run check` (`scripts/check-rules.mjs`) — حدود الأسطر، نصوص عربي hard-coded، ألوان خام، any/console.log/framer-motion، تطابق `ar.json`/`en.json`.
> القاعدة: نحدّث الملف ده **قبل ما نقفل أي خطوة** (مش بعد).

---

## الحالة العامة (2026-11-19 — بعد مراجعة Day 3 واعتماد خطة Day 4)

| المسار | الحالة |
| --- | --- |
| الباك إند | سجل سابق: B1–B16 + uploads/Cloudinary مع `tsc/build/test` وSwagger (116 paths / 168 schemas) وقتها. نجاح API منتجات محلي أُبلغ عنه بعد إصلاح B-1؛ مراجعة التخطيط لم تصل إلى `:3002` ولم تتحقق من النشر. عقد نشر التفاصيل ما زال مفتوحًا. |
| الفرونت | يوم 1 و2 مقفولين باعتماد المالك. شغل Day 3 موجود؛ `lint/check` نجحا في المراجعة، لكن TypeScript ليس أخضر والـbuild والمتصفح لهما قيود منفصلة (انظر آخر سجل). خطة Day 4 فقط معتمدة، **G0–G5 لم تبدأ**. |

### متابعة الباك المسجلة في 2026-11-17 (تاريخية؛ ليست تعليمات Day 4)
1. الداتابيز: `npm run db:migrate -- --name init` → `prisma db execute --file prisma/mvp/manual_constraints.sql` (في `Om-Eman/backend`).
2. `cp seed.config.example.json seed.config.json` → تعبيه بقيم حقيقية → `npm run db:seed`.
3. تشغيل integration tests من غير skip + تشغيل السيرفر.
4. حساب Cloudinary + تعبئة `CLOUDINARY_*` في `.env`.
5. اللوجو (شغال عليه) — ممكن يعدّل قيم tokens لما يخلص.

---

## الفرونت — حالة الأيام

| اليوم | المحتوى | الحالة |
| --- | --- | --- |
| 1 | Foundation: i18n/RTL + tokens/4 ثيمات + ThemeSwitcher + baseApi + Animation wrappers أساسية + UI primitives + /design + SEO base + error/not-found | ✅ كود + lint + build (2026-11-16) · 🟢 البصري اعتمده المالك (2026-11-17) · ⚠️ اتصال الباك جزئي (settings/categories/banners/faqs/pages/sitemap شغالين، المنتجات ⛔) |
| 2 | إكمال Foundation: سباكة/عقود (interface/store, Toaster, split hooks) + باقي الحركة (Spotlight/BorderBeam/PulseRing/Marquee/Confetti/FlyToCart/PageTransition) + recipes (GlowCard/PriceTag/SectionHeading/TrustStrip/Empty-ErrorState) + صفوف /design | ✅ مقفول (2026-11-17) — 24/24 مهمة موجودة ومتركّبة، lint/build/check خضرا، البصري 🟢. ⚠️ بند واحد محجوب خارجيًا (A5: مقارنة كارت المنتج على رد حي) + عيوب مسجلة D2-01…D2-09 بتتصلح في Gate 1 من يوم 3 |
| 3 | Storefront: غلاف المتجر + الهوم SSR + SEO + متابعات البراند | منفّذ في المصدر؛ ✅ lint/check؛ ⚠️ 4 أخطاء TS؛ ⛔ آخر build؛ 🟡 لا قبول متصفح شامل. التحقق المحلي السابق لـGate 5 لا يُعاد كمهام Day 4. |
| 4 | كتالوج أساسي؛ تفاصيل المنتج مشروطة بعقد النشر؛ اختيار عبوة وإضافة بالسلة القائمة بعد التفاصيل | **خطة فقط** — `docs/DAY4_TASKS.md`. لا تفويض بتنفيذ أي Gate؛ KS-1/KS-2 لم تُغلقا. |
| 5 | Product Search + Guest Cart / Cart Page | **Planned for Day 5 — Not Started** لكلا المهمتين؛ راجع سجل التسليم أدناه. |
| 6–7 | Checkout → تتبع → حساب العميل | ⏳ لاحقًا حسب خطة المتجر؛ خارج تكليف اليوم. |
| 8-9 | Dashboard أساسي: دخول + هيكل + منتجات + أقسام + طلبات + مدفوعات | ⏳ |
| 10-12 | Dashboard تكميلي: فواتير، شحن، عروض، كوبونات، محتوى، تقارير، عملاء، audit | ⏳ |
| 13-14 | الإطلاق: Lighthouse ≥ 95 + SEO نهائي + مراجعة RTL | ⏳ |

## Deferred Tasks / Upcoming Work

**التأجيل سببه إعادة توزيع نطاق Storefront وفقًا للـUpdated Roadmap، وليس إلغاء المهام.** مرجعها الأصلي [FRONTEND_TASKS_10_DAYS.md](./FRONTEND_TASKS_10_DAYS.md) §0.3 و«اليوم 9 — Storefront». [تسليم متطلبات Day 5 بالتفصيل](./DAY4_TASKS.md#day5-handoff) يربط كل ID بمتطلبات الـUI والـAPI والحركة ومصدرها. لا توجد Gate تنفيذ مفتوحة لهما.

| ID | Task | الموعد والحالة | ما ينتظر التنفيذ |
| --- | --- | --- | --- |
| D5-SEARCH | Product Search | **Planned for Day 5 — Not Started** | حقل الهيدر، نتائج `q` واقتراحات صفر النتائج، إعادة استخدام الكروت، SearchLog من نفس الطلب وSearchAction بعد وجود صفحة النتائج. |
| D5-CART | Guest Cart / Cart Page | **Planned for Day 5 — Not Started** | صفحة `/{locale}/cart` وإغلاق KS-3، drawer، badge بالعدد الحقيقي، عرض سلة الضيف المستمرة وتعديل/حذف البنود، الإجمالي والتوفر وحالات الواجهة. |

**قراءة الحالة:** المنفّذ في المصدر هو غلاف Day 3 والهوم وأساس الإضافة (`ProductCard` + `cartApi` + `cartToken`)، **مش** الشاشتين أعلاه. خطة Day 4 موثّقة لكن G0–G5 لم تبدأ. المؤجّل لـDay 5 هو البحث وواجهة السلة؛ أما المحجوب فهو التحقق الحي من الـAPI في آخر مراجعة، وفتح تفاصيل Day 4 لحين حسم عقد النشر، وproduction build عند آخر محاولة (`0xc0000142`). تفاصيل الأدلة ونتائج TypeScript والقبول البصري في §13–14. عند تسليم خطة Day 5 تُطابَق متطلبات الـIDين قبل تغيير الحالة أو رفع أي بند من سجل المتابعة.

---

## سجل اليوم 1 — Foundation (خطة التنفيذ من `DAY1_TASKS.md`)

| # | الخطوة | الحالة | ملاحظات |
| --- | --- | --- | --- |
| 1 | تثبيت المكتبات (RTK/next-intl/motion/RHF/zod/sonner/lucide/cva/cn) | ✅ | motion 14.14, next-intl 4.15.1, zod 4.6.7 — lint+build أخضر |
| 2 | i18n + RTL (i18n/* + proxy.ts + messages + [locale]/layout) | ✅ | ملفات: `i18n/{routing,navigation,request}.ts` + `proxy.ts` + `lib/locale.ts` + `messages/{ar,en}.json` + `app/[locale]/{layout,page}.tsx`. اتشال الـ layout/page القديم. ملاحظتين: الـ plugin `createNextIntlPlugin()` لازم في next.config.ts، واسم الخط `El_Messiri` (مش ElMessiri) |
| 3 | Design tokens (styles/tokens.css + themes.css + animations.css) | ✅ | 3 ملفات في `styles/` + `globals.css` أقل من 30 سطر. ألوان surface/ink-soft/on-primary/card-1..4 لكل ثيم مش موجودة في DESIGN_SYSTEM (حدد بس paper/ink/primary/accent/glow) — اشتقناها بنفس الروح، **المالك يقدر يعدّلها في `styles/themes.css` بس** |
| 4 | ThemeSwitcher + ThemeScript (cookie oe-theme، من غير وميض) | ✅ | `lib/theme.ts` + `components/shared/ThemeScript.tsx` + `Providers/ThemeProvider.tsx` + `components/shared/ThemeSwitcher.tsx` + `lib/utils.ts` (cn). ملاحظات: React 19 lint منع setState في effect فاتحول لـ useSyncExternalStore مع MutationObserver على data-theme — أنظف. الـ circle-expand (View Transitions) مؤجل زي الخطة |
| 5 | RTK baseApi + store + Providers + lib/config + .env.local | ✅ | `lib/config.ts` (بيلوم لو env ناقص) + `.env.local` + `interface/api.ts` (IApiResponse union success/failure + IApiError + IPaginationMeta + IUnwrapped) + `store/baseApi.ts` (baseQuery بيرجّع `success:false` لـ IApiError بالـ code + `unwrapEnvelope` helper للـ transformResponse) + `store/store.ts` + `hooks/useAppDispatch.ts` + `Providers/ReduxProvider.tsx`. ملاحظة: IApiResponse.data بقى required في الـ success shape (الباك دايمًا بيبعت data في النجاح) |
| 6 | Animation wrappers (MotionProvider/FadeIn/Stagger/StaggerItem/ScaleOnHover/Shake/CountUp/ScrollProgressBar/BackToTop) | ✅ | 8 ملفات في `components/Animation/` + `components/Animation/staggerVariants.ts` + `lib/motion.ts` (EASE_OUT + SPRING_CARD كـ typed tuples). CountUp بيحدّث الـ DOM بـ ref من غير re-render. ScrollProgressBar origin-left rtl:origin-right. BackToTop label في messages/common.backToTop |
| 7 | UI primitives (Button/Input/Skeleton/Badge بـ cva) | ✅ | `components/ui/{Button,Input,Skeleton,Badge}.tsx` — Button variants primary/soft/ghost + sizes sm/md/lg + isLoading spinner. Input forwardRef + hasError. Skeleton بـ class `skeleton-shimmer` من animations.css. Badge variants neutral/primary/accent/outline |
| 8 | صفحة /design (ThemeRow/FontRow/TokenRow/UiRow) | ✅ | `app/[locale]/design/page.tsx` (45 سطر، منهم 17 سطر generateMetadata) بتولّف `components/design/{DesignHeader,ThemeRow,FontRow,TokenRow,UiRow}.tsx`. UiRow فيها demo لكل حاجة: أزرار + Input + Skeleton + FadeIn + Stagger + CountUp. noindex + robots disallow |
| 9 | SEO base (lib/seo.ts + JsonLd + error/not-found + sitemap/robots skeleton) | ✅ | `lib/seo.ts` (buildMetadata: canonical + hreflang + OG/Twitter + BRAND_NAME) + `components/shared/JsonLd.tsx` + `app/[locale]/{error,not-found}.tsx` (بالنصوص من messages) + `app/[locale]/[...rest]/page.tsx` (catch-all → not-found مترجم) + `app/{sitemap,robots}.ts` skeletons. layout metadata بيلف على buildMetadata |

### إجمالي اليوم 1
- **التحقق:** `npm run lint` ✅ + `npm run build` ✅ (كل الصفحات static، Proxy شغال).
- **حجم الملفات:** لا ملف فوق 120 سطر (الأكبر ThemeSwitcher 99). **تصحيح:** صفحة /design فيها 45 سطر مش 26 (كتبت رقم غلط قبل كده) — فوق هدف الـ 30 سطر للصفحات، والتقطيع متسجل كمهمة في DAY2_TASKS.
- **مش في اليوم ده (عمدًا):** FlyToCart/BorderBeam/Spotlight/PulseRing/Marquee/Confetti/PageTransition (يوم 2)، Dialog/Table/Tabs/Select/Sheet/Toaster (يوم 2 مع اللوحة)، IProduct/ICategory contracts + validation/ (لما نستهلك endpoints حقيقية).

> **قاعدة التسجيل:** كل صف تتشال علامة ✅ + سطر ملاحظة فيه الملفات الفعلية اتعملت
> (اسمها بالظبط) وأي انحراف عن الخطة وسببه — عشان أي AI يكمل من غير تكرار.

### تنظيف ما بعد اليوم 1 (2026-11-16) — اتعمل بالفعل
| # | التعديل | الملفات |
| --- | --- | --- |
| 1 | `AGENTS.md` اتحدّث ليعكس الواقع: Next 16.4 + `proxy.ts` + `cacheComponents` + `motion/react` (`m.*` مع LazyMotion strict) + جدول stack بحالة كل مكتبة (installed/planned/not installed) + شجرة ملفات فعلية بعلامات [exists]/[planned] + جدول "فين كل حاجة مشتركة" + قواعد الألوان/الثيمات/الـ tokens + نموذج الـ auth الحقيقي (موظف: JWT في الـ body → httpOnly cookie عبر route handler، عميل: opaque Bearer token) + anti-patterns جديدة (setState في effect، cookies() في layout، middleware.ts، نصوص/عملات hard-coded) | `AGENTS.md` |
| 2 | `ThemeSwitcher`: `Parameters<typeof setTheme>[0]` اتبدّل بـ `TThemeName` الصريح | `components/shared/ThemeSwitcher.tsx` |
| 3 | نص "ج.م" اتنقل لـ `common.currencyEgp` (ar: `ج.م` / en: `EGP`) وبيتقرا بـ `useTranslations("common")` في `UiRow` | `components/design/UiRow.tsx` + `messages/ar.json` + `messages/en.json` |
| 4 | بورت الفرونت `-p 3001` في `dev`/`start` + `.env.example` + استثناء `!.env.example` في `.gitignore` | `package.json`, `.env.example`, `.gitignore` |

**التحقق:** `npm run lint` ✅ (0 errors / 0 warnings) — `npm run build` ✅ (نفس جدول الـ routes: 14 صفحة، نفس الـ static/PPR). فحص يدوي: مفيش أي حرف عربي hard-coded في أي `.tsx`، ومفاتيح `ar.json` و`en.json` متطابقة (33 مفتاح).
**ملاحظة سلوك:** الأرقام في `/en/design` بقت بتعرض `EGP` بدل `ج.م` (ده الهدف من دعم اللغتين). السلوك في `/ar` زي ما هو بالظبط.

### حالة بنود "لسه مش مكتمل" بتاعة يوم 1 (اتحدّثت 2026-11-17)
- **الاختبار البصري على المتصفح:** 🟢 المالك اعتمد التنفيذ البصري لليوم 1 واليوم 2 صراحةً (ThemeSwitcher / CountUp / ScrollProgressBar / BackToTop / كل حركات اليوم 2). **الاعتماد مش بيشمل شاشات يوم 3 ولا أي تعديل بصري جديد.** الخط (El Messiri + IBM Plex Sans Arabic) والثيم الافتراضي (زعفران) اتعتمدوا ضمنًا بالشكل اللي اتعرض — أي تغيير فيهم قرار مالك جديد.
- **اتصال الباك:** ⚠️ جزئي — الباك على بورت 3002، و`settings`/`categories`/`banners`/`faqs`/`pages/:slug`/`sitemap` شغالين ومتأكد منهم حي (2026-11-17). `products` + `products/:slug` + `search` ⛔ (BLOCKER في الباك، تفاصيله تحت).
- **تنظيف `useAppSelector`:** ✅ اتفصل في A1.
- **مؤجل ولسه متعملش (متوقع):** Dialog/Table/Tabs/Select/Sheet (اللوحة)، `validation/` (مفيش schema حقيقي لسه).
- **مفيش commit** لشغل الفرونت (كل شغل يوم 1 + 2 uncommitted في working tree — قرار المالك).
---

## قرارات مثبتة (مما لا يُناقش)

1. الـ 4 ثيمات من DESIGN_SYSTEM §2.2 — العميل يبدّل من الموقع (cookie `oe-theme`)، الافتراضي "زعفران"، وأول زيارة بـ dark scheme → "قرفة".
2. `motion` (مش framer-motion) + `LazyMotion`/`domAnimation`.
3. الخطوط المرشحة للتجربة بالعين في `/design`: El Messiri + IBM Plex Sans Arabic.
4. الترتيب: متجر الأول (C) بعد Foundation، بعدين اللوحة (B).
5. ممنوع ألوان خام في components — tokens فقط. ممنوع SASS.
6. شكل/حركة أي شاشة: المالك يوافق عليها في المتصفح قبل القفل — الـ AI ميتقدمش من غير اعتماد.

## مفتوح (قرار معلّق)
- اللوجو لما يخلص → ممكن يعدّل قيم tokens (مصممة عشان التعديل في ملف واحد).
- `lenis` للـ smooth scroll — نقرر بعد تجربة.
- الـ circle-expand في تبديل الثيم (View Transitions API) — مؤجل.

---

## اكتشافات المدير بعد اليوم 1 (2026-11-16) — اتحولت لمهام في `DAY2_TASKS.md`
1. **SSR + SEO:** `FadeIn`/`Stagger` بيطلّعوا `style="opacity:0;transform:translateY(16px)"` في HTML السيرفر (4 مرات في `/ar/design`) — المحتوى مخفي لحد الـ hydration. القاعدة الجديدة: فوق الـ fold = CSS animation، تحت = `FadeIn`/`Stagger`.
2. **عقد الـ API:** القوائم `data: [...]` + `meta` على مستوى الـ envelope. `IPaginated {items, meta}` في `interface/api.ts` مش شكل الـ wire (هيتشال). Swagger غلط في `taxRate` (الحقيقي number|null) و`contact` (الحقيقي object دايمًا) وفي شكل قايمة المنتجات.
3. `ScrollProgressBar`/`BackToTop`/`Shake` متبنيين بس **مش متركّبين** في أي صفحة — المالك لسه مشافهمش.
4. **تصحيح رقم:** `design/page.tsx` = 45 سطر (كنت كاتب 26 غلط).
5. شارة `lastItems` في DESIGN_SYSTEM §7 بتتعارض مع §6 (مفيش عدّاد مخزون) → **ممنوعة**.

## سجل اليوم 2
### Day 2 — Pre-flight (القسم 1 في `DAY2_TASKS.md`)

**تنفيذ:** 2026-11-17. المنفّذ قري 1.1 كامل قبل أي إجابة.

#### 1.1 الملفات المقروءة
| # | الملف | اتأكدت منه |
| --- | --- | --- |
| 1 | `AGENTS.md` (كله) | حدود 150/200، مسؤولية واحدة، `I`/`T`، ألوان tokens فقط (الاستثناء الوحيد `lib/theme.ts`)، شجرة [exists]/[planned]، §18 anti-patterns (setState في effect، cookies() في layout، middleware.ts، framer-motion، lastAppDispatch export مزدوج) |
| 2 | `docs/PROGRESS.md` | يوم 1 كود ✅ + البصري/الباك/الخط **مش مكتملين**، اكتشافات المدير الخمسة، قاعدة تحديث PROGRESS قبل إقفال أي خطوة |
| 3 | `docs/DESIGN_SYSTEM.md` | §1 المبادئ الخمسة، §2 tokens/4 ثيمات (زعفران افتراضي)، §5 كتالوج الحركة بطبقات A/B/C + §5.5 ملفات Animation، §6 مفيش قيم وهمية، §7 recipes، §8 ميزانية الأداء (JS حركة < 40KB) |
| 4 | `docs/DAY1_TASKS.md` | الشكل والتنسيق (Next 16 فروق: proxy.ts، cacheComponents، async params) — اليوم 1 مقفول كود |
| 5 | `docs/FRONTEND_TASKS_10_DAYS.md` §0/§2/§3/§6 | خطة 14 يوم (متجر قبل اللوحة)، شكل الـ envelope مصدر الحقيقة، متطلبات الجودة (ممنوع template AI/picsum/Lorem)، checklist القبول |
| 6 | كود الفرونت (كله المذكور) | `styles/{tokens,themes,animations}.css` (3 ملفات، tokens `@theme` + 4 ثيمات + shimmer/pulse-ring)، `lib/{theme,locale,motion,utils,config,seo}.ts`، `components/Animation/*` (8 ملفات + staggerVariants)، `components/ui/*` (Button/Input/Skeleton/Badge بـ cva)، `components/design/UiRow.tsx`، `store/baseApi.ts`، `interface/api.ts`، `app/[locale]/layout.tsx` (76 سطر) |
| 7 | الباك (قراءة فقط) | `card.ts` (IStoreProductCard كامل — الفلوس strings زي `"0.0000"`)، `settings/service.ts` (IStoreSettings: taxRate number|null، contact/social objects)، `swagger-store.ts` (StoreProductCard/StoreSettings + مسار /store/products)، `AGENTS.md` §7.5 (قواعد المتجر: decimal strings، ممنوع قيم مختلقة) |

#### 1.2 الإجابات الثمانية
1. **الـ root layout** = `app/[locale]/layout.tsx` (76 سطر) — هو المالك الوحيد لـ `<html>`/`<body>`/الخطوط/الـ Providers. مفيش `app/layout.tsx` لأن `lang`/`dir` محتاجين الـ locale من الـ URL، و`next-intl` بيشتغل من سيجمنت `[locale]`، و`cacheComponents` يخلي أي قراءة cookie في root layout تخلي الشِل كله dynamic. سكربت الـ check بيفشل لو `app/layout.tsx` اتعمل.
2. **ممنوع `cookies()` في الـ layout** لأن `cacheComponents: true` (AGENTS §12 + §18). الثيم بيتطبق **قبل أول paint** بـ `ThemeScript` — script inline في `<head>` (layout سطر 63) بيكري cookie `oe-theme` ويحط `data-theme` على `<html>` قبل أي رسم (سلسلة `THEME_SCRIPT` في `lib/theme.ts`)؛ `<html data-theme="zafran">` افتراضي مع `suppressHydrationWarning`.
3. **الحركة من `"motion/react"`** (مش framer-motion — الباكج transitive والاستيراد منه بيفشل الـ check). **`m.*` مش `motion.*`** لأن `MotionProvider` بيلف التطبيق في `LazyMotion features={domAnimation} strict` — الـ strict بيرمي خطأ لو حد استخدم `motion.*` (الباندل الكامل ~34KB) و`m.*` بيخلي الأساسي ~5KB. مع `MotionConfig reducedMotion="user"`.
4. **`baseApi` لما `success:false`**: `baseQueryWithApiError` بيتعرف على `IEnvelopeFailure {success:false, message, code}` ويرجّع `{error: IApiError {status, message, code}}` (fallback `REQUEST_FAILED` لو الشكل مش متوقع) → الـ endpoint يقع في error state، والـ `code` يترجم من messages. **`unwrapEnvelope(envelope)`** بيرجّع `{data, meta}` (`IUnwrapped`). **`meta` على مستوى الـ envelope** جنب `data` — مش جواه. `IPaginated {items, meta}` في `interface/api.ts` **مش شكل الـ wire** (القايمة `data: [...]`) — بيتشال في A4.
5. **الـ hex مسموح بس في `lib/theme.ts`** (بيانات swatches — الـ COLOR_EXEMPT الوحيد في `check-rules.mjs`). كلاس Tailwind بلون token: كلاس **static** بسمانتك (`bg-primary`, `text-ink`, `border-ink/15`, `bg-primary/10` زي soft variant) — `@theme` في tokens.css بيولّد الأدوات، وممنوع `bg-${...}` ديناميكي (بيفشل الـ check).
6. **`lastItems` ممنوعة** لأن DESIGN_SYSTEM §6 حاطة شرط الصدق: مفيش مخزون في الـ MVP (`stockStatus` = IN_STOCK/OUT_OF_STOCK بس) وقاعدة الباك "ممنوع نخترع قيم أعمال" → مفيش عدّاد "آخر قطعتين" أصلاً؛ وجودها في §7 تعارض بيترجع لـ §6 (اكتشاف المدير #5).
7. **`interface/store.ts` يتبني من ملفين:** `backend/src/modules/store/products/card.ts` (`TStoreProductType`, `IStoreProductImageSnapshot`, `IStoreProductPrice`, `IStoreProductCategoryRef`, `IStoreProductCard`) و `backend/src/modules/store/settings/service.ts` (`IStoreContact`, `IStoreSocial`, `IStoreSettings`) — نسخ حرفي، والفلوس strings.
8. **`npm run check` بيفشل على:** ملف > 200 سطر · عربي hard-coded في الكود · لون خام برّه `lib/theme.ts` · `any`/`as any` · `@ts-ignore`/`@ts-nocheck` · `console.log` · استيراد `framer-motion` · كلاس Tailwind ديناميكي `${}` · وجود `middleware.ts` · وجود `app/layout.tsx` · اختلاف مفاتيح `ar.json`/`en.json`. **بتحذر (مش بيفشل):** > 150 سطر، صفحة > 30 سطر، كلاسات physical (ml/mr/pl/pr/left/right).

#### 1.3 أوامر البداية (نتائج حقيقية 2026-11-17)
```
npm run lint  → 0 errors / 0 warnings ✅
npm run build → ✅ نجح (نفس جدول يوم 1: 14 صفحة، /ar و/en و/design static أو PPR، Proxy شغال)
npm run check → Scanned 46 code files, 33 message keys per locale.
               WARN  app/[locale]/design/page.tsx: page has 45 lines (target 30)
               0 failure(s), 1 warning(s). ✅ (مطابق للمتوقع في 1.3)
```

**ملاحظة المنفّذ قبل الكود:** `hooks/useAppDispatch.ts` فعلًا بيصدّر `useAppSelector` مع `useAppDispatch` (مؤكد — A1). ومفيش `app/layout.tsx` ولا `middleware.ts` (مؤكد — `app/` فيها `[locale]` بس + globals.css/robots/sitemap).

⛔ **STOP — بانتظار موافقة المدير.** (ممنوع تنفيذ A/B/C/D قبل المراجعة.)

**✅ Gate 0 اتوافق عليه (2026-11-17) — بدأ تنفيذ الجزء A.**

### Part A — سجل التنفيذ

| # | المهمة | الحالة | الملفات + ملاحظات |
| --- | --- | --- | --- |
| A1 | فصل `useAppSelector` لملفه | ✅ | `hooks/useAppSelector.ts` (جديد — `TypedUseSelectorHook<RootState>`) + `hooks/useAppDispatch.ts` (بقى dispatch فقط). `grep` أثبت **صفر مستهلكين** خارج الملفين قبل الفصل. lint + check أخضر فورًا (0 failures) |
| A2 | تقطيع صفحة `/design` | ✅ | `app/[locale]/design/metadata.ts` (جديد — `generateMetadata` كاملة) + `page.tsx` (45 → **25 سطر**) بـ `export { generateMetadata } from "./metadata"`. الـ build **قبل** الـ re-export (مفيش حاجة اتبوظت) و`/ar/design` + `/en/design` اتبنوا. الـ check رجع **0 failures / 0 warnings** (التحذير القديم اختفى) |
| A3 | تركيب Toaster | ✅ 🟢 | `components/ui/Toaster.tsx` (جديد) + `app/[locale]/layout.tsx` (تركيب جوه الـ providers جنب children). لف `sonner` بألوان tokens: `bg-surface text-ink border-ink/15 shadow-floating` + success/error بحدود `border-success/40`/`border-danger/40` (مفيش لون خام)، `dir` من `useLocale()` + `getLocaleDirection` (بتضيّق بـ `isLocale` مع fallback للـ default)، position افتراضي `bottom-center`. lint + build + check أخضر (لا قرارات بصرية نهائية — 🟢 بصري — اعتمده المالك) |
| A4 | عقود المتجر + barrel | ✅ | `interface/store.ts` (جديد، 74 سطر) — **نسخ حرفي** من `card.ts` (TStoreProductType, IStoreProductImageSnapshot, IStoreProductPrice, IStoreProductCategoryRef, IStoreProductCard) و `settings/service.ts` (IStoreContact, IStoreSocial, IStoreSettings) — الفلوس strings. `interface/index.ts` (جديد — barrel بـ `export type`). `interface/api.ts`: حذف `IPaginated` بعد `grep` أثبت إنه **غير مستخدم** (34 سطر بعد الحذف). ملاحظة: `baseApi` لسه يستورد من `./api` مباشرة — صح (مش من الـ barrel) واتركه زي ما هو. lint + build + check أخضر |
| A5 | فحص الاتصال بالباك | ⚠️ جزئي | شغّلت الباك الفعلي (`npm run dev`) — قاعدة `om_eman` عليها بيانات demo. النتائج الحقيقية تحت (قسم A5). **settings ✅ متطابق مع `interface/store.ts`** · 404 ✅ · CORS ✅ — لكن **`GET /store/products` راجع `DB_CONSTRAINT_ERROR` (bug باك حقيقي)** فالمقارنة بتاعته ⛔ محجوبة — **ممنوع mock، اتسجل وقُل للمدير** |

### A5 — أدلة حقيقية (2026-11-17)

**اكتشاف 1 — تعارض بورت:** الباك `.env` فيه `PORT=3002` (ودي اللي اشتغل عليها فعليًا: "listening on port 3002") بينما الفرونت `.env.local` وكل التوثيق (AGENTS/DAY1/DAY2) بيقولوا الباك على **3000**. `CORS_ORIGIN` اسمح لـ 3001 فعلًا. **قرار للمدير:** توحيد البورت (تعديل `.env` — ملف باك، المنفّذ ممنوع يلمسه).

**اكتشاف 2 — bug باك حقيقي في قائمة المنتجات (للمدير):**
- الرد: `{"success":false,"message":"Database constraint violation","code":"DB_CONSTRAINT_ERROR"}` (rIP من الـ envelope الصح للخطأ، لكن الـ endpoint نفسه معطّل).
- سجل السيرفر: `Raw query failed. Code: 42P01. Message: missing FROM-clause entry for table "pk0"` في `prisma.$queryRaw`.
- المصدر بدقة (قراءة فقط): `src/modules/store/products/list.ts` — الجزء المشترك `sellablePackages` بيستخدم alias `pk0` (سطر 33) وبيتركّب في WHERE الرئيسية اللي شغالة على alias تاني (`pk.`) من غير ما `pk0` يكون معرّف في نفس النطاق.
- يعني: **قايمة المنتجات الحقيقية متقدرش تتجرب دلوقتي** — `IStoreProductCard` فاضل نسخة حرفية من `card.ts` (مصدر الحقيقة) لحين الباك يتصلح ويتقارن على رد حي.

**الاختبارات اللي نجحت (الردود الأولى حرفيًا):**
1. `GET /api/store/settings`:
   `{"success":true,"message":"Settings fetched successfully","data":{"currency":"EGP","taxRate":null,"freeShippingThreshold":null,"contact":{"whatsapp":null,...},"social":{...}}}`
   → مطابق حرفيًا لـ `IStoreSettings` (currency string، taxRate `number|null` فعلاً — **Swagger غلط لسه**، freeShippingThreshold `string|null`، contact/social objects). ملاحظة: كله null لأن seed.config.json لسه متعملش — ده متوقع مش bug.
2. `GET /api/store/products/does-not-exist`:
   `{"success":false,"message":"Product not found","code":"PRODUCT_NOT_FOUND"}` → شكل الخطأ `{success:false, message, code}` متأكد ✅.
3. `curl -si -H "Origin: http://localhost:3001"` → `Access-Control-Allow-Origin: http://localhost:3001` ✅ (الأوريجن مسموح فعلًا في الـ allow-list).

### Check A (2026-11-17)
```
npm run lint  → 0 errors / 0 warnings ✅
npm run build → ✓ Compiled successfully (كل الـ 14 صفحة، design static/PPR) ✅
npm run check → Scanned 48 code files, 33 message keys per locale.
                0 failure(s), 0 warning(s). ✅ (تحذير الـ 45 سطر اختفى بعد A2)
```
ملاحظة: السيرفر اتعمل له shutdown بعد الفحص (tsx watch مش شغّل — القرار النهائي للبورت مع المدير).

**⛔ STOP — Gate 1.** (ممنوع بدء Part B قبل موافقة المدير + قرار بورت + bug قائمة المنتجات.)

**✅ Gate 1 اتوافق عليه (2026-11-17) مع قرارين: البورت = 3002، وbug المنتجات BLOCKER منفصل (ممنوع تعديل باك / mock / workaround في الـ interfaces).**

### قرار البورت (قبل Part B)
- `.env.local` سطر 1: `NEXT_PUBLIC_API_URL=http://localhost:3002/api` (كان 3000 بدون مسار).
- `AGENTS.md`: تحديث "backend, port 3000" → `http://localhost:3002/api` + "the backend owns 3002 (decided 2026-11-17)".
- **تركيب baseApi متأكد قبل التعديل:** `fetchBaseQuery({ baseUrl: API_BASE_URL })` — يعني الـ endpoints الجاية لازم تُكتب relative من غير `/` في الأول (مثال: `store/products` → `http://localhost:3002/api/store/products`) عشان ما يطلعش `/api//...`.
- الباك `.env` + PostgreSQL: **مما لمسوش** (حسب القرار). أوراق curl القديمة في DAY1/DAY2 تعتبر تاريخية — أي curl جديد على 3002.

### Part B — سجل التنفيذ

| # | المهمة | الحالة | الملفات + ملاحظات |
| --- | --- | --- | --- |
| B0 | قاعدة الـ SSR-visible | ✅ | `styles/tokens.css` (§5 في @theme: `--animate-fade-up` + `--animate-page-in` بـ `var(--dur-base)` + `var(--ease-out)` + fill `both`) + `styles/animations.css` (keyframes `fade-up` 0→1 + translateY 16→0 و`page-in` translateY 8→0 والنهاية `transform:none`؛ reduced-motion يقتلهم). كلاس Tailwind الناتج: `animate-fade-up` / `animate-page-in` (static). **ماتلمسش FadeIn/Stagger** — القاعدة موثقة في D3 |
| B1 | `Spotlight` | ✅ 🟢 | `components/Animation/Spotlight.tsx` (26 سطر) — overlay `pointer-events-none` بـ radial-gradient `circle at var(--mx) var(--my)` + glow 25% → transparent 60% بـ `color-mix` من `--color-glow`؛ `onPointerMove` يكتب `--mx/--my` بـ `ref.style.setProperty` (**مفيش useState/ريرندر**)؛ CSS جوه `styles/animations.css` (§4، مش جنب الكومبوننت — تمشي مع بنية styles/ الوحيدة) وجوه `@media (hover:hover)` فمفيش glow على الموبايل. انحراف مسجل: مكان ملف CSS (المواصفة مش محددة) |
| B2 | `BorderBeam` | ✅ 🟢 | `components/Animation/BorderBeam.tsx` (30 سطر) + `@property --beam-angle` (§5 في animations.css — `<angle>` + keyframes 0→360deg كل 4s). conic-gradient من tokens (`--color-glow` 300deg + `--color-accent` 340deg) في شريط 2px بـ mask `content-box exclude` (+ `-webkit` xor للسفاري). `isActive=false` → `opacity:0` + `animation-play-state: paused`. لو `@property` مش مدعومة: الحافة تفضل ثابتة (مفيش دوران). reduced-motion يوقف الـ animation. ورثت `rounded-lg` من الكلاس الأساسي |
| B3 | `useRotatingIndex` | ✅ | `hooks/useRotatingIndex.ts` (27 سطر) — `(count, intervalMs) => number` بيلف على index. **مفيش setState sync في effect** (قاعدة React 19) — الحالة بتتغير جوه callback الـ interval بس. بيقف لو `document.hidden` أو `prefers-reduced-motion`. قيمة 1/0 count → ثابتة |
| B4 | `PulseRing` | ✅ 🟢 | `components/Animation/PulseRing.tsx` (37 سطر) + تعديلات CSS. الدورة بقت **6 ثواني** (`--animate-pulse-ring` في tokens.css + keyframes: الحركة في أول ~35% بعدين سكوت لحد 100%). حلقتين delay 0 و0.3s (`pulse-ring-layer`). توقف بره الشاشة: `useInView` (موجودة في motion/react) → `data-paused` → `[data-paused="true"] .pulse-ring-layer { animation-play-state: paused }`. لون الحلقة prop `ringClassName` (افتراضي `bg-primary`). **مفيش زرار واتساب كامل** (محتاج الرقم من settings — القرار للمالك) |
| B5 | `Marquee` | ✅ 🟢 | `components/Animation/Marquee.tsx` (30 سطر) + CSS §6 في animations.css. بيكرر children مرتين (النسخة التانية `aria-hidden`)، translateX 0→-50%، RTL بيعكس بـ `animation-direction: reverse` على `[dir="rtl"]`، يقف عند hover، حواف بـ `mask-image` fade (10%/90%). reduced-motion: مفيش حركة والعناصر `flex-wrap` (عبر `motion-reduce:` + override في الـ media query). prop `durationSeconds` (افتراضي 30s بـ `--marquee-duration`) |
| B6 | `Confetti` | ✅ 🟢 | `lib/confetti.ts` (96 سطر — محرك canvas **بدون مكتبة**) + `hooks/useConfetti.ts` (11 سطر). الهوك بيعمل `import("@/lib/confetti")` ديناميك عند أول `fire({x,y})`. ألوان الجزيئات بتتقري وقت الإطلاق من `getComputedStyle` (`--color-primary/accent/glow`) → بتتبع الثيم الحالي. حد 60 جزيء، DPR ≤ 2، canvas يتشال بعد 1.5s. مفيش إطلاق مع reduced-motion. أرقام اخترتها: جاذبية 0.25/frame، سرعة 3–8، حجم 4–8px، z-index 60 |
| B7 | `FlyToCart` | ✅ 🟢 | `hooks/useFlyToCart.ts` (49 سطر) + `components/Animation/CartBounce.tsx` (33 سطر). `fly({source, onArrive})`: بيقري `getBoundingClientRect` للمصدر، clone **واحد** `position:fixed; pointer-events:none; z-index:60`، بيحرّكه بـ `animate` من `motion/react` لأول `[data-cart-target]` — مسار منحني (x easeIn + y بمفتاحين `[0, 0.4·targetY, targetY]`) + scale 1→0.3 + opacity، ~700ms، بعدين يمسح الـ clone ويستدعي `onArrive`. مفيش هدف أو reduced-motion → `onArrive` فورًا بدون حركة. `CartBounce`: `data-cart-target` + prop `pulseKey` → bounce بـ `useAnimate` (**من غير remount**). **تسجيل انحراف اسم:** DESIGN_SYSTEM §5.5 كاتب `FlyToCart` — الملف الفعلي هو hook اسمه `useFlyToCart` + wrapper `CartBounce` (قسم 3 في DAY2) |
| B8 | `PageTransition` | ✅ 🟢 | `app/[locale]/template.tsx` (جديد، 9 سطر) — **CSS فقط**: `<div className="animate-page-in">` (remount مع كل تنقل → الحركة بتتكرر)، دخول بس، من غير exit ولا motion. **تحقق بـ curl على `/ar/design` المبني:** `animate-page-in` موجود في الـ HTML ✅. `style="opacity:0"` المتبقي = 3 occurrences **كلها في `UiRow` (تحت الـ fold — FadeIn/Stagger، ماتلمسوش حسب B0)**، فوق الـ fold = 0 ✅. مفيش حاجة اتبوظت (build + HTML سليم) |

### Check B (2026-11-17)
```
npm run lint  → 0 errors / 0 warnings ✅
npm run build → ✓ Compiled successfully ✅
npm run check → 0 failure(s), 0 warning(s) ✅ (انحراف أثناء التنفيذ: `#fff` جوه mask string
                في BorderBeam اتشال من TSX — كل الـ paint اتنقل لـ .border-beam في
                styles/animations.css بـ data-active، عشان قاعدة "مفيش لون خام في components")
curl /ar/design → animate-page-in ✅ · opacity:0 فوق الـ fold = 0 ✅ (3 تحت الـ fold في UiRow)
git diff package.json → مفيش أي تغيير ✅ · framer-motion grep → فاضي ✅
```
حجم الملفات الجديدة: أطول ملف `lib/confetti.ts` 100 سطر، والباقي ≤ 57.

**⛔ STOP — Gate 2.** (البنود البصرية كانت 🟡 وقتها — اتعتمدت لاحقًا من المالك، شوف قسم المراجعة النهائية.)

**✅ Gate 2 اتوافق عليه (2026-11-17) — بدأ تنفيذ الجزء C.**

### Part C — سجل التنفيذ

| # | المهمة | الحالة | الملفات + ملاحظات |
| --- | --- | --- | --- |
| C1 | Button `whatsapp` + shine | ✅ 🟢 | `styles/tokens.css` (§6: `--color-whatsapp: #25d366` + `--color-on-whatsapp: #0b2e13` — **ثابتة في كل الثيمات** ومكانها tokens.css زي ما المطلوب؛ قيم مقترحة والمالك يعدّلها) + `components/ui/Button.tsx` (variant رابع `whatsapp: bg-whatsapp text-on-whatsapp hover:shadow-hover` — **سلوك الـ variants الحالية ماتلمسش**) + `styles/animations.css` (§7 `.btn-shine`: pseudo-element بيعدّي بـ `translateX(-120%→120%) skewX(-12deg)` عند hover جوه `@media (hover:hover)` بلون `color-mix` من `--color-on-whatsapp`). اختيار مسجل: الشين على variant الـ whatsapp بس (المواصفة ربطتهم مع بعض) |
| C2 | Badge `bundle` + `soldOut` | ✅ 🟢 | `components/ui/Badge.tsx` — زوّد `bundle` (`bg-card-3 text-ink`) و`soldOut` (`bg-surface-2 text-ink-soft`). `new` = `primary` و`sale` = `accent` الموجودين زي ما هما. **مفيش `lastItems`** (ممنوعة — §6) |
| C3 | `lib/price.ts` + `PriceTag` + CountUp decimals | ✅ 🟢 | `lib/price.ts` (18 سطر): `calculateSavingsPercent` (عدد صحيح، null لو compareAt ≤ price) + `formatPriceAmount` (صحيح → بدون كسور "45.0000"→"45"، كسر → كسرين). `components/Animation/CountUp.tsx`: prop `decimals` (افتراضي 0 → السلوك القديم ثابت بالظبط، `Math.round` → `toFixed(0)` نفس النتيجة). `components/shared/PriceTag.tsx` (جديد، 39 سطر، client): سعر بـ CountUp + مشطوب `line-through text-ink-soft` + Badge accent "وفّرت X٪" — **عرض بس، مفيش حساب إجماليات**. العملة من `common.currencyEgp`. **نص جديد في messages:** namespace `price.savedPercent` (ar: "وفّرت {percent}٪" / en: "You saved {percent}%" — اتصححت من `{{ }}` أثناء D2) — المفاتيح متطابقة |
| C4 | `SectionHeading` | ✅ 🟢 | `components/shared/SectionHeading.tsx` (جديد، 44 سطر، client) — `title` + `subtitle?` + `as: "h1"|"h2"` (font-display + text-3xl، text-ink-soft للـ subtitle). خط زخرفي `h-1 w-24 bg-accent` بيتملّي بـ `scaleX 0→1` (whileInView مرة واحدة، dur 0.6s بـ EASE_OUT) و`transformOrigin` من جهة بداية القراءة حسب الاتجاه (RTL → 100% / LTR → 0%) |
| C5 | `TrustStrip` | ✅ 🟢 | `components/shared/TrustStrip.tsx` (جديد، 34 سطر، server) — `items: ITrustItem[] { icon: LucideIcon; label: string }`. ديسكتوب: صف ثابت `hidden sm:flex` — موبايل: `Marquee` (`sm:hidden`). **المحتوى مش بيتألف:** اللي بيمرر الـ items هو اللي بيترجم — والـ demo (في D2) هيستخدم COD + واتساب بس (موجودين فعلًا في الباك). chip: `bg-surface shadow-rest` + أيقونة `text-accent` |
| C6 | Empty/ErrorState | ✅ 🟢 | `components/shared/{EmptyState,ErrorState,EmptyIllustration,ErrorIllustration}.tsx` (4 ملفات، 15–18 سطر لكل واحد) — props `title`/`body` (بيترجموا من المستدعي) + `action?: ReactNode`. الرسومات SVG بسيطة بـ `currentColor` (`EmptyIllustration`: كارت + سطور + عروق، `ErrorIllustration`: دايرة + X) — `ErrorState` بأيقونة `text-danger/70`. **ماتلمسش error.tsx/not-found.tsx** (زي المطلوب) |
| C7 | `GlowCard` | ✅ 🟢 | `components/shared/GlowCard.tsx` (جديد، 47 سطر + memo) — `bg-surface rounded-lg shadow-rest` + hover: `-translate-y-1 shadow-hover` (transform + shadow transition 200ms). prop `accent` بخريطة كلاسات **static** (`ACCENT_CLASSES`: none → bg-surface، card-1..4 → bg-card-N — ممنوع `${}` وتمشى مع check). `hasSpotlight` (افتراضي true) يلف في `Spotlight`، و`isBeamActive` (افتراضي false) يركّب `BorderBeam` دايمًا (مخفي لما false) |

### Check C (2026-11-17)
```
npm run lint  → 0 errors / 0 warnings ✅
npm run build → ✓ Compiled successfully ✅
npm run check → 0 failure(s), 0 warning(s) ✅
```
ملفات Part C الجديدة: كلها ≤ 47 سطر. مفيش لون خام ولا نص hard-coded — الـ نص الوحيد الجديد namespace `price` في messages (متطابق ar/en).

**⛔ STOP — Gate 3.** (البصري كان 🟡 وقتها — اتعتمد لاحقًا من المالك.)

**✅ Gate 3 اتوافق عليه (2026-11-17) — بدأ تنفيذ الجزء D.**

### Part D — سجل التنفيذ

| # | المهمة | الحالة | الملفات + ملاحظات |
| --- | --- | --- | --- |
| D1 | مؤثرات السكرول على /design | ✅ 🟢 | `components/design/DesignEffects.tsx` (جديد، 14 سطر، client) — يركّب `ScrollProgressBar` + `BackToTop` (المبنية يوم 1 وغير مركّبة). **على /design بس** — التركيب عام قرار الأيام الجاية |
| D2 | صفوف /design الجديدة | ✅ 🟢 | `components/design/ComponentsRow.tsx` (جديد، 56 سطر): Badges الأربعة (primary/accent/bundle/soldOut) + PriceTag بأرقام demo decimal strings ("45.0000"/"60.0000" — ملاحظة demo ظاهرة) + SectionHeading + Empty/ErrorState + Button whatsapp. `components/design/MotionRow.tsx` (جديد، 130 سطر، client): demo طيران للسلة (كارت + CartBounce بـ pulseKey) + كوبون وهمي محلي (DEMO10: صح → toast.success + confetti، غلط → Shake + toast.error — **من غير API**) + TrustStrip (COD + واتساب — حقيقية من الباك) + PulseRing بدائرة واتساب + 4 GlowCards بـ `useRotatingIndex` + BorderBeam واحد بيتنقل. `page.tsx` = **30 سطر بالظبط** (اضغطت الـ interface inline). نصوص جديدة في messages (design namespace + price) ar/en متطابقة. **إصلاح أثناء التنفيذ:** `{{percent}}` → `{percent}` (ICU — next-intl مش mustache؛ سبب INVALID_MESSAGE ×4 في أول build). Toaster اللي اتركب في A3 اشتغل فعليًا (toast.success/error) |
| D3 | توثيق | ✅ | `AGENTS.md`: جدول §3.2 زاد (Spotlight/BorderBeam/PulseRing/Marquee/useFlyToCart/CartBounce/useConfetti/recipes/Toaster + contracts) + قاعدة SSR-visible (فوق الـ fold = CSS، تحت = FadeIn/Stagger) + منع lastItems في anti-patterns + Button/Badge variants محدثة + Toaster "mounted" + شيل الـ leftover القديم (useAppSelector اتفصل في A1). `PROGRESS.md`: التقرير النهائي تحت |

### Check D + Check النهائي (2026-11-17)
```
npm run lint  → 0 errors / 0 warnings ✅
npm run build → ✓ Compiled successfully + ✓ Generating static pages (14/14) ✅
npm run check → 0 failure(s), 0 warning(s) ✅ (صفحة design = 30 سطر بالظبط، مفيش تحذير)
git diff package.json → مفيش أي تغيير (لا dependencies) ✅
curl /ar/design + /en/design (built) → animate-page-in ✅ · style="opacity:0" = 4 occurrences
  كلها جوه demo UiRow (FadeIn/Stagger تحت الـ fold — ماتلمسوش حسب B0) — فوق الـ fold = 0 ✅
framer-motion grep → فاضي ✅ · الباك ماتلمسش ✅
```

---

## 📋 تقرير إنهاء اليوم 2 (الشكل المطلوب في §8 من DAY2_TASKS)

### 1) جدول كل مهمة ← الحالة ← الملفات
| المهمة | الحالة | الملفات |
| --- | --- | --- |
| A1 فصل hook | ✅ | `hooks/useAppSelector.ts` (جديد) · `hooks/useAppDispatch.ts` |
| A2 تقطيع /design | ✅ | `app/[locale]/design/metadata.ts` (جديد) · `page.tsx` |
| A3 Toaster | ✅ 🟢 | `components/ui/Toaster.tsx` (جديد) · `app/[locale]/layout.tsx` |
| A4 عقود + barrel | ✅ | `interface/store.ts` (جديد) · `interface/index.ts` (جديد) · `interface/api.ts` (حذف IPaginated) |
| A5 اتصال الباك | ⚠️ جزئي | `docs/PROGRESS.md` (أدلة حقيقية: settings ✅ · 404 ✅ · CORS ✅ · قايمة المنتجات ⛔ bug باك) |
| B0 قاعدة SSR | ✅ | `styles/tokens.css` · `styles/animations.css` |
| B1 Spotlight | ✅ 🟢 | `components/Animation/Spotlight.tsx` (جديد) |
| B2 BorderBeam | ✅ 🟢 | `components/Animation/BorderBeam.tsx` (جديد) · `animations.css` §5 |
| B3 useRotatingIndex | ✅ | `hooks/useRotatingIndex.ts` (جديد) |
| B4 PulseRing | ✅ 🟢 | `components/Animation/PulseRing.tsx` (جديد) · `tokens.css` · `animations.css` §2 |
| B5 Marquee | ✅ 🟢 | `components/Animation/Marquee.tsx` (جديد) · `animations.css` §6 |
| B6 Confetti | ✅ 🟢 | `lib/confetti.ts` (جديد) · `hooks/useConfetti.ts` (جديد) |
| B7 FlyToCart | ✅ 🟢 | `hooks/useFlyToCart.ts` (جديد) · `components/Animation/CartBounce.tsx` (جديد) |
| B8 PageTransition | ✅ 🟢 | `app/[locale]/template.tsx` (جديد — CSS فقط) |
| C1 Button whatsapp | ✅ 🟢 | `components/ui/Button.tsx` · `tokens.css` §6 · `animations.css` §7 |
| C2 Badge bundle/soldOut | ✅ 🟢 | `components/ui/Badge.tsx` |
| C3 PriceTag + price | ✅ 🟢 | `lib/price.ts` (جديد) · `components/shared/PriceTag.tsx` (جديد) · `components/Animation/CountUp.tsx` |
| C4 SectionHeading | ✅ 🟢 | `components/shared/SectionHeading.tsx` (جديد) |
| C5 TrustStrip | ✅ 🟢 | `components/shared/TrustStrip.tsx` (جديد) |
| C6 Empty/ErrorState | ✅ 🟢 | `components/shared/{EmptyState,ErrorState,EmptyIllustration,ErrorIllustration}.tsx` (جديدة) |
| C7 GlowCard | ✅ 🟢 | `components/shared/GlowCard.tsx` (جديد) |
| D1 DesignEffects | ✅ 🟢 | `components/design/DesignEffects.tsx` (جديد) |
| D2 صفوف جديدة | ✅ 🟢 | `components/design/{ComponentsRow,MotionRow}.tsx` (جديدة) · `page.tsx` · `messages/{ar,en}.json` |
| D3 توثيق | ✅ | `AGENTS.md` · `docs/PROGRESS.md` |

### 2) نتائج التحقق (آخر سطور حقيقية)
- `npm run lint` → 0 errors / 0 warnings
- `npm run build` → ✓ Compiled successfully · ✓ Generating static pages using 3 workers (14/14)
- `npm run check` → Scanned 73 code files, 53 message keys per locale · 0 failure(s), 0 warning(s)

### 3) انحرافات عن DAY2_TASKS + السبب
1. **البورت:** الباك على **3002** (مش 3000 زي ما مكتوب في الملف) — قرار المدير اعتمد 3002؛ `.env.local` + `AGENTS.md` اتحدثوا، الباك ماتلمسش.
2. **`GET /store/products` راجع `DB_CONSTRAINT_ERROR`** (bug باك حقيقي: `src/modules/store/products/list.ts` — alias `pk0` مش معرّف في WHERE الرئيسية) → مقارنة `IStoreProductCard` على رد حي ⛔ محجوبة، مفيش mock، والـ interfaces فاضلة نسخ حرفي من مصدر الباك.
3. **مكان CSS المكونات:** المواصفة B1/B5 مش محددة مكان ملفات الـ CSS → كلها في `styles/animations.css` (بنية styles/ الوحيدة). B2 اتنقل لاحقًا كله لـ `.border-beam` (قاعدة لون خام في check).
4. **ICU:** `{{percent}}` اتصححت لـ `{percent}` (next-intl يتبع ICU).
5. **شين الزرار:** على variant الـ whatsapp بس (المواصفة ربطتهم).
6. **أسماء FlyToCart:** الـ hook اسمه `useFlyToCart` + `CartBounce` (زي قسم 3 حرفيًا — DESIGN_SYSTEM §5.5 كاتب FlyToCart فقط).

### 4) قيم اخترتها (المالك يعدّلها)
- beam: دورة 4s · marquee: 30s افتراضي (22s في TrustStrip موبايل) · confetti: 60 جزيء، جاذبية 0.25، عمر 1.5s · pulse: 6s (حركة أول 35%) · fly-to-cart: 700ms · shake: 0.4s (x ±8) · SectionHeading خط: `w-24 h-1` bg-accent · `--color-whatsapp: #25d366` / `--color-on-whatsapp: #0b2e13` · GlowCard hover: 200ms · كوبون demo: `DEMO10` · `beamIndex` interval: 3000ms.

### 5) محتاج المالك يشوفه في المتصفح (موبايل + RTL + 4 ثيمات + Light/Dark)
| المكوّن | الإحساس المطلوب تقييمه |
| --- | --- |
| `animate-fade-up` / `animate-page-in` (كل تنقل) | دخول الصفحة ناعم من غير وميض ومفيش محتوى مختفي |
| ScrollProgressBar + BackToTop (D1) | الخط فوق بيتملّي مع السكرول + زرار الظهور بعد أول شاشة |
| Spotlight (B1) | تتبع الماوس على الكروت — ديسكتوب بس (مفيش على الموبايل) |
| BorderBeam + useRotatingIndex (B2/B3) | الـ beam بيلف وبيتنقل بين 4 كروت كل 3 ثواني |
| PulseRing (B4) | نبضتين كل 6 ثواني (مش مستمرة) — بيقف بره الشاشة |
| Marquee + TrustStrip (B5/C5) | الشريط على الموبايل + يقف عند hover + اتجاه RTL |
| Confetti (B6) | ألوان من الثيم الحالي — جرّب تغيير الثيم وأعد الإطلاق |
| FlyToCart + CartBounce (B7) | الكارت يطير بمسار منحني والسلة تعمل bounce |
| Button whatsapp + shine (C1) | اللون الثابت + اللمعة عند hover |
| PriceTag + CountUp (C3) | الأرقام بتعُد + المشطوب + شارة "وفّرت X٪" |
| SectionHeading (C4) | الخط الزخرفي بيتملّي من جهة بداية القراءة |
| Empty/ErrorState (C6) | الرسومات والنصوص والـ action |
| GlowCard (C7) | الرفع عند hover + spotlight + الـ accent الأربعة |
| Toaster (A3) | مكان/شكل التوستات بالعربي والإنجليزي |

### 6) تعارضات مع الباك/Swagger
1. **Swagger غلط (اتوثق قبل كده وتأكدت حي):** `taxRate` string → الحقيقي `number | null` · `contact` nullable → الحقيقي object دايمًا · شكل قايمة المنتجات (`items` جوه `data`) → الحقيقي `data: [...]` + `meta` على الـ envelope.
2. **bug قايمة المنتجات** (`DB_CONSTRAINT_ERROR` / `pk0`): BLOCKER منفصل للباك — المدير هيتولاه برّه يوم 2.
3. **النصوص المشطوبة:** الباك بيبعت `"45.0000"` (4 خانات) — العرض بيحولها (`formatPriceAmount`)؛ الـ إجماليات الحقيقية بتيجي من الباك بس.

**⛔ STOP — Gate 4 (النهائي).** المالك راجع البصري واعتمده (2026-11-17) — شوف قسم "المراجعة النهائية لليوم 2" تحت. Day 3 بيبدأ من `DAY3_TASKS.md` (Gate 0).

---

## 🔎 المراجعة النهائية لليوم 2 (Claude — مراجع مستقل — 2026-11-17)

> المصدر الوحيد: الملفات الفعلية + أوامر اتشغلت وقت المراجعة. الملخصات القديمة اتعاملت كـ"ادعاءات" واتفحصت.
> المراجعة ما عدّلتش أي كود تطبيق (لا فرونت ولا باك). اللي اتعدّل: `docs/PROGRESS.md` + `AGENTS.md` (توثيق بس) + إنشاء `docs/DAY3_TASKS.md`.

### 1) تسوية التناقض (الحالة الحقيقية بالأدلة)

الملخص القديم كان فيه روايتين: (أ) "D1 متعمل بس مش متركّب، D2 لسه شغال" و(ب) "D1–D3 خلصوا، 24/24". **(أ) لقطة قديمة من نص الجزء D، و(ب) هي الصح.** الأدلة من الملفات:

| الادعاء | الدليل الفعلي | النتيجة |
| --- | --- | --- |
| `DesignEffects` متركّب على `/design` | `app/[locale]/design/page.tsx:19` → `<DesignEffects />` (الملف 14 سطر، بيركّب `ScrollProgressBar` + `BackToTop`) | ✅ |
| `ComponentsRow` و`MotionRow` موجودين ومتعرضين | `page.tsx:24-25` + الملفات 56 و130 سطر. الـ HTML المبني لـ `/ar/design` فيه `data-cart-target` ×1 (يعني `CartBounce` اترندر) | ✅ |
| صفحة `/design` ≤ 30 سطر | `page.tsx` = **30 سطر**، و`npm run check` = 0 warnings | ✅ |
| كل مهام DAY2 (A1…D3) متنفذة | كل ملف مذكور موجود (`git status` + قراءة) — جدول 24 صف تحت | ✅ |
| `PROGRESS.md` دقيق | **لا**: الجدول العلوي كان لسه كاتب "يوم 2 جاهز للتنفيذ" و"البصري لم يتم"، وصف C3 كان فيه `{{percent}}` القديمة، وكل البصري 🟡. اتصحح كله في المراجعة دي | ✅ بعد التصحيح |
| `AGENTS.md` بيعكس المعمارية | **جزئيًا**: شجرة §3.1 كانت قديمة (hooks/interface/shared/lib/template) — اتصححت + أُضيفت قاعدة ICU | ✅ بعد التصحيح |

### 2) نتائج الأوامر الفعلية (اتشغلت وقت المراجعة)

```
npm run lint   → exit 0، مفيش أي output (0 errors / 0 warnings)
npm run build  → ✓ Compiled successfully in 38.1s · Finished TypeScript in 9.8s ·
                 ✓ Generating static pages using 3 workers (14/14) in 2.3s
                 Routes: /[locale] (/ar /en)، /[locale]/[...rest]، /[locale]/design (/ar/design /en/design)،
                 /robots.txt، ƒ /sitemap.xml، ƒ Proxy
npm run check  → Scanned 73 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).
git diff --stat -- package.json package-lock.json → فاضي (مفيش dependency جديدة)
grep framer-motion / any / @ts-ignore / console.log في الكود → فاضي
```
الباك: `git status` بيظهر 3 ملفات معدّلة (`BACKEND_PROGRESS.md`, `swagger-store.ts`, `swagger.ts`) — دي من مهمة جرد Swagger السابقة، **مش من يوم 2** (يوم 2 ماتلمسش الباك).

### 3) فحص HTML على build حقيقي (`next start` على 3001)

| URL | النتيجة |
| --- | --- |
| `/` | 307 → `/ar` |
| `/ar` `/en` `/ar/design` `/robots.txt` `/sitemap.xml` | 200 |
| `/ar/nope` · `/en/products/x` | **404** (الـ status صح) |
| `/ar/design` | `<html lang="ar" dir="rtl" data-theme="zafran">` · title "نظام التصميم" · canonical ✓ · hreflang ×2 (**مفيش x-default**) · robots `noindex, nofollow` ✓ · h1 ×1 · `animate-page-in` ✓ |
| `/ar/design` — `style="opacity:0` | ×4 (كلها `UiRow` تحت الـ fold) · `scaleX(0)` ×3 (خطوط `SectionHeading` الزخرفية فقط) |
| `/ar/design` — نص `CountUp` في HTML السيرفر | **`["0","0","0"]`** ← عيب D2-01 تحت |
| `/ar` (placeholder) | h1 ×1، مفيش opacity:0، مفيش JSON-LD |

### 4) الباك — اللي اتجرب حي (backend على 3002، origin 3001)

| Endpoint | النتيجة |
| --- | --- |
| `GET /api/store/settings` | ✅ 200، `data` مطابق `IStoreSettings` (كل contact/social = null في الـ seed) |
| `GET /api/store/categories` | ✅ 200، `data: [...]` (3 أقسام: spices/herbs/gift-bundles، كلهم `sortOrder:0`، `imageUrl:null`) |
| `GET /api/store/banners` | ✅ 200، بانر واحد، `imageUrl` = `https://picsum.photos/...` (seed تجريبي)، `linkUrl:"/ar?category=herbs"` |
| `GET /api/store/faqs` · `/pages/about` · `/sitemap` | ✅ 200 |
| `GET /api/store/products?...` (أي فلتر) | ⛔ **400 `DB_CONSTRAINT_ERROR`** |
| `GET /api/store/products/turmeric` | ⛔ **400 `DB_CONSTRAINT_ERROR`** (بسبب `related`) |
| `GET /api/store/products/does-not-exist` | ✅ 404 `PRODUCT_NOT_FOUND` |
| `GET /api/store/search?q=cumin` | ⛔ 400 `DB_CONSTRAINT_ERROR` · `q=كركم` → 200 لكن `results:[]` (غير مفسّر) |
| `GET /api/store/products?limit=500` / `sort=bad` | ✅ 400 `VALIDATION_ERROR` (حد limit = 48) |

**سبب الـ BLOCKER بدقة (تصحيح للوصف القديم):** `backend/src/modules/store/products/list.ts` سطر 32-33 — الـ fragment `sellablePackages` بيكتب alias ثابت `pk0` (`pk0."productId" = p."id" …`)، لكنه متركّب جوه subqueries في `SELECT_FRAGMENT` أسطر 94 و97 اللي بتعمل alias للجدول `pk1` و`pk2`. فبيرجع Postgres `42P01 missing FROM-clause entry for table "pk0"`. الـ fragment ده بيتشارك مع `listRelatedProducts` (detail) و`search/service.ts → enrichRows` — فالتلات endpoints واقعين. (الـ error mapper بيحوّل أي raw-query error لـ HTTP 400 `DB_CONSTRAINT_ERROR` — مضلّل، المفروض 500.) **ماتصلحش — خارج نطاق الفرونت، والقرار إن مفيش mock ولا workaround.**

### 5) المهام — مكتملة / غير مكتملة

**مكتملة (24):** A1 A2 A3 A4 · B0 B1 B2 B3 B4 B5 B6 B7 B8 · C1 C2 C3 C4 C5 C6 C7 · D1 D2 D3 (كلها ✅، البصري منها 🟢).
**غير مكتملة / محجوبة:** **A5-بند 3 فقط** (مقارنة `IStoreProductCard` بـ رد حي) ⛔ محجوبة خارجيًا بسبب BLOCKER الباك. باقي A5 (settings/404/CORS) ✅. ده بند مسموح بيه في صياغة A5 نفسها ("لو مفيش رد: سجّل ⛔ وكمّل") ووافق عليه المدير في Gate 1 — فمش بيمنع إقفال يوم 2، بس بيتنقل لـ **DAY3 Gate 5** (التحقق بعد إصلاح الباك).

### 6) العيوب المكتشفة في المراجعة (D2-xx) — اتسجلت، **مش اتصلحت** (المراجعة ممنوع تعدّل كود)

| ID | الخطورة | العيب | الدليل | بيتصلح في |
| --- | --- | --- | --- | --- |
| D2-01 | **عالية** | `CountUp` بيرندر `0` في HTML السيرفر (والـ suffix/العملة مش بتظهر)، وبيعدّ حتى مع reduced-motion → `PriceTag` بيطلّع السعر "0" لـ SEO وno-JS | curl: `["0","0","0"]` + `CountUp.tsx:39` | DAY3 **H1** |
| D2-02 | **عالية (أمان)** | `JsonLd` بيعمل `JSON.stringify` من غير escape لـ `<` → XSS لو نص من الباك فيه `</script>` (توصية Next docs: `replace(/</g,'\\u003c')`) | `components/shared/JsonLd.tsx:6` | DAY3 **H2** |
| D2-03 | متوسطة | `.env.example` فيه `NEXT_PUBLIC_API_URL=http://localhost:3002` **من غير `/api`** → أي حد ينسخه كل الـ requests بتبوظ (`.env.local` صح) | `.env.example:1` | DAY3 **H2** |
| D2-04 | متوسطة (a11y) | ثيم **قرفة**: `Badge accent` = `bg-accent text-ink` تباين **1.40:1** (شارة "وفّرت X٪" شبه مخفية)؛ `text-ink على glow` 1.78؛ `danger` كنص على surface 2.78 و`success` 3.30 (محسوبة من `themes.css`) | حساب WCAG على القيم الفعلية | DAY3 **H3** (token `on-accent`)؛ danger/success كنص → يوم الفورم |
| D2-05 | متوسطة | `Button`: مفيش `type` افتراضي (submit ضمني جوه أي form)، و`disabled ?? isLoading` مش بيقفل الزرار لو `disabled={false}`، والـ spinner بيحل محل النص (مفيش `aria-busy`، قفزة عرض) | `Button.tsx:35-50` | DAY3 **H4** |
| D2-06 | متوسطة | `useFlyToCart`: بياخد أول `[data-cart-target]` حتى لو مخفي (مع `cacheComponents` الصفحات القديمة بتفضل mounted جوه `<Activity mode="hidden">` ← rect صفري)، والـ clone مش `aria-hidden`، ومفيش `.catch` على `.finished` | `useFlyToCart.ts:21,30,53`؛ `layout-router.js` (Activity) | DAY3 **H4** |
| D2-07 | منخفضة | `calculateSavingsPercent('99.9','100')` = `0` (مش null) → `PriceTag` بيعرض شارة "وفّرت 0٪" | تشغيل فعلي للدالة | DAY3 **H1** |
| D2-08 | منخفضة (طلب مالك) | `BackToTop` من غير الـ **progress ring** اللي المالك طلبه صراحةً (`AGENTS` brief + DESIGN_SYSTEM §5.3) — اتأجل في `DAY1_TASKS.md:149` وماتجدولش في يوم 2؛ و`scrollTo smooth` بيتجاهل reduced-motion | `BackToTop.tsx`؛ `DAY1_TASKS.md:149` | DAY3 **H5** (🟡 بصري) |
| D2-09 | منخفضة (SEO) | `buildMetadata`: مفيش `x-default` ولا `ar-EG` في hreflang (مطلوبين في FRONTEND_TASKS §3.2)، و`openGraph.locale` بـ `ar`/`en` بدل `ar_EG`/`en_US`، و`SITE_URL` بيرجع `""` لو ناقص (canonical نسبي) | `lib/seo.ts`، `lib/config.ts:3` | DAY3 **H6 + H2** |

### 7) BLOCKERS وقيود خارجية

| ID | الوصف | الأثر على يوم 3 |
| --- | --- | --- |
| B-1 | BLOCKER الباك (قسم 4): products list / product detail / search واقعين | قسم **Featured** في الهوم: حالة الـ error بتتأكد حي (الباك واقع فعلًا)، حالة الـ data **⛔ مش بتتأكد** لحد الإصلاح → DAY3 Gate 5 |
| B-2 | seed الـ demo: `settings.contact/social` كلها null، الأقسام `imageUrl:null`، البانر من picsum | WhatsApp FAB / روابط السوشال / بيانات الفوتر مش هتظهر حي — المالك لازم يملأ `STORE_CONTACT`/`STORE_SOCIAL` للتحقق البصري |
| B-3 | 3 أقسام بنفس `sortOrder:0` وبدون tie-breaker → ترتيب غير مضمون | الفرونت ماتعيدش ترتيب؛ ملاحظة للباك |
| B-4 | الباك مابيبعتش `Cache-Control` على endpoints المتجر (فقط `ETag`) رغم ما فـ STORE_BACKEND_TASKS B2 | الكاش كله بيتحكم فيه الفرونت (`use cache`) |
| B-5 | شكل أسعار الكارت: الباك بيحوّل `Decimal.toString()` (ممكن "45" مش "45.0000") — **مش متأكد حي** (endpoint واقع) | الفرونت يتعامل مع أي decimal string |

### 8) Technical debt (مش بيمنع حاجة — متابعة)

- **TD-1** تعليقات شرح كتير في ~30 ملف (مخالفة طفيفة لـ AGENTS §1.14 "مفيش تعليقات جديدة غير الـ section markers وتوثيق الـ API القصير") — اتسامح فيها للـ hooks/الحركة، القرار للمدير.
- **TD-2** الحركات المتكررة اللي مبتقفش برّه الشاشة: `Marquee`, `BorderBeam` (الكارت النشط), `skeleton-shimmer` (DAY2 §4 قال كلها) — `PulseRing` بس بيقف.
- **TD-3** `Marquee`/`BorderBeam` فيهم `"use client"` من غير حاجة.
- **TD-4** `store/store.ts` singleton على مستوى الموديول — آمن دلوقتي (مفيش slices)، **لازم يبقى factory per-request** قبل أي state بيتملى على السيرفر (سلة/auth).
- **TD-5** `NextIntlClientProvider` من غير `messages` → كل الـ messages بتتبعت لكل صفحة؛ هيتقل مع الزيادة (يوم Lighthouse).
- **TD-6** ألوان `rgb(255 255 255 / .45)` في shimmer و`#fff/#000` في masks جوه `styles/animations.css` (check مش بيفحص CSS) — مقبولة تقنيًا.
- **TD-7** `ThemeSwitcher`: مفيش `aria-expanded`/Esc/`aria-pressed`، وبيقرا labels من namespace `design` (بيتصلح في DAY3 S2).
- **TD-8** ألوان `THEMES` في `lib/theme.ts` (swatches) مكررة من `themes.css` — احتمال drift.
- **TD-9** `Input` demo من غير label (placeholder بس) — مفيش input حقيقي لسه.
- **TD-10** `MotionRow`: `setTimeout` للـ shake من غير cleanup؛ المنطق ده لازم يبقى hook (`useShake`) يوم الـ checkout.
- **TD-11** `IApiResponse` اسمه `I` وهو `type` alias (المفروض `T`) — تسمية.
- **TD-12 (بنية تحتية — خارج النطاق)** `Dockerfile`: بينسخ `.next/standalone` بس `next.config.ts` ما فيهوش `output: "standalone"` (ومكانش فيه في أي commit)؛ `EXPOSE 3003` مقابل `PORT=3001`؛ مفيش `ARG` لـ `NEXT_PUBLIC_*` فـ `lib/config.ts` بيرمي error وقت الـ build؛ ومفيش `.dockerignore` للفرونت (هينسخ `.env.local`). قرار المالك/DevOps.
- **TD-13** `app/[locale]/template.tsx` (B8): الـ template بيتعمل remount لما الـ **child segment المباشر** تحت `[locale]` يتغير (docs: template.md). جوه route group واحد `(Store)` مش هيعيد الحركة بين صفحات المتجر — قرار يوم 4 لما تبقى فيه صفحة تانية.

### 9) الانحرافات عن DAY2_TASKS.md (كلها)

1. البورت 3002 بدل 3000 (قرار مدير، Gate 1). 2. A5-بند 3 محجوب (BLOCKER باك). 3. CSS المكونات في `styles/animations.css` مش جنب الكومبوننت. 4. `BorderBeam`: كل الـ paint في `.border-beam` (قاعدة اللون الخام). 5. ICU `{percent}`. 6. `shine` على variant whatsapp بس. 7. اسم الـ hook `useFlyToCart` + `CartBounce`. **جديد من المراجعة:** 8. `calculateSavingsPercent` سلوك الصفر (D2-07). 9. بند "تقف برّه الشاشة" غير مطبّق على `Marquee`/`BorderBeam` (TD-2). 10. ring الـ BackToTop مؤجل من يوم 1 ومات في الطريق (D2-08).

### 10) اعتماد المالك البصري

**المالك اعتمد صراحةً التنفيذ البصري لليوم 1 واليوم 2** (2026-11-17، تم إبلاغه للمراجع). كل 🟡 اتحوّلت لـ 🟢 في الجداول فوق. الاعتماد:
- **بيشمل:** ThemeSwitcher، CountUp، ScrollProgressBar، BackToTop (بشكله الحالي)، الخط والثيم الافتراضي كما اتعرضوا، وكل مكونات يوم 2 (Spotlight, BorderBeam, PulseRing, Marquee, Confetti, FlyToCart/CartBounce, PageTransition, Button whatsapp+shine, Badges, PriceTag, SectionHeading, TrustStrip, Empty/ErrorState, GlowCard, Toaster, صفوف /design).
- **مش بيشمل:** أي شاشة يوم 3، ولا أي تغيير بصري جديد على مكوّن معتمد (مثلًا ring الـ BackToTop H5 وtoken الـ `on-accent` H3) — دي بتتعرض تاني.
- **العيوب التقنية** D2-04 (تباين قرفة) وD2-08 (ring) مش "رفض بصري" — هي ملاحظات تدقيق، وتتنفذ بموافقة المدير في Gate 1.

### 11) تعديلات التوثيق اللي عملتها المراجعة

`PROGRESS.md`: الجدول العلوي، رموز الحالة (🟢)، بنود يوم 1 "لسه مش مكتمل"، وصف C3 (`{percent}`)، أسطر الـ STOP، + القسم ده. `AGENTS.md`: شجرة §3.1 (hooks/interface/shared/lib/template/ECommerce planned)، جدول Animation/Shared، قاعدة ICU في §13. **مفيش كود اتعدّل.**

### 12) حدود المراجعة (اللي مافحصتوش)

مفيش متصفح اتفتح: مفيش فحص hydration warnings في الـ console، ولا Lighthouse، ولا قارئ شاشة، ولا RTL بصري (اعتمدت على اعتماد المالك). التباين اتحسب رياضيًا من `themes.css` مش بصريًا.

### 13) الخطوة التالية

يوم 3 = **غلاف المتجر + الهوم + SEO** — التفاصيل كلها في `docs/DAY3_TASKS.md`. المنفّذ (GLM) يبدأ بـ **Gate 0 (قراءة + إجابات + فحص حي)** وممنوع كود قبل موافقة المدير.

---

## يوم 2.5 — التثبيت وإصلاح عيوب المراجعة (2026-11-17)

> المدير أمر بإصلاح D2-01…D2-09 (+ M-2/M-3 المعتمدين) **اليوم، قبل يوم 3**. النطاق: `frontend` فقط، الباك read-only، من غير تبعيات جديدة، ومن غير بدء يوم 3. كل تحديث هنا بعد كل مهمة.

### S1 — `CountUp` يعرض النهائي في SSR (D2-01) ✅

- **الملفات:** `components/Animation/CountUp.tsx` (المحتوى أعيد كتابته، نفس الـ props والسلوك البصري للعدّ).
- **السبب:** الـ `<span>` كان hard-coded `0` + `useMotionValue(0)` فالسيرفر بيطلع "0" (والـ suffix مش بيظهر) لحد hydration.
- **الإصلاح:** (1) children بتاع الـ span = النص النهائي `value.toFixed(decimals)+suffix` → موجود في SSR وأول client render (مفيش hydration mismatch). (2) العدّ بيحصل **بس** لو: العنصر ماكانش ظاهر وقت الـ mount (`getClientRects().length` بتتقاس مرة واحدة في أول effect run وتتخزن في ref)، ومعندوش `prefers-reduced-motion`، ولسه ماعدّش (`once`). (3) عند دخول الشاشة: `motionValue.jump(0)` + كتابة `0` ثم `animate` بنفس spring (300/24) والنص النهائي بيتكتب في آخر frame. (4) أي إعادة تشغيل للـ effect بعد العدّ (تغيير `value` مثلًا) بتكتب النهائي فورًا من غير عدّ.
- **قبل/بعد:** قبل — SSR `["0","0","0"]` + عدّ حتى مع reduced-motion؛ بعد — SSR بالقيم النهائية، العدّ تحت الـ fold بس، reduced-motion = ثابت.
- **اختبارات:** lint/build/check أخضر (73 ملف، 0/0) + فحص SSR HTML بعد البناء في قسم التحقق النهائي تحت.

### S2 — `JsonLd` XSS escape (D2-02) ✅

- **الملفات:** `components/shared/JsonLd.tsx`.
- **السبب:** `JSON.stringify(data)` خام في `dangerouslySetInnerHTML` — نص من الباك فيه `</script>` يكسر/يحقن الصفحة.
- **الإصلاح:** `JSON.stringify(data).replace(/</g, "\\u003c")` (الطريقة الرسمية في Next docs `json-ld.md`).
- **قبل/بعد:** قبل — `<` خام جوه script JSON-LD؛ بعد — كل `<` متحولة `\u003c` (JSON صالح والـ parse بيرجع نفس القيمة).
- **اختبارات:** `grep -n u003c` ✓، وفحص الـ SSR HTML في التحقق النهائي. ملاحظة: `JsonLd` مش مستخدَم في أي صفحة حاليًا (recipe لليوم 3).

### S3 — `.env.example` (D2-03) ✅

- **الملفات:** `.env.example`.
- **السبب:** `NEXT_PUBLIC_API_URL=http://localhost:3002` من غير `/api` بينما `store/baseApi.ts` بيبني `baseUrl + "/store/..."` — أي حد ينسخ الملف كل الـ requests بتضرب 404.
- **الإصلاح:** `NEXT_PUBLIC_API_URL=http://localhost:3002/api` + `NEXT_PUBLIC_SITE_URL=http://localhost:3001` + سطر معلّق اختياري `# API_INTERNAL_URL=` (زي ما DAY3 H2 محدد — جلب السيرفر يوم 3). مفيش secrets.
- **اختبارات:** مقارنة بعينها مع `store/baseApi.ts` + `.env.local` (الفعلي مش اتغير).

### S7 — سياسة نسبة التوفير (D2-07) ✅

- **الملفات:** `lib/price.ts` (`calculateSavingsPercent` + تعليق التوثيق).
- **السبب:** `Math.round(0.1%) = 0` وبيرجع `0` بدل `null` → شارة "وفّرت 0٪".
- **الإصلاح:** الناتج المقرّب أقل من 1 ⇒ `null` (مفيش شارة). السياسة: مش بنطلع خصم مش موجود (مفيش rounding-up لـ 1% لو التوفير 0.4%)، ونفس القواعد القديمة: غير رقم/سالب/تساوي ⇒ `null`.
- **قبل/بعد:** `('99.9','100')`: قبل `0` (شارة 0٪) — بعد `null` (مفيش شارة). `('45','60')` زي ما هو `25`.
- **اختبارات:** 14/14 PASS (tsc compile + node: 0.1%/0.4%/0.5%، عادي، عشري، متساوي، سالب، سعر صفر، الصفرين، قيم غير صالحة، formatPriceAmount) — سكربت في `%TEMP%/opencode/pricetest/` (مفيش test framework في الريبو وممنوع تبعيات).

### S4 / M-2 — تباين `Badge accent` في ثيم قرفة (D2-04) ✅ (معتمد المدير)

- **الملفات:** `styles/tokens.css`، `styles/themes.css` (كل الثيمات)، `components/ui/Badge.tsx`.
- **السبب:** variant `accent` كان `bg-accent text-ink`؛ في cinnamon `#f6e9d2` على `#f2c14e` = **1.40:1** (فشل WCAG).
- **الإصلاح:** إضافة token `--color-on-accent` لكل الثيمات: zafran `#2b1a12`، attar `#1f2a1c`، cinnamon `#241105` (يطابق on-primary الدافي)، hibiscus `#2a1216` (يساوي ink للثيمات الفاتحة — مفيش تغيير بصري عليهم)، + default في `@theme`. `Badge accent` بقى `text-on-accent`. `grep` تأكد مفيش `bg-accent`+`text-ink` تاني؛ باقي استخدامات `bg-accent` زخرفية/سواتش.
- **قبل/بعد (تباين حسابي):** cinnamon **1.40:1 → 10.81:1**؛ zafran 7.36:1، attar 4.77:1، hibiscus 6.67:1 (ثابتة لأن on-accent = ink في الفاتحة). الهوية البصرية للقرفة محفوظة.
- **اختبارات:** حساب تباين بـ node (سكربت WCAG luminance) + lint/check/build أخضر. يحتاج تأكيد بصري من المالك لشارة التوفير في ثيم قرفة.

### S5 — أمان `Button` (D2-05) ✅

- **الملفات:** `components/ui/Button.tsx`.
- **السبب:** مفيش `type` افتراضي (submit ضمني جوه form)، و`disabled ?? isLoading` بيسمح لـ `disabled={false}` يفضل enabled وقت التحميل، ومفيش `aria-busy`.
- **الإصلاح:** `type={type ?? "button"}` قبل spread (الـ explicit `type` بيتغطى لو اتبعت)، `disabled={disabled || isLoading}`، `aria-busy={isLoading || undefined}`. وقت التحميل: `<span className="opacity-0">{children}</span>` + `Loader2` مطلق `aria-hidden` عشان العرض يثبت والنص يفضل لقارئ الشاشة (المظهر: spinner بس).
- **قبل/بعد:** قبل — زر جوه form يـsubmit ضمنيًا، و`disabled=false` + `isLoading=true` = قابل للضغط؛ بعد — افتراضي `button`، أي حالة تحميل بتقفل التفاعل. الـ variants والشكل العام زي ما هما.
- **اختبارات:** lint/check/build أخضر. يفضل تأكيد يدوي: زرار submit صريح جوه form لسه بيعمل submit.

### S6 — `useFlyToCart` هدف مرئي + تنظيف (D2-06) ✅

- **الملفات:** `hooks/useFlyToCart.ts`.
- **السبب:** `querySelector("[data-cart-target]")` بياخد أول عنصر حتى لو مخفي (مع `cacheComponents` صفحات قديمة ممكن تفضل mounted جوه `<Activity mode="hidden">` بـ rect صفري)، والـ clone مش `aria-hidden` وفيه ids مكررة، ومفيش `.catch` على `.finished`.
- **الإصلاح:** اختيار أول `[data-cart-target]` له `getClientRects().length > 0`. الـ clone: `aria-hidden="true"` + `inert` + إزالة `id` منه ومن أولاده. `.finished.then(done, () => clone.remove())` (تنظيف في الحالتين، `onArrive` في النجاح بس). المسار/المدة/الـ easing/reduced-motion زي ما هما.
- **قبل/بعد:** قبل — ممكن يطير لهدف مخفي/صفري، clone قابل للـ a11y، وتسريب لو الـ animation اترفضت؛ بعد — هدف مرئي بس، clone معزول، وتنظيف مضمون.
- **اختبارات:** lint/check/build أخضر. السلوك البصري (طيران + bounce) يحتاج تأكيد يدوي على `/design`.

### S8 / M-3 — حلقة تقدم `BackToTop` (D2-08) ✅ (معتمد المدير) + تعديل مالك لاحق

- **الملفات:** `components/Animation/ScrollProgressRing.tsx`، `components/Animation/BackToTop.tsx`.
- **السبب:** المالك طلب زرار تقدم لفوق، وبعدها طلب شكل "prime": يظهر أول ما المستخدم ينزل، خلفية شفافة تتملي بتموّج مايه من جوه مع حلقة تقدم بره، الاتنين يمشوا مع تقدم الصفحة، ويختفي أول ما يطلع ويرجع أول ما ينزل تاني، واللون حسب الثيم.
- **الإصلاح الحالي:** الزرار مكانه ثابت (`fixed bottom-6 end-6`) ويظهر أول ما النزول يتعدى ارتفاع الشاشة (`scrollY > window.innerHeight`) ويفضل ظاهر في نفس المكان طول ما المستخدم تحت الـ fold (وأنت نازل أو طالع) عشان يشوف تقدم التعبئة، ويختفي لما يرجع لفوق الشاشة. خلفية الزرار شفافة (`bg-transparent`)؛ `ScrollProgressRing` بياخد `scrollYProgress` ويعرض حلقة خارجية (`stroke-primary`) + تعبئة داخلية مقصوصة بدائرة بتموّج (`fill-primary` + path متحرك أفقيًا) ترتفع بـ `useTransform(progress)`، فالحلقة والمايه يتمّلوا/يفضوا مع نفس التقدم وبألوان الثيم. `scrollTo` يحترم reduced-motion، والسهم `aria-hidden`.
- **قبل/بعد:** قبل (M-3 الأولي) — زرار primary ثابت بعد أول شاشة + حلقة accent خارجية فقط؛ بعد — زرار شفاف ثابت الموضع بعد أول شاشة مع تعبئة مياه + حلقة `primary` متزامنتين بتعكس تقدم الصفحة.
- **اختبارات:** lint/check/build أخضر. يحتاج تأكيد بصري تفاعلي (تموّج/وضوح السهم/4 ثيمات/RTL/موبايل-سطح مكتب).

### S9 — SEO metadata: hreflang + OG locale (D2-09) ✅

- **الملفات:** `lib/seo.ts`، و`lib/config.ts` (تحقق `SITE_URL`).
- **السبب:** `alternates.languages` فيه `ar` و`en` بس (مفيش `ar-EG` ولا `x-default` المطلوبة في الخطة)، و`openGraph.locale` كان `ar`/`en` بدل الشكل الإقليمي `ar_EG`/`en_US`.
- **الإصلاح:** `languages` بقى `{ [locale], [otherLocale], "ar-EG": <ar url>, "x-default": <default ar url> }` (كلها URLs كاملة بـ `SITE_URL`). OG: `locale` = `OG_LOCALE` map (`ar`→`ar_EG`, `en`→`en_US`) + `alternateLocale` للّغة التانية. نفس الـ signature والـ canonical/path logic (ماتكسرش layout/`design/metadata.ts`). مافيش locale URLs متخترعة (ar-EG بتشاور على مسار `/ar` الموجود). كمان اتقفل جزء D2-09/H2: `lib/config.ts` بيرمي error لو `NEXT_PUBLIC_SITE_URL` فاضي (زي `API_BASE_URL`) عشان canonical مايرجعش نسبي.
- **قبل/بعد:** قبل — hreflang = `ar,en`، `og:locale=ar`، `SITE_URL` فاضي مسموح؛ بعد — hreflang = `ar,en,ar-EG,x-default`، `og:locale=ar_EG` + `og:locale:alternate=en_US` على `/ar/design`، وconfig بيرفض SITE_URL الفاضي.
- **اختبارات:** lint/check/build أخضر + فحص SSR HTML في التحقق النهائي.

### التحقق النهائي (Day 2.5) ✅

- **أوامر (آخر تشغيل):** `npm run lint` ✅ — `npm run check` ✅ `Scanned 74 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).` — `npm run build` ✅ (Turbopack, صفحات static/partial prerender). `package.json`/lock من غير تبعيات جديدة.
- **SSR HTML (من `.next/server/app/[locale]/design.html` بعد البناء، وهي نفس مخرجات prerender):**
  - `/ar/design`: `hreflang=["ar","en","ar-EG","x-default"]`، `og:locale="ar_EG"`، `og:locale:alternate="en_US"`، canonical `http://localhost:3001/ar/design`، `CountUp` spans = `["120 ج.م","45 ج.م","120 ج.م"]` (قبل كان `["0","0","0"]`)، `ld+json` blocks = 0 (الـ component مش مستخدم حاليًا — S2 متحقق بالكود `grep u003c`).
  - `/en/design`: `hreflang=["en","ar","ar-EG","x-default"]`، `og:locale="en_US"`/`ar_EG`، `CountUp` spans = `["120 EGP","45 EGP","120 EGP"]`.
- **ملاحظات:** (1) فحص JSON-LD runtime مش ممكن لعدم وجود `<JsonLd>` مستخدم الآن؛ الإصلاح (escape `\u003c`) مؤكد في المصدر. (2) مفيش متصفح: حلقة تقدم BackToTop، طيران FlyToCart، وظهور Badge accent في قرفة محتاجين تأكيد بصري يدوي + RTL/موبايل/سطح مكتب. (3) مفيش اختبارات unit framework في الريبو — S7 اتختبر بـ `tsc` compile + node (14/14).
- **مش متحل:** مفيش (كل S1–S9 + M-2/M-3 منفذين). `DAY3_TASKS.md` اتحدّثت بس بعلامات "مُنجز في Day 2.5" على البنود المقابلة.
- **الخطوة:** وقف لمراجعة المدير. ممنوع البدء في يوم 3.

---

## سجل اليوم 3 — Gate 0 (Pre-flight) — 2026-11-18

> الحالة: **قراءة + فحص أساسي + فحص باك حي + إجابات + قرارات M-1..M-9** (بدون أي تعديل كود تطبيق). **لا كود قبل موافقة المدير.**

### 0) الملفات المقروءة (Gate 0) + المستفاد

| # | الملف/المصدر | اتقرا | طلّعت منه إيه |
| --- | --- | --- | --- |
| 1 | `docs/DAY3_TASKS.md` (كامل، 788 سطر، عناوين §0–§13 + Appendices A/B) | ✅ | نطاق يوم 3 (غلاف المتجر + هوم SSR + server data + Cloudinary loader + SEO/JSON-LD/hreflang/sitemap)، Gates 0–5، قواعد 1–12، استبعادات/KS-1..3، عقود الباك المتوقعة، A-1..A-13، H1–H7/F1–F4/S1–S6/HM1–HM6/D1–D3/V1–V5، مصفوفة 10.3، قرارات M-1..M-9، ملاحظة "D2-01..D2-09/M-2/M-3 مُنجزة Day 2.5 — تحقق فقط" |
| 2 | `docs/PROGRESS.md` (ذيل السجل + سياق Day 2.5) | ✅ | S1–S9 + M-2/M-3 منفذة ومتحققة (lint/check/build أخضر، 74 ملف/53 مفتاح)، SSR `/ar|en/design` فيه CountUp نهائي + hreflang×4 + og:locale صحيح، تعديلات مالك لاحقة على BackToTop؛ لا يوجد قسم "سجل اليوم 3" سابق |
| 3 | `components/Animation/CountUp.tsx` | ✅ | SSR يكتب النهائي `value.toFixed(decimals)+suffix`؛ عدّ فقط لو تحت الـ fold وقت mount + inView + بلا reduced-motion + مرة واحدة؛ غير كده يكتب النهائي فورًا (يتحقق S1/D2-01) |
| 4 | `components/shared/JsonLd.tsx`, `.env.example`, `lib/config.ts`, `lib/seo.ts` | ✅ | `JsonLd` يعمل `replace(/</g,"\u003c")` (S2)؛ env فيه `/api` + `SITE_URL` + `# API_INTERNAL_URL` (S3)؛ `config` يرمي لو `SITE_URL` فاضي؛ `seo` فيه `ar-EG`/`x-default` و`OG_LOCALE ar_EG/en_US` (S9) |
| 5 | `styles/tokens.css`, `styles/themes.css`, `components/ui/Badge.tsx`, `lib/price.ts` | ✅ | `--color-on-accent` لكل الثيمات وBadge accent يستخدمه (S4/M-2)؛ `calculateSavingsPercent` يرجع `null` لو التقريب < 1% (S7) |
| 6 | `hooks/useFlyToCart.ts`, `components/Animation/CartBounce.tsx` | ✅ | أول `[data-cart-target]` مرئي (`getClientRects().length>0`)، clone `aria-hidden`+`inert`+ids محذوفة، `.finished.then(done, cleanup)`؛ CartBounce يضع `data-cart-target` واحد |
| 7 | `store/baseApi.ts`, `interface/store.ts` | ✅ | `isEnvelopeFailure` ما زالت محلية في `baseApi` (نقلها لـ `lib/envelope.ts` مهمة F1/Gate 1)؛ عقود المتجر الحالية (ProductCard/Settings) مطابقة لتعليق المصدر؛ لا توجد `IStoreCategoryNode`/`IStoreBanner` بعد (F1) |
| 8 | `frontend/AGENTS.md`, `docs/{FRONTEND_TASKS_10_DAYS,DESIGN_SYSTEM,DAY2_TASKS,DAY1_TASKS}.md` (مراجعة سياقية عبر DAY3 + PROGRESS) | ✅ | قواعد التقسيم/الأسماء/التوكنز/ICU single-brace/Next 16 (`cacheComponents`, async params, proxy)/ممنوع mocks؛ DAY3 يستند لخطة الهوم/SEO القديمة (اليوم 8) |

> ملاحظة: قراءة كل ملف مفصّل في قائمة §4 من DAY3_TASKS.md لم تُستكمل حرفيًا لكل عنصر في هذه الجلسة؛ Gate 0 اعتمد على DAY3_TASKS + PROGRESS + الملفات الحرجة للتحقق (D2.5/H1–H7,F1) + فحص حي. المنفّذ يكمل قراءة §4 الكاملة عند بدء التنفيذ بعد الموافقة.

### 1) إجابات الأسئلة الـ 12 (Gate 0 / §3.2)

1. **نطاق يوم 3:** داخل = غلاف المتجر `(Store)` (Header/Footer/WhatsAppFAB/ScrollEffects/SkipLink) + هوم SSR (Hero، Trust، Banners، Categories، Featured) + طبقة بيانات سيرفر (`lib/server/*`) + Cloudinary custom loader + SEO (Org/WebSite JSON-LD، hreflang/OG، sitemap). خارج = كتالوج/منتج/بحث/سلة/checkout/تتبع/حساب، بحث الهيدر، wishlist، add-to-cart/عداد سلة، countdown، صورة هيرو، RTK Query store endpoints/slices/validation، Dockerfix/store-per-request/messages trim. **لينكات ميتة مقبولة:** KS-1 `/{locale}/products?category=<slug>` (يوم 4)، KS-2 `/{locale}/products/<slug>` (يوم 4/5)، KS-3 `/{locale}/cart` (يوم 5) — صفحاتها غير مبنية.
2. **Endpoints يوم 3:** `GET store/settings` (object)، `GET store/categories` (array)، `GET store/banners` (array)، `GET store/products?featured=true&limit=8&sort=newest` (array + `meta` على مستوى الـ envelope) — وكلها عبر envelope `{success,message,data?,meta?}` والنجاح يحمل `data`. **BLOCKED (تاريخيًا/MUST re-verify):** `store/products`, `store/products/:slug`, `store/search` بسبب alias `pk0` في `backend/src/modules/store/products/list.ts:32-33` مُستخدم في subqueries المُعرّفة كـ `pk1`/`pk2` (`:94,:97`) → Postgres `42P01` ويظهر كـ HTTP 400 `DB_CONSTRAINT_ERROR`. **حالة حيّة الآن:** ⛔ الباك غير قابل للوصول على `:3002` (انظر §3) فلا تأكيد حي.
3. **`cacheComponents` + Suspense:** أي مكوّن async يجلب بيانات يجب أن يُغلَف بـ `<Suspense fallback=Skeleton>` وإلا يفشل البناء ("uncached data outside Suspense"). **مع الباك واقف وقت البناء:** يجب أن ينجح `npm run build` (M1) لأن `storeFetch` لا يرمي ويعيد `TStoreResult`; الـ queries تحت `"use cache"` + `cacheTag` + `cacheLife` شرطي (نجاح `"minutes"` داخل prerender، فشل `"seconds"` ⇒ dynamic hole لا يُخبّأ) أو خطة A-3 البديلة عند الفشل — مع تسجيل النتيجة الفعلية.
4. **`template.tsx`:** يُعاد remount عند تغيّر **الـ child segment المباشر** تحت `[locale]` (مرجع: `node_modules/next/dist/docs/.../template.md`). داخل route group واحد `(Store)` لن يُعاد بين صفحات المتجر، لذا تعديله/نقله ليس من مهام يوم 3 (TD-13، يُحسم يوم 4).
5. **لماذا لا `PriceTag` قبل H1؟** لأنه يعتمد `CountUp` الذي كان (قبل Day 2.5) يرسم `0` في SSR/أول render ويخفي الـ suffix، فالسعر/المشطوب/نسبة التوفير تظهر "0" في HTML (SEO/no-JS) وقد تُظهر شارة "وفّرت 0٪"؛ H1 أصلح SSR النهائي والسلوك، وS7 جعل التوفير <1% ⇒ `null`. (Day 2.5 نفّذها — التحقق مطلوب قبل F1+.)
6. **الفلوس:** strings عشرية (مثل `"45.0000"`/`"45"`, `compareAtFrom`/`freeShippingThreshold` قد تكون null). التحويل للعرض فقط في `lib/price.ts` (`formatPriceAmount`, `calculateSavingsPercent` داخل `PriceTag`). **ممنوع** جمع/ضرب/خصم/حسابات. لو الباك أرسل `"45"` بدل `"45.0000"`: `Number("45")` صالح و`formatPriceAmount` يعرض `"45"` (عدد صحيح) — مقبول؛ القيم غير الصالحة تُعاد كما هي.
7. **`data-cart-target` واحد فقط:** عنصر واحد مرئي في الـ DOM الحقيقي (CartLink في الهيدر بعنصر responsive واحد). مع `cacheComponents` قد تبقى صفحات قديمة mounted مخفية (`<Activity mode="hidden">`) فيلتقط `querySelector` هدفًا مخفيًا؛ لذا `useFlyToCart` يختار أول عنصر مرئي (`getClientRects().length>0`) — مؤكد في `hooks/useFlyToCart.ts`.
8. **استراتيجية الصور:** الباك يخزّن URLs كاملة (`primaryImage.url`, `secondaryImage.url`, `imageUrl`, `mobileImageUrl`). الفرونت يضيف `images:{loader:"custom",loaderFile:"./lib/imageLoader.ts"}` يحقن `c_limit,w_<width>,f_auto,q_auto` لمسارات `res.cloudinary.com/.../image/upload/v<digits>/...` فقط ويترك غيرها. بدون `remotePatterns` لأن custom loader يتجاوز تحقق الـ hosts (يتأكد في build). `alt` و`sizes` إجباريان؛ `preload` بدل `priority` المهجورة.
9. **أيقونات البراندات (lucide-react v1.73):** غير متوفرة (`Facebook/Instagram/Youtube/Twitter` ❌). السوشال تُعرض كنص اسم الشبكة من messages + أيقونة `ExternalLink` بروابط آمنة (`toSafeExternalUrl`)؛ ممنوع SVG لوجوهات براندات.
10. **ICU single-brace:** الرسائل تستخدم صيغة ICU بأقواس مفردة `{name}`/`{percent}` (قاعدة المشروع/الـ check)؛ `{{percent}}` مخالفة. مثال plural عربي صحيح: `{count, plural, =0 {مفيش منتجات} one {منتج واحد} two {منتجين} few {# منتجات} many {# منتج} other {# منتج}}`.
11. **قاعدة 🟡/🟢 والنصوص:** أي شكل/حركة/نسخة جديدة = `🟡 بانتظار المالك`؛ `🟢` فقط لما اعتمده المالك صراحة (اعتماد Day 1+2 لا يشمل شاشات Day 3 أو تغييرات بصرية جديدة). النصوص الجديدة (ar/en بنفس المفاتيح) واقعية فقط: ممنوع ادعاءات غير مدعومة (شحن مجاني/ضمان/استبدال/ضريبة/"شامل"…) إلا ما يثبته الـ API/قدرات موثقة (COD، واتساب إذا الرقم صالح).
12. **ملفات تُحذف/تُنقل في Day 3:** `app/[locale]/page.tsx` يُحذف بعد نقل الهوم إلى `app/[locale]/(Store)/page.tsx` (ممنوع الاثنين). `components/design/DesignEffects.tsx` يُدمج/يُستبدل بـ `components/Animation/ScrollEffects.tsx` ويُحدّث استيراد `/design` (M-4) — **يتأكد بـ `grep` قبل الحذف** أن لا مستهلكين آخرين. (`app/[locale]/design/page.tsx` يبقى مكانه/≤30 سطر).

### 2) القرارات المطلوبة من المدير (M-1..M-9) — مراجعة وتوصية

| # | القرار | الحالة/الملاحظة | توصية Gate 0 |
| --- | --- | --- | --- |
| M-1 | تأكيد نطاق يوم 3 = غلاف المتجر + هوم + SEO (§2.1) | غير مؤكد صراحةً في هذا السياق | ✅ **الموصى به** (متوافق مع PROGRESS/FRONTEND_TASKS/ DAY3) — يلزم تأكيد المدير |
| M-2 | إضافة `--color-on-accent` لـ tokens/themes + `Badge accent` | **مُعتمد ومُنفذ في Day 2.5 (S4)**؛ تحقق بصري قرفة متبقٍ للمالك | ✅ تأكيد/إقرار مكتمل — بدون إعادة تنفيذ |
| M-3 | `BackToTop` بحلقة/تقدم ماء (تغيير بصري على مكوّن معتمد) | **مُعتمد ومُنفذ في Day 2.5 (S8) + تعديل مالك لاحق** | ✅ تأكيد/إقرار مكتمل — 🟡 تأكيد بصري تفاعلي متبقٍ |
| M-4 | دمج `DesignEffects` → `components/Animation/ScrollEffects.tsx` واستخدامه في `/design` والمتجر (S5) | بانتظار موافقة | ✅ **الموصى به** (تقليل تكرار، متوافق مع H5/S5) |
| M-5 | Featured: يختفي لو فاضي، ErrorState لو فشل | بانتظار موافقة | ✅ **الموصى به** (واضح للمستخدم/لا يخفي العطل) |
| M-6 | البانرات بدون autoplay/dots (أسهم فقط) | بانتظار موافقة | ✅ **الموصى به** (a11y/بساطة) |
| M-7 | الهيرو بدون صورة منتج/لوجو (تايبوجرافي + زخرفة tokens) | بانتظار موافقة (لا assets جاهزة) | ✅ **الموصى به** |
| M-8 | واتساب: أرقام دولية digits فقط `^[1-9]\d{7,14}$` بعد تطبيع `+`/`00`؛ محلي `010…` ⇒ إخفاء الزر | بانتظار موافقة المالك | ✅ **الموصى به** (يمنع روابط خاطئة) — تأكيد شكل البيانات من المالك |
| M-9 | Western digits (`45`) | بانتظار موافقة | ✅ **الموصى به** (متسق مع المعتمد بصريًا) |

### 3) الأوامر الأساسية (§3.4) — نتيجة فعلية (هذه الجلسة)

| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | **لم يُحسم في هذه الجلسة** (محاولات إعادة التشغيل لم تُنتج مخرجات حاسمة ضمن نافذة التنفيذ؛ baseline سابق في الجلسة مُبلّغ "أخضر"). يُوصى بإعادة التشغيل في terminal نظيف وتسجيل آخر الأسطر. |
| `npm run build` | **محاولة إعادة التشغيل فشلت بشكل عابر**: `TurbopackInternalError` أثناء `app/globals.css` مع `node process exited ... 0xc0000142` (بيئة Windows/spawn). لا يوجد `BUILD_ID` حاليًا في `.next`. (baseline سابق في الجلسة مُبلّغ "✅ 14/14"). يُوصى بإعادة التشغيل بعد التأكد من عدم وجود عمليات Node معلقة. |
| `npm run check` | ✅ `Scanned 74 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).` (أُعيد تشغيله الآن) |
| `git diff --stat -- package.json package-lock.json` | ✅ (فارغ) |

> تعارض/ملاحظة: لم أستطع تقديم "آخر الأسطر" لـ lint/build بنجاح كامل في هذه الجلسة رغم نجاح check؛ يجب عدم اعتبار Gate 0 مكتمل التحقق الآلي حتى تُعاد 3.4 بنجاح وتُسجّل.

### 4) فحص الباك الحي (§3.5) — 2026-11-18

- الهدف: `http://localhost:3002/api` مع `Origin: http://localhost:3001` للمسارات `store/settings`, `store/categories`, `store/banners`, `store/products?featured=true&limit=2`, `store/products/does-not-exist` (+ products/search إضافي).

| الطلب | النتيجة |
| --- | --- |
| `GET /api/store/settings` | ⛔ **غير قابل للوصول** (`ECONNREFUSED` / لا استجابة) |
| `GET /api/store/categories` | ⛔ غير قابل للوصول |
| `GET /api/store/banners` | ⛔ غير قابل للوصول |
| `GET /api/store/products?featured=true&limit=2` | ⛔ غير قابل للوصول |
| `GET /api/store/products?page=1&limit=1` | ⛔ غير قابل للوصول |
| `GET /api/store/products/does-not-exist` | ⛔ غير قابل للوصول |
| `GET /api/store/search?q=test` | ⛔ غير قابل للوصول |

**استنتاج:** `⛔ الباك واقف/غير متاح على :3002 وقت الفحص` — **لا يمكن تأكيد** حالة BLOCKER المنتجات (`DB_CONSTRAINT_ERROR`) حيًا الآن، ولا CORS headers، ولا shapes الفعلية. يجب إعادة §3.5 عند تشغيل `backend npm run dev` وتسجيل أول ~300 حرف + status لكل رد قبل الاعتماد على Gate 5/افتراضات البيانات. (التاريخ المعروف 2026-11-17: products/search/detail محجوبة، والباقي حي — **غير مُعاد التحقق**.)

### 5) تعارضات/مخاطر مسجلة لـ Gate 0

- R-G0-1: تعذّر إكمال تحقق 3.4 (lint/build) بنجاح في هذه الجلسة؛ check أخضر فقط.
- R-G0-2: الباك غير متاح ⇒ حالة B-1/عقود/أشكال الفلوس الحية غير مؤكدة (V1 مؤجل).
- R-G0-3: H7 (تنظيف: `readThemeCookie`/تصدير `GlowCard` memo/`inert` للنسخة المكررة في Marquee) **غير منفذ بعد** — ضمن Gate 1 المتوقع، لا ينفذ الآن.
- R-G0-4: `isEnvelopeFailure` ما زالت في `store/baseApi.ts` (نقلها إلى `lib/envelope.ts` مهمة F1).

### 6) ما يجب على المالك/المدير فعله الآن

- تأكيد/تعديل قرارات **M-1, M-4..M-9** (M-2/M-3 مُسجّلة كمُعتمدة/منفذة).
- إعادة تشغيل `npm run lint && npm run build && npm run check` في بيئة نظيفة وتسجيل النتائج إن لزم.
- تشغيل الباك وإعادة §3.5 لتحديث حالة blocker/العقود.
- الموافقة الصريحة للانتقال إلى **Gate 1**.

⛔ **STOP — Gate 0 — بانتظار موافقة المدير.** (لا كود تطبيق نُفّذ في Gate 0.)

### 7) Addendum — Pre-Gate-1 verification (2026-11-18, قرارات المدير مُسجّلة)

- **تغطية قراءة §4 (DAY3_TASKS):** مراجعة واسعة لمنظومة Day 3/السياق اكتملت على: `frontend/docs/{AGENTS,PROGRESS,DESIGN_SYSTEM,FRONTEND_TASKS_10_DAYS,DAY2_TASKS,DAY1_TASKS,DAY3_TASKS}.md` (DAY3 §0–§13 + Appendices)، `styles/{tokens,themes,animations}.css`, `lib/{price,seo,config,confetti,locale,motion,theme,utils}.ts`, `hooks/*`, `store/baseApi.ts` + `store.ts`, `interface/{api,index,store}.ts`, مكوّنات `components/{Animation,ui,shared,design}/*` الحرجة (CountUp/CartBounce/ScrollProgressRing/BackToTop/JsonLd/Button/Badge/GlowCard/Marquee/PriceTag/ThemeSwitcher)، مسارات `app/[locale]/{layout,template,page,error,not-found,[...rest],design/*}` + `app/{sitemap,robots}.ts`, `next.config.ts`, `scripts/check-rules.mjs`, `messages/{ar,en}.json`, وعقود الباك المقروءة `backend/src/modules/store/{categories,content,settings,products,sitemap}/*` + `backend/src/shared/{response,pagination}.ts` مع فحص `products/list.ts` (يؤكد `pk0` مقابل subqueries `pk1/pk2`). مراجع Next 16 المحلية متاحة (`node_modules/next/dist/docs/01-app/...`).
- **سلامة `docs/PROGRESS.md`:** لا آثار heredoc/shell؛ تم تصحيح صف جدول M-3 المكسور في سجل Gate 0 مع الحفاظ على التاريخ. لا تعديل على كود التطبيق؛ التعديل الوحيد في هذا المسار على `docs/PROGRESS.md`.
- **قرارات المدير (M-1..M-9) — مُعتمدة:**
  - **M-1:** ✅ APPROVED — تأكيد نطاق يوم 3 = غلاف المتجر + الهوم + SEO (§2.1).
  - **M-2:** ✅ ALREADY APPROVED & IMPLEMENTED (S4, Day 2.5) — `--color-on-accent`/`Badge accent`. Visual QA متبقٍ للمالك (قرفة).
  - **M-3:** ✅ ALREADY APPROVED & IMPLEMENTED (S8, Day 2.5) + تعديل مالك لاحق — `BackToTop` بحلقة/تقدم ماء. Visual QA متبقٍ.
  - **M-4:** ✅ APPROVED — دمج `DesignEffects` → `components/Animation/ScrollEffects.tsx` واستخدامه في `/design` والمتجر (S5).
  - **M-5:** ✅ APPROVED — Featured: يختفي لو فاضي، ErrorState لو فشل.
  - **M-6:** ✅ APPROVED — البانرات بدون autoplay/dots (أسهم فقط).
  - **M-7:** ✅ APPROVED — الهيرو بدون صورة منتج/لوجو (تايبوجرافي + زخرفة tokens).
  - **M-8:** ✅ APPROVED WITH MODIFICATION — **تطبيع أرقام الواتساب المصرية المحلية الصالحة إلى صيغة دولية E.164 (`+20`) عندما تكون الدولة معروفة؛ عدم إخفاء رقم مصري محلي صالح لمجرد غياب بادئة الدولة؛ الإخفاء فقط للأرقام غير الصالحة/غير المدعومة.** مثال المالك الموفّر: `01033563649` (رقم محلي صالح ⇒ يُطبَّع ويُعرض الزر، وليس إخفاؤه). *هذا يعدّل افتراض Gate 0 السابق القائل بإخفاء المحلي `010…`.*
  - **M-9:** ✅ APPROVED — Western digits (`45`).
- **أوامر نظيفة (clean rerun, تحقق 2026-11-18):**
  - `npm run lint` → **EXIT 0** (أخضر).
  - `npm run check` → **EXIT 0** (`Scanned 74 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).`).
  - `npm run build` → **EXIT 1** (`TurbopackInternalError` على `app/globals.css` `[app-client]` / postcss-webpack-loader chain: `node process exited before we could connect to it with exit code: 0xc0000142`، **لا `BUILD_ID`**). يُعامل كتعطّل بيئة/Windows spawn عابر في هذا التشغيل (lint/check أخضر) — Gate 0 الآلي غير مكتمل تحققًا حتى ينجح build في تشغيل نظيف.
  - `git diff --stat -- package.json package-lock.json` → فارغ (لا تبعيات جديدة).
- **فحص الباك الحي (2026-11-18، `http://localhost:3002/api`, `Origin: http://localhost:3001`; الباك شغال — محاولة `npm run dev` منفصلة أعادت `EADDRINUSE :::3002`):**

| الطلب | status | CORS (من الرد) | envelope/أهم الحقول |
| --- | ---: | --- | --- |
| `GET /store/settings` | 200 | `Access-Control-Allow-Origin: http://localhost:3001`, `Access-Control-Allow-Credentials: true` | `{"success":true,"message":"Settings fetched successfully","data":{"currency":"EGP","taxRate":null,"freeShippingThreshold":null,"contact":{"whatsapp":null,"phone":null,"email":null,"workingHours":null,"address":null},"social":{"facebook":null,"instagram":null,"tiktok":null,"youtube":null}}}` |
| `GET /store/categories` | 200 | (نفس الأصل مسموح) | `success:true`, `message:"Categories fetched successfully"`, `data`: 3 (`spices`,`herbs`,`gift-bundles`) مع subcategories/counts، `imageUrl:null`، كل `sortOrder:0` |
| `GET /store/banners` | 200 | (نفس الأصل مسموح) | `success:true`, `message:"Banners fetched successfully"`, `data`: بانر واحد (picsum، `linkUrl:"/ar?category=herbs"`, `mobileImageUrl:null`) |
| `GET /store/products?featured=true&limit=2` | 400 | — | `{"success":false,"message":"Database constraint violation","code":"DB_CONSTRAINT_ERROR"}` |
| `GET /store/products?page=1&limit=1` | 400 | — | `{"success":false,"message":"Database constraint violation","code":"DB_CONSTRAINT_ERROR"}` |
| `GET /store/products/does-not-exist` | 404 | — | `{"success":false,"message":"Product not found","code":"PRODUCT_NOT_FOUND"}` |
| `GET /store/search?q=test` | 200 | — | `{"success":true,"message":"Search completed","data":{"results":[],"suggestions":[],"searchLogId":"cmwmggris0001hkuyfywjf8gg"}}` |
| `GET /store/search?q=cumin` | 400 | — | `{"success":false,"message":"Database constraint violation","code":"DB_CONSTRAINT_ERROR"}` |

- **المخاطر/التعارضات المؤكدة:** **B-1 مستمر** (قائمة المنتجات/تفاصيلها ومسارات البحث ذات النتائج تعطي 400 `DB_CONSTRAINT_ERROR` حيًا)؛ فجوات seed (`contact/social` null، `imageUrl:null`/`sortOrder` ties للأقسام، بانر picsum). M-8 يتطلب تطبيع محلي مصري (مثل `01033563649` → `+20...`) عند التنفيذ (مخالف لتوصية الإخفاء السابقة في §1/سؤال 8). H7 وF1 (`isEnvelopeFailure` في `baseApi`) ما زالت معلقة لـ Gate 1. تعذّر تحقق `build` في التشغيل النظيف الحالي (0xc0000142).
- **حكم Gate 0:** **غير مكتمل تحققًا آليًا بالكامل** في هذا التشغيل النظيف بسبب فشل `npm run build` (بيئة/عابر) مع استمرار B-1 وفجوات بيانات خارجية؛ لكن `lint/check` أخضر، سلامة PROGRESS مؤكدة، تغطية §4 موثقة، وقرارات M-1..M-9 (بتعديل M-8) مُسجّلة، وفحص الباك الحي مُوثّق دون افتراضات.
- ⛔ **STOP — Gate 0 — بانتظار تفويض المدير الصريح لبدء Gate 1.** (بعد معالجة/تأكيد تعذّر build إن لزم، مع مراعاة B-1 وM-8 المعدّل عند التنفيذ.)

### 8) Day 3 — Gate 1 (H1–H7 verify + F1–F4) — 2026-11-18 (تفويض المدير مُسجّل)

- **قرار/تفويض:** المدير فوّض صراحةً بدء Gate 1 (Frontend فقط، Backend read-only، بدون mocks/workarounds لـ B-1، بدون تبعيات جديدة، تحديث PROGRESS بعد كل مهمة، عدم ادعاء نجاح build بدون تشغيل ناجح فعلي).

| المهمة | الحالة | الملفات | ملاحظات/تحقق |
| --- | --- | --- | --- |
| H1 | ✅ Verified (Day 2.5) — لا إعادة تنفيذ | `components/Animation/CountUp.tsx`, `lib/price.ts` | SSR يطبع القيمة النهائية `value.toFixed(decimals)+suffix`؛ count-up فقط إذا تحت الـ fold وقت mount + inView + بلا reduced-motion + مرة؛ `calculateSavingsPercent` يرجع `null` إذا التقريب <1%. تحقق CLI: `[null,25,null,null]`. |
| H2 | ✅ Verified (Day 2.5) — لا إعادة تنفيذ | `components/shared/JsonLd.tsx`, `.env.example`, `lib/config.ts` | `JSON.stringify(...).replace(/</g,"\\u003c")` (`grep` سطر 8)، `.env.example` فيه `/api` + `SITE_URL` + `# API_INTERNAL_URL`, `config` يرمي لو `SITE_URL` فاضي. |
| H3 | ✅ Verified (Day 2.5, M-2) — لا إعادة تنفيذ | `styles/tokens.css`, `styles/themes.css`, `components/ui/Badge.tsx` | `--color-on-accent` لكل الثيمات و`Badge accent` يستخدم `text-on-accent`؛ لا `bg-accent text-ink` في TSX/TS. |
| H4 | ✅ Verified (Day 2.5) — لا إعادة تنفيذ | `components/ui/Button.tsx`, `hooks/useFlyToCart.ts` | `type="button"` افتراضي، `disabled||isLoading`, `aria-busy`, label محفوظ بصريًا/لـa11y وقت التحميل؛ fly target = أول مرئي (`getClientRects().length>0`)، clone `aria-hidden`+`inert`+ids محذوفة، `.finished.then(done, cleanup)`. |
| H5 | ✅ Verified (Day 2.5, M-3) — لا إعادة تنفيذ (مكون بصري قائم) | `components/Animation/ScrollProgressRing.tsx`, `components/Animation/BackToTop.tsx` | حلقة تقدم + تعبئة ماء مربوطة بـ `scrollYProgress`, ألوان tokens، reduced-motion ⇒ `scrollTo` `auto`, زر ثابت/يظهر أسفل أول شاشة (سلوك مالك بعد S8). `ScrollProgressRing` كان موجوداً (untracked) ومتسق — لم يُعاد تنفيذه. 🟡 مراجعة بصرية للمالك. |
| H6 | ✅ Verified (Day 2.5) — لا إعادة تنفيذ | `lib/seo.ts` | `alternates.languages` تتضمن `ar,en,ar-EG,x-default`؛ `og:locale` `ar_EG/en_US` + `alternateLocale`؛ signature/canonical كما هي. |
| H7 | ✅ Implemented | `lib/theme.ts`, `components/shared/GlowCard.tsx`, `components/Animation/Marquee.tsx` | حُذف `readThemeCookie` (لا مستهلكين مصدر؛ ظهر فقط في `.next` قديم). `GlowCard`: named export = `memo(GlowCardBase)` بدون default (المستهلك الوحيد `components/design/MotionRow.tsx` يستخدم named). `Marquee`: النسخة المكررة `aria-hidden` أُضيف لها `inert`. |
| F1 | ✅ Implemented | `lib/envelope.ts`, `store/baseApi.ts`, `interface/store.ts`, `interface/index.ts` | `isEnvelopeFailure` نُقلت إلى `lib/envelope.ts` (تعريف مصدر واحد؛ تحقق `grep`) + `isEnvelopeSuccess` (object, `success===true`, `message` string, يحتوي `data`). `baseApi` يستورد من `lib/envelope`. عقود `IStoreSubcategoryNode`/`IStoreCategoryNode`/`IStoreBanner` أُضيفت حرفياً من باك (`categories/service.ts`, `content/service.ts`) وصُدّرت من barrel. |
| F2 | ✅ Implemented | `lib/server/storeFetch.ts`, `lib/server/storeQueries.ts`, `lib/server/currentYear.ts` | server-only fetch (`API_INTERNAL_URL || API_BASE_URL`, timeout 8000ms، لا cache/next options)، يرجع `TStoreResult` ولا يرمي؛ أخطاء: `TIMEOUT`/`NETWORK_ERROR`(0)/`INVALID_RESPONSE`/`REQUEST_FAILED` أو `body.code`؛ `console.error("[store]",{path,status,code})` عند الفشل. Queries: `"use cache"` + `cacheTag` + `cacheLife(result.ok?"minutes":"seconds")` مرة واحدة لكل استدعاء لـ settings/categories/banners/featured-products؛ `getCurrentYear` بـ `cacheLife("days")`. ملاحظة: `import "server-only"` حُلّ أثناء build (موجود في Next compiled)، لكنه **غير قابل للحل عبر Node runtime bare** (`require.resolve('server-only')` يفشل خارج bundler) — يحتاج تأكيد عبر build ناجح. |
| F3 | ✅ Implemented | `lib/imageLoader.ts`, `next.config.ts`, `components/shared/StoreImage.tsx` | loader client-only بدون imports: يحقن `c_limit,w_<width>,f_auto,q_auto` فقط لمسارات `res.cloudinary.com/.../image/upload/v\d+/...` (مع تحقق regex لعدم وجود transform مسبق) ويترك غيرها. `next.config`: `images:{loader:"custom",loaderFile:"./lib/imageLoader.ts"}` مع الحفاظ على الإعدادات. `StoreImage`: `next/image` fill + `sizes` + optional `preload`، fallback `ImageOff` على `src` null/`onError` (state داخل handler). تحقق loader: `[cloudinary+transform,picsum-as-is,relative-as-is,pretransformed-as-is]` مطابق. |
| F4 | ✅ Implemented (مع تعديل M-8) | `lib/localized.ts`, `lib/links.ts`, `lib/whatsapp.ts`, `lib/jsonld.ts`, `lib/routes.ts` | `pickLocalized`/`resolveBannerLink`/`toSafeExternalUrl` مطابقان للجداول بعد تصحيح path-only لـ locale (`/ar?x`→`/?x`). **M-8 مطبّق:** `normalizeWhatsAppNumber` يطبّع محلي مصري صالح `01[0125]xxxxxxxx` إلى `20xxxxxxxxxx` (E.164 digits بدون `+`) ولا يخفيه؛ أمثلة: `01001234567→201001234567`, `01033563649→201033563649`, `0020…/+20…` مقبولة، غير الصالح `null`. `jsonld`: Organization/WebSite بدون logo/address/SearchAction؛ `sameAs`/`contactPoint` تُحذف لو فارغة. |

- **فحوصات pure/CLI:** `calculateSavingsPercent` `[null,25,null,null]`؛ image loader 4/4 مطابق؛ whatsapp `[201001234567,201001234567,201001234567,201033563649,null,null]` (يتضمن مثال المالك)؛ links/localized مطابقان للجداول المتوقعة. `grep 'u003c' components/shared/JsonLd.tsx` ✅. `grep -rn isEnvelopeFailure` ⇒ تعريف مصدر واحد `lib/envelope.ts` + استخدامات `store/baseApi.ts`,`lib/server/storeFetch.ts`.
- **أوامر مطلوبة (2026-11-18):** `npm run lint` → **EXIT 0**. `npm run check` → **EXIT 0** (`Scanned 85 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).`). `npm run build` → **EXIT 1** (نفس تعطل البيئة الموثق): `TurbopackInternalError` على `app/globals.css` `[app-client]` / CSS/postcss/webpack-loader chain، `creating new process` → `node process exited before we could connect to it with exit code: 0xc0000142`، **لا `BUILD_ID`**. لم يُدّعَ نجاح build.
- **تغييرات ملفات (ضمن `Om-Eman/frontend/`، frontend فقط):** معدّل: `components/Animation/Marquee.tsx` (inert للنسخة المكررة)، `components/shared/GlowCard.tsx` (memo(named) بدون default)، `lib/theme.ts` (حذف `readThemeCookie`)، `store/baseApi.ts` (استيراد envelope مشترك)، `interface/store.ts`+`interface/index.ts` (عقود store nodes/banner)، `next.config.ts` (custom image loader)، `lib/links.ts` (تصحيح تطبيع مسار locale-only `/?...`)، `docs/PROGRESS.md` (سجل). جديد: `lib/envelope.ts`, `lib/server/{storeFetch,storeQueries,currentYear}.ts`, `lib/{imageLoader,localized,links,whatsapp,jsonld,routes}.ts`, `components/shared/StoreImage.tsx`. *ملاحظة:* `components/Animation/ScrollProgressRing.tsx` موجود **غير متتبّع** من H5/S8 (Day 2.5) ولم يُنشأ/يُعدّل في Gate 1. `docs/DAY3_TASKS.md` يظهر معدّلاً في git (علامات Day 2.5 الموجودة مسبقاً) — لا تغيير وظيفي ضمن نطاق Gate 1.
- **git diff / سلامة:** `git diff --stat -- package.json package-lock.json` فارغ (لا تبعيات). `git diff --name-only -- .` = 17 ملف frontend معدل؛ untracked frontend = `components/Animation/ScrollProgressRing.tsx`, `components/shared/StoreImage.tsx`, `lib/envelope.ts`, `lib/imageLoader.ts`, `lib/jsonld.ts`, `lib/links.ts`, `lib/localized.ts`, `lib/routes.ts`, `lib/server/`, `lib/whatsapp.ts`. repo-wide `git diff --stat` يعرض أيضاً حذف ملفات `Day7-caching/.agents/...` (خارج `Om-Eman/frontend/`) — **غير مُستحدثة بواسطة Gate 1**.
- **مخاطر/محجوبات غير محلولة:** B-1 حي (`/store/products` featured/list و`search?q=cumin` ⇒ 400 `DB_CONSTRAINT_ERROR`) — F2 سيرجع `ok:false` ولن يُخبّأ الفشل (`cacheLife("seconds")`)؛ Gate 5 مشروط بإصلاح الباك. فشل `npm run build` البيئي (0xc0000142) يمنع التحقق النهائي من `"use cache"`/`server-only` bundling/SSR HTML في هذا التشغيل. مكونات Gate 2+ (layout/store shell/messages/home/UI الاستهلاكية) غير منفذة. تغييرات/إضافات بصرية ونسخ مستقبلية تبقى 🟡.

- ⛔ **STOP — Gate 1 — بانتظار مراجعة المدير.** (لا بدء لـ Gate 2.)

### 9) Day 3 — Gate 2 (S1–S6 store shell/home foundation) — 2026-11-18 (تفويض المدير، frontend فقط)

- **نطاق التنفيذ:** S1–S6 فقط (غلاف المتجر + أساس الهوم المؤقت + دمج ScrollEffects + JSON-LD). بدون Gate 3، بدون تبعيات جديدة، بدون mocks/fabricated API data، بدون تعديلات backend/DB/schema/migrations، بدون commit/deploy.
- **تنفيذ/تحقق المهام:**

| المهمة | الحالة | الملفات (إنشاء/تعديل/حذف) | تحقق/ملاحظات |
| --- | --- | --- | --- |
| S1 | ✅/🟡 كود + lint/check (HTML حي غير متحقق بسبب فشل build) | `messages/ar.json`, `messages/en.json` (namespaces: `brand,a11y,header,locale,theme,whatsapp,footer,home.*`, `product.priceFrom`, `design.productCard*` — 103 keys/locale متطابقة)؛ جديد: `components/ECommerce/SkipLink.tsx` (async, `a11y.skipToContent`), `components/Skelton/FooterSkeleton.tsx`؛ جديد: `app/[locale]/(Store)/layout.tsx`, `app/[locale]/(Store)/page.tsx` (مؤقت: `setRequestLocale` + h1 من `home.hero.title`)؛ حذف: `app/[locale]/page.tsx` | Route group `(Store)` لا يغيّر URLs العامة (`/ar`,`/en` عبر `app/[locale]/(Store)/page.tsx`)؛ `/ar/design` خارج `(Store)` ولا يستورد Header؛ layout بلا fetch، Fragment: SkipLink → `StoreHeader` → `<main id="main-content" tabIndex={-1}>` → Suspense Footer/WhatsAppFab/StoreJsonLd → `ScrollEffects`؛ الصفحة بلا `<main>` ثانٍ؛ `main-content` ×1 في الكود. |
| S2 | ✅/🟡 كود + lint/check (تفاعلي/بصري 🟡 للمالك) | جديد: `components/ECommerce/Header/{StoreHeader,HeaderBrand,CartLink,LocaleSwitcher}.tsx`؛ تعديل: `components/shared/ThemeSwitcher.tsx`, `components/design/ThemeRow.tsx` | Header sticky `z-40` + `h-16 max-w-6xl`; Brand `Link href="/"` + `Leaf` + `brand.name` (ليس h1)؛ CartLink `aria-label=header.cart`, 40×40، `CartBounce` واحد ⇒ `data-cart-target` واحد في DOM (مصدره `CartBounce`) يوجّه `useFlyToCart` لأول مرئي؛ LocaleSwitcher client (`useLocale/usePathname` من `@/i18n/navigation`) يحافظ المسار `href={pathname}` مع `locale/hrefLang/lang` و`aria-label` من `locale.switchTo` (query غير محفوظ — مقبول/مسجّل)؛ ThemeSwitcher: `aria-expanded/haspopup/controls`, Esc يغلق ويعيد focus للزر، خيارات `aria-pressed`, labels من namespace `theme` افتراضياً، `labelNamespace="design"` + أسماء الثيمات من `theme` في `ThemeRow`، الشكل/الحركة دون تغيير مقصود. |
| S3 | ✅/🟡 كود + lint/check (بصري/حي 🟡) | جديد: `components/ECommerce/Footer/{StoreFooter,FooterContact,FooterSocial}.tsx`, `components/Skelton/FooterSkeleton.tsx` | `StoreFooter` async server: `Promise.all(getStoreSettings(), getCurrentYear(), getTranslations("brand"), getTranslations("footer"))` — بيانات حقيقية عبر طبقة السيرفر المعتمدة (`"use cache"`/tags/`cacheLife` في `storeQueries`)؛ لا بيانات أعمال hardcoded/fake. فشل/غياب settings ⇒ أساسيات فقط (براند+tagline+حقوق) بلا رسالة خطأ؛ أعمدة Contact/Social تُعرض فقط عند وجود عناصر صالحة (A-8، بلا عناوين لأعمدة فارغة). تحقق عناصر: هاتف `tel:` digits/+ بعد تنظيف، إيميل `mailto:`, واتساب عبر `normalizeWhatsAppNumber` + `buildWhatsAppUrl`, عنوان/ساعات نص، سوشال `toSafeExternalUrl` + `target="_blank" rel="noopener noreferrer"` + `ExternalLink` + `sr-only` `a11y.opensInNewTab`; لا `new Date()` مباشر في مكوّن. Seed حي (contact/social null) ⇒ متوقع HTML بدون `tel:`/`mailto:`/`wa.me` (تحقق كود/منطق؛ build فشل منع curl فعلي). |
| S4 | ✅/🟡 كود + lint/check (بصري 🟡) | جديد: `components/ECommerce/WhatsAppFab.tsx` | async server + `getStoreSettings()` + `normalizeWhatsAppNumber(contact.whatsapp)`؛ `null` ⇒ `return null`؛ صالح ⇒ `PulseRing(bg-whatsapp)` ثابت `bottom-6 start-6 z-50`، رابط `wa.me/{digits}` + optional prefill، `aria-label=whatsapp.label`, `rel` صحيح، عكس `BackToTop` (end). M-8: تطبيع محلي مصري صالح `01[0125]xxxxxxxx`→`20…` وعدم إخفائه (تحقق Gate 1/lib). Seed حي ⇒ متوقع غياب الزر. |
| S5 | ✅ كود + lint/check | جديد: `components/Animation/ScrollEffects.tsx`؛ تعديل: `app/[locale]/design/page.tsx` (≤30 سطر، استبدال `DesignEffects`→`ScrollEffects`)؛ حذف: `components/design/DesignEffects.tsx` | دمج مطابق للسلوك السابق (ProgressBar + BackToTop)؛ تركيبه في `(Store)/layout.tsx` و`/design` فقط؛ `/design` خارج `(Store)` فلا تكرار في نفس الشجرة؛ `grep "DesignEffects"` = 0؛ لا listeners/مكونات مكررة جديدة (كل مكوّن يركّب hooks خاصة به مرة لكل mount). |
| S6 | ✅/🟡 كود + lint/check (HTML حي غير متحقق بسبب فشل build) | جديد: `components/ECommerce/StoreJsonLd.tsx` | `getLocale()` + `getTranslations("brand")` + `getStoreSettings()` ⇒ `<JsonLd Organization>` + `<JsonLd WebSite>`؛ `siteUrl=SITE_URL`، URLs `${SITE_URL}/${locale}` (locale-aware)؛ WebSite دائماً مع `inLanguage`; Organization بلا `logo/address/SearchAction`، و`sameAs/contactPoint` فقط عند بيانات صالحة؛ فشل/null settings ⇒ Organization أساسي + WebSite (منطق builders). `JsonLd` يهرب `<` بـ `\u003c`. تحقق مخرجات حي (×2 scripts parseable) مؤجل لنجاح build/start. |

- **فحوصات تكامل/سلوك (كود/استاتيكي):** `app/[locale]/page.tsx` محذوف، `(Store)/page.tsx` و`(Store)/layout.tsx` موجودان؛ `id="main-content"` مرة واحدة؛ `data-cart-target` مصدر واحد (`CartBounce`) مستخدم في `CartLink` فقط؛ `DesignEffects` محذوف بلا مستهلكين؛ `/design` ما زال 30 سطرًا ويستخدم `ScrollEffects`؛ Theme/Locale switchers داخل Header المتجر؛ لا mocks/fake data ولا تبعيات.
- **مشكلة/إصلاح ضمن نطاق Gate 2:** `StoreFooter` كان يمرّر أعمدة Contact/Social حتى لو بلا عناصر صالحة؛ عُدّل لحساب `hasContact/hasSocial` (تنظيف هاتف/`normalizeWhatsAppNumber`/`toSafeExternalUrl`) وعدم عرض العمود/عنوانه عند الفراغ (A-8). أُعيد `lint/check` بعد الإصلاح (أخضر).
- **أوامر التحقق (2026-11-18):**
  - `npm run lint` → **EXIT 0**.
  - `npm run check` → **EXIT 0** (`Scanned 97 code files, 103 message keys per locale. 0 failure(s), 0 warning(s).`).
  - `npm run build` → **EXIT 1** (نفس تعطل البيئة/Windows الموثق سابقاً): `TurbopackInternalError` على `[project]/app/globals.css.css [app-client] (css)` / CSS-postcss-webpack-loader chain، `creating new process` → `node process exited before we could connect to it with exit code: 0xc0000142`، **لا `BUILD_ID`**. لم يُدّعَ نجاح build؛ تحقق HTML حي (`/ar`,`/en`, skip/header/footer/jsonld/count/links) غير ممكن في هذا التشغيل.
- **تغييرات الملفات (frontend، Gate 2 هذه الجلسة):** تعديل: `app/[locale]/design/page.tsx`, `components/design/ThemeRow.tsx`, `components/shared/ThemeSwitcher.tsx`, `messages/ar.json`, `messages/en.json`, `docs/PROGRESS.md`. إنشاء: `app/[locale]/(Store)/layout.tsx`, `app/[locale]/(Store)/page.tsx`, `components/ECommerce/SkipLink.tsx`, `components/ECommerce/Header/{StoreHeader,HeaderBrand,CartLink,LocaleSwitcher}.tsx`, `components/ECommerce/Footer/{StoreFooter,FooterContact,FooterSocial}.tsx`, `components/ECommerce/WhatsAppFab.tsx`, `components/ECommerce/StoreJsonLd.tsx`, `components/Skelton/FooterSkeleton.tsx`, `components/Animation/ScrollEffects.tsx`. حذف: `app/[locale]/page.tsx`, `components/design/DesignEffects.tsx`.
- **حالة git (frontend) — مُلاحظة:** working tree يحتوي أيضاً تعديلات/ملفات غير متتبعة من Gate 1/Day 2.5 وقرارات سابقة (H/F, `docs/DAY3_TASKS.md`, `ScrollProgressRing.tsx`, `StoreImage.tsx`, libs/server/envelope/imageLoader/jsonld/links/localized/routes/whatsapp، إلخ)؛ Gate 2 اعتمد عليها ولم يُعد كتابتها. تم التمييز أعلاه لتغييرات S1–S6 الفعلية.
- **Backend/DB:** `git diff --name-only -- backend` ⇒ `Om-Eman/backend/src/modules/store/products/list.ts` فقط (إصلاح محلي معتمد سابقاً، غير معدل في Gate 2). **لا تعديلات schema/migration/DB** ولا ملفات backend أخرى في Gate 2.
- **محجوبات/ملاحظات:** فشل build البيئي (0xc0000142) يمنع تأكيد HTML/SEO حي؛ `/ar`/`/en` حالياً صفحة shell مؤقتة (h1 hero title) حتى HM6 (Gate 3)؛ `home.title/body` القديمان استُبدلا بنصوص Gate 2 Appendix A؛ مكونات/بيانات Gate 3 (Hero/Trust/Banners/Categories/Featured) وKS-1..3 وB-1 باقية كما هي. 🟡 بصري/تفاعلي للمالك (Header/Footer/FAB/Effects).

- ⛔ **STOP — Gate 2 — بانتظار مراجعة/اعتماد المدير.** (لا بدء لـ Gate 3.)


### 10) Day 3 — Gate 3 (HM1–HM6 + manager additions + follow-up) — 2026-11-18 (تفويض المدير، frontend فقط)

- **نطاق التنفيذ:** Gate 3 `HM1–HM6` + إضافات المدير السابقة (logo/header+footer، branded jar loading، LocaleSwitcher UI) + **متابعة Gate 3:** favicon/browser branding، نظام السوشيال والتواصل المركزي، وتعديل ظهور `BackToTop`. Frontend فقط، بدون تبعيات جديدة، بدون mocks/fabricated API data، بدون تعديلات backend/DB/schema/migrations/deploy، بدون Gate 4، بدون commit/deploy. Gate 2 سليم. الاعتماد البصري 🟡 للمالك.

| المهمة | الحالة | الملفات (إنشاء/تعديل) | تحقق/ملاحظات |
| --- | --- | --- | --- |
| HM1 Hero | ✅ كود + lint/check، 🟡 بصري (HTML حي غير متحقق: build فشل) | `components/ECommerce/Home/Hero.tsx`, `styles/animations.css` | `h1#hero-title` (`home.hero.title`)، CSS `animate-fade-up` فوق الـ fold (بدون `opacity:0` inline)، CTA `#categories`، زخرفة tokens فقط، `min-h-[70dvh]`، smooth-scroll مع `prefers-reduced-motion`. |
| HM2 HomeTrust | ✅ كود + lint/check، 🟡 بصري | `components/ECommerce/Home/HomeTrust.tsx`, `lib/siteContact.ts` | حقائق حقيقية فقط: COD دائمًا؛ شحن مجاني عند `freeShippingThreshold != null`؛ واتساب فقط عند `WHATSAPP_CONTACT` مُهيأ صراحةً في `lib/siteContact.ts` ويطبّع (M-8). فشل settings ⇒ COD فقط (وواتساب إن مُهيأ صراحةً). لا بيانات مختلقة. |
| HM3 Banners | ✅ كود + lint/check، 🟡 بصري/RTL يدوي | `components/ECommerce/Home/{BannerSection,BannerSlider}.tsx`, `components/Skelton/BannerSkeleton.tsx` | fail/empty ⇒ `null`، success ⇒ `FadeIn` + snap carousel بدون autoplay/dots، أسهم عند >1 مع RTL-aware scroll وreduced-motion، روابط آمنة، صور desktop/mobile، caption أسفل الصورة. |
| HM4 Categories | ✅ كود + lint/check، 🟡 بصري | `components/ECommerce/Home/CategoriesSection.tsx`, `components/Card/CategoryCard.tsx`, `components/Skelton/CategoriesSkeleton.tsx` | `#categories` + heading، ترتيب API، fail ⇒ `ErrorState`، empty ⇒ `EmptyState`، success ⇒ `Stagger` grid + accents، KS-1 `categoryHref`، `StoreImage`/fallback موحّد، localized + ICU count. |
| HM5 Featured + ProductCard | ✅ كود + lint/check، ⛔ data حي (B-1/backend غير منشور) + 🟡 شكل | `components/ECommerce/Home/{FeaturedSection,FeaturedGrid}.tsx`, `components/Card/ProductCard.tsx`, `components/Skelton/FeaturedSkeleton.tsx` | fail ⇒ `ErrorState` (**متوقع حاليًا بسبب B-1/400**)؛ empty ⇒ `null` (M-5)؛ success ⇒ heading + rotating beam. `ProductCard`: localized، `PriceTag`/`priceFrom`، badges مترجمة، KS-2 stretched link، لا cart/countdown. |
| HM6 Page composition | ✅ كود + lint/check، 🟡 بصري (HTML حي غير متحقق: build فشل) | `components/ECommerce/Home/HomeSections.tsx`, `app/[locale]/(Store)/page.tsx` | `setRequestLocale` + `<HomeSections />`؛ Hero → Suspense(HomeTrust/Banner/Categories/Featured) مع skeletons؛ metadata موروثة؛ h1 واحد. |
| HM-L Logo/Header+Footer | ✅ كود + lint/check، 🟡 بصري | `components/ECommerce/Header/HeaderBrand.tsx`, `components/ECommerce/Header/StoreHeader.tsx`, `components/ECommerce/Footer/StoreFooter.tsx`, `public/logo.png` | استخدام `public/logo.png` (1254×1254) كما هو (`next/image`, `object-contain`, بدون تشويه/إعادة رسم). Header: mark `size-8` + اسم “أم إيمان”. Footer: mark `size-16` مدمج مع tagline/contact/social/copyright، متوازن responsive/4 themes/RTL-LTR. |
| HM-BL Branded loading | ✅ كود + lint/check، 🟡 بصري/حركة | `components/shared/BrandLoader.tsx`, `app/[locale]/(Store)/loading.tsx`, `styles/animations.css`, `messages/{ar,en}.json` (`common.loading`) | برطمان شفاف + تسمية “أم إيمان” + تعبئة أعشاب/توابل (CSS)، `role="status"`/`aria-live`/`aria-busy`، reduced-motion مدعوم، مدمج في `(Store)/loading.tsx`، قابل لإعادة الاستخدام، بدون تبعيات. |
| HM-LS LocaleSwitcher UI | ✅ كود + lint/check، 🟡 بصري/تفاعلي | `components/ECommerce/Header/LocaleSwitcher.tsx`, `components/ECommerce/Header/StoreHeader.tsx`, `messages/{ar,en}.json` | Globe + `AR/EN` + chevron، dropdown `menu/menuitemradio` مع check، يحافظ pathname+query params (`useSearchParams` + `@/i18n/navigation`)، RTL/LTR، keyboard/Escape/outside-close، focus/ARIA، tokens/4 themes، `Suspense` في Header. |
| HM-FB Favicon & browser branding (follow-up) | ✅ تكامل/metadata مُجهّز + lint/check، 🟡 بصري/تعرف — **محدودية أصل موثقة** | `app/icon.png`, `app/apple-icon.png`, `app/manifest.ts`, `public/{favicon-16x16.png,favicon-32x32.png,icon-192.png,icon-512.png}`, `app/[locale]/layout.tsx`, `scripts/check-rules.mjs`؛ حذف `app/favicon.ico` | أُزيلت أيقونة Next الافتراضية وأُنشئت أصول من `public/logo.png` الرسمي (قص مركزي مُركّز على البرطمان/العلامة + تحجيم عالي الجودة، **بدون إعادة رسم/اختراع/تشويه**). App Router: `app/icon.png`, `app/apple-icon.png`, `app/manifest.ts` (`/manifest.webmanifest`) + metadata `icons`, `applicationName` و`appleWebApp.title` باسم “أم إيمان”؛ عناوين الصفحات تتضمن براند Om Eman. **محدودية:** الأصل الموفّر شعار كامل ولا يحتوي رمز jar منفصل واضح مخصص؛ عند 16×16/32×32 قد يقل التعرف مقارنة بأصل jar-only مستقل — التكامل مُجهّز ويمكن استبدال الأصول لاحقًا بملف jar-only مخصص عند توفره (لم يُخترع/يُعاد تصميم رمز). تحقق التبويب/الإشارات المرجعية/أيقونة الجوال متعذر آليًا/حيًا (build فشل) ⇒ 🟡. |
| HM-SC Social & contact system + Footer (follow-up) | ✅ كود + lint/check، 🟡 بصري | `lib/siteContact.ts`, `components/shared/SocialIcon.tsx`, `components/ECommerce/Footer/{FooterSocial,FooterContact,StoreFooter}.tsx`, `components/ECommerce/Home/HomeTrust.tsx`, `components/ECommerce/WhatsAppFab.tsx`, `messages/{ar,en}.json` | **سوشيال مركزي (`SOCIAL_LINKS`)** لمنصات: instagram, facebook, tiktok, youtube, x, snapchat, pinterest, threads, linkedin, telegram (قابل للتوسعة). يُعرض فقط ما له URL صالح (لا أيقونة/رابط/مساحة/placeholder)، أيقونات SVG خفيفة مميزة مضمّنة (بدون deps) بحجم/محاذاة/hover/focus/ARIA متسقة، روابط خارجية آمنة. Instagram مُهيأ: `https://www.instagram.com/om_eman.herbs/`؛ الباقي `null` (لا اختراع). **تواصل مركزي (`CONTACT_PHONES`)**: `01033563649` (أساسي) و`01554491132` (إضافي) كروابط `tel:` بعناوين واضحة (`footer.phonePrimary/phoneSecondary`) وعرض أنيق؛ **لا افتراض WhatsApp** لأي منهما. **واتساب صريح فقط**: `WHATSAPP_CONTACT` افتراضي `null`؛ FAB/رابط/Trust تُنشأ فقط عند تهيئته صراحةً مع تطبيع M-8 المصري. Footer يحافظ تكامل settings (email/address/hours حيثما وجدت) وتوازن الشعار/الأقسام/4 themes/RTL-LTR. |
| HM-BT BackToTop visibility (follow-up) | ✅ كود + lint/check، 🟡 بصري | `components/Animation/BackToTop.tsx` | عتبة الظهور أصبحت `scrollY > 280` ليظهر بعد نزول بسيط (بدل `> window.innerHeight`) مع الحفاظ على نفس الحلقة/التقدم/الحركة. |

- **ملاحظات تكامل/سلوك مهمة:**
  - `Hero` فوق الـ fold بـ CSS animation فقط؛ `FadeIn/Stagger` تحت الـ fold. `data-cart-target` مصدره الوحيد `CartBounce` في `CartLink`. `ScrollEffects` مدمج بدون listeners مكررة. `StoreImage`/`pickLocalized`/`resolveBannerLink` مستخدمة كما هو.
  - Backend fix (`backend/src/modules/store/products/list.ts`) **محلي/غير منشور**؛ B-1 متوقع حيًا ⇒ Featured يعرض `ErrorState` (M-5). لا تغيير backend/DB.
  - التحقق اليدوي/الحي (360px، RTL/LTR، 4 themes خصوصًا قرفة، dropdowns/Esc/tab، banner arrows RTL، jar loader/reduced-motion، favicon/tab/bookmark/mobile icon، hover/focus السوشيال، BackToTop المبكر) وHTML checks (§10.2/10.3) متعذر بسبب فشل build ⇒ 🟡.

- **توثيق الإعداد المركزي (للمالك):** `frontend/lib/siteContact.ts`
  - **سوشيال:** عدّل `SOCIAL_LINKS[platform]` إلى URL رسمي حقيقي أو `null` لإخفائه — تظهر الأيقونة تلقائيًا في Footer بدون تعديل مكوّنات. لا تُخترع روابط.
  - **أرقام التواصل:** عدّل/أضف عناصر `CONTACT_PHONES` (`display`, `labelKey`). تُعرض كروابط `tel:` فقط.
  - **واتساب:** عيّن `WHATSAPP_CONTACT` برقم فقط إذا كان رقم واتساب مُهيأ صراحةً (محلي مصري أو دولي)؛ سيُطبَّع (M-8) ويظهر FAB/رابط/Trust عندها. اتركه `null` إن لم يُهيأ (الحالة الحالية).

- **أوامر التحقق (2026-11-18):**
  - `npm run lint` → **EXIT 0**.
  - `npm run check` → **EXIT 0** (`Scanned 115 code files, 116 message keys per locale. 0 failure(s), 0 warning(s).`).
  - `npm run build` → **EXIT 1** (تعطل Turbopack/Windows الموثق): `[project]/app/globals.css.css [app-client] (css)` / `creating new process` → `node process exited before we could connect to it with exit code: 0xc0000142`، **لا `BUILD_ID`**. 
لم يُدّعَ نجاح build؛ تحقق HTML حي/SEO غير مكتمل.

- **تغييرات الملفات (frontend، تراكمي Gate 3 بما فيها المتابعة):**
  - **تعديل:** `app/[locale]/(Store)/page.tsx`, `app/[locale]/layout.tsx`, `components/Animation/BackToTop.tsx`, `components/ECommerce/Header/{HeaderBrand,StoreHeader,LocaleSwitcher}.tsx`, `components/ECommerce/Footer/{StoreFooter,FooterContact,FooterSocial}.tsx`, `components/ECommerce/Home/HomeTrust.tsx`, `components/ECommerce/WhatsAppFab.tsx`, `components/Card/ProductCard.tsx`, `messages/{ar,en}.json`, `styles/animations.css`, `scripts/check-rules.mjs` (استثناء ألوان `app/manifest.ts` فقط)، `docs/DAY3_TASKS.md`, `docs/PROGRESS.md`.
  - **إنشاء:** `app/[locale]/(Store)/loading.tsx`, `app/manifest.ts`, `app/icon.png`, `app/apple-icon.png`, `components/shared/{BrandLoader.tsx,SocialIcon.tsx}`, `components/ECommerce/Home/{Hero,HomeTrust,BannerSection,BannerSlider,CategoriesSection,FeaturedSection,FeaturedGrid,HomeSections}.tsx`, `components/Card/{CategoryCard,ProductCard}.tsx`, `components/Skelton/{BannerSkeleton,CategoriesSkeleton,FeaturedSkeleton}.tsx`, `lib/siteContact.ts`, `public/{favicon-16x16.png,favicon-32x32.png,icon-192.png,icon-512.png}`.
  - **حذف:** `app/favicon.ico`.
  - **ملاحظة git:** working tree يتضمن أيضًا تعديلات/ملفات غير متتبعة من Gates 1/2 وDay 2.5 (موثقة سابقًا)؛ لم تُرجع ولم تُعاد كتابتها خارج نطاق المطلوب.

- **سلامة/نطاق:** `git diff --name-only -- backend` ⇒ `Om-Eman/backend/src/modules/store/products/list.ts` فقط (إصلاح محلي معتمد سابقًا، غير منشور، غير معدل). **لا** تعديلات schema/migration/DB/deploy. `frontend/package.json` و`package-lock.json` بدون تغييرات. لا بيانات سوشيال/تواصل مختلقة. Gate 4 لم يبدأ. لا commit ولا deploy.

- ⛔ **STOP — GATE 3 — بانتظار مراجعة/اعتماد المدير (🟡 بصري/تفاعلي/أيقونات).** (لا بدء لـ Gate 4.)

---

### 11) Day 3 — Gate 4 (D1–D3 + refinements + asset architecture) — 2026-11-18 (تفويض المدير، frontend فقط)

- **نطاق التنفيذ:** Gate 4 حسب `docs/DAY3_TASKS.md` (D1/D2/D3) + تحسينات الشعار/الكروت المصرح بها + MANAGER ADDITION (هيكلة/نقاط تكامل الأصول البصرية). Frontend فقط، Gates 1–3 محفوظة، بدون تبعيات جديدة، بدون mocks/fabricated API data في صفحات حقيقية (fixtures `/design` المعلّمة فقط)، بدون تعديلات backend/DB/schema/migrations/deploy، بدون commit/deploy، بدون Gate 5. كل التغييرات/المخرجات البصرية 🟡 بانتظار مراجعة المالك في المتصفح.

#### مهام Gate 4 (حالة/ملفات/تحقق)

| المهمة | الحالة | الملفات | تحقق/ملاحظات |
| --- | --- | --- | --- |
| **Logo refinement** (Header jar-mark only + name؛ Footer icon-only mark إن أنظف) | ✅ كود + lint/check، 🟡 بصري | `public/assets/brand/jar-mark.png`, `lib/brandAssets.ts`, `components/ECommerce/Header/HeaderBrand.tsx`, `components/ECommerce/Footer/StoreFooter.tsx` | أُنشئ `jar-mark.png` كقص مشتق من `public/logo.png` الرسمي (بدون إعادة رسم/تشويه/اختراع؛ استبداله بأصل jar-only مخصص لاحقًا عند توفره لتحسين وضوح الأحجام الصغيرة). Header: أيقونة البرطمان فقط (`BRAND_ASSETS.jarMark`, `size-8`) بجانب “أم إيمان” (بدون شعار دائري/كامل كبير). Footer: علامة البرطمان فقط (`size-10`) فوق الـ tagline لصفاء بصري؛ اسم البراند محفوظ في سطر الحقوق (`copyright`). متوافق مع RTL/LTR و4 ثيمات (اعتماد بصري 🟡). |
| **Card refinement** (حركة أهدأ + أبعاد ثابتة/محاذاة) | ✅ كود + lint/check، 🟡 بصري | `styles/animations.css`, `components/shared/GlowCard.tsx`, `components/Card/ProductCard.tsx`, `components/Card/CategoryCard.tsx` | تقليل شدة Spotlight/BorderBeam مع الحفاظ على مفهوم الحركة: glow `14%`/hover `0.7`، beam active opacity `0.55`، hover lift أخف (`-translate-y-0.5`, مدة 300ms). تثبيت الأبعاد بدون إعادة تصميم: `h-full` للكروت، `ProductCard` بمساحات محجوزة/`line-clamp-2`/`min-h` وplaceholder لسطر الفئة و`priceFrom`، `CategoryCard` بعنوان سطر واحد ووصف `line-clamp-2` بحد أدنى ثابت؛ محاذاة أسعار/شارات/عناوين preserved، شبكات 2/3/4 أعمدة كما هي، 4 ثيمات وRTL/LTR سليمة منطقيًا (🟡). |
| **D1 — `/design` ProductCard demo (fixtures معنونة، isolated)** | ✅ كود + lint/check، 🟡 بصري (HTML حي محجوب ببناء) | `components/design/demoProducts.ts`, `components/design/ProductCardRow.tsx`, `components/design/ComponentsRow.tsx` (`app/[locale]/design/page.tsx` ≤30 دون تغيير) | 5 حالات `IStoreProductCard` (إنجليزي فقط): عادي بسعر مشطوب (Cloudinary demo image)، متعدد العبوات (`hasMultiplePackages`)، bundle (`PREDEFINED_BUNDLE` + accent)، نفد (`inStock:false`)، بدون صورة؛ أسعار strings مختلطة الشكل (`45.0000/60.0000`, `30`, `120.0000/150.0000`, `25.0000`, `18.0000/22.0000`). صورة واحدة فقط: `https://res.cloudinary.com/demo/image/upload/v1/sample.jpg` (حساب Cloudinary التجريبي) والباقي `null`؛ beam دوّار بـ `useRotatingIndex`؛ ملاحظة demo ظاهرة من messages (`design.productCardTitle`/`productCardDemoNote`/`priceDemoNote`). **معزول** داخل `components/design` وغير مستخدم خارجها. |
| **D2 — `app/sitemap.ts`** | ✅ كود + lint/check (حي محجوب ببناء) | `app/sitemap.ts` | عنصران `/ar` و`/en` بـ `SITE_URL`، كلاهما `alternates.languages: { ar, en }`، `changeFrequency:"daily"`، `priority:1`، **بدون `lastModified`/`new Date()`** (static). لا منتجات/أقسام حتى Day 4. `robots.ts` دون تغيير (يحظر `/ar/design`,`/en/design`). |
| **D3 — توثيق + تحقق نهائي** | ✅ lint/check، ❌ build (blocker بيئي)، توثيق محدّث | `frontend/AGENTS.md`, `frontend/docs/PROGRESS.md`, `frontend/docs/DAY3_TASKS.md` | تحديث AGENTS (شجرة §3.1، §3.2 shared pieces، §3.4 قواعد بيانات السيرفر A-1..A-4/صور A-6+`StoreImage`/z-index A-9/`data-cart-target` واحد/استثناء mocks المعنون/غياب brand icons في lucide v1.73/KS-1..3/قواعد الأصول). تسجيل نتائج التحقق والانحرافات والعناصر المحمولة هنا وفي DAY3_TASKS. |
| **MANAGER ADDITION — exclusive visual asset architecture/integration** | ✅ هيكلة + نقاط تكامل جاهزة، ⛔ لا أصول مورّدة (لا اختراع مسارات/توفّر) | `public/assets/{hero,banners,categories,brand,themes,video}/`, `public/assets/README.md`, `lib/brandAssets.ts`, `components/ECommerce/Home/Hero.tsx` | أُنشئت مجلدات واضحة (`hero,banners,categories,brand,themes,video`) وتسمية وصفية موثقة. `BRAND_ASSETS` يعرّف فقط المسارات الموجودة فعليًا (`jarMark`, `fullLogo`) و`null` لـ `hero.desktop/mobile/poster` و`brandVideo.src/poster` (غير متاحة). `Hero`: يدعم صور desktop/mobile منفصلة وفيديو براند قصير اختياري (muted, loop, `playsInline`, `preload="none"`, poster fallback، إخفاء آمن مع `prefers-reduced-motion`، overlay لتباين النص) دون تفعيل تلقائي ضار/دون أصول مختلقة؛ النص واللوجو عناصر frontend حقيقية. لا تصوير منتجات placeholder كأصول نهائية. |

#### عناصر محمولة من Gate 3 (غير مكتملة/معلّقة بدقة)

| العنصر | الحالة | التفاصيل |
| --- | --- | --- |
| Hero asset integration (أصول حقيقية) | ⛔ غير متاح (جاهز للتكامل فقط) | لا hero/banner/category/theme/video assets مورّدة؛ لا مسارات/ملفات مختلقة ولا وسم “متاح”. يُدمج عند التوريد عبر `lib/brandAssets.ts`/`public/assets/*`. |
| Favicon / jar-only symbol | 🟡 مُدمج مع محدودية موثقة | أيقونات/manifest مُولدة ومربوطة من الشعار الرسمي، لكن لا رمز jar-only مخصص مستقل؛ وضوح 16×16/32×32 قد يكون محدودًا حتى توريد أصل jar-only (لا إعادة رسم/اختراع). تحقق تبويب/إشارات مرجعية/جوال محجوب ببناء ⇒ مراجعة مالك. |
| Social/Contact config | 🟡 جزئي (بدون اختراع) | Instagram مُهيأ (`https://www.instagram.com/om_eman.herbs/`)؛ باقي المنصات و`WHATSAPP_CONTACT` = `null` (صريح)؛ هواتف مركزية (`01033563649`,`01554491132`) كـ `tel:` فقط. يتطلب قيمًا حقيقية من المالك في `lib/siteContact.ts`. |
| Featured/B-1 (backend) | ⛔ pending/unpublished backend | إصلاح `backend/src/modules/store/products/list.ts` محلي غير منشور؛ مسارات featured/products/search قد تُرجع `DB_CONSTRAINT_ERROR`/`ErrorState` في بيئات غير مُصلحة (سلوك متوقع/موثّق). |
| Build/live HTML & link-health | ⛔ blocker بيئي | `npm run build` يفشل `TurbopackInternalError` `[project]/app/globals.css.css [app-client] (css)` / `0xc0000142`، **لا `BUILD_ID`**؛ تعذر `start`/curl/تحقق HTML حي (§10.2/10.3)، sitemap.xml حي، وlink-health الكامل. KS-1..3 تبقى ميتة مقبولة حتى Days 4–5. |

#### قرارات الأصول والأداء (موثّقة)

- **هيكلة:** `public/assets/{hero,banners,categories,brand,themes,video}` + `public/assets/README.md`؛ تسمية وصفية (`hero-desktop.*`,`hero-mobile.*`, `category-<slug>.*`, `banner-*`, `theme-*`, poster/video). `lib/brandAssets.ts` مصدر مركزي للمسارات الموجودة فقط.
- **صور/تحسين:** استخدام `next/image`/`StoreImage` + `sizes`/`alt` مطلوب؛ Cloudinary يمر عبر loader المخصص (`f_auto,q_auto,c_limit,w_<w>`). `preload` فقط لوسائط hero/LCP فوق الطي عند توفر أصول حقيقية؛ ما دون الطي lazy افتراضيًا. تفضيل صيغ/أبعاد مناسبة عند التوريد.
- **فيديو براند اختياري:** قصير، muted، loop، `playsInline`، `preload="none"`، poster fallback، لا تشغيل تلقائي غير ضروري/لا ضرر أداء موبايل، واحترام reduced-motion.
- **هوية/سلامة:** الحفاظ على هويات الثيمات الأربع؛ النص واللوجو الرسمي عناصر frontend (غير مخبوزة في الصور)؛ لا تصوير منتجات مزيف كأصول نهائية؛ لا اختراع مسارات/توفّر.

#### التحقق (نتائج فعلية 2026-11-18)

- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** (`Scanned 118 code files, 116 message keys per locale. 0 failure(s), 0 warning(s).`).
- `npm run build` → **EXIT 1** (تكرار موثّق): `TurbopackInternalError` `[project]/app/globals.css.css [app-client] (css)` / postcss-webpack-loader، `creating new process` → `node process exited before we could connect to it with exit code: 0xc0000142`، **لا `BUILD_ID`**. لم يُدّعَ نجاح build؛ فحوص HTML/sitemap/link-health الحية غير منفذة.
- `git diff --name-only -- backend` ⇒ `Om-Eman/backend/src/modules/store/products/list.ts` فقط (محلي/غير منشور، غير معدل). `frontend/package.json` و`package-lock.json` دون تغيير تبعيات.

#### ملفات متغيرة/جديدة ذات صلة بـ Gate 4 (هذه الدفعة)

- **تعديل:** `app/sitemap.ts`, `components/Animation/Spotlight.tsx` (لا تغيير منطقي جوهري بعد CSS)/**فعليًا** `styles/animations.css`, `components/shared/GlowCard.tsx`, `components/Card/{ProductCard,CategoryCard}.tsx`, `components/ECommerce/Header/HeaderBrand.tsx`, `components/ECommerce/Footer/StoreFooter.tsx`, `components/ECommerce/Home/Hero.tsx`, `components/design/ComponentsRow.tsx`, `AGENTS.md`, `docs/DAY3_TASKS.md`, `docs/P

---

### 12) Code-drawn SVG jar brand icon + loading + favicon — 2026-11-19 (frontend only)

> سجل وقت تنفيذ الأيقونة. للمقاس الحالي وتصحيح تقييم reduced-motion راجع §13 (D3-RM)؛ وصف التنفيذ هنا ليس نتيجة اختبار متصفح.

- **نطاق التنفيذ:** استبدال علامة البرطمان المصوّرة في الـ Navbar بمكوّن SVG مرسوم بالكود + توحيد تجربة التحميل على نفس البرطمان مع تعبئة متحركة + أيقونة SVG للموقع/الميتاداتا. بدون تغيير Footer (الشعار الرسمي الكامل محفوظ كما هو)، بدون تعديل WhatsApp/BackToTop/cart/backend/DB/migrations، بدون تبعيات جديدة، بدون تأخير تحميل مصطنع، بدون بدء Day 4، بدون commit/deploy.

| البند | الحالة | الملفات (إنشاء/تعديل) | تحقق/ملاحظات |
| --- | --- | --- | --- |
| مكوّن SVG قابل لإعادة الاستخدام | ✅ كود + lint/check | جديد: `components/Brand/OmEmanJarIcon.tsx` | SVG inline (viewBox 64×84) برسم برطمان بهارات/أعشاب (غطاء + جسم + تسمية + silhouette) مع نص عربي ظاهر “أم إيمان” على الملصق. يستخدم ألوان/tokens (`fill/stroke` من paper/surface/surface-2/ink/primary/accent). Props: `className`, `size`, `decorative`, `label`, `animated`؛ `aria-hidden/role/aria-label/<title>` حسب decorative. لا `next/image`/`<img>`/أصول صورة للأيقونة، لا قص/إعادة استخدام للشعار الرسمي الكامل. قابل للاستخدام في Navbar/Loading/Favicon (تصميم موحّد). |
| Navbar integration | ✅ كود + lint/check، 🟡 بصري | تعديل: `components/ECommerce/Header/HeaderBrand.tsx` | استبدال علامة البرطمان الحالية بمكوّن `<OmEmanJarIcon size={32} decorative className="shrink-0 text-primary" />` بجانب نص البراند “أم إيمان” (الأيقونة نفسها تحمل “أم إيمان” على الملصق). مدمجة/متناسبة مع ارتفاع الـ Navbar. Footer لم يُعدّل. تحقق بصري (عربي/إنجليزي، RTL/LTR، desktop/mobile، 4 ثيمات، وأن الـ DOM يعرض SVG وليس صورة) غير منفّذ بسبب حاجب البيئة ⇒ 🟡. |
| Loading experience | ✅ كود + lint/check، 🟡 بصري/حركة | تعديل: `components/shared/BrandLoader.tsx`, `app/[locale]/(Store)/loading.tsx` (تكامل قائم)، استخدام CSS قائم في `styles/animations.css` | `BrandLoader` يعرض نفس `OmEmanJarIcon animated` مع تسمية تحميل مقيدة (`common.loading`) داخل `role="status" aria-live="polite" aria-busy`. التعبئة (أعشاب/مادة بلون البراند) متحركة من أسفل لأعلى داخل جسم البرطمان عبر clipPath + `.jar-fill-anim` (`@keyframes jar-fill-rise`: `translateY(68%)→18%`, 3.2s infinite، `var(--ease-out)`)، مع عناصر `herb-float` خفيفة؛ الغطاء والملصق “أم إيمان” واضحان أثناء التعبئة. `prefers-reduced-motion` يعطّل `.jar-fill-anim/.herb-float` (قاعدة موجودة في `animations.css`). مدمج في تجربة تحميل المتجر الحالية `app/[locale]/(Store)/loading.tsx`؛ يعكس حالة تحميل حقيقية فقط (بدون تأخير مصطنع/بدون تبعيات). التنظيف عند انتهاء التحميل يتم بإزالة/unmount مكوّن التحميل (إيقاف الحركة تلقائيًا). تحقق بصري/حركة حي محجوب ⇒ 🟡. |
| Favicon / metadata | ✅ كود + lint/check، 🟡 بصري/تعرف | جديد: `app/icon.svg`. تعديل: `app/[locale]/layout.tsx` (metadata icons), `app/manifest.ts` | `app/icon.svg`: نسخة SVG ثابتة مبسطة بنفس لغة تصميم البرطمان (أيقونة برطمان، ليست الشعار الكامل ولا أصل صورة). الميتاداتا/الـ manifest يشيران إلى `/icon.svg` (مع fallbacks PNG/Apple القائمة)؛ `app/icon.svg` يعمل كـ App Router file icon. الشعار الرسمي الكامل في Footer محفوظ دون تغيير. لم تُزال أصول fallback PNG القائمة لتجنب كسر سياقات قديمة؛ المرجع الأساسي/المفضّل أصبح SVG. تحقق ظهور الأيقونة في التبويب/الإشارات/الجوال محجوب ⇒ 🟡. |

- **أدلة التنفيذ (ثابتة/كود):** `HeaderBrand.tsx` و`BrandLoader.tsx` يستوردان `components/Brand/OmEmanJarIcon` (لا صور للعلامة). `OmEmanJarIcon` يحوي مسارات/أشكال SVG ونص “أم إيمان” وتعبئة شرطية `animated` داخل `clipPath` بفئة `jar-fill-anim`. `styles/animations.css` يعرّف `jar-fill-rise`/`herb-float` ويعطلهما تحت `prefers-reduced-motion`. `app/[locale]/(Store)/loading.tsx` يركّب `BrandLoader`.

- **التحقق (2026-11-19):**
  - `npm run lint` → **EXIT 0**.
  - `npm run check` → **EXIT 0** (`Scanned 122 code files, 122 message keys per locale. 0 failure(s), 0 warning(s).`).
  - `npm run build` → **EXIT 1** (حاجب بيئي موثّق، غير ناجح): `TurbopackInternalError` `[project]/app/globals.css.css [app-client] (css)` / `creating new process` → `node process exited before we could connect to it with exit code: 0xc0000142` (لا `BUILD_ID`). لم يُدّعَ نجاح build.

- **حالة التحقق البصري/المتصفح:** **غير منفّذ** (لا بيئة تشغيل/متصفح مستقرة بسبب فشل build `0xc0000142`) — عرض SVG في Navbar، وضوح/توازن الأيقونة، حركة التعبئة أسفل→أعلى، سلوك RTL/LTR و4 ثيمات، وظهور favicon في المتصفح كلها 🟡 بانتظار مراجعة المالك.

- **حواجز متبقية:** حاجب Turbopack/Windows `0xc0000142` يمنع build/start والتحقق الحي؛ اعتماد بصري/حركة/أيقونة من المالك مطلوب. `lib/brandAssets.ts` ما زال يعرّف `jarMark` كأصل PNG قديم لكنه لم يعد مستخدمًا في Navbar (مرجع غير نشط).

- **سلامة/نطاق:** Footer (الشعار الرسمي `fullLogo`) دون تغيير؛ لا WhatsApp/BackToTop/cart/backend/DB/migrations؛ لا تبعيات؛ لا تأخير مصطنع؛ Day 4 لم يبدأ؛ لا commit/deploy.

---

### 13) تسليم المراجعة — حالة Day 3 الفعلية (2026-11-19)

الصفوف التالية تحدّث وصف الحالة في السجلات التاريخية، ولا تعيد فتح Gate 5 ليوم 3. المصدر يثبت التركيب؛ أوامر المراجعة السابقة تثبت نتائجها فقط، وليس قبولًا بصريًا.

| الحالة | ما نعرفه والدليل |
| --- | --- |
| منفّذ | `(Store)/layout.tsx` و`components/ECommerce/Home/HomeSections.tsx`: shell، Hero/Trust/Banners/Categories/Featured بحدود Suspense وskeletons. `lib/server/{storeFetch,storeQueries}.ts`، `StoreImage`/Cloudinary، `ProductCard`، `StoreJsonLd`، `app/sitemap.ts` للغتين، وfixtures منفصلة في `/design`. الأصول الاختيارية للهيرو ما زالت جاهزة للتكامل فقط. |
| الكود الحالي مقابل ملاحظات Gate 4 القديمة | `HeaderBrand.tsx` يستخدم `OmEmanJarIcon` بارتفاع 36/40px، مش صورة ولا مقاس 32 السابق؛ الفوتر `BRAND_ASSETS.fullLogo`؛ واتساب مُعيّن `01033563649`؛ `ScrollEffects` يركّب `ScrollTopFab`، وعتبة الزرين 10px. دي ملاحظات مصدر وليست نتيجة اختبار سكرول. `ProductCard.tsx` يستعمل `store/cartApi.ts` و`lib/cartToken.ts` للإضافة المباشرة أو رابط اختيار العبوة؛ لا توجد شاشة تفاصيل أو صفحة سلة في هذا الـbaseline. |
| ✅ آلي (مراجعة التخطيط، **قبل** تسليم المستند) | `npm run lint` نجح. `npm run check` نجح: `Scanned 122 code files, 122 message keys per locale. 0 failure(s), 0 warning(s).` |
| ⚠️ عيب TypeScript مستقل | `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` أعطى **4 × TS2769** في `lib/server/storeQueries.ts:9,17,25,33` لاختيار overload `cacheLife`. الإصلاح المحدود مصرح به داخل **G1 فقط بعد فتحها**. لم يُنفّذ. |
| ⛔ build | آخر `npm run build` موثّق (سجل §12): EXIT 1، عامل CSS في Turbopack خرج بـ`0xc0000142`، لا `BUILD_ID` في ذلك التشغيل. حاجب بيئة مسجّل، وليس دليلًا على عيب في صفحة جديدة. لم يُعَد تشغيل build في مرحلة التوثيق. |
| ⚠️ Gate 5 / الباك | تقرير المرحلة السابقة أفاد بـHTTP 200 محليًا للقائمة/featured والتفاصيل والبحث بعد إصلاح `products/list.ts`. مراجعة التخطيط: timeout ثم `ECONNREFUSED` على `:3002` بلا HTTP؛ لا نثبت عودة `DB_CONSTRAINT_ERROR` ولا نشر الإصلاح. **لا يوجد دليل شامل على V1–V5، خصوصًا ظهور Featured في HTML الهوم من production build ومصفوفة build/start.** لا إعادة تنفيذ Day 3. |
| 🟡 المتصفح والمالك | لا نتيجة موثقة لاجتياز Day 3 كاملًا في المتصفح أو اعتماد نهائي لكل الشاشات. تفاعل المالك الإيجابي مع رسم الأيقونة وطلب تكبيرها يخص الأيقونة؛ لا يعادل توقيع RTL/LTR × المقاسات × الثيمات، أو ثبات الـFABs، أو حركة التحميل والفافيكون. |
| **Day 3 follow-up مستقل: D3-RM** | تصحيح لعبارة «reduced-motion يعطّل الحركة» في §12: `animation:none` في `styles/animations.css:229–231` تسبق تعريفَي `.jar-fill-anim` و`.herb-float` عند `258–264` بنفس specificity. المصدر يُظهر تعارض ترتيب القواعد؛ السلوك المرئي لم يُختبر. **توثيق فقط: لا إصلاح CSS ضمن Day 4 إلا بموافقة منفصلة.** |

### 14) Day 4 — خطة معتمدة، لا تنفيذ (2026-11-19)

- **قرار المالك:** [DAY4_TASKS.md](./DAY4_TASKS.md) هو تسليم التخطيط لـGLM. الكتالوج هو المسار الأساسي؛ G3 مستقلة ومشروطة بعقد النشر في الباك. G4 تعيد استخدام cartApi والـhelpers الحالية. البحث وواجهة السلة لـDay 5. اعتماد النطاق **ليس** إذنًا ببدء G0 أو أي Gate تالية.
- **حالة البوابات:** G0 pre-flight، G1 data/cacheLife، G2 Catalog، G3 تفاصيل مشروطة، G4 عبوة/إضافة، G5 تسليم — **الستة لم تبدأ**. لم تتغير حالة KS-1/2/3. لا أوامر أو نتائج تنفيذ تُنسب إلى هذه البوابات.
- **الاعتماديات المفتوحة:** بيئة API حية للقائمة/شجرة الأقسام؛ توحيد شروط `ACTIVE` ونافذة النشر/الأهلية بين `products/list.ts` و`products/service.ts` وإثباتها من فريق الباك قبل G3؛ لا عرض مضلل لـ`pricePer100g` مع KG/L؛ إذن وبيئة اختبار guest cart قبل أي كتابة. لا حلول وهمية من الفرونت. يمكن للمالك طلب تسليم الكتالوج وحده لو حُجبت التفاصيل.
- **تسليم هذه المرحلة:** إنشاء `docs/DAY4_TASKS.md` وتحديث `docs/PROGRESS.md` فقط. عند التكليف اللاحق، GLM يسلّم Gate واحدة، Astra يراجع الـdiff والأدلة، والمالك يقرر الانتقال. **⛔ STOP قبل Gate 0 — بانتظار إذن بدء مستقل.**

### 15) Day 4 — Gate 0 Pre-flight Evidence (2026-11-19, G0 only — no app/build fixes)

> **إذن:** مالك فوّض Gate 0 فقط (قراءة/فحص/تسجيل). **لا** تنفيذ G1–G5، لا تعديل باك/DB/schema/migration/deps/commit/push/deploy، لا إعادة مصفوفة Day 3.

| البند | الدليل/الحالة |
| --- | --- |
| البيئة والتاريخ | Windows `win32`, repo `E:\NODE_JS\Udemy\Training` (git), تاريخ الجلسة 2026-11-19، frontend `Om-Eman/frontend` (Next 16.4.5). |
| Git / baseline (pre-existing) | `frontend git status --short`: `M app/[locale]/layout.tsx`, `M app/manifest.ts`, `M components/ECommerce/Header/HeaderBrand.tsx`, `M components/shared/BrandLoader.tsx`, `M docs/PROGRESS.md`, `?? app/icon.svg`, `?? components/Brand/`, `?? docs/DAY4_TASKS.md`. Diff stat (tracked): 5 files, +88/−62 (layout/manifest/brand/loader/PROGRESS). `git diff -- package.json package-lock.json`: فارغ. `git diff --check`: لا تعارضات whitespace (تحذيرات LF→CRLF فقط على Windows). آخر commits: `962eb69 Finish Day3`, `bb9c628 Enhance Backend`. ملاحظة: أوامر git على جذر الـworkspace تُصدر تحذيرات symlinks مكسورة خارج `Om-Eman` (ضجيج بيئة، لا علاقة بـG0). |
| Lint / check / build (آخر تشغيل G0) | `npm run lint` (frontend) **EXIT 0**. `npm run check` **EXIT 0** — `Scanned 122 code files, 122 message keys per locale. 0 failure(s), 0 warning(s).` `npm run build`: **لم يُعاد تشغيله**؛ baseline موثّق سابقًا EXIT 1 `TurbopackInternalError` `[project]/app/globals.css.css [app-client] (css)` مع `0xc0000142`, لا `BUILD_ID` (حاجب بيئة). |
| TypeScript (G0 reconfirmed) | من `Om-Eman/frontend`: `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 2**, **4×TS2769**: `lib/server/storeQueries.ts:9,17,25,33` — overload `cacheLife` لا يقبل union/string `"seconds"|"minutes"` بالصياغة الحالية (`cacheLife(result.ok ? "minutes" : "seconds")`). تأكيد على السطور 9,17,25,33 (موقع 25 أيضًا متأثر حاليًا). إصلاح typing مسموح **داخل G1 فقط** بعد إذن المالك. |

**API (runtime، `http://localhost:3002/api`, قراءة فقط — 2026-11-19):**

| الطلب | النتيجة | ملاحظة |
| --- | --- | --- |
| `GET /store/categories` | HTTP 200, `success:true`, `message:"Categories fetched successfully"` | `data` array (3: spices/herbs/gift-bundles) مع `subcategories[]`, `productsCount`, أسماء/slug؛ مفاتيح متوافقة مع `IStoreCategoryNode`. |
| `GET /store/products?page=1&limit=1&sort=newest` | HTTP 200, `success:true` | `data` كارت منتج + `meta` على envelope: `{page:1,limit:1,total:9,totalPages:9,hasNextPage:true,hasPreviousPage:false}`. |
| `GET /store/products?category=spices&subcategory=ground-spices&page=1&limit=2&sort=price_asc` | HTTP 200, `success:true` | نتائج مفلترة (cumin, chili-powder) + `meta` `{page:1,limit:2,total:4,totalPages:2,hasNextPage:true,hasPreviousPage:false}`؛ `sort=price_asc` مقبول. |
| `GET /store/products?page=99&limit=12` | HTTP 200, `success:true` | `data:[]`, `meta` `{page:99,limit:12,total:9,totalPages:1,hasNextPage:false,hasPreviousPage:true}` (خارج المدى ≠ خطأ/≠ متجر فارغ). |
| `GET /store/products?category=not-a-real-slug` | HTTP 200, `success:true` | `data:[]`, `meta` `{page:1,limit:12,total:0,totalPages:0,hasNextPage:false,hasPreviousPage:false}` (فلتر صحيح الصياغة بلا نتائج). |
| `GET /store/products?sort=invalid` | HTTP 400, `success:false` | `code:"VALIDATION_ERROR"`, رسالة تحقق من Zod. |
| `GET /store/products/home-starter-bundle` | HTTP 200, `success:true` | تفاصيل bundle: `productType:"PREDEFINED_BUNDLE"`, `packages[1]`, `bundleComponents[3]`, `images[]`, `related:[]` (شكل متوافق مع توقعات التفاصيل). |
| `GET /store/products/coriander-seeds` | HTTP 200, `success:true` | منتج FINISHED مع package واحد و`pricePer100g` string. |
| `GET /store/products/does-not-exist-slug-xyz` | HTTP 404, `success:false` | `code:"PRODUCT_NOT_FOUND"`, `message:"Product not found"`. |
| Cart `GET /api/store/cart` (بدون guestToken) | **HTTP 200 (runtime executed once)** | ⚠️ استُدعي أثناء G0 وأعاد 200؛ endpoint قد ينشئ سلة حسب العقد/السلوك الموثّق — **احتمال أثر جانبي إنشاء/قراءة حالة سلة** (لم يُقرأ الجسم/التوكن، لا تكرار). لا `POST/PATCH/DELETE /cart.../items` ولا `POST /cart/merge` نُفّذت. تحقق كتابة السلة مؤجل لـG4 ببيئة/إذن مناسب. |

**عقود/مصادر (قراءة فقط):**

- **Catalog API:** `backend/src/modules/store/products/{validation,list,routes,controller,service}.ts` — query يقبل `page/limit<=48/category/subcategory/featured/inStock/minPrice/maxPrice/sort`, افتراضيات واضحة؛ القائمة تبني شروط ACTIVE/publish window/sellable package/category-active (كما في `list.ts`). القائمة runtime الآن **صالحة** على البيئة المفحوصة (سابقًا موثّق كـblocker، غير مستنتج حاليًا).
- **Detail publication (B-PUB، مانع G3):** `list.ts` يقيّد النشر/الأهلية على مستوى القائمة؛ `service.ts#getStorefrontDetail` يستخدم `findUnique({ where: { slug } })` ثم يفلتر packages `isActive && isPublished` و`bundleComponents`/`related`، **دون** نفس بوابة المنتج `status=ACTIVE`/نافذة النشر/شروط القسم الظاهرة في القائمة (التعليق يذكر draft/inactive 404). **لا دليل runtime** على سلوك slug غير منشور/مسودة. ⇒ سياسة النشر للتفاصيل **غير محسومة/غير مثبتة** على البيئة المقصودة؛ G3/G4 لا تُفتحان بدون حسم باك + دليل + إذن مالك.
- **Cart reuse (موجود):** `frontend/store/cartApi.ts` (`getOrCreateCart`, `addCartItem`, tag `Cart`), `lib/cartToken.ts` (`om_cart_token`), `store/baseApi.ts` (`Cart` tag, envelope unwrap/error), `components/Card/ProductCard.tsx` يدمج الإضافة/حالاتها. Cart routes مصدر: `backend/src/modules/store/cart/{routes,controller,service,types}.ts`, swagger-store جزئيًا؛ عقد runtime للكتابة/الإنشاء الكامل **غير مختبر متعمدًا** باستثناء طلب GET واحد أعلاه.
- **B-UNIT:** `backend/src/modules/store/products/card.ts` يحسب `pricePer100` بقسمة على `sizeValue` بغض النظر عن تحويل `KG/L` إلى 100g/ml — لا يُعرض مضللًا للوحدات الكبيرة دون تأكيد/تصحيح باك (قرار Day 4).

**D3-RM (متابعة Day 3، مصدر فقط — غير منفّذة):** `styles/animations.css:215–233` (`prefers-reduced-motion: reduce`) يضع `.jar-fill-anim,.herb-float { animation: none; }`، لكن تعريفات `.jar-fill-anim`/`.herb-float` عند ~258–264 تأتي لاحقًا بنفس specificity فتغلب عليها. تعارض ترتيب مؤكد بالكود؛ السلوك المرئي غير مختبر. **لا إصلاح ضمن G0/Day 4 بدون إذن منفصل.**

**قرارات G0 (منفصلة):**
- **Catalog API path:** صالح وظيفيًا على البيئة المفحوصة للعينة (list/filter/sort/invalid/pagination/meta/404 detail) مع بقاء مخاطر typing/build/عدم اختبار المتصفح. **جاهز لمراجعة تخطيط G1 بعد إذن مالك**، مع تسجيل أن B-TS/B-BUILD ما زالا مفتوحين.
- **Detail publication:** **محجوب لـG3** (B-PUB غير محسوم، لا دليل حالات غير مؤهلة/غير منشورة).
- **Cart write contract:** **محجوب للاختبار الفعلي** في G0 (مسموح source-only + ملاحظة GET أعلاه)؛ G4 تتطلب بيئة/إذن كتابة.

**تعديلات المستندات في G0:** `docs/PROGRESS.md` — إضافة قسم §15 (هذا السجل) فقط. `docs/DAY4_TASKS.md` لم يُعدّل (خطة معتمدة). لا ملفات مصدر تطبيق/باك/اعتمادات.

**اعتماديات G1 (عند الإذن):** إصلاح `cacheLife` typing في `lib/server/storeQueries.ts` (4 مواضع baseline) بأصغر شكل آمن، تطبيع query وبناء استعلام قائمة server-side وفق `DAY4_TASKS.md` Gate 1، إعادة `tsc`/`lint`/`check` وتسجيل build/بيئة؛ بدون صفحة/تفاصيل/سلة.

**Astra review (مستقل، مبني على الأدلة أعلاه):**
- **قبول النطاق:** G0 التزم بالقراءة/الفحص/التسجيل؛ لا كود تطبيق ولا G1+. تحديث PROGRESS مناسب كمكان أدلة البوابة.
- **نقاط قوة:** تأكيد runtime حي للكتالوج/التفاصيل الناجحة و404، إعادة تأكيد `tsc` (4×TS2769) و`lint/check` الأخضر، وتوثيق B-PUB من المصدر.
- **ملاحظات/تحفظات:** (1) تنفيذ `GET /store/cart` مرة واحدة يخلق خطر أثر جانبي محتمل — يجب اعتباره انحرافًا غير مقصود عن نية "source-only" وتجنبه لاحقًا. (2) غياب دليل نشر سلبي للتفاصيل يمنع أي ادعاء أمان G3. (3) `npm run build` غير مُعاد؛ 0xc0000142 يبقى حاجب بيئة لا يُفسَّر كعيب وظيفة. (4) D3-RM مؤكد مصدرًا فقط، بصريًا 🟡.
- **توصية:** **الانتقال مشروط بموافقة المالك الصريحة على بدء G1** (كتالوج فقط). **لا توصية بفتح G3/G4** حتى حسم B-PUB وإذن/بيئة اختبار الكتابة. يمكن للمالك لاحقًا طلب مسار catalog-only إذا استمرت عوائق التفاصيل.

⛔ STOP — DAY 4 GATE 0 COMPLETE — WAITING FOR OWNER APPROVAL

### 16) Day 4 — Gate 1 Catalog data layer (2026-11-19, G1 only — no UI)

> **إذن:** مالك فوّض G1 فقط. لا G2+، لا صفحة كتالوج/تفاصيل، لا باك/كارت/اعتمادات/تغييرات معمارية أو ملفات غير مرتبطة، لا commit/push/deploy.

| البند | الدليل/الحالة |
| --- | --- |
| 1) إصلاح TS2769 `cacheLife` | `frontend/lib/server/storeQueries.ts` (أصغر تغيير متوافق): استبدال `cacheLife(result.ok ? "minutes" : "seconds")` في الاستدعاءات الأربعة القائمة بصيغة شرط صريحة `if (result.ok) { cacheLife("minutes"); } else { cacheLife("seconds"); }` مرة واحدة لكل مسار (`getStoreSettings`, `getStoreCategories`, `getStoreBanners`, `getFeaturedProducts`). **محفوظ:** نفس `cacheTag`/مسارات fetch/أشكال النتائج/سياسة minutes-on-success, seconds-on-failure. لا `as`، لا config، لا استدعاء مزدوج. |
| 2) طبقة بيانات الكتالوج (server-side) | **جديد:** `frontend/lib/catalogQuery.ts` (57 سطر) — إعادة استخدام `URLSearchParams` وأنماط المشروع: `TCatalogSort`/`INormalizedCatalogQuery`, تطبيع allowlist (`category`/`subcategory` slugs مفردة بصيغة `^[a-z0-9]+(?:-[a-z0-9]+)*$` وطول ≤200؛ `sort` ∈ `newest|price_asc|price_desc|name` افتراضي `newest`؛ `page` عدد صحيح موجب افتراضي 1؛ قيم غير صالحة/مكررة → افتراضي، لا إرسال slug غير صالح للباك)، وبناء مسار `store/products?sort=&page=&limit=12&...`. **محدّث:** `frontend/lib/server/storeQueries.ts` (66 سطر) — إضافة `getStoreProducts(query: INormalizedCatalogQuery)` يعيد استخدام `storeFetch<IStoreProductCard[]>` + `"use cache"` + `cacheTag("store-products")` + `cacheLife` شرطي مرة واحدة، ويعيد `TStoreResult<IStoreProductCard[]>` كما هو (يحافظ `data`/`meta?` عبر `storeFetch`). `getFeaturedProducts` لم يُحوّل لجلب كل المنتجات. |
| 3) العقود/الاتفاقيات المحفوظة | لا تغيير في `storeFetch`/`lib/envelope`/`interface`/استجابات API/`IPaginationMeta`/معالجة الأخطاء. القراءة تعيد استخدام `IStoreProductCard` و`TStoreResult`. لا RTK Query للقراءة، لا fetch مباشر خارج الطبقة، لا UI/صفحات. |
| 4) مكونات/أنماط معاد استخدامها | `storeFetch`, `TStoreResult`, نمط `cacheTag/cacheLife`/`"use cache"` القائم، `IStoreProductCard`, `URLSearchParams`، اتفاقيات الأنواع/الملفات الحالية. لا بنية fetch/caching موازية، لا إعادة بناء لموجود. |

**فحوصات G1 (frontend `Om-Eman/frontend`, 2026-11-19):**
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0** (TS2769 الأربع منتهية).
- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** — `Scanned 123 code files, 122 message keys per locale. 0 failure(s), 0 warning(s).`
- `npm run build` → **لم يُعاد تشغيله** (حاجب بيئي موثّق سابقًا: Turbopack `globals.css.css` / `0xc0000142`, لا `BUILD_ID`) — لا ادعاء نجاح إنتاج.

**Git diff (مراجعة كاملة بعد G1):**
- **G1 (مقصود):** `frontend/lib/server/storeQueries.ts` (M, +39/−4: إصلاح `cacheLife` + `getStoreProducts`)، `frontend/lib/catalogQuery.ts` (?? جديد)، `frontend/docs/PROGRESS.md` (M, سجل G0/G1).
- **Pre-existing/non-G1 (لم يُمس في G1):** `app/[locale]/layout.tsx`, `app/manifest.ts`, `components/ECommerce/Header/HeaderBrand.tsx`, `components/shared/BrandLoader.tsx`, untracked `app/icon.svg`, `components/Brand/`, `docs/DAY4_TASKS.md`.
- **ملاحظة diff غير مقصودة/غير مرتبطة:** `components/ECommerce/WhatsAppFab.tsx` يظهر modified (مسافة زائدة في JSX attribute) — **خارج نطاق G1، لم أتعمد تعديله؛ يتطلب مراجعة/إرجاع منفصل بقرار المالك** (لم أعدله إضافيًا).
- **Dependencies/out-of-scope:** `git diff -- package.json package-lock.json` فارغ؛ لا backend/cart/UI/pages/config؛ `git diff --check` نظيف (تحذيرات LF/CRLF فقط).

**إخفاقات/محجوبات (صادقة):**
- `npm run build` غير مُعاد (`0xc0000142`) — blocker بيئي.
- لا تحقق سلوكي حي لطبقة الكتالوج في صفحة (G2 غير منفذة)؛ التطبيع/المسار متوافقان مع عقد الباك المثبت في G0.
- **B-PUB** غير محسوم → G3/G4 محجوبة. Cart write runtime غير مختبر. قبول بصري/متصفح 🟡.

**Astra review (independent, G1):**
- **النطاق:** ملتزم جوهريًا بتسليم G1 (إصلاح TS + data layer) وإعادة استخدام الأنماط القائمة؛ لا G2/UI/تفاصيل/باك/كارت/اعتمادات. لوحظ diff تافه غير مقصود في `WhatsAppFab.tsx` خارج النطاق — يجب عدم اعتباره جزءًا من G1 ومعالجته/تأكيده لاحقًا.
- **صحة التغيير:** إصلاح TS2769 بأصغر شكل متوافق (تفريع صريح) يحافظ tags/paths/result/cache policy. `getStoreProducts` يعيد استخدام `storeFetch`/`"use cache"`/`cacheTag("store-products")`/`cacheLife` الشرطي و`TStoreResult<IStoreProductCard[]>` مع حفظ `meta`. تطبيع allowlist (slug/sort/page/limit 12، تجاهل غير الصالح) يطابق خطة G1.
- **تحفظات:** يعتمد الاعتماد السلوكي على G2+ والتحقق الحي؛ build محجوب بيئيًا؛ مشاركة tag `store-products` مع featured سلوك قائم مقبول.
- **توصية:** **قبول تقنيًا لمخرجات G1 المحددة** بانتظار موافقة المالك للانتقال إلى G2، مع ملاحظة معالجة diff `WhatsAppFab.tsx` غير المقصود. G3/G4 تبقى محجوبة (B-PUB/إذن كتابة).

⛔ STOP — GATE 1 COMPLETE — WAITING FOR OWNER APPROVAL

### 17) Day 4 — Gate 2 Catalog UI (2026-11-19, G2 only — SSR/RSC)

> **إذن:** مالك اعتمد Step 1 plan وصرّح بتنفيذ G2 فقط. لا G3/G4 (B-PUB/تفاصيل/اختيار عبوة/إضافة PDP)، لا بحث/سلة/`/cart`/drawer/badge، لا باك/DB/migrations/اعتمادات/config/build-tooling، لا commit/push/deploy.

| Task | الحالة | الملف الفعلي | المسؤولية | الدليل |
| --- | --- | --- | --- | --- |
| G2-i18n | منفّذ (مصدر) | `messages/ar.json`, `messages/en.json` (M) | مفاتيح `catalog` متطابقة (عنوان/وصف/مسار/فلاتر/ترتيب/حالات/ترقيم/مسح/عودة)؛ ICU أقواس مفردة `{page},{total}` | `npm run check` EXIT 0 (149 مفتاح/locale)، لا نصوص UI صلبة جديدة في ملفات G2 |
| G2-route | منفّذ (مصدر) | `app/[locale]/(Store)/products/page.tsx` (جديد، 25 سطر) | صفحة تركيب رفيعة: `params`/`searchParams` Promises، `setRequestLocale`، تطبيع query خارج cache، `<Suspense key=...>` + `CatalogSkeleton` | يعيد استخدام `normalizeCatalogSearchParams`/G1؛ لا fetch في JSX |
| G2-meta | منفّذ (مصدر) | `app/[locale]/(Store)/products/metadata.ts` (جديد، 22 سطر) | `generateMetadata` مترجم لمسار `/products` عبر `buildMetadata` (canonical/hreflang) بنمط `/design` | مسار كتالوج أساسي (لا `isNoIndex`) |
| G2-skeleton | منفّذ (مصدر) | `components/Skelton/CatalogSkeleton.tsx` (جديد، 25 سطر) | fallback أبعاد منطقة heading/فلاتر/شبكة داخل Suspense | نمط `Skeleton` القائم |
| G2-filters | منفّذ (مصدر) | `components/ECommerce/Catalog/CatalogFilters.tsx` (جديد، 101 سطر) | فلاتر URL-driven (روابط `@/i18n/navigation`) من شجرة الأقسام + sort allowlist؛ تغيير category يمسح subcategory، reset `page=1`، الحفاظ على params المسموحة؛ رسالة خطأ فلاتر منفصلة | يعيد استخدام `pickLocalized`, `cn`, tokens |
| G2-pagination | منفّذ (مصدر) | `components/ECommerce/Catalog/CatalogPagination.tsx` (جديد، 46 سطر) | ترقيم من `IPaginationMeta` (`page/totalPages/hasNextPage/hasPreviousPage`) مع حفظ الفلاتر؛ إخفاء عند صفحة واحدة | `buttonVariants`, أيقونات lucide، RTL rotation |
| G2-section | منفّذ (مصدر) | `components/ECommerce/Catalog/CatalogSection.tsx` (جديد، 133 سطر) | RSC: `Promise.all([getStoreProducts(query), getStoreCategories()])`, H1 + breadcrumb مرئي + `BreadcrumbList` JSON-LD، فصل فشل الشجرة عن نتائج المنتجات، حالات error/empty/out-of-range/success، عرض `FeaturedGrid` + `CatalogPagination` | يعيد استخدام G1 server layer، `FeaturedGrid`/`ProductCard`, `EmptyState`/`ErrorState`, `JsonLd`, `SITE_URL`, `pickLocalized` |

**إعادة استخدام (بدون إنشاء موازٍ):** `lib/server/storeQueries.ts#getStoreProducts/#getStoreCategories`, `lib/catalogQuery.ts#normalizeCatalogSearchParams`, `lib/server/storeFetch.ts` `TStoreResult`+`meta`, `interface/store.ts`/`api.ts`, `components/ECommerce/Home/FeaturedGrid.tsx` + `components/Card/ProductCard.tsx`, `components/shared/{EmptyState,ErrorState,JsonLd}`, `components/ui/Skeleton.tsx`/`buttonVariants`, `@/i18n/navigation`, `lib/{localized,seo,config,utils}`. لا RTK Query للقراءة، لا fetch مباشر في JSX/mكونات، لا slice/provider/wrapper موازي.

**سلوك/حالات منفذة (مصدر + HTML):** URL مصدر الحقيقة (فلاتر/ترتيب/صفحة تطبَّع عبر G1 allowlist؛ `sort=invalid`/`page=-2` → `newest/page=1` في HTML). فشل المنتجات → `ErrorState`؛ فشل الشجرة فقط → رسالة `filtersError` مع استمرار عرض نتائج المنتجات إن نجحت. فلتر صحيح بلا نتائج (`category=not-a-real-slug`) → 200/`meta.total=0` من API سابقًا و**EmptyState** «مفيش منتجات مطابقة/No matching products» مع مسح الفلاتر (HTML curl). خارج المدى (`page=99`, `meta.total>0 && page>totalPages`) → **out-of-range** مع «ارجع للنتائج/Back to results» (HTML curl). نجاح → شبكة منتجات حقيقية + breadcrumb/JSON-LD. `FeaturedGrid` يعيد استخدام كروت المنتج القائمة (روابط KS-2 `/products/[slug]` تبقى pending حتى G3).

**فحوصات آلية (frontend، 2026-11-19):**
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0**.
- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** — `Scanned 129 code files, 149 message keys per locale. 0 failure(s), 0 warning(s).`
- `npm run build` → **لم يُشغَّل** (حاجب بيئي موثّق: Turbopack `globals.css.css` / `0xc0000142`, لا `BUILD_ID`) — لا ادعاء إنتاج/`npm run start`.

**تحقق خادم dev/HTML (curl على `:3001`, 2026-11-19، dev متاح):**
- `GET /ar/products` و`GET /en/products` → HTML SSR يحتوي H1، breadcrumb مرئي + `BreadcrumbList` JSON-LD، فلاتر/ترتيب مترجمة، أسماء/أسعار/صور/روابط منتجات حقيقية (`/ar/products/home-starter-bundle` إلخ، نصوص EN في `/en/products`).
- `GET /ar/products?category=spices&subcategory=ground-spices&sort=price_asc&page=1` → نتائج مفلترة/مرتبة (كمون، شطة، كركم، فلفل أسود) مع breadcrumb يتضمن القسم/الفرعي و`aria-current`.
- `GET /ar/products?category=not-a-real-slug&sort=newest&page=1` → حالة Empty مطابقة + «مسح الفلاتر».
- `GET /ar/products?page=99` → حالة out-of-range + «ارجع للنتائج».
- `GET /ar/products?sort=invalid&page=-2` → تطبيع لواجهة `الأحدث`/page الافتراضي (لا كسر).

**Git diff / نطاق (بعد G2):**
- **G2 مقصود:** `app/[locale]/(Store)/products/{page.tsx,metadata.ts}` (??), `components/ECommerce/Catalog/{CatalogSection.tsx,CatalogFilters.tsx,CatalogPagination.tsx}` (??), `components/Skelton/CatalogSkeleton.tsx` (??), `messages/{ar.json,en.json}` (M), `docs/PROGRESS.md` (M).
- **G1 قائم/غير معدل في G2:** `lib/catalogQuery.ts` (??), `lib/server/storeQueries.ts` (M سابقًا).
- **Pre-existing/خارج G2 (لم يُمس):** `app/[locale]/layout.tsx`, `app/manifest.ts`, `components/ECommerce/Header/HeaderBrand.tsx`, `components/shared/BrandLoader.tsx`, `docs/FRONTEND_TASKS_10_DAYS.md` (M)، untracked `app/icon.svg`, `components/Brand/`, `docs/DAY4_TASKS.md`. **ملاحظة مستمرة:** `components/ECommerce/WhatsAppFab.tsx` diff تافه غير مقصود خارج النطاق (غير معالج).
- `git diff -- package.json package-lock.json` فارغ؛ لا backend/cart/تفاصيل/config/build.

**KS / حدود / غير منفّذ (صريح):**
- **KS-1:** مسار `/[locale]/products` مع دعم `category`/`subcategory`/`sort`/`page` منفّذ ومُتحقق منه عبر HTML/API cases؛ روابط أقسام الهوم (`categoryHref`) تستهدفه — **تنفيذًا جاهز، اعتماد بصري/مالك 🟡**.
- **KS-2/KS-3:** لا يزالان خارج G2 (تفاصيل/سلة مؤجلة؛ G3/G4/Day 5). لا cart page/drawer/badge، لا PDP، لا بحث.
- **B-PUB (غير محسوم):** G3/G4 محجوبتان. **B-TS** محسوم في G1؛ **B-BUILD** مفتوح؛ **D3-RM** متابعة Day 3 مستقلة.
- **غير مُختبر/🟡:** تفاعل متصفح حي كامل (نقر/تنقل من الهوم فعليًا داخل UI، back/forward تفاعلي، تبديل لغة مع query في جلسة، skeleton تحت بطء شبكة)، استجابة 360px/desktop، الثيمات الأربعة (خصوصًا Cinnamon داكن)، لوحة مفاتيح/focus-visible، و`prefers-reduced-motion` بصريًا. لا ادعاء production.

**Astra review (independent, G2):**
- **النطاق:** متوافق مع Gate 2 المصرّح بها (كتالوج فقط) وإعادة استخدام G1/مكوّنات قائمة (`FeaturedGrid`/`ProductCard`/states/SEO helpers). لا تفاصيل/سلة/بحث/باك/اعتمادات. التغييرات الإضافية المرصودة خارج النطاق تبقى كما كانت (WhatsAppFab تافه، ملفات pre-existing/untracked أخرى).
- **تنفيذ/عقد:** RSC + `Suspense`+key + تطبيع query قبل cache، فصل حالات error/empty/out-of-range وفشل فلاتر، ترقيم/روابط من `meta` والـURL، breadcrumb مرئي + JSON-LD، AR/EN في HTML. تطابق المصدر مع فحوص `tsc/lint/check` الخضراء واستجابات HTML الحية المرصودة.
- **تحفظات:** اعتماد بصري/تفاعلي/a11y/responsive/themes/reduced-motion وKS-1 من تدفق الهوم يتطلب مراجعة مالك/متصفح 🟡؛ build إنتاجي محجوب بيئيًا؛ out-of-range يعيد للنتائج بإزالة الفلاتر (سلوك آمن لكنه قرار UX قابل للمراجعة).
- **توصية:** **قبول تقني لتنفيذ G2** بانتظار مراجعة/اعتماد المالك البصري والسلوكي. لا بدء G3/G4 (B-PUB/إذن كتابة/تفاصيل خارج النطاق).

⛔ STOP — DAY 4 GATE 2 COMPLETE — WAITING FOR OWNER APPROVAL

### 18) Day 4 — Gate 3 Product Details UI (2026-11-19, G3 only — SSR/RSC)

> **إذن:** المالك اعتمد B-PUB backend fix وكتب `B-PUB BACKEND FIX ACCEPTED`، ثم فوّض **G3 فقط**. لا G4/Day 5، لا اختيار عبوة أو Add to Cart، لا تعديل ProductCard/السلة، لا باك/DB/مigrations/seed، لا commit/push/deploy. ملاحظة `backend/docs/BACKEND_PROGRESS.md:155` («awaiting Astra review and Owner approval») سبقت قرار المالك؛ لم يُعدل ملف الباك في G3.

| Task | الحالة | الملف الفعلي | المسؤولية | الدليل |
| --- | --- | --- | --- | --- |
| G3-D1-contract | منفّذ (مصدر) | `interface/storeProduct.ts` (جديد)، `interface/index.ts` (M) | عقد تفاصيل المتجر (`IStorefrontProduct`، `IStorefrontPackage`، `IStorefrontBundleComponent`، `IStorefrontImage`، `TStoreSizeUnit`) مع إعادة استخدام `IStoreProductCard` وcategory/image types؛ تصدير عبر barrel | `npm run check` EXIT 0، `tsc` EXIT 0، لا استيراد Prisma |
| G3-D1-validation | منفّذ (مصدر) | `validation/storeProduct.ts`, `validation/index.ts` (جديدان) | Zod schema للـdetail wire payload عند حد القراءة (envelope يتحقق منه `storeFetch`)؛ يرفض البنية غير الصالحة بـ`INVALID_RESPONSE` | `../backend/node_modules/.bin/tsx` تحقّق من 9 slugs حقيقية: `schema=true` لكلها |
| G3-D1-query | منفّذ (مصدر) | `lib/server/storeQueries.ts` (M)، `lib/storeSlug.ts` (جديد) | `getStorefrontProduct(slug)` بنفس `storeFetch`/`TStoreResult`، `"use cache"` + `cacheTag("store-products", "store-product-<slug>")` + `cacheLife` مرة واحدة (minutes للنجاح/seconds للفشل)؛ تحقق slug قبل الاستعلام؛ `related` من نفس الرد | API 200 لكل slugs + schema pass؛ لا request منفصل للـrelated |
| G3-D2-route | منفّذ (مصدر) | `app/[locale]/(Store)/products/[slug]/{page.tsx,metadata.ts}` (جديدان) | صفحة تركيب رفيعة (19 سطر): `params` Promise، `setRequestLocale`، slug check، `Suspense` + skeleton؛ metadata من نفس query وترجمات `productDetail` مع fallback عام عند الفشل | `tsc` EXIT 0؛ لا fetch في JSX؛ لا metadata من منتج عند الفشل |
| G3-D2-ui | منفّذ (مصدر) | `components/ECommerce/Product/{ProductDetails,ProductBreadcrumb,ProductGallery,ProductPackages,PackageSize,BundleContents}.tsx` (جديدة) | عرض الأسماء/الوصف/البراند/الباقة، صور + alt/fallback، عبوات بأسعارها من نفس العبوة، محتويات باكج فعلية، breadcrumb مرئي، related من نفس الـpayload | `lint/check/tsc` EXIT 0؛ لا واجهة اختيار/زر شراء جديد؛ لا عرض `pricePer100g` |
| G3-D2-states | منفّذ (مصدر) | `components/Skelton/ProductDetailsSkeleton.tsx` (جديد)، `ProductDetails.tsx` | loading عبر Suspense، `notFound()` فقط عند `PRODUCT_NOT_FOUND` من الباك، `ErrorState` لtimeout/500/رد غير صالح، إخفاء الأقسام الاختيارية عند غيابdescription/صور/bundle/related | API missing slug ← 404 `PRODUCT_NOT_FOUND`؛ لا بديل مُختلق |
| G3-D3-seo | منفّذ (مصدر) | `lib/jsonld.ts` (M)، `components/shared/JsonLd.tsx` (مُعاد استخدامه) | `buildBreadcrumbJsonLd` + `buildProductJsonLd`؛ Product/Offer وbreadcrumb من نفس العبوة/الرد، العملة من `getStoreSettings()` الحقيقية، لا Offer إن غابت العملة، لا توسيع sitemap | JSON.parse للـJSON-LD المولّد من بيانات حقيقية (أدناه) |
| G3-i18n | منفّذ (مصدر) | `messages/{ar,en}.json` (M) | namespace `productDetail` متطابق (عنوان/وصف/حالات/عناوين/وحدات/quantity/meta) بـICU أقواس مفردة | `npm run check` EXIT 0 — `Scanned 142 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).` |

**إعادة استخدام صريحة (بدون نسخ موازٍ):** `storeFetch`, `TStoreResult`، `getStoreSettings`، `FeaturedGrid`، `ProductCard` (بدون تعديل)، `StoreImage`، `PriceTag`، `Badge`، `ErrorState`، `JsonLd`، `Skeleton`، `@/i18n/navigation`، `buildMetadata`، `pickLocalized`، `categoryHref`، `productHref`، `SITE_URL`. لا RTK Query للقراءة، لا fetch مباشر في مكون، لا cart token/mutation، لا slice/provider جديد.

**فحوصات آلية (frontend، 2026-11-19):**
- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** — `Scanned 142 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0**.
- `npm run build` → **EXIT 1** — نفس حاجز B-BUILD البيئي: `TurbopackInternalError: [project]/app/globals.css.css [app-client] (css)`، `node process exited ... 0xc0000142`، بلا `BUILD_ID`. لم يُعدّل tooling ولا config؛ لا ادعاء production/start.
- `git diff --check` → **EXIT 0** (تحذيرات CRLF فقط من Git). `git diff -- frontend/package.json frontend/package-lock.json` → فارغ.
- `npm run dev` لفحص HTML: الخادم بدأ ثم فشل عند compile `/[locale]/(Store)/products` بنفس Turbopack panic، و`GET /ar/products` رجع 500. لذلك **لم يُلاحظ HTML فعلي لصفحة PDP**؛ لا ادعاء بصري/متصفح أو HTTP 404 من Next.

**دليل API/بيانات حقيقي (backend شغّل مؤقتًا على :3002 ثم أُوقف):**
- `GET /api/store/products/<slug>` لكل من `home-starter-bundle, mint-dried, anise, hibiscus, coriander-seeds, chili-powder, cumin, black-pepper, turmeric` → HTTP 200 + `success:true` + Zod `schema=true`؛ `packages`: 1 لكلهم عدا `turmeric` (2)، `related`: 0/2/3 حسب المنتج. مثال `home-starter-bundle`: `bundleComponents=3`.
- `GET /api/store/products/does-not-exist-slug-xyz` → `404 Not Found` مع `{"success":false,"message":"Product not found","code":"PRODUCT_NOT_FOUND"}`. هذا هو المسار الوحيد الذي يفعّل `notFound()` في الفرونت.
- `GET /api/store/settings` → `success:true`, `currency:"EGP"`؛ استُخدم في builder لاختبار Offer بعملة حقيقية.
- JSON-LD مُولّد من payload حقيقي (عبر tsx محلي، `SITE_URL` تجريبي للفحص فقط): `Product` فيه `name/url/image/description/brand/category` من الرد، `offers[0]` فيه `sku/price:"65"/priceCurrency:"EGP"/availability:"https://schema.org/InStock"/url` كلها من نفس العبوة؛ `BreadcrumbList` بثلاثة عناصر وروابط `/ar`، `/ar/products`، `/ar/products/home-starter-bundle`. لا تخمين عملة/سعر/توفر.
- **لم يُختبر:** عرض المتصفح، HTTP الفعلي لصفحة PDP/404 من Next، RTL/LTR بصريًا، 360px/desktop، الثيمات الأربعة، لوحة المفاتيح/focus-visible، reduced-motion، skeleton تحت شبكة بطيئة، ولا حالة فشل خادم مُتحكّم بها (لا بيئة حقن خطأ). سُجّل كـ🟡/لم يُختبر بدل الادعاء.

**نطاق Git بعد G3:**
- **G3 مقصود جديدة:** `app/[locale]/(Store)/products/[slug]/{page.tsx,metadata.ts}`, `components/ECommerce/Product/{ProductDetails,ProductBreadcrumb,ProductGallery,ProductPackages,PackageSize,BundleContents}.tsx`, `components/Skelton/ProductDetailsSkeleton.tsx`, `interface/storeProduct.ts`, `lib/storeSlug.ts`, `validation/{storeProduct,index}.ts`.
- **G3 مقصود معدّلة:** `interface/index.ts`, `lib/server/storeQueries.ts`, `lib/jsonld.ts`, `messages/{ar.json,en.json}`, `docs/PROGRESS.md`.
- **لم يُمس في G3:** `backend/src/modules/store/products/service.ts` و`backend/docs/BACKEND_PROGRESS.md` (B-PUB معتمد من المالك)، `components/Card/ProductCard.tsx`, `store/cartApi.ts`, `lib/cartToken.ts`, `app/sitemap.ts`, كتالوج G2، G1/cacheLife، config/build tooling، dependencies. التعديلات القديمة/غير المتتبعة (layout/manifest/HeaderBrand/BrandLoader/WhatsAppFab/Brand/icon/DAY4_TASKS/FRONTEND_TASKS) بقيت كما كانت؛ diff `WhatsAppFab.tsx` التافه لا يزال خارج نطاق G3 ولم يُصلَح.

**KS / حدود صريحة:**
- **KS-2:** مسار `/[locale]/products/[slug]` منفّذ في المصدر ويستخدم endpoint منشور الباك؛ **تنفيذًا جاهز**، لكن الاعتماد البصري/المتصفح 🟡 ومحجوب بـB-BUILD. لا رابط وهمي ولا صفحة placeholder.
- **G4/الدفع/السلة:** لم تبدأ؛ لا محدد عبوة، لا Add to Cart، لا cart page/drawer/badge، لا Day 5 search/cart. **KS-3** مؤجل.
- **B-UNIT:** لا تُعرض قيمة `pricePer100g` في G3؛ السعر من `sellingPrice` لنفس العبوة فقط.
- **B-PUB:** منفّذ ومُعتمد من المالك؛ الحالات السلبية runtime ما زالت غير متاحة في البيئة، ولم يُعد اختراعها.

**مراجعة Astra:** مطلوبة الآن للـdiff الفعلي مقابل G3 (العقد/SEO/الحالات/الأنماط/الحدود). لا توصية اعتماد مسجّلة بعد.

⛔ STOP — DAY 4 GATE 3 COMPLETE — WAITING FOR OWNER APPROVAL

### 19) Day 4 — Gate 4 Package Selection & Add To Cart (2026-11-19, G4 only — client island)

> **إذن:** المالك كتب `G3 ACCEPTED` وفوّض **G4 فقط**. لا G5/Day 5، لا checkout/cart page/drawer/badge/update/remove، لا باك/DB/migrations/seed، لا dependencies/config/build tooling، لا commit/push/deploy. قرأت `AGENTS.md` و`DAY4_TASKS.md` وآخر سجل في `PROGRESS.md` قبل الكود.

**قرار التكامل المشترك:** A2 كان يمنع نسخ `ProductCard.onAdd` كسير عمل ثانٍ. بما إن مفيش hook مشتركة قبل G4، استُخرج التسلسل في `hooks/useAddToCart.ts` واستُخدم من الكارت ومن PDP. سلوك الكارت القديم محفوظ (`isDemo`, `needsChoice`, `defaultPackageId`, fly/bounce، toast، 1800ms)؛ الفرق المطلوب أن القفل بقى يغطي GET+POST معًا بدل POST فقط. هذا هو «required shared integration change» المذكور في تفويض المالك، ومراجعة Astra المطلوبة بعد الـdiff مسجّلة أدناه.

| Task | الحالة | الملف الفعلي | المسؤولية | الدليل |
| --- | --- | --- | --- | --- |
| G4-A1-selector | منفّذ (مصدر) | `components/ECommerce/Product/{ProductPackageSelector,ProductPackages,ProductPackageOption}.tsx` (جديدة/معدّلة) | حالة اختيار محلية؛ الافتراضي أول عبوة `IN_STOCK` حسب ترتيب API؛ اسم/حجم/وحدة/PriceTag من نفس العبوة؛ sold-out معطّل؛ لا `pricePer100g` ولا حسبة تعويضية | API `cumin` أعاد عبوة `IN_STOCK` بسعر 18؛ `check` EXIT 0؛ `tsc` EXIT 0 |
| G4-A1-wire | منفّذ (مصدر) | `components/ECommerce/Product/ProductDetails.tsx` (M) | يستبدل عرض G3 الثابت بـ`ProductPackageSelector` بمفتاح `product.slug`؛ التركيب لسه رفيع | 82 سطرًا؛ لا fetch جديد ولا CTA قديم مزدوج |
| G4-A1-size | منفّذ (مصدر) | `components/ECommerce/Product/PackageSize.tsx` (M) | تحويل العرض من async server إلى client-safe `useTranslations` عشان يُستخدم داخل الـclient island؛ نفس نص `productDetail.size` | `Scanned 147 code files, 169 message keys per locale. 0 warning(s).` |
| G4-A2-hook | منفّذ (مصدر) | `hooks/useAddToCart.ts` (جديد)، `lib/cartFeedback.ts` (جديد) | التسلسل الوحيد: `readCartToken` عند الضغط فقط → `getOrCreateCart` → `writeCartToken` → `addCartItem` بـ`productPackageId` المختار و`quantity:1`؛ `inFlight` يمنع تكرار الطلب من أول GET لنهاية POST؛ fly/bounce/toast بعد النجاح فقط | POST فعلي رجع 200 بـquantity 1؛ قفل الطلب موجود في المصدر، لم يُختبر بdouble-click متصفح |
| G4-A2-add | منفّذ (مصدر) | `components/ECommerce/Product/ProductAddToCart.tsx` (جديد) | زر واحد بحالات `isLoading`/`disabled`/`added`/error؛ رسالة `role="alert"` مترجمة؛ sr-only `productDetail.quantity` يوضح الكمية 1 | استُخدمت مفاتيح `product.*` الموجودة؛ ما اتضافتش رسائل جديدة |
| G4-A2-card | منفّذ (مصدر) | `components/Card/ProductCard.tsx` (M) | حذف جسم `onAdd` المكرر وربط الكارت بالـhook نفسه بدون تغيير `isDemo` أو `needsChoice` أو الـCTA القديم | `tsc` EXIT 0؛ `lint` EXIT 0؛ diff الكارت 49 سطر حذف/تبسيط |
| G4-states | منفّذ (مصدر) | `ProductAddToCart.tsx`, `useAddToCart.ts`, `Button` الموجود | loadingSpinner من `Button.isLoading`، disable أثناء الشحن وبعد النجاح وللعبوة غير المتاحة، success toast+label+fly، error toast+inline | `invalidQuantity` فعلي رجع 400 `VALIDATION_ERROR`؛ لا نجاح وهمي قبل POST |
| G4-quantity | منفّذ (مصدر) | `useAddToCart.ts:55–59`, `ProductAddToCart.tsx` | Day 4 يضيف 1 دائمًا: جسم POST `{productPackageId, quantity:1}`؛ لا quantity input ولا تعديل بنود | `lineQuantity:"1"` في رد السلة الحقيقي |

**إعادة استخدام صريحة:** `baseApi`، `cartApi` (`useLazyGetOrCreateCartQuery`/`useAddCartItemMutation`)، `readCartToken`/`writeCartToken`، `useFlyToCart`، `CartBounce`/`data-cart-target`، `toast`، `Button`، `Badge`، `PriceTag`، `PackageSize`، `pickLocalized`، مفاتيح `product.*` و`productDetail.*`. ما اتعملش: cart slice/new provider، cart API جديد، cookie/localStorage key جديد، endpoint جديد، RTK Query للقراءة في RSC، تعديل Header/Footer/الفوتر/الأزرار العائمة.

**فحوصات آلية نهائية (frontend، 2026-11-19):**
- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** — `Scanned 147 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).` عدد الرسائل لم يتغير؛ لا مفاتيح G4 جديدة.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0**. أول تشغيل كشف `TS2322` في `ProductPackageSelector` بسبب تعميم ref إلى `HTMLElement`؛ تضيّق إلى `useRef<HTMLDivElement | null>` ثم النهائي نظيف.
- `npm run build` → **EXIT 1** — B-BUILD نفسه: `TurbopackInternalError: [project]/app/globals.css.css [app-client] (css)` و`node process exited ... 0xc0000142` بلا `BUILD_ID`. لم يُعدّل tooling ولا config، ولم يُعاد تشغيل dev في حلقة.
- `git diff --check` → **EXIT 0** (تحذيرات CRLF من Git فقط). `git diff -- frontend/package.json frontend/package-lock.json` → فارغ.
- **لم يُختبر بالمتصفح:** Network عند الحاجة، double-click، RTL/LTR بصريًا، 360px/desktop، الثيمات الأربعة، keyboard/focus-visible، reduced-motion، ولا HTML بعد hydration؛ السبب B-BUILD. لا ادعاء بـHTTP 200 من Next أو بـfly/toast مرئيين.

**دليل API حقيقي (backend محلي شغّل مؤقتًا على :3002 ثم أُوقف؛ من غير طباعة أي token):**
- فحص 9 slugs (`home-starter-bundle … turmeric`): `soldOutPackages 0 []` ⇒ فرع العبوة النافدة منفّذ في المصدر لكن **بلا عينة runtime نافدة**؛ لم تُخترع بيانات.
- `GET /api/store/products/cumin` → 200؛ عبوة واحدة `IN_STOCK` سعرها `18`؛ استُخدم معرّفها الفعلي في الإضافة.
- `GET /api/store/cart` → 200 `success:true`, `itemsCount:0`, `tokenReturned:true` (التوكن لم يُطبع ولا يُخزّن في التقرير).
- `GET /api/store/cart/:token` → 200، `sameCart:true`، `itemsCount:0` قبل الإضافة.
- `POST /api/store/cart/:token/items` بجسم `{productPackageId:<العبوة المختارة من cumin>, quantity:1}` → 200 `success:true`, `itemsCount:1`, `selectedPackageAdded:true`, `lineQuantity:"1"`, `subtotal:"18.0000"`.
- `GET /api/store/cart/:token` بعد الإضافة → 200 `itemsCount:1`, `sameCart:true`, `selectedStillPresent:true` ⇒ نفس السلة بعد refresh.
- `POST ...items` بـ`quantity:0` → 400 `success:false` `code:"VALIDATION_ERROR"`، بلا إضافة. لم يُرسل POST مكرر عن قصد لأنه مش اختبار لقفل الواجهة.
- لم يُختبر `CART_NOT_ACTIVE`/`PACKAGE_NOT_SALEABLE` runtime؛ لا بيئة مُتحكّم بها، وسُجّل `لم يُختبر` بدل الادعاء.

**نطاق Git بعد G4:**
- **G4 جديدة:** `hooks/useAddToCart.ts`, `lib/cartFeedback.ts`, `components/ECommerce/Product/{ProductPackageSelector,ProductAddToCart,ProductPackageOption}.tsx`.
- **G4 معدّلة:** `components/ECommerce/Product/{ProductDetails,ProductPackages,PackageSize}.tsx`, `components/Card/ProductCard.tsx`, `docs/PROGRESS.md`.
- **لم يتغير في G4:** `store/baseApi.ts`, `store/cartApi.ts`, `lib/cartToken.ts`, `messages/{ar,en}.json`، الباك، الـschema، `app/sitemap.ts`، الهيدر/الفوتر/الـbadge، dependencies. التعديلات القديمة/غير المتتبعة (layout/manifest/HeaderBrand/BrandLoader/WhatsAppFab/Brand/icon/كتالوج G2/G3) بقيت كما كانت؛ لم يبدأ G5.

**KS / حدود صريحة:**
- **KS-2:** G3 معتمد من المالك؛ G4 أضاف الاختيار والإضافة على نفس المسار في المصدر ومع API حقيقي، لكن الاعتماد البصري 🟡 بسبب B-BUILD.
- **KS-3:** ما زال مؤجلًا لـDay 5. ما فيش `/cart` أو drawer أو badge أو تحديث/حذف بنود أو checkout.
- **B-UNIT:** لا تُعرض `pricePer100g`؛ السعر من `sellingPrice` للعبوة المختارة فقط.
- **B-BUILD:** مفتوح؛ لا ختم production-ready لهذا Gate.

**مراجعة Astra:** مطلوبة الآن للـdiff الفعلي: تسلسل الـhook وقفل التكرار، ربط الكارت بدون تغيير سلوك `isDemo`، ربط العبوة المختارة بـPOST، الحالات والرسائل، وحدود G5. لا توصية اعتماد مسجّلة بعد.

⛔ STOP — DAY 4 GATE 4 COMPLETE — WAITING FOR OWNER APPROVAL

### 20) Day 4 — Gate 5 Final Review & Handoff (2026-11-19, review/documentation only)

> **إذن:** المالك فوّض **G5 فقط** بعد `B-PUB BACKEND FIX ACCEPTED` و`G3 ACCEPTED` و`G4 ACCEPTED`. نطاق المراجعة: G2/G3/G4/B-PUB والتسليم النهائي لليوم 4. لا implementation، لا G6/Day 5، لا search/cart page/drawer/badge/checkout، لا dependencies/config/build tooling، لا commit/push/deploy. العيوب تُوثَّق ولا تُصلَح داخل G5.
> **مصادر المراجعة:** `frontend/AGENTS.md`، `frontend/docs/DAY4_TASKS.md`، `frontend/docs/PROGRESS.md` §15–19، `backend/docs/BACKEND_PROGRESS.md` §B-PUB، والملفات الفعلية/diff/working tree. **تعديل G5:** `docs/PROGRESS.md` و`docs/DAY4_TASKS.md` فقط؛ لا كود تطبيق.
> **تصنيف الدليل:** SRC = مقروء في المصدر خلال G5؛ AUTO-DOC = نتيجة آلية موثّقة سابقًا ولم يُعَد تشغيلها في G5؛ RUNTIME-DOC = HTTP/API موثّق سابقًا؛ NOT-TESTED = بلا دليل.

**Day 4 overall status:**

| Gate / fix | قرار المالك | نتيجة مراجعة G5 | حالة التسليم |
| --- | --- | --- | --- |
| B-PUB | مقبول صراحةً | SRC مطابق لسياسة القائمة، عقد الرد محفوظ، لا عيوب Critical/Major | مقبول تقنيًا؛ الحالات السلبية NOT-TESTED |
| G2 Catalog | مقبول سابقًا | SRC متوافق مع Gate 2؛ 0 Critical / 0 Major؛ 7 Minor | جاهز للمراجعة النهائية؛ الاعتماد البصري 🟡 |
| G3 PDP | `G3 ACCEPTED` | SRC متوافق مع Gate 3؛ 0 Critical source finding؛ فجوات أدلة | جاهز للمراجعة النهائية؛ HTML/متصفح 🟡 بسبب B-BUILD |
| G4 Selection/Add | `G4 ACCEPTED` | SRC يغطي A1/A2؛ 0 Critical، 1 Major UX، 4 Minor | جاهز للمراجعة النهائية؛ Major يعود لقرار المالك |
| G5 | مفوَّض الآن | التقرير ده + تحديث `DAY4_TASKS.md` | **FINAL HANDOFF READY — WAITING FOR OWNER REVIEW** |
| Day 5 | غير مأذون | لم يُفتح؛ Search/Cart/Drawer/Badge/Update/Remove/Checkout لم تبدأ | مؤجل بالكامل |

**مراجعة الأبواب (SRC + أدلة سابقة):**

| الباب | ما تحقق في المصدر | الأدلة المتاحة | ما لم يتحقق |
| --- | --- | --- | --- |
| G2 | `products/page.tsx` و`metadata.ts`؛ `CatalogSection/Filters/Pagination`؛ `CatalogSkeleton`؛ `catalogQuery`؛ فصل error/empty/out-of-range/success؛ الـURL مصدر الحقيقة؛ breadcrumb مرئي + JSON-LD؛ مفاتيح ar/en متطابقة. | AUTO-DOC: lint/check/tsc EXIT 0؛ RUNTIME-DOC: حالات HTML/API للكتالوج مسجّلة §15–17. | تفاعل متصفح نهائي، back/forward، تبديل لغة مع query، responsive/themes/a11y/reduced-motion، production HTML. |
| G3 | slug validation قبل الاستعلام؛ `PRODUCT_NOT_FOUND` فقط لـ`notFound()`؛ schema عند حد القراءة؛ metadata/canonical/hreflang؛ gallery/bundle/related؛ Product+Offer+Breadcrumb JSON-LD بالعملة الحقيقية. | AUTO-DOC: lint/check 142 files/169 keys، tsc EXIT 0؛ RUNTIME-DOC: 9 slugs 200 + schema، missing slug 404، `currency:"EGP"`، JSON-LD من بيانات حقيقية. | Next-rendered PDP/404 HTML، canonical/hreflang في HTML، `JSON.parse` للـJSON-LD المُخدَّم، controlled 500،الاعتماد البصري/a11y/responsive. |
| G4 | `productPackageId` المختار يصل إلى POST؛ quantity ثابت 1؛ token get-or-create ثم write ثم POST عند الضغط فقط؛ `inFlight` يغطي GET+POST؛ loading/disabled/success/error؛ ProductCard يستخدم نفس الـhook مع حفظ `isDemo` و`needsChoice` و`defaultPackageId`. | AUTO-DOC: lint/check 147 files/169 keys، tsc EXIT 0؛ RUNTIME-DOC: cart GET/POST/refresh و`lineQuantity:"1"` و`selectedPackageAdded:true` و400 `VALIDATION_ERROR`. | Network/double-click فعليان، sold-out runtime، `CART_NOT_ACTIVE`/`PACKAGE_NOT_SALEABLE`، fly/toast مرئيان،الاعتماد البصري/a11y/responsive/reduced-motion. |
| B-PUB | `findFirst` بـ`ACTIVE` ونافذة النشر وأقسام نشطة؛ مسار `PRODUCT_NOT_FOUND` كما هو؛ select/mapping/envelope لم يتغيرا. | AUTO-DOC: backend tsc/build/test EXIT 0 (3 files/24 tests)؛ RUNTIME-DOC: 9 slugs 200، nonexistent 404. | الحالات السلبية الخمس: status != ACTIVE، publishedAt مستقبلي، inactive subcategory/category، لا عبوة active+published. |

**النتائج (Findings):**

- **Critical:** لا يوجد في G2/G3/G4/B-PUB.
- **Major 1 — B-BUILD blocker:** `npm run build` ما زال EXIT 1 بسبب `TurbopackInternalError: [project]/app/globals.css.css [app-client] (css)` و`node process exited ... 0xc0000142` بلا `BUILD_ID`. لذلك لا ختم production-ready ولا ادعاء HTML/متصفح للـPDP/G4. الدليل: `PROGRESS.md` §18–19.
- **Major 2 — G4 fly target UX (SRC):** `components/ECommerce/Product/ProductPackageSelector.tsx:19,28,38` يضع `sourceRef` على حاوية الاختيار كلها، و`hooks/useFlyToCart.ts:36-38,44-69` يستنسخ العنصر كاملًا؛ بينما `components/Card/ProductCard.tsx:27,52` يطيّر الصورة. لم يُرَ في متصفح، لكنه انحراف مرئي محتمل عن سلوك fly-to-cart المطلوب. لم يُصلَح في G5؛ يحتاج قرار مالك/إعادة فتح G4 إن لزم.
- **Minor — G2:** `CatalogSection.tsx:20-23,113-118` out-of-range back يُسقط الفلاتر؛ `CatalogSection.tsx:35-55` breadcrumb مبني يدويًا رغم `lib/jsonld.ts:62-75`؛ `CatalogPagination.tsx:26` aria-label عام؛ `CatalogSection.tsx:57-61` non-null assertions؛ `CatalogSkeleton.tsx:13` 8 كروت مقابل limit 12؛ `catalogQuery.ts:32-37` أرقام ضخمة؛ `products/metadata.ts:11-21` canonical لا يعكس query؛ `catalog.all` غير مستخدم.
- **Minor — G3:** `metadata.ts:19-29` يُصدر canonical/hreflang لمسار المنتج عند فشل/ slug غير صالح؛ `ProductGallery.tsx:18-23` لا يعرض fallback label؛ `ProductDetails.tsx:35` و`ProductBreadcrumb.tsx:18-21` يستخدم raw locale مقابل `isLocale()` في metadata؛ `ProductBreadcrumb.tsx:22-38` breadcrumb يدوي بدل helpers.
- **Minor — G4:** `hooks/useAddToCart.ts:33-34,61-71` لا يُصفّر `isAdded`/`hasError` عند تغيير العبوة خلال 1800ms؛ `lib/cartFeedback.ts:1-16` يكرر حركة `components/Animation/CartBounce.tsx:20-27`؛ `hooks/useAddToCart.ts:54-59` لا يحرس `guestToken` قبل POST (خطر منخفض لأن get-or-create يرجعه دائمًا).
- **Minor — B-PUB/docs:** كل الحالات السلبية مستنتجة من المصدر لا من runtime؛ `list.ts:42` يستخدم `now()` في DB مقابل `new Date()` في `service.ts:25` (انحراف ساعة نظري)؛ `backend/docs/BACKEND_PROGRESS.md:155` ما زال يقول «awaiting Astra review and Owner approval» رغم acceptance المالك. سُجّل ولم يُعدَّل في G5 لأنه خارج نطاق المراجعة/التوثيق المسموح به هنا.

**Git scope/diff hygiene (G5 read-only):**
- `git rev-parse --show-toplevel` → `E:/NODE_JS/Udemy/Training`؛ لا subrepos منفصلة (`frontend` و`backend` داخل نفس الـroot).
- `git status --short --untracked-files=all` بعد كتم ضجيج التحذيرات: **15 modified tracked** و**28 untracked**. Modified: `backend/docs/BACKEND_PROGRESS.md`, `backend/src/modules/store/products/service.ts`, `frontend/app/[locale]/layout.tsx`, `frontend/app/manifest.ts`, `frontend/components/Card/ProductCard.tsx`, `frontend/components/ECommerce/Header/HeaderBrand.tsx`, `frontend/components/ECommerce/WhatsAppFab.tsx`, `frontend/components/shared/BrandLoader.tsx`, `frontend/docs/FRONTEND_TASKS_10_DAYS.md`, `frontend/docs/PROGRESS.md`, `frontend/interface/index.ts`, `frontend/lib/jsonld.ts`, `frontend/lib/server/storeQueries.ts`, `frontend/messages/ar.json`, `frontend/messages/en.json`.
- Untracked: ملفات G2/G3/G4 المقصودة (`components/ECommerce/Catalog/*`, `components/ECommerce/Product/*`, `components/Skelton/{CatalogSkeleton,ProductDetailsSkeleton}.tsx`, `app/[locale]/(Store)/products/**`, `hooks/useAddToCart.ts`, `lib/cartFeedback.ts`, `lib/catalogQuery.ts`, `lib/storeSlug.ts`, `interface/storeProduct.ts`, `validation/{index,storeProduct}.ts`) إضافة إلى `docs/DAY4_TASKS.md` وملفات قديمة/خارج النطاق (`app/icon.svg`, `components/Brand/OmEmanJarIcon.tsx`).
- `git diff --stat` → `15 files changed, 625 insertions(+), 112 deletions(-)` (لا يشمل untracked)؛ `git diff --check` → **EXIT 0** مع تحذيرات CRLF فقط؛ لا `package.json`/lock في الحالة أو diff، ونتيجة G4 الموثّقة أن package diff فارغ.
- ضجيج `git status` السابق كان من مجلدات skill مفقودة تحت `Day7-caching/...`؛ لا تظهر هذه المسارات في الحالة النهائية. لا تعديلات G5 على الكود، لا commit/push/deploy، لا dependencies/backend config/migrations/seed.

**فحوص G5 الختامية بعد توثيق §20 (frontend):**
- `npm run lint` → **EXIT 0**.
- `npm run check` → **EXIT 0** — `Scanned 147 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0**.
- `git diff --check` → **EXIT 0** (مع تحذيرات CRLF معروفة من Git). `npm run build` لم يُعَد تشغيله في G5 التزامًا بنطاق المراجعة وB-BUILD المفتوح.

**KS / blockers / risks at handoff:**
- **KS-1:** منفّذ وموثّق في المصدر/HTML سابقًا؛ الاعتماد البصري النهائي 🟡.
- **KS-2:** منفّذ وموثّق في المصدر/API؛ HTML/متصفح PDP لم يُرَ بسبب B-BUILD؛ الاعتماد 🟡.
- **KS-3:** لم يبدأ؛ Day 5 فقط.
- **B-BUILD:** مفتوح؛ لا production-ready. **B-PUB:** مقبول مع negative cases NOT-TESTED. **B-UNIT:** لا تُعرض `pricePer100g`. **D3-RM:** Day 3 follow-up مستقل. **R-VIS:** مراجعة بصرية/مالك ما زالت مطلوبة.
- **Outstanding risks:** لا دليل متصفح/Network/double-click/RTL/LTR/ثيمات/360px/keyboard/reduced-motion؛ Major fly-target؛ فجوات negative runtime؛ الملفات القديمة خارج النطاق ما زالت في working tree (خصوصًا `WhatsAppFab.tsx` diff التافه).

**Astra final recommendation:**
- لا يوجد Critical source defect يمنع التسليم. B-PUB وG2 وG3 سليمة في المصدر ضمن الأدلة المتاحة؛ G4 تنفّذ عقد A1/A2 في المصدر ومع API حقيقي.
- تُوصي Astra بـ**CONDITIONAL TECHNICAL ACCEPTANCE / FINAL HANDOFF READY FOR OWNER REVIEW** مع الإبقاء على B-BUILD كحاجب إنتاجي، وتسجيل Major fly-target وكل فجوات المتصفح/negative runtime بوضوح. لا تُترجم التوصية إلى اعتماد نهائي؛ القرار للمالك وحده. لا فتح Day 5 قبل إذن منفصل.

⛔ STOP — DAY 4 GATE 5 COMPLETE — FINAL HANDOFF READY — WAITING FOR OWNER REVIEW

---

### 21) Day 5 — Planning & Task Breakdown (2026-11-19, documentation only)

**الحالة:** مكتمل؛ في انتظار مراجعة `Astra` وموافقة `Owner`. لم تُفتح أي Gate من Gates اليوم الخامس، ولم يُنفذ أي عنصر من عناصر Search أو Cart.

**النطاق المسموح:** تخطيط وقراءة/تدقيق فقط. لم يتم تعديل كود تطبيق، ولا كود backend، ولا schema، ولا قاعدة بيانات، ولا تبعيات، ولا إعدادات، ولا إعادة هيكلة، ولا commit/push/deploy.

**ملفات التوثيق في هذه الجلسة:**

- أُنشئ `frontend/docs/DAY5_TASKS.md` ويحتوي: تدقيق Days 1–4، مخزون Search/Cart الحالي والمفقود، العقود الدقيقة، مخزون الملفات المتوقع، backlog مصنف `P0/P1/P2`, خطة `G0–G5` بـ12 حقل إلزامي لكل Gate، جدول مخاطر، قالب تقرير Gate، وقسم مراجعة `Astra`.
- أُلحق هذا القسم `§21` بملف `frontend/docs/PROGRESS.md` دون حذف أو تعديل السجل التاريخي أو STOP الخاص بـDay 4.
- السطور القديمة في أعلى `PROGRESS.md` التي تقول إن Day 4 لم يبدأ أو إن توجد أخطاء TypeScript هي سجل تاريخي تم تجاوزه بالقسمين 15–20 وبـ`DAY4_TASKS.md`؛ لم يتم تغييرها احترامًا للسجل.

**المصادر المعتمدة:**

- `frontend/docs/DAY4_TASKS.md:3,31-33,43-53,237` — الحالة النهائية، عناصر اليوم الخامس المؤجلة، القيود، وSTOP.
- `frontend/docs/PROGRESS.md:1132-1192` — القسم 20، التسليم النهائي لـGate 5 والتوصية المشروطة.
- `frontend/docs/DAY1_TASKS.md`, `DAY2_TASKS.md`, `DAY3_TASKS.md`, `FRONTEND_TASKS_10_DAYS.md:238-243`, `DESIGN_SYSTEM.md`, `AGENTS.md` (frontend/backend/root).
- عقود backend الفعلية: `backend/src/modules/store/search/*` و`backend/src/modules/store/cart/*`.
- التنفيذ الحالي: `store/baseApi.ts`, `store/cartApi.ts`, `store/store.ts`, `lib/cartToken.ts`, `hooks/useAddToCart.ts`, `components/ECommerce/Header/StoreHeader.tsx`, `CartLink.tsx`, `components/Animation/CartBounce.tsx`, `components/Card/ProductCard.tsx`, `lib/routes.ts`, `lib/jsonld.ts`, `interface/store.ts`, `messages/ar.json`, `messages/en.json`.

**نتيجة تدقيق Days 1–4:**

- Day 1 وDay 2 وDay 3 مكتملة تاريخيًا حسب وثائقها، مع ملاحظات `B-PUB`, `B-BUILD`, `R-VIS`, و`HM+`؛ لم يُعد فتحها.
- Day 4 مكتملة من ناحية implementation وGates، مع بقاء ثلاثة عناصر مؤجلة صريحًا هي Search وCart وبعض تحسينات الواجهة المرتبطة، إضافة إلى Majorين لم يُصرح بإصلاحهما: `B-BUILD` وfly-target المكرر في `ProductPackageSelector.tsx:19,28,38`.
- لا يوجد قرار تلقائي بإصلاح أي عنصر مؤجل؛ كل شيء أُدرج في `DAY5_TASKS.md` كـP0/P1/P2 أو Gate ويحتاج موافقة Owner.

**العقود المستعادة دون اختراع:**

- Search: `GET /api/store/search` مع `q`, `limit`, `sessionId`؛ الاستجابة `data.results`, `data.suggestions`, `data.searchLogId`؛Suggestions من `suggest_similar` عند صفر نتائج؛ كل نداء ناجح يكتب `SearchLog`؛ لا endpoint إضافي ولا cache عام جديد. قرار التخزين المؤقت للبحث فقط أُدرج كسؤال/قرار داخل `G1`.
- Cart: `GET /api/store/cart?guestToken=...`, `GET /api/store/cart/:guestToken`, `POST /api/store/cart/:guestToken/items`, `PATCH /api/store/cart/:guestToken/items/:itemId`, `DELETE /api/store/cart/:guestToken/items/:itemId`، و`POST /api/store/cart/merge` خارج النطاق. الرمز `om_cart_token` في `localStorage` فقط؛ `quantity` عدد صحيح في body فقط؛ الأسعار والكميات المعروضة decimal strings؛ `itemsCount` و`subtotal` من backend.
- القيود: لا parallel cart storage، لا إنشاء سلة لمجرد الـbadge، لا حساب إجمالي محلي، لا inversion للعقد، لا كشف guestToken، ولا استخدام منتجات/صور/أسعار وهمية أو ثابتة.

**خطة Gates المقترحة في `DAY5_TASKS.md`:**

| Gate | العنوان | المدخلات/الشرط الأساسي |
|---|---|---|
| `G0` | Pre-flight & Scope Lock | موافقة Owner، سجل نظيف مفهوم، جاهزية API، نطاق مغلق |
| `G1` | Search data & input | فتح عقد Search، إدخال محلي، q/limit/sessionId، قرار cache/SearchLog |
| `G2` | Search UI, page & SEO | صفحة نتائج `/{locale}/search`، suggestions/empty/error، `SearchAction` |
| `G3` | Cart API & badge | ربط cartApi، token، `itemsCount` الحقيقي، حماية fly/bounce/count-up |
| `G4` | Cart page & drawer | `/{locale}/cart`، عرض الأسطر، إضافة/تعديل/حذف، تحسين accessibility |
| `G5` | Final review & handoff | مراجعة Astra، validation، تحديث السجل، STOP |

**قرارات معلقة تتطلب Owner:**

1. هل تُفتح Day 5 بـ`G0` أم يُطلب أولًا حل `B-BUILD` وتأكيد `R-VIS`?
2. هل يُعتمد مسار Search بدون cache في هذه المرحلة لتفادي تضليل `SearchLog`، مع بقاء استراتيجية cache العامة بدون تغيير؟
3. هل تُعتمد إضافة `hooks/useCartToken.ts` و`lib/server/cart.ts` كطبقة قراءة آمنة للـtoken، أم يُعاد استخدام الواجهة الحالية داخل `cartApi.ts` فقط؟
4. هل يُبقى fly-target الحالي في `ProductCard.tsx` كما هو ويُعامل مصدر الطيران في `ProductPackageSelector.tsx` كإصلاح منفصل خارج Day 5، أم يُصرح بإصلاحه في `G3/G4`?
5. هل تُنفذ الإضافات التحسينية `P2` (مثل `Skeleton` و`aria-live`) ضمن Gates الخاصة بكل ميزة أم تُؤجل؟

**Blockers موروثة:**

- `B-BUILD`: فشل Turbopack/build مع `FATAL: An unexpected Turbopack error occurred.`, `app/globals.css.css`, exit code `0xc0000142`, وعدم وجود `BUILD_ID`.
- `R-VIS`: لا يوجد قبول بصري/متصفح كامل لـDay 3/4؛ لا يحق إعطاء 🟢 نهائي.
- dev server على `:3001` ما زال مقفولًا بـPID `20596`؛ لا يُوقف بدون إذن.
- backend `:3002` كان يعمل سابقًا بـPID `7228`؛ يجب التحقق قبل أي smoke test حقيقي في `G0/G1/G3`.

**الفحوص المنفذة في هذه الجلسة:**

- `npm run lint` → EXIT 0.
- `npm run check` → EXIT 0؛ `Scanned 147 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → EXIT 0.
- `git diff --check` → EXIT 0 مع تحذيرات CRLF فقط.
- `git diff --stat` → نفس التعديلات التاريخية الـ15 ملفًا (`687 insertions(+), 112 deletions(-)`)؛ لا تعديلات كود جديدة من هذه الجلسة.
- `git status --short` → `DAY5_TASKS.md` يظهر كملف جديد غير متعقّب، و`PROGRESS.md` معدّل بهذا القسم فقط؛ بقية التعديلات/الملفات غير المتعقّبة تعود لـDays 1–4.
- لم يُعاد تشغيل build بسبب `B-BUILD` المعروف وخروجه عن نطاق التخطيط.

**مراجعة Astra المطلوبة:**

- هل `DAY5_TASKS.md` يغطي كل عناصر `D5-SEARCH`/`D5-CART` وقيود `DAY4_TASKS.md:31-33,50-51` دون زيادة نطاق؟
- هل العقود المكتوبة تطابق backend فعليًا ولا تحتوي أسماء endpoints أو حقول مخترعة؟
- هل ترتيب Gates وتبعيتها آمن، خصوصًا `G1` قبل `G2` و`G3` قبل `G4`؟
- هل المسائل المعلقة موضوعة بشكل واضح أمام Owner دون اتخاذ قرار نيابة عنه؟
- هل أي عنصر `P1/P2` يجب رفعه إلى `P0` قبل الموافقة؟

⛔ STOP — DAY 5 PLANNING COMPLETE — WAITING FOR OWNER APPROVAL

---

### 22) Day 5 — Gate 0 Pre-flight & Scope Lock (G0 only)

**الإذن:** المالك طلب البدء في اليوم الخامس. فُهم كإذن لـ`G0` فقط حسب بروتوكول الـGates؛ لم يُفتح `G1/G2/G3/G4/G5`.

**النطاق:** قراءة/تحقق/توثيق فقط. لا تعديلات مصدر، لا UI، لا API edits، لا إصلاح build، لا DB/seed/migration، لا commit/deploy. الملف الوحيد المعدّل في G0 هو `frontend/docs/PROGRESS.md`.

**انحراف قبل G0 (مسجّل ضمن الـbaseline):** أثناء حل مشكلة `npm run dev` قبل فتح G0 أُضيف `export const instant = false;` في `app/[locale]/layout.tsx:36` ومُسح كاش `.next/dev` وشُغّل backend/frontend. الملف ظاهر نظيف في git وقت G0، والسطر موجود في الـbaseline. ده مش تغيير داخل G0.

**الملفات المقروءة:** `AGENTS.md` (root/frontend/backend)، `docs/PROGRESS.md` §21، `docs/DAY5_TASKS.md` §7 G0 + §10، `backend/src/modules/store/search/{validation.ts,service.ts}`، `backend/src/modules/store/cart/{routes.ts,validation.ts,types.ts}`، `backend/src/modules/store/settings/service.ts`، `app/[locale]/layout.tsx`، `lib/server/storeFetch.ts`، `lib/imageLoader.ts`.

**Git baseline (وقت G0):**

- `git status --short`: ثلاثة ملفات معدّلة موروثة ولم تُلمس في G0:
  - `Om-Eman/backend/docs/BACKEND_PROGRESS.md`
  - `Om-Eman/backend/src/modules/store/products/service.ts`
  - `Om-Eman/frontend/components/Animation/BackToTop.tsx`
- لا تعديلات `package.json`/`package-lock.json`، لا dependencies جديدة، لا untracked docs إضافية.
- `git diff --check` → EXIT 0 مع تحذيرات CRLF فقط.
- `git diff --stat` → `3 files changed, 31 insertions(+), 5 deletions(-)`.

**الفحوص:**

- `npm run lint` → EXIT 0.
- `npm run check` → EXIT 0؛ `Scanned 147 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → EXIT 0.
- `git diff --check` → EXIT 0.
- لم يُعاد تشغيل `npm run build`؛ `B-BUILD` يبقى مسجّلًا ولم يُعالج.

**المنافذ والحالة الحية:**

- فحص G0 الحالي على `:3001` و`:3002`: لا يوجد LISTENING؛ السيرفرات المتعلقة بحل مشكلة dev توقفت.
- دليل حي سابق في نفس الجلسة قبل G0: frontend `Ready in 3.3s`، `/ar` و`/en` رجعوا HTTP 200، backend سجّل `Database connection established` و`API listening on port 3002`، و`settings/categories/featured` رجعوا HTTP 200.
- القرار: العقود **صالحة من المصدر**، لكن الـlive smoke **محجوب حاليًا** حتى تُعاد المنافذ بإذن Gate لاحق. HTTP 200 السابق ليس اعتمادًا نهائيًا.

**تأكيد العقود من المصدر:**

| العقد | الدليل | الحكم |
| --- | --- | --- |
| Search query | `search/validation.ts:4-6`: `q` 1–200، `limit` 1–50 default 20، `sessionId` 5–100 optional | ✅ صالح |
| Search response | `search/service.ts:29-33`: `results/suggestions/searchLogId`؛ `:75-78` suggestions عند صفر نتائج؛ `:85-96` كتابة `SearchLog` | ✅ صالح |
| Cart routes | `cart/routes.ts:19-24`: get-or-create، get-by-token، add، patch، delete؛ merge مستبعد | ✅ صالح |
| Cart validation | `cart/validation.ts:3-14`: token `[A-Za-z0-9_-]{20,64}`، `quantity` 1–1000 number | ✅ صالح |
| Cart response | `cart/types.ts:25-39`: `itemsCount: number`، `subtotal: string`، lines/package snapshot من الباك | ✅ صالح |
| Free shipping | `settings/service.ts:107-110`: `freeShippingThreshold` من `FREE_SHIPPING_THRESHOLD` كـ`string | null` | ✅ صالح؛ لا رقم افتراضي |

**القرارات المعلقة للمالك قبل G1:**

1. هل يُعتمد مسار Search بدون cache لتفادي إخفاء `SearchLog`، مع عدم تغيير استراتيجية الكاش العامة؟
2. هل يُعتمد حجب مؤشر الشحن المجاني عندما يكون `freeShippingThreshold = null`؟
3. هل تتوفر بيئة اختبار كتابة مأذونة للسلة؛ وإلا تظل PATCH/DELETE `NOT-TESTED`؟
4. هل يبقى fly-target الحالي خارج نطاق اليوم الخامس؟
5. هل تؤجل تحسينات `P2` لما بعد Gates الأساسية؟
6. هل نؤجل كل تغييرات `Styles/Animation` الجديدة (Fly للسلة، Hover، الثيمات) لمرحلة منفصلة بعد بناء ملفات الـarchitecture، وبإذن مستقل، حسب تفضيلك في `AGENTS.md`؟

**حالة Blockers:** `B-BUILD` مفتوح؛ `R-VIS` مفتوح؛ `R-API` مفتوح حاليًا؛ `R-CART-WRITE` محجوب؛ `R-FREE-SHIP` محلول بالمصدر بشرط عدم اختراع رقم؛ `R-G4-MAJOR` خارج النطاق؛ `R-STYLE-ANIM` محجوب حتى مرحلة منفصلة، مع TailwindCSS فقط لا Sass.

**DoD:** baseline مؤرّخ ✅؛ عقود صالحة من المصدر ✅؛ live smoke محجوب ⛔؛ blockers مسجّلة ✅. G0 مغلق إداريًا، لكن الانتقال إلى G1 يحتاج إذن منفصل.

**مراجعة Astra المطلوبة:** مراجعة هذا السجل مقابل `DAY5_TASKS.md` G0؛ التأكد إن مفيش implementation افتتحت، وإن الانحراف قبل G0 موثّق، وإن قرار المقارنة بين cache/SearchLog لسه بانتظار المالك.

⛔ STOP — Gate 0

---

### 23) Day 5 — Gate 1: Search Data & Inputs (G1 only)

**الإذن:** إذن مالك صريح باسم `Gate 1 — Search: Data & Inputs`. لم يُفتح `G2/G3/G4/G5`.

**النطاق المنفّذ:** تطبيع مدخلات البحث، Zod للمدخل والرد، أنواع البحث، استعلام سيرفر غير cached، ومسار البحث. لا UI، لا هيدر، لا صفحة، لا ترجمات، لا JSON-LD، لا أنيميشن، لا باك/DB، لا dependencies، لا commit.

**الملفات الفعلية (9):**

| الملف | الحالة | المسؤولية |
| --- | --- | --- |
| `frontend/lib/searchQuery.ts` | جديد | تطبيع `q/limit` من `unknown`، إرجاع `q: null` للمدخل غير الصالح، وبناء `store/search?...` |
| `frontend/validation/storeSearch.ts` | جديد | `searchTextSchema`، `searchLimitSchema`، `searchQuerySchema`، و`storeSearchResponseSchema` المبني على `productCardSchema` |
| `frontend/validation/index.ts` | تعديل | تصدير مخططات البحث و`productCardSchema` |
| `frontend/validation/storeProduct.ts` | تعديل | تصدير `productCardSchema` الموجود بدل تكراره؛ انحراف ضروري عن قائمة الملفات المتوقعة |
| `frontend/interface/store.ts` | تعديل | `IStoreSearchResultRow extends IStoreProductCard` و`IStoreSearchResult` |
| `frontend/interface/index.ts` | تعديل | تصدير نوعي البحث |
| `frontend/lib/server/storeQueries.ts` | تعديل | `getStoreSearch(q, limit)` عبر `storeFetch` + تحقق Zod للرد؛ بدون `"use cache"`/`cacheTag`/`cacheLife` |
| `frontend/lib/routes.ts` | تعديل | `SEARCH_PATH` و`searchHref(q)` |
| `frontend/docs/PROGRESS.md` | تعديل | هذا التقرير |

**ملفات موروثة لم تُلمس:** `backend/docs/BACKEND_PROGRESS.md`، `backend/src/modules/store/products/service.ts`، `frontend/components/Animation/BackToTop.tsx`.

** Implemented in source / منفّذ فعليًا:**
- `q`: يُقطع، ويُقبل فقط بطول 1–200؛ الغائب/الفارغ/الأطول يعطي `q:null` و`isValid:false` فلا يتكوّن مسار API.
- `limit`: int من 1 إلى 50، والافتراضي 20؛ القيم الخاطئة ترجع للافتراضي ولا تُرسل كما هي.
- المدخلات على شكل مصفوفة (Next `searchParams`) تُقرأ كأول قيمة نصية فقط.
- `getStoreSearch` يتحقق من المدخل مرة ثانية بـZod، يبني المسار عبر `buildStoreSearchPath`، ويمرّر فشل `storeFetch` كما هو دون تحويله إلى `[]`.
- رد البحث يُتحقق منه بـ`storeSearchResponseSchema`؛ أي شكل غير متطابق يعطي `{ ok:false, code:"INVALID_RESPONSE" }`.
- لا كاش تطبيقي للبحث: لا `"use cache"` ولا tags ولا cacheLife داخل `getStoreSearch`؛ استراتيجية الكاش العامة unchanged.

** Automatically verified / فحوص آلية:**
- `npm run lint` → EXIT 0.
- `npm run check` → EXIT 0؛ `Scanned 149 code files, 169 message keys per locale. 0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → EXIT 0.
- `git diff --check` → EXIT 0؛ تحذيرات CRLF فقط.
- Local normalization test (`tsx`) نتائجه:
  - `valid-ar`: q=`كمون`, limit=20, path=`store/search?q=%D9%83%D9%85%D9%88%D9%86&limit=20`.
  - `valid-en`: q=`cumin`, limit=50, path=`store/search?q=cumin&limit=50`.
  - `missing-q` / `empty-q` / `long-q` (201): `q:null`, `isValid:false`, `apiPath:null`.
  - `bad-limit` (`0`): limit=20 وpath صالح.
  - `array-q`: أول قيمة تُستخدم والباقي يُتجاهل.

** API smoke against backend `:3002`:**
- الباك شُغّل مؤقتًا بـ`npm run dev`، وسجّل `Database connection established` و`API listening on port 3002`، ثم أُوقف بعد الاختبارات؛ لا secrets في التقرير.
- `GET /api/store/search?q=كمون&limit=20` → HTTP 400، `code: DB_CONSTRAINT_ERROR`.
- `GET /api/store/search?q=cumin&limit=20` → HTTP 400، `code: DB_CONSTRAINT_ERROR`.
- `GET /api/store/search?q=zzzznotfound&limit=20` → HTTP 400، `code: DB_CONSTRAINT_ERROR`.
- `GET /api/store/search?q=&limit=20` → HTTP 400، `code: VALIDATION_ERROR`.
- `GET /api/store/search?q=<201 chars>&limit=20` → HTTP 400، `code: VALIDATION_ERROR`.
- سجل الباك أظهر لثلاثة استعلامات صحيحة `Prisma error target=$queryRaw`؛ رسالة Postgres التفصيلية غير ظاهرة في السجل المُطهّر. لم يُصلح الباك أو DB لأن ذلك خارج G1 صراحةً.
- النتيجة: مسار الـfailure يعمل ويمكن تمييزه عن empty result في الكود، لكن **شكل الرد الحقيقي، أنواع الأسعار، وسلوك suggestions عند صفر نتائج لم تُتحقق حيًا** بسبب هذا الـblocker.

** Browser-tested / شوهد في متصفح:** لا شيء؛ G1 بلا شاشة حسب النطاق.

** Owner-approved status:** إذن تنفيذ G1 فقط؛ لا اعتماد نهائي للبحث ولا انتقال لـG2.

** Deviations / blockers / untested:**
- انحراف واحد: تصدير `productCardSchema` لتفادي تكرار مخطط بطاقة المنتج.
- `R-API-SEARCH`: مفتوح؛ الـbackend يرد `DB_CONSTRAINT_ERROR` على الأسئلة الصحيحة. يلزم فحص بيئة DB/dual SQL functions في تكليف منفصل؛ لا تعديل هنا.
- الكتابة المباشرة في `SearchLog` والتأكد من عدم كبحها بالكاش: محقق ثابتًا بالكود (لا cache)، و**غير مؤكد حيًا** لأن الطلبات لم تنجح.
- schema الرد مقابل بيانات 200 حقيقية: `NOT-TESTED`.
- `npm run build` لم يُشغّل في G1 لأنه ليس ضمن أوامر التحقق المطلوبة؛ `B-BUILD` ما زال مسجّلًا.
- لا مخرجات `console.log` أو secrets أو توكنز في هذا التقرير.

**مراجعة الـdiff:** رُوجع `git status --short` و`git diff` كاملًا مع قراءة الملفين الجديدين غير المتتبعين؛ كل التغييرات داخل نطاق G1 عدا الانحراف الموثّق والملفات الموروثة غير الملموسة.

**Astra review:** جاهز للمراجعة مع تسجيل `R-API-SEARCH` صراحةً كـblocker حي لا يمنع مراجعة الكود.

⛔ STOP — Gate 1

---

### 24) Day 5 — Gate 2: Search Header, Results Page & SEO (G2 only)

**الإذن:** إذن مالك صريح باسم `Gate 2 — Search: Header, Results Page & SEO`. G1 اعتُبر مقبولًا للانتقال فقط؛ لم يُفتح G3/G4/G5. لا cart، لا checkout، لا backend/DB، لا dependencies، لا commit/push/deploy.

**Preflight:** قُرئت `frontend/AGENTS.md` (لا يوجد `AGENTS.md` في جذر Workspace)، `PROGRESS.md` §23، `DAY5_TASKS.md` §§3/4/5.1/7/9، `git status --short`، وحالة G1 المصدرية. فُحصت فعليًا: `StoreHeader`، مسارات `(Store)`، `ProductCard`، `FeaturedGrid`، `EmptyState`/`ErrorState`، `Skeleton`، `Header` primitives، `seo/jsonld/JsonLd/StoreJsonLd`، `messages/ar.json` و`messages/en.json`، `storeFetch/storeQueries/searchQuery/storeSearch`، و`package.json`. لم تبدأ أي تعديلات قبل تحليل الملفات ومسؤولياتها.

**الملفات الفعلية (14):**

| الملف | الحالة | المسؤولية |
| --- | --- | --- |
| `frontend/components/ECommerce/Header/SearchForm.tsx` | جديد | نموذج GET مصغّر: `q` محلي، تحقق Zod عبر `searchTextSchema`، تنقّل محلي عبر `searchHref`، aria/i18n |
| `frontend/components/ECommerce/Header/StoreHeader.tsx` | تعديل | تركيب `SearchForm` مع الحفاظ على البراند/اللغة/الثيم/السلة؛ سطر ثانٍ كامل على الموبايل |
| `frontend/app/[locale]/(Store)/search/page.tsx` | جديد | صفحة رفيعة: `setRequestLocale` + تطبيع `searchParams` + `Suspense` + `SearchSection` |
| `frontend/app/[locale]/(Store)/search/metadata.ts` | جديد | `generateMetadata` مع `q` محفوظ في canonical/title/description و`noindex` |
| `frontend/app/[locale]/(Store)/search/loading.tsx` | جديد | يعيد استخدام `SearchSkeleton` |
| `frontend/components/ECommerce/Search/SearchSection.tsx` | جديد | يقرأ `getStoreSearch` ويوزّع الحالات؛ H1 واحد؛ لا fetch داخل JSX |
| `frontend/components/ECommerce/Search/SearchResults.tsx` | جديد | شبكة نتائج/اقتراحات بنفس `ProductCard`؛ عنوان اختياري للاقتراحات |
| `frontend/components/ECommerce/Search/SearchState.tsx` | جديد | يختار بين `EmptyState` و`ErrorState` المشتركين |
| `frontend/components/Skelton/SearchSkeleton.tsx` | جديد | skeleton بنفس أبعاد شبكة النتائج/الاقتراحات |
| `frontend/lib/jsonld.ts` | تعديل | `buildWebSiteJsonLd` يضيف `potentialAction` من نوع `SearchAction` بالمسار الممرّر |
| `frontend/components/ECommerce/StoreJsonLd.tsx` | تعديل | يمرّر `SEARCH_PATH` إلى `buildWebSiteJsonLd`؛ لا حقن JSON-LD مكرر في صفحة البحث |
| `frontend/messages/ar.json` | تعديل | namespace `search` (16 مفتاحًا) |
| `frontend/messages/en.json` | تعديل | نفس مفاتيح `search` بالإنجليزية |
| `frontend/docs/PROGRESS.md` | تعديل | هذا التقرير |

**ملفات موروثة لم تُلمس:** `backend/docs/BACKEND_PROGRESS.md`، `backend/src/modules/store/products/service.ts`، `frontend/components/Animation/BackToTop.tsx`، `components/Card/ProductCard.tsx`، `components/ECommerce/Home/FeaturedGrid.tsx`، `package.json`، lockfiles، `next.config.ts`.

** Implemented in source / منفّذ فعليًا:**
- الهيدر فيه بحث ظاهر: حقل كامل العرض على الموبايل، ومساحة وسطى على الديسكتوب، بدون تغيير عناصر الهيدر الأصلية.
- الإرسال يمنع الـnavigation الافتراضي، يتحقق من `q` بطول 1–200، ويعرض `role="alert"` عند الخطأ؛ الرابط الناتج `/{locale}/search?q=...` عبر `@/i18n/navigation`.
- صفحة النتائج تقرأ `q/limit` غير الموثوقين عبر G1 `normalizeSearchQuery`؛ لا slug special-case ولا مصدر اقتراحات محلي.
- النتائج والاقتراحات كلاهما من رد الـAPI؛ عند `results.length === 0` ووجود `suggestions` تُعرض رسالة empty ثم شبكة الاقتراحات بنفس `ProductCard`.
- الفشل (network/500/INVALID_RESPONSE/مدخل غير صالح) يروح لـ`ErrorState` حقيقي؛ لا تحويل للفشل إلى `[]` ولا بيانات وهمية.
- لا `"use cache"` ولا `cacheTag` ولا `cacheLife` أُضيفت للبحث؛ `SearchLog` ما زال محكومًا بسلوك الباك.
- `q` محفوظ في canonical وtitle وdescription؛ كل صفحات البحث `noindex, nofollow` لتجنب فهرسة نتائج فارغة/فاشلة مؤقتًا.
- `WebSite.SearchAction` يستخدم `${SITE_URL}/${locale}/search?q={search_term_string}` ويُحقن مرة واحدة عبر `StoreJsonLd` الموجود.
- لم تُضف حركات أو تغييرات بصرية جديدة التزامًا بـ`R-STYLE-ANIM`؛ استُخدمت Tailwind tokens الحالية فقط.

** Automatically verified / فحوص آلية:**
- `npm run lint` → `LINT_EXIT=0`.
- `npm run check` → `CHECK_EXIT=0`؛ `Scanned 157 code files, 185 message keys per locale.`؛ `0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `TSC_EXIT=0`.
- `git diff --check` → `DIFF_CHECK_EXIT=0`؛ تحذيرات CRLF فقط.
- `npm run build` → `BUILD_EXIT=0`؛ `Compiled successfully`، TypeScript انتهى، `26/26` static pages، والمسارات `ƒ /ar/search` و`ƒ /en/search` ظهرت في جدول Build. `B-BUILD` لم يتكرر في هذه الجولة، لكن الختم النهائي ما زال شأن G5.
- أثناء الـbuild ظهرت `NETWORK_ERROR` لقراءات المتجر لأن الباك كان متوقفًا؛ لم يمنع الـbuild.

** HTML/SSR checks / شوهد فعليًا (لا متصفح كامل):**
- شُغّل باك مؤقتًا `:3002` PID `43804` (`g2-backend.out.log`) وfrontend production `:3001` PID `16636` (`g2-frontend.out.log`) ثم أُوقفا؛ لا secrets في التقرير.
- `/ar/search?q=كمون` → HTTP 200، H1 واحد `نتائج البحث عن «كمون»`، ErrorState عربي ظاهر، canonical `.../ar/search?q=%D9%83%D9%85%D9%88%D9%86`.
- `/en/search?q=cumin` → HTTP 200، H1 واحد `Results for "cumin"`، ErrorState إنجليزي ظاهر، canonical `.../en/search?q=cumin`.
- `/ar/search` و`/en/search?q=` → HTTP 200، invalid state ظاهر، canonical بدون `q`.
- كل الحالات: `noindex, nofollow` موجود، `WebSite` JSON-LD واحد فقط، كل سكربتات JSON-LD قابلة لـ`JSON.parse`، و`potentialAction.target` محلي باللغة الصحيحة.
- إعادة فحص نهائية بعد إضافة `method="get"` على النموذج (`g2-final-frontend.out.log`) أكدت نفس النتائج ووجود `method="get"` في HTML.
- مع الباك شغّال، الـerror state كان ناتجًا حقيقيًا عن `R-API-SEARCH`؛ ومع الباك متوقف كان `NETWORK_ERROR`. لا فرق في واجهة المستخدم بين الحالتين.

** API status / R-API-SEARCH:**
- `GET /api/store/search?q=كمون&limit=20` → HTTP 400 `DB_CONSTRAINT_ERROR`.
- `GET /api/store/search?q=cumin&limit=20` → HTTP 400 `DB_CONSTRAINT_ERROR`.
- `GET /api/store/search?q=zzzznotfound&limit=20` → HTTP 400 `DB_CONSTRAINT_ERROR`.
- لذلك: **real results/suggestions/zero-result من بيانات حقيقية لم تُتحقق**؛ الذي تحقق هو مسار الخطأ الحقيقي وعدم تحويله إلى empty مزيف.

** Implemented but not fully verified / غير مكتمل التحقق:**
- back/forward، Tab/Enter/focus-visible، 360px مقابل desktop، الثيمات الأربعة، `prefers-reduced-motion`، وعدم overflow أفقي: لم تُختبر بمتصفح حقيقي في هذه الجولة.
- SSR أظهر H1 والرسائل في HTML، لكن الاعتماد البصري النهائي ما زال 🟡 حتى موافقة المالك.
- لا وقت جريان فعلي لـSearchLog لأن الطلبات لم تنجح (موروث من G1).

** Deviations / انحرافات:**
- `metadata.ts` بدل `metadata.tsx` المتوقع في جدول §5.1، اتباعًا لاتفاق `products/metadata.ts` الحقيقي.
- لم يُنشأ `SearchSuggestions.tsx` منفصل؛ `SearchResults` يعرض النتائج والاقتراحات بنفس المسؤولية (شبكة بطاقات + عنوان اختياري) لتفادي تكرار `ProductCard`.
- `isNoIndex: true` لكل صفحات البحث قرار SEO تحفّظي من G2 لتفادي canonical مضلل عند الفشل/الفراغ؛ يمكن مراجعته مع Astra.
- لا تغييرات في dependencies أو lockfiles؛ لا backend/DB؛ لا تعديلات خارج نطاق G2 عدا الملفات الموروثة غير الملموسة.

**مراجعة الـdiff:** رُوجع `git status --short` و`git diff --stat` و`git diff` للملفات المعدّلة مع قراءة كل الملفات الجديدة غير المتتبعة؛ لا package/lock changes، ولا تعديلات لـCard أو FeaturedGrid أو ProductCard أو build tooling.

**مراجعة Astra المطلوبة:** راجع تقسيم الملفات، RTL/Logical classes، سلامة metadata/JSON-LD، وتمييز «Implemented» عن «HTML-visible» عن «Blocked by R-API-SEARCH». الاعتماد البصري النهائي للمالك منفصل.

⛔ STOP — Gate 2

---

### 25) Day 5 — Gate 3: Cart API & Header Badge (G3 only)

**الإذن:** إذن مالك صريح باسم `Gate 3 — Cart API & Header Badge`. G2 اعتُبر مكتملًا للترتيب فقط؛ لم تُعد كتابة G2، ولم يُفتح G4/G5. لا page/drawer/cart slice/cookie، لا backend/DB/migration، لا dependencies، لا commit/push/deploy.

**Preflight:** قُرئت `frontend/AGENTS.md` و`backend/AGENTS.md`، `DAY5_TASKS.md` §§3.3/5.2/Gate 3، `PROGRESS.md` §24، ثم فُحصت فعليًا: `store/cartApi.ts`، `store/baseApi.ts`، `interface/api.ts`، `store/store.ts`، `lib/cartToken.ts`، `hooks/useAddToCart.ts`، `lib/cartFeedback.ts`، `components/Animation/CartBounce.tsx`، `components/Animation/CountUp.tsx`، `components/ui/Badge.tsx`، `Providers/ThemeProvider.tsx`، `components/ECommerce/Header/CartLink.tsx`، وbackend `cart/{routes,controller,validation,types,service}.ts`. سُجّل `git status --short` قبل التعديل؛ الملفات الموروثة غير الملموسة بقيت كما هي.

**الملفات الفعلية (8):**

| الملف | الحالة | المسؤولية |
| --- | --- | --- |
| `frontend/store/cartApi.ts` | تعديل | `getCartByToken` للقراءة فقط + `updateCartItem` + `removeCartItem` مع نفس tag `Cart/CURRENT` |
| `frontend/lib/cartToken.ts` | تعديل | subscription آمن للـ`localStorage` دون تغيير `KEY` أو قيمة الكتابة |
| `frontend/hooks/useCartToken.ts` | جديد | قراءة التوكن عبر `useSyncExternalStore` وتجاهل الشكل غير الصالح |
| `frontend/hooks/useCartBadge.ts` | جديد | اشتقاق `itemsCount/isEmpty/isReady/hasError` من قراءة السلة بالتوكن فقط |
| `frontend/components/ECommerce/Header/CartLink.tsx` | تعديل | badge من `itemsCount` مع `CountUp` و`CartBounce` و`data-cart-target` واحد |
| `frontend/messages/ar.json` | تعديل | مفتاح `header.cartItems` واحد |
| `frontend/messages/en.json` | تعديل | نفس المفتاح بالإنجليزية |
| `frontend/docs/PROGRESS.md` | تعديل | هذا التقرير |

**ملفات موروثة لم تُلمس:** `backend/docs/BACKEND_PROGRESS.md`، `backend/src/modules/store/products/service.ts`، `frontend/components/Animation/BackToTop.tsx`، كل ملفات G2، `package.json`، lockfiles، `next.config.ts`.

** Implemented in source / منفّذ فعليًا:**
- الـbadge يستخدم `GET /store/cart/:guestToken` فقط؛ لا يستدعي `getOrCreateCart`، لذلك في غياب التوكن ما فيش طلب API ولا إنشاء سلة.
- شكل التوكن مقيد بـ`/^[A-Za-z0-9_-]{20,64}$/`؛ التوكن غير الصالح يُعتبر غائبًا ولا يُرسل.
- `writeCartToken` يحتفظ بـ`KEY = om_cart_token` والقيمة المكتوبة، ويضيف إشعارًا محليًا + `storage event` للتحديث عبر التبويبات.
- `getServerCartToken` يرجع `undefined` لمنع hydration mismatch؛ لا قراءة `localStorage` أثناء render مباشرةً.
- `useAddToCart` لم يتغير؛ تسلسل GET→writeToken→POST و`inFlight` كما كان.
- `itemsCount` يأتي من الباك كما هو؛ لا حساب بديل، لا رقم وهمي، والـbadge مخفي حتى وصول بيانات صالحة وغياب خطأ.
- `CountUp` يستمر في عرض القيمة النهائية SSR/لـreduced-motion؛ `CartBounce` يبقى المالك الوحيد لـ`data-cart-target`.
- `role="status"` و`aria-label` مترجمان؛ تم استخدام `-end-1` بدل `right` للتوافق مع RTL.
- لا أنيميشن جديد outside scope؛ استُخدمت primitives/al wrappers الموجودة فقط.

** Automatically verified / فحوص آلية:**
- `npm run lint` → `LINT_EXIT=0`.
- `npm run check` → `CHECK_EXIT=0`؛ `Scanned 159 code files, 186 message keys per locale.`؛ `0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `TSC_EXIT=0`.
- `git diff --check` → `DIFF_CHECK_EXIT=0`؛ تحذيرات CRLF فقط.
- `npm run build` → `BUILD_EXIT=0`؛ `Compiled successfully`، TypeScript انتهى، `26/26` static pages. ظهرت `NETWORK_ERROR` لقراءات المتجر لأن الباك كان متوقفًا أثناء الـbuild؛ لم تمنع البناء. `B-BUILD` لم يتكرر، والختم النهائي ما زال G5.

** API smoke against backend `:3002`:**
- شُغّل backend مؤقتًا بـ`npm run dev`، سجّل `Database connection established` و`API listening on port 3002`، ثم أُوقف؛ لا توكنز حقيقية ولا secrets في التقرير.
- `GET /api/store/cart/short` → HTTP 400 `VALIDATION_ERROR` مع رسالة `guest token is invalid`؛ هذا يثبت رفض التوكن القصير قبل أي DB access.
- توكن صناعي صحيح الشكل غير موجود → HTTP 400 `DB_CONSTRAINT_ERROR` من `cart.findUnique`؛ لذلك **`CART_NOT_FOUND` لم يتحقق حيًا** في هذه البيئة.
- غياب التوكن: لا طلب API من الـhook (مُثبت بالكود via `skip`)؛ لم يُختبر بمتصفح.
- وجود توكن حقيقي لسلة موجودة: `NOT-TESTED` لغياب بيئة قراءة مأذونة ولـ`DB_CONSTRAINT_ERROR` أعلاه.

** Browser-tested / شوهد في متصفح:** لا شيء؛ لا توجد أداة browser automation في هذه الجولة. ظهور الـbadge بعد إضافة حقيقية، وبعد reload/hydration، والمراجعة البصرية لـRTL/Actions كلها `NOT-TESTED`.

** Owner-approved status:** إذن تنفيذ G3 فقط؛ لا اعتماد بصري، لا انتقال لـG4.

** Deviations / blockers / untested:**
- انحراف وظيفي محدود: أُضيفت `subscribeCartToken/getServerCartToken` إلى `lib/cartToken.ts`؛ المفتاح والقيمة لم يتغيرا.
- انحراف توثيقي: استُخدم `Badge` و`CountUp` الموجودان بدل مكوّن badge جديد لتفادي تكرار markup.
- عقود `IStoreCart` ما زالت محلية في `cartApi.ts` كما في Day 4؛ لم تُنقل إلى `interface/cart.ts` لأن النقل يحتاج موافقة صريحة.
- رد الـAPI يُفكّ عبر `unwrapEnvelope` كما في الكود الحالي؛ لا Zod schema جديد للسلة في G3. backlog محتمل لـAstra.
- `updateCartItem/removeCartItem` منفّذان في طبقة API فقط؛ لا مستهلك UI ولا اختبار كتابة في G3 (G4/R-CART-WRITE).
- `R-CART-WRITE` ما زال مفتوحًا؛ `R-API-SEARCH` و`R-VIS` لم يتغيرا؛ `B-BUILD` لم يتكرر لكن الختم النهائي G5.

**مراجعة الـdiff:** رُوجع `git status --short` و`git diff` للملفات المعدّلة مع قراءة الملفين الجديدين غير المتتبعين؛ `git diff --no-index` أعطى exit 1 لأنها ملفات جديدة، وهذا متوقع. لا package/lock changes، ولا تعديلات لملفات G2 أو backend أو build tooling.

**مراجعة Astra المطلوبة:** راجع سلامة subscription/SSR، منع أي GET عند غياب/بطلان التوكن، ثبات `data-cart-target` واحد، استخدام `itemsCount` فقط، وتمييز «Implemented» عن «API-smoked» عن «NOT-TESTED». الاعتماد البصري النهائي للمالك منفصل.

⛔ STOP — Gate 3

---

### 26) Day 5 — Gate 4: Cart Page & Drawer (G4 only)

**الإذن:** إذن مالك صريح باسم `DAY 5 — GATE 4: CART PAGE & DRAWER IMPLEMENTATION — APPROVED — Start G4 only.` فُتح `G4` فقط؛ لم يُفتح `G5`، ولم يُعاد فتح `G1/G2/G3`. لا checkout، لا هيدر/new CartLink، لا backend/DB، لا dependencies، لا commit/push/deploy.

**Preflight:** قُرئت `frontend/AGENTS.md` و`backend/AGENTS.md` و`DAY5_TASKS.md` §G4 و`PROGRESS.md` §25. لا يوجد `AGENTS.md` في جذر Workspace. فُحصت فعليًا: `store/cartApi.ts`، `store/baseApi.ts`، `lib/cartToken.ts`، `hooks/useCartToken.ts`، `hooks/useCartBadge.ts`، backend `cart/{routes,validation,types,service}.ts`، `settings/service.ts`، `lib/server/storeQueries.ts`، `components/ECommerce/Search/SearchSection.tsx`، `components/shared/{PriceTag,StoreImage,EmptyState,ErrorState}.tsx`، `components/Animation/CountUp.tsx`، `components/ui/Button.tsx`، `messages/{ar,en}.json`، و`scripts/check-rules.mjs`. سُجّل `git status --short`/`git diff --stat` قبل التعديل؛ baseline كان dirty بالملفات الموروثة ولم يُلمس منها شيء داخل G4.

**عقود مؤكدة من المصدر:**
- `GET /store/cart/:guestToken` يقرأ سلة موجودة فقط؛ `guestToken` مقيد بـ`/^[A-Za-z0-9_-]{20,64}$/`.
- `PATCH /store/cart/:guestToken/items/:itemId` و`DELETE .../:itemId` يستخدمان نفس الـtoken ونفس الـtag `Cart/CURRENT`; `quantity` عدد صحيح 1–1000.
- `itemsCount` و`subtotal` يأتيان من الباك؛ السلة تُعرض من `data.lines` كما هي.
- `freeShippingThreshold` يأتي من `getStoreSettings()`؛ `null` يعني إخفاء المؤشر، بلا رقم افتراضي.
- أخطاء `CART_NOT_FOUND` و`CART_NOT_ACTIVE` و`CART_ITEM_NOT_FOUND` و`PACKAGE_NOT_SALEABLE` و`VALIDATION_ERROR` تُترجم إلى مفاتيح `cart.*`، ولا يُعرض raw code.

**الملفات الفعلية (16):**

| الملف | الحالة | المسؤولية |
| --- | --- | --- |
| `frontend/app/[locale]/(Store)/cart/page.tsx` | جديد | صفحة رفيعة: `setRequestLocale` + `Suspense` + `CartSection` + `generateMetadata` (24 سطرًا) |
| `frontend/app/[locale]/(Store)/cart/metadata.ts` | جديد | `generateMetadata` باتفاق `products/metadata.ts` و`search/metadata.ts` |
| `frontend/app/[locale]/(Store)/cart/loading.tsx` | جديد | fallback يعيد استخدام `CartSkeleton` |
| `frontend/components/ECommerce/Cart/CartSection.tsx` | جديد | قسم سيرفر يجلب الترجمات وال(settings) بالتوازي ويمرّر العتبة (20 سطرًا) |
| `frontend/components/ECommerce/Cart/CartDrawer.tsx` | جديد | shell للـdrawer: trigger/backdrop/panel/state chooser + a11y attributes (148 سطرًا) |
| `frontend/components/ECommerce/Cart/CartLine.tsx` | جديد | سطر واحد من `IStoreCartLine`: صورة/اسم/رابط/حجم/سعر/حالة/كمية/حذف (84 سطرًا) |
| `frontend/components/ECommerce/Cart/CartQuantityControl.tsx` | جديد | تحكم بالكمية 1–1000 مع disable و`aria-label` |
| `frontend/components/ECommerce/Cart/CartSummary.tsx` | جديد | `itemsCount` و`subtotal` من الباك + مؤشر الشحن المشروط (44 سطرًا) |
| `frontend/components/ECommerce/Cart/CartState.tsx` | جديد | مختار `EmptyState`/`ErrorState` المشتركين |
| `frontend/components/Skelton/CartSkeleton.tsx` | جديد | skeleton بنفس شكل الأسطر والملخص |
| `frontend/hooks/useCartActions.ts` | جديد | update/remove فقط: منع التكرار، toast، رسالة inline، ولا API مباشر في JSX |
| `frontend/hooks/useDrawerFocus.ts` | جديد | open/close + focus trap + Escape + scroll lock + focus restore |
| `frontend/lib/cartError.ts` | جديد | type guard وربط أكواد السلة بمفاتيح الترجمة |
| `frontend/messages/ar.json` | تعديل | namespace `cart` بـ31 مفتاحًا وplural عربي كامل |
| `frontend/messages/en.json` | تعديل | نفس المفاتيح بالإنجليزية |
| `frontend/docs/PROGRESS.md` | تعديل | هذا التقرير |

**ملفات موروثة لم تُلمس:** `backend/docs/BACKEND_PROGRESS.md`، `backend/src/modules/store/products/service.ts`، `frontend/components/Animation/BackToTop.tsx`، كل ملفات G1/G2/G3، `Header/*`، `package.json`، lockfiles، `next.config.ts`، build tooling.

** Implemented in source / منفّذ فعليًا:**
- `/{locale}/cart` يستخدم `CartSection` بدل fetch داخل الصفحة؛ انحراف موثّق عن جدول الملفات المتوقع للحفاظ على Page < 30 سطرًا.
- لا طلب عند غياب التوكن: `useGetCartByTokenQuery(token ?? "", { skip: token === undefined })`؛ hydration عبر `useSyncExternalStore` لتفادي hydration mismatch.
- `getCartByToken` فقط للقراءة؛ لا `getOrCreateCart`، لا cart slice/provider/store جديد، لا تخزين توكن جديد، ولا كشف للتوكن في UI/التقرير.
- update/remove يستخدمان `useUpdateCartItemMutation`/`useRemoveCartItemMutation` الحاليين، مع `isMutating` لمنع الضغط المكرر، وإبطال الـtag موجود يحدّث الـbadge تلقائيًا.
- الكمية تُقبل عددًا صحيحًا 1–1000 فقط؛ زر +/- ورسالة `role="alert"`، والتحكم يُعطّل عند unavailable أو وقت الشحن.
- `item.isAvailable` يتحكم في زر `soldOut` وتعطيل التعديل؛ لا حذف تلقائي ولا بيانات ثابتة.
- `CartSummary` لا يحسب إجماليًا محليًا؛ `PriceTag` يستخدم `priceAtAdd ?? sellingPrice` من الباك، و`CountUp` يعرض القيمة النهائية مع عملة `common.currencyEgp`.
- `freeShippingThreshold !== null` فقط هو شرط عرض مؤشر الشحن؛ لا رقم مخترع.
- الـdrawer فيه `role="dialog"` عند الفتح، `aria-modal`، `aria-labelledby`، `aria-controls`/`aria-expanded` على الزر، backdrop، زر إغلاق، Escape، focus trap، scroll lock، وإرجاع التركيز للـtrigger.
- RTL-safe عبر logical utilities (`end-0`، `bg-ink/40`، `text-*`/`bg-*` tokens)؛ لا raw colors، لا Sass، ولا أنيميشن/ستايل جديد التزامًا بـ`R-STYLE-ANIM`. استُخدمت primitives/wrappers الموجودة فقط.
- مفاتيح `cart.*` متطابقة بين `ar.json` و`en.json`، و`next-intl` يمنع النصوص hard-coded.

** Automatically verified / فحوص آلية (بعد الإصلاحات النهائية):**
- `npm run lint` → `LINT_EXIT=0`.
- `npm run check` → `CHECK_EXIT=0`؛ `Scanned 172 code files, 217 message keys per locale.`؛ `0 failure(s), 0 warning(s).`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `TSC_EXIT=0`.
- `git diff --check` → `DIFF_CHECK_EXIT=0`؛ تحذيرات CRLF معروفة من Git فقط.
- `npm run build` → `BUILD_EXIT=0`؛ `Compiled successfully`، TypeScript انتهى، `29/29` static pages، والمسارات `ƒ /ar/cart` و`ƒ /en/cart` ظهرت في جدول Build. `B-BUILD` لم يتكرر في هذه الجولة، والختم النهائي ما زال شأن G5.
- أثناء الـbuild ظهرت `NETWORK_ERROR` لقراءات المتجر لأن الباك كان متوقفًا؛ لم تمنع البناء.
- `git diff -- package.json package-lock.json` → فارغ، `DEPENDENCY_DIFF_EXIT=0`.

** أخطاء تم إصلاحها خلال G4 (للشفافية):**
- أول `npm run check` رجع `CHECK_EXIT=1` لأن `CartDrawer.tsx` كان 255 سطرًا فوق hard limit 200؛ فُصل إلى `useCartActions.ts` و`useDrawerFocus.ts` و`lib/cartError.ts`، وأصبح 148 سطرًا.
- أول `tsc` رجع `TSC_EXIT=2` بسبب استيراد named بدل default لـ`CartSkeleton`/`CartSection`/`CartDrawer`؛ صُحّحت الاستيرادات، ثم النهائي نظيف.

** API / browser status:**
- لا browser automation في هذه الجولة؛ Network، double-click، RTL/LTR بصريًا، 360px/desktop، الثيمات الأربعة، focus-visible، reduced-motion، وHTML بعد hydration كلها `NOT-TESTED`.
- PATCH/DELETE الحية `NOT-TESTED` بسبب `R-CART-WRITE` الموروث: توكن صحيح الشكل غير موجود رجع سابقًا `DB_CONSTRAINT_ERROR` من `cart.findUnique`، ولم يتحقق `CART_NOT_FOUND` حيًا.
- `R-API-SEARCH` و`R-VIS` لم يتغيرا. لا توكنز حقيقية ولا secrets في هذا التقرير.

** Deviations / انحرافات:**
- `CartSection.tsx` أُضيف كقسم سيرفر لأن الصفحة يجب أن تبقى رفيعة؛ لا منطق بيانات داخل `page.tsx`.
- `metadata.ts` بدل `metadata.tsx` اتباعًا لاتفاق المسارات الحقيقي.
- فُصلت منطق المutations والـfocus/error mapping إلى ثلاثة ملفات جديدة لتفادي تجاوز حد 200 سطر؛ لا Global state ولا dependency جديدة.
- الـdrawer trigger داخل صفحة Cart فقط؛ لم يُربط بـ`CartLink` في الهيدر لأن ذلك خارج G4.
- الـmessages أُضيفت بـ31 مفتاحًا بدل العدد المخطط تقريبًا، لكل الحالات translation-natives؛ العدد متطابق بين اللغتين.

**مراجعة الـdiff:** رُوجع `git status --short` و`git diff --stat` و`git diff --name-only` مع قراءة كل ملفات G4 الجديدة والملفات المعدّلة. لا package/lock changes، ولا تعديلات backend أو build tooling أو G1–G3. الملفات الموروثة ما زالت في working tree كما كانت.

**مراجعة Astra المطلوبة:** راجع تقسيم الملفات والحدود، منع الطلب بدون توكن، منع التكرار أثناء الـmutations، صحة `itemsCount`/`subtotal`/`freeShippingThreshold`، أمان الـdialog/focus/RTL، تمييز «Implemented» عن «Automatically verified» عن «NOT-TESTED»، واستمرار `R-CART-WRITE`. الاعتماد البصري النهائي للمالك منفصل.

⛔ STOP — Gate 4

---

### 27) Day 5 — Gate 5: Final Audit, Validation & Handoff (G5 only, documentation only)

**الإذن:** إذن مالك صريح باسم `DAY 5 — GATE 5: FINAL AUDIT, VALIDATION & HANDOFF`، مع توضيح `Owner Authorization: APPROVED — Start G5 only.` فُتح `G5` فقط للتدقيق والتوثيق؛ لم يُعاد فتح `G1/G2/G3/G4`، ولم يُفتح Day 6، ولم تُجرَ أي إصلاحات أو تغييرات implementation.

**النطاق المنفّذ في G5:** قراءة `AGENTS.md` الخاص بالفرونت، `docs/DAY5_TASKS.md`، `docs/DAY4_TASKS.md`، والسجل الكامل `docs/PROGRESS.md` حتى §26؛ فحص working tree؛ تدقيق مصدر G0–G4؛ إعادة تشغيل أوامر التحقق للقراءة فقط؛ تحديث `docs/PROGRESS.md` و`docs/DAY5_TASKS.md` فقط. لا كود تطبيق، لا backend/DB، لا dependencies، لا config/scripts، لا commit/push/deploy، لا تشغيل أو إيقاف سيرفرات، ولا mutations للسلة.

**Preflight:**
- `E:\NODE_JS\Udemy\Training\AGENTS.md` غير موجود؛ كذلك لا يوجد `AGENTS.md` في جذر `Om-Eman`. قُرئ `frontend/AGENTS.md` قبل أي عمل.
- قُرئ `DAY5_TASKS.md` كاملًا، مع الحفاظ على الخطة الأصلية وتحديث الحالة الفعلية فقط.
- قُرئ `DAY4_TASKS.md` كاملًا؛ الحالة التاريخية هي `DAY 4 GATE 5 COMPLETE — FINAL HANDOFF READY — WAITING FOR OWNER REVIEW`.
- قُرئ `PROGRESS.md` حتى نهاية §26؛ الأسطر القديمة في الأعلى superseded ولم تُحذف.

**Git baseline الحالي في G5:**
- `git status --short` أظهر التعديلات الموروثة من Days 1–4 وملفات G0–G4 غير المتتبعة؛ لم تلمسها G5. من ضمن المعدّل: `backend/docs/BACKEND_PROGRESS.md`، `backend/src/modules/store/products/service.ts`، `components/Animation/BackToTop.tsx`، `components/ECommerce/Header/CartLink.tsx`، `components/ECommerce/Header/StoreHeader.tsx`، `components/ECommerce/StoreJsonLd.tsx`، `interface/index.ts`، `interface/store.ts`، `lib/cartToken.ts`، `lib/jsonld.ts`، `lib/routes.ts`، `lib/server/storeQueries.ts`، `messages/ar.json`، `messages/en.json`، `store/cartApi.ts`، `validation/index.ts`، `validation/storeProduct.ts`، و`docs/PROGRESS.md`.
- ملفات G0–G4 غير المتتبعة ما زالت كما هي، مثل `app/[locale]/(Store)/cart/`، `app/[locale]/(Store)/search/`، `components/ECommerce/Cart/`، `components/ECommerce/Search/`, `hooks/useCartBadge.ts`، `hooks/useCartToken.ts`، `hooks/useCartActions.ts`، `hooks/useDrawerFocus.ts`، `lib/cartError.ts`، `lib/searchQuery.ts`، `validation/storeSearch.ts`، و`components/Skelton/{CartSkeleton,SearchSkeleton}.tsx`.
- `git diff --stat` → `18 files changed, 659 insertions(+), 26 deletions(-)` قبل تعديلات G5، `DIFF_STAT_EXIT=0`.
- `git diff --check` → `DIFF_CHECK_EXIT=0` مع تحذيرات CRLF فقط، `git diff -- package.json package-lock.json` → فارغ، `DEPENDENCY_DIFF_EXIT=0`.

**حالة البيئة الحية أثناء G5:**
- `Get-NetTCPConnection -LocalPort 3001,3002 -State Listen`: المنفذ `3001` مستمع بالـPID `65512`؛ المنفذ `3002` لا يوجد عليه LISTENING.
- `curl http://localhost:3002/api/store/settings` → `SETTINGS_HTTP=000`، `SETTINGS_CURL_EXIT=7`؛ لا HTTP response، لذلك لا يمكن اعتبار أي API متحققًا حيًا في هذه الجولة.
- لم تُجرَّ طلبات search/cart أو POST/PATCH/DELETE حية، ولم تُبدأ أو تُوقف أي عملية.

**مصفوفة تدقيق Gates/Tasks — الحالة الفعلية:**

| Task ID | الحالة الفعلية | الملفات/المسارات الفعلية | الدليل |
| --- | --- | --- | --- |
| G0 baseline | IMPLEMENTED | `docs/PROGRESS.md` §22 | baseline موثّق، عقود صالحة من المصدر، لا تعديل مصدر داخل G0. |
| G0 live smoke | BLOCKED | `backend/src/modules/store/{search,cart}/**`, `backend/src/modules/store/settings/service.ts` | المنفذ 3002 غير متاح حاليًا؛،`SETTINGS_CURL_EXIT=7`. |
| G1 search data/inputs | IMPLEMENTED | `lib/searchQuery.ts`, `validation/storeSearch.ts`, `interface/store.ts`, `lib/server/storeQueries.ts`, `lib/routes.ts` | `q` 1–200، `limit` 1–50/default 20، Zod للرد، لا `"use cache"`/`cacheTag`/`cacheLife` في `getStoreSearch`. |
| G1 API success contract | BLOCKED | `backend/src/modules/store/search/service.ts`, `PROGRESS.md` §23 | استعلامات صحيحة سابقة رجعت `DB_CONSTRAINT_ERROR`؛ لا رد 200 حقيقي لتحقق الـschema/الاقتراحات/الأسعار. |
| G2 search UI/page/SEO | IMPLEMENTED | `components/ECommerce/Header/SearchForm.tsx`, `components/ECommerce/Header/StoreHeader.tsx`, `app/[locale]/(Store)/search/*`, `components/ECommerce/Search/*`, `components/Skelton/SearchSkeleton.tsx`, `lib/jsonld.ts`, `components/ECommerce/StoreJsonLd.tsx`, `messages/{ar,en}.json` | `q` في الرابط عبر `router.push(searchHref(...))`، نفس `ProductCard`، suggestions/empty/error منفصلة،`WebSite.SearchAction`، 16 مفتاح `search.*` متطابق. |
| G2 browser/API real data | NOT TESTED / BLOCKED | `PROGRESS.md` §24 | لا أداة متصفح، لا رد بحث حقيقي؛ SSR/HTML السابق سجل تاريخي لا يرقى إلى BROWSER VERIFIED أو API VERIFIED. |
| G3 cart API/badge | IMPLEMENTED | `store/cartApi.ts`, `store/baseApi.ts`, `lib/cartToken.ts`, `hooks/useCartToken.ts`, `hooks/useCartBadge.ts`, `components/ECommerce/Header/CartLink.tsx` | `getCartByToken` للقراءة فقط، `skip` عند غياب التوكن، توكن `om_cart_token` محفوظ، badge من `itemsCount`، `getOrCreateCart` ما زال لمسار الإضافة القديم فقط. |
| G3 live cart read | BLOCKED | `PROGRESS.md` §25 | توكن صحيح الشكل غير موجود رجع سابقًا `DB_CONSTRAINT_ERROR`؛ `CART_NOT_FOUND` لم يتحقق حيًا. |
| G4 cart page/drawer | IMPLEMENTED | `app/[locale]/(Store)/cart/*`, `components/ECommerce/Cart/*`, `components/Skelton/CartSkeleton.tsx`, `hooks/useCartActions.ts`, `hooks/useDrawerFocus.ts`, `lib/cartError.ts`, `messages/{ar,en}.json` | صفحة رفيعة، قراءة بالتوكن، PATCH/DELETE على `itemId`، `subtotal/itemsCount/isAvailable/freeShippingThreshold` من الباك، 31 مفتاح `cart.*` متطابق، كل ملف ≤200 سطر. |
| G4 live PATCH/DELETE | BLOCKED / NOT TESTED | `PROGRESS.md` §26 | `R-CART-WRITE` ما زال مفتوحًا؛ لا بيئة سلة حقيقية مأذونة، لا Network assertions، لا double-click حقيقي. |
| G5 audit report | IMPLEMENTED | `docs/PROGRESS.md` §27, `docs/DAY5_TASKS.md` | تدقيق مصدر + فحوص محدّثة + تصنيف صريح للقيود. |
| Astra review | ASTRA REVIEWED: NOT TESTED | نهاية هذا التقرير | طلب مراجعة فقط؛ لا نتيجة مراجعة مكتملة في السجل. |
| Owner final approval | OWNER APPROVED: NOT TESTED | نهاية هذا التقرير | Owner منح إذن Gates للتنفيذ فقط؛ لا اعتماد بصري/نهائي للنواتج. |

**Automated verification — G5 (كل أمر على حدة من `Om-Eman/frontend`):**

| الأمر | النتيجة | مقتطف مفيد |
| --- | --- | --- |
| `npm run lint` | `LINT_EXIT=0` | لا أخطاء ESLint. |
| `npm run check` | `CHECK_EXIT=0` | `Scanned 172 code files, 217 message keys per locale.` و`0 failure(s), 0 warning(s).` |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `TSC_EXIT=0` | لا أخطاء TypeScript. |
| `git diff --check` | `DIFF_CHECK_EXIT=0` | تحذيرات CRLF فقط من Git. |
| `npm run build` | `BUILD_EXIT=0` | `Compiled successfully in 12.0s`، TypeScript انتهى، `29/29` static pages، ومسارات `ƒ /ar/search`، `ƒ /en/search`، `ƒ /ar/cart`، `ƒ /en/cart` ظهرت في جدول Build. لم يتكرر `B-BUILD` في هذه الجولة. |
| `git diff -- package.json package-lock.json` | `DEPENDENCY_DIFF_EXIT=0` | فارغ؛ لا تبعيات جديدة. |

**API / Browser / Review status:**
- `API VERIFIED`: لا يوجد. لا قراءة search حقيقية، لا قراءة cart حقيقية، ولا PATCH/DELETE حي.
- `BROWSER VERIFIED`: لا يوجد. لم تُختبر RTL/LTR، 360px/desktop، الثيمات الأربعة، Tab/Enter/Escape/focus-visible، reduced-motion، overflow الأفقي، back/forward، أو Network أثناء التفاعل.
- `ASTRA REVIEWED`: لا يوجد؛ Astra مطلوب في نهاية هذا التقرير.
- `OWNER APPROVED`: لا يوجد؛ الاعتماد البصري والانتقال النهائي قرار المالك.

**تدقيق المصدر الإضافي في G5 — انحرافات/مخاطر لم تُصلح:**
- `components/ECommerce/Header/SearchForm.tsx:35-51`: النموذج فيه `method="get"` لكن الإدخال بلا `name="q"` ولا يوجد `action`؛ مسار JS عبر `router.push(searchHref(...))` يعمل، أما native/no-JS fallback فلا يحمل `q`. لم يُصلح لأن G5 توثيق فقط.
- `components/ECommerce/Search/SearchResults.tsx:13` و`components/Skelton/SearchSkeleton.tsx:9`: تكرار نفس شبكة `FeaturedGrid` بدل إعادة استخدام المكوّن؛ `ProductCard` نفسه مستخدم بالفعل، ولا توجد نسخة search-card.
- `app/[locale]/(Store)/search/metadata.ts:18,31`: `getTranslations` يستقبل `locale` غير مُضيّق، وكل صفحات البحث `noindex` مع وجود `SearchAction`؛ قرار SEO محفوظ من G2 ويحتاج مراجعة Astra/Owner.
- `components/ECommerce/Cart/CartDrawer.tsx:90-143`: المكوّن يعمل بنمطين؛ عند الإغلاق يعرض محتوى السلة داخل صفحة السلة نفسها، وعند الفتح يصبح dialog ثابتًا. هذا تحقق مصدرًا فقط وسلوكه البصري `NOT TESTED`.
- `hooks/useDrawerFocus.ts:13-16,48-52`: يوجد احتمال double focus restore بين `close()` وتنظيف الـeffect؛ لم يُختبر في متصفح.
- `components/ECommerce/Cart/CartSummary.tsx:17-31`: `Number(subtotal)` بلا حماية `NaN/Infinity`؛ العقد يفترض decimal string صالحًا، وسُجّل كملاحظة تحسين لا كعيب مؤكد.
- لا raw colors ولا Sass ولا أنيميشن جديد في ملفات G5؛ التزام `R-STYLE-ANIM` ما زال قائمًا، وحركات fly/bounce/count-up الموجودة لم تتغير.

**النطاق والـregression audit:**
- لا تعديلات في backend/DB/migrations/seed/npm scripts/config/package files.
- لا cart slice/provider موازٍ، لا cookie ثانٍ، لا localStorage key جديد، لا parallel search suggestions endpoint، لا `POST /api/search-logs`، لا checkout/merge، لا حساب subtotal محلي.
- لا تعديل في `ProductCard` أو `FeaturedGrid` أو fly-target؛ `R-G4-MAJOR` ما زال مؤجلًا.
- لا تعديلات أنيميشن/ستايل جديدة؛ `D3-RM` و`R-STYLE-ANIM` ما زالا مؤجلين.
- الفحوص الآلية الآن خضرا، لكنها لا تغيّر حالة API/Browser/Astra/Owner.

**المتبقي/الـblockers:**
- `R-API-SEARCH`: مفتوح؛ real results/suggestions/zero-result/SearchLog runtime `BLOCKED`.
- `R-CART-WRITE`: مفتوح؛ PATCH/DELETE وقراءة سلة حقيقية `BLOCKED/NOT TESTED`.
- `R-VIS`: مفتوح؛ كل مصفوفة المتصفح والاعتماد البصري `NOT TESTED`.
- `B-BUILD`: Build الحالي ناجح، لكن الخطر التاريخي ما زال مسجّلًا؛ لا ختم production-ready.
- `R-G4-MAJOR`, `D3-RM`, `R-STYLE-ANIM`, B-PUB negative cases, guest-merge/checkout/account: كلها مؤجلة أو خارج نطاق اليوم الخامس.
- `R-PORTS`: `:3001` مستمع بالـPID `65512`، `:3002` غير متاح؛ لا تدخل G5 على العمليات.

**مراجعة Astra المطلوبة:**
يرجى من Astra، دون تعديل كود، مراجعة:
1. مصفوفة Gates/Tasks وفصل `IMPLEMENTED` عن `AUTOMATED CHECK PASSED` عن `API VERIFIED` عن `BROWSER VERIFIED` عن `ASTRA REVIEWED` عن `OWNER APPROVED`.
2. الانحرافات المكتشفة في G5: native search fallback، تكرار grid classes، `noindex`/SearchAction، dual-mode CartDrawer، double focus restore، `Number(subtotal)`.
3. استمرار `R-API-SEARCH` و`R-CART-WRITE` و`R-VIS` و`B-BUILD` وعدم اعتماد أي منها تلقائيًا.
4. هل التصنيف النهائي أدناه مناسب كـTECHNICAL HANDOFF أم يجب تحويله إلى `PARTIAL HANDOFF` أو `DAY 5 INCOMPLETE — BLOCKED` بقرار Astra/Mالك.

**قرار Owner المطلوب:**
- هل يُعتمد هذا كـtechnical handoff رغم فجوات API/browser؟
- هل تُوفَّر بيئة `:3002`/DB سليمة وبيئة cart write مأذونة لإغلاق `R-API-SEARCH` و`R-CART-WRITE`؟
- هل تُجرى مصفوفة متصفح مستقلة للبحث والسلة قبل أي اعتماد بصري؟
- هل تُعالج انحرافات G5 في تكليف منفصل أم تُقبل كـdeferred technical debt؟
- هل يُعاد فتح G4 لهدف fly، أو يُبقى خارج النطاق كما هو؟

**التصنيف النهائي:** `DAY 5 COMPLETE — TECHNICAL HANDOFF READY` مع تسجيل صريح بأن `API VERIFIED`, `BROWSER VERIFIED`, `ASTRA REVIEWED`, و`OWNER APPROVED` ليست متحققة، وأن لا ختم production-ready.

⛔ STOP — DAY 5 GATE 5 COMPLETE — WAITING FOR OWNER REVIEW

---

## 28) تخطيط اليوم 6 وضبط الـFloating Cart CTA قبل التنفيذ (2026-11-22)

**الحالة:** `DAY 6 PLANNING COMPLETE — WAITING FOR ASTRA REVIEW & OWNER GATE PERMISSION`. لم تُفتح أي Gate، ولم يُنفّذ checkout/proof، ولا يوجد اعتماد بصري أو موافقة على فتح implementation.

### 28.1 ما أُنجز في التخطيط
- أُنشئ `docs/DAY6_TASKS.md` بنفس أسلوب `DAY4_TASKS.md` / `DAY5_TASKS.md`: 12 حقلًا لكل Gate، G0–G6، نطاق وخارج نطاق، جرد ملفات متوقع، أولويات P0/P1/P2، أوامر تحقق، مخاطر، قالب تقرير، وSTOP لكل Gate.
- رُاجعت مصادر الحجة: `AGENTS.md`، `PROGRESS.md` §27، `DAY5_TASKS.md`، `DESIGN_SYSTEM.md`، عقود checkout/shipping/coupon/payment/upload/track في الباك، وواقع cart/routes/messages في الفرونت.
- فُصلت العناصر المؤجلة صريحًا حتى لا تتراكم:
  - `D6-CHECKOUT` و`D6-PROOF`: P0 داخل Day 6 (G2/G3/G4).
  - `D6-MOTION`: G5 فقط، بعد الهيكل وبإذن منفصل.
  - `D7-TRACK` و`D7-ACCOUNT` وguest-merge: Day 7، لا يُبدأ هنا.
  - `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, B-PUB negative cases، وانحرافات Day 5: سجلها G0 واستمرارها P2/مالك، لا إصلاح ضمن Day 6.
- سُجّل قراران معلّقان للملك: نقل إيصال الطلب عبر `sessionStorage` مقابل بديل آمن آخر، وتوقيت مراجعة الشكل/الأنيميشن في G5.
- وُثّق أن الإجماليات والضريبة والشحن من الباك فقط، وأن `trackingToken` لا يظهر في URL/canonical/JSON-LD/السجلات.

### 28.2 طلب تعديل قبل Day 6 — الـFloating Cart CTA
- ملاحظة المالك: الزرار يجب أن يظهر **مع ظهور زرار BackToTop** مباشرة، ويكون ثابتًا فوقه، لا يظهر في آخر الصفحة فقط.
- `hooks/useIsScrolled.ts` أصبح مصدر الحجة المشترك: عتبة `SCROLL_THRESHOLD = 10`، `useSyncExternalStore`، passive scroll listeners، و`getServerSnapshot = false`.
- `hooks/useFloatingCartCta.ts`: `isVisible` أصبح `isScrolled && isReady && !hasError && itemsCount > 0 && !isCartPage`؛ أي لا يظهر قبل أول سكرول، ويظهر فور تخطي العتبة.
- `components/ECommerce/Cart/FloatingCartCta.tsx`: أُزيل الوضع المركزي في أعلى الصفحة؛ الوضع ثابت `fixed bottom-24 end-6 z-50`، مع `AnimatePresence` و`m.div` بحركة دخول/خروج متسقة (`y`, `opacity`, `scale` و`SPRING_CARD`). الـnudge الدوري بقي على الرابط نفسه.
- `components/Animation/ScrollTopFab.tsx`: أُزيل `useEffect`/`useState` المحليين واعتمد نفس `useIsScrolled`؛ لذلك يظهر زرار BackToTop والـCTA من نفس الشرط ونفس اللحظة. لون السهم بقي `text-ink-strong` حسب تثبيت الثيمات.
- `styles/animations.css`: حُذف `cart-cta-enter` لتفادي تكرار الدخول بين CSS وmotion؛ بقي `cart-cta-nudge` فقط مع إيقافه عند hover/focus وreduce-motion.

### 28.3 الفحوص الآلية بعد هذا التحديث

| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `CTA_SYNC_LINT_EXIT=0` |
| `npm run check` | `CTA_SYNC_CHECK_EXIT=0` — 0 failure، 0 warning، 176 code files، 221 message keys/locale |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `CTA_SYNC_TSC_EXIT=0` |
| `git diff --check` | `CTA_SYNC_DIFF_CHECK_EXIT=0` |
| `npm run build` | `CTA_SYNC_BUILD_EXIT=0` — 29 صفحة مولّدة، لا أخطاء TypeScript |

### 28.4 حالة التحقق والاعتماد
- `API VERIFIED`: لا يوجد لهذا التحديث؛ التغيير واجهة/scroll فقط.
- `BROWSER VERIFIED`: لا يوجد؛ لم يُشاهد في متصفح بعد. المطلوب: أول سكرول خفيف ⇒ يظهر زرار BackToTop والـCTA معًا، الـCTA فوقه بفاصل ثابت، لا تظهر على cart page، وتختفي معه عند العودة للأعلى، مع RTL/LTR والثيمات الأربعة و`prefers-reduced-motion`.
- `ASTRA REVIEWED`: لا يوجد؛ مراجعة `DAY6_TASKS.md` مطلوبة.
- `OWNER APPROVED`: لا يوجد؛ لا ختم Day 6 ولا إذن Gate.
- التصنيف: `PRE-DAY6 UI SYNC + DAY 6 PLANNING COMPLETE` مع بقاء كل Gate مقفولة حتى إذن صريح.

⛔ STOP — DAY 6 PLANNING COMPLETE — WAITING FOR ASTRA REVIEW & OWNER GATE PERMISSION

---

## 29) Day 6 — Gate 0: Pre-flight وتثبيت العقود (2026-11-22)

**الحالة:** `DAY 6 GATE 0 COMPLETE — WAITING FOR OWNER PERMISSION FOR GATE 1`.
**إذن المالك:** اعتماد خطة اليوم 6 + إذن مستقل باسم `Gate 0` فقط. لم يُفتح G1، ولم يُنفّذ checkout/proof، ولا يوجد تغيير مصدر/باك/DB/config/dependencies.

### 29.1 قراءات Gate 0 الإلزامية
- `frontend/AGENTS.md` §0–1: قواعد القراءة قبل التنفيذ، الملف الصغير، `I/T`، Zod، RTK Query، منع `useEffect` setState، و`npm run lint/build` قبل الإنهاء.
- `frontend/docs/PROGRESS.md` §28 + آخر سطر Day 5: حالة ما قبل G0، تثبيت الـCTA، والفحوص الآلية الآمنة.
- `frontend/docs/DAY6_TASKS.md:235-248` حقل G0 الـ12، و`§11` قرار الاعتماد.
- عقود الباك source-verified أثناء G0:
  - `backend/src/modules/store/checkout/validation.ts:3-41`: `addressSchema`, `guestCheckoutSchema`, `paymentMethod: COD|ONLINE_TRANSFER`، `items` 1..50، `guestToken` 10..200.
  - `backend/src/modules/store/checkout/routes.ts:11-23`: rate limit `20/15m` + `validateBody`.
  - `backend/src/services/checkout-contracts.ts:35-42`: `IGuestCheckoutResult`.
  - `backend/src/services/checkout-totals.service.ts:10-17`: `IOrderTotals` decimal strings.
  - `backend/src/modules/store/coupons/validation.ts:3-26`: `validateCouponSchema` + `IValidateCouponResponse`.
  - `backend/src/modules/store/shipping/validation.ts:4-19`: `AREA_NAME_PATTERN`, shipping quote query.
  - `backend/src/modules/uploads/validation.ts:14-35`: `proofSignSchema`, `IUploadSignature`.
  - `backend/src/modules/store/payments/validation.ts:4-18`: `paymentProofSchema`.

### 29.2 baseline Git/البيئة
| البند | الدليل |
| --- | --- |
| HEAD | `e256375 End Day5`. |
| Working tree عند بداية G0 | `docs/PROGRESS.md` فقط modifiers (+44 سطر من §28)؛ `docs/DAY6_TASKS.md` نظيف داخل HEAD. لا untracked checkout files. |
| المنافذ | `:3001` PID `120092`، `:3002` PID `123612`؛ لم يُوقف أو يُشغَّل أي process. |
| Frontend HTTP | `/ar` أول probe انتهى بـtimeout بعد 5s (`HTTP=000`, curl 28)، ثم نجح في probe ثانٍ `HTTP=200` بعد 19.23s؛ لم يُترجمTimeout إلى فشل DNS أو إجراء إداري. |
| `GET /api/store/settings` | `HTTP=200`, curl exit 0. |
| `GET /api/store/shipping/areas` | `HTTP=200`, curl exit 0. |
| `GET /api/store/shipping/quote?governorate=Cairo&city=Cairo` | `HTTP=400`, curl exit 0؛ متوافق مع قاعدة «لا تعريفة ⇒ `SHIPPING_AREA_NOT_CONFIGURED`»، لا يُفسَّر كشحن مجاني. |
| `POST /api/store/coupons/validate` بـ`{}` | `400 VALIDATION_ERROR` مع `couponCode` و`items`؛ لا إنشاء checkout، لا trackingToken/ guestToken في الطلب أو السجل. |
| Checkout/proof | لم تُجرَب كتابة، لم تُرسل write requests، لم يُستخدم seed/بيانات وهمية. |
| `git diff --check` | `G0_DIFF_CHECK_EXIT=0` (مع تحذير LF→CRLF اعتيادي في PROGRESS.md). |

### 29.3 آخر فحوص آلية سارية
- من §28 بعد تثبيت CTA: `npm run lint = CTA_SYNC_LINT_EXIT=0`، `npm run check = CTA_SYNC_CHECK_EXIT=0`، `tsc --noEmit = CTA_SYNC_TSC_EXIT=0`، `npm run build = CTA_SYNC_BUILD_EXIT=0`.
- لم يتغير كود المصدر منذ تلك الفحوص؛ G0 وثائق/قراءة فقط. HTTP 200/400 ليس acceptance بصريًا ولا ختمًا لصحة الـAPI.

### 29.4 توزيع المؤجلات وقرارات G0
- `D6-CHECKOUT` (G2/G3)، `D6-PROOF` (G4)، و`D6-MOTION` (G5 بعد الهيكل): داخل Day 6.
- `D7-TRACK`, `D7-ACCOUNT`, guest-merge: Day 7؛ لا يُبدأ هنا.
- `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, B-PUB negative cases، وانحرافات Day 5: سجلت كما هي؛ لا إصلاح داخل G0/G1 تلقائيًا.
- بناءً على اعتماد الخطة: `sessionStorage` هو نقل الإيصال الافتراضي دون `trackingToken` في URL/canonical/logs؛ G5 يبقى جلسة مراجعة منفصلة.
- `R-PORTS`: استجابة frontend بطيئة (19.23s) سُجّلت كملاحظة baseline؛ لا تغيير عمليات.
- `B-BUILD` و`R-VIS`: ما زالا مفتوحين؛ لا ختم production-ready ولا اعتماد متصفح.

### 29.5 تحديثات الوثائق في G0
- `docs/DAY6_TASKS.md`: الحالة إلى `DAY 6 PLAN APPROVED — GATE 0 COMPLETE — WAITING FOR GATE 1 PERMISSION`؛ G0 موعده 2026-11-22؛ قرار الإيصال/G5 مثبّت؛ قسم 11 يعكس اعتماد المالك لـDay 6 Plan + G0 فقط.
- `docs/PROGRESS.md`: أُضيف هذا القسم تلقائيًا حتى أي AI لاحق يجد سلسلة الاعتماد دون سؤال.
- صفر تعديلات كود، صفر تعديلات باك/DB/migrations/seed/npm scripts/config/package files.

### 29.6 حالة التحقق والاعتماد
- `API VERIFIED`: جزئي للقراءة فقط (settings/areas/quote/coupon validation)؛ لا checkout/proof runtime.
- `BROWSER VERIFIED`: لا يوجد؛ G0 لا يشمل شاشة.
- `ASTRA REVIEWED`: لا يوجد؛ مراجعة استشارية معلّقة ولا تمنع G0 المعتمد من المالك.
- `OWNER APPROVED`: نعم لـDay 6 Plan + Gate 0 فقط؛ G1 يحتاج إذنًا صريحًا جديدًا.
- التصنيف: `DAY 6 GATE 0 COMPLETE — BASELINE LOCKED`.

⛔ STOP — DAY 6 GATE 0 COMPLETE — WAITING FOR OWNER PERMISSION FOR GATE 1

---

## 30) Day 6 — Gate 1: Contracts, Validation & API Helpers

### 30.1 الإذن والنطاق
- الإذن الصريح من المالك: `DAY 6 — G1: Contracts, Validation & API Helpers` فقط؛ G2 ما زال مقفولًا.
- قبل التنفيذ عُرضت خطة الملفات ومسؤولية كل ملف والعقود والانحرافات؛ لم يظهر تعارض يوقف التنفيذ.
- نُفّذت العقود والـZod والhelpers وendpoints عبر `baseApi.injectEndpoints` فقط. لا route/checkout UI، لا رفع ملف، لا إجمالي/ضريبة محلية، لا باك/DB/migrations/seed، لا dependencies/config/scripts، لا commit/push/deploy.
- working tree موروث من G0 كان يحتوي تعديلات `docs/PROGRESS.md` و`docs/DAY6_TASKS.md`؛ لم يُلمس غيرها من الوثائق خارج نطاق G1.

### 30.2 الملفات المنفذة في المصدر
| الملف | المسؤولية |
| --- | --- |
| `interface/checkout.ts` (جديد) | عقود checkout/shipping/coupon/proof/receipt؛ decimal strings تبقى `string`؛ `TPaymentStatus` من Prisma enum. |
| `validation/checkout.ts` (جديد) | `checkoutAddressSchema`, `checkoutItemSchema`, `guestCheckoutSchema`, `orderTotalsSchema`, `checkoutResultSchema`؛ يطابق `guestCheckoutSchema` في الباك. |
| `validation/shipping.ts` (جديد) | query الشحن بنفس `AREA_NAME_PATTERN`، وresponse schemas للمناطق والـquote. |
| `validation/coupon.ts` (جديد) | payload validate coupon وresponse schema؛ الأرقام العشرية strings. |
| `validation/paymentProof.ts` (جديد) | sign-proof، proof payload، upload signature، proof result؛ token 43..64. |
| `validation/orderReceipt.ts` (جديد) | تحقق الإيصال المخزّن محليًا قبل الوثوق به. |
| `lib/checkoutForm.ts` (جديد) | تحويل cart lines إلى `items` وتطبيع payload بدون حساب مبالغ. |
| `lib/checkoutError.ts` (جديد) | خريطة أكواد الباك الحقيقية إلى مفاتيح `next-intl`؛ fallback `checkout.errors.unexpected`. |
| `lib/orderReceipt.ts` (جديد) | حفظ/قراءة/حذف الإيصال في `sessionStorage` مع SSR guard وتحقق Zod؛ لا token في URL/canonical/logs. |
| `store/checkoutApi.ts` (جديد) | `placeOrder` → `POST /store/checkout` ويُبطل `{ type: "Cart", id: "CURRENT" }`. |
| `store/shippingApi.ts` (جديد) | areas وquote؛ كل payload وresponse يمرّان عبر Zod. |
| `store/couponApi.ts` (جديد) | validate coupon؛ كل payload وresponse يمرّان عبر Zod. |
| `store/paymentApi.ts` (جديد) | sign-proof على `/uploads/sign-proof` وsubmit-proof على `/store/payments/proof`؛ لا رفع ملف فعلي. |
| `interface/index.ts`, `validation/index.ts` (تعديل) | barrel exports فقط. |
| `lib/routes.ts` (تعديل) | `CHECKOUT_HREF` و`CHECKOUT_SUCCESS_HREF`. |
| `messages/ar.json`, `messages/en.json` (تعديل) | مساحات `checkout.errors` و`payment.errors` فقط؛ نفس المفاتيح بالضبط. |

### 30.3 العقود المعتمدة من مصدر الباك
- `backend/src/modules/store/checkout/validation.ts`: `guestCheckoutSchema`، Phone/address/items/coupon/paymentMethod limits.
- `backend/src/services/checkout-contracts.ts` و`checkout-totals.service.ts`: `IGuestCheckoutResult` و`IOrderTotals`؛ المبالغ سلاسل عشرية.
- `backend/src/modules/store/shipping/{validation,service}.ts`: `AREA_NAME_PATTERN`، `IShippingArea`، `SHIPPING_AREA_NOT_CONFIGURED`.
- `backend/src/modules/store/coupons/validation.ts` و`coupon.service.ts`: `IValidateCouponResponse` وأكواد `COUPON_INVALID`, `COUPON_NOT_ACTIVE`, `COUPON_EXPIRED`, `COUPON_NOT_FOR_CUSTOMER`, `COUPON_MIN_ORDER`, `COUPON_LIMIT_REACHED`, `COUPON_PER_CUSTOMER_REACHED`.
- `backend/src/modules/uploads/validation.ts`: `proofSignSchema` و`IUploadSignature`.
- `backend/src/modules/store/payments/{validation,service}.ts`: `paymentProofSchema`، `amount` هو المبلغ المحوّل الفعلي، `EPaymentStatus`، وأكواد `ORDER_NOT_FOUND`, `ORDER_ACCESS_DENIED`, `PAYMENT_ALREADY_CONFIRMED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_METHOD_NOT_ONLINE`.
- مسارات API النهائية من `backend/src/modules/{index,store/routes}.ts`: `/store/checkout`, `/store/shipping/*`, `/store/coupons/validate`, `/uploads/sign-proof`, `/store/payments/proof` مع `API_BASE_URL = .../api`.

### 30.4 الفحوص الآلية — أوامر منفصلة
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G1_LINT_EXIT=0`. |
| `npm run check` | `G1_CHECK_EXIT=0` — `189 code files`, `243 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G1_TSC_EXIT=0`. |
| `git diff --check` | `G1_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G1_BUILD_EXIT=0` — Turbopack compile + TypeScript + 29 static pages، دون أخطاء. |

### 30.5 API smoke — قراءة فقط
- `GET /api/store/settings` → `HTTP=200`.
- `GET /api/store/shipping/areas` → `HTTP=200`.
- `GET /api/store/shipping/quote?governorate=Cairo&city=Cairo` → `HTTP=400` متوافق مع غياب التعريفة؛ لا يُترجم كشحن مجاني.
- `POST /api/store/coupons/validate` بـ`{}` → `HTTP=400` validation؛ لا طلب checkout، لا trackingToken، لا كتابة.
- لم تُرسل أي عملية checkout/proof write؛ لم يُستخدم seed أو بيانات وهمية أو رفع ملف.

### 30.6 الانحرافات والتقييدات داخل G1
- قُسّمت Zod إلى ملفات صغيرة وفق `AGENTS.md` رغم أن خطة Gate ذكرت `validation/checkout.ts` فقط؛ لا تغيير في المنطق أو العقود.
- `lib/proofUpload.ts` لم يُنشأ في G1؛ مكانه G4 لأن G1 يمنع رفع الملفات، وتفاديًا لتخمين حقول FormData.
- Frontend لا يعرف `CLOUDINARY_CLOUD_NAME`؛ تحقق `proofImageUrl` يبقى general HTTPS URL≤500، والباك هو المصدر النهائي لتحقق Cloudinary.
- أكواد إضافية من الباك دخلت خريطة الأخطاء؛ لا raw `code` أو رسالة باك تُعرض للمستخدم في G2+.
- `baseApi.ts` لم يُعدَّل؛ tagTypes بقي `["Cart"]`، وplaceOrder يبطل فقط Cart الحالي.
- لا حركة أو ستايل جديد؛ G5 ما زال جلسة منفصلة بعد G2–G4.

### 30.7 مراجعة الـdiff
- `git status --short`: تعديلات الوثائق الموروثة + 7 ملفات مصدر معدّلة + 13 ملفًا جديدًا غير متتبع، كلها داخل نطاق G1.
- `git diff --stat`: 7 ملفات معدّلة، `223 insertions(+), 7 deletions(-)` قبل احتساب الملفات الجديدة؛ صفر تغيير في `package.json`/lock/config/backend.
- لا untracked خارج القائمة في 30.2؛ لا ملفات أسرار أو logs أو ملفات generated.

### 30.8 حالة التحقق والاعتماد
- `IMPLEMENTED IN SOURCE`: نعم — 13 ملفًا جديدًا و7 تعديلات محددة في 30.2.
- `AUTOMATED CHECKS`: نعم — lint/check/tsc/diff/build بـexit codes موثّقة في 30.4.
- `API VERIFIED`: جزئي للقراءة فقط؛ checkout/proof write لم يُختبر ويعتمد على بيئة مأذونة في G3/G4.
- `BROWSER VERIFIED`: لا يوجد؛ G1 بلا شاشة، ولم يُضف ستايل أو أنيميشن.
- `ASTRA REVIEWED`: PENDING — مراجعة استشارية معلّقة.
- `OWNER APPROVED`: إذن G1 موجود؛ مراجعة/اعتماد نتيجة G1 لم تحدث بعد؛ G2 مقفول.
- التصنيف: `DAY 6 GATE 1 COMPLETE — SOURCE + CHECKS PASS — WAITING FOR OWNER REVIEW — G2 LOCKED`.

⛔ STOP — DAY 6 GATE 1 COMPLETE — WAITING FOR OWNER REVIEW — G2 LOCKED

---

## 31) Day 6 — Gate 2: Checkout Address, Shipping, Coupon & Items

### 31.1 الإذن والنطاق
- الإذن الصريح من المالك: `G2 — CHECKOUT: ADDRESS, SHIPPING, COUPON & ITEMS` فقط؛ G3 ما زال مقفولًا.
- قبل التنفيذ عُرضت خطة الملفات والمسؤوليات والانحرافات، ورُوجع G1 implementation والـcontracts والـendpoints؛ working tree الموروث حُفظ ولم يُلمس خارج نطاق G2 إلا `messages/{ar,en}.json` ووثائق اليوم.
- نُفّذ route/skeleton/components/useCheckoutForm/رسائل ar/en فقط. لا `POST /checkout`، لا submit/success/proof، لا Cloudinary، لا تعديل Cart أو cart token، لا أسعار/خصوم/شحن محسوبة محليًا، لا motion جديد، لا backend/DB/dependencies/config.

### 31.2 الملفات المنفذة في المصدر
| الملف | المسؤولية |
| --- | --- |
| `app/[locale]/(Store)/checkout/{page,metadata,loading}.tsx` (جديد) | صفحة تركيب بعنوان SSR مرئي، metadata مع `isNoIndex: true`، وloading skeleton. |
| `components/Skelton/CheckoutSkeleton.tsx` (جديد) | skeleton مطابق لتخطيط الخطوات/البنود/الملخص بلا `opacity:0`. |
| `components/ECommerce/Checkout/CheckoutSection.tsx` (جديد) | حالة السلة/الشبكة/الفراغ + قراءة cart عبر RTK Query، ثم تركيب `CheckoutContent` بمفتاح يعتمد على بنود السلة. |
| `components/ECommerce/Checkout/CheckoutContent.tsx` (جديد) | شبكة G2 الجاهزة؛ يبني النموذج من cart lines ويقرأ areas/quote، مع حالة كوبون محلية فقط. |
| `components/ECommerce/Checkout/CheckoutFocusSection.tsx` (جديد) | غلاف `<section>` قابل للتركيز مع focus-visible موحّد لأقسام الـstepper. |
| `components/ECommerce/Checkout/CheckoutStepper.tsx` (جديد) | 3 خطوات قابلة للوصول بلوحة المفاتيح عبر focus للـsection، دون حركة. |
| `components/ECommerce/Checkout/CheckoutItems.tsx` (جديد) | عرض بنود `IStoreCart` للقراءة فقط؛ لا تعديل كمية. |
| `components/ECommerce/Checkout/CheckoutAddressForm.tsx` (جديد) | غلاف العنوان: select المحافظة، حالة areas، وتجميع حقول العنوان. |
| `components/ECommerce/Checkout/CheckoutAddressMainFields.tsx` (جديد) | الاسم/الهاتف/المحافظة/المدينة/الشارع مع Zod ورسائل مترجمة. |
| `components/ECommerce/Checkout/CheckoutAddressOptionalFields.tsx` (جديد) | الحي/المبنى/الدور/علامة المميزة. |
| `components/ECommerce/Checkout/CheckoutShipping.tsx` (جديد) | عرض quote وETA من الباك ورسالة المنطقة غير المهيأة. |
| `components/ECommerce/Checkout/CheckoutCoupon.tsx` (جديد) | `coupon/validate`، يتحقق من `result.valid` قبل العرض، ويرفع الكود إلى الملخص. |
| `components/ECommerce/Checkout/CheckoutSummary.tsx` (جديد) | عرض `cart.subtotal` وبيانات coupon preview و shipping quote فقط. |
| `components/ECommerce/Checkout/CheckoutPaymentMethod.tsx` (جديد) | اختيار `COD`/`ONLINE_TRANSFER` داخل النموذج فقط، بلا تنفيذ دفع. |
| `components/ECommerce/Checkout/CheckoutState.tsx` (جديد) | empty/error/network موحّدة عبر `EmptyState`/`ErrorState`. |
| `components/ECommerce/Checkout/CheckoutField.tsx`, `CheckoutSelect.tsx` (جديد) | وسم/خطأ/مساعدة و_select_ محلي مُعاد استخدامه داخل الميزة. |
| `hooks/useCheckoutForm.ts` (جديد) | RHF + `zodResolver(checkoutFormSchema)`، بناء `items` من cart lines واكتشاف كميات غير صالحة. |
| `lib/checkoutFieldError.ts` (جديد) | تحويل مسار خطأ Zod إلى مفتاح `next-intl` عربي/إنجليزي. |
| `messages/ar.json`, `messages/en.json` (تعديل) | مساحة `checkout.*` للعناوين والحقول والشحن والكوبون والملخص والتحقق؛ نفس المفاتيح بالضبط. |

### 31.3 العقود والبيانات الحقيقية
- Cart: `useGetCartByTokenQuery` مع نفس نمط `CartDrawer` و`useCartToken`؛ لا create/write للسلة.
- Shipping: `useGetShippingAreasQuery` و`useGetShippingQuoteQuery` مع `shippingQuoteQuerySchema.safeParse` قبل الطلب؛ يعرض الباك `cost` و`etaMinDays/etaMaxDays`.
- Coupon: `useValidateCouponMutation` بpayload `{couponCode, items}`؛ الأرقام decimal strings كما هي.
- Form: `checkoutFormSchema` و`checkoutItemSchema` من G1؛ الهاتف/العنوان/الكميات تُراجع بـZod.
- الأخطاء: `resolveCheckoutErrorKey` لأكواد الباك، و`resolveCheckoutFieldErrorKey` لأخطاء الحقول؛ لا raw code ولا رسالة باك تُعرض.

### 31.4 الفحوص الآلية — أوامر منفصلة
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G2_LINT_EXIT=0`. |
| `npm run check` | `G2_CHECK_EXIT=0` — `210 code files`, `302 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G2_TSC_EXIT=0`. |
| `git diff --check` | `G2_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G2_BUILD_EXIT=0` — Turbopack compile + TypeScript + 32 static pages، Includes `/[locale]/checkout`. |

### 31.5 Zod وAPI verification
- Zod عبر Node type-stripping: `BASE=true`, `BAD_PHONE=false`, `BAD_STREET=false`, `BAD_QTY=false`.
- `GET /api/store/settings` → `HTTP=200`.
- `GET /api/store/shipping/areas` → `HTTP=200`؛ المحافظات تعيد `cities: [{ city: null, ... }]` (تعريفة على مستوى المحافظة).
- `GET /api/store/shipping/quote` بقيمة محافظة/مدينة عربية حقيقية → `HTTP=200` و`data.cost` سلسلة عشرية وETA من الباك.
- `GET /api/store/shipping/quote?governorate=Cairo&city=Cairo` → `HTTP=400` و`code=SHIPPING_AREA_NOT_CONFIGURED`.
- `POST /api/store/coupons/validate` بـ`{}` → `HTTP=400` و`code=VALIDATION_ERROR`.
- لم تُرسل أي طلب checkout/proof، ولم يُستخدم guestToken أو seed أو بيانات وهمية في التقارير.

### 31.6 Browser verification
- `BROWSER VERIFIED`: لا يوجد؛ G2 لم يفتح متصفحًا ولم يُعتمد بصريًا.
- Supporting implementation: h1 SSR في page، لا `opacity:0` فوق الـfold، `tabIndex=-1` وfocus-visible ring على الأقسام التي يستهدفها الـstepper، `aria-describedby` للحقول/الأخطاء، utilities منطقية `text-start`، mobile-first `sm:`/`lg:`، و4 ثيمات عبر tokens الحالية.
- المطلوب من المالك: ar/en، RTL/LTR، 360px/desktop، الثيمات الأربعة، Tab/Enter/focus-visible، وظهور المحتوى بدون JS.

### 31.7 الانحرافات والتقييدات داخل G2
- §5.3 ذكر `CheckoutPaymentMethod`؛ نُفّذ كاختيار نموذج فقط لأن `checkoutFormSchema` يتطلب `paymentMethod`، دون إرسال أو إثبات دفع.
- أُضيف `CheckoutContent.tsx` و`CheckoutFocusSection.tsx` وفُصلت حقول العنوان واستُخرج `CheckoutField/CheckoutSelect` لتحقيق حد `AGENTS.md` بدون تحذيرات check.
- بُني `useCheckoutForm` داخل `CheckoutContent` بعد وصول cart lines، مع `key` يعتمد على id/quantity، حتى لا تبقى `items` فارغة في RHF ولا يتقادم preview الكوبون.
- حقل المدينة أصبح `Input` مع `datalist` من مدن الباك فقط؛ عند كون `city: null` في التعريفة يكتب المستخدم مدينته الفعلية ويُحسب الشحن من تعريفة المحافظة. هذا انحراف موثّق عن سطر «governorate/city من القائمة فقط» لأن البيانات الحقيقية لا تحتوي أسماء مدن.
- رُوعيت دقة الترجمة: رسائل المدينة تقول «أدخل» لا «اختر»، `REQUEST_FAILED` عامة لا تخص الطلب، واقتراحات المدن تُفلتر بـ`shippingQuoteQuerySchema` حتى لا تُعرض مدينة يرفضها التحقق المحلي.
- لا إجمالي نهائي أو ضريبة قبل الطلب؛ `CheckoutSummary` يعرض فقط المبالغ القادمة من cart/coupon/shipping.
- لا Motion أو Styles جديدة؛ G5 ما زال مقفولًا.
- `usePlaceOrderMutation` و`store/paymentApi.ts` و`lib/orderReceipt.ts` من G1 لم يُستخدموا في G2.

### 31.8 مراجعة الـdiff
- `git status --short`: تغييرات G0/G1 الموروثة + 21 ملفًا جديدًا لـG2 + تعديل `messages/{ar,en}.json`؛ لا untracked خارج القائمة في 31.2.
- لا تغيير في `package.json`/lock/config/backend/styles/motion/store APIs.

### 31.9 حالة التحقق والاعتماد
- `IMPLEMENTED IN SOURCE`: نعم — 21 ملفًا جديدًا وتعديل رسائل ar/en.
- `AUTOMATED CHECKS`: نعم — lint/check/tsc/diff/build بـexit codes موثّقة في 31.4.
- `API VERIFIED`: نعم للقراءة/التحقق من areas/quote/coupon validation؛ لا يوجد order/proof write.
- `BROWSER VERIFIED`: لا — مطلوب من المالك.
- `ASTRA REVIEWED`: PENDING — مراجعة استشارية معلّقة.
- `OWNER APPROVED`: إذن G2 موجود؛ مراجعة/اعتماد نتيجة G2 لم تحدث بعد؛ G3 مقفول.
- التصنيف: `DAY 6 GATE 2 COMPLETE — SOURCE + CHECKS PASS — API READ-ONLY VERIFIED — BROWSER NOT TESTED — WAITING FOR OWNER REVIEW — G3 LOCKED`.

⛔ STOP — DAY 6 GATE 2 COMPLETE — WAITING FOR OWNER REVIEW — G3 LOCKED

---

## 32) Future Feature: Smart Egypt Address & Location System — Documentation-only Planning

### 32.1 الإذن والنطاق
- تكليف منفصل عن Day 6/G2: تخطيط مستقبلي فقط للعنوان الذكي/الموقع داخل مصر، دون فتح G3 أو أي Gate جديد.
- حُفظت كل تغييرات G0/G1/G2 الموروثة في working tree؛ لم يُلمس checkout source، ولا الباك source/schema/migrations/seed/env/config/dependencies.
- استُخدمت قراءة الكود والوثائق + بحث ويب للمصادر الرسمية فقط؛ لم تُجرى عمليات كتابة على البيانات أو مزوّدين خارجيين.

### 32.2 المستندات المضافة/المحدَّثة
| الملف | التغيير |
| --- | --- |
| `docs/FRONTEND_TASKS_10_DAYS.md` §7 | قسم `Future Feature: Smart Egypt Address & Location System`: الوضع الحالي، مقارنة UX A–D، ترشيح hybrid، معمارية فرونت مقترحة، states/a11y/i18n، مراحل وقرارات مفتوحة. |
| `../../backend/docs/FUTURE_SMART_EGYPT_ADDRESS_SYSTEM.md` (جديد) | تخطيط باك مستقبلي: حقائق schema/shipping الحالية، قاعدة فصل الجغرافيا عن قابلية التوصيل، نمذجة ومسارات API مقترحة غير مأذونة، تقييم مصادر البيانات، مراحل وتكلفة وخصوصية. |
| `../../backend/docs/BACKEND_PROGRESS.md` | سجل قصير بأن المستند الجديد تخطيط فقط. |
| `../../backend/docs/architecture.md` §9 | مرجع معماري cross-project إلى مستندي الفرونت/الباك مع بيان أن التنفيذ غير مأذون. |
| `docs/PROGRESS.md` §32 | سجل التخطيط الحالي. |

### 32.3 القرارات التخطيطية المسجلة
- **Existing:** العناوين نصية، لا جداول مرجعية جغرافية مؤكدة، والشحن يتم عبر `ShippingTariff`/`resolveShippingTariff` مع فشل صريح `SHIPPING_AREA_NOT_CONFIGURED`.
- **Invariant:** وجود منطقة في مصدر خرائط أو قاعدة حدود لا يعني قابلية التوصيل ولا يعني شحنًا مجانيًا.
- **UX recommendation:** Structured manual كbaseline، ثم browser location/reverse prefill اختياري، ثم autocomplete، ثم خريطة اختيارية مؤجلة؛ لا يُلغى المسار اليدوي.
- **Data/providers:** لا مزوّد معتمد بعد؛ OSM/Nominatim وPhoton وgeoBoundaries وGADM وGoogle/Mapbox/OpenCage موثّقة مع قيود الرخصة/الـrate limit/التكلفة/التشغيل.
- **Owner decisions:** مصدر البيانات، الرخصة، المزوّد، ملكية التحديث، مدة الاحتفاظ بالإحداثيات، نمذجة مناطق الشحن، هل الخريطة مطلوبة.

### 32.4 التحقق
- `git status --short` قبل التخطيط وبعده: نفس تغييرات G2 مصحوبة بملفات docs فقط؛ لم يظهر تغيير source/config/backend غير متوقع.
- فحوص قراءة فقط على الحالة النهائية: `npm run lint` ✅، `npm run check` ✅ (`0 failure(s), 0 warning(s)`) في الفرونت، و`npm run typecheck` ✅ في الباك.
- لا أوامر بناء أو خدمات شُغّلت في هذا التكليف لأن التغيير docs-only؛ فحوص G2 الآلية موثّقة في §31.4 وتبقى as-is.
- لا تنفيذ ولا seed ولا مفاتيح provider ولا endpoints جديدة.

### 32.5 الحالة
- `PLANNING COMPLETE`: نعم.
- `DOCUMENTATION ONLY`: نعم.
- `IMPLEMENTATION AUTHORIZED`: لا.
- `G3`: ما زال مقفولًا؛ مراجعة G2/Astra واعتماد المالك معلّقان.

SMART EGYPT ADDRESS SYSTEM — PLANNING COMPLETE — DOCUMENTATION ONLY — IMPLEMENTATION NOT AUTHORIZED

---

## 33) Day 6 — Gate 3: Guest Checkout Submission & Secure Receipt

### 33.1 الإذن والنطاق
- الإذن الصريح من المالك: `AUTHORIZATION — OM EMAN DAY 6 — GATE 3` بعد قبول G2/all (`اعتمدت كمل`)؛ G4 مقفول.
- قُدّمت خطة مسؤولية الملفات قبل الكود، ثم نُفّذ G3 فقط: إرسال النموذج المحقق إلى `POST /api/store/checkout`، وحفظ إيصال الجلسة، وصفحة نجاح `noindex`.
- لم يُلمس باك/DB/schema/migration/seed/env/config/dependencies/services/api slices/Redux slices/motion/ثيمات/ستايل عام. لم يُبدأ G4؛ لا proof upload، لا Cloudinary، لا track page، لا حساب/ login/cart merge.
- working tree الموروث من G0/G1/G2 وSmart Address بقي كما هو؛ لم تُصلَح انحرافات قديمة خارج نطاق G3.

### 33.2 الملفات المنفذة في المصدر
| الملف | المسؤولية |
| --- | --- |
| `hooks/useCheckoutSubmit.ts` (جديد) | تحويل القيم المحققة + بنود السلة + كود الكوبون + `guestToken` إلى payload واحد، منع double submit، حفظ الإيصال بعد 201، وإرجاع حالة submit typed بلا الاحتفاظ بالنتيجة. |
| `hooks/useOrderReceipt.ts` (جديد) | قراءة آمنة للإيصال من `sessionStorage` عبر `useSyncExternalStore` مع snapshot مستقر وتحديث عند back/forward/focus. |
| `components/ECommerce/Checkout/CheckoutSubmit.tsx` (جديد) | زر إرسال مع `disabled`/loading ورسالة خطأ مترجمة؛ لا نجاح وهمي. |
| `components/ECommerce/Checkout/OrderSuccess.tsx` (جديد) | عرض orderNumber وطريقة الدفع والمبالغ القادمة من الباك فقط؛ لا `trackingToken` في الرابط أو DOM. |
| `components/Skelton/CheckoutSuccessSkeleton.tsx` (جديد) | skeleton مطابق لصفحة الإيصال. |
| `app/[locale]/(Store)/checkout/success/{page,metadata,loading}.tsx` (جديدة) | route رفيع، metadata `isNoIndex: true`، وحالة تحميل. |
| `components/ECommerce/Checkout/CheckoutContent.tsx` (تعديل) | ربط `<form>` بـ hook الإرسال، تمرير كود الكوبون المطبَّق، تعطيل الإرسال مع البنود غير الصالحة، والانتقال للإيصال بعد الحفظ. |
| `components/ECommerce/Checkout/CheckoutPaymentMethod.tsx` (تعديل) | تعطيل اختيار الدفع أثناء الإرسال فقط. |
| `hooks/useCheckoutForm.ts` (تعديل) | إزالة الافتراض الصامت `paymentMethod: "COD"`؛ يجب اختيار طريقة الدفع صراحةً. |
| `lib/checkoutError.ts` (تعديل) | رسالة `networkUnclear` عند تعذّر تأكيد وصول الطلب (status 0). |
| `messages/ar.json`, `messages/en.json` (تعديل) | نصوص `checkout.submit/submitNotice/networkUnclear/receiptStorageFailed` ومساحة `orderSuccess.*`؛ نفس المفاتيح بالضبط. |
| `docs/PROGRESS.md`, `docs/DAY6_TASKS.md` (تعديل) | سجل التنفيذ والأدلة والفحوص وحالة البوابة. |

### 33.3 سلوك الإرسال والإيصال
- يمرّ الطلب عبر `usePlaceOrderMutation` من G1 إلى `POST /store/checkout`؛ لا `clientIp` ولا `clientUserAgent` من العميل لأن الـcontroller يملؤهما.
- `items` تُبنى من cart lines الحقيقية؛ `guestToken` يُقرأ من القارئ الحالي فقط ويُرسل عند وجوده؛ كود الكوبون المطبَّق يُرسل من preview ولا يُحسب خصم محلي.
- `paymentMethod` إجباري بلا افتراض؛ `COD` و`ONLINE_TRANSFER` كلاهما مسموح؛ لا واجهة إثبات تحويل ولا رابط دفع وهمي في G3.
- حارس `useRef` يُوضع قبل Zod/resolver ويبقى مفعولًا حتى إتمام الانتقال؛ الزر والـradio معطّلان أثناء الإرسال، ويُحرَّر فقط عند فشل تحقق محلي أو فشل API مؤكَّد. فشل الشبكة غير المؤكَّد يُبقي الإرسال مقفولًا مع رسالة `networkUnclear` ومنع إعادة المحاولة التلقائية.
- الإيصال يُحفظ في `sessionStorage` عبر `lib/orderReceipt.ts` بعد نجاح الطلب فقط، ثم تتم إعادة التوجيه إلى `/checkout/success`؛ لا fake success ولا إجمالي مُعاد حسابه. لو فشل حفظ الإيصال بعد نجاح الطلب تظهر رسالة `receiptStorageFailed` تؤكد إرسال الطلب وتمنع إعادة الإرسال.
- لا `trackingToken` في URL/canonical/metadata/DOM/analytics/logs/toasts/localStorage/cookies/Redux/third-party storage؛ الإيصال يبقى متاحًا لـG4 في جلسة المتصفح.
- success route يعرض المبالغ decimal strings والعملة من الرد本身، ويظهر رسالة مختلفة لـCOD وONLINE_TRANSFER دون أي إجراء إثبات في هذه البوابة.

### 33.4 الفحوص الآلية — أوامر منفصلة
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G3_LINT_EXIT=0`. |
| `npm run check` | `G3_CHECK_EXIT=0` — `218 code files`, `327 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G3_TSC_EXIT=0`. |
| `git diff --check` | `G3_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G3_BUILD_EXIT=0` — Turbopack compile + TypeScript + 35 route entries، success route `/[locale]/checkout/success`Dynamic `ƒ`، دون أخطاء. |

### 33.5 التحقق من العقد والبيئة
- عقد الباك المقرء مصدرًا: `paymentMethod` إجباري؛ `IGuestCheckoutResult` يحوي `orderId/orderNumber/trackingToken/paymentMethod/paymentId/totals`؛ المبالغ سلاسل عشرية؛ `CHECKED_OUT` للسلة عند وجود `guestToken`.
- أكواد الأخطاء المترجمة تشمل `CHECKOUT_EMPTY`, `CHECKOUT_INVALID_QUANTITY`, `PACKAGE_NOT_FOUND`, `PACKAGE_NOT_SALEABLE`, `PACKAGE_OUT_OF_STOCK`, `SHIPPING_AREA_NOT_CONFIGURED`, `TOO_MANY_REQUESTS`، ورسالة عدم وضوح الشبكة.
- `GET /api/store/settings` → `HTTP=200`, `CURL_EXIT=0` قبل التنفيذ؛ لم يُشغَّل أي service، ولم تُرسل أي عملية checkout/proof write.
- `API VERIFIED` للقراءة فقط؛ `CHECKOUT RUNTIME`: `NOT TESTED` لأن بيئة كتابة مأذونة صراحةً غير متاحة لهذا Gate.
- `BROWSER VERIFIED`: لا يوجد؛ فحص المتصفح/index/noindex/back/reload مطلوب من المالك في بيئة مأذونة.

### 33.6 مراجعة الـdiff
- `git status --short --untracked-files=all`: تغييرات G0/G1/G2/Smart Address الموروثة + ملفات G3 الجديدة/المعدّلة فقط.
- لا untracked خارج القائمة في 33.2؛ لا تغيير في `package.json`/lock/config/backend/styles/motion/store APIs.
- لا أسرار ولا tokens ولا logs في التغييرات؛ لا ملفات generated.

### 33.7 الحالة
- `IMPLEMENTED IN SOURCE`: نعم.
- `AUTOMATED CHECKS`: نعم — lint/check/tsc/diff/build بـexit codes موثّقة في 33.4.
- `API VERIFIED`: للقراءة فقط؛ لا order/proof write.
- `BROWSER VERIFIED`: لا — مطلوب من المالك.
- `ASTRA REVIEWED`: نعم — G3 `APPROVE_WITH_WARNINGS` بعد إصلاح البلوكَرز؛ `Blockers: NONE`، `Required changes: NONE`، `Scope compliance: PASS`، `G4_CLEAR: NO`.
- تحذيرات Astra المقبولة: `CheckoutPaymentMethod` يتعطّل أثناء `isSubmitting` لا `isLocked`، لكن الـ`inFlight ref` يمنع تكرار الطلب؛ القفل المستمر بعد فشل شبكة غير مؤكَّد أو حفظ إيصال يحتاج reload؛ لا تحقق متصفح أو كتابة مأذونة.
- `OWNER APPROVED`: إذن G3 موجود؛ مراجعة/اعتماد نتيجة G3 لم تحدث بعد؛ G4 مقفول.
- التصنيف: `DAY 6 GATE 3 COMPLETE — SOURCE + CHECKS PASS — ASTRA APPROVED WITH WARNINGS — WRITE RUNTIME NOT TESTED — WAITING FOR OWNER REVIEW — G4 LOCKED`.

⛔ STOP — DAY 6 GATE 3 COMPLETE — WAITING FOR OWNER REVIEW — G4 LOCKED

---

## 34) Day 6 — Gate 4: ONLINE_TRANSFER Payment Proof

### 34.1 الإذن والنطاق
- الإذن الصريح من المالك: `G4` بعد accept G3؛ G5/G6 مقفولان.
- قُدّمت خطة مسؤولية الملفات قبل الكود، ثم نُفّذ G4 فقط: رفع مباشر بإثبات موقَّع من `/api/uploads/sign-proof`، ثم `POST /api/store/payments/proof`، وعرض `PROOF_UPLOADED` بعد رد الباك فقط.
- لم يُلمس باك/DB/schema/migration/seed/env/config/dependencies/ uploads config / product image flow / G3 receipt contract / `store/paymentApi.ts` / `store/baseApi.ts` / interfaces / validation barrel. لم يُبدأ G5؛ لا Motion/Styling جديد، لا backend proxy، لا base64، لا public_id/upload_preset/hash إضافي.
- working tree الموروث من G0/G1/G2/G3 وSmart Address بقي كما هو؛ لم تُصلَح انحرافات قديمة خارج نطاق G4.

### 34.2 الملفات المنفذة في المصدر
| الملف | المسؤولية |
| --- | --- |
| `lib/proofUpload.ts` (جديد) | تحقق الصورة من `allowedFormats` والمIME والحجم ≤5MB، التحقق من `uploadUrl` مقابل `cloudName`، ثم FormData مباشر إلى Cloudinary بالحقول المطلوبة فقط، والتحقق من `secure_url` عبر Zod قبل إرجاعه. |
| `hooks/useProofUpload.ts` (جديد) | قراءة إيصال G3، حارس `ONLINE_TRANSFER`، توقيع جديد لكل محاولة، منعdouble submit، تحويل `grandTotal` إلى number عند حد الطلب فقط، ربط sign→upload→submit، تعيين `PROOF_UPLOADED` بعد رد الباك فقط، وترجمة 429/status 0/أخطاء العقد. |
| `components/ECommerce/Checkout/PaymentProofForm.tsx` (جديد) | نموذج معزول داخل success page: ملف إثبات، مرجع اختياري ≤100، أخطاء مترجمة، loading، وحالة نجاح `PROOF_UPLOADED`. |
| `components/ECommerce/Checkout/OrderSuccess.tsx` (تعديل) | تركيب مشروط للنموذج عندما `paymentMethod === "ONLINE_TRANSFER"` فقط؛ لا عرض له مع COD. |
| `messages/ar.json`, `messages/en.json` (تعديل) | مساحات `payment.form.*` و`payment.status.*` ورسائل `payment.errors.*` الجديدة؛ نفس المفاتيح بالضبط. |
| `docs/PROGRESS.md`, `docs/DAY6_TASKS.md` (تعديل) | سجل التنفيذ والأدلة والفحوص وحالة البوابة. |

### 34.3 سلامة المسار
- `signProof` يرسل `orderId/trackingToken` من إيصال الجلسة فقط عبر endpoint الموجود؛ التوقيع يُطلب من جديد في كل محاولة، ولا يُخزَّن أو يُعاد استخدامه.
- `uploadProofImage` يمنع أي file ليس JPG/JPEG/PNG/WebP، أو فارغًا، أو أكبر من 5MB؛ يرفض أي `uploadUrl` لا يطابق `https://api.cloudinary.com/v1_1/<cloudName>/image/upload`.
- حقول الـFormData هي بالضبط `file`, `api_key`, `timestamp`, `signature`, `folder`, `allowed_formats`؛ لا `upload_preset` ولا `public_id` ولا حقول موقَّعة إضافية ولا رفع عبر الباك.
- لا يُرسل `submitProof` إطلاقًا إلا بعد `response.ok` ووجود `secure_url` صالح من Cloudinary.
- `amount` يأتي فقط من `receipt.totals.grandTotal`، ويُحوَّل إلى number عند بناء الطلب، مع رفض القيم غير المنتهية وغير الموجبة و`> 1,000,000`؛ لا إدخال المستخدم ولا حساب محلي.
- طريقة الدفع literal `ONLINE_TRANSFER`؛ المرجع الاختياري يُقتطع ويُرسل فقط إذا非空؛ `trackingToken` لا يظهر في URL/canonical/metadata/DOM/analytics/logs/التقرير.
- حالة النجاح تُعرض فقط لو رجع `paymentProofResultSchema` بـ`paymentStatus === "PROOF_UPLOADED"`؛ أي حالة أخرى تعدّ خطأً غير متوقعًا ولا تُعرض كنجاح.
- فشل التوقيع أو الرفع أو الإرسال يترك الزر قابلًا لإعادة المحاولة؛ `inFlight ref` و`isBusy` يمنعان التكرار المتزامن؛ لا إعادة محاولة تلقائية ولا نجاح وهمي.

### 34.4 الفحوص الآلية — أوامر منفصلة
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G4_LINT_EXIT=0`. |
| `npm run check` | `G4_CHECK_EXIT=0` — `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G4_TSC_EXIT=0`. |
| `git diff --check -- .` | `G4_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G4_BUILD_EXIT=0` — Turbopack compile + TypeScript + 35 route entries، success route `/[locale]/checkout/success` Dynamic `ƒ`، دون أخطاء. |

> ملاحظة تنفيذ شفافة: تشغيل الفحوص الخمسة بالتوازي أدى إلى timeout لـ`lint` وإيقاع `build` بـ`ChildProcess.kill` بسبب تحميل الـshell؛ أُعيد تشغيل كلٍّ منهما منفصلًا بنجاح، والنتائج أعلاه من التشغيل النهائي المنفصل.

### 34.5 التحقق من العقد والبيئة
- عقد الباك المقرء مصدرًا: `/uploads/sign-proof` يُرجع `cloudName/apiKey/timestamp/signature/folder/allowedFormats/uploadUrl`؛ `/store/payments/proof` يستقبل `orderId/trackingToken/method/amount/proofImageUrl/transactionReference?` ويرجع `paymentId/paymentStatus`؛ حدود الرفع 5MB موثّقة في `STORE_BACKEND_TASKS.md`.
- أكواد الأخطاء المترجمة تشمل `ORDER_NOT_FOUND`, `ORDER_ACCESS_DENIED`, `PAYMENT_ALREADY_CONFIRMED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_METHOD_NOT_ONLINE`, `RATE_LIMITED`، مع معالجة خاصة لـHTTP 429 وstatus 0.
- لا `GET/POST` إلى sign-proof أو proof أو Cloudinary؛ لا صورة حقيقية، لا رد توقيع، لا `secure_url`، ولا orderId/trackingToken في أي سجل أو تقرير.
- `SIGN/PROOF RUNTIME`: `NOT TESTED` لأن بيئة proof/upload/write مأذونة غير متاحة؛ `BROWSER VERIFIED`: لا يوجد؛ `API VERIFIED`: للقراءة فقط من G0/G1/G3.

### 34.6 مراجعة الـdiff
- `git status --short --untracked-files=all`: G4 أضافت الملفات الثلاثة الجديدة وعدّلت `OrderSuccess` والرسائل والوثائق فقط؛ بقية الملفات غير المتتبعة/المعدّلة موروثة من Gates سابقة.
- `git diff -- package.json package-lock.json` فارغ في نطاق G4؛ لا backend/config/tooling/styles/motion/api slices جديدة.
- لا أسرار ولا tokens ولا logs في التغييرات؛ لا ملفات generated.
- External working-tree change observed at final G4 review: lib/siteContact.ts sets tiktok to "https://www.tiktok.com/@om_eman.herbs"; not made by G4, outside G4 authorization, left untouched; requires separate owner review.

### 34.7 الحالة
- `IMPLEMENTED IN SOURCE`: نعم.
- `AUTOMATED CHECKS`: نعم — lint/check/tsc/diff/build بـexit codes موثّقة في 34.4.
- `API VERIFIED`: للقراءة فقط؛ لا sign/upload/proof write.
- `BROWSER VERIFIED`: لا — مطلوب من المالك.
- `ASTRA REVIEWED`: نعم — G4 `APPROVE_WITH_WARNINGS` بعد إصلاح ترجمة `payment.errors.methodNotOnline`؛ `Blockers: NONE`، `Required changes: NONE`، `Scope compliance: PASS`، `G5_CLEAR: NO`.
- تحذيرات Astra المقبولة: لا sign/upload/proof write runtime ولا browser verification؛ بعض أخطاء `checkout.errors.*` تظهر عبر namespace آخر مع بقائها مترجمة؛ كل الأخطاء تظهر تحت حقل الملف؛ `uploadUrl` مطابق حرفيًا لعقد الباك الحالي؛ تحديثات حالة الوثائق.
- `OWNER APPROVED`: إذن G4 موجود؛ مراجعة/اعتماد نتيجة G4 لم تحدث بعد؛ G5 مقفول.
- التصنيف: `DAY 6 GATE 4 COMPLETE — SOURCE + CHECKS PASS — ASTRA APPROVED WITH WARNINGS — WRITE RUNTIME NOT TESTED — WAITING FOR OWNER REVIEW — G5 LOCKED`.

⛔ STOP — DAY 6 GATE 4 COMPLETE — WAITING FOR OWNER REVIEW — G5 LOCKED

---

## 35) Day 6 — Gate 5: CHECKOUT STYLE & MOTION

### 35.1 الإذن والنطاق
- الإذن الصريح من المالك بعد accept G4: `تمم اعتمنا واعمل G5`؛ نُفّذ `G5 — CHECKOUT STYLE & MOTION` فقط، وG6 ما زال مقفولًا.
- قُدّمت خطة مسؤولية الملفات قبل الكود، ثم أُضيف تعديل `CheckoutContent.tsx` لإشارة النجاح اللازمة لحركة زر الإرسال؛ لا عقد جديد ولا تغيير في واجهة هوك.
- لم يُلمس باك/DB/schema/migration/seed/env/config/dependencies/npm scripts/backend، ولا العقود أو الـvalidation أو RTK Query أو إيصال G3 أو مسار إثبات G4.
- خارج النطاق لم يُلمس: الهيدر/الفوتر/السلة/المنتجات/الصور، `R-G4-MAJOR`/`D3-RM`، GSAP/Lottie/Three/Sass، ألوان خام في المكوّنات، ولا مكتبة حركة جديدة.
- working tree الموروث بقي كما هو؛ لم تُصلَح الإضافات البصرية القديمة خارج هذا الـGate، ولم يُغيّر `lib/siteContact.ts` الخارجي عن G4.

### 35.2 الملفات المنفذة في المصدر
| الملف | المسؤولية |
| --- | --- |
| `components/ECommerce/Checkout/CheckoutStepper.tsx` (تعديل) | شريط تقدّم دلالي يعتمد على `activeStep`، وانزلاق خفيف للخطوة النشطة، مع حفظ وصول لوحة المفاتيح والتركيز. |
| `components/ECommerce/Checkout/CheckoutCoupon.tsx` (تعديل) | إعادة استخدام `Shake` للكوبون الخاطئ فقط، مع مفتاح إعادة تشغيل للحالة المحلية و`COUPON_INVALID` القادم من الباك؛ لا حركة على النجاح. |
| `components/ECommerce/Checkout/CheckoutSummary.tsx` (تعديل) | `Spotlight` عند hover + `BorderBeam` واحد فقط عند وجود رد coupon/shipping؛ إجماليات `PriceTag` تستخدم `CountUp` الموجود دون تغيير القيم المعروضة. |
| `components/ECommerce/Checkout/CheckoutSubmit.tsx` (تعديل) | تحوّل loading→check داخل زر الإرسال بعد نجاح الطلب وحفظ الإيصال فقط، مع نص مقروء لشاشات القرّاء. |
| `components/ECommerce/Checkout/CheckoutContent.tsx` (تعديل) | حالة نجاح محلية قصيرة قبل الانتقال للإيصال؛ الانتقال يُتخطّى تحت `prefers-reduced-motion`، ولا تؤخّر عرض فشل الطلب. |
| `components/ECommerce/Checkout/OrderSuccess.tsx` (تعديل) | رسم علامة صح بجانب حالة الطلب المؤكَّد؛ نفس الإيصال/props دون تغيير. |
| `components/ECommerce/Checkout/PaymentProofForm.tsx` (تعديل) | علامة صح drawn عند `PROOF_UPLOADED` فقط، دون تغيير منطق الرفع أو الرسائل. |
| `styles/animations.css` (تعديل) | keyframes وclasses دلالية لشريط الخطوات، وانزلاق النص، ورسم الصح، ودخول علامة الزر؛ كلها ضمن `prefers-reduced-motion`. |

### 35.3 سلامة الحركة والعقد
- لا حركة تزيد أو تخفي القيم: `CountUp` يعرض نفس أرقام `PriceTag`، والشريط يعكس `activeStep` الحالي، والعلامات تظهر فقط بعد `PROOF_UPLOADED` أو نجاح `placeOrder` وحفظ الإيصال.
- لا تأخير يخفي النجاح أو الفشل: أخطاء coupon/shipping/submit تظهر فورًا؛ انتقال الإيصال بعد علامة الصح يحدث بعد 520ms في الحركة العادية فقط، ويكون فوريًا تحت `prefers-reduced-motion`.
- `MotionConfig reducedMotion="user"` يغطي حركات `m.*`؛ فحوص `matchMedia` وCSS `@media (prefers-reduced-motion: reduce)` تغطي `CountUp` والانتقال والـkeyframes الجديدة.
- SSO/الصفحة فوق الـfold لا تعتمد على JS لإظهار المحتوى؛ الحركات الجديدة transform/opacity/width locally ولا تمنع التركيز أو الكيبورد.
- لا حركة على كل البطاقات: `BorderBeam` واحد داخل بطاقة الملخص فقط؛ `Spotlight` يعمل على أجهزة hover فقط؛ لا pulse/confetti جديد في G5.
- الألوان من tokens الأربعة الحالية عبر CSS variables/color-mix؛ لا hex/rgb داخل المكوّنات، ولا إضافة theme أو token جديد.

### 35.4 الفحوص الآلية — أوامر منفصلة
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G5_LINT_EXIT=0`. |
| `npm run check` | `G5_CHECK_EXIT=0` — `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G5_TSC_EXIT=0`. |
| `git diff --check -- .` | `G5_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G5_BUILD_EXIT=0` — Turbopack compile + TypeScript + 35 route entries، success route `/[locale]/checkout/success` Dynamic `ƒ`، دون أخطاء. |

### 35.5 مراجعة Astra
- `VERDICT: APPROVE_WITH_WARNINGS`؛ `Blockers: NONE`؛ `Required changes: NONE`؛ `Scope compliance: PASS`؛ `G6_CLEAR: NO`.
- أُصلح ملاحظتان بعد المراجعة الأولى: إعادة تشغيل `Shake` عند `COUPON_INVALID` من الباك، وإزالة التدرّج الفيزيائي من شريط الخطوات لصالح `var(--color-primary)`؛ أُعيد التحقق فبقيت التوصية `APPROVE_WITH_WARNINGS`.
- تحذيرات مقبولة: لا browser/visual matrix ولا اعتماد بصري نهائي من المالك؛ `styles/animations.css` كان فوق 200 سطر قبل G5 وأُضيفت له حركات الـGate وفق الخطة (فحص `check` لا يغطي CSS)؛ spinner المشترك في `components/ui/Button.tsx` خارج نطاق G5 لم يُلمس.

### 35.6 الحالة
- `IMPLEMENTED IN SOURCE`: نعم.
- `AUTOMATED CHECKS`: نعم — lint/check/tsc/diff/build بـexit codes موثّقة في 35.4.
- `API VERIFIED`: للقراءة فقط من G0/G1/G3/G4؛ لا shop write ولا proof runtime جديد.
- `BROWSER VERIFIED`: لا — مطلوب من المالك.
- `OWNER APPROVED`: إذن تنفيذ G5 موجود؛ الاعتماد البصري النهائي لم يحدث بعد.
- `ASTRA REVIEWED`: نعم — APPROVE_WITH_WARNINGS بلا blockers أو تغييرات مطلوبة.
- التصنيف: `DAY 6 GATE 5 COMPLETE — SOURCE + CHECKS PASS — ASTRA APPROVED WITH WARNINGS — BROWSER/VISUAL NOT TESTED — WAITING FOR OWNER VISUAL REVIEW — G6 LOCKED`.

⛔ STOP — DAY 6 GATE 5 COMPLETE — WAITING FOR OWNER VISUAL REVIEW — G6 LOCKED

---

## 36) Day 6 — Gate 6: المراجعة والتسليم — Verification Only

### 36.1 الإذن والنطاق
- الإذن الصريح: `G6 VERIFICATION ONLY`. الغرض تقرير كامل وتوصية Astra لا implementation.
- سُمح بتحديث `docs/PROGRESS.md` و`docs/DAY6_TASKS.md` بالأدلة والنتائج والـblockers فقط؛ لا إصلاح عيوب ولا فتح Gate آخر.
- لم يُلمس كود/باك/DB/schema/migration/seed/env/config/dependencies/npm scripts/routes/contracts، ولم تُنشأ أوصلة أوامر أو مكوّنات جديدة، ولم يُعمل commit/push/deploy.
- لا بيئة اختبار مأذونة ولا بيانات اختبار مقدَّمة؛ لذلك كل ما يحتاج متصفحًا أو طلبات كتابة أو رفعًا حقيقيًا أو تحققًا أمنيًا فعليًا سُجِّل `NOT TESTED`. لا طلبات حقيقية ولا صور إثبات ولا أرقام هواتف/tokens استُخدمت.
- طلب المالك «عاوز في المحافظات اعمل search جواها» خارج نطاق G6؛ سُجِّل كطلب مؤجّل ويحتاج إذنًا وتخطيطًا منفصلين.

### 36.2 أين يظهر نموذج إثبات التحويل فعليًا
- المسار الدقيق: `/{locale}/checkout/success` — `/ar/checkout/success` و`/en/checkout/success` — عبر `app/[locale]/(Store)/checkout/success/page.tsx:12`، وهو route ديناميكي في build.
- الصفحة تُركّب `OrderSuccess` فقط (`page.tsx:22-24`). لا يوجد نموذج إثبات داخل `app/[locale]/(Store)/checkout/page.tsx` ولا داخل `CheckoutContent`; الانتقال إليه يحدث بعد نجاح `POST /store/checkout` وحفظ الإيصال (`hooks/useCheckoutSubmit.ts:70-80`, `components/ECommerce/Checkout/CheckoutContent.tsx:42-64`).
- `OrderSuccess.tsx:17-33` يعرض skeleton ثم `ErrorState` عند غياب الإيصال؛ `OrderSuccess.tsx:98` يُركّب `<PaymentProofForm />` فقط عندما تكون `receipt.paymentMethod === "ONLINE_TRANSFER"`.
- الإيصال يُقرأ من `sessionStorage` بالمفتاح `oe.order.receipt` (`lib/orderReceipt.ts:4,18-34`) ويُتحقق منه بـ`orderReceiptSchema` (`validation/orderReceipt.ts:6-14`). لذلك لا يظهر النموذج لـCOD، ولا عند فتح success مباشرة، ولا في جلسة/متصفح جديد، ولا إذا تعذّر حفظ الإيصال.
- الخلاصة المصدرية لسبب عدم ظهور النموذج أثناء تصفّح المتجر: النموذج ليس عنصرًا عامًا في المتجر أو صفحة checkout؛ هو جزء من شاشة نجاح الطلب فقط وبشرط تحويل بنكي ضمن نفس الجلسة. لم يُتحقق بصريًا من هذه الخلاصة.

### 36.3 تتبّع المصدر — checkout/coupon/proof
- الكوبون اختياري في المصدر ولا يتوقف عليه الطلب: `validation/checkout.ts:35` يجعل `couponCode` optional؛ `lib/checkoutForm.ts:33,63` يحذف القيمة الفارغة ولا يُرسلها؛ لا شرط كوبون في `hooks/useCheckoutSubmit.ts`. لم يُختبر runtime.
- `IPaymentProofPayload` و`IPaymentProofResult` و`IUploadSignature` مربوطة بـRTK Query في `store/paymentApi.ts:16-40`: `POST /uploads/sign-proof` ثم `POST /store/payments/proof`، مع تحليل Zod للردود.
- `hooks/useProofUpload.ts:63-118` يمنع غير `ONLINE_TRANSFER`، يمنع الطلبات المتزامنة، يستخدم `receipt.orderId` و`receipt.trackingToken`، يشتق المبلغ من `receipt.totals.grandTotal`، ويجعل النجاح مشروطًا بـ`PROOF_UPLOADED`.
- `lib/proofUpload.ts:37-86` يتحقق من الامتداد/MIME والحجم (5MB) وعنوان الرفع، ويرسل حقول Cloudinary: `file`, `api_key`, `timestamp`, `signature`, `folder`, `allowed_formats`، ويقبل `secure_url` فقط تحت `https://res.cloudinary.com/`.
- `components/ECommerce/Checkout/PaymentProofForm.tsx:12-82` هو النموذج الوحيد؛ لا توجد نسخة مكرّرة.

### 36.4 تتبّع المصدر —Backend
- `POST /api/uploads/sign-proof` public ومحدود 10/ساعة (`backend/src/modules/uploads/routes.ts:36-42`)؛ يتحقق من `trackingToken` مقابل الطلب ويرفض COD و`CONFIRMED` (`backend/src/modules/uploads/service.ts:76-113`). لا يرفض `PROOF_UPLOADED` قبل إصدار توقيع جديد؛ `submitProof` يمنعه لاحقًا.
- التوقيع يغطي `{ folder, allowed_formats: "jpg,jpeg,png,webp", timestamp }` فقط عبر `CLOUDINARY_API_SECRET`، والمجلد `om-eman/proofs`، و`uploadUrl = https://api.cloudinary.com/v1_1/<cloud>/image/upload` (`backend/src/modules/uploads/service.ts:17-65`). لا `type: authenticated` ولا ربط `public_id` بالطلب.
- `POST /api/store/payments/proof` محدود 10/ساعة مع `optionalCustomer` (`backend/src/modules/store/payments/routes.ts:11-24`). يطلب `method: "ONLINE_TRANSFER"` و`trackingToken` بنمط 43–64 (`backend/src/modules/store/payments/validation.ts:4-18`).
- `backend/src/modules/store/payments/service.ts:36-100` يتحقق من الملكية بالـtoken أو الجلسة، يرفض `CONFIRMED` و`PROOF_UPLOADED` وCOD، يحدّث صف PENDING أو ينشئ صفًا جديدًا بعد الرفض، ثم يستدعي `refreshOrderPaymentStatus`.
- `backend/src/services/order-payment-status.service.ts:30-76` يشتق حالة الطلب: `CONFIRMED` ثم `PROOF_UPLOADED` ثم `PENDING` ثم `REJECTED`، ويحفظ القيمة في `Order.paymentStatus`.
- `backend/src/shared/cloudinary-url.ts:19-27` يقبل فقط HTTPS على `res.cloudinary.com`، وcloud name المطابق للإعداد، ومسار `/image/upload/...`؛ لا يتحقق من مجلد `om-eman/proofs` ولا من رابط الدفع الخاص. النتيجة المصدرية: صور الإثبات public-delivery ولا تُثبت خصوصيتها.

### 36.5 الفحوص الآلية — G6
| الأمر | النتيجة |
| --- | --- |
| `npm run lint` | `G6_LINT_EXIT=0`. |
| `npm run check` | `G6_CHECK_EXIT=0` — `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `G6_TSC_EXIT=0`. |
| `git diff --check -- .` | `G6_DIFF_CHECK_EXIT=0`؛ تحذيرات LF→CRLF اعتيادية فقط. |
| `npm run build` | `G6_BUILD_EXIT=0` — Turbopack + TypeScript، 35 route entries، `/[locale]/checkout/success` Dynamic `ƒ`. |

### 36.6 مراجعة Astra النهائية
- `VERDICT: BLOCKED / NO-GO` — اكتملت مراجعة source/static فقط؛ لا يُوصى باعتماد الإنتاج أو الاعتماد النهائي.
- `Blockers: B-G6-01` لا بيئة/بيانات مأذونة فكل checkout write وsign→upload→submit و`PROOF_UPLOADED` وbrowser/visual وnegative/security وretry `NOT TESTED`؛ `B-G6-02` فجوة سلامة/خصوصية الإثبات: `/image/upload` عام، وقبول URL داخل cloud دون ربط بالطلب/المجلد، وتوقيع يسمح `PROOF_UPLOADED`؛ `B-G6-03` كتابة الدفع وتحديث الحالة ليست transaction واحدًا ولا audit log في التدفق.
- `Required changes (تُسجَّل ولا تُنفَّذ في G6):` نتائج runtime/browser/security مأذونة، وربط URL بالإثبات/الطلب، وقرار خصوصية Cloudinary، ورفض `PROOF_UPLOADED` عند التوقيع، وatomicity + audit، ومطابقة Swagger واسم endpoint في وثيقة الباك.
- `Scope compliance: PASS`؛ `G6_CLEAR: NO`؛ 0 Critical، 3 Major، 2 Minor. الانحرافات موثّقة ولا تُصلَح داخل G6.

### 36.7 الحالة النهائية
- `Implemented in source`: نعم لـG1–G5؛ G6 لا implementation.
- `Automated checks passed`: نعم — 36.5.
- `Browser verified`: لا — `NOT TESTED`.
- `Runtime verified`: لا — `NOT TESTED`.
- `Security verified`: لا — مراجعة مصدر فقط، بلا رفع/تحقق خصوصية فعلي.
- `Owner accepted`: لا — مطلوب اعتماد المالك، والاعتماد البصري لـG5 ما زال معلّقًا.
- `ASTRA`: `BLOCKED / NO-GO`.
- التصنيف: `DAY 6 GATE 6 VERIFICATION COMPLETE — SOURCE + AUTOMATED CHECKS PASS — RUNTIME/BROWSER/SECURITY NOT TESTED — TECHNICAL HANDOFF ONLY — PRODUCTION SEAL REFUSED — OWNER ACCEPTANCE NOT RECOMMENDED — G6_CLEAR: NO`.

⛔ STOP — DAY 6 GATE 6 COMPLETE — WAITING FOR OWNER REVIEW

---

## 37) Day 6 — Payment Proof Security Remediation (Owner-authorized backend-only)

### 37.1 الإذن والنطاق
- إذن صريح من المالك بعد تقرير G6 لتحليل ثم إصلاح ثغرات إثبات الدفع داخل كود الباك فقط.
- سُمح بقراءة/تعديل backend source عند اللزوم؛ سُمح بتحديث `docs/PROGRESS.md` و`docs/DAY6_TASKS.md` بالنتائج.
- **لم يُلمس:** Frontend، Prisma schema/migration، DB أو SQL تنفيذي، Cloudinary dashboard/env، dependencies، cron، npm scripts، عقد API جديد، commit/push/deploy، أو إعادة ضبط working tree. الإضافات القديمة غير المتعلقة (مثل `frontend/lib/siteContact.ts` وملفات backend docs الموروثة) تُرِكت كما هي.
- لا بيئة اختبار مأذونة ولا بيانات حقيقية؛ لذلك رفع Cloudinary الفعلي، المتصفح، الدفع الحقيقي، والـruntime ما زالوا `NOT TESTED`. كل اختبارات هذا القسم mocked/unit أو فحص مصدر/type-check/build فقط.

### 37.2 الملفات المعدّلة ومسؤولية كل ملف
| الملف | المسؤولية |
| --- | --- |
| `backend/src/shared/proof-image.ts` | مجلد إثبات مرتبط بـ`orderId + trackingToken` عبر `hashToken`، والتحقق الصارم من رابط Cloudinary بدون dev fallback. |
| `backend/src/services/proof-audit.service.ts` | كتابة أحداث `AuditLog` بأسباب/code فقط، بلا token أو signature أو secret. |
| `backend/src/modules/uploads/proof-sign-policy.ts` | قرار السماح/الرفض لتوقيع الرفع: COD، الطلب المفقود، token، حالة الطلب/الدفع، و`PROOF_UPLOADED`. |
| `backend/src/modules/uploads/service.ts` | تنفيذ القرار داخل transaction، إصدار توقيع للمجلد المرتبط بالطلب، وتسجيل النجاح/الرفض. |
| `backend/src/modules/uploads/controller.ts` / `routes.ts` | تمرير سياق التدقيق و`optionalCustomer` إلى `sign-proof` دون تغيير شكل الـresponse. |
| `backend/src/modules/store/payments/proof-submit-policy.ts` | قرار قبول الإرسال: الملكية، حالة الطلب/الدفع، وربط صورة الإثبات بالطلب نفسه. |
| `backend/src/modules/store/payments/service.ts` | `Serializable` transaction + `updateMany` شرطي، منع صفّين للإثبات، تحديث حالة الطلب داخل المعاملة، وتدقيق النجاح/الرفض. |
| `backend/src/modules/payment/router.ts` | تقييد `GET /payments` و`GET /payments/:id` بـ`OWNER/ADMIN`؛ `STAFF` ممنوع. |
| `backend/src/modules/payment/service.ts` | إزالة `proofImageUrl` من البحث النصي `q`. |
| `backend/scripts/generate-modules.ts` | حفظ تقييد قراءة `Payment` واستبعاد `Payment.proofImageUrl` من `q` عند إعادة التوليد. |
| `backend/tests/unit/payment-proof-policy.test.ts` | اختبارات decision functions وصلاحية الموظف على route الفعلي. |
| `backend/tests/unit/payment-proof-service.test.ts` | اختبارات mocked للـconditional update، منع إنشاء إثبات ثانٍ، `P2034` retry، والـaudit. |

### 37.3 ما انغلق من ملاحظات G6
- `B-G6-02` (جزئيًا على مستوى المصدر): صار الـsign يرفض COD والطلب المفقود/high-risk states و`PROOF_UPLOADED`، ويستخدم مقارنة token ثابتة الوقت، ويصدر مجلدًا مرتبطًا بالطلب. صار الـsubmit يرفض رابطًا خارج Cloudinary أو رابطًا من طلب/token آخر، حتى مع غياب cloud name. لم يُغلق بند الخصوصية الفعلي: الرفع ما زال public `image/upload` لأن `type: authenticated` يحتاج Frontier change.
- `B-G6-03`: انغلق على مستوى المصدر: الإرسال داخل `Serializable` transaction، تحديث حالة الدفع شرطي، إنشاء صف جديد فقط بعد `REJECTED`، تحديث `Order.paymentStatus` داخل نفس المعاملة، و`AuditLog` للنجاح والرفض برموز أخطاء فقط.
- `B-G6-01`: لم يتغير؛ لا runtime/browser/API write/real upload مأذون. لا يجوز تحويل هذا الإصلاح المصدر إلى ادعاء تحقق حي.
- **Private Proof Images:** ما زال `EXTERNALLY BLOCKED / NO-GO`. التنفيذ الآمن يحتاج تعديل `frontend/lib/proofUpload.ts` لإرسال `type=authenticated`، وإضافة endpoint موقّع لتسليم الصورة للموظف المصرّح له، ومراجعة إعداد/خطة Cloudinary. كل ذلك خارج الإذن الحالي؛ لم يُطبَّق بديل أضعف.

### 37.4 الفحوص الآلية — Security Remediation
| الأمر | النتيجة |
| --- | --- |
| `npm run typecheck` (backend) | exit 0، بلا أخطاء TypeScript. |
| `npm run build` (backend) | exit 0. |
| `npx prisma validate` | `The schema at prisma\schema.prisma is valid 🚀`؛ لا تغيير schema. |
| `npm test` (backend) | `5 passed` test files، `47 passed` tests؛ تشمل الـ47 اختبارات الأصلية والمضافة. |
| `git diff --check -- Om-Eman/backend` | exit 0؛ تحذيرات LF→CRLF اعتيادية فقط. |
- لم يُشغَّل `npm run modules:generate` عمدًا لأنSchema لم يتغير وتشغيله قد يعيد كتابة ملفات مولّدة غير مرتبطة في working tree متسخ؛ المولّد نفسه معدَّل ومطابق للناتج المطلوب، وAstra أكّد المطابقة.

### 37.5 مراجعة Astra المستقلة
- `VERDICT: PASS` للإصلاح المأذون، بعد إعادة فحص الاختبارات الإضافية: `ASTRA-PPS-05 resolved`؛ لا blocker جديد.
- تحقّق Astra من قواعد التوقيع، ربط الرابط، atomicity/conditional update، التدقيق، تقييد `STAFF`، مطابقة المولّد، وعدم تجاوز النطاق المأذون. `Scope compliance: PASS`.
- ملاحظات منخفضة غير حاجزة سُجِّلت: فشل كتابة AuditLog عند الرفض يبقى best-effort حتى لا يُخفى خطأ الرفض الأصلي؛ مسار الإنشاء بعد `REJECTED` محمي بـ`SERIALIZABLE` مع retry وليس بقيد DB فريد (ممنوع تغيير Schema)؛ لا اختبار مزدوج المعاملات حقيقي؛ dev fallback ما زال في `cloudinary-url.ts` لكنه غير مستخدم في مسار الإثبات.
- لا ادعاء بـCloudinary/browser/production verification.

### 37.6 التصنيف النهائي لهذا الإصلاح
- `Implemented in source`: نعم —Backend فقط.
- `Automated checks passed`: نعم — 37.4.
- `Runtime / browser / real upload / production verified`: لا — `NOT TESTED`.
- `Private proof images`: `EXTERNALLY BLOCKED — FRONTEND + SIGNED DELIVERY + CLOUDINARY DECISION REQUIRED`.
- `G6 overall`: ما زال `BLOCKED / NO-GO`؛ هذا الإصلاح يعالج ملاحظات المصدر ولا يمنح production seal.
- `Astra remediation`: `PASS` مع ملاحظات منخفضة موثّقة.
- `Owner acceptance`: **ممنوح 2026-11-23** (`تمم اعتمدته`) لإصلاح المصدر وتحديثات §37 وآخر القرارات؛ لا يمنح production seal ولا يفتح Gate.

⛔ STOP — SECURITY REMEDIATION OWNER-ACCEPTED — NO IMPLEMENTATION AUTHORIZED

---

## 38) اعتماد المالك وخطة Day 7 (2026-11-23)

- **اعتماد المالك:** اعتُمدت تحديثات إصلاح إثبات الدفع في §37 وآخر القرارات: بقاء G6 `BLOCKED / NO-GO` لأسباب runtime/browser/env؛ تثبيت قرار الإيصال (`sessionStorage` بلا `trackingToken` في page URL/canonical/logs)؛ وتجميد الاركتيكتشر الحالية (App Router، ترتيب `Providers/`، `store/baseApi.ts`، `interface/`، `components/Skelton/`، `hooks/`، `components/Animation/`).
- **تصحيح قرار Cloudinary Proof Images:** آخر قرار صريح من المالك: **Public Cloudinary Delivery مقبول**؛ **Private Delivery ليس شرطًا لقبول Day 6**؛ **لا يوجد إذن لتنفيذ Private Delivery**. تُصحِّح هذه الصياغة أي إشارة أقدم في §37 أو `DAY6_TASKS.md` إلى private proof كشرط أو blocker خارجي، دون إعادة فتح النقاش أو أي تغيير تقني.
- **الخط المتبع في الملف:** `FRONTEND_TASKS_10_DAYS.md:31-43` §0.3 «الجدول المعدّل»، مرحلة `C — Storefront`: checkout ← تتبع ← حساب العميل. لم تُتبع خطة `FRONTEND_TASKS_10_DAYS.md:215` القديمة «اليوم 7 — Dashboard»؛ فهي مرجع تاريخي فقط. محتوى `FRONTEND_TASKS_10_DAYS.md:247-251` مرجع للمحتوى لا للمسارات لأن قرار الإيصال يمنع token في route الصفحة.
- **مكان الخطة الجديدة:** ملف مستقل [`DAY7_TASKS.md`](./DAY7_TASKS.md) — `اليوم 7 — Storefront: التتبع + حساب العميل + دمج السلة`، بنفس تقسيم الأيام: قواعد، هدف/نطاق، تدقيق، عقود، جرد ملفات، سجل مؤجلات، Gates بـ12 حقلًا، أوامر، مخاطر، قالب تقرير، ومراجعة Astra. طلب المالك: ملف لكل يوم، بلا إدماج في `DAY6_TASKS.md`.
- **المؤجلات المُوزَّعة داخل `DAY7_TASKS.md` §6:** `D7-TRACK`, `D7-ACCOUNT`, `D7-MERGE`, `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, `B-PUB`, انحرافات Day 5, `B-Build`, `R-PRIVATE-PROOF`, `R-G6-SEAL`. لا بند يفتح تلقائيًا؛ كل Gate يحتاج إذن مالك باسمه.
- **فجوة عقد مسجّلة:** لا يوجد endpoint لقراءة سلة العميل بعد `POST /api/store/cart/merge`؛ سلة الضيف تصبح `MERGED`. عرض «السلة بعد الدمج» محجوب حتى قرار باك منفصل؛ لا يُخترع endpoint ولا يُعاد استخدام توكن منتهي.
- **حالة Day 7 الآن:** `PLANNING ONLY — OWNER UPDATE/DECISIONS ACCEPTED — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED`.
- **تنظيم الملفات:** خطة Day 7 في ملف مستقل `frontend/docs/DAY7_TASKS.md`؛ `DAY6_TASKS.md` رجع Day 6 فقط بلا قسم Day 7؛ هذا الاعتماد موثّق هنا.
- **لا تغييرات أخرى:** صفر تعديل للاركتيكتشر/العقود/الباك/DB/env/deps/tooling/commit؛ working tree الموروث محفوظ كما هو.

## 39) G0 — DAY 7 PRE-FLIGHT (2026-11-23)

- **الإذن:** المالك قال: «عاوزين نبدا في اليوم السابع التنفيذ بنفس اسلوبنا gate وبعدها gate وتقف لحد اما اراجع كل واحده». فُهم كإذن صريح لتنفيذ `G0 — DAY 7 PRE-FLIGHT` فقط. **لا إذن لـG1** قبل مراجعة المالك لهذا الـGate واعتماده.
- **النطاق المنفَّذ:** docs/baseline فقط. صفر تعديل لكود/باك/DB/schema/migration/seed/env/deps/config/tooling. لا track UI ولا account ولا merge ولا إصلاح blockers. `DAY7_TASKS.md` لم يُعدَّل في G0 لأن نطاق الـGate ينص على `PROGRESS.md` فقط؛ هذا الملف هو الحاكم الحالي لحالة الـGate.
- **المقروء:** `frontend/AGENTS.md`، `PROGRESS.md` §37/§38، `DAY7_TASKS.md` §0/§3/§6/§7(G0)/§9/§11، وعقود `backend/src/modules/store/{track,auth,cart}/**` و`backend/src/services/customer-claim.service.ts`.

### 39.1 baseline الموثّق

| الفحص | النتيجة |
| --- | --- |
| `git status --short --untracked-files=all` | **clean tree** عند HEAD `36d1d96 End Day6`؛ `DAY7_TASKS.md` ملف متعقّب. تحذيرات `could not open directory .../.claude/skills/prisma-*/...` ضجيج موروث من روابط مفقودة، ليست تغييرات. هذا يلغي وصف «working tree dirty» في `DAY7_TASKS.md §0.12` كحالة تشغيل حالية. |
| منافذ `:3001` / `:3002` | `Get-NetTCPConnection -LocalPort 3001,3002` لا يُرجع أي مستمع؛ لا frontend ولا backend شغّالين وقت الـbaseline. |
| `npm run check` | `221 code files`، `344 message keys per locale`، `0 failure(s), 0 warning(s)`. |
| `npm run lint` | المحاولة الأولى بالتوازي مع الـbuild انقتلت: `Unknown: ChildProcess.kill (npm run lint )`. أُعيد تشغيلها منفردة ⇒ exit 0 بلا output. |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | exit 0 بلا أخطاء. |
| `npm run build` | exit 0؛ Next 16.4.5 Turbopack، compile 77s، TypeScript 13.1s، `35/35` static pages. ظهرت `[store] ... NETWORK_ERROR` لـ`settings/products/banners/categories` لأن الباك غير شغّال؛ لم يفشل الـbuild. انحراف `B-Build` التاريخي لم يتكرر في هذا الـbaseline. |
| المتصفح / API write | `NOT TESTED`؛ لا سcreenshots ولا tokens ولا طلبات register/login/merge/track. HTTP 200 ليس acceptance. |

### 39.2 العقود المؤكَّدة قراءة فقط

- Track: `GET /track/:trackingToken`، limiter `60/15د`، `ITrackedOrder` بلا هوية/عنوان/هاتف؛ `quantity/lineTotal` decimal strings؛ `placedAt/deliveredAt` تواريخ أو `null`.
- Auth: 8 endpoints، `authLimiter 10/15د`، `{ customer, token, expiresInDays }`، `devVerificationLink?` في dev فقط؛ `me/logout` بـBearer؛ لا refresh endpoint.
- Cart merge: `POST /cart/merge` بـ`authenticateCustomer` و`{ guestToken: 20..64 [A-Za-z0-9_-] }` ⇒ `{ mergedCartId: string | null }`؛ لا يعيد بيانات سلة جديدة.
- فجوة عقد ما زالت مسجّلة: لا endpoint لقراءة سلة العميل بعد الدمج؛ سلة الضيف تصبح `MERGED`. عرض السلة بعد الدمج `BLOCKED` حتى قرار باك منفصل.
- قرار Cloudinary المُصحَّح في §38 ساري: Public Delivery مقبول؛ Private Delivery غير مأذون وغير مطلوب لقبول Day 6.

### 39.3 تصنيف المؤجلات (من `DAY7_TASKS.md §6`)

| ID | الحالة بعد G0 |
| --- | --- |
| D7-TRACK / D7-ACCOUNT / D7-MERGE | مؤجلة إلى G2/G3/G4؛ لم تُفتح. |
| R-API-SEARCH / R-CART-WRITE | G0 يسجّل القيد فقط؛ لا إصلاح implementation. الباك غير شغّال ⇒ `NOT TESTED`. |
| R-VIS | 🟡 بانتظار مصفوفة Day 7 واعتماد المالك. |
| R-G4-MAJOR / D3-RM / Day 5 deviations / B-PUB | سجل فقط؛ لا إصلاح تلقائي، لا إعادة فتح أيام سابقة. |
| B-BUILD | مسجّل تاريخيًا؛ الـbuild نجح في هذا الـbaseline. |
| R-PRIVATE-PROOF | `NOT AUTHORIZED — NOT REQUIRED FOR DAY 6`؛ Public Delivery مقبول بقرار §38. |
| R-G6-SEAL | `BLOCKED / NO-GO`؛ لا production seal. |

### 39.4 القرارات المطلوبة من المالك قبل فتح G1

1. **تخزين توكن العميل:** (أ) memory فقط، (ب) `sessionStorage` بمفتاح واحد، (ج) route handler httpOnly جديد بطلب إذن منفصل. لا يُختار تلقائيًا؛ لا localStorage/cookie جديد بلا قرار.
2. **Google:** (أ) تأجيل Google إلى ما بعد G3 (email-only أولًا)، أو (ب) توفير `GOOGLE_CLIENT_ID` + إذن env/backend وGIS script منفصل.
3. **فجوة قراءة السلة بعد الدمج:** (أ) قبول القيد وإظهار رسالة محايدة عند `null`، أو (ب) فتح عمل باك منفصل بعقد قراءة سلة العميل.
4. **مسار التتبع:** تأكيد الإبقاء على `/{locale}/track` بلا `trackingToken` في route/canonical/logs، وفقًا لقرار الإيصال؛ أي اتجاه آخر يحتاج قرار جديد صريح.

> بدون إجابة واضحة على الأربعة، `G1 — DAY 7 CONTRACTS` يبقى مغلقًا. لا تخمين، لا اختيار افتراضي، لا كود.

- **منفّذ في المصدر:** لا شيء في G0؛ الوثيقة فقط.
- **فحص آلي:** انظر 39.1.
- **شوهد في متصفح:** لا شيء.
- **🟢 اعتمده المالك:** لا شيء بعد؛ G0 نفسه بانتظار المراجعة.
- **⛔ محجوب / لم يُختبر:** runtime، browser، API write، real data/env، production seal.
- **توصية Astra:** لم تُطلب بعد لهذا الـGate.
- **حالة Day 7 الآن:** `G0 EXECUTED — AWAITING OWNER REVIEW — G1 NOT AUTHORIZED`.

⛔ STOP — G0 EXECUTED — AWAITING OWNER REVIEW — G1 NOT AUTHORIZED

## 40) G1 — DAY 7 CONTRACTS & VALIDATION (2026-11-23)

> **الإذن:** المالك راجع G0 واعتمده، وأذن صراحة بتنفيذ `G1 — DAY 7 CONTRACTS & VALIDATION` بحدود `DAY7_TASKS.md §5.1/§5.2` ورسائل `track/account/cart.merge`. **لا إذن لـG2**، ولا انتقال تلقائي حتى مع توصية Astra.
> **مراجعة ما قبل التنفيذ:** رُوجعت قرارات G0 مقابل `store/baseApi.ts`, `store/cartApi.ts`, `lib/orderReceipt.ts`, `lib/cartToken.ts`, `lib/routes.ts`, `messages/{ar,en}.json`, `interface/`, `validation/` وعقود الباك. لم يظهر تعارض يمنع G1. التعارض الوحيد بين `DAY7_TASKS.md §5.2` (google endpoint مذكور) وقرار المالك «Google مؤجل بالكامل / Email-only / لا SDK ولا client ID ولا env» حُسم لمصلحة قرار المالك؛ انظر 40.3.
> **النطاق المنفَّذ:** عقود TypeScript، Zod، helpers، endpoints عبر `baseApi.injectEndpoints`، `prepareHeaders`، ورسائل ar/en فقط. صفر route/صفحة/Component/style/motion/backend/DB/migration/seed/env/env-config/deps/commit/push/deploy. لا طلب API write ولا track/me smoke لأن الباك غير شغّال وقت G0 ولم يُفتح runtime جديد.

### 40.1 جدول الملفات (Task ID | الحالة | الملف | المسؤولية | الدليل)

| Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل |
| --- | --- | --- | --- | --- |
| D7-CON-01 | ✅ جديد | `interface/track.ts` | `ITrackedOrder`, `ITrackedOrderItem`, `TOrderStatus`؛ التواريخ ISO strings والكميات/المبالغ decimal strings. | tsc + build |
| D7-CON-02 | ✅ جديد | `interface/customerAuth.ts` | `IStoreCustomer`, `ICustomerAuthResponse`, DTOs البريد، `IMergeCartPayload`, `IMergeCartResult`. | tsc + build |
| D7-CON-03 | ✅ تعديل | `interface/index.ts` | تصدير عقود track/customerAuth من barrel واحد. | tsc + check |
| D7-VAL-01 | ✅ جديد | `validation/track.ts` | token pattern `^[A-Za-z0-9_-]{43,64}$` + تحقق رد `ITrackedOrder` قبل الثقة به. | check + tsc |
| D7-VAL-02 | ✅ جديد | `validation/customerAuth.ts` | Zod مطابق لعقود register/verify/login/forgot/reset وردود customer/me/token. | check + tsc |
| D7-VAL-03 | ✅ جديد | `validation/cartMerge.ts` | Zod مطابق لـ`{ guestToken: 20..64 }` و`{ mergedCartId: string | null }`. | check + tsc |
| D7-VAL-04 | ✅ تعديل | `validation/index.ts` | تصدير كل schemas الجديدة من barrel.validation. | check + tsc |
| D7-HLP-01 | ✅ جديد | `lib/customerSession.ts` | helper واحد بـ`sessionStorage` (`oe.customer.session`) لحفظ/قراءة/مسح توكن العميل مع SSR guard وتحقق Zod. لا localStorage/cookie/route handler. | check + tsc |
| D7-HLP-02 | ✅ جديد | `lib/accountError.ts` | خريطة `code/status` إلى `account.errors.*` بلا raw message. | check + tsc |
| D7-HLP-03 | ✅ جديد | `lib/trackFormat.ts` | تنسيق التاريخ حسب locale ومفاتيح `track.status.*`/`track.paymentStatus.*` وETA من الرسائل فقط. | check + tsc |
| D7-HLP-04 | ✅ تعديل | `lib/cartError.ts` | إضافة `resolveCartMergeErrorKey` إلى `cart.merge.errors.*` دون تغيير cart error القديم. | check + tsc |
| D7-RTE-01 | ✅ تعديل | `lib/routes.ts` | `TRACK_HREF` و`ACCOUNT_HREF`/`ACCOUNT_*_HREF`؛ لا token في أي route. | check + tsc |
| D7-API-01 | ✅ جديد | `store/trackApi.ts` | `useGetTrackedOrderQuery` عبر `baseApi.injectEndpoints`؛ token فقط في مسار طلب الـAPI، لا tag ولا reports. | check + tsc + build |
| D7-API-02 | ✅ جديد | `store/authApi.ts` | register/verify/login/forgot/reset/logout/me (email-only) عبر baseApi؛ تحقق قبل الإرسال و parsing للردود. | check + tsc + build |
| D7-API-03 | ✅ تعديل | `store/cartApi.ts` | إضافة `mergeCart` mutation فقط + `useMergeCartMutation`؛ لا slice جديد ولا طلب فعلي. | check + tsc + build |
| D7-API-04 | ✅ تعديل | `store/baseApi.ts` | `prepareHeaders` يضيف `Authorization: Bearer <token>` عند وجوده؛ لا تغيير لـtagTypes/الـenvelope/الكاش. | check + tsc + build |
| D7-MSG-01 | ✅ تعديل | `messages/ar.json` | namespaces `track.*`, `account.*`, `cart.merge.*` بالعربية وICU صحيح. | check (450 keys) |
| D7-MSG-02 | ✅ تعديل | `messages/en.json` | نفس المفاتيح بالإنجليزية؛ `0 failure(s)` في تطابق ar/en. | check (450 keys) |
| D7-DOC-01 | ✅ تعديل | `docs/PROGRESS.md` | هذا السجل + تحديث header إلى G1. | git diff |

### 40.2 أدلة التحقق (أوامر منفصلة من `Om-Eman/frontend` إلا أوامر git)

- `npm run check` → **EXIT 0** — `Scanned 231 code files, 450 message keys per locale.` و`0 failure(s), 0 warning(s).` (كانت 221/344 في G0؛ +10 ملفات كود و+106 مفتاح رسالة).
- `npm run lint` → **EXIT 0** بلا output.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → **EXIT 0** بلا output.
- `npm run build` → **EXIT 0**؛ Next 16.4.5 Turbopack، compile ≈74s، TypeScript ≈12.4s، `35/35` static pages. ظهرت `[store] ... NETWORK_ERROR` لـ`settings/categories/banners/products` لأن الباك غير شغّال؛ لم يفشل الـbuild، ولا routes جديدة لـtrack/account في هذه البنية لأن G2/G3 لم تُفتحا.
- `git status --short --untracked-files=all` (من جذر الـworkspace) → Modified: `docs/PROGRESS.md`, `interface/index.ts`, `lib/cartError.ts`, `lib/routes.ts`, `messages/ar.json`, `messages/en.json`, `store/baseApi.ts`, `store/cartApi.ts`, `validation/index.ts`. Untracked G1: `interface/{customerAuth,track}.ts`, `lib/{accountError,customerSession,trackFormat}.ts`, `store/{authApi,trackApi}.ts`, `validation/{cartMerge,customerAuth,track}.ts`. تحذيرات `.claude/.windsurf` روابط مفقودة ضجيج موروث.
- `git diff --check` → لا تعارضات whitespace؛ تحذيرات LF→CRLF اعتيادية على Windows للملفات المعدّلة.
- `git diff --stat` → 9 ملفات متعقّبة، `+514/−5` (يشمل تعديلات G0/G1 على `PROGRESS.md`)؛ الملفات الجديدة غير المتعقّبة تظهر في `git status` فقط.
- `git diff -- package.json package-lock.json` → فارغ؛ لا تبعيات جديدة. لا diff للباك/DB/env/config/tooling.

### 40.3 الانحرافات/القيود الصادقة

- **Google مقصودًا غير منفَّذ:** لا `googleCredentialSchema`، لا `googleLogin` mutation، لا GoogleButton messages، لا `GOOGLE_*` error keys. قرار المالك «Email-only» يتقدم على ذكر google endpoint في خطة G1. هذا انحراف موثّق يحتاج تأكيد Astra/المالك؛ لا GIS script ولا `GOOGLE_CLIENT_ID`
 ولا env changes.
- `lib/customerSession.ts` يوفّر الحفظ/القراءة/المسح فقط؛ **لا استدعاء حفظ في authApi**، لذلك لا توكن يُخزَّن فعليًا قبل G3. `prepareHeaders` يقرأ التوكن فقط عند وجوده.
- `trackingToken` يظهر فقط كوسيط query ضروري لمسار `/store/track/:trackingToken`. لا يوجد في `TRACK_HREF`، canonical/metadata، messages، tagTypes، التقارير أو المتصفح (لا صفحة بعد).
- فجوة قراءة السلة بعد الدمج ما زالت `BLOCKED`: `mergeCart` يعيد `mergedCartId` أو `null` فقط؛ لا بنود/إجمالي ولا عرض سلة مختلقة. لا merge request أُرسل.
- SMTP/dev verification link/timezone لم تُختبر؛ `devVerificationLink` يبقى اختياريًا في العقد ولا يُعرض في G1.
- لا API smoke (track بتوكن محلي / `me` بدون توكن) لأن الباك غير شغّال وقت G0 ولم يُفتح runtime write أو بيئة اختبار جديدة. HTTP 200 ليس acceptance.
- Cloudinary Public Delivery كما هو؛ لا Private/Signed Delivery ولا تعديل uploads/proof.

### 40.4 الحالة والتوصيات

- **منفّذ في المصدر:** ملفات 40.1 فقط.
- **فحص آلي بنتيجة:** 40.2 — كل الفحوص خضراء؛ build ناجح مع رسائل NETWORK_ERROR بيئية موثّقة.
- **شوهد في متصفح:** لا شيء؛ G2/G3 لم تُفتحا.
- **🟢 اعتمده المالك:** G0 فقط. G1 نفسه بانتظار المراجعة؛ لا اعتماد تقني/بصري له بعد.
- **⛔ محجوب / لم يُختبر:** runtime/API write، المتصفح، Google، قراءة السلة بعد الدمج، dev link/بريد حقيقي، production seal.

**مراجعة Astra (مطلوبة — ملاحظات مقترحة من الأدلة):**
- **النطاق:** G1 التزم بالعقود/validation/endpoints/helpers/الرسائل؛ لا صفحات/UI/حركة/باك/env/deps/commit.
- **نقاط قوة:** Zod يطابق عقود الباك ويمنع وصول مدخلات خاطئة؛ decimal strings وISO dates لم تُحوَّل؛ `prepareHeaders` هو التعديل الوحيد في `baseApi`؛ sessionStorage معزول في helper واحد؛ لا توكن في route/canonical/tag/reports.
- **تحفظات:** (1) حذف Google من G1 انحراف عن جدول الملفات ويحتاج تأكيدًا صريحًا؛ (2) لا دليل runtime على track/auth/me؛ (3) RTK Query يحتفظ بوسيط الـquery داخليًا في cache key لتتبع الطلب — مقبول لأنه لا يُعرض في TAG/تقرير/URL، لكنه يبقى نقطة مراجعة خصوصية؛ (4) `devVerificationLink` يجب ألا يُعرض في production عند G3.
- **توصية:** **قبول تقني مشروط لمخرجات G1 كما هي**، مع عرض انحراف Google على المالك للعلم/التأكيد. **لا توصية بفتح G2** قبل موافقة المالك المنفصلة.

- **حالة Day 7 الآن:** `G1 EXECUTED — TECHNICALLY GREEN — AWAITING ASTRA/OWNER REVIEW — G2 NOT AUTHORIZED`.

⛔ STOP — G1 COMPLETE / PARTIAL — WAITING FOR OWNER APPROVA

## 41) G2 — DAY 7 TRACK (2026-11-23)

> **الإذن:** المالك راجع G1 واعتمده، وأذن صراحة بـ`G2 — DAY 7 TRACK` لصفحة `/{locale}/track` فقط. **لا إذن لـG3/G4/G5**، ولا فتح تلقائي لأي Gate أخرى.
> **Pre-flight:** قُرئ `AGENTS.md`؛ رُوجعت §39–§40 و`DAY7_TASKS.md §1.1/§3.1/§5.3/Gate 2`؛ فُحص تنفيذ G1 الفعلي (`trackApi.ts`, `interface/track.ts`, `validation/track.ts`, `lib/trackFormat.ts`)؛ حُفظت حالة الـworking tree بـ`git status --short --untracked-files=all`؛ رُوجع `useOrderReceipt` و`orderReceipt.ts`. لا تعارض بين العقد الفعلي والتوثيق، ولا Blocker في G1 يمنع G2. ملاحظة RTK Query الداخلية الخاصة بـcache key المسجّلة في §40.3 موروثة ومقبولة، وليست مانعًا.
> **النطاق المنفَّذ:** صفحة Track رقيقة + skeleton + hook واحد + 6 مكوّنات عرض. لا تعديل على أي ملف مصدر من ملفات G1؛ `PROGRESS.md` فقط هو الملف المعدّل من G1 (هذا القسم + الـheader). لا account/merge/google/cart/auth UI، لا motion جديد، لا providers/app router/gateway/slice/fetch/backend/DB/env/deps/commit/push/deploy.

### 41.1 الملفات والمسؤوليات (Task IDs)

| Task ID | الحالة | الملف | المسؤولية |
| --- | --- | --- | --- |
| D7-TRK-01 | ✅ جديد | `app/[locale]/(Store)/track/page.tsx` | صفحة Server رقيقة: `setRequestLocale`, `Suspense`, تركيب `TrackSection`. بلا token في المسار أو الصفحة. |
| D7-TRK-02 | ✅ جديد | `app/[locale]/(Store)/track/metadata.ts` | `buildMetadata()` بـ`TRACK_HREF` و`isNoIndex: true`؛ لا token في canonical/OG/title. |
| D7-TRK-03 | ✅ جديد | `app/[locale]/(Store)/track/loading.tsx` | غلاف `TrackSkeleton` مطابق للصفحة. |
| D7-TRK-04 | ✅ جديد | `components/ECommerce/Track/TrackSection.tsx` | منسّق الواجهة: يستدعي `useTrackLookup` ويمرّر البيانات للمكوّنات فقط. لا API مباشر ولا token للمكوّنات. |
| D7-TRK-05 | ✅ جديد | `components/ECommerce/Track/TrackLookupForm.tsx` | حقل إدخال يدوي محمي: submit واحد، تحقق عبر hook، مسح الحقل بعد الإرسال، زر العودة للإيصال عند وجوده. |
| D7-TRK-06 | ✅ جديد | `components/ECommerce/Track/TrackSummary.tsx` | رقم الطلب/الحالتان/التواريخ/ETA من `ITrackedOrder` فقط عبر `trackFormat.ts` والرسائل. |
| D7-TRK-07 | ✅ جديد | `components/ECommerce/Track/TrackTimeline.tsx` | خط زمني factual من `placedAt` والحالة الحالية و`deliveredAt` فقط؛ لا مراحل مختلقة. |
| D7-TRK-08 | ✅ جديد | `components/ECommerce/Track/TrackItems.tsx` | عرض البنود كنصوص decimal أصلية + `EmptyState` عند عدم وجود بنود؛ بلا `Number()`. |
| D7-TRK-09 | ✅ جديد | `components/ECommerce/Track/TrackState.tsx` | حالات initial/loading/error/empty برسائل مترجمة؛ لا raw backend/stack/SQL. |
| D7-TRK-10 | ✅ جديد | `components/Skelton/TrackSkeleton.tsx` | skeleton هيكلي بtokens المشروع فقط. |
| D7-TRK-11 | ✅ جديد | `hooks/useTrackLookup.ts` | يقرأ الإيصال عبر `useOrderReceipt`، يتحقق من token، يستدعي `trackApi`، يعيّن الأخطاء إلى مفاتيح `track.errors.*`، يمنع refetch التلقائي ويدعم retry الصريح لنفس token. |
| D7-DOC-02 | ✅ تعديل | `docs/PROGRESS.md` | هذا القسم + تحديث header إلى G2. |

### 41.2 أمر تنفيذ/logic مهم

- `useTrackLookup` يشتقّ الـtoken من `receipt.trackingToken` أو من الإدخال اليدوي بعد `trackingTokenSchema.safeParse`. لا storage key جديد، لا تعديل `oe.order.receipt`.
- `useGetTrackedOrderQuery` مُستدعَ بـ`refetchOnMountOrArgChange: false`, `refetchOnFocus: false`, `refetchOnReconnect: false` ⇒ لا إعادة طلب تلقائية عند 429/focus/reconnect. إعادة نفس الـtoken بعد فشل هي retry صريح من submit واحد.
- الحقل يُمسح فور submit؛ قيمة الـtoken لا تُعرض في DOM بعد الإدخال، ولا تُرسل كـprop لأي مكوّن عرض.
- خريطة الأخطاء: `status 0` → network؛ `429`/`TOO_MANY_REQUESTS` → rateLimited؛ `404`/`ORDER_NOT_FOUND` → notFound؛ `400`/`VALIDATION_ERROR` → validation؛ الباقي unexpected. `SerializedError` → unexpected. لا استخدام لـ`error.message` الخام.

### 41.3 أدلة التحقق (أوامر منفصلة، EXIT_CODE مسجَّل)

| الأمر | EXIT_CODE | النتيجة |
| --- | --- | --- |
| `npm run lint` | `0` | بلا output. |
| `npm run check` | `0` | `Scanned 242 code files, 450 message keys per locale.` + `0 failure(s), 0 warning(s).` (كانت 231/450 في G1؛ +11 ملف كود G2، بلا تغيير رسائل). |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `0` | بلا أخطاء. مُعيد تشغيله بعد إصلاح type widening لـ`SerializedError` في `useTrackLookup.ts`. |
| `git diff --check` | `0` | بلا whitespace errors؛ تحذيرات LF→CRLF اعتيادية على Windows. |
| `git diff --stat` | `0` | 9 ملفات متعقّبة، `+606/−5` (يشمل G0/G1/G2 على `PROGRESS.md`)؛ ملفات G2 تظهر كـuntracked في `git status`. |
| `git status --short --untracked-files=all` | `0` | G2 الجديدة: `track/{page,metadata,loading}.tsx`, `components/ECommerce/Track/{TrackSection,TrackLookupForm,TrackSummary,TrackTimeline,TrackItems,TrackState}.tsx`, `components/Skelton/TrackSkeleton.tsx`, `hooks/useTrackLookup.ts`. موروث G1 كما هو. تحذيرات `.claude/.windsurf` ضجيج روابط مفقودة. |
| `npm run build` | `0` | Next 16.4.5 Turbopack؛ compile 7.7s، TypeScript 10.1s، `38/38` static pages؛ `/[locale]/track`, `/ar/track`, `/en/track` ظهروا في جدول المسارات بلا token. `[store] ... NETWORK_ERROR` بيئي لأن الباك غير شغّال. |
| `powershell ... Get-NetTCPConnection -LocalPort 3001,3002 -State Listen` | `0` | `NO_LISTENERS_3001_3002` ⇒ لا frontend ولا backend متاحين/browser verification. |

**فحص ثابت إضافي للأمان:** grep على `app/[locale]/(Store)/track` ⇒ لا `trackingToken` في page/metadata/loading. grep على `components/ECommerce/Track` ⇒ تطابق واحد فقط `name="trackingToken"` (اسم حقل DOM، ليس قيمة التوكن). grep على `useTrackLookup.ts` ⇒ ثلاثة استخدامات فقط: استيراد الـschema، قراءة `receipt.trackingToken`، و`safeParse`. لا `console.*`, `analytics`, `localStorage`, `document.cookie`, `Number(`, `framer-motion` أو `motion/react` في ملفات G2.

### 41.4 الحالات المغطَّاة في المصدر

1. Initial: `TrackState` → `EmptyState` بـ`track.lookup.title` و`track.subtitle`.
2. Loading: `TrackState` → `TrackSkeleton` + `role="status"`/`common.loading`.
3. Success: `TrackSummary` + `TrackTimeline` + `TrackItems` من الرد فقط.
4. Invalid/Validation: `safeParse` يمنع الطلب ويعرض `track.lookup.invalid`.
5. Not Found: `ORDER_NOT_FOUND`/404 → `track.errors.notFound`.
6. Rate Limit: `TOO_MANY_REQUESTS`/429 → `track.errors.rateLimited` بلا refetch تلقائي.
7. Network: `status 0` → `track.errors.network`.
8. Empty: `items: []` → `track.items.empty` داخل `TrackItems`.
9. Manual Lookup: إدخال/تحقق/submit واحد + مسح الحقل + زر الرجوع للإيصال إن وُجد.

### 41.5 ما لم يتم اختباره وسببه

- **API Runtime Verification: NOT TESTED** — لا مستمع على `:3002`، لا توكن تتبّع حقيقي/محلي مأذون، وممنوع البيانات/Writes الوهمية. لم تُرسل أي طلب track فعلي؛ 404/429/network mappings مؤكدة من المصدر فقط.
- **Browser Verification: NOT TESTED** — لا مستمع على `:3001` أيضاً، ولم يُفتح متصفح. لم تُختبر مصفوفة no receipt/receipt/manual valid/invalid/404/429/network، ولا ar/en/RTL/LTR/360px/desktop/4 themes/keyboard، ولا فحص Console/Analytics/URL فعليًا. الفحص الثابت المذكور في 41.3 هو البديل Source-only.
- **Owner Visual Approval: PENDING** — لا 🟢 بصري لـG2.

### 41.6 مراجعة Astra (مطلوبة — G2 فقط)

- **Contract correctness:** يستهلك `trackApi`/`trackedOrderSchema` من G1 دون تعديل؛ لا أسماء حالات مختلقة؛ `deliveredAt=null` وETA `null` يعرضان رسائل `track.*`؛ `quantity/lineTotal` يبقيان strings؛ لا هوية/هاتف/عنوان في الواجهة.
- **Tracking Token security:** لا token في route/canonical/OG/JSON-LD/console/analytics/error reports؛ لا storage key جديد؛ الحقل يُمسح بعد submit؛ لا token يُمرّر للمكوّنات. RTK Query يحتفظ بالوسيط داخليًا في cache key (موروث من G1، مقبول في §40.3) لكنه غير معروض في TAG/تقارير/واجهة.
- **UI States:** الحالات التسع موجودة في المصدر (41.4)، معتمدة على coded keys فقط؛ runtime غير مختبر كما في 41.5.
- **Error handling:** خريطة `status/code` صريحة، `SerializedError` fallback، لا raw message/stack/SQL.
- **Accessibility:** `<label>` مرتبط، `aria-invalid`/`aria-describedby` للتحقق، `aria-live` للتحميل، focus-visible من primitives، native Enter/Tab. لم يُختبر بمتصفح.
- **RTL/LTR:** classes منطقية (`ps-`, `border-s`, `text-ink`) وتنسيق تاريخ عبر `useLocale`؛ لم يُختبر بصريًا.
- **Architecture compliance:** صفحة رقيقة، providers/app router/gateway/slice/fetch لم تُلمس، لا motion أو styling تجميلي جديد، لا G1 source edits، لا deps/config/backend/commit.
- **Diff/untracked:** 11 ملف G2 جديدة + `PROGRESS.md` فقط؛ الباقي موروث G1 كما سُجّل في §40.
- **توصية Astra:** **SOURCE-ACCEPT لـG2 كما هي، مع API/Browser Verification معلَّقة**. لا توصية بفتح G3 قبل موافقة المالك المنفصلة.

### 41.7 الانحرافات/Blockers والمشاكل القديمة الظاهرة

- لا انحراف عن نطاق G2؛ لا Blocker تقني.
- لا تعديل على رسائل G1؛ أُعيد استخدام `track.*` و`common.currencyEgp` كما هما.
- لم يُضف motion/styling تجميلي؛ Toast/Sonner لا يظهر في Track؛ لا component خارج القائمة.
- مشاكل قديمة ظهرت دون إصلاح خارج النطاق: `NETWORK_ERROR` في build، تحذيرات symlinks مفقودة في `git status`، تحذيرات LF→CRLF، Google المؤجل في §40، R-VIS ما زال 🟡.
- `trackingToken` لا يظهر في مسار المتصفح؛ لكنه يظل وسيطًا ضروريًا في مسار طلب API فقط وفق العقد.

### 41.8 KS-6 وحالة التسليم

- **KS-6:** `SOURCE COMPLETE` ✓ — صفحة `/{locale}/track` جاهزة وتقرأ الإيصال/الإدخال اليدوي بلا token في route/بيانات وصفية. `API VERIFIED: NOT TESTED` · `BROWSER VERIFIED: NOT TESTED` · `OWNER VISUAL APPROVAL: PENDING`.
- **Separation:** `Source Complete = YES` · `API Verified = NO` · `Browser Verified = NO` · `Owner Visual Approval = NO`.
- **حالة Day 7 الآن:** `G2 EXECUTED — SOURCE GREEN — API/BROWSER NOT TESTED — AWAITING ASTRA/OWNER REVIEW — G3 LOCKED`.

### 41.9 قرار المالك بعد G2 وتفويض G3 (2026-11-23)
| البند | الحالة المعتمدة |
| --- | --- |
| Source Implementation | `COMPLETE` |
| Automated Checks | `PASS` |
| API Runtime | `PENDING` |
| Browser Verification | `PENDING` |
| Owner Visual Approval | `PENDING` |
| KS-6 | `SOURCE COMPLETE / API PENDING / BROWSER PENDING` |

- **تفويض صريح:** المالك اعتمد G2 source-wise وأذن بتنفيذ `G3 — DAY 7 EMAIL AUTH` فقط.
- **قيد الحالة:** لا تُرفع `API Runtime` أو `Browser Verification` أو `Owner Visual Approval` إلى COMPLETE دون دليل فعلي؛ لا يُختم KS-6 كتجربة كاملة.
- **خارج G3:** Google، cart merge، تعديل G2، Dashboard، Backend/DB/env/deps/commit.

⛔ STOP — G2 COMPLETE / PARTIAL — WAITING FOR OWNER APPROVAL

## 42) G3 — DAY 7 EMAIL AUTH (2026-11-23)

> **الإذن:** المالك راجع G2 source-wise واعتمده، وأذن صراحةً بتنفيذ `G3 — DAY 7 EMAIL AUTH` فقط بعد §41.9. **لا إذن لـG4 Google/Cart Merge، ولا G5 Style/Motion**، ولا فتح تلقائي لأي Gate أخرى.
> **Pre-flight:** قُرئ `AGENTS.md`؛ رُوجعت §37–§41 و`DAY7_TASKS.md §3.2/§5.3/Gate 3`؛ فُحصت حالة working tree وملفات G1/G2 الفعلية (`authApi.ts`, `customerSession.ts`, `routes.ts`, `accountError.ts`, validation/messages)؛ لم يظهر تعارض مانع. قرار تخزين توكن العميل هو `sessionStorage` بمفتاح واحد كما في G1/G0؛ Google مؤجل بالكامل.
> **النطاق المنفَّذ:** Routes الستة للحساب، forms، `useCustomerAuth`، `customerSession`، `me`، و3 مفاتيح رسائل `account.status.*` فقط. لا Google/GoogleButton/GIS/client ID، لا cart merge، لا تعديل G2 أو Track، لا Dashboard/باك/DB/migration/seed/env/deps/config/tooling/commit.

### 42.1 الملفات والمسؤوليات (Task IDs)

| Task ID | الحالة | الملف | المسؤولية |
| --- | --- | --- | --- |
| D7-AUT-01 | ✅ تعديل | `lib/customerSession.ts` | helper واحد لتخزين/قراءة/مسح توكن العميل في `sessionStorage`، مع تحقق Zod وSSR guard وإشعار `useSyncExternalStore` عند تغيير الجلسة. |
| D7-AUT-02 | ✅ جديد | `hooks/useCustomerAuth.ts` | حالة الجلسة و`me` وكل mutations البريد؛ لا يُرجع التوكن؛ إعادة تعيين كاش RTK Query عند login/logout لمنع تسريب بيانات حساب سابق. |
| D7-AUT-03 | ✅ جديد | `components/Skelton/AccountSkeleton.tsx` | skeleton مطابق لشاشات الحساب/Nested routes. |
| D7-AUT-04 | ✅ جديد | `components/ECommerce/Account/AccountSection.tsx` | منسّق صفحة الحساب: logout/retry فقط، لا API مباشر. |
| D7-AUT-05 | ✅ جديد | `components/ECommerce/Account/AccountState.tsx` | guest/loading/error/authenticated بـ`EmptyState`/`ErrorState`/`AccountProfile`. |
| D7-AUT-06 | ✅ جديد | `components/ECommerce/Account/AccountProfile.tsx` | عرض بيانات `IStoreCustomer` المُتحقَّق منها من `me` فقط. |
| D7-AUT-07 | ✅ جديد | `components/ECommerce/Account/AccountFormCard.tsx` | غلاف عرض مشترك لكل النماذج؛ أُضيف لتفادي تكرار class block. |
| D7-AUT-08 | ✅ جديد | `components/ECommerce/Account/AccountFormField.tsx` | حقل تسمية/إدخال مشترك. |
| D7-AUT-09 | ✅ جديد | `components/ECommerce/Account/AccountFormError.tsx` | عرض رسالة الخطأ المترجمة من coded key. |
| D7-AUT-10 | ✅ جديد | `components/ECommerce/Account/LoginForm.tsx` | RHF + Zod + Toast بعد الرد + منع الإرسال قبل `isValid` + انتقال للحساب بعد النجاح. |
| D7-AUT-11 | ✅ جديد | `components/ECommerce/Account/RegisterForm.tsx` | حقول اختيارية تُحوَّل إلى `undefined`، ورابط تحقق dev فقط عند وجوده. |
| D7-AUT-12 | ✅ جديد | `components/ECommerce/Account/VerifyEmailForm.tsx` | قراءة `token` من query تحت `Suspense` + تحقق Zod. |
| D7-AUT-13 | ✅ جديد | `components/ECommerce/Account/ForgotPasswordForm.tsx` | رسالة نجاح عامة مهما كانت نتيجة البريد. |
| D7-AUT-14 | ✅ جديد | `components/ECommerce/Account/ResetPasswordForm.tsx` | قراءة `token` من query + كلمة مرور جديدة + انتقال للدخول. |
| D7-AUT-15 | ✅ جديد | `app/[locale]/(Store)/account/{page,metadata,loading}.tsx` | حساب العميل: noindex، skeleton، `setRequestLocale`. |
| D7-AUT-16 | ✅ جديد | `app/[locale]/(Store)/account/login/{page,metadata,loading}.tsx` | تسجيل الدخول: noindex + Suspense. |
| D7-AUT-17 | ✅ جديد | `app/[locale]/(Store)/account/register/{page,metadata,loading}.tsx` | إنشاء الحساب: noindex + Suspense. |
| D7-AUT-18 | ✅ جديد | `app/[locale]/(Store)/account/verify-email/{page,metadata,loading}.tsx` | تأكيد البريد: noindex + Suspense حول `useSearchParams`. |
| D7-AUT-19 | ✅ جديد | `app/[locale]/(Store)/account/forgot-password/{page,metadata,loading}.tsx` | نسيان كلمة المرور: noindex + Suspense. |
| D7-AUT-20 | ✅ جديد | `app/[locale]/(Store)/account/reset-password/{page,metadata,loading}.tsx` | إعادة التعيين: noindex + Suspense حول `useSearchParams`. |
| D7-AUT-21 | ✅ تعديل | `messages/{ar,en}.json` | 3 مفاتيح متطابقة: `signedIn`, `emailVerified`, `resetLinkSent`. |
| D7-DOC-03 | ✅ تعديل | `docs/PROGRESS.md` | هذا القسم + تحديث header إلى G3. |

### 42.2 أمر تنفيذ/logic مهم

- `useCustomerAuth` يقرأ الجلسة عبر `useSyncExternalStore` من helper واحد؛ `getServerSnapshot` يُرجع `null`، و`prepareHeaders` في `baseApi` هو من يضيف `Bearer` إلى `me/logout`. لا يوجد توكن في props/DOM/canonical/OG/JSON-LD/tag/تقرير.
- `useGetCustomerProfileQuery` يعمل فقط عند وجود جلسة؛ `guest` لا يُرسل `me`. عند logout يُمسح التوكن محليًا حتى لو فشل طلب logout، وتُعاد تهيئة كاش RTK Query قبل/بعد تغيير الهوية لمنع عرض بيانات حساب سابق.
- `login` يحفظ التوكن بعد `unwrap` الناجح فقط؛ `register` لا يسجّل دخولًا تلقائيًا ويعرض `devVerificationLink` فقط في غير production؛ `forgot` رد عام؛ `verify/reset` يقرآن token من query.
- كل forms تستخدم `zodResolver` مع `mode: "onChange"`، وزر الإرسال معطّل حتى `isValid`، و`inFlight` داخل event handler يمنع الطلب المكرر، ولا يوجد toast نجاح قبل الرد. الأخطاء المُرمَّزة تُترجم إلى `account.errors.*`؛ لا raw message/stack/code.
- `429/401/409/400` تقابل مفاتيح منفصلة في `lib/accountError.ts` و`messages/account.errors`؛ `status 0` ⇒ network.
- semua صفحات الحساب رقيقة، noindex، تستخدم `setRequestLocale` و`buildMetadata` و`Suspense` مع `AccountSkeleton`؛ `useSearchParams` محاط بـSuspense.

### 42.3 أدلة التحقق (أوامر منفصلة، EXIT_CODE مسجَّل)

| الأمر | EXIT_CODE | النتيجة |
| --- | --- | --- |
| `npm run lint` | `0` | بلا output بعد إصلاح `react-hooks/refs` واعتماديات `useCallback` في النماذج الخمسة. |
| `npm run check` | `0` | `Scanned 273 code files, 453 message keys per locale.` + `0 failure(s), 0 warning(s).` (كانت 242/450 في G2؛ +31 ملف كود G2+G3 و+3 مفاتيح G3). |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | `0` | بلا أخطاء، مُعاد تشغيله بعد إعادة تعيين كاش الجلسة. |
| `git diff --check -- .` | `0` | بلا whitespace errors؛ تحذيرات LF→CRLF اعتيادية على Windows. |
| `git diff --exit-code -- package.json package-lock.json` | `0` | بلا output ⇒ لا تغيير في الحزم. |
| `npm run build` | `0` | Next 16.4.5 Turbopack؛ compile 7.0s، TypeScript 8.8s، `56/56` static pages؛ ظهرت مسارات الستة للحساب في جدول المسارات بلا token. `[store] ... NETWORK_ERROR` بيئي لأن الباك غير شغّال؛ لا يفشل الـbuild. |
| `netstat -ano` على 3001/3002 | `0` | بلا مستمعين ⇒ لا frontend/backend، وبالتالي لا API runtime ولا browser verification. |

### 42.4 الحالات المغطَّاة في المصدر

1. Guest: `/account` ⇒ `EmptyState` برابطَي login/register.
2. Loading: توكن موجود و`me` لم يرد ⇒ `AccountSkeleton` + `role="status"`.
3. Authenticated: بيانات `me` من الباك فقط ⇒ `AccountProfile` مع زر logout.
4. Error: فشل `me` ⇒ coded key + retry؛ لا فتح للحساب عند أي فشل تسجيل دخول/تحقق/تعيين كلمة مرور.
5. Validation: الحقول المفقودة/غير الصالحة تمنع الطلب عبر `isValid` + Zod؛ رسالة تحقق عامة.
6. Mutation feedback: Toast نجاح/خطأ فقط بعد الرد؛ registration dev link في dev فقط.
7. Rate limit/credentials/conflict/token/session errors: مفاتيح منفصلة ومتطابقة ar/en.
8. RTL/LTR: مسارات داخلية عبر `@/i18n/navigation` و`lib/routes.ts`، بلا `/ar/` أو `/en/` hard-coded.

### 42.5 ما لم يتم اختباره وسببه

- **API Runtime Verification: NOT TESTED** — لا مستمع على `:3002`، لا بريد/token حقيقي مأذون، وممنوع البيانات/Writes الوهمية. لم تُرسل طلبات register/verify/login/forgot/reset/me/logout فعلية؛ الخرائط مؤكدة من المصدر فقط.
- **Browser Verification: NOT TESTED** — لا مستمع على `:3001` أيضاً، لم يُفتح متصفح. لم تُختبر مصفوفة reload/back-forward/360px/desktop/RTL/LTR/4 themes/focus-visible.
- **Owner Visual Approval: PENDING** — لا 🟢 بصري لـG3.

### 42.6 مراجعة Astra (مطلوبة — G3 فقط)

- **Contract correctness:** كل endpoints من `authApi.ts` المُعتمد في G1؛ لا Google endpoint ولا cart merge؛ login/register/verify/forgot/reset/logout/me فقط؛ لا حقول مختلقة.
- **Token security:** `oe.customer.session` في `sessionStorage` فقط عبر helper واحد؛ SSR guard؛ Zod pattern؛ لا token في route/canonical/OG/JSON-LD/analytics/console/تقارير؛ `Bearer` في `prepareHeaders` فقط؛ لا localStorage/cookie جديد.
- **Failure isolation:** أي `errorKey` من mutation يبقي المستخدم خارج الحساب؛ logout يمسح التوكن محليًا حتى عند خطأ الشبكة؛ إعادة تعيين الكاش تمنع عرض profile قديم بعد تبديل الهوية.
- **Validation/i18n:** Zod لكل نموذج؛ رسائلcoded متطابقة ar/en؛ 3 مفاتيح جديدة فقط؛ لا نص عربي hard-coded في الكود؛ لا raw backend message.
- **UI states/a11y:** skeleton/guest/error/authenticated موجودة؛ labels مرتبطة؛ `aria-invalid`/`aria-describedby` و`role="alert"`؛ focus-visible من primitives. لم يُختبر بصريًا.
- **Architecture compliance:** صفحات رقيقة، hooks منفصلة، مكوّنات عرض صغيرة، لا motion/styling تجميلي جديد، لا تعديل G2 source، لا باك/deps/env/commit.
- **Diff/untracked:** 31 ملف G3 جديدًا (18 ملف route + 11 مكوّنًا + `AccountSkeleton` + `useCustomerAuth`) + تعديلات G3 على `customerSession.ts`, `validation/customerAuth.ts`, messages وPROGRESS؛ بقية التعديلات/الملفات غير المتتبعة موروثة G0/G1/G2 كما سُجّلت.
- **توصية Astra:** **SOURCE-ACCEPT لـG3 كما هي، مع API/Browser Verification معلَّقة**. لا توصية بفتح G4 أو G5 قبل موافقة المالك المنفصلة.

### 42.7 الانحرافات/Blockers والمشاكل القديمة الظاهرة

- **انحراف صغير موثّق:** أُضيف `AccountFormCard.tsx` و`AccountFormField.tsx` و`AccountFormError.tsx` خارج جدول §5.3 لتفادي تكرار class block وتطبيق قاعدة «القطع الصغيرة/إعادة الاستخدام»؛ لا سلوك إضافي ولا Gate لاحق.
- **تعديل G1 محدود:** أُضيفت هذه المرة أنواع `TVerifyEmailForm` و`TForgotPasswordForm` إلى `validation/customerAuth.ts` نتيجة استخدام forms؛ لا تغيير للـschemas ولا للعقود. لا تعديل على `authApi.ts` أو `interface/customerAuth.ts` في G3، ونُقّح `baseApi.ts` من G1 فقط (prepareHeaders المصرَّح به).
- لم يُضف Google أو cart merge أو motion أو styling تجميلي؛ KS-8 ما زال مفتوحًا.
- مشاكل قديمة ظهرت دون إصلاح خارج النطاق: `NETWORK_ERROR` في build، تحذيرات symlinks في `git status`، تحذيرات LF→CRLF، R-VIS 🟡، Google المؤجل.
- لا يوجد دليل runtime على `devVerificationLink` نفسه؛ التنفيذ يمنعه في production ويخفيه في absence الرد.

### 42.8 KS-7 وحالة التسليم

- **KS-7:** `SOURCE COMPLETE` ✓ — المسار البريدي من register/verify/login/me/logout جاهز. `API VERIFIED: NOT TESTED` · `BROWSER VERIFIED: NOT TESTED` · `OWNER VISUAL APPROVAL: PENDING`.
- **Separation:** `Source Complete = YES` · `API Verified = NO` · `Browser Verified = NO` · `Owner Visual Approval = NO`.
- **حالة Day 7 وقت G3:** `G3 EXECUTED — SOURCE GREEN — API/BROWSER NOT TESTED — AWAITING ASTRA/OWNER REVIEW — G4/G5 LOCKED` (اعتمدها المالك لاحقًا source-wise؛ الحالة الحالية في §43).

✅ G3 اعتمده المالك source-wise: `Source Implementation = COMPLETE` · `Automated Checks = PASS` · `API Runtime = NOT TESTED` · `Browser Verification = NOT TESTED` · `Owner Visual Approval = PENDING`. نجاح `build`/TypeScript ليس دليلًا على نجاح login فعلي.

### 43. G4 — DAY 7 CART MERGE ONLY

- **الإذن:** المالك راجع G3 source-wise وأذن صراحةً بتنفيذ جزء **Cart Merge Only** من `G4 — DAY 7 GOOGLE & CART MERGE`. Google Authentication خارج النطاق تمامًا.
- **قبل التنفيذ:** رُوجعت `AGENTS.md`، `PROGRESS.md` §39–§42، `DAY7_TASKS.md` §3.3/§4/§5/§Gate 4، وملفات `G1/G2/G3`، وحالة Git. عُرضت قائمة الملفات المتوقع تعديلها ومسؤوليتها قبل أي تعديل مصدر.
- **الملفات المنفَّذة:**
  - `hooks/useCartMerge.ts` جديد: hook واحد يقرأ Guest Token عبر `useCartToken` وCustomer Token عبر `readCustomerToken`، يرسل `useMergeCartMutation`، يمنع التكرار، ويرجع `status` و`errorKey` مترجمًا.
  - `components/ECommerce/Account/LoginForm.tsx` تعديل: يستدعي `merge()` بعد نجاح Email Login فقط، يضيف `isMerging` إلى حالة التحميل، ويعرض `cart.merge.success` أو `cart.merge.notActive` أو coded error عبر `toast`.
  - `docs/PROGRESS.md` تعديل: هذا القسم وتحديث Header.
  - لا تعديل: `messages/ar.json`, `messages/en.json`, `store/cartApi.ts`, `store/baseApi.ts`, `lib/cartToken.ts`, `hooks/useCartToken.ts`, `lib/customerSession.ts`, `validation/cartMerge.ts`؛ العقد الحالي ومفاتيح الرسائل كافية.
- **العقد والترتيب:** Login ناجح → `saveCustomerToken` داخل `useCustomerAuth` → قراءة Guest Token الحالي → `POST /store/cart/merge` بـ`Authorization: Bearer` وbody `{ guestToken }` → تحليل الرد عبر `mergeCartResultSchema`. لا Merge قبل نجاح Login، ولا من Register/Forgot/Reset/Verify/Account load.
- **منع التكرار/الأمان:** `inFlight ref` يمنع double-submit داخل نفس العملية، و`CONSUMED_GUEST_TOKENS Set` يمنع إعادة إرسال نفس Guest Token بعد رد ناجح أو `null` داخل نفس JS runtime. لا Automatic Retry، لا Merge بدون كلا التوكنين الصالحين، لا token في Logs، لا تخزين `mergedCartId` ولا Storage Key جديد.
- **النتيجة:** `mergedCartId: string` ⇒ `cart.merge.success`؛ `null` ⇒ `cart.merge.notActive` رسالة محايدة؛ `401/session` ⇒ unauthorized؛ `status 0` ⇒ network؛ لا Automatic Retry؛ لا عرض بنود/إجمالي/كمية لأن العقد لا يوفرها.
- **تحققات آلية منفصلة:**
  - `npm run lint` ⇒ Exit `0` بلا output.
  - `npm run check` ⇒ `Scanned 274 code files, 453 message keys per locale.` + `0 failure(s), 0 warning(s).` + Exit `0`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` ⇒ no output / Exit `0`.
  - `git diff --check` ⇒ Exit `0` مع تحذيرات LF→CRLF اعتيادية.
  - `git diff --exit-code -- package.json package-lock.json` ⇒ no output / Exit `0`.
  - `git diff --stat` ⇒ Exit `0`; tracked diff: `9 files changed, 753 insertions(+), 5 deletions(-)`؛ الملفات الجديدة غير المتتبعة لا تظهر في stat بل في status.
  - `git status --short --untracked-files=all` ⇒ Exit `0`; الملف الجديد `hooks/useCartMerge.ts` ظاهر، وتعديل `LoginForm` داخل untracked G3 file؛ بقية التعديلات/الملفات غير المتتبعة موروثة من G0–G3 ولم يُعد ضبطها.
  - `npm run build` ⇒ Exit `0`; Next `16.4.5` Turbopack; compile `13.2s`; TypeScript `39.5s`; `56/56` static pages; لا أخطاء NETWORK_ERROR في هذه المرة.
- **Runtime/Browser:** `API Runtime Verification = NOT TESTED` — رُصد مستمع على `:3002` أثناء التحقق، لكن لا Customer Token ولا Guest Token حقيقي مأذون بهما؛ لم يُرسل أي `POST /cart/merge` فعلي. `:3001` لا مستمع عليه؛ لم تُفتح متصفح. `Browser Verification = NOT TESTED`; `Owner Visual Approval = PENDING`.
- **مراجعة Astra (مطلوبة — G4 فقط):** فُحص Contract Compliance (`POST /store/cart/merge`، Bearer، `{ guestToken }`، `mergedCartId|null`)، Token Handling (sessionStorage/localStorage الحاليان فقط، بلا تخزين جديد أو logs)، Merge Timing (بعد Login فقط)، Duplicate Prevention، Error Mapping، Cart State Consistency، Architecture (hook صغير + تعديل form واحد)، Security، وDiff/Untracked Files. **التوصية:** `SOURCE-ACCEPT لـG4 Cart Merge كما هي، مع API/Browser Verification معلَّقة`; لا توصية بفتح Google أو G5 قبل إذن مالك جديد.
- **KS-8:** `SOURCE COMPLETE` ✓ — الدمج مرتبط بنجاح Email Login، مرة واحدة لكل guestToken صالح، والنتيجة مترجمة بلا سلة مختلقة. `API VERIFIED: NO` · `BROWSER VERIFIED: NO` · `OWNER VISUAL APPROVAL: NO`. لا يُختم KS-8 كتجربة كاملة بسبب فجوة قراءة سلة العميل.
- **انحراف/قيود موثّقة:** لا يوجد endpoint لقراءة سلة العميل بعد الدمج؛ سلة الضيف تصبح `MERGED` حسب العقد. لا يُمسح Guest Token ولا تُغيَّر آليته لأن تعديل الـstorage mechanism محظور؛ حماية `CONSUMED_GUEST_TOKENS` تعمل داخل JS runtime الحالي فقط، وأي reuse بعد reload يحتاج قرارًا منفصلًا. Google مؤجل بالكامل؛ G5 مقفل؛ لا Styling/Motion/Backend/Deps/Env/Commit.
- **حالة التسليم:** `G4 CART MERGE EXECUTED — SOURCE GREEN — API/BROWSER NOT TESTED — AWAITING ASTRA/OWNER REVIEW — GOOGLE/G5 LOCKED`.

✅ G4 Cart Merge source كانت موقوفة على الاعتماد؛ المالك أذن بـ`G4 REMEDIATION EXTENSION — CART LOAD & ADD TO CART` قبل الاعتماد النهائي.

### 44. G4 REMEDIATION — CART LOAD & ADD TO CART

- **الأعراض المبلَّغة:** صفحة السلة لا تحمّل/لا تعرض المحتويات، ولا يمكن إضافة منتجات للسلة.
- **الإذن:** تمديد G4 فقط؛ لا Google، لا G5، لا backend/DB/migration/seed/config/deps، لا commit/push/deploy.
- **الملفات المفحوصة:**
  - Frontend: `ProductCard.tsx`, `ProductDetails.tsx`, `ProductPackageSelector.tsx`, `ProductAddToCart.tsx`, `hooks/useAddToCart.ts`, `hooks/useCartActions.ts`, `hooks/useCartBadge.ts`, `hooks/useCheckoutSubmit.ts`, `hooks/useFloatingCartCta.ts`, `lib/cartToken.ts`, `hooks/useCartToken.ts`, `store/cartApi.ts`, `store/baseApi.ts`, `store/authApi.ts`, `cart/page.tsx`, `CartSection.tsx`, `CartDrawer.tsx`, `CartLine.tsx`, `CartSummary.tsx`, `CartState.tsx`, `CheckoutSection.tsx`, `hooks/useCustomerAuth.ts`, `hooks/useCartMerge.ts`, `LoginForm.tsx`, `lib/customerSession.ts`، وتعديلات G1–G4 في `interface/index.ts`, `lib/cartError.ts`, `lib/routes.ts`, `messages/*.json`, `validation/index.ts`.
  - Backend read-only: `src/modules/store/cart/{routes,controller,validation,service,types}.ts`, `src/modules/store/checkout/{routes,validation}.ts`, `src/services/{guest-checkout,customer-claim}.service.ts`, `src/middlewares/{customer-auth,validate,error}.middleware.ts`, `src/shared/response.ts`, `src/utils/secure-token.ts`, `prisma/schema.prisma`, `logs/app.log`.
- **Root cause:** frontend guest token لا يُمسح ولا يُدوَّر بعد checkout ولا بعد merge ناجح. الباك يحوّل السلة إلى `CHECKED_OUT` أو `MERGED` ويرفض أي استخدام لاحق بنفس التوكن بـ`400 CART_NOT_ACTIVE`. الواجهة استمرت ترسل `GET /cart?guestToken=...` و`GET /cart/:token` و`POST /cart/:token/items` بنفس التوكن، فيفشل تحميل السلة والإضافة معًا. سبب ثانوي: `useAddToCart`/`useCheckoutSubmit` كانا يقرآن التوكن الخام بينما `useCartToken` يفلتره، فأي قيمة تالفة تعطي واجهة فارغة وطلبًا مرفوضًا `VALIDATION_ERROR`.
- **التصنيف:** عيب frontend في دورة حياة guest token وتوحيد قراءته؛ ليس backend contract mismatch للطلبات الحالية. الباك يعمل وفق عقده. المشكلة أقدم من G4 (سجل checkout في 2026-11-22 يُظهر نفس النمط)، لكن G4 merge جعلها تظهر فور login لأن السلة تصبح `MERGED`.
- **الملفات المعدلة وسببها:**
  - `lib/cartToken.ts`: `readCartToken` صار يتحقق من الصيغة ويتعامل مع تعطيل storage؛ أُضيف `clearCartToken()` على نفس المفتاح `om_cart_token` ونفس event، بلا مفتاح جديد.
  - `lib/cartError.ts`: `isStaleCartError()` موحّد لـ`CART_NOT_ACTIVE`/`CART_NOT_FOUND`.
  - `hooks/useCartToken.ts`: يستخدم القارئ المحقَّق بدل تكرار regex.
  - `hooks/useAddToCart.ts`: عند stale token يمسحه وينشئ سلة ضيف جديدة ثم يضيف المنتج؛ لا إعادة محاولة على أخطاء الشبكة أو أخطاء أخرى.
  - `hooks/useCheckoutSubmit.ts`: يمسح guest token بعد نجاح الطلب فقط.
  - `hooks/useCartMerge.ts`: يمسح guest token بعد رد merge ناجح (`string` أو `null`) مع الإبقاء على تفسير الاستجابة و`CONSUMED_GUEST_TOKENS`.
  - `hooks/useStaleCartRecovery.ts` جديد + ربطه في `CartDrawer.tsx` و`CheckoutSection.tsx`: يعالج التوكنات القديمة المخزنة قبل الإصلاح، فيمسحها عند خطأ stale وتظهر حالة سلة فارغة صادقة بدل خطأ دائم.
- **لم يتغير:** `store/cartApi.ts`, `store/baseApi.ts`, مسارات الباك، العقود، الرسائل، config/package files، Google، G5، Working Tree الموروث.
- **فحوص آلية منفصلة:** `npm run lint` Exit `0`؛ `npm run check` Exit `0` (`275 code files`, `453 message keys per locale`, `0 failure(s), 0 warning(s)`)؛ `tsc --noEmit` Exit `0`؛ `git diff --check` Exit `0` مع تحذيرات LF→CRLF؛ `npm run build` Exit `0` (`56/56` pages, compile `16.0s`, TypeScript `25.0s`)؛ `git diff --exit-code -- package.json package-lock.json` Exit `0`.
- **API Verification: YES — guest flow only.** باستخدام سيرفر محلي `:3002` وبتوكن ضيف مؤقت تم إنشاؤه عبر API: التوكن القديم أعاد `400 CART_NOT_ACTIVE`؛ `GET /store/cart` بلا توكن أعاد `200`؛ `POST /store/cart/:token/items` بـ`productPackageId` أعاد `200` مع `lines=1`, `itemsCount=1`؛ `GET /store/cart/:token` أعاد `200` بنفس العدد. التوكن المكوّن `short` أعاد `400 VALIDATION_ERROR`، وهو ما يتجنبه القارئ الجديد. لم يُستخدم أي customer token أو بيانات حقيقية.
- **Browser Verification: NO.** لا توجد أداة متصفح/Playwright في البيئة؛ شغّلنا `npm run dev` وHTTP smoke فقط: `/ar`, `/ar/cart`, `/ar/account/login` أعادت `200` لكل منها. هذا ليس دليلًا على نجاح التفاعل في DOM أو hydration أو toast/retry فعلي.
- **قيود متبقية:** لا يوجد endpoint لقراءة سلة العميل بعد merge؛ لذلك بعد merge تظهر سلة ضيف فارغة حتى يُنشئ المستخدم سلة جديدة، ولا يُدعى أن سلة العميل معروضة. Swagger backend ما زال فيه انحراف وثائقي (`packageId` مقابل `productPackageId`, `items` مقابل `lines`) لم يُلمس لأنه خارج الإذن. global `Cart` tag ما زال قد يسبب refetch/lazy orphan carts؛ لم يظهر كسبب للعطل المبلَّغ ولم يُغيَّر.
- **تأثير G4 merge:** التنفيذ الأصلي محفوظ؛ أضفنا فقط تنظيف توكن الضيف بعد رد ناجح. لم يتغير ترتيب login/merge، ولا رسائل النتيجة، ولا تفسير `mergedCartId`. merge نفسه لم يُختبر API لأنه يحتاج customer token مأذونًا.
- **مراجعة Astra المستقلة:** `PASS WITH NOTES` — root cause متسق مع سجلات الباك ومنطق الواجهة؛ الإصلاح frontend-only، بلا عقد جديد ولا parallel state، ويحافظ على G4. الملاحظات غير الحاجزة: التوكن التالف لا يُحذف فورًا بل يُستبدل عند أول إضافة ناجحة؛ `useCartBadge` لا يحتوي recovery مستقلًا ويتعافى عند زيارة cart/checkout أو الإضافة؛ وجود قفل submit عند فشل حفظ الإيصال مشكلة قديمة خارج النطاق. **التوصية:** `SOURCE-ACCEPT` مع `API VERIFIED (guest cart)` و`BROWSER BLOCKED`; لا توصية بفتح Google أو G5 أو اعتماد G4 النهائي قبل مراجعة المالك.
- **فصل الحالة:** `SOURCE COMPLETE = YES` · `AUTOMATED CHECKS PASSED = YES` · `API VERIFIED = YES (guest cart only)` · `BROWSER VERIFIED = NO`.

⛔ STOP — G4 REMEDIATION BLOCKED — TEST ENVIRONMENT REQUIRED

### 45. G5 — DAY 7 STYLE & MOTION

- **الإذن والنطاق:** المالك أذن بتنفيذ G5 فقط بعد القبول المشروط لـG4. شغل frontend-only على Track وAccount/Home المرتبط بهما؛ لا backend/DB/API/contracts، لا Cart/Checkout/Header/Footer، لا Google auth، لا تعديل customer session/token handling، لا dependencies/config/env/deploy، لا commit/push، لا فتح G6. لا ادعاء بقبول G4 runtime كامل لأن Browser Verification وauthenticated merge ما زالا `NOT TESTED`.
- **قبل التنفيذ:** رُوجعت `AGENTS.md`، `PROGRESS.md` §43–§44، `DAY7_TASKS.md` Gate 5، حالة Git، كل ملفات Track/Account، animation wrappers، design tokens، reduced-motion kill switches، ثم سُلّمت خطة ملفات صريحة قبل أول تعديل مصدر.
- **الملفات الجديدة:** `components/ECommerce/Track/trackStyles.ts` (ثوابت كروت/فوكس)، `lib/trackStatusTone.ts` (tone للحالة)، `components/ECommerce/Track/TrackStatusBadge.tsx` (شارة حالة دلالية)، `components/ECommerce/Account/AccountFieldError.tsx` (رسالة حقل + `role="alert"`), `lib/accountFormA11y.ts` (`accountDescribedBy`)، `components/ECommerce/Account/accountStyles.ts` (ثوابت كروت الحساب)، `components/ECommerce/Account/RegisterFields.tsx` (فصل حقول Register لإبقاء الملفات صغيرة).
- **Track:** `TrackSection` / `TrackLookupForm` / `TrackState` / `TrackSummary` / `TrackTimeline` / `TrackItems` + `TrackSkeleton` اتنقلوا لتسلسل بصري أوضح: CSS `animate-fade-up` فوق الطية، `Spotlight` للبحث والكارت، `Shake` للأخطاء، `FadeIn` لنتائج البحث، `m.span` لخط التimeline بـ`scaleY` فقط، `<time>` للتواريخ، `aria-current="step"`، عدم اختراع مراحل أو تواريخ، وإبقاء نص البحث غير الصالح للتصحيح. الـETA يستخدم `CountUp` للرقم مع `sr-only` للنص الكامل.
- **Account:** `AccountFormCard` / `AccountFormError` / `AccountProfile` / `AccountSection` / `AccountState` + `AccountSkeleton` اتحدّثوا للـSpotlight/Beam المقيد/تسلسل الحقول والكروت. نماذج `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `VerifyEmailForm` بقت تعرض أخطاء الحقول بعد اللمس/الإرسال مع `aria-invalid` و`aria-describedby` و`role="alert"` ورسائل مترجمة عامة، مع حفظ منطق المصادقة/الـmerge كما هو.
- **الرسائل:** أُضيف `track.eta.unit` و`track.eta.to` في `messages/ar.json` و`messages/en.json`؛ المفاتيح متطابقة. لا نصوص مستخدم hard-coded جديدة، ولا ألوان hex/rgb، ولا مكتبات حركة جديدة، ولا keyframes جديدة.
- **الموسومة/الإتاحة:** `MotionConfig reducedMotion="user"` وCSS media queries موجودة بالفعل؛ الحركة الجديدة transform/opacity فقط أو CountUp مع احترام تقليل الحركة. RTL/LTR-safe عبر utilities منطقية و`break-words/break-all`؛ أُضيف `role="status"` للتحميل و`role="alert"` للأخطاء.
- **تحقق آلي نهائي منفصل:** `npm run lint` Exit `0`; `npm run check` Exit `0` (`282 code files`, `455 message keys per locale`, `0 failure(s), 0 warning(s)`); `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` Exit `0`; `npm run build` Exit `0` (Next `16.4.5`, compile `16.2s`, TypeScript `30.0s`, `56/56` pages); `git diff --check` Exit `0` مع تحذيرات LF→CRLF اعتيادية؛ `git diff --exit-code -- package.json package-lock.json` Exit `0`; `git status --short --untracked-files=all` Exit `0` مع الإبقاء على Working Tree الموروث.
- **HTTP smoke فقط:** `npm run start` على `:3001`; `/ar`, `/en`, `/ar/track`, `/en/track`, `/ar/account`, `/en/account/login`, `/ar/account/register`, `/en/account/forgot-password`, `/ar/account/reset-password?token=smoke`, `/en/account/verify-email?token=smoke` أعادت `200`. **هذا ليس Browser Verification**.
- **Browser Verification: NO.** لا أداة متصفح/Playwright في البيئة؛ لم يُتحقق بصريًا من 4 ثيمات، RTL/LTR، موبايل 360px/ديسكتوب، reduced motion ON/OFF، hydration flicker، layout shift، focus states أو منطق DOM التفاعلي.
- **مراجعة Astra المستقلة:** أول تقرير `PASS WITH NOTES`؛ نُفّذت كل الملاحظات (`role="alert"` للحقول والبحث وحاويات الأخطاء، حفظ نص البحث الخاطئ، ربط global error بـ`aria-describedby` في Reset/Register، `cn()` وتوحيد ثوابت كروت الحساب). إعادة المراجعة: `PASS` — لا business/API logic changes، لا ملفات >150، lint/check/tsc خضرا، لا browser visual claim.
- **فصل الحالة:** `SOURCE IMPLEMENTATION = COMPLETE` · `AUTOMATED CHECKS = PASS` · `HTTP SMOKE = PASS (non-visual)` · `BROWSER VERIFICATION = NOT TESTED` · `ASTRA REVIEW = PASS` · `OWNER VISUAL APPROVAL = PENDING`. لا يُفتح G6.

⛔ STOP — G5 IMPLEMENTATION COMPLETE / PARTIAL — WAITING FOR OWNER VISUAL APPROVAL

### 46. G6 FRONTEND — PREMIUM ACCOUNT MOTION & NAVIGATION

- **الإذن:** المالك اختار `Frontend أولاً` واختار `لا شيء جاهز لتسجيل Google`؛ لذلك نُفّذ G6 frontend-only؛ زر Google معطّل وظيفيًا وظاهر كـplaceholder، بلا SDK/credentials/fetch/endpoint/منطق OAuth. الباك وDB والـcontracts والدependencies والconfig لم تُلمس.
- **قبل التنفيذ:** رُوجعت خريطة مداخل/مخارج الحساب، صفحات Account/Track وloading/metadata، `template.tsx` للـpage transition، الـanimation wrappers، الرسائل، ثم سُلّمت خطة الملفات قبل أول تعديل.
- **ملفات جديدة:** `GoogleSignInButton.tsx` (معطّل + `title`/`aria-label`/`sr-only`)، `AuthDivider.tsx`، `LoginFields.tsx` (فصل حقول الدخول)، `AccountStatusPill.tsx` (PulseRing + check draw)، `AccountQuickLinks.tsx` (تتبع/تسوق/رئيسية)، `AccountProfileDetails.tsx`، `HeaderNavLinks.tsx`، `FooterNav.tsx`.
- **حركة Account:** `AccountSection` أخد مقدمة متدرجة وخط accent RTL-aware؛ `AccountFormCard` و`AccountProfile` بقتا تستخدم `GlowCard` (Spotlight + Beam + hover lift) مع تأخيرات CSS موجودة؛ حالة التوثيق بقت نابضة/check بدلspan ثابت؛ كروت البيانات والquick links/logout ليها ترتيب دخول؛ الأخطاء لسه Shake + role=alert؛ الحركةكلها transform/opacity أو primitives موجودة، بدون keyframes أو مكتبات جديدة.
- **التنقل المتهندل:** روابط Account/Track في الهيدر، روابط داخلية في الفوتر، Track CTA بعد نجاح الطلب، روابط رجوع لتسجيل الدخول في Reset/Verify، إجراءات سريعة داخل بروفايل العميل، وتوجيه بعد logout إلى `ACCOUNT_LOGIN_HREF`. أُضيف `PRODUCTS_HREF` لتقليل المسارات المبعثرة. `template.tsx` ما زال مسؤول عن entry page transition العام.
- **الرسائل:** أُضيفت مفاتيح `header.{account,track,quickNav}`، `footer.navTitle/nav.*`، `orderSuccess.trackOrder`، `account.google.*`، `account.quickLinksTitle`، `account.actions.{backToLogin,trackOrder,continueShopping}` في `ar.json` و`en.json` بطابق تام.
- **تحقق آلي:** `npm run lint` Exit `0`; `npm run check` Exit `0` (`290 code files`, `471 message keys per locale`, `0 failure(s), 0 warning(s)`); `tsc --noEmit` Exit `0`; `npm run build` Exit `0` (`56/56` pages, compile `8.5s`, TypeScript `16.4s`); `git diff --check` Exit `0` مع تحذيرات LF→CRLF؛ `git diff --exit-code -- package.json package-lock.json` Exit `0`.
- **HTTP smoke فقط:** 11 مسارًا أعادت `200`: `/ar`, `/en`, `/ar/account`, `/en/account/login`, `/ar/account/register`, `/en/account/forgot-password`, `/ar/account/reset-password?token=smoke`, `/en/account/verify-email?token=smoke`, `/ar/track`, `/en/products`, `/ar/checkout/success`. ليس دليلًا بصريًا.
- **مراجعة مستقلة:** أول تقرير `PASS WITH NOTES`؛ نُفّذت الملاحظات (`rtl:bg-gradient-to-l`، إظهار فاصل "أو" لتقنية المساعدة، label محايد لـquick nav). إعادة المراجعة `PASS`. **Browser Verification: NO** — لا أداة متصفح/Playwright؛ لم تُختبر الثيمات الأربعة، RTL/LTR، موبايل/ديسكتوب، reduced motion، focus/hydration/layout shift.
- **فصل الحالة:** `FRONTEND SOURCE = COMPLETE` · `AUTOMATED CHECKS = PASS` · `HTTP SMOKE = PASS (non-visual)` · `GOOGLE AUTH = BLOCKED (backend not configured)` · `BROWSER VERIFICATION = NOT TESTED` · `ASTRA REVIEW = PASS` · `OWNER VISUAL APPROVAL = PENDING`.

#### مطلوب من الباك/Google قبل تفعيل زر Google فعليًا

1. **Google Cloud Console:** أنشئ OAuth consent screen (داخلي/خارجي + test users لوexternal في وضع testing)، ثم OAuth client ID من نوع `Web application`. سجّل origins المسموحة (`http://localhost:3001` للتطوير + origin الإنتاج) وredirect URI الحقيقي لمسار callback الباك الذي نتفق عليه. استخدم scopes `openid email profile` واشترط `email_verified=true`.
2. **أسرار/إعدادات الباك فقط:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, و`FRONTEND_SUCCESS_URL` (أو ما يعادلها) في `.env` الباك. الـClient Secret **لا** يذهب للفرونت ولا يُعرض في logs.
3. **تدفق موصى به:** Authorization Code + PKCE؛ الباك يولّد `state`، يتحقق منه في callback، يستبدل Code، يتحقق من issuer/audience/expiry/Signature في ID token، ثم يرفض الحسابات غير الموثّقة.
4. **ربط الحساب:** ابحث/أنشئ Customer بالبريد الموثّق فقط؛ عند تعارض بريد موجود غير موثّق لا يحدث ربط تلقائي؛ أصدر نفس توكن العميل المعتمد `token + expiresInDays` بنفس شكل استجابة login البريدية ليعمل `saveCustomerToken` الحالي.
5. **السلة:** بعد نجاح Google login نفّذ نفس `useCartMerge` / `POST /store/cart/merge` بـguest token الحالي؛ لا منطق دمج جديد.
6. **حماية وتوثيق:** CORS/redirect allowlist، rate limit، audit without tokens، تحديث Swagger، واختبارات: مستخدم جديد، مستخدم موجود، بريد غير موثّق، state خاطئ، code منتهي، إلغاء consent، وتعارض بريد.
7. **ثم الفرونت:** تُفعّل الزر وتُربط بالنتيجة، تُضاف رسائل أخطاء google مترجمة وحالات loading/error، يُعاد Astra + build + browser verification قبل أي اعتماد نهائي.

⛔ STOP — G6 FRONTEND MOTION/NAV COMPLETE — GOOGLE AUTH BACKEND REQUIRED — WAITING FOR OWNER VISUAL APPROVAL

## 47) G6 — DAY 7 FINAL REVIEW & HANDOFF (2026-11-23)

- **الإذن الصريح:** `G6 — DAY 7 FINAL REVIEW & HANDOFF` — documentation, evidence audit, and final handoff task only. GLM منفّذ، Astra مراجع مستقل، والمالك صاحب القرار النهائي. G6 الآن `OPEN`.
- **النطاق المنفَّذ في هذه الـGate:** قراءة `AGENTS.md`، `PROGRESS.md` §37–§46، `DAY7_TASKS.md` §0–§11، تقارير G0–G5، وفحص `git status --short --untracked-files=all` + diffs/untracked. التعديل المسموح انحصر في `docs/PROGRESS.md` و`docs/DAY7_TASKS.md`; صفر تعديل لمصدر Frontend/Backend، عقود، DB، env، config، dependencies، package files، أو نشر.
- **الهدف الفعلي مقابل المُسلَّم:** هدف Day 7 كان Track + Email Account + Cart Merge على مسار Storefront. الذي تسلّم فعليًا في المصدر: G0 baseline، G1 contracts/validation/endpoints، G2 track route/UI، G3 email auth/account routes، G4 cart merge + remediation، G5 style/motion، ثم G6 frontend motion/navigation بصفحة Google معطّلة. الذي لم يتحول إلى قبول نهائي: API runtime، browser/visual matrix، authenticated merge، Owner visual approval، وإذن production.
- **قاعدة القراءة:** لم تُترجم تقارير الماضي تلقائيًا إلى دليل حالي؛ كل حالة أدناه مقروءة بأقرب دليل موجود في §39–§46 أو بأمر فحص فعلي. HTTP 200 لا يعني visual acceptance، ونجاح build لا يعني runtime correctness، وموافقة Astra لا تُغني عن موافقة المالك.

### 47.1 Gate-by-Gate audit

| Gate | Owner authorization | Source status | Automated checks | API verification | Browser verification | Astra review | Owner acceptance | Evidence | Remaining work |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G0 | «عاوزين نبدا في اليوم السابع التنفيذ بنفس اسلوبنا gate وبعدها gate وتقف لحد اما اراجع كل واحده» | COMPLETE (docs-only baseline; لا source مطلوب) | PASS | NOT APPLICABLE | NOT TESTED | NOT TESTED | ACCEPTED | §39.1: `npm run check` 221 files / 344 keys exit `0`; `npm run lint` exit `0` بعد إعادة تشغيل منفردة; `tsc` exit `0`; `npm run build` exit `0` / 35 pages مع `NETWORK_ERROR` بيئي. G1 §40 اعتبر G0 مقبولًا. | لا عمل متبقٍ داخل النطاق؛ القرارات المؤجلة سُجّلت ولا تُفتح تلقائيًا. |
| G1 | «المالك راجع G0 واعتمده، وأذن صراحةً بتنفيذ `G1 — DAY 7 CONTRACTS & VALIDATION`» | COMPLETE | PASS | NOT TESTED | NOT TESTED | PASS WITH NOTES | ACCEPTED | §40.1–§40.3: `npm run check` 231 files / 450 keys exit `0`; `npm run lint`, `tsc`, `build` exit `0`; `git diff --exit-code -- package.json package-lock.json` exit `0`. Astra: قبول تقني مشروط مع انحراف Google المؤجل. §40 سجّل التنفيذ، و§41 pre-flight عند `PROGRESS.md:2501` سجّل اعتماد المالك وفتح G2. | API runtime وbrowser وترجمة انحراف Google؛ لا reopen تلقائي. |
| G2 | «المالك راجع G1 واعتمده، وأذن صراحةً بـ`G2 — DAY 7 TRACK` لصفحة `/{locale}/track` فقط» | COMPLETE | PASS | NOT TESTED | NOT TESTED | PASS | ACCEPTED | §41.1–§41.9: `npm run check` 242 files / 450 keys exit `0`; lint/tsc/build exit `0` / 38 pages; لا مستمعين 3001/3002; فحص ثابت: لا token في route/canonical/metadata. §41.9 اعتماد source-wise. | API runtime بتوكن مأذون، browser matrix، Owner visual approval؛ KS-6 لا يُختم تجربة كاملة. |
| G3 | «المالك راجع G2 source-wise واعتمده، وأذن صراحةً بتنفيذ `G3 — DAY 7 EMAIL AUTH` فقط» | COMPLETE | PASS | NOT TESTED | NOT TESTED | PASS | ACCEPTED | §42.1–§42.8: `npm run check` 273 files / 453 keys exit `0`; lint/tsc/build exit `0` / 56 pages; لا مستمعين 3001/3002; §42.8 و`PROGRESS.md:2700` اعتماد source-wise. | API runtime حقيقي، browser matrix، Owner visual approval؛ لا ادعاء بأن login فعلي مُختبَر. |
| G4 | «المالك راجع G3 source-wise وأذن صراحةً بتنفيذ جزء **Cart Merge Only** من `G4 — DAY 7 GOOGLE & CART MERGE`» + «`G4 REMEDIATION EXTENSION — CART LOAD & ADD TO CART`» | COMPLETE | PASS | PASS (guest cart only); authenticated merge NOT TESTED | NOT TESTED | PASS WITH NOTES | PENDING (conditional only) | §43–§44: lint/check/tsc/build exit `0`; check 275 files / 453 keys; guest cart API: stale `400 CART_NOT_ACTIVE`، `GET /cart` بلا توكن `200`، إضافة صنف `200`، قراءة سلة الضيف `200`، token قصير `400 VALIDATION_ERROR`. Astra `PASS WITH NOTES`. | Authenticated `POST /cart/merge`، browser/DOM، Owner final acceptance، فجوة قراءة سلة العميل بعد merge، Swagger drift، global Cart tag. لا ترقية القبول المشروط. |
| G5 | «المالك أذن بتنفيذ G5 فقط بعد القبول المشروط لـG4» | COMPLETE | PASS | NOT APPLICABLE (لا تغيير API) | NOT TESTED | PASS | PENDING | §45: lint exit `0`; check 282 files / 455 keys exit `0`; tsc exit `0`; build exit `0` / 56 pages; HTTP smoke 10 مسارات `200` غير بصري؛ Astra بعد التصحيح `PASS`. | Browser/theme/RTL/LTR/mobile/reduced-motion/focus/hydration matrix وOwner visual approval. لا يُصنَّف G5 كـvisually accepted. |

> ملاحظة مصطلحية: `ACCEPTED` في الجدول يعني source/technical acceptance موثّقًا في الأقسام المشار إليها، وليس visual acceptance ولا production readiness. `PENDING` في G4 وG5 يعني ما زال هناك شرط أو اعتماد نهائي غائب.

### 47.2 Track implementation and outstanding verification

- **Source:** KS-6 جاهز من §41: `/{locale}/track`، `useOrderReceipt` أو إدخال يدوي، `useTrackLookup`، `trackApi`، الحالات التسع، skeleton، noindex metadata، بلا `trackingToken` في route/canonical/OG/JSON-LD/analytics. G5 أضاف timeline/status badge/ETA CountUp/Spotlight/Shake دون تغيير العقد.
- **Automated:** lint/check/tsc/build خضرا في §41 و§45؛ أحدث رقم رسائل مسجّل في §46 هو 471 مفتاحًا لكل locale بعد G6.
- **API:** NOT TESTED. لا طلب track فعلي مأذون ولا توكن حقيقي؛ mappings 404/429/network مؤكدة من المصدر فقط.
- **Browser/Visual:** NOT TESTED؛ لا أداة متصفح/Playwright. HTTP smoke في §45 و§46 أعاد `200` لصفحات track لكنه non-visual.
- **Owner:** visual approval PENDING؛ KS-6 يبقى `SOURCE COMPLETE / API PENDING / BROWSER PENDING`.

### 47.3 Email Account implementation and outstanding verification

- **Source:** KS-7 جاهز من §42: register/verify/login/forgot/reset/me/logout، `oe.customer.session` في `sessionStorage` بقرار G1، `prepareHeaders` يضيف Bearer، staff/employee cookie لا علاقة له، تطابق ar/en، noindex+Suspense، Zod، coded errors، logout ينظف الكاش والتوكن محليًا. G5/G6 أضافا تحسين وصولية رسائل الأخطاء وحركة وروابط تنقل دون تغيير منطق المصادقة.
- **Automated:** lint/check/tsc/build خضرا في §42 و§45 و§46.
- **API/Browser:** NOT TESTED؛ لا register/verify/login/me/logout فعلي ولا browser matrix.
- **Owner:** G3 accept source-wise موثّق؛ visual approval ما زال PENDING.

### 47.4 Cart Merge implementation, remediation, and verification limits

- **Source:** KS-8 مرتبط بنجاح email login فقط عبر `useCartMerge` و`POST /store/cart/merge`، بلا merge تلقائي من register/forgot/reset/me، بلا إعادة محاولة، وبلا عرض بنود أو إجمالي من الرد.
- **Remediation:** §44 أصلح دورة حياة guest token: قارئ محقق، `clearCartToken()` على نفس المفتاح، `isStaleCartError()`، recovery عند الإضافة وبعد checkout/merge، وحالة سلة فارغة صادقة للتوكنات القديمة.
- **API:** PASS للـguest cart فقط. authenticated merge NOT TESTED لغياب customer token مأذون؛ لذلك acceptance G4 ما زال conditional.
- **Browser/Visual:** NOT TESTED. لا DOM/hydration/toast/retry فعلي.
- **قيود متبقية:** لا endpoint لقراءة سلة العميل بعد merge؛ سلة الضيف تصبح `MERGED`؛ Swagger drift وglobal Cart tag لم يُلمسا؛ لا يُدعى أن تجربة السلة بعد الدمج مكتملة.

### 47.5 G5 visual implementation and pending Owner approval

- G5 نفّذ source-wise: Track وAccount بحركة مبنية على primitives موجودة، `animate-fade-up` SSR-visible، Spotlight/Beam مقيد، Shake للأخطاء، CountUp للـETA، PulseRing/check للحالة، reduced-motion محترم، بلا keyframes أو مكتبات جديدة.
- Astra: PASS بعد تصحيح الملاحظات. Automated وHTTP smoke أخضر/غير بصري. Browser matrix وOwner visual approval لم يحدثا؛ لذلك `DAY 7 — PARTIAL HANDOFF`.

### 47.6 Automated check evidence

- `npm run lint` → `EXIT 0` (§45 و§46؛ آخر تشغيل سابق للتسليم هذا).
- `npm run check` → `EXIT 0`؛ أحدث رقم مسجّل §46: `290 code files`, `471 message keys per locale`, `0 failure(s), 0 warning(s)`.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
- `npm run build` → `EXIT 0`؛ أحدث رقم مسجّل §46: Next `16.4.5` Turbopack، compile `8.5s`، TypeScript `16.4s`، `56/56` pages.
- `git diff --exit-code -- package.json package-lock.json` → `EXIT 0` (لا تغيير حزم).
- `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF اعتيادية على Windows.
- HTTP smoke (§46، non-visual): 11 مسارًا أعادت `200`: `/ar`, `/en`, `/ar/account`, `/en/account/login`, `/ar/account/register`, `/en/account/forgot-password`, `/ar/account/reset-password?token=smoke`, `/en/account/verify-email?token=smoke`, `/ar/track`, `/en/products`, `/ar/checkout/success`.
- لم تُعَد أوامر lint/check/tsc/build داخل G6 لأن هذه الـGate documentation-only؛ الأرقام أعلاه أدلة موروثة صريحة من §45–§46 وليست ادعاءً بتشغيل جديد هنا.

### 47.7 API and browser verification — separated

- **API PASS:** guest cart flow فقط في §44.
- **API NOT TESTED:** track query، كل customer auth mutations، authenticated cart merge، Google. لا بيانات حقيقية أو writes مأذونة.
- **HTTP smoke PASS:** 10 مسارات في §45 و11 مسارًا في §46؛ هذا يثبت استجابة صفحة فقط، لا سلوك DOM ولا بصريات.
- **Browser Verification NOT TESTED:** لا أداة متصفح/Playwright؛ لم تُختبر 4 ثيمات، RTL/LTR، 360px/desktop، focus-visible، reduced motion ON/OFF، hydration flicker، layout shift، ولا Network tab.

### 47.8 Astra review results

- G0: NOT TESTED.
- G1: PASS WITH NOTES — قبول تقني مشروط، انحراف Google موثّق، لا runtime.
- G2: PASS — source-accept مع API/browser معلّقة.
- G3: PASS — source-accept مع API/browser معلّقة.
- G4: PASS WITH NOTES — root cause/remediation متسقان؛ ملاحظات غير حاجزة؛ browser blocked وauthenticated merge لم يُختبر.
- G5: PASS بعد تصحيح role/alert، نص البحث، aria-describedby، وcn/ثوابت الكروت.
- G6 frontend (§46): PASS بعد تصحيح RTL gradient، إظهار فاصل "أو"، وlabel محايد للتنقل السريع.
- G6 final handoff: مراجعة مستقلة للوثائق `PASS WITH NOTES` ثم `PASS` بعد تصحيح الإشارات والصياغات غير الحاجزة داخل هذا القسم؛ لا تُترجم مراجعة Astra إلى Owner acceptance.

### 47.9 Outstanding issues and blockers

- Browser/visual matrix لكامل Day 7 غير مختبرة؛ لا أداة متصفح في البيئة.
- Authenticated cart merge وقراءة سلة العميل بعد merge غير متاحين/مختبرين.
- Owner visual approval لـG2/G3/G5/G6 ما زال PENDING؛ G4 acceptance مشروط.
- Google Login مؤجل ولا implementation مأذون به.
- لا Production Seal؛ لا نشر ولا Day 8 ولا gate implementation جديدة بهذه الـGate.
- تحذيرات LF→CRLF، symlink noise، build `NETWORK_ERROR` التاريخية، Swagger drift، global Cart tag: سجلت ولم تُصلح خارج النطاق.

### 47.10 Deferred work

- `DEFERRED — NOT PART OF G6 — NO IMPLEMENTATION AUTHORIZED` — Google Login.
- لا طلب ولا عرض لأي OAuth credentials أو قيم حساسة؛ أي عمل Google مستقبلي يحتاج scope وإذنًا صريحًا منفصلين. §46 يحتوي ملاحظات تحضير معلوماتية فقط، وليست تنفيذًا ولا تفويضًا.
- Public Cloudinary Delivery لإثبات الدفع مقبول بقرار §38 ولا يُعاد فتحه؛ Cloudinary Private/Signed Delivery، Dashboard، Day 8، production ops، وأي backend/env/deps work تبقى خارج Day 7 الحالي.

### 47.11 Production readiness and recommendation

- **PRODUCTION READINESS: NOT READY / NOT SEALED.** يوجد browser verification ناقص، API runtime ناقص، G4 conditional، وOwner visual approval معلّق.
- **DAY 7 FINAL HANDOFF STATUS: `DAY 7 — PARTIAL HANDOFF`.**
- **التوصية بلا فتح جديد:** يعتمد المالك هذا التسليم الجزئي كما هو، ويحدد لاحقًا بيئة اختبار مأذونة للـbrowser matrix وauthenticated merge وOwner visual review. لا يُفتح Day 8 ولا أي Gate implementation من هذا التقرير.

### 47.12 G6 final documentation validation

- `git diff --check` → `EXIT 0`؛ تحذيرات LF→CRLF فقط على Windows، بلا whitespace errors.
- `git diff --stat` → `EXIT 0`؛ التغيير المتعقّب يشمل الـdirty tree الموروث + الملفين المسموحين `docs/PROGRESS.md` و`docs/DAY7_TASKS.md` فقط من أعمال هذه الـGate.
- `git status --short --untracked-files=all` → `EXIT 0`؛ نفس قائمة الملفات الموروثة قبل الدخول في G6، مع إضافة تعديل `docs/DAY7_TASKS.md` إلى جانب `docs/PROGRESS.md` المعدَّل سلفًا.
- `git diff --exit-code -- package.json package-lock.json` → `EXIT 0`؛ لا dependencies أو lock changes.
- مقارنة baseline قبل/بعد تحرير الوثائق: tracked source diff hash `cc1cf848931d89e231349e5b0673c203604688ba` لم يتغير، untracked list hash `aeed0c4534779c0ef11d57659d29e845aa18d82a` لم يتغير، وعدد untracked files بقي `69`.
- `git diff -- docs/PROGRESS.md docs/DAY7_TASKS.md` → `EXIT 0`؛ التغيير وثائقي فقط: header + قسم G6 الختامي في كلا الملفين، بلا إعادة كتابة تقارير G0–G5 السابقة.
- لم تُنفَّذ أوامر lint/build/API/browser داخل G6 لأن نطاقها documentation-only؛ لا ادعاء بتحديد الدليل البصري أو runtime بهذه الأوامر.

⛔ STOP — G6 COMPLETE / PARTIAL — DAY 7 HANDOFF READY — WAITING FOR OWNER FINAL REVIEW

## 48) OM EMAN — PREMIUM STOREFRONT NAVBAR REDESIGN (2026-11-23)

- **الإذن الصريح:** `OM EMAN — PREMIUM STOREFRONT NAVBAR REDESIGN` — مهمة Frontend-only مستقلة للهيدر فقط. G6 مغلق، ولا إذن هنا بتنفيذ Google Login ولا إعادة تصميم صفحة Login. لا backend/API/DB/env/config/dependencies/providers/stores/checkout/cart logic. الدirty tree الموروث محفوظ؛ لا `reset` ولا `checkout` ولا `clean` ولا `stash`.
- **ملفات جديدة:** `components/ECommerce/Header/headerStyles.ts` (وصفات classes مشتركة)، `HeaderActions.tsx` (_cluster الإجراءات + حالة القائمة)، `MobileNavMenu.tsx` (غلاف الـdialog)، `MobileNavItems.tsx` (قائمة الروابط)، `hooks/useBodyScrollLock.ts` (قفل scroll متجاوب مع breakpoint)، `hooks/useDialogFocus.ts` (initial focus + focus trap)، `lib/navActive.ts` (مساعد active موحّد).
- **ملفات معدَّلة:** `StoreHeader.tsx`، `HeaderBrand.tsx`، `HeaderNavLinks.tsx`، `CartLink.tsx`، `SearchForm.tsx`، `LocaleSwitcher.tsx`، `components/shared/ThemeSwitcher.tsx`، `messages/ar.json`، `messages/en.json`. تعديل الـswitchers انحصر في `aria-controls` الشرطي و Escape أثناء فتح قائمة الإعدادات.
- **قرارات التصميم:** هيدر موبايل من صفّين مع لوحة تنقل تبدأ من `top-28` حتى لا تغطي صف البحث؛ هيدر ديسكتوب صف واحد؛ شريط علوي رفيع؛ Brand وSearch وأزرار اللغة/الثيم/السلة/القائمة موزّعة حسب الحجم. كل الألوان من semantic tokens، كل النصوص من `next-intl`، كل الروابط من `@/i18n/navigation` + `lib/routes.ts`، والحركة عبر `m.*` داخل `MotionProvider` مع احترام reduced motion.
- **الوصولية والسلوك:** `role="dialog"` + `aria-modal` + تسمية محلية + initial focus على زر الإغلاق + Tab trap؛ `aria-expanded` و`aria-controls` الشرطي؛ Escape يغلق القائمة فقط، ويُبقي القائمة مفتوحة إذا كانت قائمة لغة/ثيم متداخلة فرعًا؛ `data-cart-target` وحيد عبر `CartLink` → `CartBounce`؛ خريطة RTL/logical utilities و4 ثيمات محفوظة source-wise.
- **الفحص الآلي النهائي:** `npm run lint` → `EXIT 0`; `npm run check` → `EXIT 0` (`297 code files`, `477 message keys per locale`, `0 failure(s), 0 warning(s)`); `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`; `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF اعتيادية؛ `git diff --exit-code -- package.json package-lock.json` → `EXIT 0`; `npm run build` → `EXIT 0` (Next `16.4.5` Turbopack، compile `12.8s`، TypeScript `11.9s`، `56/56` pages).
- **مراجعة Astra:** `ses_df59b8e81ffepYjB1jpicAbOAV`: `PASS WITH NOTES`. أُصلحت ملاحظات الـtop offset، والـdialog focus، وقفل الـscroll عند تكبير الشاشة، وتوحيد `isNavPathActive`، و`aria-controls`، وتداخل Escape مع قوائم اللغة/الثيم. ملاحظة منخفضة متبقية: يمكن فتح قائمتي الإعدادات معًا، فـEscape واحد يغلقهما معًا؛ لم يُوسَّع النطاق لحلها منفردة.
- **Google/Login:** لا تعديل في `GoogleSignInButton` ولا صفحات الحساب؛ أي Google work يحتاج إذنًا صريحًا منفصلًا. **Browser/Visual:** NOT TESTED؛ لا أداة متصفح/Playwright ولا screenshots؛ مصفوفة Arabic RTL وEnglish LTR وديسكتوب/360px والثيمات الأربعة وfocus-visible وreduced motion ما زالت بانتظار مراجعة المالك البصرية.

⛔ STOP — PREMIUM NAVBAR IMPLEMENTATION COMPLETE / PARTIAL — WAITING FOR OWNER VISUAL APPROVAL

## 49) تخطيط اليوم 8 — تصحيح النطاق الكامل + توضيحات المالك (2026-11-24)

- **تصحيح المالك:** النسخة الأولى من هذه الخطة حصرت اليوم 8 في Google UI/UX وCart → Checkout. المالك قرر أن هاتين إضافتان مطلوبتان قبل إعداد اليوم، وليستا نطاق اليوم البديل. `FRONTEND_TASKS_10_DAYS.md:225-234` هو الآن مصدر الحقيقة للنطاق الأساسي؛ أي صياغة قديمة تقول إنه «مرجع تاريخي فقط» تُقرأ مستبدَلةً بهذا القرار الصريح. G0 القديمة ملغاة ولا تُعتبر إذن تنفيذ.
- **النطاق الكامل المثبّت:** Home SSR (Hero بصورة منتج/براند حقيقية ومعتمدة + CTA + COD/ثقة + Banners + Featured + Categories + States) + SEO ثقيل (Organization/WebSite/SearchAction/BreadcrumbList حيث ينطبق، `generateMetadata`, canonical, OG/Twitter, hreflang, صورة OG من أصل براند معتمد) + تدقيق Header/Footer الموجودين دون إعادة بناء أو تعديل تلقائي + Google UI-only + CTA السلة إلى checkout + FAQ page + Wishlist UI preparation.
- **قرارات الأصول:** Hero وOG يستخدمان أصول Om Eman حقيقية ومعتمدة فقط؛ ممنوع packaging/label/ادعاءات منتج وهمية. الأسماء المقترحة سُجّلت في `docs/DAY8_TASKS.md §1.3`: `om-eman-home-hero.webp`, `om-eman-og-cover.webp`, `om-eman-banner-main.webp`, `category-herbs.webp`, `category-spices.webp`, `category-blends.webp`, `category-natural-products.webp`, `om-eman-faq-cover.webp`, `wishlist-empty.webp`. التوفر الفعلي وموافقة المالك يُسجَّلان منفصلًا في `D8-ASSET-REGISTER` قبل أي ربط مصدر.
- **FAQ داخل اليوم 8:** صفحة `/[locale]/faq` محلية بهيكل ar/en متطابق، روابط Footer صحيحة، metadata/breadcrumb مناسب، ومحتوى موثّق فقط؛ لا وعود شحن/دفع/إرجاع/توصيل متخيلة. سُجّل كـKS-15 وGate 4A.
- **Wishlist داخل اليوم 8 كـUI preparation فقط:** صفحة `/[locale]/wishlist` مع empty state ورسالة صادقة ومدخل تنقل مناسب؛ لا endpoints متخيلة، لا persistence، لا add/remove mutations، ولا ادعاء وظيفة فعلية حتى عقد باك معتمد. سُجّل كـKS-16 وGate 4A؛ الوظيفة الحقيقية DEFERRED.
- **Sitemap:** توسيع sitemap مُؤجَّل صراحةً إلى `D15-SEO-SITEMAP`؛ لا تعديل `app/sitemap.ts` في اليوم 8. اليوم 15 يشمل sitemap ديناميكيًا من بيانات حقيقية منشورة/indexable، استبعاد غير المنشور/الخاص/غير القابل للفهرسة، caching/revalidation، مراجعة robots/canonical/hreflang/metadata، ثم المراجعة النهائية للمؤجلات والاركتيكتشر وجاهزية الإنتاج.
- **الملف المحدَّث:** `docs/DAY8_TASKS.md` أُعيد بناؤه بنمط `DAY7_TASKS.md`، ثم حصل على Gate 4A وKS-15/KS-16 و`D15-SEO-SITEMAP`؛ Gate 4A مكوّن من 12 حقلًا مثل بقية الـGates. مقارنة الخطة الأصلية بالحالة الحالية والفجوات والبلوكات ما زالت محفوظة.
- **بلوكات مسجلة:** توفر/اعتماد أصول Hero/OG/Banners/Categories/FAQ/Wishlist؛ wishlist الفعلية بلا عقد باك؛ static-pages أخرى؛ browser/Lighthouse environment؛ فجوة سلة العميل بعد merge؛ production seal. لا mock ولا endpoint متخيل ولا تعديل Header/Footer تلقائي.
- **مراجعة Astra:** مراجعة النسخة الضيقة السابقة `ses_df5807c99ffeYWKtDtpt5FMcbn` مُلغاة كمرجع نطاق؛ النسخة المُوضَّحة طُلبت مراجعتها في `docs/DAY8_TASKS.md §11`. لا تُترجم أي مراجعة إلى إذن implementation.
- **الحالة:** `DAY 8 SCOPE CLARIFICATIONS RECORDED — FULL SCOPE LOCKED — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED`. لا source/backend/DB/env/deps/commit؛ لا فتح Day 7 أو Navbar أو Dashboard أو Day 15؛ لا ترقية 🟡/NOT TESTED تلقائيًا.

⛔ STOP — DAY 8 SCOPE CLARIFICATIONS RECORDED — FULL SCOPE LOCKED — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED

## 50) OM EMAN — DAY 8 GATE 0: PRE-FLIGHT / BASELINE / SCOPE LOCK (2026-11-24)

- **الإذن الصريح:** `G0 — DAY 8 PRE-FLIGHT / SCOPE LOCK`؛ موافقة مستقلة للقراءة والتوثيق فقط. صفر تعديل مصدر، صفر backend/DB/env/deps/config/deploy، صفر commit/push، صفر reset/clean/checkout/stash. الملف الوحيد المسموح تحديثه هو `docs/PROGRESS.md`.
- **المرجعية:** `AGENTS.md`، `FRONTEND_TASKS §0.3/يوم8/يوم9/يوم10`، `PROGRESS §47-§49`، `DAY7_TASKS §6/§7/§12`، `DAY8_TASKS` كامل. النطاق الكامل المثبّت في §49 هو الحاكم؛ G0 القديمة ملغاة ولا تُعتبر إذن تنفيذ. لا فتح G1/G2/G3/G4/G4A/G5/G6 تلقائيًا.
- **Baseline مؤرّخ:** repo root `E:/NODE_JS/Udemy/Training`؛ frontend cwd `Om-Eman/frontend`؛ branch `main`؛ HEAD `36d1d96 End Day6`. `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` = `287e5be2e36f81680fa8ac2f199606078b7b759151addb21c8231642942e00ea` قبل وبعد G0؛ `101` إجمالي مدخلات، منها `24` tracked modified و`77` untracked. الشجرة المتسخة موروثة من Days 1–7/Navbar/Day8 docs ولم يُلمس شيء منها سوى إضافة هذا القسم إلى `docs/PROGRESS.md`.
- **تحذيرات Git دون أخطاء محتوى:** `warning: could not open directory 'Day7-caching/backend/.claude/skills/prisma-cli/': No such file or directory` وأمثالها لمسارات `.claude/skills/prisma-*` و`.windsurf/skills/prisma-*`؛ `warning: in the working copy of 'Om-Eman/frontend/components/ECommerce/Cart/CartDrawer.tsx', LF will be replaced by CRLF the next time Git touches it` وأمثالها لملفات الـdirty tree. هذه تحذيرات Windows LF→CRLF/symlink noise، لا whitespace errors ولا تعديلات G0.
- **فحوص القراءة/الbaseline المنفذة:** `git status --short --untracked-files=all`؛ `git rev-parse`؛ `git log -5 --oneline`؛ `git diff --check` → `EXIT 0`؛ `git diff --stat -- package.json package-lock.json` → بلا diff؛ `npm run lint` → `EXIT 0`؛ `npm run check` → `EXIT 0` (`297 code files`, `477 message keys per locale`, `0 failure(s), 0 warning(s)`)؛ `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`؛ فحص وجود أصول؛ فحص وجود أدوات متصفح. لم يُعاد `npm run build` داخل G0 لأنه يكتب مخرجات `.next`؛ الدليل الموروث من §48: `npm run build` → `EXIT 0`، Next `16.4.5`، `56/56` pages. لا ادعاء باختبار runtime أو بصري بهذه الأوامر.
- **البيئة:** `package.json` scripts: `dev`, `build`, `start`, `lint`, `check`. `.env.example` موجود و`.env` غير موجود؛ لم تُقرأ قيم Biئة أو tokens أو أسرار. `playwright` و`@playwright/test` و`puppeteer` غير موجودين في `node_modules`؛ لا أداة browser/visual/Lighthouse مأذونة أو مثبتة هنا ⇒ `D8-BROWSER: NOT TESTED`.
- **العقود والبنية:** `lib/server/storeFetch.ts` يستخدم `TStoreResult` ولا يرمي استثناء؛ `lib/server/storeQueries.ts` يستخدم `"use cache"` + `cacheTag` + `cacheLife("minutes"/"seconds")`؛ `store/baseApi.ts` هو gateway الوحيد لطلبات RTK Query مع envelope errors و`Bearer` من `customerSession`؛ `cartApi.ts` يستخدم `/store/cart*` الحقيقية؛ guest token في `om_cart_token`، customer token في `oe.customer.session`. Provider order في `app/[locale]/layout.tsx:86-95` مطابق: `NextIntlClientProvider > ReduxProvider > ThemeProvider > MotionProvider` مع `ThemeScript` في `<head>`. لا endpoint جديد ولا using قبل مراجعة عقده.
- **حالة مصدر Day 8 كما وُجدت:** Home SSR موجودة عبر `app/[locale]/(Store)/page.tsx` + `HomeSections`؛ Hero/Trust/Banners/Categories/Featured موجودة. SEO عام عبر `buildMetadata` و`StoreJsonLd` موجود، مع `Organization/WebSite/SearchAction` وبناء `BreadcrumbList` متاح في `lib/jsonld.ts` لكنه غير موصول بالهوم؛ لا `metadata.ts` للهوم ولا صور OG/Twitter. Shell موجود ويخضع للتدقيق فقط. States جزئية: Categories/Featured أخطاء واضحة، لكن Banner/Featured يرجعان `null` عند empty/error. Google button لا يزال `disabled` برسالة notConfigured؛ لا `CartCheckoutLink` ولا مفاتيح `cart.checkout.*`؛ لا صفحات/مكوّنات/روابط FAQ أو Wishlist ولا مصادر محتوى FAQ موثقة. G5 خارج هذا الـGate تمامًا.
- **سجل الأصول/الاعتماد (`D8-ASSET-REGISTER`):** الفحص الصريح أعطى `MISSING` لكل الأسماء المقترحة التسعة: `om-eman-home-hero.webp`, `om-eman-og-cover.webp`, `om-eman-banner-main.webp`, `category-herbs.webp`, `category-spices.webp`, `category-blends.webp`, `category-natural-products.webp`, `om-eman-faq-cover.webp`, `wishlist-empty.webp`. `public/assets/**/*` لا يُظهر سوى `public/assets/README.md` و`public/assets/brand/jar-mark.png`. موافقة المالك على الأصول غير مسجلة ⇒ `D8-HERO-ASSET`, `D8-OG-ASSET`, `D8-BANNER-ASSETS` BLOCKED؛ لا ربط ولا صور متخيلة.
- **تين المحتوى/القرارات:** FAQ محتواه يحتاج مصادر أعمال موثقة قبل أي صياغة؛ لا وعود شحن/دفع/إرجاع/توصيل متخيلة. Wishlist يبقى UI preparation فقط بلا endpoint/persistence/mutations. توسيع sitemap مؤجل إلى `D15-SEO-SITEMAP`؛ `app/sitemap.ts` لا يُعدَّل. Day 7 blockers (`D7-TRACK`, `D7-ACCOUNT`, `D7-MERGE`, `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR/D3-RM`, `B-PUB`, Day 5 deviations, `B-BUILD`, `R-PRIVATE-PROOF`, `R-G6-SEAL`) مجمدة كما هي.
- **API/runtime:** لا مكالمات endpoint في G0؛ HTTP 200 ليس acceptance. سلة الضيوف لها دليل موروث؛ `R-API-SEARCH` و`R-CART-WRITE` ما زالان مفتوحين؛ authenticated cart merge وقراءة سلة العميل بعد merge `NOT TESTED`؛ لا بيئة API/browser مؤكدة لهذا الـGate.
- **مراجعة Astra:** مراجعة التخطيط المُوضَّح `ses_df57010f8ffeo6p6XIy2icolT5` = `PASS WITH NOTES`، ومراجعة audit `ses_df55cd322ffeFJZ6hRnd76VAPi` = `PASS WITH NOTES`؛ المراجعة الضيقة القديمة `ses_df5807c99ffeYWKtDtpt5FMcbn` ملغاة كمرجع. تقرير G0 نفسه لم يُراجَع بعد ولا يُترجم أي رأي إلى إذن implementation.
- **قبول المالك/jاهزية الإنتاج:** `D8-OWNER-VIS PENDING`؛ `D8-SEAL NOT READY / NOT SEALED`. لا نشر ولا ترقية 🟡/NOT TESTED تلقائيًا. القرارات المطلوبة من المالك: توفير/اعتماد الأصول، مصادر FAQ، بيئة browser/Lighthouse، إثبات API runtime، وتأكيد إبقاء wishlist/sitemap/OAuth/merge مؤجلة.
- **النتيجة:** `G0 COMPLETE — SCOPE LOCKED — BASELINE RECORDED — NO IMPLEMENTATION AUTHORIZED`. لا شيء من Gates التنفيذية مفتوح؛ أي عمل لاحق يحتاج إذنًا مستقلًا باسم الـGate نفسه.

⛔ STOP — G0 COMPLETE — WAITING FOR OWNER REVIEW

## 51) DAY 8 G1 PHASE 0 — NEW PUBLIC IMAGE COLLECTION RECONCILIATION (2026-11-24)

- **Owner reconciliation:** المالك قبل G0 وأضاف ثلاثة مجلدات صور جديدة تحت `frontend/public/` بعد تدقيق G0. المجموعات الثلاث معتمدة كـ`Om Eman visual-reference collections` فقط، وليس كل صورة معتمدة تلقائيًا لكل موضع. المالك اختار اتجاه `wooden Om Eman brand hero` وطلب استخدام `Set_03_Campaign_And_Product_Collection` بشكل خاص في G1. لا حذف، لا إعادة تسمية، لا نقل، لا تحويل، لا dependencies جديدة، ولا تعديل على الصور الأصلية.
- **Baseline بعد إضافة الصور:** `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` = `19593018664b0c58a5a19b155e2d68b243bd79acd09dbf49363b77591a10c89a`؛ `130` إجمالي مدخلات. أُضيفت `29` صورة PNG جديدة ضمن ثلاثة مجلدات؛ الشجرة المتسخة الموروثة محفوظة.
- **حدود المراجعة البصرية:** النموذج الحالي لا يقبل إدخال الصور؛ لذلك لا يمكن تأكيد تشوه النص العربي، دقة اللوجو، تغليف متخيل، أو عرض منتج مضلل من البكسلات. توصيف الملفات وأسماؤها ونسب الأبعاد موثقة أدناه فقط؛ أي استخدام نهائي يبقى خاضعًا لمراجعة المالك البصرية. لا يُدعى أن صورة معتمدة لموضع لم يعتمده المالك صراحةً.
- **قواعد الاختيار:** Hero: `Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png` هو المرشح العملي الوحيد وفق اسم الملف واتجاه المالك؛ الأبعاد `881x432`، النسبة `881:432` ≈ `2.0394`، الحجم `763599` bytes. Banners من بيانات المتجر تبقى مصدر البانر الحقيقي؛ صور `fast_delivery`, `quality`, `special_offers`, `natural_drinks` تحمل ادعاءات محتملة ولا تُستخدم كبانر متجر قبل تحقق المحتوى. Categories تُستخدم فقط عند وجود mapping صالح بين slug المتجر والصورة؛ لا رابط عشوائي.
- **ملاحظة الترتيب/الأسماء:** أرقام الملفات ليست متسقة عبر المجموعات من حيث الغرض بعد `02`؛ لذلك سيُضاف مصدر مركزي للصور يعتمد على `collection folder + semantic role + exact filename per collection`، بحيث تغيير مسار المجلد في مكان واحد يبدّل مجموعة الصور كاملة بدون تعديل مكوّنات الهوم.

| # | Exact relative path | Filename | Extension | Dimensions | Aspect ratio | File size | Intended usage from filename | Review status |
|---:|---|---|---|---|---|---:|---|---|
| 1 | `public/Set_01_Brand_Collection/01_wooden_logo_hero.png` | `01_wooden_logo_hero.png` | `.png` | `870x442` | `435:221` ≈ `1.9683` | `760766` bytes | Hero / wooden logo direction | visual-ref approved; placement unverified |
| 2 | `public/Set_01_Brand_Collection/02_round_logo_spice_banner.png` | `02_round_logo_spice_banner.png` | `.png` | `796x442` | `398:221` ≈ `1.8009` | `592921` bytes | Banner / round logo spice | claim/use unverified |
| 3 | `public/Set_01_Brand_Collection/03_herbs_category.png` | `03_herbs_category.png` | `.png` | `334x241` | `334:241` ≈ `1.3859` | `159063` bytes | Herbs category | slug-map required |
| 4 | `public/Set_01_Brand_Collection/04_spices_category.png` | `04_spices_category.png` | `.png` | `323x241` | `323:241` ≈ `1.3402` | `140748` bytes | Spices category | slug-map required |
| 5 | `public/Set_01_Brand_Collection/05_blends_category.png` | `05_blends_category.png` | `.png` | `322x241` | `322:241` ≈ `1.3361` | `147091` bytes | Blends category | slug-map required |
| 6 | `public/Set_01_Brand_Collection/06_natural_products_category.png` | `06_natural_products_category.png` | `.png` | `322x241` | `322:241` ≈ `1.3361` | `140214` bytes | Natural products category | slug-map required |
| 7 | `public/Set_01_Brand_Collection/07_bay_leaves_category.png` | `07_bay_leaves_category.png` | `.png` | `347x241` | `347:241` ≈ `1.4398` | `144018` bytes | Bay leaves category | not selected for G1 homepage mapping |
| 8 | `public/Set_01_Brand_Collection/08_herbal_recipes_banner.png` | `08_herbal_recipes_banner.png` | `.png` | `560x211` | `560:211` ≈ `2.6540` | `191129` bytes | Banner / herbal recipes | claim/use unverified |
| 9 | `public/Set_01_Brand_Collection/09_faq_banner.png` | `09_faq_banner.png` | `.png` | `563x211` | `563:211` ≈ `2.6682` | `182457` bytes | FAQ banner | G4A only / not G1 |
| 10 | `public/Set_01_Brand_Collection/10_wishlist_empty_banner.png` | `10_wishlist_empty_banner.png` | `.png` | `536x211` | `536:211` ≈ `2.5403` | `175484` bytes | Wishlist empty banner | G4A only / not G1 |
| 11 | `public/Set_02_Modern_Organic_Collection/01_wooden_logo_hero.png` | `01_wooden_logo_hero.png` | `.png` | `977x403` | `977:403` ≈ `2.4243` | `763879` bytes | Hero / wooden logo direction | visual-ref approved; not owner-selected set |
| 12 | `public/Set_02_Modern_Organic_Collection/02_herbal_tea_banner.png` | `02_herbal_tea_banner.png` | `.png` | `684x403` | `684:403` ≈ `1.6973` | `438199` bytes | Banner / herbal tea | not owner-selected set |
| 13 | `public/Set_02_Modern_Organic_Collection/03_herbs_category.png` | `03_herbs_category.png` | `.png` | `332x251` | `332:251` ≈ `1.3227` | `145884` bytes | Herbs category | slug-map required |
| 14 | `public/Set_02_Modern_Organic_Collection/04_spices_category.png` | `04_spices_category.png` | `.png` | `317x251` | `317:251` ≈ `1.2629` | `137928` bytes | Spices category | slug-map required |
| 15 | `public/Set_02_Modern_Organic_Collection/05_blends_category.png` | `05_blends_category.png` | `.png` | `316x251` | `316:251` ≈ `1.2590` | `142634` bytes | Blends category | slug-map required |
| 16 | `public/Set_02_Modern_Organic_Collection/06_natural_products_category.png` | `06_natural_products_category.png` | `.png` | `319x251` | `319:251` ≈ `1.2709` | `124211` bytes | Natural products category | slug-map required |
| 17 | `public/Set_02_Modern_Organic_Collection/07_natural_oils_category.png` | `07_natural_oils_category.png` | `.png` | `313x251` | `313:251` ≈ `1.2470` | `120792` bytes | Natural oils category | not selected for G1 homepage mapping |
| 18 | `public/Set_02_Modern_Organic_Collection/08_faq_banner.png` | `08_faq_banner.png` | `.png` | `672x238` | `48:17` ≈ `2.8235` | `246949` bytes | FAQ banner | G4A only / not G1 |
| 19 | `public/Set_02_Modern_Organic_Collection/09_wishlist_empty_banner.png` | `09_wishlist_empty_banner.png` | `.png` | `369x238` | `369:238` ≈ `1.5504` | `123071` bytes | Wishlist empty banner | G4A only / not G1 |
| 20 | `public/Set_02_Modern_Organic_Collection/10_brand_footer_banner.png` | `10_brand_footer_banner.png` | `.png` | `580x238` | `290:119` ≈ `2.4370` | `251798` bytes | Footer/brand banner | Header/Footer forbidden in G1 |
| 21 | `public/Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png` | `01_wooden_logo_hero.png` | `.png` | `881x432` | `881:432` ≈ `2.0394` | `763599` bytes | Hero / wooden logo direction | **SELECTED HERO CANDIDATE**; visual text/logo unverified |
| 22 | `public/Set_03_Campaign_And_Product_Collection/02_natural_drinks_banner.png` | `02_natural_drinks_banner.png` | `.png` | `780x432` | `65:36` ≈ `1.8056` | `567090` bytes | Banner / natural drinks | claim/use unverified; not used as store banner in G1 |
| 23 | `public/Set_03_Campaign_And_Product_Collection/03_herbs_category.png` | `03_herbs_category.png` | `.png` | `405x259` | `405:259` ≈ `1.5637` | `195223` bytes | Herbs category | candidate; slug-map required |
| 24 | `public/Set_03_Campaign_And_Product_Collection/04_spices_category.png` | `04_spices_category.png` | `.png` | `395x259` | `395:259` ≈ `1.5251` | `188195` bytes | Spices category | candidate; slug-map required |
| 25 | `public/Set_03_Campaign_And_Product_Collection/05_blends_category.png` | `05_blends_category.png` | `.png` | `391x259` | `391:259` ≈ `1.5097` | `190084` bytes | Blends category | candidate; slug-map required |
| 26 | `public/Set_03_Campaign_And_Product_Collection/06_natural_products_category.png` | `06_natural_products_category.png` | `.png` | `409x259` | `409:259` ≈ `1.5792` | `188334` bytes | Natural products category | candidate; slug-map required |
| 27 | `public/Set_03_Campaign_And_Product_Collection/07_fast_delivery_banner.png` | `07_fast_delivery_banner.png` | `.png` | `557x205` | `557:205` ≈ `2.7171` | `166079` bytes | Banner / fast delivery | unverified business claim; not used |
| 28 | `public/Set_03_Campaign_And_Product_Collection/08_quality_banner.png` | `08_quality_banner.png` | `.png` | `540x205` | `108:41` ≈ `2.6341` | `147440` bytes | Banner / quality | unverified business claim; not used |
| 29 | `public/Set_03_Campaign_And_Product_Collection/09_special_offers_banner.png` | `09_special_offers_banner.png` | `.png` | `516x205` | `516:205` ≈ `2.5171` | `139173` bytes | Banner / special offers | unverified offer claim; not used |

- **D8-ASSET-REGISTER status:** collected paths discovered and recorded; `SET_03` is the active homepage reference collection; Hero candidate recorded above; category candidates exist but require real slug mapping; claim-bearing banner candidates are blocked from use in G1 store banners; visual text/logo/package fidelity remains Owner review pending because the current model cannot inspect image pixels.

## 52) DAY 8 G1 — HOMEPAGE STRUCTURE & DATA IMPLEMENTATION (2026-11-24)

- **تنفيذ مصرح به:** المالك فتح `G1 — DAY 8 HOMEPAGE STRUCTURE & DATA` فقط بعد قبول G0/sec51. لا فتح تلقائي لـG2/G3/G4/G4A/G5/G6/G7. لا SEO/metadata/JSON-LD/sitemap/robots/Google UI/Cart→Checkout/FAQ/Wishlist/Header/Footer/backend/API/DB/env/deps/commit/deploy. الشجرة المتسخة الموروثة محفوظة؛ ثلاثة مجلدات الصور الأصلية لم تُمس.
- **مصدر الصور المركزي:** `lib/brandAssets.ts` الآن يحتوي `HOME_IMAGE_COLLECTIONS` و`HOME_IMAGE_COLLECTION` و`HOME_ASSETS` و`getHomeCategoryImage`. تغيير قيمة `HOME_IMAGE_COLLECTION` في هذا الملف فقط يبدّل Hero ومسارات الأقسام للمجموعة كاملة؛ الخريطة تعتمد على `semantic role + exact filename per collection` وليس على ترقيم الملفات. القيمة النشطة `/Set_03_Campaign_And_Product_Collection`. مسار Hero الفعلي `/Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png`. صور الأقسام تُستخدم فقط كـfallback عند slug مطابق تمامًا (`herbs`, `spices`, `blends`, `natural-products`) وغياب `category.imageUrl` من API؛ لا رابط عشوائي ولا استبدال لبيانات المتجر.
- **Hero:** `components/ECommerce/Home/Hero.tsx` يستخدم `StoreImage` بدل `next/image` المباشر، ويعرض مسار Hero المعتمد من المصدر المركزي، ويحافظ على طبقة الحماية/الغموض النصي، ويستخدم `PRODUCTS_HREF` عبر `Link` المحلي بدل رابط `#categories`. لا فيديو جديد؛ مسارات الفيديو/البوستر تبقى `null`، وال CV/CTA نصه مترجم.
- **Banner/Featured states:** `BannerSection` لم يعد يرجع `null` عند الخطأ أو الفراغ؛ يعرض `ErrorState`/`EmptyState` بمفاتيح `home.banners.*`. `FeaturedSection` يعرض `EmptyState` عند غياب المنتجات ويحتفظ بـ`ErrorState` عند فشل API. بيانات البانر/المنتجات ما زالت من `lib/server/storeQueries.ts` و`TStoreResult` دون مكالمات مباشرة أو بيانات وهمية. صور البانر ذات الادعاءات غير المتحققة لم تُستخدم.
- **Categories:** `CategoriesSection` يمرر `fallbackImageUrl` الناتج من `getHomeCategoryImage(category.slug)` إلى `CategoryCard`. `CategoryCard` يقبل special prop اختياري ويستخدم `category.imageUrl` أولًا ثم الـfallback ثم placeholder الحالي؛ لا تغيير في عقد API ولا في بنية البطاقة.
- **الترجمات:** `messages/ar.json` و`messages/en.json` متطابقان الآن بـ`484` مفتاحًا لكل لغة. أُضيفت مفاتيح `home.hero.imageAlt`، `home.banners.errorTitle/errorBody/emptyTitle/emptyBody`، `home.featured.emptyTitle/emptyBody`، وتم تعديل `home.hero.cta` إلى «اتسوّق دلوقتي» / `Shop now`. لا نص مستخدم مكتوب داخل المكوّنات.
- **الملفات المعدّلة في التنفيذ:** `lib/brandAssets.ts`، `components/ECommerce/Home/Hero.tsx`، `components/ECommerce/Home/BannerSection.tsx`، `components/ECommerce/Home/FeaturedSection.tsx`، `components/ECommerce/Home/CategoriesSection.tsx`، `components/Card/CategoryCard.tsx`، `messages/ar.json`، `messages/en.json`، وهذا القسم من `docs/PROGRESS.md`. لا ملفات جديدة، لا حذف، لا نقل، لا تحويل صور، لا تعديل على `package.json`/`package-lock.json`.
- **VerificationCommandResults:** `npm run lint` → `EXIT 0`؛ `npm run check` → `EXIT 0` (`297 code files`, `484 message keys per locale`, `0 failure(s), 0 warning(s)`)؛ `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`؛ `npm run build` → `EXIT 0` (Next `16.4.5`، `56/56` pages، TypeScript نجح، سجل `store/* NETWORK_ERROR` أثناء prerender لأن API غير شغال؛ لا يغيّر exit code)؛ `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF موروثة؛ `git status --short --untracked-files=all` → رُوجع؛ `git diff --stat` → رُوجع؛ `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff.
- **حدود التحقق:** لا API runtime، لا browser/visual/Lighthouse، لا Playwright/Puppeteer، لا ديسكتوب/360px RTL/LTR/theme matrix. مراجعة نص/لوجو/تغليف الصور والplacement النهائي تبقى `D8-OWNER-VIS PENDING`؛ لا ادعاء بجاهزية إنتاج. `D8-SEAL NOT READY / NOT SEALED`.
- **النتيجة:** `G1 COMPLETE — HOMEPAGE STRUCTURE/DATA IMPLEMENTED — VERIFIED BY STATIC COMMANDS — AWAITING OWNER REVIEW`.

⛔ STOP — G1 COMPLETE — WAITING FOR OWNER REVIEW

## 53) DAY 8 G2 — SEO / METADATA / STRUCTURED DATA IMPLEMENTATION (2026-11-24)

- **تنفيذ مصرح به:** المالك فتح `G2 — DAY 8 SEO & STRUCTURED DATA` فقط بعد تسليم G1 source-wise. G1 visual acceptance ما زال PENDING ولا يُعتبر مقبولًا بصريًا بهذا الإذن. لا فتح تلقائي لـG3/G4/G4A/G5/G6/G7. الشجرة المتسخة الموروثة محفوظة؛ لا reset/clean/checkout/stash، لا commit/push/deploy.
- **نطاق منفّذ:** homepage `generateMetadata` عبر `buildMetadata`، canonical، hreflang/alternates، OpenGraph/Twitter مع صورة OG حقيقية، ومراجعة JSON-LD الحالي. خارج النطاق بالكامل: sitemap/robots، FAQ/Wishlist، Header/Footer، Google UI، Cart→Checkout، محتوى الهوم/Hero/Banner، API/DB/backend، env/config/dependencies/package files، ومكتبات SEO جديدة.
- **خطة ملفات قُدّمت قبل التعديل:** `lib/seo.ts` لإضافة صورة OG اختيارية داخل `buildMetadata`؛ `lib/brandAssets.ts` لتسجيل المسار الحقيقي؛ `app/[locale]/(Store)/metadata.ts` جديد لمولّد metadata الهوم؛ `app/[locale]/(Store)/page.tsx` لإعادة التصدير فقط؛ `messages/{ar,en}.json` لمفاتيح متماثلة؛ `docs/PROGRESS.md` للتوثيق. `StoreJsonLd.tsx` و`lib/jsonld.ts` و`(Store)/layout.tsx` وsitemap/robots كانت للمراجعة فقط.
- **قرار الأصل (`D8-ASSET-REGISTER`):** المالك اختار صراحةً المسار الحقيقي `public/Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png` ليُستخدم كصورة OG للهوم. الأصل موجود فعليًا؛ الأبعاد `881x432`؛ النسبة `881:432 ≈ 2.0394`؛ الحجم `763599 bytes`؛ هدف النسبة `1200x630 ≈ 1.9048`. النموذج الحالي لا يستطيع فحص بكسلات الصورة؛ لذلك لا يُدعى تحقق مستقل من تشوه النص العربي أو دقة اللوجو أو التغليف. اعتماد الربط هو قرار المالك على المسار المحدد، والمراجعة البصرية النهائية لل cropped social preview تبقى `D8-OWNER-VIS PENDING`.
- **قواعد الاستخدام:** لا صورة متخيلة، لا generic fallback، لا تغيير للصورة الأصلية، لا تحويل/إعادة تسمية/نقل، لا استنتاج ادعاءات منتج من أسماء الملفات، ولا ربط بانرات ذات ادعاءات غير متحققة. بقية الصور سُجّلت كمرشحات غير مختارة فقط.

### 53.1 سجل مرشحات OG — inventories فعلية من PNG IHDR

| # | Exact relative path | Dimensions | Aspect | Bytes | G2 decision |
|---:|---|---|---:|---:|---|
| 1 | `public/Set_01_Brand_Collection/01_wooden_logo_hero.png` | `870x442` | `1.9683` | `760766` | not selected; wooden-hero alternative |
| 2 | `public/Set_01_Brand_Collection/02_round_logo_spice_banner.png` | `796x442` | `1.8009` | `592921` | not selected; banner use unverified |
| 3 | `public/Set_01_Brand_Collection/03_herbs_category.png` | `334x241` | `1.3859` | `159063` | not selected; category use |
| 4 | `public/Set_01_Brand_Collection/04_spices_category.png` | `323x241` | `1.3402` | `140748` | not selected; category use |
| 5 | `public/Set_01_Brand_Collection/05_blends_category.png` | `322x241` | `1.3361` | `147091` | not selected; category use |
| 6 | `public/Set_01_Brand_Collection/06_natural_products_category.png` | `322x241` | `1.3361` | `140214` | not selected; category use |
| 7 | `public/Set_01_Brand_Collection/07_bay_leaves_category.png` | `347x241` | `1.4398` | `144018` | not selected; slug-map required |
| 8 | `public/Set_01_Brand_Collection/08_herbal_recipes_banner.png` | `560x211` | `2.6540` | `191129` | not selected; claim/use unverified |
| 9 | `public/Set_01_Brand_Collection/09_faq_banner.png` | `563x211` | `2.6682` | `182457` | not selected; G4A role only |
| 10 | `public/Set_01_Brand_Collection/10_wishlist_empty_banner.png` | `536x211` | `2.5403` | `175484` | not selected; G4A role only |
| 11 | `public/Set_02_Modern_Organic_Collection/01_wooden_logo_hero.png` | `977x403` | `2.4243` | `763879` | not selected; wooden-hero alternative |
| 12 | `public/Set_02_Modern_Organic_Collection/02_herbal_tea_banner.png` | `684x403` | `1.6973` | `438199` | not selected; banner use unverified |
| 13 | `public/Set_02_Modern_Organic_Collection/03_herbs_category.png` | `332x251` | `1.3227` | `145884` | not selected; category use |
| 14 | `public/Set_02_Modern_Organic_Collection/04_spices_category.png` | `317x251` | `1.2629` | `137928` | not selected; category use |
| 15 | `public/Set_02_Modern_Organic_Collection/05_blends_category.png` | `316x251` | `1.2590` | `142634` | not selected; category use |
| 16 | `public/Set_02_Modern_Organic_Collection/06_natural_products_category.png` | `319x251` | `1.2709` | `124211` | not selected; category use |
| 17 | `public/Set_02_Modern_Organic_Collection/07_natural_oils_category.png` | `313x251` | `1.2470` | `120792` | not selected; slug-map required |
| 18 | `public/Set_02_Modern_Organic_Collection/08_faq_banner.png` | `672x238` | `2.8235` | `246949` | not selected; G4A role only |
| 19 | `public/Set_02_Modern_Organic_Collection/09_wishlist_empty_banner.png` | `369x238` | `1.5504` | `123071` | not selected; G4A role only |
| 20 | `public/Set_02_Modern_Organic_Collection/10_brand_footer_banner.png` | `580x238` | `2.4370` | `251798` | not selected; Header/Footer forbidden |
| 21 | `public/Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png` | `881x432` | `2.0394` | `763599` | **SELECTED OG ASSET**; owner-selected exact path; pixel fidelity not independently inspected |
| 22 | `public/Set_03_Campaign_And_Product_Collection/02_natural_drinks_banner.png` | `780x432` | `1.8056` | `567090` | not selected; claim/use unverified |
| 23 | `public/Set_03_Campaign_And_Product_Collection/03_herbs_category.png` | `405x259` | `1.5637` | `195223` | not selected; category use |
| 24 | `public/Set_03_Campaign_And_Product_Collection/04_spices_category.png` | `395x259` | `1.5251` | `188195` | not selected; category use |
| 25 | `public/Set_03_Campaign_And_Product_Collection/05_blends_category.png` | `391x259` | `1.5097` | `190084` | not selected; category use |
| 26 | `public/Set_03_Campaign_And_Product_Collection/06_natural_products_category.png` | `409x259` | `1.5792` | `188334` | not selected; category use |
| 27 | `public/Set_03_Campaign_And_Product_Collection/07_fast_delivery_banner.png` | `557x205` | `2.7171` | `166079` | not selected; unverified business claim |
| 28 | `public/Set_03_Campaign_And_Product_Collection/08_quality_banner.png` | `540x205` | `2.6341` | `147440` | not selected; unverified business claim |
| 29 | `public/Set_03_Campaign_And_Product_Collection/09_special_offers_banner.png` | `516x205` | `2.5171` | `139173` | not selected; unverified offer claim |

### 53.2 مصدر التنفيذ

- `lib/seo.ts`: أُضيف عقد `ISeoImage` وحقل اختياري `ogImage` إلى `buildMetadata`؛ عند توفيره يُخرج `openGraph.images` و`twitter.images` بالمسار والأبعاد والـalt. لم يُنشأ metadata موازٍ؛Canonical/hreflang/OG/Twitter ما زالت من مصدر واحد.
- `lib/brandAssets.ts`: أُضيف `HOME_OG_ASSET` بالمسار الحقيقي `/Set_03_Campaign_And_Product_Collection/01_wooden_logo_hero.png` والأبعاد `881x432`. الصورة تُحوَّل إلى URL مطلق في metadata عبر `SITE_URL` الحالي.
- `app/[locale]/(Store)/metadata.ts`: ملف جديد مسؤول فقط عن `generateMetadata` للهوم؛ يقرأ `home.metaTitle` و`home.metaDescription` و`home.ogImageAlt`، ويمرر `path: ""` حتى يبقى الـcanonical `/{locale}`.
- `app/[locale]/(Store)/page.tsx`: أُضيف re-export لـ`generateMetadata` من الملف الجديد؛ الصفحة بقيت رقيقة ولا تحتوي business logic.
- `messages/ar.json` و`messages/en.json`: أُضيفت مفاتيح `home.metaTitle` و`home.metaDescription` و`home.ogImageAlt` بتماثل كامل؛ لا نص مستخدم hard-coded في metadata.
- مراجعة JSON-LD: `components/ECommerce/StoreJsonLd.tsx` و`lib/jsonld.ts` و`(Store)/layout.tsx` لم تُعدَّل لأن `Organization` و`WebSite/SearchAction` موجودان وصحيحان في مصدر واحد عبر `JsonLd` الآمن. لا `BreadcrumbList` وهمي على الهوم لأن الصفحة جذرية ولا يوجد breadcrumb مرئي؛ القرار موثّق في `DAY8_TASKS.md §2`. لا بيانات عميل/توكن/بريد في structured data.
- لا تعديلات على `app/sitemap.ts` أو `app/robots.ts`؛ `D15-SEO-SITEMAP` ما زال مؤجلًا. لا تعديل Header/Footer أو Hero/Banner/Featured/Categories أو أي API/DB/env/deps.

### 53.3 VerificationCommandResults

- `npm run lint` → `EXIT 0`.
- `npm run check` → `EXIT 0`؛ `298 code files`، `487 message keys per locale`، `0 failure(s), 0 warning(s)`.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
- `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `79s`؛ TypeScript `11.8s`؛ `56/56` pages. لا `NETWORK_ERROR` في تشغيل هذه الـGate.
- `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ من أعمال G2 يظهر `app/[locale]/(Store)/metadata.ts` جديدًا، مع تعديل `page.tsx`، `lib/seo.ts`، `lib/brandAssets.ts`، `messages/ar.json`، `messages/en.json`، و`docs/PROGRESS.md`. بقية القائمة موروثة.
- `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink اعتيادية على Windows، بلا whitespace errors.
- `git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج النطاق المخطط.
- `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
- `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash أثناء preflight قبل تعديلات المصدر `f62c40f8345ca441973ab5b16ab4deae45f51f5df2cec3f8cf4ca4f8aba113a2`، وبعد كل ملفات G2 `82b75694da2c6679c13b7ad92f14067d22115e5893e89c4dfea5c885f9106485`؛ الفرق هو ملفات G2 المخططة فقط داخل شجرة متسخة موروثة.
- **HTML source verification:** شغّل `next start -p 3001` محليًا لفحص مصدر `/ar` و`/en` ثم أُوقف. كلا المصدرين يحتوي `<title>`، canonical، alternates `ar/en/ar-EG/x-default`، `og:*`، `twitter:*`، وscriptين `application/ld+json` لـOrganization وWebSite/SearchAction. لا escaping problems ظاهرة في JSON-LD؛ الـSearchAction target هو `/{locale}/search?q={search_term_string}`. عناوين الـSEO تظهر `http://localhost:3001/...` لأن قيمة `NEXT_PUBLIC_SITE_URL` في `.env.local` محلية؛ لم يُتحقق من عنوان إنتاج.
- **Browser Verification:** `NOT TESTED`. لا Playwright/Puppeteer/Lighthouse؛ فحص HTML source ليس بديلًا عن DOM/browser/CWV/social preview. HTTP/local source inspection لا يُرقَّى إلى visual acceptance.
- **Astra Review:** `NOT TESTED` لهذا التقرير. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner visual acceptance:** `PENDING`، خصوصًا اجتماع الصورة مع الـcrop النهائي لمعاينات السوشيال.
- **النتيجة:** `G2 SOURCE IMPLEMENTATION COMPLETE — AUTOMATED CHECKS PASS — HTML SEO VERIFICATION PASS — BROWSER VERIFICATION NOT TESTED — OWNER ACCEPTANCE PENDING — NO NEXT GATE AUTHORIZED`.

⛔ STOP — G2 COMPLETE — WAITING FOR OWNER REVIEW

## 54) DAY 8 G3 — GOOGLE SIGN-IN UI ONLY IMPLEMENTATION (2026-11-24)

- **تنفيذ مصرح به:** المالك فتح `G3 — DAY 8 GOOGLE SIGN-IN UI ONLY` صراحةً، مع تحديث إذن Execution لاحقًا. لا فتح تلقائي لـG4/G4A/G5/G6/G7. G1/G2 visual acceptance ما زال PENDING، وGoogle real auth ما زال `DEFERRED — NO IMPLEMENTATION AUTHORIZED`. الشجرة المتسخة الموروثة محفوظة؛ لا reset/clean/checkout/stash، لا commit/push/deploy.
- **Preflight:** قُرئت `AGENTS.md`، `FRONTEND_TASKS_10_DAYS.md §0.3/يوم8`، `PROGRESS.md §49/§53`، `DAY7_TASKS.md §6/§7`، `DAY8_TASKS.md §0/§5.4/§Gate3`، والكود الحالي. فُحص `git status` قبل التعديل؛ لم يوجد تعارض عقد بعد مواءمة أحدث رسالة مالك مع وصف `DAY8_TASKS.md` لأن الإذن الصريح الحالي يحتوي اسم Gate بعينه.
- **خطة ملفات قُدّمت قبل التعديل:** `components/ECommerce/Account/GoogleSignInButton.tsx` للجعل الزر متاحًا وتغذية الراجاع فقط؛ `messages/{ar,en}.json` لمفتاح `account.google.*` مترجم؛ `docs/PROGRESS.md` للتوثيق. `LoginForm.tsx` و`Button.tsx` و`Toaster.tsx` كانت للمراجعة فقط ولم تُعدَّل.
- **مصدر التنفيذ:** `GoogleSignInButton.tsx` أصبح client component، وأُزيل `disabled`، وأُضيف `onClick` واحد يستدعي `toast(unavailable)` محايدًا عبر Sonner الموجود. لا `toast.success` ولا `toast.error`، لا router/redirect، لا fetch/axios/RTK Query، لا GIS/OAuth/client ID/secret/callback، لا token/session/customer/cart merge، لا تغيير في `LoginForm` أو Email/Password.
- **الهوية البصرية:** علامة Google "G" أحادية اللون من مسار SVG ثابت تُPaint عبر `currentColor`؛ لا أصل Google جاهز داخل المشروع، ولا ألوان خام، ولا dependencies/أصول جديدة. اختيار monochromatic theme-safe mark هو حل وسط Chancellor لقواعد `no raw colors`؛ دقة الألوان الرسمية متعددة الألوان تبقى `D8-OWNER-VIS PENDING` وليست ادعاءً بمراجعة بصرية نهائية.
- **الوصول والتجاوب:** الزر يستخدم `Button variant="soft"` الموجود، فيحتفظ بـ`focus-visible:outline-primary` و`active:scale`، مع `w-full whitespace-nowrap` وgap موجود؛ لا classes `left/right`. `title` و`aria-label` يستخدمان رسالة عدم التوفر المترجمة؛ أُزيل النص `sr-only` القديم لأن `aria-label` يغطي نفس المعنى. أنيميشن `animate-fade-up` الحالي يحترم `prefers-reduced-motion` عبر CSS الموجود؛ لم يُضف أنيميشن جديد.
- **الترجمات:** استُبدل `account.google.notConfigured` بـ`account.google.unavailable` في `messages/ar.json` و`messages/en.json`: «تسجيل الدخول عبر Google غير متاح حاليًا.» / `Google sign-in is currently unavailable.` المفاتيح متطابقة، иحصاء `npm run check` ما زال `487` لكل لغة، ولا يوجد نص مستخدم hard-coded في المكوّن.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `298 code files`، `487 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `71s`؛ TypeScript `9.4s`؛ `56/56` pages. لا `NETWORK_ERROR` في تشغيل هذه الـGate.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ `GoogleSignInButton.tsx` ما زال untracked موروثًا، و`messages/ar.json`/`messages/en.json`/`docs/PROGRESS.md` modifications موروثة الأصل؛ لا ملف جديد أو محذوف بسبب G3.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج النطاق المخطط.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash أثناء preflight وبعد ملفات G3 وبعد توثيق هذا القسم بقي `82b75694da2c6679c13b7ad92f14067d22115e5893e89c4dfea5c885f9106485` لأن قائمة المسارات المتسخة لم تتغير؛ محتويات G3 داخل ملفات موروثة/modified بالفعل.
- **Network/Source review:** فحص مصدر الزر يُظهر صفر request وصفر تعديل `customerSession`/`cartToken` وصفر redirect وصفر toast نجاح. لوحة Network في المتصفح لم تُستخدم؛ لذلك تبقى `NOT TESTED` لا `PASS`.
- **Browser Verification:** `NOT TESTED`. لا Playwright/Puppeteer/Lighthouse؛ لم تُنفَّذ مصفوفة الضغط/HP، focus-visible، RTL/LTR، 360px/desktop، 4 ثيمات، أو reduced motion فعليًا. لا يُرقَّى فحص المصدر إلى visual acceptance.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner visual acceptance:** `PENDING`، خصوصًا شكل علامة Google أحادية اللون ورسالة التوست في اللغتين/الاتجاهين.
- **النتيجة:** `G3 SOURCE IMPLEMENTATION COMPLETE — UI-ONLY — NO REAL GOOGLE AUTH — AUTOMATED CHECKS PASS — BROWSER VERIFICATION NOT TESTED — ASTRA NOT TESTED — OWNER REVIEW PENDING — NO NEXT GATE AUTHORIZED`.

⛔ STOP — G3 PARTIAL — NO NEXT GATE AUTHORIZED

## 55) DAY 8 G4 — CART → CHECKOUT ENTRY IMPLEMENTATION (2026-11-25)

- **تنفيذ مصرح به:** المالك فتح `G4 — DAY 8 CHECKOUT ENTRY` صراحةً وأكد `تم اعتماد G3 — Google UI/UX من المالك`. G0 مقبول وموثّق في §51؛ لا فتح تلقائي لـG4A/G5/G6/G7. G1/G2 visual acceptance ما زال PENDING، وGoogle real auth ما زال `DEFERRED — NO IMPLEMENTATION AUTHORIZED`. الشجرة المتسخة الموروثة محفوظة؛ لا reset/clean/checkout/stash، لا commit/push/deploy.
- **Preflight:** قُرئت `AGENTS.md`، `FRONTEND_TASKS_10_DAYS.md §0.3/يوم8/يوم9/يوم10`، `PROGRESS.md §49/§50/§51/§54`، `DAY7_TASKS.md §6/§7`، `DAY8_TASKS.md §0/§5.5/§Gate4/§8`، والكود الحالي لـCart/Checkout/Routes/i18n/Button/messages. فُحص `git status`؛ hash ما قبل التعديل `82b75694da2c6679c13b7ad92f14067d22115e5893e89c4dfea5c885f9106485`. حُلّ التعارض الظاهري حول G0: النص القديم ملغى، لكن G0 الجديد مقبول في §51، والإذن الحالي باسم G4 صريح؛ لذلك لا حاجر implementation.
- **خطة ملفات قُدّمت قبل التعديل:** `CartCheckoutLink.tsx` ملف جديد للرابط فقط؛ `CartSummary.tsx` لعرض الـCTA كـslot؛ `CartDrawer.tsx` لتمرير حالة العرض فقط؛ `messages/{ar,en}.json` لـ`cart.checkout.cta`؛ `docs/PROGRESS.md` للتوثيق. `CartSection.tsx` وCheckout internals و`lib/routes.ts` و`Button.tsx` وtoken hooks كانت للمراجعة فقط ولم تُعدَّل.
- **مصدر التنفيذ:** أُضيف `components/ECommerce/Cart/CartCheckoutLink.tsx`، وهو client component صغير يستخدم `Link` من `@/i18n/navigation` مع `CHECKOUT_HREF` و`buttonVariants()` و`w-full`؛ لا `<a>` ولا `<button>` يقلّد الرابط ولا `useRouter` ولا fetch/mutation ولا token.
- **فصل المسؤوليات:** `CartDrawer` يحسب `showCheckout` من `hasHydrated && token !== undefined && !isLoading && !error && data !== undefined && data.itemsCount > 0` ويمرّر boolean فقط. `CartSummary` يعرض CTA عند `showCheckout` دون معرفة الـtoken أو الـrouter أو الـAPI. لا إجماليات أو سلة مختلقة.
- **الترجمات:** أُضيف `cart.checkout.cta` إلى `messages/ar.json` و`messages/en.json`: «متابعة إلى الدفع» / `Continue to checkout`. المفاتيح متطابقة، ولا نص مستخدم hard-coded في المكوّن الجديد.
- **العقود والبيانات:** الرابط ينتقل إلى `/checkout` عبر `CHECKOUT_HREF` فقط. checkout يقرأ نفس guest token عبر `useCartToken`/`useGetCartByTokenQuery` الموجودين. لم يُضف request ولا storage key ولا cart slice ولا تغيير `om_cart_token` أو customer session؛ فجوة قراءة سلة العميل بعد merge ما زالت موثّقة ومحجوبة.
- **خارج النطاق:** لم تُنفَّذ ملاحظة زر الإضافة الثابت فوق BackToTop لأنها خارج إذن G4 وتحتاج إذنًا منفصلًا. لا Checkout internals، لا cart mutations، لا style/motion جديد، لا FAQ/Wishlist، لا Header/Footer، لا backend/DB/env/deps، لا commit/push/deploy.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `299 code files`، `488 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `84s`؛ TypeScript `63s`؛ `56/56` pages.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ `CartCheckoutLink.tsx` ملف جديد ضمن نطاق G4، والباقي مدخلات موروثة؛ لا حذف أو إصلاح تلقائي للشجرة المتسخة.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج الملفات المخططة سوى هذا القسم التوثيقي.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash ما قبل G4 `82b75694da2c6679c13b7ad92f14067d22115e5893e89c4dfea5c885f9106485`، وبعد G4 `237ce298b63bf98fefeacfee4ba0897c3afb07782812b3f58bf23b17f48be456`. التغيير الوحيد في قائمة المسارات هو إضافة `components/ECommerce/Cart/CartCheckoutLink.tsx`؛ كل المسارات الأخرى موروثة ولم يُحذف أو يُصلَح شيء تلقائيًا.
- **Network/Source review:** فحص المصدر يُظهر أن الضغط على CTA لا ينشئ request سوى تنقل الصفحة، ولا يغيّر cart token. لوحة Network في المتصفح لم تُستخدم؛ لذلك تبقى `NOT TESTED` لا `PASS`.
- **Browser Verification:** `NOT TESTED`. لا Playwright/Puppeteer/Lighthouse؛ لم تُنفَّذ مصفوفة loaded/empty/loading/error، 360px/desktop، RTL/LTR، 4 ثيمات، أو focus-visible فعليًا. لا يُرقَّى فحص المصدر إلى visual acceptance.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner acceptance:** `PENDING`. **Next gate:** `NOT AUTHORIZED`.
- **النتيجة:** `G4 SOURCE IMPLEMENTATION COMPLETE — CHECKOUT ENTRY ONLY — AUTOMATED CHECKS PASS — BROWSER VERIFICATION NOT TESTED — ASTRA NOT TESTED — OWNER ACCEPTANCE PENDING — NO NEXT GATE AUTHORIZED`.

⛔ STOP — G4

## 56) OWNER FOLLOW-UP — CART BADGE RESET / FLOATING CTA / HERO SLIDER (2026-11-25)

- **تنفيذ مصرح به:** بعد `G4` أصدر المالك إذنًا صريحًا بـ`ابدأ الآن` لثلاث مهام خارج نطاق G4: تفريغ رقم السلة بعد نجاح الدفع من الهيدر والـfloating، إظهار زر السلة المتحرك أثناء السك롤 العادي فوق BackToTop، وإعادة بناء Hero بلا كتابة مع سلايدر صور. المالك اختار «كل الصور + jar-mark» وأكد أن البادج يبقى في الموضعين. لا فتح تلقائي لأي Gate آخر؛ الشجرة المتسخة الموروثة محفوظة.
- **خطة ملفات قُدّمت قبل التعديل:** `hooks/useCheckoutSubmit.ts` لتفريغ كاش السلة؛ `hooks/useFloatingCartCta.ts` لقاعدة الظهور؛ `lib/brandAssets.ts` لسجل أصول الهيرو؛ `Hero.tsx` للتركيب؛ `HeroSlider.tsx` و`HeroCta.tsx` ملفان جديدان؛ `docs/PROGRESS.md` للتوثيق. لم تُضف مفاتيح ترجمة؛ استُخدم `home.hero.cta` و`home.hero.imageAlt` الموجودان.
- **تفريغ البادج:** `useCheckoutSubmit.ts` كان يمسح `om_cart_token` عند نجاح الطلب فقط؛ أُضيف `dispatch(cartApi.util.resetApiState())` بعد المسح حتى تُفرَّغ نسخة RTK Query المخزنة التي يقرأ منها عدّاد الهيدر والـfloating. لا token جديد ولا تغيير storage key ولا cart mutation.
- **زر السلة المتحرك:** `useFloatingCartCta.ts` لم يعد يشترط `isScrolled`؛ يظهر طالما السلة جاهزة وفيها عناصر وليس المستخدم داخل صفحة السلة. موضعه الحالي `bottom-24` يبقى فوق BackToTop عند `bottom-6`.
- **أصول الهيرو:** `HERO_SLIDES` في `lib/brandAssets.ts` يسجل `/hero/2.jpg` و`/hero/3.jpg` وملف اللافتة PNG و`/assets/brand/jar-mark.png`. كُتب مسار الملف العربي بصيغة `\u...` لتفادي قاعدة «no hardcoded Arabic text» مع بقاء المسار الفعلي كما هو.
- **الهيرو الجديد:** `Hero.tsx` أصبح تركيبًا رقيقًا بلا عنوان أو وصف أو نص مرئي، بخلفية `bg-ink` وطبقة تدرج داكنة من tokens (`from-ink/95 via-ink/60 to-ink/20`)؛ يبدأ بعد الـsticky header الطبيعي في DOM. `HeroSlider.tsx` يدير crossfade مع zoom/pan عبر `useRotatingIndex` و`AnimatePresence`، ويوقف الدوران مع `prefers-reduced-motion`. `HeroCta.tsx` يستخدم `Link` و`buttonVariants()` مع spring hover/tap ونبضة تحيط الزر، ويوقف النبضة مع تقليل الحركة.
- **خارج النطاق:** لا backend/DB/env/deps، لا تغيير توكن أو customer session، لا Checkout internals، لا FAQ/Wishlist، لا Header/Footer edits، لا commit/push/deploy.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0` بعد إضافة `dispatch` إلى تبعيات `useCallback` وإزالة تحذير exhaustive-deps.
  - `npm run check` → `EXIT 0`؛ `301 code files`، `488 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `21.3s`؛ TypeScript `15.8s`؛ `56/56` pages.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ الملفات الجديدة داخل نطاق هذا الإذن، والباقي موروث.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج الملفات المخططة سوى هذا القسم التوثيقي.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash قبل هذا الإذن `237ce298b63bf98fefeacfee4ba0897c3afb07782812b3f58bf23b17f48be456`، وبعده `481e2444dd72d30bf47cf62e83c2cc356204052f1a5f792fd6307ebb4016bf80`. التغيير في القائمة هو ملفا `HeroSlider.tsx` و`HeroCta.tsx` فقط؛ بقية المسارات موروثة.
- **Network/Source review:** فحص المصدر يُظهر أن عدم ظهور البادج بعد الطلب ناتج عن كاش RTK Query؛ أُضيف reset صريح. لا request جديد ولا تغيير توكن. لوحة Network/Browser لم تُستخدم ⇒ `NOT TESTED`.
- **Browser Verification:** `NOT TESTED`. لم تُنفَّذ مصفوفة السلايدر، تقليل الحركة، RTL/LTR، 360px/desktop، الثيمات الأربعة، focus-visible، ولا إثبات اختفاء البادج في المتصفح. لا يُرقَّى فحص المصدر إلى acceptance بصري.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner acceptance:** `PENDING`. **Next gate:** `NOT AUTHORIZED`.
- **النتيجة:** `CART BADGE RESET COMPLETE — FLOATING CTA ALWAYS VISIBLE WITH ITEMS — HERO TEXT REMOVED — DARK ANIMATED IMAGE SLIDER COMPLETE — AUTOMATED CHECKS PASS — BROWSER VERIFICATION NOT TESTED — OWNER ACCEPTANCE PENDING`.

⛔ STOP — CART/HERO FOLLOW-UP

## 57) HERO SLIDER REFINEMENT — FAST CROSSFADE / FULL IMAGE / STRONGER CTA (2026-11-25)

- **إذن صريح جديد:** المالك اعترض على زمن الانتقال بين الصور وطلب: عرض كل الصورة كاملة، تغيير سريع بلا انقطاع، بقاء كل صورة فترة كافية للقراءة، زر «اتسوق دلوقتي» بشكل وحركة أفضل، والهيرو يبدأ تحت الـNAV ويأخذ الـVH كامل. نُفِّذ هذا الطلب فقط؛ لا Gate جديد ولا commit/push/deploy.
- **الملفات:** `HeroSlider.tsx` لآلية العرض، `HeroCta.tsx` للزر، `Hero.tsx` لارتفاع السكشن، `docs/PROGRESS.md` للتوثيق. لا ملفات جديدة ولا مفاتيح ترجمة ولا backend/DB/env/deps.
- **السلايدر:** أُزيل `AnimatePresence` وخروج/دخول الـ1.1s. كل صور `HERO_SLIDES` تُركَّب مرة واحدة وتتحرك عبر opacity فقط بمدة `0.18s` مع `easeOut`؛ الصورة السابقة والجديدة تتداخلان في نفس الإطار فلا توجد فجوة سوداء. الفترة `3600ms` (`SLIDE_INTERVAL_MS`) تكفي للقراءة دون ملل، و`useRotatingIndex` يوقف الدوران مع تقليل الحركة.
- **العرض الكامل:** `object-cover` استُبدل بـ`object-contain` داخل `grid place-items-center` و`p-6 md:p-12`، فتظهر الصورة كاملة في المنتصف. خُفِّف التدرج إلى `from-ink/70 via-ink/20 to-ink/10` وخُفِّفت glows إلى `primary/10` و`accent/10` حتى لا تُخفى تفاصيل الصور مع بقاء الهوية الداكنة. كل الشرائح تحصل `preload` لأنها كلها above-the-fold.
- **الارتفاع:** الهيرو لم يعد `min-h-[78dvh]`؛ أصبح `min-h-[calc(100dvh-7rem)] sm:min-h-[calc(100dvh-4.5rem)]` مع `py-10 md:py-14`، أي يبدأ بعد الـsticky header ويملأ الارتفاع المتاح تحت الناف على الموبايل والديسكتوب.
- **الـCTA:** أُضيف `ArrowRight` مع `rtl:rotate-180`، شكل `rounded-full px-8`، حلقة نبض أسرع `1.8s`، شimmer قطري داخل الزر `2.6s`، وحركة spring سريعة `stiffness 420 damping 24` مع hover/tap. كل الحركات المتكررة تتوقف مع `useReducedMotion()`؛ النص ما زال من `home.hero.cta`.
- **Logical utilities:** استُبدل `-left-1/3` بـ`-start-1/3` بعد تنبيه `check-rules`، فصار RTL-safe.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `301 code files`، `488 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `101s`؛ TypeScript `33.7s`؛ `56/56` pages.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ لا مسارات جديدة مقارنة بالقسم 56.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ التعديلات داخل الملفات الثلاثة المخططة سوى هذا القسم التوثيقي.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash قبل وبعد هذا التحسين `481e2444dd72d30bf47cf62e83c2cc356204052f1a5f792fd6307ebb4016bf80` لأن مجموعة المسارات لم تتغير.
- **Network/Source review:** لا requests جديدة؛ `preload` يخص صور الهيرو الموجودة محليًا فقط. لا توكن ولا cart mutation. لوحة Network/Browser لم تُستخدم ⇒ `NOT TESTED`.
- **Browser Verification:** `NOT TESTED`. لم تُنفَّذ مصفوفة السلاسة، زمن التغيير، object-contain على 360px/desktop، RTL/LTR، الثيمات الأربعة، تقليل الحركة، ولا focus-visible على الزر الجديد. لا يُرقَّى فحص المصدر إلى visual acceptance.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner acceptance:** `PENDING`. **Next gate:** `NOT AUTHORIZED`.
- **النتيجة:** `HERO SLIDER REFINEMENT COMPLETE — FAST 0.18s CROSSFADE — FULL IMAGE CENTERED — FULL VIEWPORT BELOW NAV — STRONGER ANIMATED CTA — AUTOMATED CHECKS PASS — BROWSER VERIFICATION NOT TESTED — OWNER ACCEPTANCE PENDING`.

⛔ STOP — HERO REFINEMENT

## 58) HERO COVER FIT / REMOVE JAR MARK FROM SLIDES (2026-11-25)

- **إذن صريح جديد:** المالك طلب أن تمتلئ الصورة كل السكشن طولًا وعرضًا، مع ضبط المقاسات والشكل، واستخدام `cover`، وإزالة اللوجو من السلايدر لأن حجمه غير مناسب. نُفِّذ هذا الطلب فقط؛ لا Gate جديد ولا commit/push/deploy.
- **الملفات:** `lib/brandAssets.ts` لتقليل قائمة الشرائح، `HeroSlider.tsx` لطريقة الملء، `docs/PROGRESS.md` للتوثيق. لا ملفات جديدة ولا مفاتيح ترجمة ولا backend/DB/env/deps.
- **الشرائح:** أُزيل `BRAND_ASSETS.jarMark` من `HERO_SLIDES`؛ السلايدر الآن ثلاث صور حقيقية فقط: `/hero/2.jpg` و`/hero/3.jpg` وملف اللافتة PNG. `BRAND_ASSETS.jarMark` نفسه بقي في سجل الأصول للاستخدامات الأخرى ولم يُحذف من الملف.
- **المقاسات:** فُحصت أبعاد الملفات: `1280x720` و`1280x720` و`1672x941`، أي كلها نسبة ~16:9. استُبدل `object-contain` بـ`object-cover object-center`، وأُزيل `grid place-items-center p-6 md:p-12` من غلاف الشريحة، فتغطي الصورة `absolute inset-0` بالكامل دون هوامش.
- **الطبقات:** خُفِّف التدرج إلى `from-ink/60 via-ink/15 to-ink/5` حتى تظهر تفاصيل الصورة الكاملة مع بقاء تباين الزر. سرعة الانتقال `0.18s` وفترة البقاء `3600ms` كما في القسم 57 لم تتغير.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `301 code files`، `488 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `14.6s`؛ TypeScript `23.0s`؛ `56/56` pages.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ لا مسارات جديدة أو محذوفة مقارنة بالقسم 57.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ التعديلات داخل الملفين المخططين سوى هذا القسم التوثيقي.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash قبل وبعد هذا الضبط `481e2444dd72d30bf47cf62e83c2cc356204052f1a5f792fd6307ebb4016bf80` لأن مجموعة المسارات لم تتغير.
- **Network/Source review:** لا requests جديدة ولا تغيير توكن أو cart؛ الصور محلية من `public/`. لوحة Browser/Network لم تُستخدم ⇒ `NOT TESTED`.
- **Browser Verification:** `NOT TESTED`. لم تُنفَّذ مراجعة بصرية لـ`cover` على 360px/desktop، ولا زاوية القص، ولا الثيمات الأربعة، ولا تقليل الحركة، ولا focus على الزر. لا يُرقَّى فحص المصدر إلى visual acceptance.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`. **Owner acceptance:** `PENDING`. **Next gate:** `NOT AUTHORIZED`.
- **النتيجة:** `HERO COVER FIT COMPLETE — JAR MARK REMOVED FROM SLIDES — IMAGE FILLS FULL SECTION WITH COVER/CENTER — AUTOMATED CHECKS PASS — BROWSER VERIFICATION NOT TESTED — OWNER ACCEPTANCE PENDING`.

⛔ STOP — HERO COVER FIT

## 59) DAY 8 G4A — FAQ & WISHLIST UI PREPARATION (2026-11-25)

- **الإذن والتحقق التمهيدي:** إذن مستقل باسم `G4A — DAY 8 FAQ & WISHLIST UI PREPARATION`، مع اعتماد المالك الحالي لـG4 وتأكيده المباشر أن G2 مقبول `source-wise` لاتفاقيات metadata/breadcrumb. تعارض G0 محسوم: القديم ملغى (`DAY8_TASKS.md:8`) والجديد مقبول وموثّق (`PROGRESS.md:2941-2954`). رُوجعت `AGENTS.md` و`FRONTEND_TASKS §0.3/Day8/9/10` و`PROGRESS` أقسام Day7/8 و`DAY7_TASKS` و`DAY8_TASKS` والكود الحالي للـHeader/Footer/Routes/Metadata/Breadcrumb/Translations قبل أي تعديل. لا committing/pushing/deploy/reset/clean/checkout/stash.
- **خطة الملفات:** عُرض جدول قبل التنفيذ يحدد الملفات والمسؤولية والسبب والمكونات الجديدة والمعاد استخدامها واتفاقيات Routes/Metadata/Breadcrumb ومفاتيح الترجمة وحالة الأصول. لم يُنفَّذ أي source change قبل عرض الخطة.
- **الملفات المنشئة:** `app/[locale]/(Store)/faq/page.tsx`, `faq/metadata.ts`, `app/[locale]/(Store)/wishlist/page.tsx`, `wishlist/metadata.ts`, `components/shared/StoreBreadcrumb.tsx`, `components/ECommerce/FAQ/FaqSection.tsx`, `components/ECommerce/FAQ/FaqItem.tsx`, `components/ECommerce/Wishlist/WishlistEmptyState.tsx`.
- **الملفات المعدّلة:** `lib/routes.ts`, `messages/ar.json`, `messages/en.json`, `components/ECommerce/Footer/FooterNav.tsx`, `components/ECommerce/Header/HeaderNavLinks.tsx`, `components/ECommerce/Header/MobileNavItems.tsx`, `docs/PROGRESS.md`. لا تعديل على `lib/jsonld.ts` أو `components/shared/JsonLd.tsx`؛ استُخدمت أدواتهما الحالية كما هي.
- **FAQ:** صفحة رقيقة تركّب `StoreBreadcrumb` و`FaqSection` فقط؛ المحتوى في component منفصل ويعرض ثلاثة أسئلة موثّقة بالمصادر الحالية: تصفح المنتجات، التواصل عبر روابط التذييل، وأن الحفظ في المفضلة غير مفعّل. استُخدم `<details>` ACCESSIBLE بلا JS مخصص، ولا توجد وعود شحن/توصيل/دفع/إرجاع/ضمانات. لم يُضف FAQ JSON-LD لأن محتوى السياسات التجارية غير معتمد بعد.
- **Wishlist:** صفحة تحضيرية رقيقة ببيانات واضحة أن القائمة غير مفعّلة وأنه لا يمكن حفظ المنتجات أو استرجاعها. `WishlistEmptyState` منفصل ويستخدم `EmptyState` و`buttonVariants` و`Link` إلى المنتجات. صفر endpoint، صفر request، صفر persistence، صفر localStorage/sessionStorage، صفر mutations، صفر slice/store جديد، صفر ادعاء بوظيفة فاعلة.metadata الصفحة تستخدم `isNoIndex: true`.
- **التنقل:** أُضيف `FAQ_HREF` و`WISHLIST_HREF` إلى `lib/routes.ts`، ودخلات FAQ/Wishlist إلى `HeaderNavLinks` و`MobileNavItems` و`FooterNav` بنفس arrays/classes الحالية وأيقونات lucide مثبتة (`HelpCircle`, `Heart`). لا إعادة تصميم Header/Footer.
- **Metadata/Breadcrumb:** كلا المسارين يستخدمان `buildMetadata` مع `path` صحيح و`isLocale` و`routing.defaultLocale`؛ FAQ قابل للفهرسة وWishlist `noindex`. `StoreBreadcrumb` يبني BreadcrumbList عبر `buildBreadcrumbJsonLd` الحالي مع عناصر الرئيسية + الصفحة الحالية. لم يُمسَّ sitemap؛ تأجيله إلى `D15-SEO-SITEMAP` ما زال ساريًا.
- **الترجمات:** أُضيفت namespaces `faq.*` و`wishlist.*` وlabels `header.faq/wishlist` و`footer.nav.faq/wishlist` في ar/en بهيكل متطابق. لا نص مستخدم مرئي مكتوب داخل المكونات.
- **الأصول:** لم تُستخدم أصول جديدة. مرشحات `Set_01_Brand_Collection/09_faq_banner.png` و`10_wishlist_empty_banner.png` و`Set_02_Modern_Organic_Collection/08_faq_banner.png` و`09_wishlist_empty_banner.png` مسجّلة في G0 كمرشحات `G4A only` فقط، وليست معتمدة للربط ⇒ `NOT USED / BLOCKER`. لم يُعدَّل `lib/brandAssets.ts` في G4A.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `309 code files`، `513 message keys per locale`، `0 failure(s), 0 warning(s)`. أُصلح تحذير طول صفحة Wishlist إلى `0 warnings` بنقل العنوان إلى `WishlistEmptyState`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `72s`؛ TypeScript `19.2s`؛ `62/62` pages؛ ظهر `/[locale]/faq` و`/[locale]/wishlist` مع `/ar` و`/en` في جدول المسارات.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ الشجرة المتسخة الموروثة محفوظة، والملفات الجديدة كلها داخل خطة G4A.
  - `git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج الملفات المخططة سوى هذا القسم التوثيقي.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash ما قبل G4A `481e2444dd72d30bf47cf62e83c2cc356204052f1a5f792fd6307ebb4016bf80`، وبعد ملفات المصدر `a7388815f1cd9cf24a89384d5e80de9cdd5b50ad15e9779a0ad5a97cd09c83a9`. الفرق هو ملفات G4A المخططة فقط داخل شجرة متسخة موروثة.
- **API/runtime verification:** فحص مصدر صريح على `components/ECommerce/Wishlist/**` وعموم المشروع لم يجد `wishlistApi` أو `WISHLIST_API` أو `FAQPage` أو `localStorage` أو `sessionStorage` أو `fetch(` أو `useMutation` أو `/api/` داخل نطاق G4A. لا request جديدة. `app/sitemap.ts` لم يُعدَّل.
- **Network/Source review:** الصفحتان ثابتتان بلا data fetching؛ لا توكن ولا بيانات عملاء ولا request من أي نوع. لوحة Network/Browser لم تُستخدم ⇒ `NOT TESTED`.
- **Browser Verification:** `NOT TESTED`. لا Playwright/Puppeteer/Lighthouse؛ لم تُنفَّذ مصفوفة ar/en، RTL/LTR، 360px/desktop، الثيمات الأربعة، keyboard/focus-visible، Breadcrumb، Empty State، ولا فحص metadata فعلي في DOM. لا يُرقَّى فحص المصدر أو build إلى visual acceptance.
- **Business Content Blockers:** سياسات الشحن والتوصيل والدفع والإرجاع والاستبدال والضمانات غير موثقة ⇒ لم تُكتب ولم تُختلق؛ محتوى FAQ التجاري يحتاج مصادر معتمدة من المالك؛ FAQ structured data مؤجل حتى تحقق المحتوى؛ أصول FAQ/Wishlist تحتاج اختيارًا واعتمادًا صريحًا.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`.
- **التقرير النهائي:** `G4A SOURCE IMPLEMENTATION: COMPLETE — FAQ ROUTE + WISHLIST UI PREPARATION ONLY — TWO LOCALIZED THIN PAGES — METADATA/BREADCRUMB CONVENTIONS APPLIED — NAV LINKS ADDED — NO API/PERSISTENCE/MUTATIONS`. `AUTOMATED CHECKS: PASS`. `API VERIFICATION: PASS — NO WISHLIST ENDPOINT OR REQUEST`. `BROWSER VERIFICATION: NOT TESTED`. `BUSINESS CONTENT BLOCKERS: OPEN`. `ASTRA REVIEW: NOT TESTED`. `OWNER ACCEPTANCE: PENDING`. `NEXT GATE: NOT AUTHORIZED`.

⛔ STOP — G4A

## 60) DAY 8 G5 — STYLE & MOTION (2026-11-25)

- **الإذن والـprerequisites:** إذن مالك مستقل باسم `G5 — DAY 8 STYLE & MOTION`. قُرئت `AGENTS.md`، `FRONTEND_TASKS_10_DAYS.md §0.3/يوم8/يوم9/يوم10`، `PROGRESS.md` حالة G1/G2/G3/G4/G4A، و`DAY8_TASKS.md §0/§5.7/Gate5`. G0 مقبول وموثّق؛ G1/G2 source-wise مقبولان للترتيب؛ G3 مقبول صراحةً في إذن G4؛ G4 مقبول صراحةً في إذن G4A؛ G4A مقبول الآن `source-wise` بتأكيد المالك المباشر أثناء preflight. Astra Review لم يُستخدم بديلًا عن Owner Acceptance. لا source change قبل حل هذا الشرط.
- **Preflight إضافي:** فُحصت مخزونات الحركة الحالية: `MotionProvider.tsx` (`LazyMotion strict` + `MotionConfig reducedMotion="user"`)، `lib/motion.ts`، `styles/animations.css` kill-switch عند `288-318`، `animate-fade-up`، `Stagger`/`StaggerItem`، `GlowCard`، `Spotlight`، `BorderBeam`، `CountUp`، `useRotatingIndex`، والكود الفعلي للهوم/Google/checkout/FAQ/Wishlist. `git status --short --untracked-files=all` رُوجع؛ hash ما قبل G5 `84c9e60fa6d51306c7bd80dccaebee097fdf677cf4d2f0b286e305f9317f7595`؛ الشجرة المتسخة الموروثة محفوظة بلا reset/checkout/stash/overwrite/commit/push/deploy.
- **خطة文件的 قُدّمت قبل التنفيذ:** جدول يحدد كل component، الحركة المطلوبة، الـwrapper/utility المعاد استخدامه، وقرار عدم تعديل `styles/animations.css`. لم يُبدأ implementation قبل عرضها.
- **انحراف مبرر عن الخطة:** الخطة الأولى اقترحت `Stagger`/`StaggerItem` لستاگر الأقسام. أثناء المراجعة المصدرية لـreduced-motion تبيّن أن `MotionConfig reducedMotion="user"` يكبح Transform ولا يضمن إلغاء delay/opacity، بينما قاعدة `day 8 §0` و`AGENTS.md §3.2` تجعل مداخل SSR可见 تعتمد على `animate-fade-up`. لذلك استُبدل الـstagger بـCSS-only fade-up بـdelays `80/160/240/320ms` و`motion-reduce:animation-none` صريح؛ لا `initial opacity:0` جديد ولا تأخير محتوى مع تقليل الحركة. هذا ضمن النطاق ولا يغيّر محتوى أو بيانات.
- **الملفات المعدّلة ومسؤوليتها:**
  - `components/ECommerce/Home/HomeSections.tsx`: أربع حركات ظهور متتالية خفيفة للأقسام بعد الهيرو فقط؛ الهيرو above-the-fold لم يُلمس.
  - `components/Card/CategoryCard.tsx`: hover خفيف لصورة الكارت عبر transform محمي بـ`motion-safe:` وموقوف بـ`motion-reduce:transform-none`.
  - `components/Card/ProductCard.tsx`: لمسة zoom خفيفة على الصورة الرئيسية وhover/press للـCTA بدون لمس Fly/Spotlight/BorderBeam ولا عقد الإضافة للسلة.
  - `components/ECommerce/Account/GoogleSignInButton.tsx`: hover lift وpress scale بصريان فقط؛ `onClick` ما زال يستدعي `toast(unavailable)` مرة واحدة، والرسالة من `messages/` كما هي.
  - `components/ECommerce/Cart/CartCheckoutLink.tsx`: hover/press بصري للرابط؛ `CHECKOUT_HREF` والشروط و`Link`/`buttonVariants()` لم تتغير.
  - `components/ECommerce/FAQ/FaqItem.tsx`: hover/open transition لحالة `<details>`؛ السهم ما زال يعكس الحالة فورًا حتى مع تقليل الحركة؛ المحتوى لم يتغير.
  - `components/ECommerce/Wishlist/WishlistEmptyState.tsx`: hover خفيف للحاوية وhover/press لزر المنتجات؛ `EmptyState` والرسالة وعدم الـpersistence كما هي.
  - `docs/PROGRESS.md`: هذا السجل والتقرير النهائي فقط.
- **الأدوات المعاد استخدامها:** `animate-fade-up` وkill-switch الحالي في `styles/animations.css:288-318`، `MotionConfig reducedMotion="user"`، `GlowCard`، `Spotlight`، `BorderBeam`، `buttonVariants()`، `Button`، `EmptyState`، `<details>/<summary>`، utilities `motion-safe:`/`motion-reduce:`، والتوكينات الدلالية فقط. لا مكتبة جديدة، لا `motion.*`، لا `framer-motion`، لا GSAP/Lottie/Three، لا Sass، لا raw hex/rgb.
- **`styles/animations.css`:** لم يُعدَّل. لا keyframe جديد لأن `animate-fade-up` موجود ويختفي تلقائيًا مع `prefers-reduced-motion`، والانتقالات الجديدة كلها transform/opacity/color عبر utilities موجودة. لا دوارة مستمرة جديدة.
- **Reduced Motion — source-level review:** كل Scale/Translate الجديد داخل `motion-safe:` أو متبوع بـ`motion-reduce:transform-none`؛ `animate-fade-up` مكتوب عليه صراحةً `motion-reduce:animation-none` إضافة إلى CSS kill-switch؛ سهم FAQ يبقى مرئيًا ويتغير اتجاهه دون انتقال عند تقليل الحركة؛ لا حالة أو رسالة مخفية خلف opacity؛ لا تأخير تنقل أو focus؛ لا حركة مستمرة مضافة؛ Fly/Pulse/Sheen القديمة تحتفظ بحواجزها الحالية ولم تُمدَّد. لا يُعتمد على CSS rule وحده: رُوجع كل ملف على حدة.
- **VerificationCommandResults:**
  - `npm run lint` → `EXIT 0`.
  - `npm run check` → `EXIT 0`؛ `309 code files`، `513 message keys per locale`، `0 failure(s), 0 warning(s)`.
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` → `EXIT 0`.
  - `npm run build` → `EXIT 0`؛ Next `16.4.5` Turbopack؛ compile `9.9s`، TypeScript `13.4s`، `62/62` pages في التشغيل النهائي بعد انحراف الـstagger؛ لا أخطاء network/type في البناء.
  - `git diff --check` → `EXIT 0` مع تحذيرات LF→CRLF/symlink موروثة على Windows، بلا whitespace errors.
  - `git status --short --untracked-files=all` → `EXIT 0`؛ رُوجع؛ files الجديدة/المعدّلة داخل خطة G5 والانحراف الموثّق؛ الشجرة المتسخة الموروثة محفوظة.
  - `git diff` و`git diff --stat` → `EXIT 0`؛ رُوجع؛ لا تعديلات خارج الملفات المذكورة سوى هذا القسم. `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependencies/lock changes.
  - File line-count checks: `HomeSections 42`, `CategoryCard 50`, `ProductCard 108`, `GoogleSignInButton 38`, `CartCheckoutLink 26`, `FaqItem 19`, `WishlistEmptyState 36` — كلها أقل من 150 سطرًا.
  - `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ hash ما قبل G5 `84c9e60fa6d51306c7bd80dccaebee097fdf677cf4d2f0b286e305f9317f7595`، وبعد ملفات المصدر `1c2c19156b825003c48c4dd61e7c95e57046919ba1286042f1ecf860a951be1b`؛ الفرق هو تعديلات G5 داخل ملفات موجودة فقط، بلا مسارات جديدة.
- **Browser Verification:** `NOT TESTED`. لا Playwright/Puppeteer/Lighthouse ولا بيئة متصفح مأذونة؛ لم تُختبر مصفوفة stagger/cards، Google hover/press، checkout hover/press، FAQ، Wishlist، 360px/desktop، RTL/LTR، الثيمات الأربعة، normal/reduced motion، focus-visible، overflow، ولا hydration flicker. لا يُرقَّى build/source review إلى دليل بصري.
- **Blockers/انحرافات:** لا blocker جديد داخل G5؛ البلوكات الموروثة (D8 assets، محتوى FAQ التجاري، browser environment، authenticated merge، D8-SEAL) كما هي. الانحراف الوحيد هو استبدال Stagger المقترح بـCSS fade-up موثّق أعلاه لصالح reduced-motion وSSR visibility.
- **Astra Review:** `NOT TESTED`. **Production:** `D8-SEAL NOT READY / NOT SEALED`.
- **التقرير النهائي:** `G5 SOURCE IMPLEMENTATION: COMPLETE — GENTLE HOME STAGGER + CARD HOVER + GOOGLE/CHECKTOPRESS + FAQ/WISHLIST STATE TRANSITIONS — NO BEHAVIOR/API/MESSAGE/ROUTE CHANGES — NO NEW KEYFRAME`. `AUTOMATED CHECKS: PASS`. `REDUCED MOTION: PASS SOURCE-LEVEL`. `BROWSER VERIFICATION: NOT TESTED`. `ASTRA REVIEW: NOT TESTED`. `OWNER VISUAL ACCEPTANCE: PENDING`. `NEXT GATE: NOT AUTHORIZED`.

⛔ STOP — G5

---

## §61) G6 — Day 8 Browser / Visual Evidence (Owner-authorized, evidence-only)

- **Owner Decision:** المالك منح صراحةً `G6 — DAY 8 BROWSER EVIDENCE`، وسجّل `G5 visual acceptance granted`. هذا إذن لتجميع أدلة/browser evidence فقط؛ ليس إذناً لتنفيذ G7 أو Day 9 أو أي Gate آخر.
- **Scope guard:** `Implementation: Evidence collection only`. ملف واحد مسموح بتعديله: `docs/PROGRESS.md`. لا source changes، لا bug fixes، لا backend/DB/env/config/deps، لا API writes/mutations، لا Google OAuth حقيقي، لا authenticated cart merge، لا production deployment، لا commit/push/deploy، لا إخفاء عيوب.
- **Phase 1 — Preflight:** مكتمل.
  - قُرئت `AGENTS.md`، و`docs/FRONTEND_TASKS_10_DAYS.md §0.3` (lines `31-55`) وDay 8 (lines `225-236`) وDay 9 boundaries (من `238`) وacceptance (lines `284-294`)، و`docs/PROGRESS.md §47-§49` وسجلات G0/G1/G2/G3/G4/G4A/G5/§59/§60، و`docs/DAY7_TASKS.md §6` (lines `154-169`) و`§7` (من `173`) و`§12` (lines `332-342`).
  - قُرئ `docs/DAY8_TASKS.md:363-376`؛ `Gate 6 — Browser / Visual Evidence` هو نفسه المرجع المشار إليه بـ`§7.6` في رسالة الإذن؛ لا يوجد جدول مستقل بعنوان `§7.6 Browser Matrix` داخل الملف، لذلك استُخدمت مصفوفة الإذن الصريحة (ar/en، RTL/LTR، أربعة ثيمات، 360px/desktop، focus-visible، normal/reduced motion، overflow/hydration flicker/responsive) كمرجع تنفيذي.
  - تحقّق Acceptance: G0 مقبول في `§51`؛ G1/G2 مقبولان source-wise في preflight G4A `§59`؛ G3 مقبول صراحةً في إذن G4 `§55`؛ G4 مقبول صراحةً في `§59/§60`؛ G4A مقبول source-wise في `§60`؛ G5 مكتمل source/automated في `§60` والآن مقبول بصرياً من المالك. لا تعارض يمنع اختبار G6.
  - automated-check evidence موروث وموثّق في `§§52-60`: `npm run lint`، `npm run check`، `tsc --noEmit`، `npm run build`، `git diff --check`، و`git diff -- package.json package-lock.json` كلها `EXIT 0`؛ لم تُعَد تشغيلها في G6 لأن المرحلة evidence-only وليست إعادة build.
  - `git status --short --untracked-files=all` و`git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ baseline hash `1c2c19156b825003c48c4dd61e7c95e57046919ba1286042f1ecf860a951be1b`؛ `20` entry (12 modified + 8 untracked)؛ الشجرة المتسخة الموروثة محفوظة، بلا reset/checkout/stash/revert.
- **Phase 2 — Browser Environment Availability:** `NOT AVAILABLE`.
  - المالك لم يوفّر URL مأذوناً لـLocal أو Staging؛ لا يُسمح بProduction ولا بأي بيئة خارج النطاق المملوك/المأذون.
  - `package.json` scripts: `dev, build, start, lint, check` فقط؛ لا `playwright`، لا `@playwright/test`، لا `puppeteer`، لا `lighthouse` في dependencies/devDependencies.
  - `node_modules/playwright`، `node_modules/@playwright/test`، `node_modules/puppeteer`، `node_modules/lighthouse` → `ABSENT`.
  - `Get-NetTCPConnection -State Listen -LocalPort 3001,3002` → `NO_LISTENER_3001_3002`؛ لا خادم frontend قائم.
  - أوامر المتصفح `google-chrome`، `chrome`، `msedge`، `chromium`، `firefox` → `ABSENT` في shell المتاح.
  - لم يُبدأ dev server، لم يُثبَّت أي tooling، لم يُعدَّل أي config، ولم تُفتح Production. لذلك لا توجد لقطات أو DOM logs أو console/network captures.
- **Phase 3 — Required scope evidence matrix:** كل الصفوف `NOT TESTED` لغياب بيئة متصفح مأذونة؛ `Actual` تعني أنه لم تحدث ملاحظة فعلية، وليس أن العنصر فاشل.

| Test ID | Exact route / locale | Intended conditions | Planned steps | Expected | Actual / Result | Evidence ref |
|---|---|---|---|---|---|---|
| `G6-HOME-AR` | `/ar`، `ar`، `rtl` | loading / empty / error / loaded × 360px/desktop × 4 themes × normal/reduced | افتح الصفحة ولاحظ skeletons ثم final state وحالات fallback | skeleton قبل المحتوى، empty/error واضحان، loaded بلا flicker | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-HOME-EN` | `/en`، `en`، `ltr` | loading / empty / error / loaded × 360px/desktop × 4 themes × normal/reduced | افتح الصفحة ولاحظ skeletons ثم final state وحالات fallback | skeleton قبل المحتوى، empty/error واضحان، loaded بلا flicker | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-SEO-AR` | `/ar`، `ar`، `rtl` | HTML source: canonical، hreflang، OG، Twitter، JSON-LD | افحص source/metadata domains في بيئة مأذونة | canonical/hreflang/OG/Twitter/JSON-LD صحيحة ومحلية | `NO OBSERVATION — no authorized browser/server` / `NOT TESTED` | none |
| `G6-SEO-EN` | `/en`، `en`، `ltr` | HTML source: canonical، hreflang، OG، Twitter، JSON-LD | افحص source/metadata domains في بيئة مأذونة | canonical/hreflang/OG/Twitter/JSON-LD صحيحة ومحلية | `NO OBSERVATION — no authorized browser/server` / `NOT TESTED` | none |
| `G6-FAQ-AR` | `/ar/faq`، `ar`، `rtl` | details open/close + breadcrumb + navigation + 360px/desktop + keyboard | افتح FAQ، بدّل details، تحقق breadcrumb/nav/focus | محتوى عربي صحيح، تنقل سليم، details قابلة للوصول | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-FAQ-EN` | `/en/faq`، `en`، `ltr` | details open/close + breadcrumb + navigation + 360px/desktop + keyboard | افتح FAQ، بدّل details، تحقق breadcrumb/nav/focus | محتوى إنجليزي صحيح، تنقل سليم، details قابلة للوصول | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-WISHLIST-AR` | `/ar/wishlist`، `ar`، `rtl` | UI-only empty state؛ بلا persistence/API | افتح الصفحة ولاحظ empty state فقط | حالة فارغة ودودة بلا أثر تخزين أو طلبات mutation | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-WISHLIST-EN` | `/en/wishlist`، `en`، `ltr` | UI-only empty state؛ بلا persistence/API | افتح الصفحة ولاحظ empty state فقط | حالة فارغة ودودة بلا أثر تخزين أو طلبات mutation | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-GOOGLE-AR` | `/ar/account/login`، `ar`، `rtl` | localized unavailable feedback؛ بلا OAuth حقيقي | اضغط زر Google ولاحظ الرسالة/التركيز | رسالة محلية بأن التفاعل غير متاح، بلا network OAuth | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-GOOGLE-EN` | `/en/account/login`، `en`، `ltr` | localized unavailable feedback؛ بلا OAuth حقيقي | اضغط زر Google ولاحظ الرسالة/التركيز | رسالة محلية بأن التفاعل غير متاح، بلا network OAuth | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-CART-AR` | `/ar/cart`، `ar`، `rtl` | CTA visibility مع cart valid/invalid + hover/press + keyboard | افتح cart بحالة صالحة ثم غير صالحة ولاحظ CTA | يظهر CTA فقط عند صلاحية المتطلبات، بلا تنقل خاطئ | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-CART-EN` | `/en/cart`، `en`، `ltr` | CTA visibility مع cart valid/invalid + hover/press + keyboard | افتح cart بحالة صالحة ثم غير صالحة ولاحظ CTA | يظهر CTA فقط عند صلاحية المتطلبات، بلا تنقل خاطئ | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-CHECKOUT-AR` | `/ar/checkout`، `ar`، `rtl` | تنقل من CTA + الحفاظ على اللغة | انقر CTA من cart ولاحظ المسار والـdir | يفتح `/ar/checkout` باللغة والاتجاه الصحيحين | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
| `G6-CHECKOUT-EN` | `/en/checkout`، `en`، `ltr` | تنقل من CTA + الحفاظ على اللغة | انقر CTA من cart ولاحظ المسار والـdir | يفتح `/en/checkout` باللغة والاتجاه الصحيحين | `NO OBSERVATION — no authorized browser` / `NOT TESTED` | none |
- **Phase 3 guard:** لم يُجرَ Google حقيقي، ولا تسجيل دخول، ولا cart mutation/merge، ولا API write؛ لا توجد بيانات عملاء أو tokens أو عناوين أو emails في هذا السجل.
- **Phase 4 — Browser matrix evidence:** كل الصفوف `NOT TESTED`؛ لا توجد لقطة أو قياس أو مقارنة بصرية.

| Test ID | Axis | Exact setting | Planned check | Actual / Result | Evidence ref |
|---|---|---|---|---|---|
| `G6-M-LOCALE-AR` | locale/direction | `ar` / `rtl` | تحقق `lang`، `dir`، logical spacing، انعكاس الأيقونات | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-LOCALE-EN` | locale/direction | `en` / `ltr` | تحقق `lang`، `dir`، ترتيب العناصر وmessage text | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-THEME-ZAFRAN` | theme | `zafran` | تحقق `data-theme` وتوكنات الألوان | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-THEME-ATTAR` | theme | `attar` | تحقق `data-theme` وتوكنات الألوان | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-THEME-CINNAMON` | theme | `cinnamon` | تحقق `data-theme` وتوكنات الألوان | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-THEME-HIBISCUS` | theme | `hibiscus` | تحقق `data-theme` وتوكنات الألوان | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-VIEWPORT-360` | viewport | `360px` | تحقق عدم overflow وأحجام اللمس وقابلية القراءة | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-VIEWPORT-DESKTOP` | viewport | desktop | تحقق التخطيط وتوزيع الأقسام | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-A11Y-FOCUS` | keyboard | Tab/Shift+Tab + focus-visible | تحقق ظهور focus وترتيب الوصول لكل interactive element | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-MOTION-NORMAL` | motion | normal | تحقق الحركات/Smoothness دون flicker | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-MOTION-REDUCED` | motion | `prefers-reduced-motion: reduce` | تحقق إلغاء الحركة وثبات المحتوى | `NO OBSERVATION` / `NOT TESTED` | none |
| `G6-M-LAYOUT` | layout integrity | overflow / hydration flicker / responsive | تحقق من scrollbars أفقية ووميض ترطيب وتغير مقاسات مفاجئ | `NO OBSERVATION` / `NOT TESTED` | none |
- **Phase 5 — DOM / Visual / Console / Network:**
  - DOM: `NOT TESTED`؛ لا DOM snapshots ولا element queries ولا HTML source capture في G6. أي فحص source سابق في `§53` يبقى source-only ولا يُرقَّى إلى دليل G6.
  - Visual: `NOT TESTED`؛ لا screenshots ولا مقارنة بصرية تحت أي ثيم/مقاس/اتجاه.
  - Console: `NOT TESTED`؛ لا console capture؛ لا يُادَّعى خلوّ وحدة التحكم من الأخطاء.
  - Network: `NOT TESTED`؛ لا DevTools/network capture؛ لا يُستنتج نجاح أو فشل من `HTTP 200` لأنه لم تحدث طلبات مرصودة أصلاً.
  - Accessibility/Focus: `NOT TESTED`؛ ملاحظات source/type السابقة لا تُعد بديلاً عن اختبار لوحة المفاتيح/التركيز في المتصفح.
  - Reduced Motion runtime: `NOT TESTED`؛ `§60` يثبت source-level فقط، ولم يُختبر سلوك `prefers-reduced-motion` فعلياً.
- **Findings / Blockers:**
  - `D8-BROWSER-ENVIRONMENT: BLOCKED` — لا URL مأذون، لا خادم على `3001/3002`، لا browser automation، لا browser command متاح؛ غياب البيئة blocker للأدلة وليس فشل كود.
  - لا عيب كود جديد مكتشف أو مُصلَح؛ لا تعديلات source، لا إخفاء defects.
  - inherited blockers ما زالت مفتوحة: محتوى FAQ التجاري (شحن/توصيل/دفع/إرجاع/ضمانات)، أصول FAQ/Wishlist غير معتمدة للربط، Google الحقيقي وauthenticated cart merge غير مأذونين، D8-SEAL.
  - `OWNER VISUAL ACCEPTANCE`: G5 مقبول صراحةً الآن؛ G6 لم يُعتمد بصرياً ولا يُستنتج acceptance له.
  - `ASTRA REVIEW: NOT TESTED`. `PRODUCTION READINESS: D8-SEAL NOT READY / NOT SEALED`.
- **VerificationCommandResults (بعد تعديل هذا القسم):**
  - `git diff --check` → `EXIT 0` مع تحذيرات `LF will be replaced by CRLF` موروثة على Windows (منها `docs/PROGRESS.md`)، بلا whitespace errors.
  - `git status --short --untracked-files=all` و`git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `EXIT 0`؛ `20` entry؛ hash نهائي `1c2c19156b825003c48c4dd61e7c95e57046919ba1286042f1ecf860a951be1b` مطابق لـbaseline G6؛ لا مسارات جديدة أو محذوفة.
  - `git diff --stat` → `EXIT 0`؛ الإجمالي الموروث `12 files changed, 299 insertions(+), 27 deletions(-)`؛ حصة G6 وحدها `docs/PROGRESS.md | 152 +++++++++++++++++++++`؛ بقية الملفات هي أعمال G4A/G5 source الموروثة.
  - `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependency/lock changes.
- **Final status report:**
  1. G6 Preflight: `COMPLETE` — docs وacceptance وautomated evidence وgit baseline رُوجعت؛ لا تعارض prerequisite.
  2. Browser Environment Availability: `NOT AVAILABLE` — لا Local/Staging URL ولا أدوات/متصفح/خادم؛ `NO_LISTENER_3001_3002`.
  3. Homepage States: `NOT TESTED` — `/ar` و`/en`، loading/empty/error/loaded، بلا evidence.
  4. SEO HTML Source: `NOT TESTED` — canonical/hreflang/OG/Twitter/JSON-LD، بلا evidence.
  5. FAQ ar/en: `NOT TESTED` — `/ar/faq` و`/en/faq`، details/breadcrumb/navigation، بلا evidence.
  6. Wishlist UI-only empty: `NOT TESTED` — `/ar/wishlist` و`/en/wishlist`، بلا persistence claims.
  7. Google interaction/localized unavailable: `NOT TESTED` — `/ar/account/login` و`/en/account/login`، بلا OAuth.
  8. Cart CTA visibility: `NOT TESTED` — `/ar/cart` و`/en/cart`، valid/invalid states، بلا evidence.
  9. Checkout navigation/locale: `NOT TESTED` — `/ar/checkout` و`/en/checkout`، بلا evidence.
  10. DOM / Visual / Console / Network: `NOT TESTED` — لا captures ولا screenshots ولا network logs.
  11. Accessibility / Focus / Reduced Motion: `NOT TESTED` — لا keyboard/focus أو runtime reduced-motion verification.
  12. Astra Review: `NOT TESTED`.
  13. Owner Visual Acceptance: `G5 ACCEPTED`؛ `G6 NOT INFERRED`.
  14. Production Readiness: `NOT SEALED`.
- **Strict scope compliance:** لم يُعدَّل أي مصدر أو إعداد أو حزمة أو بيانات؛ التعديل الوحيد في G6 هو هذا القسم داخل `docs/PROGRESS.md`. `G7/Day 9: NOT AUTHORIZED`.

⛔ STOP — G6

---

## §62) G7 — DAY 8 FINAL REVIEW & HANDOFF (2026-11-26)

- **Owner Authorization:** `G7 — DAY 8 FINAL REVIEW & HANDOFF`. **Executor:** GLM. **Reviewer:** Astra. **Scope:** Documentation only.
- **Scope guard:** المسموح تعديله فقط `docs/PROGRESS.md` و`docs/DAY8_TASKS.md`. صفر source/backend/DB/env/config/deps/commit/push/deploy؛ صفر Day 9/Dashboard/Production Seal؛ صفر فتح Gate جديد؛ صفر إصلاح bugs أثناء المراجعة.
- **Preflight:** قُرئت `AGENTS.md`، و`docs/FRONTEND_TASKS_10_DAYS.md §0.3/Day8/Day9/Day10`، و`docs/PROGRESS.md §47-§61` مع كامل سجلات Day 8/Gates، و`docs/DAY8_TASKS.md §1-§7/§10-§11`، وفُحص `git status`. لا قُبول أي Gate بالاستنتاج؛ كل حالة مقتبسة من سجلها أو من إذن مالك موثّق.
- **Baseline:** `git status --short --untracked-files=all | sort | sha256sum` → `9c8074fbf188935508cc41285c681c436207a477b6f99d719a895562edd4009f`؛ `git status --porcelain=v1 --untracked-files=all | sort | sha256sum` → `1c2c19156b825003c48c4dd61e7c95e57046919ba1286042f1ecf860a951be1b`؛ `20` entry (12 modified + 8 untracked). الاختلاف بين الـhashين هو تنسيق اقتباس `--short` للمسارات ذات الأقواس؛ لا مسارات جديدة أو محذوفة. الشجرة المتسخة الموروثة محفوظة.
- **قاعدة الفصل:** `SOURCE COMPLETE` لا يساوي `AUTOMATED CHECKS PASS`، ولا `BROWSER VERIFIED`، ولا `OWNER ACCEPTED`. أي `NOT TESTED` يبقى كما هو لأن G7 ليس بديلًا عن G6.

### 62.1 Gate-by-gate final review — Day 8 (G0–G6)

| Gate | Owner authorization | Source status | Automated checks / exact evidence | Browser verification | Astra review | Owner acceptance | Outstanding blockers / deviations |
|---|---|---|---|---|---|---|---|
| G0 | `G0 — DAY 8 PRE-FLIGHT / SCOPE LOCK` صريح في `§50` | COMPLETE — docs-only baseline/scope lock | `npm run lint EXIT 0`؛ `npm run check EXIT 0` (297 files / 477 keys)؛ `tsc EXIT 0`؛ `npm run build EXIT 0` موروث (56/56)؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED | planning/audit `PASS WITH NOTES`؛ تقرير G0 نفسه NOT TESTED | ACCEPTED — موثّق في preflight G4A `§59` | أصول Hero/OG/Banners، حقائق FAQ، بيئة browser، D8-SEAL، D15-SEO-SITEMAP مؤجل |
| G1 | `G1 — DAY 8 HOMEPAGE STRUCTURE & DATA` صريح في `§52` | COMPLETE — Home/Hero/Banner/Featured/Categories + states | `lint/check/tsc/build EXIT 0`؛ `check 297 files / 484 keys`؛ `build 56/56` مع `store/* NETWORK_ERROR` بيئي أثناء prerender؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED | NOT TESTED | ACCEPTED source-wise — مستخدم في `§59/§60` | صور/ placement نهائي، FAQ facts، browser matrix، D8-SEAL |
| G2 | `G2 — DAY 8 SEO & STRUCTURED DATA` صريح في `§53` | COMPLETE — homepage metadata/canonical/hreflang/OG/Twitter/JSON-LD review | `lint/check/tsc/build EXIT 0`؛ `check 298 files / 487 keys`؛ `build 56/56`؛ HTML source محلي `/ar` و`/en` PASS؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED — HTML source ليس DOM/browser | NOT TESTED | ACCEPTED source-wise — صراحةً في `§59` | معاينة social crop بصريًا، browser matrix، sitemap مؤجل إلى D15 |
| G3 | `G3 — DAY 8 GOOGLE SIGN-IN UI ONLY` صريح في `§54` | COMPLETE — UI-only unavailable toast، بلا OAuth | `lint/check/tsc/build EXIT 0`؛ `check 298 files / 487 keys`؛ `build 56/56`؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED | NOT TESTED | ACCEPTED صراحةً في إذن G4 `§55` | Google real auth DEFERRED؛ شكل علامة Google/رسالة التوست لم يُختبرا بصريًا |
| G4 + follow-ups | `G4 — DAY 8 CHECKOUT ENTRY` صريح في `§55`؛ follow-ups مصرّ بها في `§§56-58` | COMPLETE — CTA مشروط + badge reset + floating CTA + Hero slider/cover | `lint/check/tsc/build EXIT 0`؛ `check 299 files / 488 keys` ثم `301 files / 488 keys`؛ `build 56/56`؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED | NOT TESTED | ACCEPTED صراحةً في preflight G4A `§59` | authenticated merge، قراءة سلة العميل بعد merge، browser/DOM، مراجعة الهيرو النهائية |
| G4A | `G4A — DAY 8 FAQ & WISHLIST UI PREPARATION` صريح في `§59` | COMPLETE — FAQ + Wishlist UI preparation فقط | `lint/check/tsc/build EXIT 0`؛ `check 309 files / 513 keys`؛ `build 62/62`؛ API source review PASS (لا wishlist endpoint/request)؛ `git diff --check EXIT 0`؛ package diff فارغ | NOT TESTED | NOT TESTED | ACCEPTED source-wise في preflight G5 `§60` | محتوى FAQ التجاري غير موثق، أصول FAQ/Wishlist غير معتمدة، wishlist API DEFERRED، browser matrix |
| G5 | `G5 — DAY 8 STYLE & MOTION` صريح في `§60` | COMPLETE — stagger/hover/press/details transitions بلا behavior/API/route changes | `lint/check/tsc/build EXIT 0`؛ `check 309 files / 513 keys`؛ `build 62/62` compile `9.9s`؛ `git diff --check EXIT 0`؛ package diff فارغ؛ Reduced Motion PASS source-level فقط | NOT TESTED | NOT TESTED | VISUAL ACCEPTANCE GRANTED — مسجّل في `§61` | runtime reduced-motion/browser matrix لم تُختبر؛ لا عيب جديد؛ D8-SEAL |
| G6 | `G6 — DAY 8 BROWSER EVIDENCE` صريح في `§61` | Evidence-only; لا source implementation | لم تُعَد الأوامر؛ inherited `lint/check/tsc/build` كلها `EXIT 0`؛ `git diff --check EXIT 0`؛ package diff فارغ | PREFLIGHT COMPLETE؛ Browser Environment NOT AVAILABLE؛ كل الاختبارات NOT TESTED | NOT TESTED | NOT INFERRED — لا acceptance بصري لـG6 | `D8-BROWSER-ENVIRONMENT: BLOCKED`؛ لا DOM/Visual/Console/Network evidence |

### 62.2 G6 — Browser Evidence Test Matrix (مطلوب داخل G7 — نتائج منقولة من `§61` كما هي)

> كل الصفوف أدناه `NOT TESTED`. `NO OBSERVATION` تعني أنه لم تحدث ملاحظة فعلية، وليس أن العنصر فاشل. لا screenshots ولا DOM/console/network captures موجودة. ممنوع تحويل أي صف إلى `PASS` دون إعادة اختبار فعلي.

#### 62.2.1 Functional Tests

| Test ID | Route | Locale | Viewport | Theme | Motion | Steps | Expected | Actual | Result | Evidence Reference |
|---|---|---|---|---|---|---|---|---|---|---|
| `G6-HOME-AR` | `/ar` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح الصفحة ولاحظ skeletons ثم final state وحالات fallback | skeleton قبل المحتوى، empty/error واضحان، loaded بلا flicker | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-HOME-EN` | `/en` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح الصفحة ولاحظ skeletons ثم final state وحالات fallback | skeleton قبل المحتوى، empty/error واضحان، loaded بلا flicker | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-SEO-AR` | `/ar` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افحص source/metadata domains في بيئة مأذونة | canonical/hreflang/OG/Twitter/JSON-LD صحيحة ومحلية | `NO OBSERVATION — no authorized browser/server` | `NOT TESTED` | none |
| `G6-SEO-EN` | `/en` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افحص source/metadata domains في بيئة مأذونة | canonical/hreflang/OG/Twitter/JSON-LD صحيحة ومحلية | `NO OBSERVATION — no authorized browser/server` | `NOT TESTED` | none |
| `G6-FAQ-AR` | `/ar/faq` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح FAQ، بدّل details، تحقق breadcrumb/nav/focus | محتوى عربي صحيح، تنقل سليم، details قابلة للوصول | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-FAQ-EN` | `/en/faq` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح FAQ، بدّل details، تحقق breadcrumb/nav/focus | محتوى إنجليزي صحيح، تنقل سليم، details قابلة للوصول | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-WISHLIST-AR` | `/ar/wishlist` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح الصفحة ولاحظ empty state فقط | حالة فارغة ودودة بلا أثر تخزين أو طلبات mutation | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-WISHLIST-EN` | `/en/wishlist` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح الصفحة ولاحظ empty state فقط | حالة فارغة ودودة بلا أثر تخزين أو طلبات mutation | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-GOOGLE-AR` | `/ar/account/login` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | اضغط زر Google ولاحظ الرسالة/التركيز | رسالة محلية بأن التفاعل غير متاح، بلا network OAuth | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-GOOGLE-EN` | `/en/account/login` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | اضغط زر Google ولاحظ الرسالة/التركيز | رسالة محلية بأن التفاعل غير متاح، بلا network OAuth | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-CART-AR` | `/ar/cart` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح cart بحالة صالحة ثم غير صالحة ولاحظ CTA | يظهر CTA فقط عند صلاحية المتطلبات، بلا تنقل خاطئ | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-CART-EN` | `/en/cart` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | افتح cart بحالة صالحة ثم غير صالحة ولاحظ CTA | يظهر CTA فقط عند صلاحية المتطلبات، بلا تنقل خاطئ | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-CHECKOUT-AR` | `/ar/checkout` | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | انقر CTA من cart ولاحظ المسار والـdir | يفتح `/ar/checkout` باللغة والاتجاه الصحيحين | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |
| `G6-CHECKOUT-EN` | `/en/checkout` | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | انقر CTA من cart ولاحظ المسار والـdir | يفتح `/en/checkout` باللغة والاتجاه الصحيحين | `NO OBSERVATION — no authorized browser` | `NOT TESTED` | none |

#### 62.2.2 Cross-Browser UI Matrix

| Test ID | Route | Locale | Viewport | Theme | Motion | Steps | Expected | Actual | Result | Evidence Reference |
|---|---|---|---|---|---|---|---|---|---|---|
| `G6-M-LOCALE-AR` | Day 8 G6 scope routes | `ar` / `rtl` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | تحقق `lang`، `dir`، logical spacing، انعكاس الأيقونات | locale/direction/logical spacing/icon direction صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-LOCALE-EN` | Day 8 G6 scope routes | `en` / `ltr` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | تحقق `lang`، `dir`، ترتيب العناصر وmessage text | locale/direction/layout order/translated messages صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-THEME-ZAFRAN` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `zafran` | `normal/reduced` — NOT OBSERVED | تحقق `data-theme` وتوكنات الألوان | `data-theme` وتوكنات zafran صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-THEME-ATTAR` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `attar` | `normal/reduced` — NOT OBSERVED | تحقق `data-theme` وتوكنات الألوان | `data-theme` وتوكنات attar صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-THEME-CINNAMON` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `cinnamon` | `normal/reduced` — NOT OBSERVED | تحقق `data-theme` وتوكنات الألوان | `data-theme` وتوكنات cinnamon صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-THEME-HIBISCUS` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `hibiscus` | `normal/reduced` — NOT OBSERVED | تحقق `data-theme` وتوكنات الألوان | `data-theme` وتوكنات hibiscus صحيحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-VIEWPORT-360` | Day 8 G6 scope routes | `ar/en` | `360px` | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | تحقق عدم overflow وأحجام اللمس وقابلية القراءة | لا horizontal overflow، مقاسات لمس وقراءة صالحة | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-VIEWPORT-DESKTOP` | Day 8 G6 scope routes | `ar/en` | desktop | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | تحقق التخطيط وتوزيع الأقسام | توزيع responsive صحيح بلا انهيار تخطيط | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-A11Y-FOCUS` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | Tab/Shift+Tab + focus-visible | focus مرئي وترتيب وصول منطقي لكل interactive element | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-MOTION-NORMAL` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | normal | تحقق الحركات/Smoothness دون flicker | حركة سلسة بلا flicker | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-MOTION-REDUCED` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `prefers-reduced-motion: reduce` | تحقق إلغاء الحركة وثبات المحتوى | الحركة مكبوتة والمحتوى ظاهر بالكامل | `NO OBSERVATION` | `NOT TESTED` | none |
| `G6-M-LAYOUT` | Day 8 G6 scope routes | `ar/en` | `360px/desktop` — NOT OBSERVED | `zafran/attar/cinnamon/hibiscus` — NOT OBSERVED | `normal/reduced` — NOT OBSERVED | تحقق من scrollbars أفقية ووميض ترطيب وتغير مقاسات مفاجئ | لا horizontal scrollbar، لا hydration flicker، لا layout shift مفاجئ | `NO OBSERVATION` | `NOT TESTED` | none |

#### 62.2.3 Runtime Evidence — منفصل كما في `§61`

- **DOM:** `NOT TESTED` — لا DOM snapshots ولا element queries ولا HTML source capture في G6؛ فحص `§53` source-only ولا يُرقَّى إلى دليل G6.
- **Visual:** `NOT TESTED` — لا screenshots ولا مقارنة بصرية تحت أي ثيم/مقاس/اتجاه.
- **Console:** `NOT TESTED` — لا console capture؛ لا يُادَّعى خلوّ وحدة التحكم من الأخطاء.
- **Network:** `NOT TESTED` — لا DevTools/network capture؛ `HTTP 200` ليس بديلًا، ولم تحدث طلبات مرصودة أصلاً.
- **Accessibility/Focus:** `NOT TESTED` — لا keyboard/focus فعلي؛ ملاحظات source/type لا تُعد بديلًا.
- **Reduced Motion:** `NOT TESTED`.runtime — `§60` source-level فقط؛ لم يُختبر `prefers-reduced-motion` في المتصفح.

#### 62.2.4 Evidence requirements and forbidden upgrades

- النتائج المسموحة: `PASS` فقط مع تنفيذ ودليل؛ `FAIL` مع عيب ودليل؛ `NOT TESTED` حين تغيب البيئة أو لم يُنفَّذ الاختبار. هنا كل الصفوف `NOT TESTED`.
- لا HTTP 200 كدليل نجاح، لا screenshots متخيلة، لا automated checks كبديل عن browser verification، لا `PASS` لـreduced motion من source code، لا بيانات عملاء/tokens/emails/addresses/credentials في الأدلة.
- لا Google OAuth حقيقي، لا API writes/cart mutations/authenticated merge، لا production testing/deploy، لا dependency/config changes، لا إصلاح عيوب، لا تحويل `NOT TESTED` قديم إلى `PASS` بلا إعادة اختبار.

### 62.3 Required Handoff — Task ID / Status / Files / Evidence / Blockers

| Task ID | Status | Actual Files | Evidence | Remaining Blockers |
|---|---|---|---|---|
| `KS-11` | SOURCE COMPLETE / BROWSER NOT TESTED | `app/[locale]/(Store)/page.tsx`، `HomeSections`، `Hero*`، `BannerSection`، `FeaturedSection`، `CategoriesSection`، `Card/*`، `messages/{ar,en}.json`، `lib/brandAssets.ts` | `§52` lint/check/tsc/build `EXIT 0`؛ check `297 files/484 keys`؛ build `56/56` | D8-HERO/BANNER assets، G6 browser matrix، D8-SEAL |
| `KS-12` | SOURCE COMPLETE / BROWSER NOT TESTED | `lib/seo.ts`، `lib/brandAssets.ts`، `app/[locale]/(Store)/metadata.ts`، `page.tsx`، `messages/{ar,en}.json` | `§53` أوامر `EXIT 0`؛ HTML source `/ar` و`/en` PASS؛ browser NOT TESTED | social crop visual، Sitemap مؤجل `D15-SEO-SITEMAP`، D8-SEAL |
| `KS-13` | SOURCE COMPLETE / BROWSER NOT TESTED | `components/ECommerce/Account/GoogleSignInButton.tsx`، `messages/{ar,en}.json` | `§54` أوامر `EXIT 0`؛ source review صفر request/token | Google real auth DEFERRED، browser visual/focus/toast NOT TESTED |
| `KS-14` | SOURCE COMPLETE / BROWSER NOT TESTED | `CartCheckoutLink.tsx`، `CartSummary.tsx`، `CartDrawer.tsx`، `useCheckoutSubmit.ts`، `useFloatingCartCta.ts`، `Hero*.tsx`، `messages/{ar,en}.json` | `§55-58` أوامر `EXIT 0`؛ check `299→301 files/488 keys`؛ build `56/56` | authenticated merge، D8-MERGE-READ، browser/DOM/network |
| `KS-15` | SOURCE COMPLETE / BROWSER NOT TESTED | `faq/page.tsx`، `faq/metadata.ts`، `FaqSection.tsx`، `FaqItem.tsx`، `StoreBreadcrumb.tsx`، `FooterNav.tsx`، nav files، messages | `§59` أوامر `EXIT 0`؛ check `309 files/513 keys`؛ build `62/62` | FAQ commercial facts غير موثقة، أصول FAQ غير معتمدة، browser matrix |
| `KS-16` | SOURCE COMPLETE UI-ONLY / BROWSER NOT TESTED | `wishlist/page.tsx`، `wishlist/metadata.ts`، `WishlistEmptyState.tsx`، `lib/routes.ts`، nav files، messages | `§59` أوامر `EXIT 0`؛ API source review صفر endpoint/request/persistence | wishlist API DEFERRED، أصل empty غير معتمد، browser matrix |
| `D8-ASSET-REGISTER` | RECORDED / PARTIAL | `docs/PROGRESS.md §51/§53/§59` | جرد 29 PNG + اختيار `Set_03` hero/OG؛ لا بكسل-review مستقل | اعتماد كل أصل لكل موضع، browser preview |
| `D8-HERO-ASSET` | OWNER PATH SELECTED / BROWSER NOT VERIFIED | `lib/brandAssets.ts`، `Hero.tsx`، `HeroSlider.tsx`، `HeroCta.tsx` | `§51/§53/§56-58` | فحص النص/اللوجو/القص في المتصفح؛ G6 NOT TESTED |
| `D8-OG-ASSET` | OWNER PATH SELECTED / BROWSER NOT VERIFIED | `lib/seo.ts`، `lib/brandAssets.ts`، homepage metadata | `§53` HTML source PASS | social crop preview NOT TESTED |
| `D8-BANNER-ASSETS` | BLOCKED | `lib/brandAssets.ts`، `messages/{ar,en}.json` | `§50/§51` سجل مرشحات وادعاءات غير متحققة | لا أصول معتمدة للربط؛ لا وعود تجارية متخيلة |
| `D8-FAQ` | SOURCE COMPLETE / BROWSER NOT TESTED | FAQ files، `StoreBreadcrumb.tsx`، nav files، messages | `§59` build `62/62` | حقائق الشحن/الدفع/الإرجاع/الضمان غير موثقة؛ FAQ JSON-LD مؤجل |
| `D8-WISHLIST` | SOURCE COMPLETE UI-ONLY / BROWSER NOT TESTED | Wishlist files، `lib/routes.ts`، nav files، messages | `§59` أوامر `EXIT 0` | G6 browser matrix |
| `D8-WISHLIST-API` | DEFERRED | لا ملفات G7 | `§59` source review صفر request/persistence | عقد باك معتمد؛ لا endpoint متخيل |
| `D8-SITEMAP` | DEFERRED TO D15 — مرتبط بـ`D15-SEO-SITEMAP` | `app/sitemap.ts` لم يُعدَّل | `§50/§59` صراحةً لا تعديل في اليوم 8 | بيانات products/categories منشورة/indexable + caching/revalidation في اليوم 15 |
| `D8-GOOGLE-REAL` | DEFERRED — NO IMPLEMENTATION AUTHORIZED | `GoogleSignInButton.tsx` UI-only | `§54` صفر OAuth/token/request | إذن منفصل + client ID/callback؛ لا اختبار حقيقي |
| `D8-MERGE-READ` | BLOCKED من Day 7 | لا ملفات G7 | `§47.4` و`§55` | لا endpoint لقراءة سلة العميل بعد merge؛ لا اختبار authenticated |
| `D8-BROWSER` / `D8-BROWSER-ENVIRONMENT` | BLOCKED / NOT TESTED | لا ملفات G7 | `§61` لا URL، لا listener، لا tooling، لا متصفح | توفير Local/Staging مأذون ثم إعادة اختبار G6 بالكامل |
| `D8-OWNER-VIS` | G5 ACCEPTED / G6 NOT INFERRED | لا ملفات G7 | `§61` Owner Decision | G6 visual/browser acceptance غائبة； لا ترقية تلقائية |
| `D8-SEAL` | NOT READY / NOT SEALED | لا ملفات G7 | `§61` وكل تقارير Gates | كل Browser/Blockers أعلاه مفتوحة； لا deploy |
| `D8-DASHBOARD` | مرجع تاريخي — لم يُفتح | لا ملفات G7 | `DAY8_TASKS.md §1.5` | لا إذن Day 9/Dashboard |
| `D15-SEO-SITEMAP` | DEFERRED TO DAY 15 | `app/sitemap.ts` لم يُعدَّل | `DAY8_TASKS.md §6` المواصفة الكاملة | يوم 15 فقط: sitemap ديناميكي + مراجعة SEO/اركتيكتشر/جاهزية إنتاج |

### 62.4 VerificationCommandResults (بعد تحرير وثائق G7)

- `git diff --check` → `EXIT 0`؛ تحذيرات `LF will be replaced by CRLF` موروثة على Windows (منها `docs/PROGRESS.md` و`docs/DAY8_TASKS.md`)، بلا whitespace errors.
- `git diff --stat` → `EXIT 0`؛ الإجمالي `13 files changed, 445 insertions(+), 27 deletions(-)`. حصة G7 وحدها: `docs/PROGRESS.md` من `152` إلى `282` سطرًا مضافًا (أي `+130`) و`docs/DAY8_TASKS.md | 16 ++`؛ بقية الملفات أعمال G4A/G5 source الموروثة.
- `git status --short --untracked-files=all` → `EXIT 0`؛ `21` entry بعد G7 (13 modified + 8 untracked) مقابل `20` في baseline (12 modified + 8 untracked)؛ المدخل الجديد هو تعديل `docs/DAY8_TASKS.md` المسموح به، بلا untracked جديد.
- hash baseline قبل G7: `--short` `9c8074fbf188935508cc41285c681c436207a477b6f99d719a895562edd4009f` و`--porcelain=v1` `1c2c19156b825003c48c4dd61e7c95e57046919ba1286042f1ecf860a951be1b`. hash نهائي بعد G7: `--short` `fa7f7eac8ad28b8bf61b2f6d03a9bafcbf4c2638da4d94a49dec09b525567a98` و`--porcelain=v1` `9f41f24b978710bb55f2a489f08ec5640e9d8d31dbff90fd919e9c4008ed42b4`. التغيير هو إضافة مسار `docs/DAY8_TASKS.md` إلى قائمة Modified فقط.
- `git diff -- package.json package-lock.json` → `EXIT 0` وبدون diff؛ صفر dependency/lock changes. لم تُعَد `lint`/`check`/`tsc`/`build` لأن G7 documentation-only؛ الأدلة الموروثة في `§62.1` هي المرجع.

### 62.5 Astra recommendation — منفصل عن Owner Acceptance

- **Astra Review Status:** `NOT TESTED`؛ لم تُجرَ مراجعة Astra مستقلة داخل هذه الـGate. التقارير السابقة المسجّلة: G0 planning/audit `PASS WITH NOTES`، وأما G1–G6 فـ`NOT TESTED` في سجلاتها.
- **Astra Recommendation (للمراجعة):** `PARTIAL HANDOFF ACCEPTABLE — DO NOT SEAL`؛ يُقبل الأرشيف كـ`SOURCE COMPLETE + AUTOMATED PASS` مع إبقاء Browser/NOT TESTED وكل البلوكات مفتوحة، وفتح G6 مجددًا فقط عند بيئة مأذونة.
- **Owner Acceptance:** G0/G1/G2/G3/G4/G4A/G5 مقبولة كما هو موثّق أعلاه؛ G6 لم يُعتمد بصريًا؛ G7 نفسه `PENDING` حتى مراجعة المالك. لا تُترجم توصية Astra إلى اعتماد مالك.

### 62.6 Production Readiness

- `PRODUCTION READINESS: NOT READY / NOT SEALED`؛ `DAY 8 STATUS: PARTIAL HANDOFF — D8-HOME/SEO/GOOGLE-UI/CHECKOUT-ENTRY/FAQ/WISHLIST-UI/G5-MOTION SOURCE-COMPLETE؛ D8-BROWSER EVIDENCE BLOCKED`.
- لا Deployment، لا Day 9/Dashboard، لا reopening Gates تلقائيًا، لا اعتبار G7 بديلًا عن G6. جميع البلوكات في `§62.3` تبقى مفتوحة.

⛔ STOP — Gate 7

---

## §63) END DAY8 — Closure fixes + floating cart CTA + credentials hygiene (2026-11-26)

- **Owner decisions:** اعتماد الشكل الحالي؛ إصلاح H1/H2/M1/M2 من `REVIEW_DAY8 §4`؛ زرار السلة العايم يفضل Fixed أثناء السكرول؛ تنضيف credentials؛ commit `End Day8` بعد الفحوص. **الـ commit لا يعني Browser Verification ولا SEALED.** BE-1/BE-5 مش بيتفتحوا بالتوازي مع Day 9.
- **Source changes:** `Home/Hero.tsx` (h1 sr-only) · `Home/HeroCta.tsx` (بدون opacity:0، دخول CSS) · `Home/HeroSlider.tsx` (preload للأول) · `Card/ProductCard.tsx` (focus ring) · `styles/tokens.css` (fill-mode `both` → `backwards`) · `hooks/useFloatingCartCta.ts` (يختفي في checkout) · `FloatingCartCta.tsx` + `Header/CartLink.tsx` (`99+`) · `cart/metadata.ts` (noindex) · `messages/{ar,en}.json` (حذف 3 مفاتيح ميتة: 513 → 510) · `backend/.env.example` (placeholders).
- **Root cause (floating CTA):** `.animate-page-in` بـ `fill-mode: both` يفضل بـ `transform: matrix(1,0,0,1,0,0)` ⇒ containing block لـ `position: fixed`. تفاصيل وقياسات قبل/بعد في `REVIEW_DAY8 §10.2` (موبايل 537/537/537، desktop 493/493/493؛ قبل: 3239 / 2055 خارج الشاشة).
- **VerificationCommandResults:** `npm run lint` EXIT 0 · `npm run check` EXIT 0 (309 files / 510 keys) · `tsc --noEmit` EXIT 0 · `npm run build` EXIT 0 (62/62) · `git diff -- package.json package-lock.json` فاضي. ملف مؤقت `dupmsg.js` (من وكيل المراجعة) اتحذف.
- **Browser (Chrome headless عبر CDP، بدون dependency):** اتقاس DOM/HTML فقط: h1=1، `<meta robots noindex>` على `/cart`، preload ×1، CTA ثابت. **كل الباقي (الشكل، الثيمات، reduced-motion، focus، FAQ/Wishlist/Google/Checkout، الموبايل 360px) = NOT TESTED** وبيتنفذ بالقايمة اليدوية `REVIEW_DAY8 §6 + §10.7`.
- **Credentials:** `.env` غير متتبع ✅؛ القيم القديمة لسه في تاريخ git (commits `a9397c3, 5c8639a, aff19ee, 1a2360c`) ⇒ **Revoke من Cloudinary مطلوب من المالك**. ملفات خارج Om-Eman تحتاج قرار (`project2_clinica/.env.example` فيه SMTP، و`Day1/.env`,`Day2/.env` متتبعين).
- **Status:** `D8-SEAL NOT SEALED` · `Astra review NOT TESTED` · `Owner visual: الشكل معتمد من المالك، والتحقق بالمتصفح لسه`.

⛔ STOP — §63
