# اليوم 8 — Storefront: الهوم + SEO الثقيل + إضافات المالك — تاسكات التخطيط والتفكيك

> آخر تحديث: 2026-11-26. **حالة المستند: DAY 8 SOURCE COMPLETE — PARTIAL HANDOFF — NOT SEALED — BROWSER MATRIX NOT TESTED — DAY 8 COMMIT `5a64603 End Day8`.** الرأس القديم «NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED» كان خاصًا بمرحلة التخطيط قبل تنفيذ Gates Day 8؛ كل Gates Day 8 G0–G7 موثّقة في `PROGRESS.md §50-§62`، وإصلاحات الإغلاق في `§63`. لا يُترجم هذا السطر إلى Day 9 أو Gate جديد.
> **المدير/المراجع:** Astra. **المنفّذ المقترح:** GLM. **المالك:** صاحب القرار في النطاق، صورة Hero/OG، تعديل Header/Footer، فتح كل Gate، والانتقال للي بعده.
> **تصحيح النطاق:** الغى المالك الصياغة السابقة التي حصرت اليوم 8 في Google UI/UX + Cart → Checkout. تلك إضافتان داخل اليوم وليستا نطاقًا بديلًا. `FRONTEND_TASKS_10_DAYS.md:225-234` «اليوم 8 — Storefront: الهوم + SEO الثقيل (مسار C)» هو الآن مصدر الحقيقة للنطاق الأساسي. أي ملاحظة تاريخية في هذا الملف أو في `PROGRESS.md` تقول إن هذا القسم «مرجع تاريخي فقط» تُقرأ الآن **مُستبدلة بقرار المالك الصريح هذا**؛ لا تُفتح Gate تلقائيًا.
> **توضيحات المالك الإضافية (2026-11-24):** صور Hero/OG حقيقية ومعتمدة فقط؛ FAQ صفحة حقيقية داخل اليوم 8؛ Wishlist UI preparation فقط بلا باك/حفظ/mutations؛ توسيع sitemap مؤجل صراحةً إلى `D15-SEO-SITEMAP`. هذه قرارات تخطيط فقط ولا تفتح Gate.
> **الخط المتبع:** `AGENTS.md` → `FRONTEND_TASKS_10_DAYS.md:31-43` §0.3 + `:225-234` اليوم 8 + `:238-256` اليوم 9/10 كحدود فصل → `PROGRESS.md §47/§48/§49` → `DAY7_TASKS.md §6/§7/§12` → `DESIGN_SYSTEM.md`.
> المسارات نسبية إلى `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. هذا ملف تخطيط ومراجعة Day 8 فقط؛ لا يفتح Gate ولا يسمح بكود/باك/DB/env/deps/commit. الـG0 القديمة في النسخة السابقة ملغاة؛ لا تعتبرها إذن تنفيذ. كل Gate جديدة محتاجة إذن مالك صريح باسمها.

---

## 0) قواعد التعامل — اقرأها الأول

1. قبل أي Gate: اقرأ `AGENTS.md`، `FRONTEND_TASKS_10_DAYS.md §0.3/يوم8/يوم9/يوم10`، `PROGRESS.md §47-§49`، `DAY7_TASKS.md §6/§7`، هذا الملف، والكود الحالي. تحقّق من إذن مالك باسم Gate بعينه، وافحص `git status`. أي تعارض عقد/قرار ⇒ STOP وسؤال المالك.
2. منفّذ واحد في وقت واحد: GLM يعرض قائمة الملفات ومسؤولية كل ملف، ينفّذ Gate واحدًا، يشغّل الفحوص، يراجع diff/untracked، يحدّث `PROGRESS.md`، ويسلّم ويقف. Astra يراجع ولا يعدّل بالتوازي.
3. حتى مع توصية Astra بالقبول، الانتقال للـGate التالية أو اعتماد الشكل/الحركة النهائي يحتاج موافقة المالك. لا يُترجم «كود جاهز» إلى «اعتماد بصري 🟢».
4. **الاركتيكتشر مجمد:** نفس App Router، ترتيب `NextIntlClientProvider > ReduxProvider > ThemeProvider > MotionProvider`، نفس `store/baseApi.ts` كبوابة API واحدة، `lib/server/*` لبيانات المتجر، `interface/`, `hooks/`, `components/ui/`, `components/shared/`, `components/Animation/`, `components/Skelton/`, `@/` imports، TypeScript strict. لا provider/store/api wrapper موازٍ، لا cart slice جديد، لا تغيير guest cart token/customer session keys، لا استيراد بين `ECommerce` و`Dashboard`.
5. **القرارات الموروثة مجمدة:** Day 7 `PARTIAL HANDOFF`؛ G4 acceptance مشروط؛ Google real auth `DEFERRED — NO IMPLEMENTATION AUTHORIZED`؛ فجوة قراءة سلة العميل بعد merge محجوبة؛ navbar `PROGRESS.md §48` منفّذ source-wise و`visual approval` معلّق؛ لا production seal. لا يُعاد فتح أي منها تلقائيًا.
6. الملفات ≤150 سطر هدفًا و200 حدًا أقصى، ملف لكل مسؤولية، الصفحة للتركيب فقط (هدف ≤30)، `I` للـinterfaces و`T` للـunions، لا `any` ولا casts لإسكات الأخطاء، لا نصوص مستخدم hard-coded، لا ألوان خام.
7. **ممنوع** dependencies، edits للباك/DB/migrations/seed/npm scripts/config/env/deployment، commit/push/deploy. وجود endpoint في الباك ليس إذنًا باستخدامه قبل مراجعة عقده الحالي.
8. الـUI states إلزامية: loading skeleton، error، empty، success، وfeedback. كل فشل يظهر رسالة مترجمة من `messages/` حسب `code`؛ لا raw message/stack/SQL. لا mock data لإخفاء نقص بيانات حقيقية بلا قرار مالك.
9. في كل تقرير افصل: **منفّذ في المصدر / فحص آلي بنتيجة / شوهد في متصفح / 🟢 اعتمده المالك / ⛔ محجوب أو لم يُختبر**. HTTP 200 مش acceptance، وAstra approval مش Owner acceptance.
10. الشكل والحركة بعد الهيكل والسلوك فقط، وبإذن منفصل `G5 — DAY 8 STYLE & MOTION`. لا حركة/تجميل في G1–G4؛ استخدم wrappers الموجودة و`prefers-reduced-motion`، Tailwind variables فقط.
11. مصادر العقود الحالية: `lib/server/storeFetch.ts`, `lib/server/storeQueries.ts`, `interface/store.ts`, `lib/seo.ts`, `lib/jsonld.ts`, `lib/brandAssets.ts`, `lib/siteContact.ts`، والكود الحالي لـHome/Header/Footer/Account/Cart/Checkout. أي تعارض بين أسماء endpoints القديمة والكود ⇒ الكود + قرارات المالك الحالية أعلى.
12. working tree موروث dirty من Days 1–7 والهيدر الجديد؛ لا reset/checkout/overwrite. الإضافات غير المعتمدة (`R-VIS`) تبقى للمراجعة، ولا تُصلح تلقائيًا.

---

## 1) الهدف والنطاق الكامل

### 1.1 المهام الأساسية من اليوم 8 الأصلي — إلزامية

- **D8-HOME:** `app/[locale]/(Store)/page.tsx` صفحة هوم SSR بالكامل، تتكون من Hero يعبّر عن براند أم إيمان، **صورة منتج/براند حقيقية ومعتمدة**، CTA «اتسوق دلوقتي»، لافتة COD والثقة، Banners، Featured Products، وCategories كروت صور من العقود الحالية فقط.
- **D8-SEO:** Organization JSON-LD + WebSite/SearchAction + BreadcrumbList حيث ينطبق؛ `generateMetadata` كامل، canonical، OpenGraph/Twitter، hreflang/alternates languages، وصورة OG مخصصة من **أصل براند معتمد** لا من default ولا من أصل متخيل.
- **D8-SHELL:** تدقيق Header/Footer الموجودين مقابل متطلبات اليوم 8 (بحث ظاهر، سلة، لغة، wishlist؛ ثقة: تليفون/واتساب/سوشال/روابط SEO للـstatic-pages والـFAQ). روابط FAQ الآن لها route حقيقي داخل اليوم 8؛ Wishlist صفحة UI preparation داخل اليوم 8. لا إعادة بناء ولا تعديل تلقائي؛ أي تعديل يحتاج نطاقًا مبررًا وإذنًا منفصلًا.
- **D8-STATES:** Skeletons + empty/error states من أول يوم لكل قسم بيانات.

### 1.2 إضافات المالك — داخل اليوم وليست بديلًا

- **D8-GOOGLE-UI:** تحويل زر Google من placeholder معطل إلى زر متاح للضغط يعرض رسالة محلية صادقة أن Google sign-in غير متاح حاليًا. بلا OAuth/GIS/client ID/callback/API/mutation/token/session/cart merge. Email authentication يظل كما هو.
- **D8-CHECKOUT-ENTRY:** CTA واضح من السلة إلى `/{locale}/checkout` يظهر فقط عند `loaded && !error && itemsCount > 0`، ويختفي في Loading/Empty/Error، باستخدام `CHECKOUT_HREF` و`Link` من `@/i18n/navigation` ونفس guest token الحالي بلا تغيير lifecycle أو storage keys.

### 1.3 قرارات المالك الجديدة — 2026-11-24

**Assets / Brand visuals**
- Hero يجب أن يستخدم **Om Eman brand/product visual حقيقيًا ومعتمدًا**؛ OG يجب أن يستخدم **أصل براند معتمد**.
- ممنوع توليد packaging/label/ادعاءات منتج وهمية، أو ربط مسار غير موجود، أو استخدام picsum/placeholder في صفحات المتجر الحقيقية.
- الأسماء المقترحة فقط (لا تعني أن الملف موجود أو معتمد):
  - `om-eman-home-hero.webp`
  - `om-eman-og-cover.webp`
  - `om-eman-banner-main.webp`
  - `category-herbs.webp`
  - `category-spices.webp`
  - `category-blends.webp`
  - `category-natural-products.webp`
  - `om-eman-faq-cover.webp`
  - `wishlist-empty.webp`
- **توفر الملف فعليًا وموافقة المالك عليه تُسجَّل منفصلًا** في سجل أصول/قرارات مستقل قبل أي ربط مصدر؛ الغياب = BLOCKER صريح لا مسار متخيل.

**FAQ — داخل اليوم 8**
- أضف صفحة `/[locale]/faq` محلية حقيقية بالعربية والإنجليزية بهيكل ترجمة متطابق.
- أضف روابط تنقل صحيحة من Footer الحالي باتباع conventions الموجودة، بلا إعادة بناء Footer تلقائيًا.
- المحتوى يقتصر على سياسات وحقائق أعمال **مؤكدة**؛ لا اختراع وعود شحن/دفع/إرجاع/توصيل.
- الصفحة تحتاج metadata مناسبة وbreadcrumb صالحًا؛ تُسجَّل حقوق المحتوى ومصدر التحقق قبل اعتمادها.

**Wishlist — UI preparation only**
- أضف صفحة `/[locale]/wishlist` محلية مع empty state ورسالة صادقة أن القائمة غير مفعّلة حاليًا.
- أضف مدخل تنقل مناسب باتباع Header/Footer conventions الموجودة، بلا إعادة بناء تلقائية.
- ممنوع endpoints متخيلة، persistence، add/remove mutations، أو الادعاء بوظيفة wishlist فعلية؛ الوظيفة الحقيقية DEFERRED حتى عقد باك معتمد.

**Sitemap — مؤجل إلى اليوم 15**
- لا توسيع sitemap في اليوم 8 إطلاقًا.
- أُنشئ `D15-SEO-SITEMAP` ك deferred task في §6؛ اليوم 15 هو مراجعة العناصر المؤجلة والاركتيكتشر وجاهزية الإنتاج.

### 1.4 داخل النطاق بعد إذن Gates
- تدقيق وسد فجوات الهوم الحقيقية فقط، وSEO/metadata/structured data، والصفحتان FAQ/Wishlist كـUI preparation، ورسائل محلية جديدة، وحركة خفيفة منفصلة، وأدلة browser/visual مشروطة.
- استخدام `getSettings`, `getBanners`, `getCategories`, `getFeaturedProducts` من `lib/server/storeQueries.ts` وما يقابلها من عقود فعلية؛ لا أسماء `/api/*` قديمة إلا كمرجع تاريخي.

### 1.5 خارج النطاق / موعده
- **ممنوع:** Google حقيقي، Dashboard، إعادة فتح Day 7/Navbar، production seal، deploy، Cloudinary Private/Signed Delivery، باك/DB/env/deps/commit.
- **مؤجل صراحةً:** توسيع sitemap إلى `D15-SEO-SITEMAP`؛ لا تعديل `app/sitemap.ts` في اليوم 8.
- **محجوب حتى إذن/بيانات/عقد:** صورة Hero وصورة OG المعتمدة، wishlist الفعلية، static-pages أخرى، authenticated cart merge، browser/Lighthouse environment.
- أي Backend dependency أو API gap يُسجَّل blocker؛ لا يُخترع endpoint ولا mock بديل.

### 1.6 KS المقترحة
- **KS-11:** هوم SSR مكتمل الهيكل والبيانات الحقيقية المتاحة، مع Hero صادق وStates واضحة؛ صورة المنتج الحقيقية إما موفرة ومعتمدة أو BLOCKED.
- **KS-12:** SEO homepage كامل: metadata + JSON-LD + hreflang + OG/Twitter + صورة OG معتمدة أو BLOCKED عند غياب الأصل.
- **KS-13:** زر Google UI-only صادق بلا مصادقة وهمية.
- **KS-14:** CTA من السلة إلى checkout بالشروط الصحيحة وبنفس guest token.
- **KS-15:** صفحة FAQ محلية حقيقية + Footer links + metadata/breadcrumb + محتوى موثّق فقط.
- **KS-16:** صفحة Wishlist UI preparation + تنقل مناسب + empty state صادق، بلا persistence أو mutations أو ادعاء وظيفة فعلية.

---

## 2) مقارنة الخطة الأصلية بالحالة الحالية والفجوات

| البند الأصلي | الحالة الحالية | الفجوة/القرار |
| --- | --- | --- |
| `app/[locale]/(Store)/page.tsx` SSR | موجود، رقيق، يستدعي `HomeSections` (`page.tsx:8-12`) | تحقّق فقط؛ لا إعادة بناء. |
| Hero براند + صورة منتج حقيقية + CTA + COD | `Hero.tsx` و`HomeTrust.tsx` موجودان؛ CTA إلى `#categories`؛ COD في trust strip منفصل | المالك يشترط أصلاً حقيقيًا معتمدًا؛ الأسماء المقترحة في §1.3؛ `lib/brandAssets.ts` hero/video/posters `null` ⇒ BLOCKER حتى توفر الأصل وتسجيل اعتماده؛ لا صورة متخيلة. |
| Banners / Featured / Categories من APIs | منفذة عبر `lib/server/storeQueries.ts` مع Suspense/skeletons | أسماء endpoints القديمة مرجع تاريخي؛ Empty في Banner/Featured يعيد `null` ⇒ فجوة States. |
| Animation stagger + hover | CSS `animate-fade-up` + Stagger + BorderBeam + hover موجودة | Gate G5 يضبط الحركة فقط بعد الهيكل؛ لا مكتبات جديدة. |
| Organization + WebSite(SearchAction) | `StoreJsonLd.tsx` + `lib/jsonld.ts` منصوبان في `(Store)/layout.tsx` | تحقق وتأكيد فقط. |
| BreadcrumbList | يوجد في Catalog/Product | لا يوجد breadcrumb في الهوم؛ «حسب ما ينطبق» ⇒ لا يُضاف وهميًا. |
| generateMetadata/hreflang/ canonical/OG/Twitter | `buildMetadata` موجود وصفحات أخرى تستخدمه؛ لا `metadata.ts` للهوم | أضف homepage metadata عبر النمط الحالي. |
| OG image مخصصة | لا `opengraph-image` / `twitter-image` | المالك يشترط أصلاً معتمدًا؛ الاسم المقترح `om-eman-og-cover.webp`؛ BLOCKER حتى توفر الأصل وتسجيل اعتماده. |
| Header: search/cart/language/wishlist | search/cart/language/theme/mobile nav موجودة؛ wishlist غير موجودة | Wishlist UI preparation داخل اليوم 8 (KS-16)؛ الوظيفة/الحفظ/mutations BLOCKED بلا عقد باك؛ أي تعديل Header يحتاج إذن منفصل. |
| Footer: phone/WhatsApp/social/SEO links/static/FAQ | phone/WhatsApp/social موجودة؛ FAQ/static links غير موجودة | FAQ الآن صفحة يوم 8 حقيقية (KS-15) مع روابط Footer صحيحة؛ static-pages الأخرى تبقى BLOCKED حتى وجود routes/mحتوى موثّق. |
| Sitemap/robots | `app/sitemap.ts` locale roots فقط؛ robots يمنع design | **مؤجل صراحةً إلى `D15-SEO-SITEMAP`**؛ لا تعديل sitemap في اليوم 8 ولا روابط متخيلة. |
| Google button | placeholder معطل في `GoogleSignInButton.tsx` | G3 يحوله إلى UI-only صادق. |
| Cart → Checkout | `CHECKOUT_HREF` موجود لكن لا رابط منه؛ `CartSummary` بلا CTA | G4 يضيف CTA مشروطًا. |
| Browser/visual/Lighthouse | غير مختبر في `PROGRESS.md §47` | G6 مشروط ببيئة مأذونة؛ وإلا NOT TESTED. |

**نتيجة المقارنة:** أغلب هيكل الهوم وJSON-LD الأساسي موجود فعليًا، لكن اليوم 8 لا يُلغى؛ يُعاد تأطيره كـ«تحقق وسد فجوات حقيقية + إكمال SEO الناقص + الإضافتان». لا يُعاد بناء ما يعمل، ولا يُدعى اكتمال ما هو BLOCKED.

---

## 3) العقود والقرارات الحاكمة

| المصدر | ما يُستخدم |
| --- | --- |
| `lib/server/storeQueries.ts` | `getSettings`, `getBanners`, `getCategories`, `getFeaturedProducts`؛ `"use cache"` + `cacheLife` + `cacheTag` قائمة. |
| `lib/server/storeFetch.ts` | `TStoreResult` لا يرمي؛ القيم تُقرأ من الرد فقط. |
| `interface/store.ts` | بنود البانر/القسم/المنتج؛ لا DTO موازٍ. |
| `lib/seo.ts` | `buildMetadata` للcanonical/hreflang/OG/Twitter؛ لا بناء metadata يدوي موازٍ. |
| `lib/jsonld.ts`, `components/shared/JsonLd.tsx` | Organization/WebSite/Breadcrumb/Product builders؛ script آمن. |
| `lib/brandAssets.ts`, `public/assets/*` | المسارات الحقيقية فقط؛ لا اختراع hero/product/OG images. |
| `lib/siteContact.ts` | تليفون/واتساب/سوشال مُعدّة فقط؛ لا روابط وهمية. |
| `lib/routes.ts` | `CHECKOUT_HREF`, `PRODUCTS_HREF`, `CART_HREF`؛ لا hardcoded locale paths. |
| `messages/{ar,en}.json` | كل نص مستخدم، بما فيها رسالة Google غير المتاحة وCTA checkout. |

**قرارات مطلوبة في G0:** (أ) تسجيل توفر/اعتماد أصول Hero/OG/Banners/Category/FAQ/Wishlist المقترحة في سجل منفصل قبل أي ربط مصدر؛ (ب) تأكيد مصادر حقائق FAQ وصياغتها ar/en؛ (ج) تأكيد خط تنقل Wishlist UI-only دون وظيفة؛ (د) هل يتوفر browser/Lighthouse environment؛ (هـ) الإبقاء على Day 7 blockers مجمدة؛ (و) تسجيل تأجيل sitemap إلى `D15-SEO-SITEMAP` بلا تعديل اليوم 8.

---

## 4) خريطة إعادة الاستخدام

| الحاجة | استخدم | لا تضف |
| --- | --- | --- |
| هوم SSR | `page.tsx` + `HomeSections` + Suspense skeletons | page ضخمة، fetch مباشر، client boundary كاملة |
| صور/بانرات | `StoreImage`, `lib/brandAssets.ts`, `next/image` loader الحالي | raw `<img>`, مسارات متخيلة |
| بيانات | `lib/server/storeQueries.ts` | RTK Query للمتجر، fetch في components |
| SEO | `buildMetadata`, `JsonLd`, `lib/jsonld.ts` | Helmet/metadata مكرر |
| رابط checkout | `Link` من `@/i18n/navigation` + `CHECKOUT_HREF` + `buttonVariants()` | `<a>`, `next/link`, `router.push` بلا سبب |
| زر Google | `GoogleSignInButton.tsx`, `Button`, sonner الموجود | GIS/OAuth/env/mutation |
| حركة | `m.*`, `FadeIn`, `Stagger`, `animate-fade-up`, reduced motion | GSAP/Lottie/Three/Sass/hex/rgb |
| أخطاء/فراغ | `ErrorState`, `EmptyState`, Skeletons | شاشة فارغة بلا رسالة |

---

## 5) جرد الملفات المتوقع — تقديري قبل إذن Gates

### 5.1 G1 — Homepage structure/data
| الملف | المسؤولية |
| --- | --- |
| `app/[locale]/(Store)/page.tsx` | تركيب رقيق فقط؛ تحقق SSR. |
| `components/ECommerce/Home/HomeSections.tsx` | ترتيب الأقسام وSuspense fallbacks. |
| `components/ECommerce/Home/Hero.tsx` | محتوى Hero وCTA وصورة المنتج عند توفرها. |
| `components/ECommerce/Home/HomeTrust.tsx` | COD/ثقة/شحن/واتساب المُعدّ. |
| `components/ECommerce/Home/{BannerSection,BannerSlider,CategoriesSection,FeaturedSection,FeaturedGrid}.tsx` | مراجعة البيانات/الحالات لا إعادة بناء. |
| `components/Skelton/{BannerSkeleton,CategoriesSkeleton,FeaturedSkeleton}.tsx` | skeletons مطابقة. |
| `components/shared/{EmptyState,ErrorState}.tsx` | حالات صريحة بدل `null`. |
| `lib/brandAssets.ts`, `public/assets/brand/*` | صورة حقيقية فقط عند التوفير. |
| `messages/{ar,en}.json` | نصوص Hero/Empty/Error الجديدة. |

### 5.2 G2 — SEO/metadata/structured data
| الملف | المسؤولية |
| --- | --- |
| `app/[locale]/(Store)/metadata.ts` | `generateMetadata` للهوم عبر `buildMetadata`. |
| `components/ECommerce/StoreJsonLd.tsx`, `lib/jsonld.ts` | تحقق Organization/WebSite/SearchAction/Breadcrumb حسب الصفحة. |
| `app/[locale]/(Store)/layout.tsx` | لا تعديل إلا لإضافة JSON-LD/metadata لازمة بمسوّغ. |
| `app/[locale]/(Store)/opengraph-image.tsx`, `twitter-image.tsx` | صورة OG مخصصة عند اعتماد أصل. |
| `lib/brandAssets.ts`, `public/assets/brand/*` | أصل الصورة المعتمد فقط؛ لا مسار متخيل. |
| `app/sitemap.ts`, `app/robots.ts` | **خارج Day 8**؛ أُجّل إلى `D15-SEO-SITEMAP`. |

### 5.3 G0/G6/G7 — تدقيق Shell only
| الملف | المسؤولية |
| --- | --- |
| `components/ECommerce/Header/{StoreHeader,SearchForm,HeaderActions,CartLink,LocaleSwitcher}.tsx` | تدقيق search/cart/language؛ لا تعديل بلا إذن. |
| `components/ECommerce/Footer/{FooterNav,FooterContact,FooterSocial}.tsx`, `lib/siteContact.ts` | تدقيق ثقة/روابط؛ لا تعديل بلا إذن. |

### 5.4 G3 — Google UI/UX
| الملف | المسؤولية |
| --- | --- |
| `components/ECommerce/Account/GoogleSignInButton.tsx` | زر متاح + feedback محلي صادق. |
| `messages/{ar,en}.json` | `account.google.*` keys متطابقة. |

### 5.5 G4 — Cart → Checkout
| الملف | المسؤولية |
| --- | --- |
| `components/ECommerce/Cart/CartCheckoutLink.tsx` | رابط CTA واحد إلى `CHECKOUT_HREF`. |
| `components/ECommerce/Cart/CartSummary.tsx` | عرض CTA كـslot دون token/router. |
| `components/ECommerce/Cart/CartDrawer.tsx` | تمرير شرط العرض فقط. |
| `messages/{ar,en}.json` | `cart.checkout.*` متطابقة. |

### 5.6 G4A — FAQ & Wishlist UI Preparation
| الملف | المسؤولية |
| --- | --- |
| `app/[locale]/(Store)/faq/page.tsx`, `metadata.ts` | صفحة FAQ محلية رقيقة + metadata. |
| `components/ECommerce/FAQ/*` | أقسام FAQ ومحتوى موثّق فقط؛ لا وعود متخيلة. |
| `app/[locale]/(Store)/wishlist/page.tsx`, `metadata.ts` | صفحة Wishlist UI preparation رقيقة + metadata. |
| `components/ECommerce/Wishlist/*` | empty state ورسالة صادقة؛ لا persistence/mutations. |
| `components/ECommerce/Footer/FooterNav.tsx`, `components/ECommerce/Header/*` | روابط تنقل صحيحة باتباع conventions الحالية وبإذن Gate. |
| `lib/jsonld.ts`, `components/shared/JsonLd.tsx` | Breadcrumb/FAQ structured data حيث ينطبق وبعد تحقق المحتوى. |
| `messages/{ar,en}.json` | محتوى ar/en بهيكل متطابق. |
| `lib/brandAssets.ts`, `public/assets/*` | `om-eman-faq-cover.webp`, `wishlist-empty.webp` عند التوفر والاعتماد فقط. |

### 5.7 G5 — Style & Motion
| الملف | المسؤولية |
| --- | --- |
| مكوّنات G1/G3/G4/G4A المعنية | hover/press/stagger خفيف. |
| `styles/animations.css` | keyframe دلالي واحد فقط إن لزم. |

### 5.8 الوثائق
| الملف | المسؤولية |
| --- | --- |
| `docs/PROGRESS.md` | سجل Gates/أدلة/Astra/STOP وسجل الأصول/الاعتماد. |
| `docs/DAY8_TASKS.md` | هذا الملف؛ تحديث الحالة والقرارات. |

---

## 6) سجل مؤجلات وبلوكات — يُقرأ في G0 ولا يُفتح تلقائيًا

> `DAY7_TASKS.md §6` و`PROGRESS.md §47.9` هما الحاكمان لكل مؤجلات Day 6/7. الجدول أدناه يضيف Day 8 فقط ولا يُلغي بندًا موروثًا.

| ID | البند | الحالة | القرار المقترح |
| --- | --- | --- | --- |
| D8-ASSET-REGISTER | توفر/اعتماد أصول العلامة المقترحة | REQUIRED BEFORE ASSET WIRING | سجّل التوفر الفعلي وموافقة المالك منفصلًا؛ الأسماء في §1.3 فقط؛ لا ربط بلا أصل معتمد. |
| D8-HERO-ASSET | صورة Om Eman حقيقية للـHero | BLOCKED حتى توفر أصل معتمد | `om-eman-home-hero.webp` مقترح فقط؛ لا packaging/label/ادعاء متخيل. |
| D8-OG-ASSET | OG image مخصصة | BLOCKED حتى توفر أصل معتمد | `om-eman-og-cover.webp` مقترح فقط؛ لا default ولا أصل وهمي. |
| D8-BANNER-ASSETS | صور Banners/Categories/FAQ/Wishlist | BLOCKED حتى التوفر والاعتماد | الأسماء المقترحة في §1.3؛ الاستخدام مشروط بسجل الأصول. |
| D8-FAQ | صفحة `/[locale]/faq` + Footer links + metadata/breadcrumb | IN DAY 8 SCOPE | KS-15؛ محتوى موثّق فقط؛ ar/en متطابقان. |
| D8-WISHLIST | صفحة `/[locale]/wishlist` UI preparation | IN DAY 8 SCOPE | KS-16؛ empty state صادق؛ الوظيفة/Favorites API DEFERRED. |
| D8-WISHLIST-API | حفظ/إضافة/حذف wishlist حقيقي | DEFERRED | لا endpoint متخيل ولا persistence قبل عقد باك معتمد. |
| D8-SITEMAP | product/category URLs في sitemap | DEFERRED TO D15 | `D15-SEO-SITEMAP`؛ لا تعديل `app/sitemap.ts` في اليوم 8. |
| D8-GOOGLE-REAL | Google OAuth/client ID | DEFERRED | لا implementation. |
| D8-MERGE-READ | قراءة سلة العميل بعد merge | BLOCKED من Day 7 | لا يُفتح. |
| D8-BROWSER | Browser/Visual/Lighthouse | NOT TESTED | G6 مشروط ببيئة مأذونة. |
| D8-OWNER-VIS | Owner visual approval | PENDING | 🟡 حتى اعتماد المالك. |
| D8-SEAL | Production readiness | NOT READY / NOT SEALED | لا ختم ولا deploy. |
| D8-DASHBOARD | Dashboard القديم | مرجع تاريخي | لا يُفتح. |
| D15-SEO-SITEMAP | sitemap ديناميكي + مراجعة SEO نهائية | DEFERRED TO DAY 15 | انظر المواصفة الكاملة أدناه؛ يوم 15 يشمل مؤجلات/اركتيكتشر/جاهزية إنتاج. |

**D15-SEO-SITEMAP — deferred task specification**
- **الهدف:** sitemap ديناميكي مبني على بيانات حقيقية من بنية البيانات/API الحالية، لا URLs مكتوبة يدويًا ولا mock data.
- **البيانات:** products/categories **المنشورة فقط** وpublic/indexable؛ استبعاد unpublished/private/non-indexable resources.
- **الروابط:** public routes فعلية فقط، مع locale/alternates صحيحة؛ لا مسار متخيل ولا رابط غير مُخدم.
- **caching/revalidation:** تصميم caching وإعادة تحقق تجعل المنتجات الجديدة المنشورة تظهر تلقائيًا بلا تعديل يدوي لقائمة URLs.
- **مراجعة SEO مرافقة:** `robots.ts`، canonical URLs، hreflang، وmetadata consistency.
- **نطاق اليوم 15 الإضافي:** المراجعة النهائية لكل العناصر المؤجلة، مراجعة الاركتيكتشر، وجاهزية الإنتاج؛ لا يعني هذا فتح Day 15 الآن.

---

## 7) خطة الـGates — 12 حقل لكل Gate

> الـG0 القديمة ملغاة. كل Gate أدناه تقف وحدها؛ جدول §5 متوقّع، لا يُنشأ شيء قبل إذن هذه الـGate بعينها.

### Gate 0 — Pre-flight / Baseline / Scope Lock

1. **ID/الهدف:** G0؛ تثبيت النطاق الكامل بعد التصحيح، وفصل سلامة البيئة والمؤجلات عن implementation.
2. **الاعتماد/الإذن:** إذن مالك مستقل باسم `G0 — DAY 8 PRE-FLIGHT / SCOPE LOCK`؛ صفر تعديل مصدر.
3. **النطاق:** قراءة `AGENTS`، `FRONTEND_TASKS §0.3/يوم8/يوم9/يوم10`، `PROGRESS §47-§49`، `DAY7 §6/§7`، هذا الملف، كود Home/SEO/FAQ/Wishlist/Header/Footer/Auth/Cart/Checkout، `git status`، وآخر check/build.
4. **خارج النطاق:** لا homepage edits، لا SEO edits، لا Google، لا CTA، لا حركة، لا إصلاح blockers، لا باك/DB/env.
5. **الملفات المتوقعة:** `PROGRESS.md` فقط لتسجيل الأدلة/القرارات.
6. **المسؤولية:** وثيقة فقط؛ لا ملفات مصدر جديدة.
7. **العقود/القرارات:** العقود في §3؛ سجل توفر/اعتماد الأصول، مصادر حقائق FAQ، نطاق Wishlist UI-only، تأجيل sitemap إلى `D15-SEO-SITEMAP`، browser environment، وتجميد Day 7 blockers.
8. **الفحوص:** سجّل أوامر القراءة منفصلة؛ لا tokens/أسرار؛ HTTP 200 ليس acceptance.
9. **المتصفح:** لا شاشة Day 8 هنا؛ سجّل توفر الأداة/قيودها فقط.
10. **البيانات والحماية:** لا صور/بيانات حقيقية في التقرير بلا إذن؛ لا استخدام endpoint قبل مراجعة عقده.
11. **DoD:** baseline مؤرّخ + نطاق كامل مثبّت + مؤجلات موزّعة + Blockers ظاهرة + ملغاة G0 القديمة موثّقة.
12. **STOP:** `⛔ STOP — Gate 0`

### Gate 1 — Homepage structure and data integration

1. **ID/الهدف:** G1؛ تحقيق KS-11 بسد فجوات الهوم الحقيقية فقط على البيانات الحالية.
2. **الاعتماد/الإذن:** G0 مقبول + إذن `G1 — DAY 8 HOMEPAGE STRUCTURE & DATA` + قرار G0 بتسجيل توفر/اعتماد صورة Hero في `D8-ASSET-REGISTER`.
3. **النطاق:** تدقيق/استكمال Hero والثقة والـBanners وFeatured وCategories وSkeletons وEmpty/Error؛ لا إعادة بناء ما يعمل.
4. **خارج النطاق:** SEO/metadata، Google، Cart CTA، Style/Motion، Header/Footer تعديل، mock data، new API/contract.
5. **الملفات المتوقعة:** §5.1.
6. **المسؤولية:** الصفحة تركيب فقط؛ كل قسم مسؤول عن بياناته عبر `lib/server/storeQueries.ts`؛ الصور من `lib/brandAssets.ts` فقط؛ Empty/Error صريحان بدل `null`.
7. **العقود:** `TStoreResult`؛ decimal/price كما هو؛ لا أسماء `/api/*` قديمة؛ لا hero متخيل عند غياب الأصل.
8. **الفحوص:** lint/check/tsc/diff/build منفصلين؛ Network/Turbopack لا أخطاء؛ لا استجابة وهمية عند فشل API.
9. **المتصفح:** RTL/LTR، 360px/desktop، 4 ثيمات، skeleton/empty/error/loaded، focus-visible، reduced motion؛ لو لا أداة ⇒ NOT TESTED.
10. **البيانات والحماية:** لا منتجات/صور/أسعار مختلقة؛ لا لقطة فيها بيانات حساسة؛ صورة Hero BLOCKED إن لم تُوفَّر.
11. **DoD:** KS-11 source-complete أو PARTIAL مع BLOCKER صورة Hero صريح؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 1`

### Gate 2 — SEO and metadata / structured data

1. **ID/الهدف:** G2؛ تحقيق KS-12 دون كسر SSR/SEO architecture الحالية.
2. **الاعتماد/الإذن:** G1 مقبول + إذن `G2 — DAY 8 SEO & STRUCTURED DATA` + قرار G0 بتسجيل توفر/اعتماد صورة OG في `D8-ASSET-REGISTER`؛ sitemap مؤجل إلى `D15-SEO-SITEMAP`.
3. **النطاق:** homepage `generateMetadata`، canonical/hreflang/OG/Twitter، مراجعة Organization/WebSite/SearchAction، Breadcrumb حيث ينطبق، وصورة OG عند توفر الأصل.
4. **خارج النطاق:** محتوى هوم جديد، FAQ routes/metadata (G4A)، Header/Footer edits، Google، Cart CTA، تعديل sitemap (D15)، مكتبات SEO جديدة.
5. **الملفات المتوقعة:** §5.2.
6. **المسؤولية:** `buildMetadata` و`JsonLd` هما المصدر؛ لا metadata يدوية موازية؛ لا breadcrumb وهمي في الهوم؛ الصورة من أصل معتمد فقط.
7. **العقود:** `NEXT_PUBLIC_SITE_URL`؛ locale alternates؛ لا token/بريد/بيانات عميل في structured data.
8. **الفحوص:** lint/check/tsc/diff/build؛ فحص HTML_source للـcanonical/hreflang/OG/Twitter وJSON-LD صالح بلا escaping problems.
9. **المتصفح:** SEO HTML/CWV/Lighthouse في بيئة مأذونة فقط؛ وإلا NOT TESTED وHTTP 200 غير كافٍ.
10. **البيانات والحماية:** لا OG مخصصة بلا أصل معتمد؛ لا sitemap links وهمية ولا تعديل sitemap في اليوم 8؛ لا كشف مسارات خاصة.
11. **DoD:** KS-12 source-complete أو PARTIAL مع BLOCKER صورة OG؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 2`

### Gate 3 — Google UI/UX

1. **ID/الهدف:** G3؛ تحقيق KS-13: زر Google متاح وصادق بلا مصادقة وهمية.
2. **الاعتماد/الإذن:** G0 مقبول + إذن `G3 — DAY 8 GOOGLE UI/UX`؛ لا يحتاج نتائج G1/G2، لكن يُنفَّذ بعد تثبيت الهيكل.
3. **النطاق:** `GoogleSignInButton.tsx` ورسائل `account.google.*`؛ الضغط يُظهر رسالة محلية أن Google sign-in غير متاح حاليًا.
4. **خارج النطاق:** OAuth/GIS/client ID/secret/callback/API/mutation/token/session/cart merge؛ تغيير LoginForm أو email auth.
5. **الملفات المتوقعة:** §5.4.
6. **المسؤولية:** لا `disabled` ميت، لا وهم نجاح، لا تحويل لصفحة؛ feedback عبر sonner الموجود أو inline region مترجم؛ Email flow كما هو.
7. **العقود:** صفر request شبكة؛ صفر تغيير `customerSession`/`cartToken`؛ الرسالة من `messages/` فقط.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network فارغ عند الضغط؛ لا toast نجاح ولا توكن.
9. **المتصفح:** الضغط، focus-visible، RTL/LTR، 360px/desktop، 4 ثيمات، reduced motion؛ لو لا أداة ⇒ NOT TESTED.
10. **البيانات والحماية:** لا credential/بريد/توكن في التقارير؛ لا سجلات حساسة.
11. **DoD:** KS-13 source-complete؛ Astra review؛ لا ادعاء بتسجيل Google.
12. **STOP:** `⛔ STOP — Gate 3`

### Gate 4 — Cart → Checkout Entry

1. **ID/الهدف:** G4؛ تحقيق KS-14 بـCTA منطقي من السلة إلى checkout.
2. **الاعتماد/الإذن:** G0 مقبول + إذن `G4 — DAY 8 CHECKOUT ENTRY`؛ لا يعتمد على Google حقيقي.
3. **النطاق:** `CartCheckoutLink.tsx`, `CartSummary.tsx`, `CartDrawer.tsx`, `cart.checkout.*`.
4. **خارج النطاق:** checkout internals، cart mutations، token جديد، cart slice، Storage keys، فجوة merge-read.
5. **الملفات المتوقعة:** §5.5.
6. **المسؤولية:** `CartDrawer` يمرّر حالة العرض فقط؛ `CartSummary` عرضي؛ الرابط يستخدم `Link` + `CHECKOUT_HREF` + `buttonVariants()`؛ لا `<button>` يقلد الرابط.
7. **العقود:** `loaded && !error && itemsCount > 0`؛ checkout يقرأ نفس guest token؛ لا إجمالي أو سلة مختلقة.
8. **الفحوص:** lint/check/tsc/diff/build؛ لا طلب إضافي عند الضغط سوى تنقل الصفحة؛ لا تغيير cart token.
9. **المتصفح:** loaded/empty/loading/error، 360px/desktop، RTL/LTR، 4 ثيمات، focus-visible؛ لو لا أداة ⇒ NOT TESTED.
10. **البيانات والحماية:** لا token/عنوان/بيانات عميل في screenshots؛ لا لقطة لسلة مزيفة.
11. **DoD:** KS-14 source-complete؛ Astra review؛ فجوة سلة العميل بعد merge موثّقة لا مُخفاة.
12. **STOP:** `⛔ STOP — Gate 4`

### Gate 4A — FAQ & Wishlist UI Preparation

1. **ID/الهدف:** G4A؛ تحقيق KS-15 وKS-16 بصفحتين محليتين صادقتين وبلا واجهة خلفية متخيلة.
2. **الاعتماد/الإذن:** G0 مقبول + G2 مقبول source-wise لاتفاقيات metadata/breadcrumb + إذن مستقل باسم `G4A — DAY 8 FAQ & WISHLIST UI PREPARATION`. لا يُفتح تلقائيًا بقرار inclusion.
3. **النطاق:** `/[locale]/faq` بمحتوى موثّق وmetadata/breadcrumb؛ `/[locale]/wishlist` كـUI preparation بempty state؛ روابط Footer/Header conventions؛ مفاتيح `messages/{ar,en}.json`؛ أصول FAQ/Wishlist عند التوفر والاعتماد فقط.
4. **خارج النطاق:** FAQ backend/CMS API، wishlist persistence/mutations/endpoints، ادعاء وظيفة فعلية، وعود شحن/دفع/إرجاع غير موثقة، sitemap expansion، production seal.
5. **الملفات المتوقعة:** §5.6.
6. **المسؤولية:** الصفحات رقيقة؛ FAQ sections منفصلة عن الـpage؛ Wishlist empty state منفصل؛ الروابط تستخدم `@/i18n/navigation` و`lib/routes.ts` أو قيمًا حقيقية معتمدة فقط.
7. **العقود/القرارات:** محتوى FAQ من مصادر أعمال موثّقة؛ ar/en بنفس الهيكل؛ wishlist DEFERRED؛ الأصول مسجّلة في D8-ASSET-REGISTER قبل الاستخدام.
8. **الفحوص:** lint/check/tsc/diff/build منفصلين؛ parity 477+ مفاتيح؛ لا Arabic hard-coded؛ لا endpoint/request جديد لواجهة Wishlist.
9. **المتصفح:** FAQ/wishlist في ar/en، RTL/LTR، 360px/desktop، 4 ثيمات، focus/breadcrumb/empty state؛ لو لا أداة ⇒ NOT TESTED.
10. **البيانات والحماية:** لا سياسات متخيلة، لا بيانات عملاء، لا صور غير معتمدة، لا تلميح إلى ميزة wishlist فاعلة.
11. **DoD:** KS-15 وKS-16 source-complete أو PARTIAL مع BLOCKERS ظاهرة؛ Astra review؛ لا ترقية 🟡 تلقائيًا.
12. **STOP:** `⛔ STOP — Gate 4A`

### Gate 5 — Style & Motion

1. **ID/الهدف:** G5؛ ضبط إحساس الهوم/Google/CTA بعد ثبات الهيكل والسلوك.
2. **الاعتماد/الإذن:** G1–G4 وG4A مقبولة + إذن `G5 — DAY 8 STYLE & MOTION` + مراجعة شكل مع المالك.
3. **النطاق:** stagger هادئ، hover على كروت الهوم، press/hover لزر Google وCTA checkout، حالات FAQ/Wishlist، تناسق مع `animate-fade-up`.
4. **خارج النطاق:** مكتبات جديدة، GSAP/Lottie/Three، Sass، hex/rgb، حركة تعيق الفهم، تعديل Header/Footer أو بقية الصفحات.
5. **الملفات المتوقعة:** §5.7.
6. **المسؤولية:** `m.*` والـwrappers الموجودة أولًا؛ transform/opacity غالبًا؛ `prefers-reduced-motion` إلزامي؛ لا حركة تخفي States أو رسالة Google أو CTA.
7. **العقود:** الحركة لا تُغيّر بيانات/روابط/رسائل/حالات التحميل؛ لا تأخير يمنع focus أو التنقل.
8. **الفحوص:** lint/check/tsc/diff/build + حجم الملفات + مراجعة reduced-motion source-wise.
9. **المتصفح:** مصفوفة كاملة مع reduced-motion، 360px/desktop، 4 ثيمات، RTL/LTR، لا overflow ولا وميض hydration.
10. **اعتماد المالك:** الشكل النهائي 🟡 حتى يعتمده؛ لا ترقية تلقائية إلى 🟢.
11. **DoD:** الحركة تحسّن الفهم ولا تكذب السلوك؛ لا تغيير عقود؛ انحرافات النمط موثّقة.
12. **STOP:** `⛔ STOP — Gate 5`

### Gate 6 — Browser / Visual Evidence

1. **ID/الهدف:** G6؛ تحويل الملاحظة البصرية من NOT TESTED إلى دليل فعلي إن وُجدت أداة/بيئة مأذونة.
2. **الاعتماد/الإذن:** G1–G5 وG4A مقبولة + إذن `G6 — DAY 8 BROWSER EVIDENCE` + بيئة مأذونة؛ غيابها blocker لا فشل كود.
3. **النطاق:** هوم (كل States)، SEO HTML، FAQ/wishlist، زر Google، cart CTA، تنقل checkout، مصفوفة ar/en و4 ثيمات و360px/desktop وfocus وreduced motion.
4. **خارج النطاق:** API writes، Google حقيقي، authenticated merge، production deployment، تعديل الكود لإخفاء عيب.
5. **الملفات المتوقعة:** `PROGRESS.md` فقط للأدلة/الصور المسموحة بلا بيانات حساسة.
6. **المسؤولية:** سجّل ما شوهد فقط؛ اربط كل حالة بخطوة/لقطة؛ لا «PASS» بلا دليل؛ اذكر غير القابل للتشغيل.
7. **العقود:** لا token/بريد/عنوان/صور عملاء حساسة في اللقطات؛ Lighthouse/CWV في بيئة مأذونة فقط ولا يُخلط بـDay 10 seal.
8. **الفحوص:** DOM + visual + console/network؛ HTTP 200 ليس بديلًا؛ لا إعادة تشغيل build فاشل في حلقة.
9. **المتصفح:** المصفوفة الكاملة في §7.6؛ أي نقص يبقى NOT TESTED صراحة.
10. **اعتماد المالك:** 🟡 حتى يعتمد الشكل بصريًا.
11. **DoD:** تقرير صادق يفرق SOURCE / AUTOMATED / BROWSER / OWNER VISUAL.
12. **STOP:** `⛔ STOP — Gate 6`

### Gate 7 — Final Review & Handoff

1. **ID/الهدف:** G7؛ تقرير كامل وتوصية Astra، لا implementation.
2. **الاعتماد/الإذن:** إذن مالك بعد مراجعة Gates المفتوحة؛ لو جزء جاهز يُسمّى «تسليم جزئي D8-HOME» أو «D8-SEO» إلخ.
3. **النطاق:** `docs/PROGRESS.md` و`docs/DAY8_TASKS.md` فقط لتحديث الحالة/الأدلة/STOP.
4. **خارج النطاق:** لا إصلاح عيوب، لا فتح Day 9/Dashboard، لا production seal مع أي blocker مفتوح.
5. **الملفات المتوقعة:** الوثائق فقط.
6. **المسؤولية:** جدول Task ID/الحالة/الملف/الدليل؛ انحرافات؛ أوامر؛ KS-11/12/13/14/15/16؛ كل ID في §6؛ حالة `D15-SEO-SITEMAP` كمؤجل؛ فصل الحالات الأربع.
7. **العقود:** راجع كل Gate مقابل §1–§5 و§7؛ لا accept بلا دليل؛ لا ترقية 🟡 إلى 🟢.
8. **الفحوص:** استشهد بالأوامر المؤرّخة بأرقامها/exit codes؛ لا إعادة بناء الغرض من Gate.
9. **المتصفح:** انقل فقط ما شوهد فعليًا؛ NOT TESTED يبقى NOT TESTED.
10. **الاعتماد:** Astra يوصي؛ المالك وحده يعتمد الشكل والانتقال.
11. **DoD:** تقرير صادق بالقيود؛ هذا الملف يعكس الحالة الفعلية؛ STOP أخير.
12. **STOP:** `⛔ STOP — Gate 7`

---

## 8) أوامر التحقق — تُسجَّل وقت التنفيذ، لا تعليمات الآن

من `Om-Eman/frontend` بعد كل Gate كود، كل أمر منفصلًا: `npm run lint`, `npm run check`, `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`, `npm run build`, `git status --short --untracked-files=all`, `git diff --check`, `git diff --stat`, `git diff -- package.json package-lock.json`. أي dependency diff ⇒ STOP. لا tokens/أسرار في المخرجات المنقولة للتقرير.

---

## 9) المخاطر والـblockers

| ID | الخطر | الإجراء المسموح |
| --- | --- | --- |
| R-D8-OWNER | لا إذن لأي Gate Day 8 بعد. | STOP؛ لا implementation قبل إذن مالك بالاسم. |
| R-D8-SCOPE | العودة لحصر اليوم في Google/CTA. | §1 حاكم؛ الإضافات لا تُحل محل الهوم/SEO. |
| R-D8-ASSETS | صور Hero/OG/Banners/Categories/FAQ/Wishlist غير متوفرة أو غير معتمدة. | BLOCKER صريح؛ لا mock/label/packaging متخيل ولا مسار غير مسجل؛ سجّل في `D8-ASSET-REGISTER`. |
| R-D8-FAQ-FACTS | وعود FAQ غير موثقة. | استخدم حقائق أعمال مؤكدة فقط؛ لا شحن/دفع/إرجاع/توصيل متخيل. |
| R-D8-WISHLIST-MOCK | تحويل UI preparation إلى ميزة فعلية. | empty state صادق فقط؛ لا persistence/mutations/endpoints؛ الوظيفة DEFERRED. |
| R-D15-SITEMAP | محاولة توسيع sitemap داخل اليوم 8. | STOP؛ `D15-SEO-SITEMAP` هو المكان الوحيد لهذا العمل. |
| R-D8-SHELL | تعديل Header/Footer بلا إذن. | تدقيق فقط؛ أي edit يحتاج scope منفصل. |
| R-D8-GOOGLE | وهم مصادقة. | UI-only؛ رسالة صادقة؛ صفر request/token. |
| R-D8-CHECKOUT | CTA لسلة غير صالحة. | شرط `loaded && !error && itemsCount > 0`. |
| R-D8-MERGE-READ | سلة العميل بعد merge غير مقروءة. | فجوة Day 7 تبقى BLOCKED. |
| R-D8-BROWSER | لا أداة متصفح/Playwright. | G6 NOT TESTED أو مشروط ببيئة مأذونة. |
| R-D8-VIS | لا اعتماد بصري موروث. | 🟡 حتى اعتماد المالك. |
| R-D8-SEAL | Production غير محصور. | لا ختم/نشر؛ لا ترقية 🟢. |
| B-BUILD | خطر Turbopack تاريخي. | سجّل أي تكرار؛ لا تغيير tooling. |

---

## 10) قالب تقرير كل Gate

1. Gate / الإذن / البيئة / التاريخ.
2. جدول `Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل`.
3. أوامر + exit codes + مقتطفات بلا tokens.
4. الانحرافات وuntracked/dependencies/باك/DB.
5. المتبقي KS-11/12/13/14/15/16 وكل ID في §6، مع تأكيد `D15-SEO-SITEMAP` مؤجلًا.
6. توصية Astra ثم اعتماد المالك منفصل.
7. آخر سطر `⛔ STOP — Gate N` أو STOP النهائي.

---

## 11) طلب مراجعة Astra والاعتماد

يرجى من Astra مراجعة هذا الملف مقابل `AGENTS.md`، `FRONTEND_TASKS_10_DAYS.md §0.3/يوم8/يوم9/يوم10`، `PROGRESS.md §47-§49`، `DAY7_TASKS.md §6/§7/§12`، اكتمال الـ12 حقلًا لكل Gate، وعدم حذف أي متطلب أساسي أو إضافة، وتغطية KS-15/KS-16 و`Gate 4A` و`D15-SEO-SITEMAP`، وعدم فتح Google حقيقي أو Dashboard أو باك/DB/env، وعدم ترقية أي حالة 🟡/NOT TESTED تلقائيًا.

**قرار Astra:** لم يُطلب بعد لهذه النسخة المُوضَّحة بتوضيحات المالك.
**اعتماد المالك:** تصحيح النطاق وتوضيحات الأصول/FAQ/Wishlist/تأجيل sitemap واردة من المالك؛ لا تعني فتح Day 8 ولا أي Gate.
**الإذن الحالي:** `DAY 8 SCOPE CLARIFICATIONS RECORDED — FULL SCOPE LOCKED — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED`.

⛔ STOP — DAY 8 SCOPE CLARIFICATIONS RECORDED — FULL SCOPE LOCKED — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED

---

## 12) G7 — DAY 8 FINAL REVIEW & HANDOFF (2026-11-26)

- **Owner Authorization:** `G7 — DAY 8 FINAL REVIEW & HANDOFF`؛ **Executor:** GLM؛ **Reviewer:** Astra؛ **Scope:** documentation only.
- **Preflight:** قُرئت `AGENTS.md`، وأجزاء `FRONTEND_TASKS_10_DAYS.md §0.3/Day8/Day9/Day10`، و`PROGRESS.md §47-§61` خصوصًا `§61`، وهذا الملف `§1-§7/§10-§11`؛ فُحص `git status` وسُجّل baseline في `PROGRESS.md §62`. لا قبول أي Gate بالاستنتاج.
- **Scope guard:** التعديل الوثائقي في G7 انحصر في `docs/PROGRESS.md` و`docs/DAY8_TASKS.md`. صفر source/backend/DB/env/config/deps، صفر commit/push/deploy، صفر Day 9/Dashboard، صفر Production Seal.
- **Final review:** جدول G0–G6 الكامل مع Owner authorization وSource status وAutomated exit codes وBrowser/Astra/Owner acceptance وBlockers موجود في `PROGRESS.md §62.1`.
- **G6 mandatory qualification:** مصفوفة `G6-HOME-*`, `G6-SEO-*`, `G6-FAQ-*`, `G6-WISHLIST-*`, `G6-GOOGLE-*`, `G6-CART-*`, `G6-CHECKOUT-*` وكل `G6-M-*` منقولة كما هي في `PROGRESS.md §62.2`. كلها `NOT TESTED` بلا evidence؛ DOM/Visual/Console/Network وAccessibility/Focus وRuntime Reduced Motion منفصلة و`NOT TESTED`؛ `D8-BROWSER-ENVIRONMENT: BLOCKED`. G7 ليس بديلًا عن G6.
- **Handoff coverage:** `PROGRESS.md §62.3` يغطي `KS-11`–`KS-16` وكل معرّفات `§6` (`D8-ASSET-REGISTER`, `D8-HERO-ASSET`, `D8-OG-ASSET`, `D8-BANNER-ASSETS`, `D8-FAQ`, `D8-WISHLIST`, `D8-WISHLIST-API`, `D8-SITEMAP`, `D8-GOOGLE-REAL`, `D8-MERGE-READ`, `D8-BROWSER`, `D8-OWNER-VIS`, `D8-SEAL`, `D8-DASHBOARD`, `D15-SEO-SITEMAP`)؛ `D15-SEO-SITEMAP` مؤجل إلى اليوم 15.
- **Astra / Owner:** Astra Review Status `NOT TESTED`؛ التوصية المعدّة للمراجعة `PARTIAL HANDOFF ACCEPTABLE — DO NOT SEAL`، منفصلة عن Owner Acceptance. G5 visual acceptance مقبول؛ G6 لم يُعتمد بصريًا؛ G7 PENDING حتى مراجعة المالك.
- **Production readiness:** `NOT READY / NOT SEALED`؛ لا deployment ولا ادعاء اكتمال Day 8؛ كل البلوكات مفتوحة.
- **VerificationCommandResults:** `git diff --check EXIT 0` مع تحذيرات LF→CRLF موروثة وبلا whitespace errors؛ `git diff --stat EXIT 0` (`13 files changed, 445 insertions(+), 27 deletions(-)`؛ حصة G7: `PROGRESS.md +130` و`DAY8_TASKS.md +16`)؛ `git status --short --untracked-files=all EXIT 0` (`21` entry مقابل `20` في baseline، بسبب تعديل `DAY8_TASKS.md` المسموح به فقط)؛ `git diff -- package.json package-lock.json EXIT 0` بلا diff. لم تُعَد أوامر lint/build لأن النطاق وثائقي.

⛔ STOP — Gate 7
