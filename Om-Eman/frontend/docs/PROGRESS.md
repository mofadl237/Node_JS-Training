# PROGRESS — سجل الشغل (محدَّث بعد كل جلسة)

> ده ملف المتابعة الوحيد: أي AI يقراه يعرف اتعمل إيه بالظبط، وإيه اللي لسه.
> آخر تسليم: [خطة Day 4](./DAY4_TASKS.md) — **النطاق معتمد، التنفيذ غير مأذون، حتى Gate 0**. مرجع اليوم السابق: `DAY3_TASKS.md`؛ الخطة الكاملة: `FRONTEND_TASKS_10_DAYS.md` §0.3.
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
