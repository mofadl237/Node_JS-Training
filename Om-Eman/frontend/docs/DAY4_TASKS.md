# اليوم 4 — كتالوج المتجر + تفاصيل المنتج المشروطة — تاسكات تنفيذية

> آخر تحديث: 2026-11-19. **حالة المستند: DAY 4 GATE 5 COMPLETE — FINAL HANDOFF READY — WAITING FOR OWNER REVIEW. B-PUB/G2/G3/G4 منفّذة وموثّقة ومعتمدة حسب سجل `PROGRESS.md`؛ الاعتماد النهائي لليوم 4 بانتظار المالك. لا Day 5.**
> **المدير/المراجع:** Astra. **المنفّذ:** GLM. **المالك:** صاحب القرار في النطاق، العقود، الشكل، قبول كل Gate والانتقال للي بعدها.
> المسارات نسبية إلى `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. المرجع التاريخي: `DAY3_TASKS.md`؛ الحالة الحالية والأدلة: `PROGRESS.md`. الأوامر تحت **تعليمات للمستقبل بعد الإذن**، مش نتائج تنفيذ.

---

## 0) قواعد التعامل (اقراها الأول — مخالفة أي واحدة = وقف)

1. قبل **كل Gate**: اقرأ `AGENTS.md`، آخر سجل في `docs/PROGRESS.md`، وقسم الـGate هنا. اتأكد إن فيه إذن صريح من المالك باسمها، وافحص الكود والـworking tree قبل التعديل. اختلاف العقد أو حاجة مش واضحة ⇒ سجّلها واسأل، متخمّنش.
2. منفّذ واحد: GLM يكتب قائمة الملفات ومسؤولية كل ملف، ينفّذ الـGate المصرّح بها بس، يشغّل فحوصها، يراجع الـdiff **والملفات الجديدة غير المتتبعة**، يحدّث PROGRESS بالأدلة والانحرافات، يسلّم التقرير ويقف. لا تعديل متزامن من Astra. ما ترجعش شغل موجود قبل الـGate.
3. Astra يراجع الـdiff الفعلي مقابل النطاق والعقد، TypeScript، المكونات والـtokens، وحالات القبول وأدلة الاختبار. النتيجة: توصية بالقبول، أو عيوب محددة (ملف، سلوك متوقع، اختبار إعادة مراجعة) وتظل الـGate مفتوحة. **حتى مع توصية القبول، الانتقال محتاج موافقة المالك.**
4. نفس App Router، `Providers/` وترتيبهم، ومجلدات `interface/` و`components/Skelton/` بأسمائها. مفيش restructure أو design system تاني أو provider/slice/fetch wrapper موازي. لو ضرورة معمارية: اشرح الموجود والمشكلة وليه ما يكفيش وأصغر بديل؛ **قف قبل التعديل**.
5. `@/` imports، TypeScript strict، interfaces بـ`I` وunions/types بـ`T`، ملف لكل مسؤولية، استهدف ≤150 سطر، حد أقصى 200، والصفحة للتركيب فقط (هدف ≤30). ممنوع `any`/casts لإسكات خطأ. افحص وأعد استخدام الموجود قبل إنشاء ملف.
6. مفيش dependencies أو edits للباك/DB/migrations/seed أو إعداد نشر. مفيش commit/push/deploy. مفيش mock/MSW أو demo data في المتجر؛ fixtures `/design` المعنونة تفضل معزولة. لا refactor جانبي ولا إعادة شغل Day 3.
7. افصل في التقرير: **منفّذ في المصدر / فحص آلي ناجح بدليل / شوهد في متصفح / 🟢 اعتمده المالك / ⛔ محجوب أو لم يُختبر**. أوامر خضرا مش اعتماد بصري؛ HTTP 200 مش دليل إن الزرار اشتغل. كل Gate لها `⛔ STOP` مستقل.

**رسالة جاهزة لـGLM (تُرسل فقط عند تفويض Gate معينة):** «اقرأ القواعد والسجل وقسم Gate N. اعرض ملفاتها، نفّذها وحدها ووثّق النتيجة الفعلية. لو N=0: قراءة وفحص وتسجيل فقط. اكتب `⛔ STOP — Gate N` وانتظر؛ الملف نفسه مش إذن بدء.»

## 1) هدف اليوم 4

الزائر يفتح قسمًا من الهوم فيوصل لكتالوج حقيقي قابل للمشاركة برابط، يغيّر الفلاتر والترتيب ويتنقل بين الصفحات. **ده المخرج الأساسي**. لو عقد نشر التفاصيل اتحسم في الباك: يفتح منتجًا بالـslug، يشوف بياناته وعبواته، ويضيف العبوة اللي اختارها بنفس مسار السلة الحالي.

## 2) النطاق والاستبعادات

`FRONTEND_TASKS_10_DAYS.md §0.3` غيّر الترتيب: المتجر قبل اللوحة. «اليوم 9» القديم مرجع لمحتوى الشاشات، مش إلزام بتنفيذ أربع شاشات مع بعض. `DAY3_TASKS.md §2.1` اقترح كتالوج+منتج ثم بحث+سلة؛ المالك اعتمد التقسيم بتاريخ المستند.

| داخل النطاق | خارج النطاق / موعده |
| --- | --- |
| G1–G2: `/[locale]/products`، SSR، category/subcategory/sort/page من الـURL، روابط الترقيم، حالات البيانات، metadata وbreadcrumb. | **Day 5:** حقل بحث الهيدر، النتائج والاقتراحات، `/cart`، drawer، badge، تحديث/حذف بنود السلة. لا شاشات placeholder. |
| G3 فقط بعد شرط النشر: `/[locale]/products/[slug]`، صور، أسعار عبوات، bundle وrelated، SEO للصفحة. G4 فقط بعد قبول G3: الاختيار والإضافة. | Checkout/تتبع/حساب/Dashboard، wishlist، countdown، ادعاءات توفير غير مثبتة، مشاركة جديدة أو تغيير الهيدر/الفوتر/الأزرار العائمة. |
| الجلب العام الموجود، وإصلاح typing محدود لـ`cacheLife` في G1. | إصلاح Turbopack أو تغيير config/أداة البناء، تعديل CSS تحميل البرطمان، إعادة هيكلة cart، تغيير استراتيجية الكاش أو تعميم sitemap على slugs غير متحقق منها. |

**الروابط المعروفة:** KS-1 رابط القسم يصبح شغالًا عند قبول G2. KS-2 رابط الكارت أو «اختار العبوة» يظل pending لحد قبول G3؛ الاختيار التفاعلي نفسه في G4. KS-3 يظل مؤجلًا لـDay 5. مفيش تحويلات صورية توحي إن صفحة اتبنت.

<a id="day5-handoff"></a>

### Deferred Tasks / Upcoming Work

**سبب التأجيل:** إعادة توزيع نطاق Storefront وفقًا للـUpdated Roadmap، وليس إلغاء المهمتين. [الخطة الأصلية](./FRONTEND_TASKS_10_DAYS.md) جمعت الكتالوج والمنتج والبحث والسلة تحت «اليوم 9 — Storefront»؛ §0.3 عدّل ترتيب الأيام، و[DAY3_TASKS.md](./DAY3_TASKS.md) §2.1 وثّق تقسيم محتوى المتجر. بعد اعتماد المالك: الكتالوج والتفاصيل المشروطة في Day 4، والمهمتان التاليتان في **Day 5**. البنود دي للتسليم للمنفّذ القادم، مش ضمن Gates اليوم الرابع.

| ID | Task | الموعد والحالة | متطلبات Day 5 المحفوظة من الخطة |
| --- | --- | --- | --- |
| D5-SEARCH | Product Search | **Planned for Day 5 — Not Started** | حقل بحث ظاهر في الهيدر → صفحة نتائج محلية اللغة برابط يحتفظ بـ`q`، وكروت نتائج بأسعار وصور حقيقية من نفس `ProductCard`. عند صفر نتائج: اعرض `suggestions` لو رجعت، وإلا `EmptyState`؛ فشل الطلب `ErrorState` مش «مفيش نتائج». احتفظ بتسجيل البحث، وبمتطلب `WebSite.SearchAction` مع رابط النتائج الفعلي **بعد** وجود الصفحة. |
| D5-CART | Guest Cart / Cart Page | **Planned for Day 5 — Not Started** | افتح `/{locale}/cart` من رابط الهيدر (KS-3)، مع drawer جانبي وheader badge يعتمد على `itemsCount` الحقيقي. نفس سلة الضيف بعد reload: جلب/إنشاء، عرض البنود، إضافة عبوة، تعديل الكمية وحذف بند؛ عرض اسم المنتج وصورته/بديلها، العبوة والحجم، السعر والمقارنة عند صلاحيتها، التوفر و`subtotal` من الباك. حافظ على fly-to-cart + bounce + count-up. مؤشر الشحن المجاني يظهر فقط مع `freeShippingThreshold` حقيقي من الإعدادات. |

**تفاصيل التسليم — لما يبدأ تخطيط Day 5:**

- **D5-SEARCH:** حسب `backend/src/modules/store/search/{validation,service}.ts`، العقد هو `GET /api/store/search?q=…` (`q` بعد trim من 1–200 حرف، `limit` من 1–50، افتراضي 20). `data` يحوي `results`, `suggestions`, `searchLogId`؛ النتائج كروت مع `matchTier/score/matchedTerm`، والاقتراحات كروت من `suggest_similar` عند غياب النتائج. متطلب الـSearchLog في الخطة القديمة محفوظ: الخدمة تسجّل البحث بنفسها، فلا `POST /api/search-logs` إضافي ولا endpoint اقتراحات مختلق. اختبر بحثًا عربيًا وإنجليزيًا وصفر نتائج من بيانات حقيقية.
- **D5-CART:** الخطة القديمة ذكرت cookie وCRUD عام؛ التنفيذ القائم يستخدم `om_cart_token` عبر `lib/cartToken.ts` و`store/cartApi.ts`. أعد استخدامهما و`baseApi` ووسم `Cart`: `GET /api/store/cart` مع `guestToken` اختياري قد ينشئ سلة؛ `GET /api/store/cart/:guestToken` يقرأ سلة قائمة؛ `POST .../:guestToken/items` يضيف بالـ`productPackageId`؛ `PATCH`/`DELETE .../:guestToken/items/:itemId` يعدّلان/يحذفان **بند السلة**. لا تخزين موازٍ ولا إنشاء سلة لمجرد رسم الـbadge. عالج السلة الفارغة والعبوة غير المتاحة وفشل التعديل. دمج الضيف بعد login (`POST /api/store/cart/merge`) يظل مرتبطًا **بيوم حساب العميل** كما في الخطة؛ لا يُفقد ولا يُطلب كتسجيل دخول لشراء الضيف.
- **الحد بين الأيام:** الموجود من Day 3 هو أساس الإضافة من الكارت، والمسموح في Day 4 G4 المشروطة هو إضافة العبوة المختارة من صفحة المنتج فقط. ولا واحد منهم يعني إن **Guest Cart / Cart Page** بدأت. المهمتان تتبعان قواعد المشروع للـloading/error/empty/success، الترجمة وRTL/LTR والثيمات الأربعة، الموبايل والكيبورد وreduced-motion. توفّر الـAPI على بيئة التنفيذ يُختبر وقتها؛ وجود عقد في المصدر مش إثبات تشغيل.
- **تتبّع المتطلبات:** راجع [الخطة الأصلية](./FRONTEND_TASKS_10_DAYS.md) §3.2 و«اليوم 9» وجدول الـendpoints، [DAY3_TASKS.md](./DAY3_TASKS.md) §2.3–2.4 (حقل البحث، SearchAction، عدّاد السلة، KS-3)، [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §5.3 و§6 (الحركة والشحن)، و[STORE_BACKEND_TASKS.md](../../backend/docs/STORE_BACKEND_TASKS.md) B11–B13 (التوفر وبيانات السلة والبحث). عند تجهيز ملف Day 5، انقل الـID والمتطلبات والمرجع المقابل لكل بند؛ لا تحذف بندًا من الخطة القديمة ولا تغيّر حالته لمجرد نقله.

## 3) Pre-flight (Gate 0) — قبل أي كود

بعد إذن G0 فقط:

1. سجّل البيئة والتاريخ، `git status --short`، ملفات المستخدم الموجودة قبل البداية، آخر نتيجة build ودليلها، ونتائج أوامر §10 كل واحدة لوحدها. baseline الأحمر يُسجّل؛ لا إصلاح في G0 ولا إعادة مصفوفة Day 3 Gate 5.
2. راجع مصادر §4 ثم اختبر أكثر من مجرد 200: قارن `data` و`meta` وأنواع السعر وحقول `null` بالقيمة الفعلية. استخدم قسمًا/منتجًا من الرد نفسه، مش اسم من seed قديم. سجّل status + مفاتيح أو مقتطف مختصر؛ لا tokens/أسرار.
3. جاوب في PROGRESS: مين صاحب حالة الفلاتر؟ فين `meta`؟ إمتى الرد الفاضي غير error؟ ليه `inStock` في الكارت مش كفاية لاختيار عبوة؟ إيه الفرق بين 404 منتج وخطأ DB؟ إيه **الدليل** إن سياسة نشر التفاصيل اتحسمت على بيئة الاختبار؟
4. اكتب نتيجتين مستقلتين: **Catalog API صالح/محجوب** و**Detail publication محسوم/محجوب**. لو `:3002` غير متاح أو القائمة معطّلة ⇒ سجّل السبب واطلب بيئة/قرار المالك قبل G1؛ لا تبنِ على عينة مصطنعة. تعطل التفاصيل وحده لا يمنع مراجعة الكتالوج.

## 4) الملفات المطلوب قراءتها (بالترتيب)

| الترتيب | المرجع | اقرأ عشان |
| --- | --- | --- |
| 1 | `AGENTS.md` خصوصًا §3.4 و§12–16؛ `docs/PROGRESS.md` آخر مراجعة؛ `docs/DAY3_TASKS.md` §2 و§8–13؛ `docs/FRONTEND_TASKS_10_DAYS.md` §0.3 ووصف «اليوم 9»؛ `docs/DESIGN_SYSTEM.md` §2 و§5–8 | تعرف الترتيب والاستثناءات وحالة الأدلة، مش ترجع للجدول القديم. |
| 2 | `app/[locale]/(Store)/{layout,page,loading}.tsx`، `components/ECommerce/Home/{HomeSections,FeaturedSection,FeaturedGrid}.tsx`، `components/Card/ProductCard.tsx` | تركيبة SSR/Suspense، الشبكة الفعلية، سلوك الكارت والـCTA. |
| 3 | `lib/server/{storeFetch,storeQueries}.ts`، `lib/{routes,seo,jsonld,localized,price}.ts`، `interface/{api,store,index}.ts` | عقود الـwire والـcache والـhelpers قبل إضافة أي عقد. |
| 4 | `store/{baseApi,cartApi}.ts`، `lib/cartToken.ts`، `hooks/useFlyToCart.ts`، `components/ECommerce/Header/CartLink.tsx` | RTK Query موجود بالفعل، ومعرّف العبوة هو هوية الشراء. |
| 5 | في `Om-Eman/backend/`، قراءة فقط: `docs/STORE_BACKEND_TASKS.md` B2–B4، `src/config/swagger-store.ts`، `src/modules/store/products/{routes,validation,controller,list,service,card}.ts`، `categories/service.ts` و`cart/{routes,validation,controller,service}.ts` تحت نفس مجلد `store/` | افصل الوعد في Swagger عن مصدر الرد الحقيقي، خصوصًا سياسة النشر. |

## 5) الموجود — أعد استخدامه

| الاحتياج | النمط الملزم |
| --- | --- |
| بيانات الكتالوج/المنتج | RSC → `lib/server/*` → `storeFetch` → `TStoreResult`. `"use cache"` + `cacheTag` + `cacheLife` مرة في مسار الاستدعاء. **لا RTK Query للقراءات دي** ولا `fetch` في JSX. |
| عرض | `FeaturedGrid` يقبل `products` و`locale`، ويرسم `ProductCard` الحقيقي؛ استخدمه للـgrid المتطابق بدل نسخه. `StoreImage` + alt/sizes/fallback، `PriceTag`، `Badge`، `Button`، `EmptyState`، `ErrorState`، `Skeleton` و`components/Skelton/`. لا تمرّر `isDemo` خارج `/design`. |
| التنقل وSEO | `@/i18n/navigation`، `categoryHref` و`productHref` من `lib/routes.ts`، `pickLocalized`، `buildMetadata` و`JsonLd`. لا `next/link` داخلي موازٍ ولا JSON-LD مبني كسلسلة HTML يدويًا. |
| الهوية | رسائل متطابقة ar/en، ICU بأقواس مفردة، `dir` من root layout. Tailwind logical utilities، tokens فقط، Zafran/Attar/Cinnamon/Hibiscus، نفس light/dark. فوق الـfold SSR مرئي؛ الحركة من wrappers الموجودة و`m.*` فقط مع LazyMotion، وتحترم reduced-motion. |
| الإضافة | `baseApi.injectEndpoints` قائم في `store/cartApi.ts`؛ `useLazyGetOrCreateCartQuery` + `useAddCartItemMutation`، `readCartToken`/`writeCartToken`، `Cart` tag، sonner وfly-to-cart الحاليان. لا cookie أو localStorage key تاني ولا تكرار السلة في Redux. |

## 6) الباك — العقود واعتماديات التشغيل

الـbase المحلي `http://localhost:3002/api`؛ الفرونت على `:3001`. الجدول **متحقق من المصدر** وليس شهادة إن السيرفر شغال الآن. نجاح `{success:true,message,data,meta?}`؛ فشل `{success:false,message,code}`. خلّي رسالة الخطأ مترجمة، مش stack/SQL أو رسالة خام.

| Method + endpoint | المدخلات والنجاح | حدود العقد والأخطاء |
| --- | --- | --- |
| `GET /api/store/categories` | بلا params؛ `data: IStoreCategoryNode[]` فيها `subcategories[]`، slugs، أسماء باللغتين و`productsCount`. استخدم `getStoreCategories()`. | `[]` استجابة صحيحة؛ تعذّر الشجرة لا يعني «صفر منتجات». الكتالوج غير المفلتر يظل قابل للعرض لو طلب القائمة نجح. |
| `GET /api/store/products` | `category`/`subcategory` slugs، `sort=newest` (البدائل `price_asc`, `price_desc`, `name`)، `page` موجب افتراضي 1، `limit` افتراضي 12 وبحد 48. يدعم الباك أيضًا `featured,inStock,minPrice,maxPrice`؛ لا نضيف لها UI اليوم. `data: IStoreProductCard[]`، و`meta: {page,limit,total,totalPages,hasNextPage,hasPreviousPage}` على مستوى الـenvelope. | ترتيب `name` من `nameAr` في الباك؛ لا ترتيب محلي مختلف بالإنجليزي. query غير صالح ⇒ `400 VALIDATION_ERROR`؛ `DB_CONSTRAINT_ERROR` تاريخيًا رجع 400 برضه، مش empty. |
| `GET /api/store/products/:slug` | slug صالح، لا lookup بالـID. `data: IStorefrontProduct` حسب `products/card.ts` ومخرجات `service.ts`: localized names/descriptions، `images[]`, `packages[]`, `bundleComponents[]`, category/subcategory، `aliases[]`, `related: IStoreProductCard[]`. | slug غير صالح ⇒ validation؛ غائب أو بلا عبوات active+published ⇒ `404 PRODUCT_NOT_FOUND`. فشل الخدمة/network ≠ 404. شرط فتح G3 أدناه؛ لا نعتبر كل `200` منتجًا صالحًا للنشر. |
| `GET /api/store/cart` ثم `POST /api/store/cart/:guestToken/items` | GET بـ`guestToken` اختياري؛ **قد ينشئ سلة**. POST: `{productPackageId, quantity}`، كمية رقمية `>0` و`≤1000`؛ Day 4 يضيف 1. كلاهما يرجع `data: IStoreCart` بما فيه `guestToken`, `lines`, `itemsCount`, `subtotal`. | POST قد يرجع `404 CART_NOT_FOUND` أو `400 CART_NOT_ACTIVE`/`PACKAGE_NOT_SALEABLE`/`VALIDATION_ERROR`. لا تفترض أن رفض العبوة النافدة مضمون من mutation؛ اقرأ `stockStatus` للعبوة المختارة وعطّل الزر. اختبار الكتابة فقط في G4 ببيئة اختبار مأذون بها. |

**شرط نشر التفاصيل (مانع G3):** `products/list.ts` يقيّد حالة المنتج بـ`ACTIVE` وموعد النشر المفتوح، والأقسام النشطة ووجود عبوة منشورة. `products/service.ts` عند المراجعة يبحث بـ`slug` ويفلتر العبوات ولا يطبّق كل شروط القائمة على المنتج نفسه، رغم وصف الخدمة. المطلوب من مسؤول الباك: سياسة مكتوبة مطبّقة على **البيئة المقصودة** ودليل قبول لحالة منتج عام وحالة غير مؤهلة لا تعيد تفاصيل. يسجّل Astra المرجع ويطلب إذن المالك لـG3. لا إخفاء بعد جلب البيانات، لا allow-list مشتقة من أول صفحة، ولا تعديل باك من GLM.

## 7) الـData models وTypeScript

- `IStoreProductCard`, `IStoreCategoryNode`, `IPaginationMeta` موجودة في `interface/`. لا تنشئ `CatalogCardDTO` ثاني. `storeFetch` يتحقق من الـenvelope وليس schema كل domain؛ تحقّق من الـpayload الذي ستستخدمه عند حد القراءة. لا تجعل `meta` اختيارية في نجاح القائمة لو الـUI محتاجها، ولا تبنِ `total` من `data.length`.
- G1: نوع صغير للـquery المقبول، وتطبيع من `searchParams` غير الموثوقة **قبل** استدعاء الـcached query؛ arguments قابلة للتسلسل. الأسعار والـIDs strings، مش أرقام، وحافظ على `null` الحقيقي؛ لا import من مشروع Prisma إلى الفرونت.
- G3 فقط: انقل حقول التفاصيل المطلوبة من `IStorefrontProduct/IStorefrontPackage` الموثّقتين في الباك إلى `interface/storeProduct.ts` واستخدم barrel الحالي. أعد استخدام image/category/card types حيث تطابق العقد. `sellingPrice`, `sizeValue`, `quantity` في عناصر الباقة decimal strings؛ `compareAtPrice`, `saleEndsAt`, `pricePer100g` ممكن `null`.

## 8) مهام التنفيذ بالترتيب الصارم

الأسماء الجديدة تحت **متوقعة وليست ملفات قائمة**. لو ملف موجود يقوم بنفس المسؤولية، أعد استخدامه وسجّل الاسم الفعلي. `docs/PROGRESS.md` سجل كل Gate؛ لا تهيّئ مجلدات أو ملفات لبوابة لاحقة.

## Gate 0 — Pre-flight فقط

- **الهدف/الاعتماد:** إذن منفصل لبدء G0. افصل سلامة baseline عن إمكانية تنفيذ الكتالوج والتفاصيل. **الملف الوحيد المتوقع تعديله:** `docs/PROGRESS.md` لتسجيل الأدلة والقرارات؛ لا كود.
- **P0.1–P0.3:** نفّذ §3؛ اجمع أوامر §10.1 وعينات القراءة §10.2. قارن عقد القائمة والتفاصيل بالكود، وحدد العوائق حسب البيئة. اعرض ملفات G1 ومسؤولياتها قبل طلب إذنها.
- **المتصفح:** لا شاشة Day 4 هنا. لو متاح سجّل عنوان `/ar` أو `/en` كخط أساس فقط؛ لا تشترط إعادة قبول Day 3 ولا تدّعي زيارة لم تحصل.
- **قبول/DoD:** تقرير baseline مؤرّخ، أكواد وأخطاء فعلية، قرار منفصل لكل اعتماد، وصفر تعديل مصدر. لو تعذّر backend يبقى التقرير صالح للمراجعة **وليس** تصريح تكامل.
- **⛔ STOP — Gate 0.**

## Gate 1 — أساس الكتالوج + تصحيح cacheLife المحدود

- **الهدف/الاعتماد:** بعد قبول G0 وإذن G1 وتوفر عقد القائمة في بيئة مقبولة؛ تجهيز بيانات القائمة **فقط** بدون صفحة أو تفاصيل أو تحديث للسلة.
- **F1 — `lib/server/storeQueries.ts` (تعديل):** المواضع 9، 17، 25، 33 في baseline: overload لا يقبل تمرير union إلى `cacheLife`. أصغر إصلاح: اختَر الفرع أولًا واستدعِ الـliteral المناسب داخل فرعه، مرة واحدة فقط في كل مسار؛ نجاح `minutes`، فشل `seconds`. حافظ على tags وأشكال الرد. لا `as`، لا تغيير `next.config`، لا `cacheLife` مرتين. لو محتاج أكتر من ده ⇒ وقف.
- **F2 — `lib/catalogQuery.ts` (جديد متوقّع):** تطبيع المدخل وبناء query allowlist من `category/subcategory/sort/page` باستخدام `URLSearchParams`. الافتراضي صفحة 1، 12 كارت، `newest`. رقم سالب/مش صحيح/قيمة مكررة لنفس المفتاح أو sort غير معروف ⇒ تجاهل القيمة غير الصالحة واستعمل الافتراضي؛ slug غير صالح لا يخرج للباك. slug صحيح لكنه غير موجود لا يتحول خفيةً إلى كل المنتجات.
- **F3 — `lib/server/storeQueries.ts`:** أضف استعلام القائمة باستخدام `storeFetch`, `TStoreResult`, tag `store-products` وسياسة الـcache نفسها. استخدم `getStoreCategories` كما هو، ولا تحوّل featured-only query إلى جلب كل المنتجات. لو احتجت schema خاصة بالقائمة فمسؤوليتها تحقق الـwire فقط تحت `validation/`؛ لا إعادة كتابة `storeFetch`.
- **اختبار/متصفح:** §10.1، واختبار التطبيع للـURL الفاضي، slug صالح، keys مكررة، sort خاطئ وpage غير صحيح؛ قارِن filtered page و`meta` بالـAPI. لا شاشة جديدة؛ smoke للهوم لو السيرفر متاح لأن الأربع reads مشتركة معاه.
- **قبول/DoD:** اختفاء أخطاء `TS2769` الأربعة بدون suppression، لا أخطاء جديدة، عدم خلط cache keys بين فلاتر مختلفة، وفشل الطلب/العقد يبقى نتيجة فشل لا `[]`. تقرير مستقل عن build blocker.
- **⛔ STOP — Gate 1.**

## Gate 2 — صفحة Catalog: الفلاتر والترقيم وKS-1

- **الهدف/الاعتماد:** G1 مقبولة + إذن G2. إكمال مسار الكتالوج حتى لو G3 لسه محجوبة.
- **C1 — `app/[locale]/(Store)/products/page.tsx` و`products/metadata.ts` (متوقّع):** صفحة تركيب، `setRequestLocale`، `generateMetadata`/`buildMetadata` للعنوان والوصف وcanonical/hreflang لمسار الكتالوج. استقبل `params` و`searchParams` كـPromises في Next 16؛ حلّ مدخلات الطلب داخل الـboundary المناسب لـ`cacheComponents`، لا في الـlayout ولا داخل `"use cache"`.
- **C2 — `components/ECommerce/Catalog/CatalogSection.tsx`:** يجمع القائمة وشجرة الأقسام من server queries، يعرض H1 وbreadcrumb و`BreadcrumbList` بالروابط العاملة، `FeaturedGrid` للكروت، ويفصل فشل الشجرة عن نتائج المنتجات. `components/Skelton/CatalogSkeleton.tsx` عند عدم تطابق الموجود: نفس أبعاد المنطقة داخل Suspense. `EmptyState` مع مسح الفلاتر؛ `ErrorState` للفشل؛ out-of-range يعرض طريق رجوع للنتائج بدون اختراع page count.
- **C3 — `CatalogFilters.tsx` و`CatalogPagination.tsx` في نفس مجلد Catalog:** الأولى تبني روابط/نموذج GET من الشجرة والقيم المسموحة؛ تغيير category يشيل subcategory القديمة، وتغيير filter/sort يرجّع page=1. الثانية تستخدم `hasNextPage/hasPreviousPage` و`page/totalPages` وتحفظ باقي الفلاتر. الـURL مصدر الحقيقة (refresh/back/forward)، لا Redux slice ولا نسخة client من النتائج. `messages/{ar,en}.json` للنصوص الجديدة فقط.
- **اختبار/متصفح:** حالات §10.2–10.3؛ افتح لنك قسم من الهوم، بدّل الفرعي والترتيب والصفحة ثم اللغة، وجرّب رابطًا محفوظًا. افحص HTML بأسماء وأسعار حقيقية وh1 واحد. لا تفتعل بيانات لإنشاء صفحة ثانية؛ سجّل لو البيانات لا تكفي.
- **قبول/DoD:** KS-1 يوصل للفلتر الصحيح، النتائج/الترقيم مطابقين لـAPI، الأربع حالات منفصلة، لا تكرار كارت، وأي مراجعة بصرية ناقصة مسجلة 🟡. يمكن تسليم **الكتالوج وحده** للمالك هنا.
- **⛔ STOP — Gate 2.**

## Gate 3 — تفاصيل المنتج بالـslug (شرط نشر مستقل)

- **الهدف/الاعتماد:** قبول G2 **ودليل حسم النشر حسب §6 وموافقة صريحة على G3**. لو الشرط ناقص: لا types أو route أو metadata للمنتج، وسجّل `⛔ pending-backend`؛ G4 لا تفتح.
- **D1 — `interface/storeProduct.ts`, `interface/index.ts`, `lib/server/storeQueries.ts`:** عقد التفاصيل/تصديره؛ query سيرفر بالـslug المتحقق منه، نفس `storeFetch`/cache، و`related` من الرد نفسه (لا request منفصل). فرّق `404 PRODUCT_NOT_FOUND` عن timeout/500/رد غير صالح؛ الأولى فقط من ردود الباك تفعّل `notFound()`.
- **D2 — `app/[locale]/(Store)/products/[slug]/{page.tsx,metadata.ts}`:** صفحة رفيعة وmetadata من نفس query ومحتوى مترجم؛ لا metadata لمنتج ناجح في حالة فشل. `components/ECommerce/Product/ProductDetails.tsx` للعرض وتجميع sections، `ProductGallery.tsx` للصور وalt والفallback، `BundleContents.tsx` للباقات الفعلية. Skeleton مطابق تحت `components/Skelton/ProductDetailsSkeleton.tsx` إن لزم. وصف/صور/related غايبة ⇒ fallback أو إخفاء القسم الاختياري، لا وصف أو منتج بديل مختلق.
- **D3 — SEO:** وسّع builders في `lib/jsonld.ts` بما يلزم لـ`Product`/`Offer` وbreadcrumb عبر `components/shared/JsonLd.tsx`. الروابط من helpers و`SITE_URL`، السعر والتوفر من **نفس العبوة**؛ العملة من إعدادات حقيقية (`getStoreSettings()` عبر `GET /api/store/settings`، `data.currency`). لو العملة غير متحققة لا تخترع Offer؛ سجّل النقص. لا نشر لكل slugs في sitemap اعتمادًا على feed لا يضمن أهلية التفاصيل.
- **اختبار/متصفح:** منتج عادي + باقة لو موجودين، missing slug صحيح الصياغة، وفشل شبكة منفصل. افحص الاستجابة/الـnot-found UI والـHTML وJSON.parse للـJSON-LD مقابل السعر/التوفر الظاهرين. لو Next أرسل shell قبل الـnotFound سجّل HTTP الفعلي، لا تدّعي 404 نقلًا عن الكود. لا قبول لحالة نشر مبني على مثال happy path فقط.
- **قبول/DoD:** KS-2 يفتح بيانات منتج منشور، الأسماء والـfallback للإنجليزي صحيحة، related من نفس الـpayload، وعدم وجود المنتج مش بديل لأي error. لا زر شراء يوحي بتنفيذ G4.
- **⛔ STOP — Gate 3.**

## Gate 4 — اختيار العبوة والإضافة بالمسار الموجود

- **الهدف/الاعتماد:** G3 مقبولة + إذن G4 + بيئة اختبار سلة معتمدة؛ لا تغيير لمسؤولية Day 5.
- **A1 — `components/ECommerce/Product/ProductPackageSelector.tsx` (client island) وربطه بـ`ProductDetails.tsx`:** اختيار محلي لعبوة من الرد، الاسم/الحجم/الوحدة، `PriceTag` لنفس العبوة، توضيح عدم التوفر وتعطيل الشراء. الافتراضي أول عبوة متاحة حسب ترتيب API؛ الكل نافد ⇒ لا CTA فعّال. لا `pricePer100g` مضلل لـ`KG/L`، لا حسبة تعويضية ولا عرض لقيمة `null`.
- **A2 — `ProductAddToCart.tsx` في نفس مجلد Product:** عند الضغط فقط اقرأ token بـ`readCartToken`، استعمل get-or-create الحالي ثم `writeCartToken` للتوكن المرجع، ثم `addCartItem` بمعرّف **العبوة المختارة**. أعد استخدام hooks/feedback من §5؛ لا cart init عند SSR أو فتح الصفحة. اقفل تكرار الطلب **من أول GET لحد نهاية POST**، لا toast نجاح/fly قبل النجاح، ورسالة خطأ مترجمة مع إعادة تمكين التحكم. لا نسخ جسم `ProductCard.onAdd` كسير عمل ثانٍ: لو مفيش hook مشتركة للتسلسل وقت التنفيذ، اقترح استخراج المشترك فقط في `hooks/useAddToCart.ts` من المسار الحالي واستعماله من الكارت والـPDP؛ اعرض الـdiff المتوقع واعتمده مع Astra والمالك قبل مسّ الكارت، بلا تغيير سلوكه أو `isDemo`.
- **اختبار/متصفح:** عبوة واحدة؛ تغيير بين عبوتين مختلفتي السعر؛ عبوة sold-out؛ double-click؛ فشل ونجاح حقيقيان في بيئة مصرح بها. افحص Network: GET عند الحاجة، POST واحد بالـpackage ID الصحيح، نفس السلة بعد refresh، لا token في التقرير؛ assertions للرسالة/keyboard/reduced-motion وهدف `data-cart-target` مرئي واحد. لو مفيش تصريح اختبار كتابة: سلّم `غير مختبر`، لا ترسل mutation.
- **قبول/DoD:** دليل أن العبوة المضافة هي المختارة، مع feedback وحراسة الطلب، وCTA القديم للكارت سليم. لا cart page/drawer/badge أو endpoint جديد.
- **⛔ STOP — Gate 4.**

## Gate 5 — المراجعة والتسليم (Day 4 فقط)

- **الهدف/الاعتماد:** إذن مالك بعد مراجعة الـGates المنفّذة. المسار العادي بعد G4؛ لو التفاصيل محجوبة، للمالك فقط طلب **تسليم Catalog جزئي بعد G2**؛ لا يتعلّم G3/G4 أو اليوم كله كمكتمل.
- **V1:** `docs/PROGRESS.md` ← جدول المهمة/الملف/الدليل والـdiff من baseline، نتيجة §10/§11، والروابط KS والـblockers. لا تعديل implementation أو features في Gate التسليم؛ العيب يعود للبوابة المالكة بإذن.
- **V2:** افحص بالمستعرض الروابط المباشرة والتنقل من الهوم، DOM/HTML للصفحات اللي اتبنت فقط، وحالات البيانات/accessibility. قارن مصفوفة اللغتين والـthemes. لا تكرر Gate 5 بتاع Day 3 ولا تختبر checkout.
- **قبول/DoD:** تقرير §13 بتمييز ما لم يُر أو يُعتمد. Astra يقدّم النتيجة والأسباب؛ المالك وحده يعتمد الشكل والتسليم. build محجوب ⇒ لا ختم production-ready. لا فتح Day 5.
- **⛔ STOP — Gate 5.**

## 9) الـGates ونقاط الاعتماد (ملخص)

| Gate | المخرج لتسليمه للمراجعة | ما يوقف الانتقال |
| --- | --- | --- |
| 0 | baseline + ردود API + قرار مستقل لسياسة النشر | لا إذن بدء حاليًا؛ غير متاح/تعارض ⇒ قرار المالك. |
| 1 | استعلام كتالوج typed + إصلاح الأربع overloads فقط | أي تغيير أوسع في الكاش أو typecheck غير سليم. |
| 2 | كتالوج قابل للاستخدام يغلق KS-1 | غياب دليل الحالات/الفلاتر أو محاولة فتح تفاصيل قبل حسم العقد. |
| 3 | PDP منشورة بعقد متحقق يغلق KS-2 | عقد النشر الموثق غير مطبّق/غير متحقق في البيئة. |
| 4 | اختيار عبوة وإضافة فعلية بمسار قائم | endpoint كتابة غير متاح/غير مأذون أو طلبات مكررة/عبوة خاطئة. |
| 5 | تقرير كامل أو تسليم جزئي مسمّى بوضوح | لا تنفيذ إضافي؛ قرار الإقفال للمالك. |

## 10) أوامر التحقق والمصفوفة (تتسجل وقت التنفيذ)

### 10.1 من `Om-Eman/frontend` — baseline وعند تسليم Gate كود

```bash
npm run lint
npm run check
node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false
npm run build
git status --short
git diff --check
git diff --stat
git diff -- package.json package-lock.json
```

شغّل كل أمر منفصل عشان فشل build ما يخفيش نتيجة check/TypeScript. سجّل exit وآخر سطور مفيدة. افحص diff الملفات المقصودة ومحتوى أي ملف جديد. لو build نجح، اختبر `npm run start` على `:3001`؛ لو متاح dev فقط اكتب «dev» مش «production». لا تكرر build فاشل في حلقة ولا تعدّل tooling. بوابة توثيق بلا تغيير كود تستشهد بآخر baseline مؤرّخ، من غير نسبة نجاح جديد لنفسها.

### 10.2 طلبات قراءة قابلة للتكرار (على بيئة مصرح بها)

```bash
curl -i 'http://localhost:3002/api/store/categories'
curl -i 'http://localhost:3002/api/store/products?page=1&limit=1&sort=newest'
curl -i 'http://localhost:3002/api/store/products?sort=invalid'
```

خُد slugs من أول رد ناجح واختبر `category=<slug>&subcategory=<slug>&sort=price_asc&page=1` ثم صفحة أخرى لو `meta.hasNextPage`. جرّب قيمة فلتر صحيحة الصيغة بلا نتائج وتحقق من `200 + [] + meta.total=0`، ولا تعتبر الصفحة خارج المدى متجرًا فارغًا. لبوابة التفاصيل: `GET /api/store/products/<public-slug>`، slug غير موجود، وإثبات سياسة النشر من مسؤول الباك. لا تنشئ بيانات لتجهيز الاختبار. فشل اتصال بلا HTTP ≠ HTTP 400؛ فشل الباك ≠ empty/404. اختبار السلة منفصل في G4 لأن حتى GET قد يكتب.

### 10.3 مصفوفة المتصفح والـSSR — سجّل لكل صف: البيئة، URL، المتوقع، الفعلي، الدليل

| أين | افحص فعليًا |
| --- | --- |
| Catalog | دخول من category card ورابط مباشر، reload، back/forward، اللغة مع query، reset عند تبديل الفلتر، أول/آخر صفحة، skeleton تحت شبكة بطيئة، empty منفصل عن error وsuccess. |
| PDP لو اتفتحت | صورة/صورة مفقودة، باقة/منتج، fallback اسم عربي في en، إخفاء optional sections، 404 مترجمة وفشل حقيقي. في G4 اختيار عبوة ثم السعر/التوفر وطلب الإضافة كما في A2. |
| كلا المسارين | `/ar` RTL و`/en` LTR، 360px وdesktop، الثيمات الأربعة خصوصًا Cinnamon الداكن، لا overflow أفقي. جرّب Tab/Enter، labels وfocus-visible، تغيير الثيم واللغة، و`prefers-reduced-motion`. لا تعدّل loader Day 3 لحل اختبار Day 4. |
| HTML/SEO | افحص HTML السيرفر مش DOM بعد hydration فقط: H1 واحد، نصوص وأسعار حقيقية، visible above fold، canonical/hreflang من `buildMetadata`، `BreadcrumbList` وروابطه، و`Product/Offer` مطابقين للعبوة والعملة عند وجودهما. استخدم `JSON.parse` لأجزاء JSON-LD، وافحص عدم تكرار shell. |

## 11) معايير القبول النهائية

- [ ] الـGates المسلّمة فقط لها إذن، diff وملفات ومسؤوليات وأدلة. لا تعديلات خارج النطاق أو تبعيات/باك/بيانات وهمية.
- [ ] TypeScript/lint/check/build لكل تسليم كود بنتائج حقيقية؛ أي فشل/open Gate معلن، مش ✅ كاملة. لا `any`، لا ملف 200+، الصفحات رفيعة.
- [ ] Catalog يطابق بيانات الباك، الفلاتر في URL والترقيم من `meta`، وحالات loading/error/empty/success مستقلة. KS-1 متحقق في اللغتين.
- [ ] لو G3/G4 مسلّمتين: عقد نشر مُثبت، KS-2 وmetadata/JSON-LD صحيحين، اختيار/إضافة العبوة من المسار القائم بدليل. غير كده علّم البنود `Blocked/Not run`؛ KS-3 خارج اليوم.
- [ ] تبديل اللغة والـtheme، RTL/LTR، responsive، a11y وreduced-motion اتفحصوا على الشاشات المنفذة أو محدد مين يفحصهم وفين. اعتماد المالك له خانة مستقلة.

## 12) المخاطر والـblockers المعروفة

| ID | الدليل الحالي | الإجراء المسموح / شرط الفك |
| --- | --- | --- |
| B-API | Gate 5 السابق أفاد بنجاح API محلي بعد إصلاح alias في `products/list.ts`. في مراجعة التخطيط الاتصال بـ`:3002` انتهى timeout/`ECONNREFUSED`، بلا HTTP؛ حالة النشر غير مؤكدة. | سجّل بيئة اختبار شغالة وردًا جديدًا قبل التكامل. لا تحويل النجاح التاريخي إلى إثبات نشر، ولا تفسير الاتصال المرفوض كرجوع `DB_CONSTRAINT_ERROR`. |
| B-PUB | اختلاف القائمة والتفاصيل عن سياسة النشر الموثقة (§6). | G3/G4 معلّقتان حتى حسم الباك + دليل + إذن المالك. ممكن اعتماد Catalog مستقلًا. |
| B-UNIT | `products/card.ts:122–140`: معادلة `pricePer100` لـKG/L لا تحول الوحدة الكبيرة زي ما تتطلب عبارة «لكل 100 جم/مل». | لا تعرض هذه القيمة للوحدتين قبل تصحيح/تأكيد الباك؛ السعر الأساسي للعبوة من `sellingPrice`. لا patch حسابي في الفرونت. |
| B-TS | أربع `TS2769` فعلية في `lib/server/storeQueries.ts:9,17,25,33`. | إصلاح typing فقط في G1 بإذن بدء G1، ثم إعادة typecheck. لا خلط مع B-BUILD. |
| B-BUILD | آخر build موثق: `TurbopackInternalError` في `app/globals.css.css [app-client]` عند إنشاء عامل Node على Windows، `0xc0000142`، بدون `BUILD_ID`. | حاجب بيئة مسجّل، مش دليل عيب في الصفحة أو عذر لتجاهل TS. لو استمر: ارفق النص واطلب بيئة سليمة؛ ما تدّعيش تحقق production/browser. |
| D3-RM | `styles/animations.css:229–263`، تعريفات `.jar-fill-anim/.herb-float` اللاحقة تعلو على `animation:none` داخل قاعدة reduce عند نفس specificity. | **Day 3 follow-up مستقل، غير منفّذ وغير مأذون كجزء من Day 4.** إصلاحه واختباره في المتصفح يحتاجان تكليفًا منفصلًا. |
| R-VIS | لا دليل شامل على قبول Day 3 بصريًا، أو على توافر أمثلة ربط/باقة/نفاد وصفحتين في كل بيئة. | سجّل حدود العينة بدل اختراعها؛ لا تعديل البراند/WhatsApp/BackToTop، ولا ترقية 🟡 إلى 🟢 بلا مالك. |

## 13) قالب التقرير (يُستخدم بعد كل Gate وفي التسليم الأخير)

1. **Gate / الإذن / البيئة / التاريخ:** ما المطلوب وما لم يُفتح. **جدول** `Task ID | الحالة | الملف الفعلي | مسؤوليته | الدليل`.
2. **الفحص:** الأوامر، exit codes والأسطر الدالة؛ API: method/path/status وشكل مختصر بلا token؛ HTML أو لقطة/خطوات متصفح مقابل المتوقع. اكتب `لم يُختبر: السبب` عند غياب الدليل.
3. **الانحرافات والـdiff:** ملفات جديدة/معدّلة، ما كان موجودًا أصلًا، هل تغيّرت deps أو ملفات خارج النطاق؟ أي طلب قرار منفصل.
4. **المتبقي:** KS-1/2/3، B-API/B-PUB/B-UNIT/B-TS/B-BUILD، D3-RM منفصل؛ ما تحقق آليًا، ما شوهد، وما ينتظر اعتماد الشكل. التسليم الجزئي يُسمّى جزئيًا.
5. **قرار المراجعة:** توصية Astra وأسبابها/التصحيحات المطلوبة، ثم قرار المالك بخانة منفصلة. آخر سطر `⛔ STOP — Gate N`؛ لا تكليف تلقائي للـGate التالية.

**حالة الإصدار ده: DAY 4 GATE 5 FINAL HANDOFF READY — التقرير الكامل والأدلة والنتائج في `PROGRESS.md` §20 — ⛔ STOP قبل Day 5.**
