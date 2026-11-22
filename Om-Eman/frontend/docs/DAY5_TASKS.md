# اليوم 5 — البحث + سلة الضيف — تاسكات التخطيط والتفكيك

> آخر تحديث: 2026-11-21. **حالة المستند: DAY 5 GATE 5 COMPLETE — TECHNICAL HANDOFF READY — WAITING FOR OWNER REVIEW.**
> **المدير/المراجع:** Astra. **المنفّذ المقترح:** GLM. **المالك:** صاحب القرار في النطاق، العقود، الشكل، فتح كل Gate والانتقال للي بعدها.
> المسارات نسبية إلى `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. هذا المستند سجل تخطيط ومراجعة Day 5؛ نُفّذت Gates G0–G4 بإذونات مالك منفصلة، واكتمل التدقيق النهائي في G5. لا يمنح هذا السجل وحده اعتمادًا بصريًا أو انتقالًا تلقائيًا.

> **تحديث الحالة الفعلية بعد G5:** التصنيف `DAY 5 COMPLETE — TECHNICAL HANDOFF READY`. `D5-SEARCH` و`D5-CART` كلاهما `IMPLEMENTED` و`AUTOMATED CHECK PASSED`؛ `API VERIFIED`, `BROWSER VERIFIED`, `ASTRA REVIEWED`, و`OWNER APPROVED` غير متحققة. التفاصيل والأدلة في `docs/PROGRESS.md` §27.

---

## 0) قواعد التعامل — اقرأها الأول

1. قبل كل Gate: اقرأ `AGENTS.md`، آخر سجل في `docs/PROGRESS.md`، وقسم الـGate هنا. تحقّق من وجود إذن مالك **صريح باسم الـGate**، وافحص `git status` والكود قبل أي تعديل. أي اختلاف عقد أو قرار غير واضح ⇒ سجّله واسأل؛ لا تخمّن.
2. منفّذ واحد فقط في كل وقت: GLM يعرض قائمة الملفات ومسؤولية كل ملف، ينفّذ Gate واحدة مصرّح بها، يشغّل فحوصها، يراجع الـdiff والملفات الجديدة غير المتتبعة، يحدّث `PROGRESS.md`، يسلّم التقرير ويقف. Astra يراجع ولا يعدّل بالتوازي.
3. حتى مع توصية Astra بالقبول، الانتقال للـGate التالية أو اعتماد الشكل النهائي يحتاج موافقة المالك. لا يُترجم «كود جاهز» إلى «اعتماد بصري 🟢».
4. نفس App Router، نفس `Providers/` وترتيبهم، نفس `interface/` و`components/Skelton/` بالأسماء الحالية. ممنوع restructure، design system ثاني، provider/slice/fetch wrapper موازٍ، أو تغيير استراتيجية الكاش العامة.
5. `@/` imports، TypeScript strict، `I` للـinterfaces و`T` للـunions، ملف لكل مسؤولية، استهدف ≤150 سطر وحد أقصى 200، والصفحة للتركيب فقط (هدف ≤30). لا `any`، لا casts لإسكات أخطاء، لا نصوص مستخدم hard-coded، لا ألوان خام.
6. مفيش dependencies، edits للباك/DB/migrations/seed/npm scripts/config/n deployment، ولا commit/push/deploy. مفيش mock/MSW/بيانات تجريبية في صفحات المتجر؛ fixtures `/design` المعنونة تبقى معزولة.
7. في كل تقرير افصل صراحة: **منفّذ في المصدر / فحص آلي ناجح بدليل / شوهد في متصفح / 🟢 اعتمده المالك / ⛔ محجوب أو لم يُختبر**. HTTP 200 مش دليل إن زرار أو drawer اشتغل.
8. العقود من مصدرين فقط: `backend/src/modules/store/**` و`backend/docs/STORE_BACKEND_TASKS.md` + المتطلبات المحفوظة في `DAY4_TASKS.md:43-53`. الخطة القديمة `FRONTEND_TASKS_10_DAYS.md:238-243` مرجع تاريخي للمحتوى؛ لو تعارضت، المُقدَّم هو `DAY4_TASKS.md` والكود الحقيقي. لا `POST /api/search-logs`، لا endpoint اقتراحات مختلق، لا cookie ثاني، لا تخزين سلة موازٍ في Redux.
9. هذه الوثيقة نفسها ناتجة عن جلسة تخطيط/قراءة فقط. لم تُنشأ في هذه الجلسة ملفات implementation، ولم تُفتح Gate، ولم تستبدل حالة Day 4 النهائية.

---

## 1) الهدف والنطاق

### 1.1 الهدف
- **D5-SEARCH:** حقل بحث ظاهر في الهيدر يرسل استعلامًا محلي اللغة إلى صفحة نتائج `/{locale}/search` تحتفظ بـ`q` في الرابط، وتعرض نتائج حقيقية بنفس `ProductCard`، واقتراحات عند صفر نتائج، وحالة error حقيقية عند فشل الطلب، مع `WebSite.SearchAction` يشير للرابط الفعلي بعد وجود الصفحة.
- **D5-CART:** رابط الهيدر يفتح `/{locale}/cart` (KS-3)، مع drawer جانبي وbadge يعتمد على `itemsCount` الحقيقي من الباك، وعرض سلة الضيف بعد reload، وتعديل الكمية وحذف البند، وعرض المنتج/العبوة/الصورة/السعر/التوفر/`subtotal` من الرد الحقيقي، مع الحفاظ على fly-to-cart وbounce وcount-up.

### 1.2 داخل النطاق
- Search: `lib/searchQuery.ts` أو ما يعادله لتطبيع `q/limit`؛ استعلام سيرفر عبر `lib/server/*`؛ صفحة نتائج SSR؛ reuse لـ`ProductCard`؛ `EmptyState`/`ErrorState`/Skeleton؛ رسائل ar/en؛ `WebSite.SearchAction`.
- Cart: توسيع `store/cartApi.ts` الموجود بـget/update/remove؛ badge حقيقي؛ صفحة `/cart`؛ drawer؛ quantity control؛ حذف بند؛ حالات empty/error/unavailable/success؛ free-shipping indicator فقط مع `freeShippingThreshold` حقيقي؛ رسائل ar/en.

### 1.3 خارج النطاق / موعده
- Checkout، الدفع، التتبع، حساب العميل، Dashboard، wishlist، countdown، وعود توفير غير مثبتة.
- إصلاح Turbopack/B-BUILD، تغيير `next.config.ts` أو CSS loader أو استراتيجية الكاش العامة، تعميم sitemap، إعادة هيكلة السلة أو الـProvider، تغيير الهيدر/الفوتر/AF بخلاف البنود المصرّح بها.
- دمج سلة الضيف بعد login (`POST /api/store/cart/merge`) مرتبط بيوم حساب العميل؛ لا يُطلب ولا يُنفّذ هنا.
- إغلاق Major fly-target الخاص بـG4 أو D3-RM؛ كلاهما يحتاج تكليف/إعادة فتح منفصل.

### 1.4 KS
- **KS-1 / KS-2:** أُغلقت في Day 4 في المصدر/API؛ الاعتماد البصري 🟡 ما زال قائمًا.
- **KS-3:** الهدف الأساسي لـD5-CART؛ يظل مفتوحًا حتى وجود صفحة `/{locale}/cart` عاملة من رابط الهيدر.

---

## 2) تدقيق الحالة الحقيقية قبل التخطيط

### 2.1 مصادر الحجة
- `frontend/docs/DAY4_TASKS.md:3,237`: Day 4 final handoff، STOP قبل Day 5.
- `frontend/docs/PROGRESS.md:1132-1192`: §20 Gate 5، توصية الاعتماد المشروط وكل القيود.
- `frontend/docs/DAY4_TASKS.md:43-53`: نقل D5-SEARCH/D5-CART والعقود المحفوظة.
- `frontend/docs/PROGRESS.md:4,16,34,50` أسطر تاريخية قديمة تقول «Day 4 خطة فقط / G0 لم تبدأ / 4 أخطاء TS»؛ **لا تُحذف**، لكنها superseded بـ§§15–20 وبـ`DAY4_TASKS.md:3`. تُضاف §21 جديدة في PROGRESS بدل تعديل التاريخ.
- كود الباك/الفرونت المقروء مباشرة أثناء التخطيط: انظر §4 و§5 أدناه.

### 2.2 تصنيف الأيام 1–4

| اليوم/البند | التصنيف | الحالة المبنية على الدليل | ما يُحمل لـDay 5 |
| --- | --- | --- | --- |
| Day 1 Foundation | Completed and verified | `PROGRESS.md:31,54-92`: كود + lint + build، والبصري 🟢 اعتمده المالك. اتصال الباك كان جزئيًا تاريخيًا. | لا شيء إلزامي؛ لا إعادة تنفيذ. |
| Day 2 Foundation + 2.5 | Completed and verified | `PROGRESS.md:32,118-570`: 24/24 مهمة، lint/build/check خضرا، البصري 🟢، وعيوب المراجعة D2-01…D2-09 أُصلحت في Day 2.5. | لا شيء إلزامي؛ بند A5 التاريخي انتهى عمليًا بظهور بيانات منتجات حقيقية في Day 4، لكنه لا يُعاد فتحه في Day 5. |
| Day 3 Storefront | Implemented but not fully verified | `PROGRESS.md:571-871`, `DAY3_TASKS.md:790-834`: shell/هوم/SEO/brand additions موجودة في المصدر؛ lint/check ناجحان؛ أخطاء TS الأربعة أُصلحت في Day 4 G1؛ الاعتماد البصري الشامل 🟡؛ build blocker ما زال مفتوحًا. | B-BUILD، R-VIS، D3-RM كـfollow-up مستقل، placeholder assets/social غير المكتملة. لا تُصلح داخل Day 5 دون إذن. |
| Backend B-PUB | Completed technically; negative runtime NOT-TESTED | `PROGRESS.md:1142,1156`: مطابق لسياسة القائمة، 9 slugs حقيقية 200، لكن الحالات السلبية الخمس لم تُختبر. | لا تعديل باك؛ استخدم الباك الحي كشرط G0 فقط. |
| Day 4 G1/G2 | Completed and accepted | `PROGRESS.md:1143,1153`: طبقة كتالوج + صفحة/filters/pagination؛ G2 مقبول؛ KS-1 مغلق في المصدر/HTML سابقًا. | 재사خ `catalogQuery` pattern للبحث مع اختلاف SearchLog. |
| Day 4 G3 | Completed and accepted with evidence gaps | `PROGRESS.md:1144,1154`: PDP/slug/schema/SEO؛ HTML/متصفح 🟡 بسبب B-BUILD. | لا إعادة فتح؛ استخدم `ProductCard`/`getStoreSettings`/helpers الموجودة. |
| Day 4 G4 | Completed and accepted with findings | `PROGRESS.md:1145,1155`: الاختيار والإضافة في المصدر؛ Major fly-target + minors مسجّلة. | Halt fly-to-cart/bounce/count-up أثناء بناء السلة؛ أي تغيير لهدف الطيران يحتاج إذن إعادة فتح G4. |
| Day 4 G5 | Completed documentation-only | `PROGRESS.md:1132-1192`, `DAY4_TASKS.md:3,237`: FINAL HANDOFF READY؛ Astra أوصت بـconditional technical acceptance. | لا Day 5 دون إذن مالك منفصل. |
| D5-SEARCH | Deferred — Not Started | `DAY4_TASKS.md:45,50`; `PROGRESS.md:47`. | كل الشاشتين/العقود في هذا المستند. |
| D5-CART | Deferred — Not Started | `DAY4_TASKS.md:46,51`; `PROGRESS.md:48`. | كل الشاشتين/العقود في هذا المستند. |
| Checkout/track/account | Deferred intentionally | `DAY4_TASKS.md:32`; `PROGRESS.md:36`. | لا يُلمس في Day 5. |
| No-longer-relevant | none | لا يوجد بند أُلغي؛ الأسطر القديمة superseded فقط. | لا حذف من السجل. |

### 2.3 تعارضات/قيود تاريخية تؤثر على Day 5
- `PROGRESS.md` رأسه ما زال يقول Day 4 غير مأذون؛ هذا دليل على تأخر تحديث المقدمة لا على الحالة الفعلية. يُضاف §21 بوضوح.
- `B-BUILD`: لا `BUILD_ID` في `.next/BUILD_ID`، `.next/server/BUILD_ID`، `.next/dev/BUILD_ID`؛ لذلك لا ختم production-ready ولا ادعاء HTML/متصفح نهائي.
- `R-VIS`: لم تكتمل مراجعة متصفح/responsive/themes/a11y/reduced-motion لـDay 3/4؛ Day 5 يحتاج مصفحته الخاصة ولا يرث اعتمادًا بصريًا.
- G4 Major: `ProductPackageSelector.tsx:19,28,38` يمرّر الحاوية كلها كمصدر fly، بينما `ProductCard.tsx:27,52` يمرّر الصورة. لا يُغيّر في Day 5 إلا بقرار مالك.

---

## 3) العقود الحقيقية — قراءة فقط

### 3.1 قواعد عامة
- Base frontend: `NEXT_PUBLIC_API_URL` = `http://localhost:3002/api` (`lib/config.ts:1-10`)؛ الفرونت على `:3001`.
- Success: `{ success: true, message, data, meta? }`. Failure: `{ success: false, message, code, details? }`.
- `baseApi.ts:11-30` يحوّل failure إلى `IApiError {status,message,code}`؛ `unwrapEnvelope` يخرج `{data,meta}`.
- Money/quantities decimal strings (`"200.0000"`)؛ لا تستخدم `number` للأسعار أو الكميات المعروضة. كمية الطلب نفسها `number` فقط في body validation.
- رسائل الخطأ المعروضة تأتي من `messages/{ar,en}.json` مفتاحية حسب `code`، لا من raw message/stack/SQL.

### 3.2 Search — مصدر الحقيقة
- Endpoint: `GET /api/store/search` (`backend/src/modules/store/search/routes.ts:10-15`).
- Query params (`backend/src/modules/store/search/validation.ts:3-7`): `q` مقطوع مسافاته وطوله 1–200؛ `limit` int 1–50 وافتراضي 20؛ `sessionId` اختياري 5–100.
- البيانات (`backend/src/modules/store/search/service.ts:23-33`): `data.results: IStoreSearchResultRow[]`، `data.suggestions: IStoreProductCard[]`، `data.searchLogId: string | null`.
- كل نتيجة/اقتراح هي `IStoreProductCard` حقيقية (صورة/سعر/قسم)؛ النتائج تزيد بـ`matchTier`, `score`, `matchedTerm`. الاقتراحات تأتي من `suggest_similar` فقط عند صفر نتائج (`service.ts:75-118`).
- كل استدعاء ناجح يكتب `SearchLog` (`service.ts:85-96`)؛ لذلك أي caching للبحث قد يمنع التسجيل. القرار المبدئي: مسار بحث غير cached داخل `lib/server/*`، مع إبقاء سياسة الكاش العامة كما هي؛ يُعرض على Astra/Mالك في G1 قبل implementation.
- ممنوع: `POST /api/search-logs`، endpoint `/suggest` مختلق، أو استنتاج اقتراحات محلية من القائمة.

### 3.3 Cart — مصدر الحقيقة
- Endpoints (`backend/src/modules/store/cart/routes.ts:19-24`):
  - `GET /api/store/cart?guestToken=...` — `guestToken` اختياري؛ **قد ينشئ سلة**.
  - `GET /api/store/cart/:guestToken` — يقرأ سلة قائمة فقط؛ لا ينشئ.
  - `POST /api/store/cart/:guestToken/items` — body `{ productPackageId: string, quantity: number }`؛ `quantity` >0 و≤1000.
  - `PATCH /api/store/cart/:guestToken/items/:itemId` — body `{ quantity: number }`؛ >0 و≤1000.
  - `DELETE /api/store/cart/:guestToken/items/:itemId` — يحذف بند السلة.
  - `POST /api/store/cart/merge` — مملوك ليوم العميل؛ خارج Day 5.
- Token: `om_cart_token` في `lib/cartToken.ts:1-19` عبر `localStorage` فقط.Backend `guestTokenParamSchema`: `/^[A-Za-z0-9_-]{20,64}$/`. لا cookie/new key.
- `IStoreCart` (`backend/src/modules/store/cart/types.ts:32-39`): `id`, `guestToken`, `status`, `itemsCount: number`, `lines: ICartLine[]`, `subtotal: string`.
- `ICartLine`: `id`, `quantity: string`, `priceAtAdd: string | null`, `package: ICartPackageSnapshot | null`.
- `ICartPackageSnapshot`: `id`, `sku`, `sellingPrice`, `isAvailable`, `nameAr`, `productId`, `productSlug`, `productNameAr`, `productNameEn`, `imageUrl`, `sizeValue`, `sizeUnit`, `compareAtPrice`, `stockStatus` (`types.ts:5-23`).
- `isAvailable = isActive && isPublished && stockStatus === "IN_STOCK"` (`service.ts:91-94`). إضافة OUT_OF_STOCK مسموحة في الباك؛ الواجهة تعرضها كغير متاحة ولا تسمح بزيادة الكمية/طلبها.
- أخطاء متوقعة: `CART_NOT_FOUND` 404، `CART_ITEM_NOT_FOUND` 404، `CART_NOT_ACTIVE` 400، `PACKAGE_NOT_SALEABLE` 400، `VALIDATION_ERROR` 400. لا تفترض أن 4xx خطأ مستخدم دائمًا.
- `itemsCount` = مجموع الكمية (`service.ts:115`)؛ `subtotal` محسوب في الباك (`service.ts:17-25`)؛ لا تحسبه في الفرونت ولا تعرض سعرًا بديلًا.
- الخطة القديمة ذكرت cookie وCRUD على `carts/cart-items` (`FRONTEND_TASKS_10_DAYS.md:243`)؛ هذا superseded بعقد `/store/cart` الحالي وبـ`DAY4_TASKS.md:51`.

### 3.4 المجاني/الشحن
- `IStoreSettings.freeShippingThreshold: string | null` في `interface/store.ts:68-75`؛ `null` يعني «لا تعرض رقمًا».
- استخدم `getStoreSettings()` الموجود؛ لا تخترع حدًا، لا تحسب تكلفة شحن، لا تعدّل `shipping.service`.

---

## 4) الموجود فعليًا في الفرونت — أعد استخدامه

| الاحتياج | الموجود | القرار |
| --- | --- | --- |
| Envelope/base query | `store/baseApi.ts` | توسيع `cartApi.injectEndpoints` فقط؛ لا `fetch` مباشر ولا API slice موازٍ. |
| سلة الضيف | `store/cartApi.ts:37-60`: `getOrCreateCart`, `addCartItem`, tag `Cart`، hooks | أضف `getCartByToken`, `updateCartItem`, `removeCartItem`؛ احتفظ بالـtag والـoverride الحاليين. |
| Token | `lib/cartToken.ts` | استخدم `readCartToken/writeCartToken`؛ اقرأ في effect/useSyncExternalStore لتجنب hydration mismatch. |
| الإضافة الحالية | `hooks/useAddToCart.ts:45-76` | لا تغيّر تسلسل GET→write→POST ولا قفل `inFlight`؛ أي تحسين fly-target يحتاج إذن منفصل. |
| رابط السلة/الهدف | `components/ECommerce/Header/CartLink.tsx`, `components/Animation/CartBounce.tsx`, `lib/routes.ts:8` | حافظ على `CART_HREF` و`data-cart-target` مرة واحدة؛ أضف badge/count-up/pulseKey دون تغيير target. |
| بطاقات النتائج | `components/Card/ProductCard.tsx`, `components/ECommerce/Home/FeaturedGrid.tsx` | استخدم نفس البطاقة/الشبكة؛ لا نسخة search-card. |
| قراءات المتجر | `lib/server/storeFetch.ts`, `lib/server/storeQueries.ts`, `"use cache"` الحالي | استخدم النمط للقراءات؛ البحث تحديدًا يُعرض قرار عدم الكاش في G1 بسبب SearchLog. |
| SEO | `lib/seo.ts`, `lib/jsonld.ts:48-54`, `components/shared/JsonLd.tsx`, `components/ECommerce/StoreJsonLd.tsx` | وسّع `buildWebSiteJsonLd` بـSearchAction فقط بعد وجود route النتائج. |
| الحالات | `EmptyState`, `ErrorState`, `components/Skelton/*`، `PriceTag`، `StoreImage`، `Badge`، `Button`، `Input` | أعد الاستخدام؛ لا مكوّن «search error» أو «cart price» جديد بدون حاجة. |
| الترجمة | `messages/ar.json`, `en.json` — مفاتيح متطابقة (169 حاليًا) | أضف namespaces `search` و`cart` بالتساوي؛ ICU مفردة `{count}` فقط. |
| الهيدر | `components/ECommerce/Header/StoreHeader.tsx:7-19` | أضف `SearchForm` في مكان ظاهر؛ لا تغيير للبراند/اللغة/الثيم. |

---

## 5) جرد الملفات المتوقع — أسماء متوقعة، ليست إذن إنشاء

> كل ملف جديد يجب أن يمرّ باختبار «مسؤولية واحدة». لو ملف موجود يؤدي نفس الدور، أعد استخدامه وسجّل الاسم الفعلي. لا تُنشأ ملفات Gate لاحقة قبل إذنها.

### 5.1 Search

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `lib/searchQuery.ts` | جديد | تطبيع `q/limit` من `searchParams` غير الموثوقة؛ قيم افتراضية؛ لا slug/allowlist خاصة بالتصنيف. |
| `validation/storeSearch.ts` + `validation/index.ts` | جديد/تعديل | Zod لحدّ القراءة وللمدخل؛ لا يثق بالـenvelope الأعمى. |
| `interface/store.ts` + `interface/index.ts` | تعديل | `IStoreSearchResult`, `IStoreSearchResultRow` مبنيان على `IStoreProductCard`؛ لا DTO موازٍ. |
| `lib/server/storeQueries.ts` | تعديل | `getStoreSearch(q, limit)` عبر `storeFetch`؛ قرار الكاش/عدمه موثّق في G1. |
| `lib/routes.ts` | تعديل | `searchHref(q)` أو `SEARCH_PATH`؛ لا `/search/` hard-coded في المكوّنات. |
| `components/ECommerce/Header/SearchForm.tsx` | جديد | نموذج GET صغير يرسل `q` لصفحة النتائج؛ إدخال/إرسال/aria/i18n فقط. |
| `components/ECommerce/Header/StoreHeader.tsx` | تعديل | تركيب `SearchForm` في الهيدر دون تغيير بقية العناصر. |
| `app/[locale]/(Store)/search/{page,metadata,loading}.tsx` | جديد | صفحة رفيعة + metadata للنتائج + loading؛ لا fetch داخل JSX. |
| `components/ECommerce/Search/{SearchSection,SearchResults,SearchState}.tsx` | جديد | تركيب/عرض/حالات؛ `ProductCard` يعرض النتائج والاقتراحات. |
| `components/Skelton/SearchSkeleton.tsx` | جديد | skeleton بنفس أبعاد شبكة النتائج. |
| `lib/jsonld.ts` + `components/ECommerce/StoreJsonLd.tsx` | تعديل | `WebSite.SearchAction` برابط `/{locale}/search?q=...` فعلي. |
| `messages/{ar,en}.json` | تعديل | `search.*` للعنوان/الplaceholder/النتائج/الاقتراحات/empty/error. |

### 5.2 Cart

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `store/cartApi.ts` | تعديل | إضافة get-by-token/update/remove مع invalidation لـ`Cart`؛ لا إعادة هيكلة، لا localStorage ثانٍ. |
| `hooks/useCartToken.ts` | جديد متوقع | قراءة آمنة للـtoken مع useSyncExternalStore/effect؛ لا قراءة أثناء render. |
| `hooks/useCartBadge.ts` | جديد | يقرأ السلة بالتوكن فقط عند وجوده؛ يرجع `itemsCount` وisEmpty؛ لا ينشئ سلة للـbadge. |
| `components/ECommerce/Header/CartLink.tsx` | تعديل | يعرض badge من `itemsCount` مع CountUp وbounce؛ يحافظ على الرابط و`data-cart-target`. |
| `app/[locale]/(Store)/cart/{page,metadata,loading}.tsx` | جديد | صفحة `/cart` رفيعة + metadata + loading (KS-3). |
| `components/ECommerce/Cart/{CartDrawer,CartLine,CartQuantityControl,CartSummary,CartState}.tsx` | جديد | drawer/سطر/كمية/إجمالي/حالات؛ كل ملف مسؤولية واحدة. |
| `components/Skelton/CartSkeleton.tsx` | جديد | skeleton للصفحة/ال drawer. |
| `lib/cartToken.ts` | تعديل مشروط | فقط لو لزم subscribable store؛ لا تغيير لـKEY أوسلوك write. |
| `messages/{ar,en}.json` | تعديل | `cart.*` لكل العناوين، الأزرار، التوفير، الأخطاء، وإجمالي/شحن حقيقي. |

> Although `interface/cart.ts` would better match the global "contracts in interface" rule, moving the existing `IStoreCart*` types out of `cartApi.ts` is a cart restructure. Default: keep/extend the existing local contracts. Any move requires Astra + Owner approval inside G3.

---

## 6) أولويات backlog

### P0 — لازم لأي تسليم Day 5 مقبول
1. G0: تثبيت توفر `:3002` وعقود search/cart/settings في بيئة مأذونة، وتسجيل B-BUILD/visual gaps.
2. D5-SEARCH: `q` في الرابط، نتائج ببطاقات/أسعار/صور حقيقية، zero-result suggestions/empty، error منفصل،SearchLog محفوظ.
3. D5-CART: `/{locale}/cart` من الهيدر، drawer، badge حقيقي، get existing cart، update/remove، إعادة التحميل بنفس التوكن.
4. حماية الإضافة الحالية: لا طلبات مكررة، لا fly/toast قبل النجاح، لا تغيير هدف الطيران، لا token جديد.
5. رسائل ar/en متطابقة وRTL/LTR و4 ثيمات وموبايل 360px.

### P1 — مطلوب للاكتمال الوظيفي
1. `WebSite.SearchAction` بالرابط الفعلي.
2. free-shipping indicator فقط مع `freeShippingThreshold` غير `null`.
3. حالات `CART_NOT_FOUND`, `CART_NOT_ACTIVE`, `CART_ITEM_NOT_FOUND`, `PACKAGE_NOT_SALEABLE`, `VALIDATION_ERROR` مترجمة.
4. keyboard/focus/Escape لل drawer، reduced-motion،CountUp/bounce سليمة.
5. توثيق أي انحراف عن الأسماء المتوقعة أو أي قرار كاش.

### P2 — مرجأ/محجوب، لا يدخل Day 5 تلقائيًا
1. إصلاح B-BUILD/Turbopack (خارج النطاق صراحةً).
2. إعادة فتح G4 لإصلاح Major fly-target.
3. D3-RM (reduced-motion CSS specificity) كتكليف مستقل.
4. B-PUB negative runtime cases وحالات نشر إضافية.
5. Checkout/track/account/guest-merge.

---

## 7) خطة الـGates — 12 حقل لكل Gate

> كل Gate تقف وحدها. جدول الملفات في §5 «متوقع»؛ لا يُنشأ شيء قبل إذن هذه الـGate بعينها.

### Gate 0 — Pre-flight وتثبيت العقود (docs/baseline فقط)

1. **ID/الهدف:** G0؛ فصل سلامة البيئة والعقود عن implementation.
2. **الاعتماد/الإذن:** إذن مالك مستقل باسم G0؛ لا كود تطبيق.
3. **النطاق:** قراءة AGENTS/PROGRESS/هذا المستند/عقود الباك؛ `git status --short`؛ فحص منافذ `:3001/:3002`؛ آخر نتيجة build/dليلها.
4. **خارج النطاق:** لا search UI، لا cart UI، لا إصلاح build، لا api edits.
5. **الملفات المتوقعة:** `docs/PROGRESS.md` فقط لتسجيل الأدلة والقرارات.
6. **المسؤولية:** وثيقة فقط؛ صفر تعديل مصدر.
7. **العقود المطلوب تأكيدها:** search q/limit/data.suggestions/SearchLog؛ cart endpoints وguest token؛ `freeShippingThreshold`.
8. **الفحوص:** سجّل أوامر القراءة separately؛ لا tokens في التقارير؛ اذكر إن HTTP 200 ليس acceptance annotation.
9. **المتصفح:** لا Day 5 screen هنا؛ سجّل توفر المتصفح/قيوده فقط.
10. **القرارات المطلوبة:** مسار البحث غير cached مقابل تسجيل SearchLog؛ مصدر freeShippingThreshold؛ من يملك اختبار كتابة السلة.
11. **DoD:** baseline مؤرّخ + قرار منفصل « contracts صالح/محجوب » + كل blockers مسجّلة.
12. **STOP:** `⛔ STOP — Gate 0`

### Gate 1 — Search: البيانات والمدخلات

1. **ID/الهدف:** G1؛ تطبيع `q` وعقد القراءة + استعلام السيرفر.
2. **الاعتماد/الإذن:** G0 مقبول + إذن G1 + بيانات بحث حقيقية (عربي/إنجليزي/صفر نتائج).
3. **النطاق:** `lib/searchQuery.ts`, validation, `interface/store.ts`, `lib/server/storeQueries.ts`, `lib/routes.ts`.
4. **خارج النطاق:** لا هيدر، لا صفحة، لا JSON-LD، لا تعديل كاش عام.
5. **الملفات المتوقعة:** §5.1 data rows.
6. **المسؤولية:** لكل ملف مسؤولية واحدة؛ لا DTO موازٍ؛ لا `fetch` في JSX.
7. **العقد:** `GET /api/store/search?q=…&limit=…`؛ q 1–200، limit 1–50/default 20؛ `results/suggestions/searchLogId`.
8. **الفحوص:** `npm run lint`, `npm run check`, `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`, `git diff --check` — كل واحد على حدة.
9. **API smoke:** q عربي، q إنجليزي، صفر نتائج، q فارغ/ طويل جدًا؛ قارن `data` وأنواع الأسعار و`null` بالرد.
10. **المتصفح:** لا شاشة؛ سجّل أن الاستعلام لا يُخزَّن مؤقتًا بما يمنع SearchLog إن تم اختيار ذلك.
11. **DoD:** مدخلات غير صالحة لا تصل للباك؛ الفشل يبقى failure لا `[]`؛ لا تعديلات خارج النطاق.
12. **STOP:** `⛔ STOP — Gate 1`

### Gate 2 — Search: الهيدر والصفحة والـSEO

1. **ID/الهدف:** G2؛ تجربة البحث الكاملة للمستخدم.
2. **الاعتماد/الإذن:** G1 مقبول + إذن G2؛ لا تعتمد على cart Gates.
3. **النطاق:** `SearchForm`, StoreHeader, route search, SearchSection/Results/State, SearchSkeleton, messages, SearchAction.
4. **خارج النطاق:** لا cart، لا checkout، لا تغيير FeaturedGrid/ProductCard.
5. **الملفات المتوقعة:** §5.1 UI rows.
6. **المسؤولية:** الصفحة تركيب فقط؛ البطاقة الحالية تعرض النتائج؛ `q` محفوظ في الرابط وmetadata.
7. **العقد:** suggestions من نفس الرد عند صفر نتائج؛ ErrorState عند network/500/invalid؛ لا empty مزيف.
8. **الفحوص:** lint/check/tsc/diff؛ ثم `npm run build` منفصلًا مع تسجيل B-BUILD إن استمر.
9. **المتصفح/HTML:** `/ar/search?q=…` و`/en/search?q=…`، back/forward، H1 واحد، SSR مرئي، لا `opacity:0` فوق ال fold، 360px/desktop، 4 ثيمات، keyboard، reduced-motion.
10. **SEO:** `WebSite.SearchAction`برابط فعلي؛ JSON-LD قابل لـ`JSON.parse`؛ لا canonical مضلل عند فشل/ q فارغ.
11. **DoD:** نتائج حقيقية بنفس ProductCard؛ suggestions/empty/error منفصلة؛ Astra review مطلوب؛ الاعتماد البصري 🟡 حتى موافقة المالك.
12. **STOP:** `⛔ STOP — Gate 2`

### Gate 3 — Cart: الـAPI والـbadge

1. **ID/الهدف:** G3؛ توسيع RTK Query والقراءة الآمنة للسلة والعدد الحقيقي.
2. **الاعتماد/الإذن:** G0 مقبول + إذن G3؛ مستقل عن G1/G2.
3. **النطاق:** `cartApi.ts`, `useCartToken`, `useCartBadge`, `CartLink`، messages إن لزم.
4. **خارج النطاق:** لا صفحة/ drawer، لا مكوّنات عرض سلة، لا cart slice، لا cookie.
5. **الملفات المتوقعة:** §5.2 data/badge rows.
6. **المسؤولية:** get-by-token لا ينشئ سلة؛ update/remove يستهدف itemId؛ badge يعتمد على `itemsCount`.
7. **العقد:** Endpoints وvalidation وerror codes في §3.3؛ لا إنشاء سلة لمجرد رسم badge.
8. **الفحوص:** lint/check/tsc/diff؛ اختبار حالات token غائب/موجود/غير صالح؛ لا tokens في التقارير.
9. **المتصفح:** Badge يظهر بعد إضافة حقيقية، يبقى بعد reload، لا وميض hydration؛ CountUp/bounce يحترمان reduced-motion.
10. **القرار المعلّق:** نقل أنواع `IStoreCart*` إلى `interface/cart.ts` ممنوع افتراضيًا؛ يتطلب موافقة صريحة.
11. **DoD:** إضافة Day 4 ما زالت تعمل؛ لا GET عند غياب التوكن؛ لا tokens أو أرقام وهمية.
12. **STOP:** `⛔ STOP — Gate 3`

### Gate 4 — Cart: الصفحة والـdrawer والتعديل

1. **ID/الهدف:** G4؛ إغلاق KS-3 وتجربة السلة الكاملة.
2. **الاعتماد/الإذن:** G3 مقبول + إذن G4 + بيئة اختبار كتابة مأذونة.
3. **النطاق:** route `/cart`، CartDrawer/Line/QuantityControl/Summary/State، CartSkeleton، free-shipping indicator، messages.
4. **خارج النطاق:** checkout، merge بعد login، شحن محسوب، قيم مختلقة، تعديل ProductCard fly source.
5. **الملفات المتوقعة:** §5.2 UI rows.
6. **المسؤولية:** صفحة رفيعة؛ drawer يقرأ من RTK Query؛ السعر/التوفر/الإجمالي من الرد؛ مفيش حساب frontend للـsubtotal.
7. **العقد:** PATCH/DELETE على `itemId`؛ quantity number 1–1000؛ `isAvailable` تتحكم في disabled؛ free shipping فقط مع `freeShippingThreshold` حقيقي.
8. **الفحوص:** lint/check/tsc/diff/build منفصل؛ Network: GET عند الدخول بالتوكن، PATCH/DELETE واحدة لكل فعل، لا طلبات مكررة.
9. **المتصفح:** ar/en، RTL/LTR، 360px/desktop، 4 ثيمات، سلة فارغة/ناقصة/غير متاحة/فشل mutation، keyboard/Escape/focus، reduced-motion، حفظ الرابط/refresh/back.
10. **البيانات:** استخدم عناصر من الرد الحقيقي؛ لا seed وهمي، لا كشف guestToken في التقارير أو السجلات.
11. **DoD:** KS-3 مغلق في المصدر/المتصفح المسموح؛ القيم كلها من الباك؛ أي فجوة بصرية 🟡 موثّقة؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 4`

### Gate 5 — المراجعة والتسليم (Day 5 فقط)

1. **ID/الهدف:** G5؛ تقرير كامل وتوصية Astra، لا implementation.
2. **الاعتماد/الإذن:** إذن مالك بعد مراجعة Gates المفتوحة؛ لو search وحده جاهز يسمّى «تسليم جزئي D5-SEARCH».
3. **النطاق:** `docs/PROGRESS.md` و`docs/DAY5_TASKS.md` فقط لتحديث الحالة/الأدلة.
4. **خارج النطاق:** لا إصلاح عيوب، لا فتح Day 6، لا ختم production مع B-BUILD.
5. **الملفات المتوقعة:** الوثائق فقط.
6. **المسؤولية:** جدول Task ID/الحالة/الملف/الدليل؛ انحرافات؛ أوامر؛ KS-3؛ blockers.
7. **العقد:** راجع كل Gate مقابل §3 و§5 و§7؛ لا accepts بلا دليل.
8. **الفحوص:** استشهد بالأوامر المؤرّخة لكل Gate؛ لا تعيد build فاشل في حلقة.
9. **المتصفح:** اذكر ما شوهد فعليًا وما لم يُرَ؛ لا ترقية 🟡 إلى 🟢.
10. **الاعتماد:** Astra يوصي؛ المالك وحده يعتمد الشكل والانتقال.
11. **DoD:** تقرير صادق بالقيود؛ DAY5_TASKS يعكس الحالة الفعلية؛ STOP أخير.
12. **STOP:** `⛔ STOP — DAY 5 GATE 5 COMPLETE — WAITING FOR OWNER REVIEW`

---

## 8) أوامر التحقق (تُسجَّل وقت التنفيذ، لا تعليمات الآن)

### 8.1 من `Om-Eman/frontend` — بعد كل Gate كود
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
شغّل كل أمر منفصلًا؛ سجّل exit code وآخر سطور مفيدة. B-BUILD يُسجَّل ولا يُصلَح في Day 5.

### 8.2 قراءة العقود — G0/G1/G3
```bash
curl -i 'http://localhost:3002/api/store/search?q=كمون&limit=20'
curl -i 'http://localhost:3002/api/store/search?q=cumin&limit=20'
curl -i 'http://localhost:3002/api/store/search?q=zzzznotfound&limit=20'
curl -i 'http://localhost:3002/api/store/settings'
curl -i 'http://localhost:3002/api/store/cart'
```
لا ترسل guestToken حقيقيًا في تقرير؛ استخدم بيئة اختبار مأذونة لأي GET ب التوكن أو POST/PATCH/DELETE.

### 8.3 مصفوفة المتصفح/SSR
| السطح | الحد الأدنى |
| --- | --- |
| Search | q عربي/إنجليzy/zero results؛ رابط قابل للمشاركة؛ back/forward؛ H1 واحد؛ بطاقات حقيقية؛ ErrorState منفصل؛ SearchAction. |
| Cart | رابط الهيدر → `/{locale}/cart`؛ drawer؛ badge بعد إضافة/refresh؛ update/remove؛ فارغ/غير متاح/فشل؛ لا طلبات مكررة. |
|_common| `/ar` RTL و`/en` LTR؛ 360px وdesktop؛ الثيمات الأربعة؛ لا overflow أفقي؛ Tab/Enter/Escape/focus-visible؛ `prefers-reduced-motion`؛ SSR مرئي ولا `opacity:0` فوق ال fold. |

---

## 9) المخاطر والـblockers

| ID | الدليل/الخطر | الإجراء المسموح |
| --- | --- | --- |
| R-OWNER | لا إذن Day 5 حاليًا؛ هذه الوثيقة تخطيط فقط. | STOP؛ لا Gate قبل إذن مالك صريح. |
| B-BUILD | Turbopack `0xc0000142` بلا `BUILD_ID`. | سجّل؛ لا ختم production ولا إصلاح tooling في Day 5. |
| R-VIS | لا اعتماد متصفح شامل لـDay 3/4. | مصفوفة Day 5 مستقلة؛ 🟡 حتى اعتماد المالك. |
| R-API | BNك `:3002` توقفت سابقًا والتقطعت ثم عادت؛ توفر اليوم ليس ضمانًا للغد. | G0 يتحقق من البيانات الحية لكل Gate كتابة/قراءة. |
| R-SEARCH-CACHE | SearchLog يكتب على كل استدعاء؛ الكاش قد يخفي البحث. | قرار صريح في G1؛ لا تغيير كاش عام. |
| R-CART-TOKEN | `localStorage` يقرأ على client فقط؛ hydration/robe bad token ممكن. | useSyncExternalStore/effect؛ لا badge ي Created سلة. |
| R-CART-WRITE | PATCH/DELETE تحتاج بيئة اختبار مأذونة وبيانات حقيقية. | لو غير متاح: سلّم `NOT-TESTED`، لا تخترع بيانات ولا ترسل mutations. |
| R-FREE-SHIP | `freeShippingThreshold` قد يكون `null`. | أخفِ المؤشر؛ لا رقم افتراضي. |
| R-G4-MAJOR | هدف fly في PDP يطوّر الحاوية كلها. | لا تلمس؛ إعادة فتح G4 قرار منفصل. |
| R-DOCS-STALE | `PROGRESS.md:4,16,34,50` قديمة/superseded. | أضف §21، لا تحذف التاريخ ولا تعدّله. |
| R-PORTS | `next start` PID 20596 على `:3001`، backend PID 7228 على `:3002`، dev lock منع سيرفر جديد. | سجّل البيئة؛ لا توقف عمليات أو تبدأ dev جديد دون إذن. |

---

## 10) قالب تقرير كل Gate

1. **Gate / الإذن / البيئة / التاريخ:** ما فُتح وما لم يُفتح.
2. **جدول:** `Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل`.
3. **الفحص:** أوامر + exit codes + مقتطفات API/HTML بلا tokens أو أسرار.
4. **الانحرافات:** ملفات جديدة/معدّلة، untracked، dependencies، باك/DB، أي قرار معلّق.
5. **المتبقي:** KS-3، B-BUILD، R-VIS، Major fly-target، D3-RM، negative runtime.
6. **القرار:** توصية Astra + أسبابها، ثم خانة اعتماد المالك منفصلة.
7. آخر سطر دائمًا: `⛔ STOP — Gate N` (أو STOP النهائي في G5).

---

## 11) طلب مراجعة Astra

يرجى من Astra مراجعة هذا المستند مقابل:
- `AGENTS.md`، `frontend/docs/PROGRESS.md` §§15–20، `DAY4_TASKS.md:3,37-53`؛
- عقود `backend/src/modules/store/{search,cart}/**` و`STORE_BACKEND_TASKS.md` B11–B13؛
- اكتمال الـ12 حقلًا لكل Gate، وعدم خروج النطاق على Checkout/account/build tooling/cart restructure؛
- دقة تصنيف «Implemented but not fully verified» و«Deferred» و«Blocked»؛
- أن الملفات كلها «متوقعة» وليست إذن تنفيذ، وأن STOP موجود.

**قرار Astra:** PENDING — مراجعة G5 مطلوبة مقابل `docs/PROGRESS.md` §27، خصوصًا فصل statuses والانحرافات المكتشفة واستمرار `R-API-SEARCH` و`R-CART-WRITE` و`R-VIS` و`B-BUILD`.
**اعتماد المالك / إذن فتح Gate:** PENDING — لا اعتماد بصري أو انتقال تلقائي؛ المالك يقرر technical handoff والبيئة المطلوبة والانحرافات المؤجلة.

⛔ STOP — DAY 5 GATE 5 COMPLETE — WAITING FOR OWNER REVIEW
