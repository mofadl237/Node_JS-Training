# اليوم 3 — غلاف المتجر + الهوم + SEO (أول يوم Storefront) — تاسكات تنفيذية

> آخر تحديث: 2026-11-17. ملف مكتفٍ لوحده: أي AI ينفذه من غير ما يعتمد على أي شات.
> **المدير/المراجع:** Claude. **المنفّذ:** GLM-5.3-Flash (أو أي AI تاني بنفس الملف). **المالك:** صاحب المشروع (هو اللي بيشوف المتصفح ويقرر الشكل والحركة).
> كل رقم/اسم ملف/سطر في الملف ده اتأكد منه من الكود الفعلي يوم 2026-11-17. لو لقيت الواقع بيخالف الملف: **الملفات هي الحقيقة** — سجّل التعارض في PROGRESS واسأل المدير، متخمّنش.

---

## 0) قواعد التعامل (اقراها الأول — مخالفة أي واحدة = وقف)

1. **الملفات هي مصدر الحقيقة، مش الشات.** لو الشات فيه كلام بيخالف الملفات → الملفات هي الصح. لو مش فاهم حاجة: **اسأل**، متخمّنش.
2. **منفّذ واحد بس بيعدّل في نفس الوقت.** لو المالك بدّل الموديل في نص التاسك: الموديل الجديد يبدأ بقراءة `docs/PROGRESS.md` (قسم "سجل اليوم 3") ويكمل من أول صف مش ✅. ممنوع يعيد شغل متسجل ✅.
3. **ممنوع تقول "تم" لأي حاجة بصرية.** أي شكل/حركة جديدة آخر حالة ليها `🟡 كود جاهز — بانتظار المالك`. الرمز `🟢` معناه "المالك اعتمده" وده ينطبق **بس** على اللي اتعتمد في يوم 1 و2 (شوف PROGRESS). علامة `✅` بس للي اتأكد بأوامر (lint/build/check) أو curl.
4. **ممنوع تلمس الباك** (`Om-Eman/backend`) — قراءة وتشغيل `npm run dev` للاختبار بس. لو لقيت تعارض في العقد: سجّله في PROGRESS وقول للمدير.
5. **ممنوع أي mock للـ API:** لا MSW، لا fixtures بتتقدم كأنها رد الباك، لا `try/catch` بيرجّع بيانات مألّفة. **الاستثناء الوحيد:** fixtures مكتوبة صراحةً في صفحة `/design` (مهمة D1) بعنوان "demo" ظاهر — وممنوع تتوصل بأي صفحة حقيقية.
6. **ممنوع أي dependency جديدة** (`package.json` يتغير في `scripts` بس لو لزم). أمثلة ممنوعة: embla/swiper، vitest/jest، حزم أيقونات براندات، `server-only` (لو `import "server-only"` ماتحلّش من غير تثبيت → **قف واسأل المدير**).
7. **ممنوع تبدأ يوم 4:** صفحات الكتالوج/المنتج/البحث/السلة/checkout/التتبع/الحساب **مش النهارده** (شوف قسم 2).
8. **قرارات المالك ثابتة:** الخط، الثيم الافتراضي (زعفران)، كل قيمة موجودة في `styles/themes.css`. الاستثناء الوحيد: إضافة token جديد `--color-on-accent` (مهمة H3) **بعد موافقة المدير في Gate 0**.
9. بعد **كل خطوة**: حدّث `docs/PROGRESS.md` (الملفات بأسماءها + أي انحراف + السبب) وشغّل `npm run check`. وعند نهاية كل Gate: `npm run lint && npm run build && npm run check`.
10. **النصوص الجديدة (عربي + إنجليزي) = 🟡 للمالك.** ممنوع ادعاءات أعمال مش مدعومة من الباك (شحن مجاني، ضمان، استبدال، ضريبة، "الأسعار شاملة"، عدد عملاء...). الميكروكوبي المصري المحترم مطلوب، والحقائق بس من الـ API أو من قدرات الباك الموثقة (الدفع عند الاستلام، واتساب لو الرقم موجود).
11. **أسلوب المالك:** "نبني الـ architecture والملفات الأول، وبعدين أنا وإنت نحدد الـ styles والـ animation". يعني النهارده: **هيكل صحيح + شكل وظيفي متناسق بالـ tokens والمكونات الموجودة** (يوم 2)، والتلميع البصري النهائي بيتقرر مع المالك عند Gate 3. متخترعش تأثيرات جديدة برّه اللي في المواصفات.
12. **قف عند كل Gate** واكتب `⛔ STOP — Gate N` في PROGRESS. المدير بيراجع قبل ما تكمّل.

### رسالة جاهزة تديها لـ GLM
> أنت المنفّذ. اقرا `Om-Eman/frontend/docs/DAY3_TASKS.md` كله (من أول سطر لآخر سطر) وبعدين `docs/PROGRESS.md` قسم "سجل اليوم 3" (لو مش موجود اعمله). الملفات هي مصدر الحقيقة. ابدأ بـ **Gate 0** بس: اقرا، جاوب الأسئلة كتابةً في PROGRESS، شغّل فحص الباك الحي، واكتب `STOP — Gate 0`. **ممنوع تكتب سطر كود قبل ما المدير يوافق على Gate 0.** لو أي حاجة مش واضحة أو الواقع بيخالف الملف: وقف واسأل، متفترضش.

---

## 1) هدف اليوم 3

**هدف الجملة الواحدة:** نبني **غلاف المتجر** (Header + Footer + عناصر التواصل والتمرير) و**الصفحة الرئيسية** SSR بالكامل (Hero + شريط ثقة + بانرات + أقسام + منتجات مميزة) فوق **طبقة جلب بيانات سيرفر** و**loader صور Cloudinary**، مع **SEO أساسي ثقيل** (JSON-LD + hreflang + sitemap)، وبعد ما نصلّح عيوب يوم 2 المسجلة (D2-01…D2-09).

> **تحديث Day 2.5 (2026-11-17):** عيوب D2-01…D2-09 (+ M-2/M-3) اتنفذت في Day 2.5 (راجع `PROGRESS.md` قسم "يوم 2.5"). مهام Gate 1 (H1–H6) اتعلّمَت ✅ — المنفّذ يراجعها بسرعة ويتأكد إنها سليمة قبل الانتقال لـ F1، من غير إعادة تنفيذ لو مفيش تعارض.

**الصورة النهائية آخر اليوم:**
- `/ar` و`/en` بيعرضوا هوم حقيقي جوه `(Store)` layout فيه Header (براند + لغة + ثيم + سلة) وFooter (من إعدادات الباك) وزرار واتساب ثابت بنبض (لو رقم الواتساب موجود) وخط تقدم السكرول + زرار لفوق بحلقة تقدم.
- الأقسام والبانرات من الباك الحقيقي (`/api/store/categories` + `/api/store/banners`) و`Featured` من `/api/store/products?featured=true` — **وده محجوب حاليًا** (BLOCKER في الباك)، فالـ Featured هيظهر **ErrorState حقيقي** النهارده (حالة الـ data بتتأكد في Gate 5 بعد إصلاح الباك).
- `npm run build` بيعدّي **والباك واقف** (من غير ما نخبّي أي error)، وكل بيانات الصفحة بتتحمّل جوه `<Suspense>`.
- HTML السيرفر فيه: h1 واحد، JSON-LD (Organization + WebSite) سليم، hreflang (ar/en/ar-EG/x-default)، أسعار حقيقية مش "0"، ومفيش محتوى فوق الـ fold مخفي بـ `opacity:0`.

---

## 2) النطاق والاستبعادات

### 2.1 إزاي اتحدد نطاق يوم 3 (الأدلة)
- `docs/PROGRESS.md` جدول الأيام: **"3-7 | Storefront: هوم → كتالوج → منتج → سلة → checkout → تتبع → حساب العميل"** (خمس أيام، يوم 2 مقفول).
- `docs/FRONTEND_TASKS_10_DAYS.md` §0.3: مرحلة "C — Storefront" = 5 أيام، والمتجر قبل اللوحة. وأقرب مواصفة تفصيلية للهوم هي **"اليوم 8 — Storefront: الهوم + SEO الثقيل"** (القديم 8-10 اتزحزح لـ 3-7): Hero + Banners + Featured + Categories + JSON-LD (Organization/WebSite) + `generateMetadata`/hreflang + Header/Footer + skeletons/empty/error من أول يوم.
- يعني **يوم 3 = أول يوم متجر = الغلاف + الهوم + SEO الأساسي**. (التقسيم على الأيام 4-7: كتالوج+منتج / بحث+سلة / checkout / تتبع+حساب — ده ترتيب مقترح مش جزء من يوم 3.)
- ⚠️ ده استنتاج من الخطة (الخطة مابتحددش كل يوم لوحده). **المدير بيأكده في Gate 0** قبل أي كود.

### 2.2 داخل النطاق
| # | البند | ملاحظة |
| --- | --- | --- |
| 1 | تصليح عيوب يوم 2 (H1–H7) | قسم 8، Gate 1 |
| 2 | طبقة بيانات السيرفر + loader صور + helpers نقية | Gate 1 |
| 3 | `(Store)` route group + layout + SkipLink | Gate 2 |
| 4 | Header (براند، LocaleSwitcher، ThemeSwitcher، رابط السلة) | Gate 2 |
| 5 | Footer (من `/store/settings`) | Gate 2 |
| 6 | WhatsApp FAB بنبض (لو الرقم صالح) | Gate 2 |
| 7 | `ScrollEffects` (خط التقدم + لفوق بالحلقة) على المتجر | Gate 2 |
| 8 | JSON-LD: Organization + WebSite | Gate 2 |
| 9 | Home: Hero، شريط ثقة، بانرات (سلايدر)، أقسام، منتجات مميزة (+ ProductCard/CategoryCard) | Gate 3 |
| 10 | `/design`: صف ProductCard demo (fixtures معنونة) + sitemap للغتين + توثيق | Gate 4 |
| 11 | تحقق ما بعد إصلاح الباك (Featured بداتا حقيقية) | Gate 5 (شرطي) |

### 2.3 خارج النطاق (ممنوع) + السبب
| البند | السبب |
| --- | --- |
| صفحات الكتالوج / المنتج / البحث / السلة / checkout / التتبع / الحساب | أيام 4-7. والكتالوج/المنتج/البحث **محجوبين في الباك** |
| **حقل بحث في الـ Header** | صفحة النتائج مش موجودة، و`/store/search` واقع (نفس الـ BLOCKER) |
| wishlist (قلب المفضلة) | مفيش endpoint ولا موديل في الباك — ممنوع نألّف feature |
| زرار "أضف للسلة" وعدّاد السلة | السلة يوم 5 (`/store/cart` مش مستهلك لسه) — ممنوع عدّاد مزيّف |
| عدّاد `saleEndsAt` (countdown) | الكارت النهارده من غير countdown (يوم 4/5) |
| صورة منتج/لوجو/صورة OG داخل الهيرو | **مفيش assets** (اللوجو لسه عند المالك، و`public/` فيه ملفات Next الافتراضية). ممنوع picsum/Lorem/placeholder مزيّف |
| `SearchAction` / `BreadcrumbList` / `Product` / `FAQPage` JSON-LD | الصفحات المقابلة مش موجودة — بيتضافوا مع صفحاتهم |
| لينكات الفوتر لـ static pages / FAQ | الصفحات مش متبنية (الباك بيرجع الـ slugs بس) |
| autoplay للبانرات | قرار مالك لاحق (a11y + بساطة) |
| `validation/`، RTK Query endpoints (`storeApi`)، slices | مفيش form ولا تفاعل client لسه — الجلب النهارده server-side |
| إصلاح Dockerfile (TD-12)، store per-request (TD-4)، `messages` pick (TD-5) | بنية تحتية/تحسينات لأيام لاحقة |
| أي تعديل في الباك | مسؤولية منفصلة (شوف قسم 12: B-1) |

### 2.4 لينكات "ميتة" مقبولة النهارده (بتتسجل، مش bug)
| ID | اللينك | بيشتغل إمتى |
| --- | --- | --- |
| KS-1 | كروت الأقسام → `/{locale}/products?category=<slug>` | يوم 4 |
| KS-2 | كروت المنتجات → `/{locale}/products/<slug>` | يوم 4/5 |
| KS-3 | أيقونة السلة → `/{locale}/cart` | يوم 5 |

أي 404 غير الثلاثة دول = bug لازم يتصلح. الـ 404 بتاعهم بيتعرض بصفحة `not-found` المترجمة الحالية.

---

## 3) Pre-flight (Gate 0) — قبل أي كود

### 3.1 الخطوات بالترتيب
1. اقرا كل الملفات في **قسم 4** (بالترتيب) — وسجّل في PROGRESS (قسم "سجل اليوم 3 — Pre-flight") جدول "اتقرا + طلّعت منه إيه" بنفس شكل Day 2.
2. جاوب **الأسئلة الـ 12** (3.2) كتابةً في PROGRESS. إجابة ناقصة أو غلط = المدير يرجّعك.
3. شغّل **الأوامر الأساسية** (3.4) وسجّل النتيجة الحقيقية (انسخ آخر الأسطر).
4. شغّل **فحص الباك الحي** (3.5) وسجّل أول 300 حرف من كل رد. **ممنوع تألف رد** لو الباك واقف: اكتب `⛔ الباك واقف` وكمّل.
5. اكتب **القرارات المطلوبة من المدير** (3.3) وانتظر ردّه على كل واحد.
6. اكتب `⛔ STOP — Gate 0 — بانتظار موافقة المدير` وقف.

### 3.2 الأسئلة الـ 12 (إجابات بكلماتك، مش نسخ)
1. إيه نطاق يوم 3 (داخل/خارج)؟ واذكر اللينكات الميتة الثلاثة المقبولة (KS-1..3) وليه.
2. يوم 3 بينده على أنهي endpoints؟ شكل الـ envelope للقايمة مقابل الكائن؟ أنهي endpoint **BLOCKED** وإيه **السبب بدقة** (ملف + سطر + ليه)؟
3. ليه كل مكوّن بيجيب داتا لازم يتحط جوه `<Suspense>` مع `cacheComponents`؟ وإيه اللي المفروض يحصل في `npm run build` لو الباك واقف؟
4. `template.tsx` بيتعمل remount إمتى (استشهد بـ `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md`)؟ وليه تعديله مش من مهام يوم 3؟
5. ليه ممنوع تستخدم `PriceTag` على كروت المنتجات قبل مهمة H1؟ (الدليل بالأرقام)
6. الفلوس: بتيجي بإيه نوع؟ فين بتتحوّل للعرض؟ إيه الممنوع (حسابات/جمع/ضرب)؟ ولو الباك بعت `"45"` بدل `"45.0000"` إيه اللي بيحصل؟
7. كام عنصر `data-cart-target` المسموح في الـ DOM؟ وليه (فكّر في `<Activity mode="hidden">` اللي اتشاف في `layout-router.js`)؟
8. استراتيجية الصور: الباك بيخزّن إيه بالظبط؟ الفرونت لازم يضيف إيه؟ وليه من غير `remotePatterns`؟
9. أيقونات البراندات (Facebook/Instagram/YouTube) في `lucide-react` v1.73: موجودة؟ لو لأ هتعرض السوشال إزاي؟
10. ليه `{{percent}}` ممنوعة في messages؟ واكتب مثال plural عربي صحيح بكل الفئات.
11. قاعدة 🟡/🟢، وقاعدة النصوص الجديدة (copy) — إيه المسموح والممنوع؟
12. إيه الملفات اللي هتتحذف/تتنقل في يوم 3 (وانت متأكد إن مفيش حد بيستوردها)؟

### 3.3 قرارات مطلوبة من المدير في Gate 0 (اكتبها كأسئلة منفصلة ورقّمها)
| # | القرار | الافتراضي لو المدير وافق |
| --- | --- | --- |
| M-1 | تأكيد إن يوم 3 = غلاف المتجر + الهوم + SEO (قسم 2.1) | نعم |
| M-2 | الموافقة على إضافة `--color-on-accent` لـ `tokens.css` + الأربع ثيمات (H3). **القيم** لا تغيّر أي ثيم فاتح، وبتصلّح التباين في قرفة (1.40 → 10.81) | نعم |
| M-3 | الموافقة على تعديل `BackToTop` بحلقة تقدم (H5) — ده تغيير بصري على مكوّن معتمد، وهيتعرض للمالك 🟡 | نعم |
| M-4 | دمج `DesignEffects` في `components/Animation/ScrollEffects.tsx` واستخدامه في `/design` والمتجر (مهمة S5) | نعم |
| M-5 | قسم المنتجات المميزة **يختفي بالكامل** لو الرد فاضي (مش EmptyState)، ويظهر ErrorState لو فشل | نعم |
| M-6 | البانرات من غير autoplay ومن غير dots (أسهم فقط) | نعم |
| M-7 | الهيرو من غير صورة منتج/لوجو (تايبوجرافي + زخرفة tokens) | نعم |
| M-8 | شكل رقم الواتساب المتوقع من الباك: digits دولية (`2010…`) فقط؛ أي شكل محلي (`010…`) يتخبّى الزرار | نعم + المالك يأكد |
| M-9 | الأرقام تفضل Western digits (`45`) زي المعتمد بصريًا | نعم |

### 3.4 أوامر الحالة الأساسية (شغّلها واكتب النتيجة)
```bash
cd Om-Eman/frontend
npm run lint && npm run build && npm run check
```
**المتوقع (متأكد منه 2026-11-17):** lint خالي، build `✓ Compiled successfully` + `✓ Generating static pages (14/14)`، check = `Scanned 73 code files, 53 message keys per locale. 0 failure(s), 0 warning(s).` أي رقم مختلف = سجّله واسأل.

### 3.5 فحص الباك الحي (شغّل `cd Om-Eman/backend && npm run dev` — بورت 3002 — في terminal تاني)
```bash
B=http://localhost:3002/api
for p in store/settings store/categories store/banners "store/products?featured=true&limit=2" store/products/does-not-exist; do
  echo "### $p"; curl -s -i -H "Origin: http://localhost:3001" "$B/$p" | head -c 700; echo; done
```
**المتوقع (2026-11-17):** settings/categories/banners = `200 success:true`؛ `products?featured=true` = `400 {"success":false,"message":"Database constraint violation","code":"DB_CONSTRAINT_ERROR"}` (BLOCKER)؛ `does-not-exist` = `404 PRODUCT_NOT_FOUND`؛ ورد الـ CORS فيه `Access-Control-Allow-Origin: http://localhost:3001`. لو فيه فرق (مثلًا المنتجات اشتغلت) → سجّله، ده بيغيّر خطة Gate 5.

---

## 4) الملفات المطلوب قراءتها (بالترتيب)

| # | الملف | طلّع منه إيه |
| --- | --- | --- |
| 1 | `frontend/AGENTS.md` (كله) | تقطيع 150/200، `I`/`T`، ألوان tokens، §12 Next 16 (`proxy.ts`, `cacheComponents`, async params)، §18 anti-patterns، قاعدة ICU في §13 |
| 2 | `frontend/docs/PROGRESS.md` | كله، وبالذات **"المراجعة النهائية لليوم 2"** (عيوب D2-01…09، BLOCKER B-1، الديون TD-1…13) |
| 3 | `frontend/docs/DESIGN_SYSTEM.md` | §1 المبادئ، §2.3 ألوان الكروت (`card-1..4` بالتناوب)، §5.3 جدول الحركة، §6 "مفيش قيم وهمية"، §7 recipes، §8 ميزانية الأداء |
| 4 | `frontend/docs/FRONTEND_TASKS_10_DAYS.md` | §0.3، §2 (envelope)، §3.1–3.2 (الهوية وSEO)، اليوم 8 القديم (مواصفة الهوم)، §5 (جدول الباك + ملاحظات Cloudinary)، §6 |
| 5 | `frontend/docs/DAY2_TASKS.md` + `DAY1_TASKS.md` | الشكل والقواعد فقط (الأيام دي مقفولة) |
| 6 | الكود: `styles/{tokens,themes,animations}.css`، `lib/*.ts`، `components/{Animation,ui,shared,design}/*`، `hooks/*`، `store/baseApi.ts`، `interface/*`، `app/[locale]/{layout,template,page,error,not-found}.tsx`، `app/{sitemap,robots}.ts`، `messages/*.json`، `next.config.ts`، `scripts/check-rules.mjs` | إيه الموجود عشان تعيد استخدامه ومتكررش |
| 7 | **الباك (قراءة فقط):** `backend/src/modules/store/{categories,content,settings,products,sitemap}/*` + `backend/src/shared/{response,pagination}.ts` + `backend/docs/STORE_BACKEND_TASKS.md` (B2/B3/B5/B6/B7 + قسم 6 Cloudinary) | العقود الحقيقية — الـ shapes في قسم 6 من الملف ده اتأكدت منها، لكن **اقراها بنفسك** |
| 8 | **Next docs المحلية:** `frontend/node_modules/next/dist/docs/01-app/` → `03-api-reference/01-directives/use-cache.md`، `03-api-reference/04-functions/{cacheLife,cacheTag}.md`، `02-guides/streaming.md`، `03-api-reference/03-file-conventions/template.md`، `03-api-reference/02-components/image.md` (قسم `loaderFile`)، `02-guides/json-ld.md` | سلوك `use cache` + Suspense، تحذير إن `JSON.stringify` مش آمن في JSON-LD، `loaderFile`، `preload` (بدل `priority` المهجورة في Next 16) |

---

## 5) المكونات والأدوات الموجودة — أعد استخدامها (ممنوع تكرارها)

| الاحتياج | استخدم | المسار / الـ API |
| --- | --- | --- |
| دمج كلاسات | `cn()` | `@/lib/utils` |
| لينك/redirect/router محلي | `Link`, `usePathname`, `useRouter` | `@/i18n/navigation` (ممنوع `next/link` لمسار داخلي) |
| locale/اتجاه | `isLocale`, `getLocaleDirection`, `TLocale` | `@/lib/locale` |
| metadata (canonical/hreflang/OG) | `buildMetadata()` | `@/lib/seo` (بيتعدّل في H6) |
| JSON-LD | `<JsonLd data>` | `@/components/shared/JsonLd` (بيتصلح في H2) |
| ثيم | `useTheme`, `ThemeSwitcher`, `THEMES` | `@/Providers/ThemeProvider`, `@/components/shared/ThemeSwitcher` |
| حركة | `m.*` + `EASE_OUT`/`SPRING_CARD` | `motion/react`, `@/lib/motion` (ممنوع `motion.*` — `LazyMotion strict`) |
| دخول فوق الـ fold | كلاس `animate-fade-up` / `animate-page-in` | CSS فقط — `styles/tokens.css` §5 |
| دخول تحت الـ fold | `FadeIn`, `Stagger` + `StaggerItem` | `@/components/Animation/*` (whileInView) |
| كارت بإضاءة/beam | `GlowCard` (`accent`, `hasSpotlight`, `isBeamActive`) | `@/components/shared/GlowCard` |
| دوران الـ beam | `useRotatingIndex(count, ms)` | `@/hooks/useRotatingIndex` |
| سعر | `PriceTag({price, compareAt?})` + `lib/price` | `@/components/shared/PriceTag` (**بيتصلح في H1 الأول**) |
| عنوان قسم | `SectionHeading({title, subtitle?, as?})` | `@/components/shared/SectionHeading` |
| شريط ثقة | `TrustStrip({items: ITrustItem[]})` (marquee على الموبايل) | `@/components/shared/TrustStrip` |
| حالات فاضي/خطأ | `EmptyState`, `ErrorState` ({title, body, action?}) | `@/components/shared/*` |
| نبضة واتساب | `PulseRing({ringClassName})` + `Button variant="whatsapp"` / `buttonVariants` | `@/components/Animation/PulseRing`, `@/components/ui/Button` |
| سلة/طيران | `CartBounce({pulseKey})` (`data-cart-target`) + `useFlyToCart` | `@/components/Animation/CartBounce`, `@/hooks/useFlyToCart` |
| سكرول | `ScrollProgressBar`, `BackToTop` | `@/components/Animation/*` |
| شارات | `Badge` (`primary|accent|bundle|soldOut|neutral|outline`) | `@/components/ui/Badge` |
| Skeleton | `Skeleton` (`skeleton-shimmer`) | `@/components/ui/Skeleton` |
| تنبيهات | `toast` (sonner) | Toaster متركّب في الـ root layout |
| envelope types | `IApiSuccess`, `IEnvelopeFailure`, `IPaginationMeta`, `IApiError` | `@/interface` |
| عقود المتجر | `IStoreProductCard`, `IStoreSettings`, ... | `@/interface/store` (بتتوسع في F1) |

**مفيش ولا مكوّن من دول يتعمل نسخة منه.** لو محتاج variant: وسّع الموجود بـ prop/`cva`.

---

## 6) الباك — الـ endpoints الحقيقية وعقودها (متأكد من الكود + curl حي 2026-11-17)

**ثوابت:** الباك `http://localhost:3002/api` · كل الردود `{ success, message, data?, meta? }` · الخطأ `{ success:false, message, code, details? }` · القوايم `data: [...]` + `meta` على مستوى الـ envelope (مش جوه data) · الفلوس **strings** · `ApiResponse` يحذف `data` لو `undefined` (`backend/src/shared/response.ts`) · CORS يسمح بـ `http://localhost:3001` · **مفيش `Cache-Control`** على ردود المتجر (فقط `ETag`) — اتأكد بـ curl.

| Endpoint | Auth | Query / Params | الرد (data) | الحالة | المصدر |
| --- | --- | --- | --- | --- | --- |
| `GET /store/settings` | لا | — | `IStoreSettings` (الكل nullable ما عدا `currency`) | ✅ حي (كل contact/social = null في الـ seed) | `store/settings/{routes,service}.ts` |
| `GET /store/categories` | لا | — | `IStoreCategoryNode[]` (`isActive` فقط، `sortOrder asc`، `productsCount` حي) | ✅ حي (3 أقسام، `imageUrl:null`، كلهم `sortOrder:0`) | `store/categories/{routes,service}.ts` |
| `GET /store/banners` | لا | — | `IStoreBanner[]` (فعّالة + داخل نافذة التاريخ، `sortOrder asc`) | ✅ حي (بانر واحد، صورة picsum، `linkUrl:"/ar?category=herbs"`) | `store/content/{routes,service}.ts` |
| `GET /store/products` | لا | `page`(1) `limit`(12، max 48) `category` `subcategory` (slugs) `featured` `inStock` (`"true"/"false"`) `minPrice` `maxPrice` `sort` (`newest|price_asc|price_desc|name`) | `IStoreProductCard[]` + `meta` | ⛔ **BLOCKED** — `400 DB_CONSTRAINT_ERROR` (alias `pk0` في `list.ts:32-33` مقابل `pk1`/`pk2` في `:94,:97`) | `store/products/{routes,validation,list,card}.ts` |
| `GET /store/products/:slug` | لا | slug `^[a-z0-9-]+$` | `IStorefrontProduct` | ⛔ BLOCKED (بسبب `related`) — **مش مستهلك يوم 3** | `store/products/{service,card}.ts` |
| `GET /store/search` | اختياري | `q` (1-200) `limit` (≤50) | `{results, suggestions, searchLogId}` | ⛔ BLOCKED عند أي تطابق — **مش مستهلك يوم 3** | `store/search/*` |
| `GET /store/sitemap` · `/faqs` · `/pages/:slug` | لا | — | سليمين حي | ✅ — **مش مستهلكين يوم 3** (الـ sitemap النهارده ثابت للغتين) | `store/{sitemap,content}/*` |

**أخطاء متوقعة:** `VALIDATION_ERROR` (400، `details.errors[]`)، `PRODUCT_NOT_FOUND` (404)، `DB_CONSTRAINT_ERROR` (**400** مضلّل — بيطلع لأي raw-query error، يعني الفرونت ممنوع يفترض إن 4xx = غلط المستخدم)، + أخطاء الشبكة/Timeout على الفرونت: `NETWORK_ERROR`/`TIMEOUT`/`INVALID_RESPONSE`/`REQUEST_FAILED` (بنصنعها إحنا في طبقة البيانات).

**قواعد العقد اللي لازم تتبعها:**
1. الفلوس strings: `price.from` / `compareAtFrom` / `freeShippingThreshold`. **ممنوع** جمع/ضرب/خصم — العرض فقط بـ `formatPriceAmount` و`calculateSavingsPercent` (`lib/price.ts`). الشكل غير مضمون (`"45.0000"` أو `"45"`) فاتعامل مع أي decimal string.
2. `primaryImage`, `secondaryImage`, `imageUrl`, `mobileImageUrl`, كل حقول `contact`/`social`, `taxRate`, `freeShippingThreshold` = **nullable** — كل واحد له سلوك null واضح (قسم 8).
3. `nameEn`/`titleEn`/`descriptionEn` ممكن null → fallback للعربي عبر `pickLocalized`.
4. `banner.linkUrl` نص حر من الإدارة (ممكن مسار داخلي بـ locale مكتوب فيه، أو URL خارجي، أو أي حاجة) → **ممنوع يتحط في `href` من غير `resolveBannerLink`** (F4).
5. ترتيب الأقسام: **متعيدش ترتيبه** (الـ ties عند الباك — B-3).
6. الفرونت بيجيب من السيرفر (RSC) بـ `fetch` عبر طبقة F2 — مش RTK Query (RTK للتفاعل client لاحقًا). كل path نسبي **من غير `/` في الأول** (`store/settings`) — نفس قاعدة `baseApi`.
7. `API_INTERNAL_URL` (اختياري، server-only) بيتقدّم على `NEXT_PUBLIC_API_URL` في جلب السيرفر (للـ Docker/الشبكة الداخلية).

---

## 7) الـ Data models و TypeScript interfaces

### 7.1 الموجود (`interface/store.ts` — متحقق منه حرفيًا من الباك)
`TStoreProductType`, `IStoreProductImageSnapshot`, `IStoreProductPrice`, `IStoreProductCategoryRef`, `IStoreProductCard`, `IStoreContact`, `IStoreSocial`, `IStoreSettings`.

### 7.2 الجديد (مهمة F1) — نسخ **حرفي** من الباك
```ts
// backend/src/modules/store/categories/service.ts
export interface IStoreSubcategoryNode {
  id: string; slug: string; nameAr: string; nameEn: string | null;
  imageUrl: string | null; sortOrder: number; productsCount: number;
}
export interface IStoreCategoryNode {
  id: string; slug: string; nameAr: string; nameEn: string | null;
  descriptionAr: string | null; descriptionEn: string | null;
  imageUrl: string | null; sortOrder: number; productsCount: number;
  subcategories: IStoreSubcategoryNode[];
}
// backend/src/modules/store/content/service.ts
export interface IStoreBanner {
  id: string; titleAr: string; titleEn: string | null;
  imageUrl: string; mobileImageUrl: string | null;
  linkUrl: string | null; sortOrder: number;
}
```
تتصدّر من `interface/index.ts`. تعليق المصدر فوق كل مجموعة (نفس أسلوب الملف الحالي).

### 7.3 نتيجة طبقة البيانات (مهمة F2) — `lib/server/storeFetch.ts`
```ts
export type TStoreFailureCode =
  | "NETWORK_ERROR" | "TIMEOUT" | "INVALID_RESPONSE" | "REQUEST_FAILED" | string; // string = code الباك
export type TStoreResult<T> =
  | { ok: true; data: T; meta?: IPaginationMeta }
  | { ok: false; status: number; code: TStoreFailureCode };
```
**ممنوع** رمي exception من الطبقة دي. أي مكوّن بيستهلك `TStoreResult` بيتعامل مع `ok:false` بـ ErrorState (أو بإخفاء القسم حسب المهمة).

---

## 8) مهام التنفيذ بالترتيب الصارم

### 8.0 قرارات معمارية ملزمة (اقراها قبل أي مهمة)

**A-1 جلب البيانات = سيرفر فقط، بطبقة واحدة.** كل بيانات المتجر في يوم 3 بتتجاب في Server Components عبر `lib/server/storeQueries.ts` (فوق `storeFetch`). ممنوع `fetch` مباشر في مكوّن، وممنوع RTK Query النهارده (مفيش تفاعل client).

**A-2 `cacheComponents` = كل مكوّن async بيجيب داتا جوه `<Suspense fallback=skeleton>`.** من غير Suspense الـ build بيفشل ("uncached data outside Suspense"). الـ fallback = Skeleton بنفس أبعاد النتيجة (مفيش layout shift).

**A-3 الـ build لازم يعدّي والباك واقف.** `storeFetch` **مابيرميش أبدًا** ويرجّع `TStoreResult`. كل query متغلّفة بـ `"use cache"` + `cacheTag(...)` + `cacheLife` **شرطي**: نجاح → `cacheLife("minutes")` (revalidate 60s، expire ساعة — داخل الـ prerender)؛ فشل → `cacheLife("seconds")` (expire < 5 دقايق ⇒ "dynamic hole" بيتحسب وقت الطلب ومش بيتخزّن). كده الفشل ماينحفرش في الـ shell. (مستند: `cacheLife.md` → "Prerendering behavior" + "Conditional cache lifetimes"، **cacheLife تتنده مرة واحدة بس في كل استدعاء**.) **خطة بديلة لو الـ pattern ده فشل في الـ build** (سجّل الخطأ الحرفي): شيل `"use cache"` من الـ queries وسيبها fetch عادي جوه Suspense (بيتنفذ وقت الطلب)، وسجّل انحراف + اسأل المدير.

**A-4 السنة في الفوتر** (`new Date()`): جوه دالة `"use cache"` صغيرة `getCurrentYear()` بـ `cacheLife("days")` (مش مباشرة في المكوّن) عشان `cacheComponents` مايشتكيش من الوقت.

**A-5 Route group `(Store)`.** الهوم بيتنقل من `app/[locale]/page.tsx` لـ `app/[locale]/(Store)/page.tsx` (الأول بيتحذف — ممنوع الاتنين مع بعض). `design/`, `[...rest]/`, `error.tsx`, `not-found.tsx`, `template.tsx` **بيفضلوا مكانهم** (الـ 404 من غير Header/Footer — مقبول، TD). `ECommerce` و`Dashboard` ممنوع يستوردوا من بعض.

**A-6 الصور:** loader مخصص (`images.loader: "custom"` + `loaderFile`) بيضيف `c_limit,w_<width>,f_auto,q_auto` لروابط `res.cloudinary.com/.../image/upload/v<digits>/...` ويسيب أي رابط تاني زي ما هو. من غير `remotePatterns` (الـ loader المخصص مابيعدّيش على محقق الـ hosts — **اتأكد في الـ build، وسجّل لو اتغير**). الـ `alt` إجباري و`sizes` إجباري. `priority` مهجورة في Next 16 → استخدم `preload` لو لزم.

**A-7 مفيش حسابات فلوس.** العرض بس (`lib/price.ts`). لو الباك بعت فلوس مش رقم صالح: اعرض النص زي ما هو.

**A-8 سلوك الـ null (ملزم):** بانرات فاضية/فشلت ⇒ القسم يختفي. أقسام فشلت ⇒ `ErrorState`، فاضية ⇒ `EmptyState`. منتجات مميزة فشلت ⇒ `ErrorState`، فاضية ⇒ القسم يختفي (M-5). settings فشلت أو حقولها null ⇒ الفوتر بيعرض الأساسيات بس، **ومفيش** FAB واتساب، **ومفيش** روابط سوشال/اتصال، **ومفيش** JSON-LD contactPoint/sameAs، ومفيش رسالة خطأ للزائر.

**A-9 مقياس z-index (ثابت):** Header `z-40` · أي popover داخل الهيدر `z-50` (جوه stacking context الهيدر) · `ScrollProgressBar`/`BackToTop`/`WhatsAppFab` `z-50` · الـ fly clone والـ confetti `z-60` (موجودين) · الـ Toaster بتاع sonner فوق الكل. ممنوع أي z-index جديد من غير تسجيله في AGENTS.

**A-10 `data-cart-target` عنصر واحد بس** في الـ DOM الحقيقي (`CartLink` في الهيدر، من غير نسخة موبايل/ديسكتوب منفصلة — استخدم كلاسات responsive على عنصر واحد). `cacheComponents` بيسيب صفحات قديمة mounted مخفية (`<Activity>`) فالـ hook لازم يختار الهدف **الظاهر** (H4).

**A-11 ممنوعات ثابتة:** أيقونات براندات من `lucide-react` (مش موجودة في v1.73: `Facebook/Instagram/Youtube/Twitter` كلهم ❌ — اتأكد) → السوشال = **نص الاسم من messages + أيقونة `ExternalLink`**. ممنوع SVG لوجوهات براندات. ممنوع `any`، `console.log`، تعليقات جديدة (غير `// 1- state` وتوثيق API قصير)، لون خام في TSX، `bg-${x}` ديناميكي (خريطة كلاسات static)، `motion.*` (استخدم `m.*`)، `setState` متزامن داخل effect، `next/link` لمسار داخلي.

**A-12 `"use client"` أقل ما يمكن.** Header/Footer/Sections = Server. Client بس: `LocaleSwitcher`, `ThemeSwitcher`, `CartLink`'s `CartBounce`, `BannerSlider`, `FeaturedGrid`, `ProductCard`, `CategoryCard` (لو استخدمت Stagger/GlowCard فهم مش لازم client — GlowCard server-compatible)، `StoreImage`, `ScrollEffects`.

**A-13 النصوص:** كل نص جديد في `messages/ar.json` و`en.json` بنفس المفاتيح (Appendix A). رسائل ICU بأقواس مفردة `{name}`. الجمع بـ `{count, plural, ...}` بكل فئات العربي. أسماء اللغات (endonyms) في messages برضه. الاتجاه: كلاسات logical (`ms/me/ps/pe/start/end`) بس.

---

## Gate 0 — Pre-flight (قسم 3)

لا كود. المخرجات: جداول القراءة، إجابات الأسئلة الـ 12، نتائج الأوامر (3.4)، نتائج الباك الحي (3.5)، قرارات المدير (3.3).
**STOP — Gate 0.** المدير بيوافق/يعدّل. بعده بس تبدأ Gate 1.

---

## Gate 1 — تصحيح عيوب يوم 2 + الأساسات

> كل مهمة تحت بنفس القالب. **DoD عام لكل مهمة** (بالإضافة لـ DoD الخاص): `npm run check` أخضر · ملف ≤150 سطر · مفيش لون خام/نص hard-coded/`any` · `ar.json`=`en.json` · سطر في PROGRESS بالملفات والانحرافات.

### H1 — `CountUp` يعرض الرقم النهائي في HTML السيرفر + reduced-motion + صفر التوفير (D2-01, D2-07) — ✅ مُنجز في Day 2.5 (تحقق/مراجعة المتغيرات عند Gate 1؛ راجع PROGRESS يوم 2.5 S1,S7)
- **الهدف:** سعر المنتج يظهر صح في الـ HTML (SEO/no-JS) والعدّ يفضل أنيميشن تحسيني بس.
- **الملفات:** `components/Animation/CountUp.tsx`، `lib/price.ts`، (`components/shared/PriceTag.tsx` لو لزم).
- **Reuse:** `motion/react` (`animate`, `useInView`, `useMotionValue`) الموجودين.
- **المطلوب:**
  1. المحتوى الابتدائي للـ `<span>` = النص النهائي `${value.toFixed(decimals)}${suffix}` (مش `0`) — يطلع في الـ SSR.
  2. العدّ بيشتغل **بس** لو: مفيش `prefers-reduced-motion: reduce` **و** العنصر **ماكانش ظاهر في الشاشة وقت الـ mount** (قراءة `getBoundingClientRect()` جوه `useEffect` للـ mount وتخزينها في `ref` — مش `setState`). العناصر اللي ظاهرة أصلًا تفضل بالنص النهائي من غير وميض.
  3. لو العدّ هيشتغل: عند دخول الشاشة (`useInView once`) اكتب `0` (أو بداية) في `textContent` ثم `animate` للنهاية بنفس spring الحالي (300/24) و`onUpdate` يكتب بـ `toFixed(decimals)+suffix`. عند آخر قيمة اكتب النص النهائي بالظبط.
  4. لو الـ `value` اتغير بعد كده: اكتب النص النهائي فورًا (من غير عدّ).
  5. الـ props كما هي (`value, className, suffix, decimals=0`) — **سلوك `UiRow` القديم ماينكسرش**.
  6. `calculateSavingsPercent`: ارجع `null` لو الناتج بعد التقريب **أقل من 1** (مثال `('99.9','100')` ⇒ `null`).
- **API:** —
- **الحالات:** SSR: النص النهائي · client أول مرة ظاهر: ثابت · تحت الـ fold: بيعدّ · reduced-motion: ثابت.
- **i18n/RTL:** الـ suffix جاي من المستدعي (messages). أرقام Western (M-9).
- **Responsive:** —
- **A11y:** مفيش `aria-live` (التحديثات سريعة)؛ النص النهائي موجود دايمًا فقارئ الشاشة يقراه صح.
- **اختبار:**
  - `node --experimental-strip-types -e "import('./lib/price.ts').then(m=>console.log(JSON.stringify([m.calculateSavingsPercent('99.9','100'),m.calculateSavingsPercent('45','60'),m.calculateSavingsPercent('45','45'),m.calculateSavingsPercent('60','45')])))" 2>/dev/null` ⇒ `[null,25,null,null]`.
  - بعد build + `npm run start`: `curl -s localhost:3001/ar/design` ⇒ نص `CountUp` في الـ HTML **مش** `["0","0","0"]` (شوف سكريبت Appendix B-3؛ المتوقع قيم زي `45 ج.م`).
- **DoD:** القيمتين فوق + `/design` شغال في المتصفح (العدّ تحت الـ fold لسه بيحصل) 🟡 (تغيير سلوك بصري صغير).

### H2 — `JsonLd` escape + `.env.example` + تحقق `SITE_URL` (D2-02, D2-03, D2-09 جزئي) — ✅ مُنجز في Day 2.5 (راجع PROGRESS يوم 2.5 S2,S3,S9)
- **الهدف:** إغلاق ثغرة XSS في JSON-LD وتصليح ملف البيئة.
- **الملفات:** `components/shared/JsonLd.tsx`، `.env.example`، `lib/config.ts`.
- **المطلوب:**
  1. `JsonLd`: `JSON.stringify(data).replace(/</g, "\\u003c")` (اكتبها حرفيًا — التوصية الرسمية في `json-ld.md`).
  2. `.env.example` = سطرين فعليين: `NEXT_PUBLIC_API_URL=http://localhost:3002/api` و`NEXT_PUBLIC_SITE_URL=http://localhost:3001` + سطر معلّق: `# API_INTERNAL_URL=` (اختياري، server-only، يتقدّم على الأول في جلب السيرفر).
  3. `lib/config.ts`: ارمي error لو `SITE_URL` فاضي (زي `API_BASE_URL`). **ماتضيفش** متغيرات server-only هنا (الملف بيتستورد من client).
- **اختبار:** `grep -n "u003c" components/shared/JsonLd.tsx` لازم يطلّع سطر الـ `.replace(/</g, ...)` (والـ escape مكتوب `\u003c` في الكود). السلوك الفعلي بيتأكد في Gate 2 (S6): سكربت B-3 بيطبع `raw </ inside ld+json: false`. `.env.example` بيتقرا بعينك. بعد build `/ar/design`: `<link rel="canonical" href="http://localhost:3001/...">` لسه صح.
- **DoD:** lint/build/check + `grep -n "u003c" components/shared/JsonLd.tsx`.

### H3 — token `--color-on-accent` + `Badge accent` (D2-04) — **يحتاج M-2** — ✅ مُنجز في Day 2.5 بعد اعتماد M-2 (راجع PROGRESS يوم 2.5 S4؛ تأكيد بصري قرفة للمالك)
- **الهدف:** شارة "وفّرت X٪" مقروءة في ثيم قرفة (تباين 1.40 ⇒ 10.81) من غير ما يتغير أي ثيم فاتح.
- **الملفات:** `styles/tokens.css` (@theme: `--color-on-accent: #2b1a12`)، `styles/themes.css` (أربع ثيمات: zafran `#2b1a12` · attar `#1f2a1c` · cinnamon `#241105` · hibiscus `#2a1216` — = قيمة `ink` لكل ثيم فاتح، فمفيش تغيير بصري هناك)، `components/ui/Badge.tsx` (`accent: "bg-accent text-on-accent"`).
- **المطلوب:** `grep` على أي استخدام تاني لـ `bg-accent` مع `text-ink` (غير Badge) وصلّحه بنفس الطريقة. **ماتغيّرش أي قيمة موجودة.**
- **اختبار:** حساب التباين (النتيجة المتوقعة: قرفة 10.81، زعفران 7.36، عطّار 4.77، كركديه 6.67 — دي قيم `ink` على `accent` الحالية، يعني مفيش تراجع).
- **DoD:** build + check. 🟡 للمالك: يشوف شارة التوفير في قرفة بس.

### H4 — `Button` + `useFlyToCart` (D2-05, D2-06) — ✅ مُنجز في Day 2.5 (راجع PROGRESS يوم 2.5 S5,S6)
- **الملفات:** `components/ui/Button.tsx`، `hooks/useFlyToCart.ts`.
- **المطلوب `Button`:** `type="button"` افتراضي (قبل `{...props}` عشان يتغطى) · `disabled={disabled || isLoading}` · `aria-busy={isLoading || undefined}` · وقت التحميل: `<span className="opacity-0">{children}</span>` + `Loader2` مطلق في النص `aria-hidden` (الشكل البصري زي ما هو: spinner بس، بس العرض ثابت والنص موجود لقارئ الشاشة). **ماتغيّرش الـ variants.**
- **المطلوب `useFlyToCart`:** (1) الهدف = أول `[data-cart-target]` له `getClientRects().length > 0` (مش مجرد أول واحد). (2) الـ clone: `aria-hidden="true"` + `inert` + امسح أي `id` منه ومن أولاده. (3) `.finished.then(done, done)` بحيث الـ clone يتشال في الحالتين، و`onArrive` يتنده في النجاح بس. باقي المنطق (700ms، المسار المنحني، reduced-motion) **زي ما هو**.
- **اختبار:** `/design`: زرار "أضف للسلة" لسه يطير ويعمل bounce 🟡؛ زرار submit جوه form لسه يـ submit (له `type="submit"` صريح)؛ `grep -n 'type="button"' components/ui/Button.tsx`.
- **DoD:** lint/build/check. تغييرات سلوكية صغيرة — 🟡 تأكيد بصري من المالك.

### H5 — `BackToTop` بحلقة تقدم + reduced-motion (D2-08) — **يحتاج M-3** — ✅ مُنجز في Day 2.5 بعد اعتماد M-3 (راجع PROGRESS يوم 2.5 S8؛ تأكيد بصري تفاعلي للمالك)
- **الهدف:** تنفيذ طلب المالك الأصلي: حلقة حوالين الزرار بتتملّي حسب نزول الصفحة.
- **الملفات:** `components/Animation/ScrollProgressRing.tsx` (جديد، ≤40 سطر)، `components/Animation/BackToTop.tsx`.
- **المطلوب:** SVG `size-14` حوالين الزرار (`absolute -inset-1`، `aria-hidden`)، دايرة track `stroke-ink/15` ودايرة تقدم `stroke-accent` بـ `strokeDasharray = محيط الدايرة` و`strokeDashoffset` = `useTransform(scrollYProgress, [0,1], [C,0])` على `m.circle` (`style`، من غير re-render)، البداية من الأعلى (`-rotate-90`). الزرار نفسه (`bg-primary`) زي ما هو. `scrollTo({behavior})` = `"auto"` لو reduced-motion، `"smooth"` غير كده. أيقونة السهم `aria-hidden`. **مفيش لون خام.**
- **الحالات:** يظهر بعد أول شاشة (زي الحالي). **A11y:** `aria-label` موجود، focus-visible واضح. **RTL:** الحلقة دايرية (مفيش مرايا مطلوبة)، الموضع `end-6`.
- **اختبار:** `/design` (فيه `ScrollEffects`/`DesignEffects`): السكرول لتحت ⇒ الحلقة بتتملّي بالتدريج 🟡.
- **DoD:** lint/build/check + 🟡.

### H6 — `buildMetadata` (D2-09) — ✅ مُنجز في Day 2.5 (راجع PROGRESS يوم 2.5 S9)
- **الملف:** `lib/seo.ts`.
- **المطلوب:** `alternates.languages` = `{ ar, en, "ar-EG": <ar url>, "x-default": <ar url> }` (URLs كاملة بـ `SITE_URL` + `/${locale}${path}`)؛ `openGraph.locale` = `ar_EG` / `en_US` (map ثابت `Record<TLocale,string>`) + `alternateLocale: [اللغة التانية بنفس الخريطة]`. الـ canonical زي ما هو. شغّل نفس الـ signature (ماتكسرش مستهلكين الـ layout و`design/metadata.ts`).
- **اختبار:** بعد build: `curl -s localhost:3001/ar/design` ⇒ 4 `link rel=alternate` بـ hreflang `ar,en,ar-EG,x-default`؛ `og:locale` = `ar_EG` و`og:locale:alternate` = `en_US`.
- **DoD:** lint/build/check.

### H7 — تنظيف صغير (D2-11/12/13)
- **الملفات:** `lib/theme.ts` (احذف `readThemeCookie` بعد `grep` يثبت صفر مستهلكين)، `components/shared/GlowCard.tsx` (خلّي الـ named export هو المعمول له `memo`: `export const GlowCard = memo(GlowCardBase)` وامسح الـ default export — المستهلك الوحيد `MotionRow` بيستورد named)، `components/Animation/Marquee.tsx` (النسخة المكررة `aria-hidden` تاخد كمان `inert`).
- **اختبار:** `/design` سليم (TrustStrip/GlowCards)، lint/build/check.
- **DoD:** مفيش تغيير بصري.

### F1 — `lib/envelope.ts` + عقود الأقسام/البانرات
- **الملفات:** `lib/envelope.ts` (جديد)، `store/baseApi.ts`، `interface/store.ts`، `interface/index.ts`.
- **المطلوب:** انقل `isEnvelopeFailure` من `baseApi.ts` إلى `lib/envelope.ts` (export) وأضف `isEnvelopeSuccess(value): value is IApiSuccess<unknown>` (كائن، `success === true`، فيه `message` string و`"data" in value`). `baseApi.ts` يستورد منه (مفيش نسختين). أضف العقود في قسم 7.2 **بنفس الأسماء** وصدّرها من الـ barrel.
- **اختبار:** build + `grep -rn "isEnvelopeFailure" --include=*.ts` ⇒ تعريف واحد.
- **DoD:** عقود مطابقة حرفيًا (قارنها بالملفات الباك المذكورة).

### F2 — طبقة بيانات السيرفر
- **الملفات:** `lib/server/storeFetch.ts`، `lib/server/storeQueries.ts`، `lib/server/currentYear.ts`.
- **المطلوب (storeFetch):** `import "server-only"` أول سطر (لو ماحلّش ⇒ **قف واسأل**). `getBaseUrl()` = `process.env.API_INTERNAL_URL || API_BASE_URL`. بناء الـ URL: `${base بدون / في الآخر}/${path بدون / في الأول}`. `fetch(url, { signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" } })` **من غير** `cache`/`next` options. `try/catch`: timeout ⇒ `TIMEOUT`، شبكة ⇒ `NETWORK_ERROR` (status 0)، مش JSON ⇒ `INVALID_RESPONSE`، envelope فشل (`isEnvelopeFailure`) ⇒ `{status: res.status, code: body.code}`، نجاح بشكل غلط ⇒ `INVALID_RESPONSE`، نجاح ⇒ `{ok:true,data,meta}`. فشل ⇒ `console.error("[store]", { path, status, code })` مرة واحدة (مفيش body ولا headers).
- **المطلوب (storeQueries):** `getStoreSettings`, `getStoreCategories`, `getStoreBanners`, `getFeaturedProducts` (= `store/products?featured=true&limit=8&sort=newest`). كل واحدة: `"use cache"` + `cacheTag("store-settings"|"store-categories"|"store-banners"|"store-products")` + جلب + `cacheLife(result.ok ? "minutes" : "seconds")` (استدعاء واحد بس) + `return result`. الأنواع من `@/interface`. (`currentYear.ts`: A-4.)
- **API:** راجع قسم 6. **مفيش** استدعاء لـ `/store/products/:slug` أو `/store/search`.
- **الحالات:** الدوال بترجع النتيجة، والمكوّنات (Gate 3) هي اللي بتقرر.
- **اختبار:** مفيش مستهلك لسه ⇒ اتأكد بـ `tsc` (build). **الاختبار الحقيقي للـ cache pattern في Gate 2 (S3 + مصفوفة الباك up/down، قسم 10).** لو المصفوفة فشلت → خطة A-3 البديلة.
- **DoD:** lint/build/check، الملفات ≤150.

### F3 — loader صور Cloudinary + `StoreImage`
- **الملفات:** `lib/imageLoader.ts`، `next.config.ts`، `components/shared/StoreImage.tsx`.
- **`imageLoader.ts`:** `"use client"` في الأول، **من غير أي imports**. `export default function storeImageLoader({ src, width }: { src: string; width: number }): string`. لو `src` يطابق `^(https://res\.cloudinary\.com/[^/]+/image/upload/)(v\d+/.+)$` ⇒ `$1c_limit,w_${width},f_auto,q_auto/$2`؛ غير كده ⇒ `src` زي ما هو.
- **`next.config.ts`:** `images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" }` (مع الحفاظ على باقي الإعدادات).
- **`StoreImage`:** client. props: `src: string | null`, `alt: string`, `sizes: string`, `className?`, `preload?: boolean`. بيرندر `next/image` بـ `fill` (الأب لازم `relative` + نسبة أبعاد). لو `src` null أو `onError` ⇒ بلاطة بديلة `bg-surface-2` + أيقونة `ImageOff` (`aria-hidden`) بنفس الأبعاد (`useState` يتغير جوه `onError` handler بس).
- **اختبارات الـ loader (pure):**

| input | output |
| --- | --- |
| `{src:"https://res.cloudinary.com/demo/image/upload/v1/sample.jpg", width:640}` | `https://res.cloudinary.com/demo/image/upload/c_limit,w_640,f_auto,q_auto/v1/sample.jpg` |
| `{src:"https://picsum.photos/seed/x/1200/400", width:640}` | نفس الـ src |
| `{src:"/logo.png", width:640}` | `/logo.png` |
| `{src:"https://res.cloudinary.com/demo/image/upload/w_100/v1/a.jpg", width:640}` | نفس الـ src (فيه transformation جاهز) |

  شغّل: `node --experimental-strip-types -e "import('./lib/imageLoader.ts').then(m=>console.log(m.default({src:'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',width:640})))" 2>/dev/null`.
- **اختبار HTML:** يتأكد في D1 (fixture Cloudinary-demo على `/design`: `f_auto,q_auto,w_` في `srcset`).
- **DoD:** build بيعدّي (مفيش "hostname not configured")، `next.config.ts` لسه فيه `cacheComponents`/`turbopack`/`createNextIntlPlugin`.

### F4 — helpers نقية (من غير imports أو بأقل imports)
- **الملفات:** `lib/localized.ts`, `lib/links.ts`, `lib/whatsapp.ts`, `lib/jsonld.ts`, `lib/routes.ts`.
- **`localized.ts`:** `pickLocalized(locale: string, ar: string | null, en: string | null): string | null` ⇒ `locale === "en" && en && en.trim() !== "" ? en : ar`.
- **`links.ts`:** `toSafeExternalUrl(value)` (`http(s)` فقط، `trim`، ≤2048، وإلا `null`) و`resolveBannerLink(linkUrl)` ⇒ `{kind:"internal",href}|{kind:"external",href}|null`:

| input | output |
| --- | --- |
| `null` / `""` / `"  "` | `null` |
| `"/ar?category=herbs"` | `{internal, "/?category=herbs"}` |
| `"/en/products/x"` | `{internal, "/products/x"}` |
| `"/ar"` | `{internal, "/"}` |
| `"/products/x"` | `{internal, "/products/x"}` |
| `"//evil.com"` | `null` |
| `"https://example.com/a"` | `{external, "https://example.com/a"}` |
| `"javascript:alert(1)"` / `"data:text/html,x"` / `"products/x"` | `null` |

- **`whatsapp.ts`:** `normalizeWhatsAppNumber(raw)` (شيل مسافات/شرطات/أقواس، شيل `+` أو `00` من الأول، يقبل `^[1-9]\d{7,14}$` وإلا `null`)، `buildWhatsAppUrl(number, text?)` ⇒ `https://wa.me/${number}` + (`?text=${encodeURIComponent(text)}` لو text). أمثلة: `"+20 100 123-4567"`⇒`"201001234567"` · `"00201001234567"`⇒`"201001234567"` · `"01001234567"`⇒`null` (محلي — M-8) · `"abc"`⇒`null` · `null`⇒`null`.
- **`routes.ts`:** دوال ترجّع كائنات `href` لـ next-intl `Link`: `categoryHref(slug)` ⇒ `{ pathname: "/products", query: { category: slug } }`، `productHref(slug)` ⇒ `` `/products/${slug}` ``، `CART_HREF = "/cart"`. (مصدر واحد للينكات KS-1..3.)
- **`jsonld.ts`:** `buildOrganizationJsonLd({ siteUrl, locale, name, settings })` ⇒ `{ "@context":"https://schema.org","@type":"Organization", name, url: `${siteUrl}/${locale}`, sameAs?: [روابط السوشال الآمنة], contactPoint?: {"@type":"ContactPoint", contactType:"customer service", telephone?, email?} }` — **`sameAs`/`contactPoint` بيتحذفوا لو فاضيين**، ومفيش `logo` ولا `address` ولا `availableLanguage`. `buildWebSiteJsonLd({ siteUrl, locale, name })` ⇒ `{"@context","@type":"WebSite", name, url, inLanguage: locale}` **من غير `potentialAction`**.
- **اختبار (pure):** جداول فوق بـ `node --experimental-strip-types` لـ `localized/links/whatsapp` (من غير imports جوّاهم). `jsonld`/`routes` بيتأكدوا بالـ HTML في Gate 2.
- **DoD:** كل صف في الجداول بيطلع مطابق. كل ملف ≤150.

**Check Gate 1:** `npm run lint && npm run build && npm run check` ⇒ 0 failures/0 warnings، `git diff --stat -- package.json` فاضي، وأمر H1/H6 على `/design` المبني.
⛔ **STOP — Gate 1** (حدّث PROGRESS: صفوف H1–H7 وF1–F4 + نتائج الأوامر + أي انحراف).

---

## Gate 2 — غلاف المتجر (Shell)

> نفس DoD العام. كل المكونات تحت `components/ECommerce/` (Server إلا لو اتكتب client). `ECommerce` ممنوع يستورد من `Dashboard`.

### S1 — messages + `(Store)` layout + نقل الهوم + SkipLink
- **الهدف:** هيكل المتجر الأساسي من غير محتوى الهوم.
- **الملفات:** `messages/ar.json` + `en.json` (Appendix A: `brand`, `a11y`, `header`, `footer`, `locale`, `theme`, `whatsapp`)، `app/[locale]/(Store)/layout.tsx` (≤40 سطر)، `app/[locale]/(Store)/page.tsx` (مؤقتًا: `<h1>` من `home.hero.title` — بيتبدّل في HM6)، **حذف** `app/[locale]/page.tsx`، `components/ECommerce/SkipLink.tsx`، `components/Skelton/FooterSkeleton.tsx`.
- **Reuse:** `setRequestLocale` (في الصفحة)، `Skeleton`.
- **المطلوب:** الـ layout بيرجّع Fragment: `SkipLink` ثم `StoreHeader` ثم `<main id="main-content" tabIndex={-1}>` ثم `<Suspense fallback={<FooterSkeleton/>}><StoreFooter/></Suspense>` ثم `<Suspense fallback={null}><WhatsAppFab/></Suspense>` ثم `<Suspense fallback={null}><StoreJsonLd/></Suspense>` ثم `<ScrollEffects/>`. (في الخطوة دي المكوّنات التانية مش موجودة — ضيفها تدريجيًا مع S2–S6 وماتسيبش imports مكسورة.) الـ layout مابيعملش fetch بنفسه. الصفحة ما تحتويش `<main>` ثاني.
- **API:** — · **الحالات:** — · **i18n/RTL:** `SkipLink`: `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 ...tokens">` نصها `a11y.skipToContent`.
- **Responsive/A11y:** SkipLink أول عنصر focusable؛ `main` عليه `tabIndex={-1}`.
- **اختبار:** `curl -s localhost:3001/ar` ⇒ أول `<a` في `<body>` هو الـ skip link، `id="main-content"` مرة واحدة، h1 واحد. `/ar/design` لسه شغال من غير Header (برّه `(Store)`).
- **DoD:** مفيش ملف قديم متروك، `app/[locale]/page.tsx` اتحذف، build أخضر.

### S2 — Header + LocaleSwitcher + ThemeSwitcher a11y
- **الملفات:** `components/ECommerce/Header/{StoreHeader,HeaderBrand,CartLink,LocaleSwitcher}.tsx`، `components/shared/ThemeSwitcher.tsx` (تعديل a11y + namespace).
- **Reuse:** `Link` (`@/i18n/navigation`)، `ThemeSwitcher`، `CartBounce`، `usePathname`، `ShoppingCart`/`Leaf`/`Languages` (lucide).
- **المطلوب:**
  - `StoreHeader` (server): `<header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">` حاوية `mx-auto flex h-16 max-w-6xl items-center justify-between px-4`؛ start: `HeaderBrand`؛ end: `LocaleSwitcher` + `ThemeSwitcher` + `CartLink` بـ `gap-2`.
  - `HeaderBrand`: `Link href="/"` بنص `brand.name` (font-display) وأيقونة `Leaf` `text-primary` `aria-hidden`. **مش `<h1>`.** (اللوجو لسه عند المالك — مفيش صورة.)
  - `CartLink`: `Link href={CART_HREF}` `aria-label={header.cart}` بشكل زر 40×40 زي زرار الثيم، جواه `CartBounce` + `ShoppingCart`. **عنصر `data-cart-target` واحد.** مفيش عدّاد (A-10 + قسم 2.3). لينك KS-3.
  - `LocaleSwitcher` (client): `<Link href={pathname} locale={target} hrefLang={target} lang={target}>` نصه اسم اللغة الأخرى من `locale.ar`/`locale.en` (endonym)، `aria-label` = `locale.switchTo` مع `{language}`. بيحافظ على المسار (`usePathname()` من `@/i18n/navigation`)؛ الـ query مش بيتحافظ عليه النهارده (مقبول، سجّله).
  - `ThemeSwitcher`: `aria-expanded`, `aria-haspopup="true"`, `aria-controls`, Esc يقفل ويرجّع الـ focus للزرار، كل خيار `aria-pressed`، labels من namespace `theme` (جديد: `label` + أسماء الأربع ثيمات). **الشكل والحركة مايتغيروش.** (`design.*` تفضل كما هي لـ `ThemeRow`.)
- **الحالات:** ثابت (مفيش داتا).
- **i18n/RTL:** logical classes؛ في RTL البراند يمين والتحكمات شمال تلقائيًا (`justify-between`).
- **Responsive:** عند 320px مفيش overflow (`gap-2`، نص البراند `truncate`)، الارتفاع ثابت `h-16`.
- **A11y:** كل زرار/لينك له اسم؛ `focus-visible` ظاهر؛ landmark `<header>`؛ ترتيب tab منطقي.
- **اختبار:** HTML `/ar` و`/en`: لينك اللغة `href="/en"`/`"/ar"` حقيقي، `data-cart-target` ×1، `<header>` ×1. يدويًا 🟡: تبديل لغة/ثيم، Esc.
- **DoD:** 🟡 للشكل (Header جديد). تعديلات ThemeSwitcher a11y ✅.

### S3 — Footer
- **الملفات:** `components/ECommerce/Footer/{StoreFooter,FooterContact,FooterSocial}.tsx`، `components/Skelton/FooterSkeleton.tsx`.
- **Reuse:** `getStoreSettings`, `getCurrentYear`, `toSafeExternalUrl`, `normalizeWhatsAppNumber`, `buildWhatsAppUrl`, `Phone/Mail/MapPin/Clock/MessageCircle/ExternalLink`.
- **المطلوب:** `StoreFooter` (async server) ⇒ `<footer>` بـ 3 أعمدة على `md`: (1) براند + tagline، (2) تواصل، (3) سوشال. **كل عنصر بيظهر بس لو القيمة صالحة (A-8)**: هاتف `tel:` (ارقام/+ فقط بعد التنظيف)، إيميل `mailto:`، واتساب (لو `normalizeWhatsAppNumber` ≠ null)، عنوان، ساعات عمل (نص). السوشال: لكل شبكة `toSafeExternalUrl` ≠ null ⇒ لينك `target="_blank" rel="noopener noreferrer"` بنص اسم الشبكة من messages (`footer.social.facebook`…) + `ExternalLink` + `sr-only` من `a11y.opensInNewTab`. لو عمود فاضي بالكامل ⇒ ما يتعرضش (ولا عنوانه). شريط سفلي: `© {year} {brand}`. فشل settings ⇒ الأساسيات بس (براند + حقوق) من غير أي رسالة خطأ.
- **API:** `GET /store/settings` عبر `getStoreSettings()`.
- **الحالات:** Loading = `FooterSkeleton` (نفس الارتفاع التقريبي، `min-h`) · Error/Empty = الأساسيات · Success = الكل.
- **Responsive:** عمود واحد موبايل، 3 أعمدة `md+`. **A11y:** `<footer>`، عناوين `h2` للأعمدة (مخفية بصريًا لو لزم)، تباين الروابط، لينكات خارجية معلنة.
- **اختبار:** (seed: كله null) ⇒ HTML فيه الفوتر بالبراند والحقوق **ومفيش** `tel:`/`mailto:`/`wa.me`. **مصفوفة الـ cache (قسم 10.3)** بتتشغل هنا لأول مرة.
- **DoD:** مفيش `new Date()` مباشر في مكوّن.

### S4 — WhatsAppFab
- **الملف:** `components/ECommerce/WhatsAppFab.tsx` (async server).
- **المطلوب:** `getStoreSettings()` ⇒ `normalizeWhatsAppNumber(contact.whatsapp)`؛ `null` ⇒ `return null`. غير كده: `<PulseRing ringClassName="bg-whatsapp" className="fixed bottom-6 start-6 z-50 size-14 rounded-full"><a href={buildWhatsAppUrl(number, t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" aria-label={t("whatsapp.label")} className={cn(buttonVariants({variant:"whatsapp"}), "size-14 rounded-full p-0")}><MessageCircle className="size-7" aria-hidden="true"/></a></PulseRing>`. (على الـ `start` عكس `BackToTop` على الـ `end`.)
- **الحالات:** رقم صالح ⇒ يظهر · غيره ⇒ مايظهرش خالص.
- **A11y/RTL:** `aria-label` من messages، `rel` صح، مفيش overlap مع BackToTop.
- **اختبار:** seed ⇒ `wa.me` غير موجود في HTML. للتحقق البصري: **المالك** يضيف `SystemSetting` مفتاح `STORE_CONTACT` قيمته JSON `{"whatsapp":"<رقمه الدولي digits>"}` (عبر Prisma Studio — قراره، مش مهمة الـ AI) ثم ينتظر ≤ دقيقة (revalidate)؛ لو مش متاح ⇒ ⛔ سجّل "مش متأكد حي" وراجع النبضة على `/design`.
- **DoD:** 🟡 بصري (كمكوّن جديد في الصفحة).

### S5 — `ScrollEffects` (دمج `DesignEffects`) — **M-4**
- **الملفات:** `components/Animation/ScrollEffects.tsx` (جديد: `ScrollProgressBar` + `BackToTop`)، `app/[locale]/design/page.tsx` (الاستيراد فقط — يفضل 30 سطر)، **حذف** `components/design/DesignEffects.tsx`.
- **المطلوب:** `(Store)/layout.tsx` بيركّبه. تأكد من `grep` إن مفيش مستهلك تاني لـ `DesignEffects`.
- **اختبار:** `/design` و`/ar` فيهم الخط العلوي وزرار لفوق بعد أول شاشة (الحلقة من H5).
- **DoD:** `check` = صفحة design 30 سطر بالظبط ومفيش تحذير.

### S6 — `StoreJsonLd` (Organization + WebSite)
- **الملف:** `components/ECommerce/StoreJsonLd.tsx` (async server).
- **المطلوب:** `getLocale()` + `getTranslations("brand")` + `getStoreSettings()` ⇒ `<JsonLd data={buildOrganizationJsonLd(...)} />` و`<JsonLd data={buildWebSiteJsonLd(...)} />`. فشل/null settings ⇒ Organization من غير `sameAs`/`contactPoint`، و WebSite دايمًا. `siteUrl` من `SITE_URL`.
- **اختبار (Appendix B-3):** الـ HTML فيه `application/ld+json` ×2، كل واحد `JSON.parse` ينجح، الأنواع `Organization` و`WebSite`، `url` = `http://localhost:3001/ar`، مفيش `SearchAction`/`logo`/`</script>` داخل الـ JSON.
- **DoD:** ممنوع تألف `logo`/`address`.

**Check Gate 2:** lint/build/check + **مصفوفة الباك (10.3)** + سكربت HTML (Appendix B-3) على `/ar` و`/en` بقيم Gate 2 (قسم 10.2).
⛔ **STOP — Gate 2** (اعرض للمالك: Header/Footer/FAB/Effects 🟡).

---

## Gate 3 — الصفحة الرئيسية

> الفرق الجوهري: **فوق الـ fold = CSS فقط** (`animate-fade-up`)، **تحت الـ fold = `FadeIn`/`Stagger`**. ممنوع `opacity:0` inline على محتوى فوق الـ fold في HTML السيرفر.

### HM1 — Hero
- **الملف:** `components/ECommerce/Home/Hero.tsx` (server)، + `styles/animations.css` (§9: `@media (prefers-reduced-motion: no-preference){ html{ scroll-behavior:smooth } }`).
- **المطلوب:** `<section aria-labelledby="hero-title" className="relative isolate overflow-hidden ...">`؛ `<h1 id="hero-title" className="font-display text-4xl md:text-6xl text-ink animate-fade-up">` من `home.hero.title`؛ `<p>` من `home.hero.subtitle` بـ `animate-fade-up` و`style={{animationDelay:"120ms"}}`؛ CTA: `<a href="#categories" className={buttonVariants({size:"lg"})}>` نصه `home.hero.cta` بـ `animate-fade-up` و`animationDelay:"240ms"`. زخرفة `aria-hidden` من tokens بس (دوائر `bg-glow/20 blur-3xl rounded-full`، `bg-accent/15`) — **مفيش صورة، مفيش لون خام**. `min-h-[70dvh]` تقريبًا، محتوى متوسّط.
- **API:** — · **الحالات:** ثابت.
- **i18n/RTL:** النصوص من messages؛ المحاذاة `text-center` (متماثلة). **Responsive:** `text-4xl → md:text-6xl`، padding `px-4`. **A11y:** h1 واحد في الصفحة كلها، تباين `ink/paper`.
- **اختبار:** HTML: `animate-fade-up` ×3 على الهيرو، `opacity:0` inline ⇒ 0 فوق الـ fold.
- **DoD:** 🟡 (شكل + copy).

### HM2 — شريط الثقة (`HomeTrust`)
- **الملف:** `components/ECommerce/Home/HomeTrust.tsx` (async).
- **المطلوب:** items: (1) **الدفع عند الاستلام** دايمًا (`Banknote`، `home.trust.cod`)، (2) **شحن مجاني** لو `freeShippingThreshold` ≠ null: `Truck` + `home.trust.freeShipping` مع `{amount}` = `formatPriceAmount(threshold)` و`{currency}` = `common.currencyEgp`، (3) **واتساب** لو الرقم صالح: `MessageCircle` + `home.trust.whatsapp`. بيمرّرهم لـ `TrustStrip`. فشل settings ⇒ COD بس. **ممنوع** إضافة أي ميزة (استبدال/ضمان...) — دي بيانات الباك مش موجودة كإعدادات.
- **الحالات:** Loading `Skeleton` بعرض الشريط · Error/Empty ⇒ COD · Success.
- **Responsive:** TrustStrip نفسه (صف ديسكتوب/marquee موبايل). **A11y:** نصوص حقيقية، أيقونات `aria-hidden` (موجودة في المكوّن).
- **DoD:** مفيش نص hard-coded.

### HM3 — البانرات
- **الملفات:** `components/ECommerce/Home/{BannerSection,BannerSlider}.tsx`، `components/Skelton/BannerSkeleton.tsx`.
- **Reuse:** `getStoreBanners`, `resolveBannerLink`, `pickLocalized`, `StoreImage`, `Link`, `Button variant="soft"`, `FadeIn`, `ChevronLeft/ChevronRight`.
- **المطلوب:** `BannerSection` (async): فشل/فاضي ⇒ `null`. غير كده يجهّز `items` serializable: `{id, title (pickLocalized(locale,titleAr,titleEn)), imageUrl, mobileImageUrl, link: resolveBannerLink(linkUrl)}` ويمرّرها لـ `BannerSlider` (client) جوه `FadeIn`. السلايدر: `ul` أفقي `flex overflow-x-auto snap-x snap-mandatory` (scrollbar مخفي بـ utility موجود أو CSS صغير)، كل `li` `min-w-full snap-center`، صورة `aspect-[3/1]` (ديسكتوب) وـ`mobileImageUrl` لو موجودة على الموبايل (`md:hidden`/`hidden md:block`)، **caption تحت الصورة** (`bg-surface`، مش overlay — ضمان تباين في كل الثيمات). `link`: internal ⇒ `Link`، external ⇒ `<a target="_blank" rel="noopener noreferrer">`، null ⇒ من غير لينك. أسهم prev/next (أيقونات `aria-label` من messages) **بس لو أكتر من بانر**؛ التمرير `track.scrollBy({left: dir * track.clientWidth * (isRtl ? -1 : 1), behavior: reduced ? "auto" : "smooth"})` (**RTL: السكرول سالب — اختبره في اللغتين**). مفيش autoplay ولا dots (M-6).
- **API:** `GET /store/banners` — الحقول 7.2.
- **الحالات:** Loading `BannerSkeleton` (نفس النسبة) · Error/Empty ⇒ يختفي · Success.
- **i18n/RTL:** `alt` = العنوان؛ الأسهم بتتبدّل بصريًا في RTL (السهم الأيمن = التالي في العربي). **Responsive:** عرض كامل `max-w-6xl`. **A11y:** `ul`/`li` + `aria-roledescription="carousel"` على الحاوية، الأسهم أزرار حقيقية، `focus-visible`.
- **اختبار:** seed (بانر واحد) ⇒ الأسهم مخفية، الصورة من picsum تظهر من غير خطأ build (A-6)، اللينك `/?category=herbs` بيفتح الهوم. تحقق يدوي RTL/LTR لو أضفت بانر تاني مؤقتًا (بيانات الباك مش بتتعدل — اختبره بتعديل مؤقت محلي في DevTools أو اطلب من المالك).
- **DoD:** 🟡.

### HM4 — الأقسام
- **الملفات:** `components/ECommerce/Home/CategoriesSection.tsx`، `components/Card/CategoryCard.tsx`، `components/Skelton/CategoriesSkeleton.tsx`.
- **Reuse:** `getStoreCategories`, `SectionHeading`, `GlowCard`, `Stagger/StaggerItem`, `StoreImage`, `EmptyState/ErrorState`, `categoryHref`, `pickLocalized`, `Leaf`.
- **المطلوب:** `<section id="categories" className="scroll-mt-20 ...">` + `SectionHeading` (`home.categories.title/subtitle`). نجاح ⇒ grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4` جوه `Stagger`. `CategoryCard`: `GlowCard` بـ `accent` يتناوب `card-1..4` حسب الـ index (خريطة static array)، `Link href={categoryHref(slug)}` (KS-1)، صورة `StoreImage aspect-[4/3]` لو `imageUrl` وإلا بلاطة بتركيب tokens + `Leaf` **(نفس الأيقونة لكل الأقسام — مفيش mapping مخترع)**، الاسم `pickLocalized`، الوصف (لو فيه) `line-clamp-2`، العدد بـ `home.categories.count` (ICU plural). **ترتيب الـ API زي ما هو.**
- **الحالات:** Loading `CategoriesSkeleton` (4 كروت) · Error ⇒ `ErrorState` (`home.categories.errorTitle/errorBody`، من غير زرار) · Empty ⇒ `EmptyState` · Success.
- **Responsive:** 2/3/4 أعمدة. **A11y:** كل كارت لينك واحد باسم واضح، heading h2.
- **اختبار:** HTML: 3 كروت من الباك الحي، لينكات `/ar/products?category=spices|herbs|gift-bundles` (KS-1)، `id="categories"`، مفيش `opacity:0` غير جوه `Stagger` (تحت الـ fold).
- **DoD:** 🟡.

### HM5 — المنتجات المميزة + ProductCard
- **الملفات:** `components/ECommerce/Home/{FeaturedSection,FeaturedGrid}.tsx`، `components/Card/ProductCard.tsx`، `components/Skelton/FeaturedSkeleton.tsx`.
- **Reuse:** `getFeaturedProducts`, `GlowCard`, `PriceTag`, `Badge`, `StoreImage`, `useRotatingIndex`, `SectionHeading`, `ErrorState`, `FadeIn`, `productHref`, `pickLocalized`.
- **المطلوب:**
  - `FeaturedSection` (async): فشل ⇒ `ErrorState` (`home.featured.errorTitle/errorBody`) — **ده اللي هيظهر فعليًا النهارده** · نجاح + فاضي ⇒ `null` (M-5) · نجاح ⇒ `SectionHeading` + `FeaturedGrid` (client) بـ `products`.
  - `FeaturedGrid`: `useRotatingIndex(products.length, 3000)` ⇒ `isBeamActive` لكارت واحد بس؛ grid `grid-cols-2 lg:grid-cols-4 gap-4`.
  - `ProductCard` (`memo`): props `{ product: IStoreProductCard; locale: string; isBeamActive?: boolean }`. `GlowCard` (`accent` = `card-3` للـ `PREDEFINED_BUNDLE` وإلا `none`). صورة `aspect-square` بـ `StoreImage` (primary) + secondary بـ `opacity` crossfade على hover (`@media (hover:hover)` عبر `group-hover` — مفيش على اللمس). شارات `absolute top-2 start-2`: `Badge bundle` لو bundle، `Badge soldOut` لو `!inStock`. الاسم `pickLocalized(locale, nameAr, nameEn)` سطرين max. تصنيف صغير `category.nameAr/En`. السعر: `PriceTag price={price.from} compareAt={price.compareAtFrom}` وقبله كلمة `product.priceFrom` لو `hasMultiplePackages`. الكارت كله قابل للضغط عبر لينك واحد ممدود على الاسم (`after:absolute after:inset-0`) → `productHref(slug)` (KS-2). **مفيش زرار سلة، مفيش countdown، مفيش مخزون.**
- **API:** `GET /store/products?featured=true&limit=8&sort=newest` ⇒ ⛔ BLOCKED النهارده (B-1).
- **الحالات:** Loading `FeaturedSkeleton` (4 كروت) · Error ⇒ ErrorState (متأكد حي) · Empty ⇒ يختفي · Success ⇒ ⛔ **غير متأكد حي** (Gate 5) — يتراجع بصريًا عبر صف `/design` (D1).
- **Responsive/A11y:** `sizes="(min-width:1024px) 25vw, 50vw"`، `alt` = اسم المنتج (`primaryImage.altAr/altEn` لو فيه وإلا الاسم)، لينك واحد لكل كارت، البادجز نصوص.
- **اختبار:** `/ar` النهارده ⇒ ErrorState ظاهر في الـ HTML (مش stack trace) + `console.error("[store]" …)` في terminal السيرفر.
- **DoD:** 🟡 للشكل، والـ data-state مسجلة ⛔.

### HM6 — تركيب الصفحة
- **الملفات:** `components/ECommerce/Home/HomeSections.tsx`، `app/[locale]/(Store)/page.tsx` (≤15 سطر فعليًا).
- **المطلوب:** `HomeSections` بيرتّب: `Hero` → `<Suspense fallback={<TrustSkeletonInline/>}><HomeTrust/></Suspense>` → `<Suspense fallback={<BannerSkeleton/>}><BannerSection/></Suspense>` → `<Suspense fallback={<CategoriesSkeleton/>}><CategoriesSection/></Suspense>` → `<Suspense fallback={<FeaturedSkeleton/>}><FeaturedSection/></Suspense>` بمسافات `space-y-16 md:space-y-24` ثابتة. الصفحة: `setRequestLocale(locale)` + `<HomeSections />`. **الـ metadata** بتتورّث من `app/[locale]/layout.tsx` (مفيش `generateMetadata` مكرر).
- **اختبار:** ترتيب الأقسام في HTML، h1 واحد، canonical `http://localhost:3001/ar`، hreflang ×4، build والباك واقف يعدّي (قسم 10.3).
- **DoD:** 🟡 للهوم كله + عرض على المالك.

**Check Gate 3:** lint/build/check + مصفوفة الباك (10.3) + HTML (10.2: Gate 3) + مراجعة يدوية: موبايل 360px، RTL/LTR، 4 ثيمات (خصوصًا قرفة)، تبديل لغة/ثيم، Esc، tab order.
⛔ **STOP — Gate 3** (عرض الهوم على المالك: **هنا بنقرر الـ styles والـ animation النهائية مع بعض** — اكتب في PROGRESS كل طلب تعديل منه).

---

## Gate 4 — صف /design + sitemap + التوثيق + الإقفال

### D1 — صف `ProductCard` على `/design` (fixtures معنونة)
- **الهدف:** المالك يشوف الكارت بكل حالاته حتى والباك واقع. **ده الاستثناء الوحيد المسموح للـ fixtures (قاعدة 5).**
- **الملفات:** `components/design/demoProducts.ts` (≤60 سطر: `IStoreProductCard[]` بـ 5 حالات: عادي بسعر مشطوب · أكتر من عبوة · bundle · نفد · من غير صورة)، `components/design/ProductCardRow.tsx` (≤60 سطر)، `messages/{ar,en}.json` (`design.productCardTitle`, `design.productCardDemoNote`), وتركيبه **جوه `ComponentsRow.tsx`** (عشان `page.tsx` يفضل 30 سطر).
- **المطلوب:** أسماء الـ fixtures **إنجليزي بس** (الـ check بيرفض عربي في الكود)؛ الأسعار strings (`"45.0000"`, `"60"`...) بحيث تجرّب الشكلين؛ صورة واحدة بـ `https://res.cloudinary.com/demo/image/upload/v1/sample.jpg` (حساب Cloudinary التجريبي العام) والباقي `null`؛ ملاحظة "أرقام وبيانات تجريبية للعرض بس" ظاهرة (messages). كل الكروت جوه `FeaturedGrid`-style بـ `useRotatingIndex`.
- **اختبار:** HTML `/ar/design` ⇒ الأسعار مش `0`، و`srcset` الصورة فيه `c_limit,w_` + `f_auto,q_auto` (loader شغال)، و`/_next/image` **مش** موجود.
- **DoD:** مفيش استيراد للـ fixtures من أي مكان برّه `components/design`. 🟡.

### D2 — `app/sitemap.ts`
- **المطلوب:** عنصرين (`/ar` و`/en`) بـ `SITE_URL`، كل واحد فيه `alternates.languages` = `{ ar, en }`، `changeFrequency: "daily"`, `priority: 1`. **من غير `new Date()`** (شيل `lastModified`) عشان المسار يبقى static. مفيش منتجات/أقسام لحد ما صفحاتهم تتبنى (يوم 4). `robots.ts` زي ما هو.
- **اختبار:** `curl -s localhost:3001/sitemap.xml` ⇒ `<loc>` للغتين + `xhtml:link` للبدائل؛ كل `<loc>` بيرد 200.

### D3 — التوثيق + التحقق النهائي + التقرير
1. **`AGENTS.md`:** (أ) شجرة §3.1: `(Store)/` و`ECommerce/`, `Card/`, `Skelton/`, `lib/server/` بقوا [exists]؛ (ب) قاعدة طبقة البيانات (A-1…A-4: server-only، Suspense، `use cache` + `cacheLife` الشرطي، السنة)؛ (ج) صور (A-6) و`StoreImage`؛ (د) مقياس z-index (A-9)؛ (هـ) قاعدة `data-cart-target` الواحد؛ (و) قاعدة "ممنوع mock + الاستثناء المعنون"؛ (ز) "مفيش brand icons في lucide v1.73 → نص + `ExternalLink`"؛ (ح) قائمة KS-1..3 كحالة مؤقتة.
2. **`PROGRESS.md`:** صفوف كل المهام (✅/🟡/⛔)، الانحرافات، نتائج الأوامر، مصفوفة 10.3 (النتائج الحقيقية)، قائمة "محتاج المالك يشوف"، وتقرير الإنهاء (قسم 13).
3. **التحقق النهائي:** قسم 10 كله + فحص **link health**: كل لينك داخلي في `/ar` و`/en` بيرد 200 **ماعدا** KS-1..3.
4. اكتب `⛔ STOP — Gate 4`.

---

## Gate 5 — (شرطي) التحقق بعد إصلاح الباك

**بيتنفذ بس لما المدير يكتب في PROGRESS إن الباك اتصلح** (`GET /api/store/products` بيرجع 200). لو لسه واقع: يوم 3 بيتقفل من غير Gate 5 وتتسجل البنود دي كـ `⛔ pending-backend`.

| # | البند | المطلوب |
| --- | --- | --- |
| V1 | عقد الكارت | `curl "…/store/products?featured=true&limit=2"` ⇒ سجّل أول 400 حرف، قارن **كل حقل** بـ `IStoreProductCard`، **وسجّل شكل الفلوس الحقيقي** (`"45"` ولا `"45.0000"`). أي فرق ⇒ عدّل `interface/store.ts` + بلّغ المدير (مش تخمين) |
| V2 | Featured حي | `/ar` بيعرض كروت حقيقية: أسعار صح في HTML (مش `0`)، صور (Cloudinary أو بلاطة بديلة)، أسماء `ar`/`en` |
| V3 | البيانات في الـ shell | `npm run build` والباك شغال ⇒ HTML فيه المنتجات المميزة؛ وبعد إيقاف الباك وإعادة `start` بيرجع للسلوك المسجل في 10.3 |
| V4 | الأقسام | `productsCount` في الكروت مطابق لعدد `meta.total` لو فلترنا بالـ category (`products?category=spices&limit=1`) |
| V5 | إعادة مصفوفة 10.3 + HTML Gate 3 | كلها خضرا، و`PROGRESS` يتحدّث |

---

## 9) الـ Gates ونقاط الاعتماد (ملخص)

| Gate | المخرجات | الأوامر | المتوقع | بعده |
| --- | --- | --- | --- | --- |
| **0** | قراءة + 12 إجابة + أوامر أساسية + فحص باك + قرارات M-1..9 | 3.4 + 3.5 | lint/build/check أخضر بالأرقام المذكورة | ⛔ STOP — موافقة المدير |
| **1** | H1–H7 + F1–F4 | 10.1 + اختبارات الـ pure + HTML `/design` | 0 failures/0 warnings، package.json بدون تغيير، `CountUp` مش `0`، hreflang ×4 | ⛔ STOP |
| **2** | S1–S6 (غلاف المتجر) | 10.1 + 10.2(G2) + 10.3 | الـ build يعدّي والباك واقف، JSON-LD ×2 سليم، `data-cart-target` ×1 | ⛔ STOP + عرض للمالك |
| **3** | HM1–HM6 (الهوم) | 10.1 + 10.2(G3) + 10.3 + مراجعة يدوية | h1 ×1، لا `opacity:0` فوق الـ fold، Featured = ErrorState حقيقي | ⛔ STOP + **جلسة styles/animation مع المالك** |
| **4** | D1–D3 | كل ما فوق + link health | كل الحاجات خضرا، KS-1..3 بس بترجع 404 | ⛔ STOP (إقفال يوم 3) |
| **5** | V1–V5 (لما الباك يتصلح) | 10.3 + curl المنتجات | عقد الكارت مطابق، Featured حي | تحديث PROGRESS |

---

## 10) أوامر التحقق

### 10.1 بعد كل Gate
```bash
cd Om-Eman/frontend
npm run lint && npm run build && npm run check          # لازم 0 failure و0 warning
git diff --stat -- package.json package-lock.json        # لازم فاضي
grep -rn "framer-motion" --include=*.ts --include=*.tsx app components lib hooks   # لازم فاضي
```
وبعد أي Gate فيه HTML: `npm run start` (بورت 3001) في terminal منفصل + سكربت Appendix B-3.

### 10.2 قيم HTML المتوقعة (سكربت B-3)
| Gate | URL | المتوقع |
| --- | --- | --- |
| 1 | `/ar/design` | hreflang = `ar,en,ar-EG,x-default` · `og:locale`=`ar_EG` · CountUp مش `"0"` · title/canonical سليمين |
| 2 | `/ar` و`/en` | `lang`/`dir` صح · أول `<a` skip link · `<header>` ×1 · `data-cart-target` ×1 · `<footer>` ×1 · `application/ld+json` ×2 (JSON.parse ✅، `Organization` + `WebSite`، مفيش `SearchAction`/`logo`) · `wa.me` غايب (seed) · لينك اللغة الحقيقي |
| 3 | `/ar` و`/en` | h1 ×1 · `id="categories"` · 3 كروت أقسام بلينكات `/{locale}/products?category=…` · قسم البانرات موجود · Featured = رسالة الخطأ المترجمة (مش stack/code خام) · `style="opacity:0` **فقط** جوه `Stagger`/`FadeIn` تحت الـ fold |
| 4 | `/ar/design`, `/sitemap.xml` | أسعار الكروت مش `0` · `srcset` فيه `f_auto,q_auto` · sitemap فيه ar+en |

### 10.3 مصفوفة الباك (الأهم في Gate 2 و3 — سجّل **النتيجة الحقيقية** لكل صف)
| # | الحالة | الخطوات | المتوقع |
| --- | --- | --- | --- |
| M1 | الباك **واقف** وقت البناء | أوقف الباك → `npm run build` | ✅ يعدّي من غير "uncached data outside Suspense" أو crash |
| M2 | الباك واقف وقت التشغيل | `npm run start` → `curl -s localhost:3001/ar` | 200، الهوم فيه Hero وErrorState للأقسام/المنتجات (مفيش stack)، الفوتر بالأساسيات |
| M3 | الباك رجع | شغّل الباك → اطلب `/ar` تاني (من غير rebuild) | الأقسام الحقيقية ظهرت ⇒ الفشل **ماتخزنش** |
| M4 | الباك شغال وقت البناء | `npm run build` | ✅ ويسجل: هل الأقسام اتحطت في الـ shell؟ |
| M5 | الباك وقف بعد M4 | أوقفه واطلب `/ar` | سجّل: بيعرض المخزّن ولا Error؟ (ملاحظة، مش شرط) |
لو M1 أو M3 فشلوا ⇒ خطة A-3 البديلة + سجّل الخطأ الحرفي + اسأل المدير.

---

## 11) معايير القبول

- [ ] `npm run lint` + `build` + `check` = 0 failures و0 warnings، و`package.json` من غير dependency جديدة.
- [ ] ملف ≤150 سطر (خطر 200)، صفحات ≤30، ملف = مسؤولية واحدة، `I`/`T`، مفيش `any`/`console.log`/كود معلق/تعليقات جديدة.
- [ ] مفيش لون خام في TSX، مفيش نص hard-coded (حتى الوحدات/العملات/أسماء اللغات)، `ar.json` = `en.json`، رسائل ICU بأقواس مفردة.
- [ ] الـ build بيعدّي والباك واقف (M1)، وكل مكوّن بيجيب داتا جوه Suspense بـ skeleton بنفس الأبعاد.
- [ ] كل قسم له حالات Loading/Error/Empty/Success حسب A-8 (والـ data-state للـ Featured مسجلة ⛔ لحد Gate 5).
- [ ] HTML السيرفر: h1 واحد، JSON-LD سليم من غير `<` خام، hreflang ×4، أسعار حقيقية، مفيش محتوى فوق الـ fold بـ `opacity:0`.
- [ ] SSR صور: `alt` موجود، `sizes` موجود، الـ loader بيحوّل Cloudinary بس.
- [ ] RTL/LTR سليمين (سلايدر البانرات بالأخص)، 4 ثيمات (قرفة بالأخص)، موبايل 360px.
- [ ] a11y: skip link، landmarks (`header/main/footer`)، أسماء لكل زرار/لينك، `focus-visible`، لينكات خارجية معلنة، حركات تحترم reduced-motion.
- [ ] الباك ماتلمسش، مفيش mock، الـ fixtures في `/design` فقط ومعنونة.
- [ ] `PROGRESS.md` متحدّث وصادق: البصري الجديد 🟡، الـ BLOCKER مسجل، KS-1..3 مسجلين، مصفوفة 10.3 بنتايج حقيقية.

---

## 12) المخاطر والـ blockers المعروفة

| ID | الخطر | الأثر | التعامل |
| --- | --- | --- | --- |
| **B-1** | **BLOCKER الباك:** `products`, `products/:slug`, `search` واقعين (alias `pk0` vs `pk1/pk2` في `list.ts`) والخطأ بيرجع HTTP **400** مضلّل | حالة data للـ Featured غير متأكدة حي؛ كتالوج/منتج/بحث (أيام 4-5) محجوبين | ErrorState حقيقي النهارده + Gate 5 بعد الإصلاح. **ممنوع mock/workaround/تعديل باك** |
| B-2 | seed: `contact/social` null، الأقسام بدون صور، البانر picsum | FAB/الفوتر/السوشال/صور الأقسام مش بتتشاف | المالك يملأ `STORE_CONTACT`/`STORE_SOCIAL` وصور Cloudinary قبل جلسة Gate 3 (أو التحقق عبر `/design`) |
| B-3 | ترتيب الأقسام ties (`sortOrder:0` للكل) | ترتيب غير مضمون | ماتعيدش الترتيب؛ ملاحظة للباك |
| B-4 | الباك مابيبعتش `Cache-Control` | الكاش بتاعنا بس (`use cache`) | موثّق |
| B-5 | شكل الفلوس غير مؤكد (`"45"` vs `"45.0000"`) | عرض | `formatPriceAmount` يتعامل مع الاتنين؛ V1 يسجّل الحقيقي |
| R-1 | `"use cache"` + `cacheLife` شرطي مش مجرّب في المشروع | ممكن يفشل الـ build أو يخزّن الفشل | مصفوفة 10.3 + خطة A-3 البديلة |
| R-2 | `import "server-only"` ممكن ماتتحلّش | build error | قف واسأل — **ممنوع تثبيت الحزمة** |
| R-3 | loader مخصص + hosts خارجية (picsum) | "hostname not configured"؟ | اتأكد في أول build؛ سجّل الخطأ لو ظهر |
| R-4 | سلايدر `scrollBy` في RTL (scrollLeft سالب) | الأسهم تتحرك عكس المتوقع | اختبر العربي والإنجليزي صراحةً |
| R-5 | `template.tsx` (TD-13): مش هيعيد الحركة بين صفحات `(Store)` | بعد يوم 4 | قرار يوم 4 (`(Store)/template.tsx`) — **مش النهارده** |
| R-6 | `data-cart-target` في `<Activity>` مخفي | الطيران لمكان غلط | H4 + A-10 |
| R-7 | رقم الواتساب المحلي (`010…`) | FAB مخفي | M-8 + المالك يدخله بصيغة دولية |
| R-8 | رسائل ICU للجمع بالعربي | `INVALID_MESSAGE` وقت الـ build | Appendix A + سجل `npm run build` للـ errors |
| R-9 | `new Date()` تحت `cacheComponents` | build error | A-4 (`getCurrentYear`) |
| R-10 | `banner.linkUrl` نص حر (XSS/open redirect) | أمان | `resolveBannerLink` فقط |
| R-11 | بيانات demo اتخبزت في الـ shell وقت الـ build | بيانات قديمة لحد revalidate | `cacheLife("minutes")` + ملاحظة نشر |
| R-12 | حركة الدخول CSS (300ms) على عنصر الـ LCP | LCP أبطأ شوية | قياس Lighthouse يوم Lighthouse (مش النهارده) |
| R-13 | زيادة حجم الملفات (نموذج ضعيف بيجمّع) | مخالفة 150/200 | قسّم قبل ما توصل 150 (AGENTS §5) |
| R-14 | الباك مش بيبعت `Cache-Control` ولا فيه rate-limit على GET واضح | حمل | الكاش عندنا يقلل الطلبات (60s) |

---

## 13) قالب التقرير النهائي (آخر PROGRESS)

1. **جدول** كل مهمة (H1…D3) ← الحالة (✅/🟡/⛔/DROPPED) ← الملفات بأسماءها.
2. **نتيجة** `lint` و`build` و`check` (آخر الأسطر الحقيقية) + `git diff --stat -- package.json`.
3. **مصفوفة 10.3** (M1–M5) بالنتايج الفعلية + سكربت HTML لكل Gate (المخرجات).
4. **الانحرافات** عن الملف ده + السبب (كل خطة بديلة اتنفذت).
5. **القيم المختارة** (مدد/أحجام/ألوان/limits) عشان المالك يعدّلها.
6. **قائمة "محتاج المالك يشوف"**: كل مكوّن + الإحساس المطلوب تقييمه (موبايل + RTL + 4 ثيمات) + النصوص الجديدة (copy) للمراجعة.
7. **اللينكات الميتة** (KS-1..3) وأي 404 تاني (المفروض صفر).
8. **حالة الباك:** اللي اتجرب حي، الـ BLOCKER، وأي تعارض عقد/Swagger جديد.
9. **اللي ⛔ pending-backend** وتاريخ/شرط تنفيذ Gate 5.
10. **اقتراحات لليوم 4** (من غير تنفيذ).

---

## Appendix A — مفاتيح messages المطلوبة (ar = en بنفس المفاتيح)

| Namespace | المفاتيح |
| --- | --- |
| `brand` | `name` |
| `a11y` | `skipToContent`, `opensInNewTab` |
| `header` | `cart` |
| `locale` | `ar` (= "العربية")، `en` (= "English")، `switchTo` (`{language}`) |
| `theme` | `label`, `themeZafran`, `themeAttar`, `themeCinnamon`, `themeHibiscus` |
| `whatsapp` | `label`, `prefill` |
| `footer` | `tagline`, `contactTitle`, `socialTitle`, `phone`, `email`, `address`, `workingHours`, `whatsapp`, `copyright` (`{year}` `{brand}`), `social.facebook`, `social.instagram`, `social.tiktok`, `social.youtube` |
| `home.hero` | `title`, `subtitle`, `cta` |
| `home.trust` | `cod`, `freeShipping` (`{amount}` `{currency}`), `whatsapp` |
| `home.banners` | `label`, `prev`, `next` |
| `home.categories` | `title`, `subtitle`, `count` (ICU plural)، `errorTitle`, `errorBody`, `emptyTitle`, `emptyBody` |
| `home.featured` | `title`, `subtitle`, `errorTitle`, `errorBody` |
| `product` | `priceFrom` |
| `design` (إضافة) | `productCardTitle`, `productCardDemoNote` |

**مثال plural عربي صحيح:** `"count": "{count, plural, =0 {مفيش منتجات} one {منتج واحد} two {منتجين} few {# منتجات} many {# منتج} other {# منتج}}"` وفي الإنجليزي `{count, plural, =0 {No products} one {# product} other {# products}}`. اختبره بـ `npm run build` (أي `INVALID_MESSAGE` = خطأ صياغة). النصوص الجديدة 🟡 للمالك.

## Appendix B — أنماط جاهزة (استخدمها حرفيًا)

### B-1 نمط `storeFetch` (هيكل — اكمله بالقواعد في F2)
```ts
import "server-only";
import { API_BASE_URL } from "@/lib/config";
import { isEnvelopeFailure, isEnvelopeSuccess } from "@/lib/envelope";
import type { IPaginationMeta } from "@/interface";

export type TStoreResult<T> =
  | { ok: true; data: T; meta?: IPaginationMeta }
  | { ok: false; status: number; code: string };

const baseUrl = (process.env.API_INTERNAL_URL || API_BASE_URL).replace(/\/+$/, "");

export const storeFetch = async <T>(path: string): Promise<TStoreResult<T>> => {
  try {
    const response = await fetch(`${baseUrl}/${path.replace(/^\/+/, "")}`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
    const body: unknown = await response.json().catch(() => null);
    if (isEnvelopeFailure(body)) return { ok: false, status: response.status, code: body.code };
    if (!response.ok || !isEnvelopeSuccess(body)) return { ok: false, status: response.status, code: "INVALID_RESPONSE" };
    return { ok: true, data: body.data as T, meta: body.meta };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    return { ok: false, status: 0, code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR" };
  }
};
```
(المطلوب منك تضيف `console.error("[store]", { path, status, code })` عند الفشل، وتتأكد إن `body.data as T` مقبول (cast واحد موثّق) أو استبدله بـ type guard — لو اخترت cast سجّله.)

### B-2 نمط query بـ cache شرطي
```ts
import { cacheLife, cacheTag } from "next/cache";

export const getStoreCategories = async (): Promise<TStoreResult<IStoreCategoryNode[]>> => {
  "use cache";
  cacheTag("store-categories");
  const result = await storeFetch<IStoreCategoryNode[]>("store/categories");
  cacheLife(result.ok ? "minutes" : "seconds");
  return result;
};
```
استدعاء `cacheLife` **مرة واحدة** في كل تنفيذ. الاستهلاك دايمًا جوه `<Suspense>`.

### B-3 سكربت فحص HTML (احفظه في `%TEMP%/check-html.js` — **مش في الريبو**)
```js
// node check-html.js http://localhost:3001/ar
const url = process.argv[2];
fetch(url).then(async (response) => {
  const html = await response.text();
  const all = (re) => [...html.matchAll(re)].map((m) => m[1] ?? m[0]);
  console.log("status:", response.status, "bytes:", html.length);
  console.log("html:", (html.match(/<html[^>]*>/) || [""])[0]);
  console.log("title:", (html.match(/<title>([^<]*)<\/title>/) || [])[1]);
  console.log("canonical:", (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]);
  console.log("hreflang:", all(/hreflang="([^"]*)"/gi).join(","));
  console.log("og:locale:", all(/property="og:locale" content="([^"]*)"/g).join(","), "| alt:", all(/property="og:locale:alternate" content="([^"]*)"/g).join(","));
  console.log("h1:", (html.match(/<h1[ >]/g) || []).length, "| header:", (html.match(/<header[ >]/g) || []).length, "| footer:", (html.match(/<footer[ >]/g) || []).length);
  console.log("data-cart-target:", (html.match(/data-cart-target/g) || []).length, "| wa.me:", (html.match(/wa\.me/g) || []).length);
  console.log("inline opacity:0:", (html.match(/style="opacity:0/g) || []).length);
  console.log("CountUp texts:", JSON.stringify(all(/<span class="tabular-nums[^"]*"[^>]*>([^<]*)<\/span>/g)));
  const ld = all(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
  console.log("ld+json blocks:", ld.length);
  ld.forEach((block, index) => {
    try { const json = JSON.parse(block); console.log(" ", index, json["@type"], Object.keys(json).join(",")); }
    catch { console.log(" ", index, "INVALID JSON"); }
  });
  console.log("raw </script> inside ld+json:", ld.some((block) => block.includes("</")));
});
```
قيم كل Gate في قسم 10.2. (لو الـ regex مش بيلقط attribute بصيغة معينة اقرا الـ HTML بعينك — السكربت أداة مساعدة مش حكم.)

---

**نهاية الملف.** أي تعارض بين الملف ده والواقع = وقف + سؤال المدير. ممنوع بدء يوم 4.

### HM+ — Manager additions (authorized 2026-11-18, Gate 3 scope, visual 🟡)

> **Status:** implemented in Gate 3 (frontend-only). Keep Gate 2 intact. No backend/DB/schema/migration/deploy changes. No fake API data. No new dependencies.

| # | Addition | Implementation | Notes / decisions |
| --- | --- | --- | --- |
| HM-L | Om Eman logo integration (Header + Footer, brand-consistent) | `public/logo.png` (existing provided asset, 1254×1254 PNG) rendered via `next/image` with preserved proportions (`object-contain`, explicit square intrinsic box). Header: compact mark beside brand name (`size-8`) keeping “أم إيمان” primary/visible; Footer: fuller brand mark (`size-16`) integrated with tagline/contact/social/copyright. No recreation/redraw/distortion. | Full source image used as mark (suitable at chosen sizes in this implementation). If a dedicated extracted jar-only asset is later provided for very small sizes, it can replace the same path/component without layout refactor. Works with token surfaces across themes and RTL/LTR layouts; final visual 🟡 owner review. |
| HM-BL | Branded loading experience (reusable jar fill) | `components/shared/BrandLoader.tsx` (reusable, `role="status"` + `aria-live="polite"` + `aria-busy`, accessible label from `common.loading`) with transparent jar + “أم إيمان” label and CSS herb/fill animation (`styles/animations.css`, reduced-motion disables via existing/added rules). Integrated via `app/[locale]/(Store)/loading.tsx` (Next.js route loading UI). | No generic spinner/static stock substitute; no extra deps. Can be reused in other appropriate loading states. Visual/motion 🟡 owner review. |
| HM-LS | LocaleSwitcher UI improvement (Header) | `components/ECommerce/Header/LocaleSwitcher.tsx`: Globe + current code (`AR/EN`) + chevron trigger, compact dropdown (`menu`/`menuitemradio`, `aria-checked`, selected check), smooth states, preserves pathname and query params (`useSearchParams`), correct RTL/LTR, keyboard/Escape/outside-close handling, theme-token styling, wrapped in `Suspense` in `StoreHeader`. Translation architecture/routing unchanged. | Functional locale switching preserved via `@/i18n/navigation` `Link` + `locale`; visual 🟡 owner review. |


---

### HM++ — Gate 3 follow-up additions (authorized 2026-11-18, frontend-only, visual 🟡)

#### HM-FB — Favicon & browser branding
- **Goal:** replace default Next.js favicon/branding with Om Eman identity using provided `public/logo.png`.
- **Implementation:** removed `app/favicon.ico`; generated `app/icon.png`, `app/apple-icon.png`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/icon-192.png`, `public/icon-512.png` from official logo (center-crop focused on jar/mark + high-quality resize, no redraw/distortion); added `app/manifest.ts` and locale metadata `icons`/`applicationName`/`appleWebApp` with brand name “أم إيمان”.
- **Limitation (documented):** provided asset is a full logo without a separate clear jar-only symbol; 16×16/32×32 recognizability may be limited vs a dedicated jar icon asset. No symbol invented/redesigned; replace with dedicated jar-only asset later for best result. Browser tab/bookmark/mobile icon checks pending owner visual approval (build/env prevented live verification).

#### HM-SC — Social media & contact system
- **Central config:** `lib/siteContact.ts` (documented). Set `SOCIAL_LINKS[platform]` to a real URL or `null` to hide; Footer renders valid platforms automatically (no Footer component edits). Supported: instagram, facebook, tiktok, youtube, x, snapchat, pinterest, threads, linkedin, telegram (extensible).
- **Initial state:** Instagram `https://www.instagram.com/om_eman.herbs/`; all others `null`. No invented URLs.
- **Rendering:** `components/shared/SocialIcon.tsx` lightweight inline SVGs (no deps), `FooterSocial` shows only valid URLs with consistent sizing/alignment/spacing, hover/focus, accessible labels, safe external links (`rel="noopener noreferrer"`), RTL/LTR and 4-theme compatible.
- **Contact:** centralized `CONTACT_PHONES` (`01033563649` primary, `01554491132` secondary) as `tel:` links with clear labels; not assumed WhatsApp. `WHATSAPP_CONTACT` explicit-only (default `null`); WhatsApp links/FAB/trust appear only when explicitly configured and normalized via approved M-8 Egyptian rules.
- **Constraints:** preserved Store settings integration (email/address/hours where present) and Gate 2 work; frontend-only; no fake data/deps.

#### HM-BT — BackToTop early visibility
- **Change:** `components/Animation/BackToTop.tsx` visibility threshold changed from `> window.innerHeight` to `> 280` so it appears after a small scroll down while preserving existing ring/progress/motion behavior (owner-approved feel).

---

## Gate 4 — implementation notes (2026-11-18, frontend-only, visual 🟡)

| Task | Status | Files | Notes |
| --- | --- | --- | --- |
| Logo refinement (Header/Footer) | ✅ code/check, 🟡 visual | `public/assets/brand/jar-mark.png` (derived crop of official `public/logo.png`, no redraw/distort), `lib/brandAssets.ts`, `components/ECommerce/Header/HeaderBrand.tsx`, `components/ECommerce/Footer/StoreFooter.tsx` | Header uses jar-mark only + “أم إيمان” text (compact, no large/full circular logo). Footer uses jar-mark only above tagline (cleaner than repeating brand name; name retained in copyright). Full logo not used in compact placements. Dedicated jar-only source asset can replace `jar-mark.png` later for best small-size clarity. |
| Card refinement (subtle motion + stable heights) | ✅ code/check, 🟡 visual | `styles/animations.css`, `components/shared/GlowCard.tsx`, `components/Card/{ProductCard,CategoryCard}.tsx` | Spotlight/BorderBeam intensity reduced (glow 14%/0.7, beam opacity 0.55, slightly softer hover lift) — animated concept preserved. Heights stabilized with reserved space/truncation (`line-clamp`, fixed min-heights, category/price-from placeholders, `h-full`) to avoid grow/shrink/shift across states; grid alignment preserved (2/3/4 cols, 4 themes, RTL/LTR). |
| D1 `/design` ProductCard demo | ✅ code/check, 🟡 visual (HTML live blocked by build) | `components/design/{demoProducts.ts,ProductCardRow.tsx,ComponentsRow.tsx}` (uses existing `messages/design.productCardTitle|productCardDemoNote|priceDemoNote`) | 5 labeled English-only fixtures isolated to `components/design`: discounted, multi-package, bundle, sold out, no-image; prices strings (`45.0000`,`60.0000`,`30`,`120.0000`,`150.0000`,`25.0000`,`18.0000`,`22.0000`); one Cloudinary demo image (`https://res.cloudinary.com/demo/image/upload/v1/sample.jpg`) others null; rotating beam via `useRotatingIndex`; demo notes visible. No imports outside design. `/design` page remains ≤30. |
| D2 Sitemap | ✅ code/check (live blocked by build) | `app/sitemap.ts` | `/ar` and `/en` entries, `alternates.languages {ar,en}` on both, `changeFrequency:"daily"`, `priority:1`, no `lastModified`/`new Date()`. `robots.ts` unchanged (design disallowed). |
| D3 Docs + checks | ✅ lint/check, ❌ build env blocker | `AGENTS.md`, `docs/PROGRESS.md`, `docs/DAY3_TASKS.md` | AGENTS updated (§3.1/3.2/3.4 tree, server data A-1..A-4, images A-6/StoreImage, z-index A-9, single `data-cart-target`, mock exception, lucide no brand icons, KS-1..3, asset rules). PROGRESS updated with Gate 4 task/carry-forward/asset/perf/verification. `npm run lint` EXIT 0, `npm run check` EXIT 0 (118 files, 116 keys/locale), `npm run build` EXIT 1 (recurring Turbopack `0xc0000142`, no `BUILD_ID`). |
| MANAGER ADDITION — asset architecture | ✅ prepared, no supplied assets invented | `public/assets/{hero,banners,categories,brand,themes,video}/`, `public/assets/README.md`, `lib/brandAssets.ts`, `components/ECommerce/Home/Hero.tsx` | Folder structure + descriptive naming + integration config created. `BRAND_ASSETS` lists only existing paths (`jarMark`,`fullLogo`) and `null` placeholders for hero desktop/mobile/poster and optional brand video (not marked available). Hero accepts optional separate desktop/mobile images and optional muted looping video with poster fallback, `preload="none"`, reduced-motion-safe fallback (`motion-reduce:hidden`/`motion-safe:hidden`), overlay for text contrast; lazy/below-fold unchanged elsewhere. No fake/final product photography added. |
| Carry-forwards (not marked complete) | 🟡/⛔ | — | **Hero asset integration:** integration-ready only (no supplied hero/banner/category/theme/video assets). **Favicon:** assets wired from official logo crop but dedicated jar-only symbol not supplied; 16×16/32×32 recognizability may be limited (🟡 owner review). **Social/Contact:** Instagram configured; others/WhatsApp remain explicit `null` until owner provides real data in `lib/siteContact.ts` (not invented). **B-1:** featured/products/search may ErrorState in unfixed envs (backend local fix unpublished). **Build:** Turbopack `0xc0000142` unresolved. |

- All new/changed visuals 🟡 pending owner browser review. Gates 1–3 preserved. No backend/DB/schema/migration/deploy changes, no commit/deploy, no Gate 5.
