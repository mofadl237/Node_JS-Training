# PROGRESS — سجل الشغل (محدَّث بعد كل جلسة)

> ده ملف المتابعة الوحيد: أي AI يقراه يعرف اتعمل إيه بالظبط، وإيه اللي لسه.
> ملف تاسكات اليوم الحالي: `DAY2_TASKS.md` (اليوم 1: `DAY1_TASKS.md`). الخطة الكاملة: `FRONTEND_TASKS_10_DAYS.md`.
> أداة الفحص الموحدة للمراجعة: `npm run check` (`scripts/check-rules.mjs`) — حدود الأسطر، نصوص عربي hard-coded، ألوان خام، any/console.log/framer-motion، تطابق `ar.json`/`en.json`.
> القاعدة: نحدّث الملف ده **قبل ما نقفل أي خطوة** (مش بعد).

---

## الحالة العامة (2026-11-16)

| المسار | الحالة |
| --- | --- |
| الباك إند | ✅ كود مكتمل (B1–B16 + uploads/Cloudinary). التحقق كله أخضر: `tsc` + `build` + `test` + swagger (116 paths / 168 schemas). |
| الفرونت | 🔄 يوم 1 كود مكتمل (البصري واتصال الباك لسه). يوم 2 جاهز للتنفيذ — `DAY2_TASKS.md`. |

### الباك — اللي فاضل (مسؤولية المالك، مش الـ AI)
1. الداتابيز: `npm run db:migrate -- --name init` → `prisma db execute --file prisma/mvp/manual_constraints.sql` (في `Om-Eman/backend`).
2. `cp seed.config.example.json seed.config.json` → تعبيه بقيم حقيقية → `npm run db:seed`.
3. تشغيل integration tests من غير skip + تشغيل السيرفر.
4. حساب Cloudinary + تعبئة `CLOUDINARY_*` في `.env`.
5. اللوجو (شغال عليه) — ممكن يعدّل قيم tokens لما يخلص.

---

## الفرونت — حالة الأيام

| اليوم | المحتوى | الحالة |
| --- | --- | --- |
| 1 | Foundation: i18n/RTL + tokens/4 ثيمات + ThemeSwitcher + baseApi + Animation wrappers أساسية + UI primitives + /design + SEO base + error/not-found | ✅ كود + lint + build (2026-11-16). ❗ لسه: اختبار المتصفح، اتصال الباك، قرار الخط/الثيم — التفاصيل تحت |
| 2 | إكمال Foundation: سباكة/عقود (interface/store, Toaster, split hooks) + باقي الحركة (Spotlight/BorderBeam/PulseRing/Marquee/Confetti/FlyToCart/PageTransition) + recipes (GlowCard/PriceTag/SectionHeading/TrustStrip/Empty-ErrorState) + صفوف /design | 🔄 جاهز للتنفيذ — `DAY2_TASKS.md` (4 Gates) |
| 3-7 | Storefront: هوم → كتالوج → منتج → سلة → checkout → تتبع → حساب العميل | ⏳ |
| 8-9 | Dashboard أساسي: دخول + هيكل + منتجات + أقسام + طلبات + مدفوعات | ⏳ |
| 10-12 | Dashboard تكميلي: فواتير، شحن، عروض، كوبونات، محتوى، تقارير، عملاء، audit | ⏳ |
| 13-14 | الإطلاق: Lighthouse ≥ 95 + SEO نهائي + مراجعة RTL | ⏳ |

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

### ❗ لسه مش مكتمل (عمدًا — مش مفروض نعتبره اتقفل)
- **الاختبار البصري على المتصفح: لم يتم.** محدش شاف حركة ThemeSwitcher / CountUp / ScrollProgressBar / BackToTop، ولا اتأكد من عدم وجود وميض عند تبديل الثيم، ولا RTL على موبايل. اللي اتفحص بس HTML من السيرفر (dir/lang/hreflang/noindex/404/redirect).
- **اتصال الباك: لم يتم.** الباك مكانش شغال وقت الفحص. `store/baseApi.ts` متكتب لكن مجرّبش على رد حقيقي. المطلوب: تجربة `GET /api/store/products?page=1&limit=1` واحدة بعد تشغيل الباك.
- **قرار الخط والثيم الافتراضي:** لسه عند المالك (من صفحة `/ar/design`).
- **تنظيف معروف مؤجل:** `hooks/useAppDispatch.ts` بيصدّر `useAppSelector` كمان (يتقسم لما نلمس الملف).
- مؤجل لليوم 2 زي الخطة: باقي الحركات، Dialog/Table/Tabs/Select/Sheet/Toaster، `interface/index.ts` + `validation/`.
- **مفيش commit** لشغل الفرونت.

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
> لسه ما بدأش. المنفّذ يبدأ بـ "Pre-flight" (القسم 1 في `DAY2_TASKS.md`) ويكتب إجاباته هنا تحت عنوان "Day 2 — Pre-flight".
