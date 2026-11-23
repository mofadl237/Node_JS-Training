# خطة الفرونت — 10 أيام (لوحة التحكم + متجر End-User بالتوازي)

> آخر تحديث: 2026-11-11. ده ملف الخطة والتاسكات — مش ملف تنفيذ.
> اقرأ `AGENTS.md` الأول: قواعد التقطيع (100/150 سطر)، التسمية (I/T)، RTK Query، next-intl، وملء الـ UI states.
> مرجع الباك إند: `Om-Eman/backend/docs/mvp-guest-auth-upgrade.md`.
> **تعديل 2026-11-13:** اقرأ القسم 0 الأول — بيغيّر الترتيب والمدة. ملف الألوان والحركة: `DESIGN_SYSTEM.md`.

---

## 0) تعديل الخطة بعد مراجعة الكود الفعلي (2026-11-13)

### 0.1 الوضع الحالي (بالأدلة)
- **الفرونت:** `create-next-app` فاضي (Next 16.4.5 / React 19.3). بيعمل compile. مفيش i18n ولا Redux ولا motion ولا RHF ولا shadcn ولا sonner ولا lucide. `zod` موجود في `node_modules` بس مش في `package.json`.
- **الباك:** المنطق كله والـ store API موجودين ✅. بس **مفيش migration ولا seed** (`prisma/migrations` مش موجود، و`AGENTS.md` الباك بيقول كده). يعني لو الداتابيز مش متعملة برّه الريبو → مفيش داتا حقيقية نبني عليها.
- **اللوجو:** مش في الريبو (`public/` فيه ملفات Next الافتراضية بس).

### 0.2 مشاكل لازم تتحل قبل الأيام (مش أفورة — كلها بتعطل الشغل)

| # | المشكلة | الدليل | الحل المقترح |
| --- | --- | --- | --- |
| 1 | **كارت المنتج مش هيتبني من الـ API الحالي** | `GET /api/products` العام مفيهوش صور ولا عبوات/أسعار، ومفيهوش فلتر `status` (بيرجع DRAFT كمان) | الباك يضيف `GET /api/store/products`: ACTIVE فقط، بصورة primary + أقل سعر + `compareAtPrice`، فلاتر `category/subcategory/featured/sort`، pagination |
| 2 | **فلاتر الـ list اللي الخطة معتمدة عليها مش موجودة** | `listXQuerySchema` فيها `q/page/limit/sort` بس. مفيش `isFeatured`, `productId`, `orderId`, `invoiceId`, `status`, `paymentStatus`, `categoryId` | نضيفها في **المولّد** `scripts/generate-modules.ts` (مش يدويًا — قاعدة الباك) |
| 3 | `banners` / `categories` العامة مفيهاش `isActive`/ترتيب مضمون | نفس الـ schema | فلتر `isActive` + `sortBy=sortOrder` في الـ store |
| 4 | **توكن الموظف** بيرجع في الـ body مش cookie | `POST /api/auth/login` → `{ employee, token }` | Next route handler (`app/api/session`) يخزّنه في httpOnly cookie ويعمل proxy — بدون تعديل في الباك |
| 5 | **تعارض بورت** | الباك `PORT=3000` وNext الافتراضي 3000 | الفرونت على `3001` (موجود في `CORS_ORIGIN`) |
| 6 | **الـ AGENTS.md قديم نسبيًا** | بيقول Next 15 و`middleware.ts` | Next 16: الملف اسمه `proxy.ts`، و`cacheComponents` مفعّل → أي `cookies()`/`fetch` dynamic محتاج `<Suspense>` أو `"use cache"` |
| 7 | **تعارض لون** | `AGENTS.md` §14 "green primary" وخطة 3.1 "أخضر+نحاس"، وإنت قلت بهارات/عطارة + أكتر من ثيم | الألوان في `DESIGN_SYSTEM.md` §2 (4 ثيمات). تتثبّت بعد اللوجو |

> بند 1 هو الأهم: من غيره مفيش هوم ولا كتالوج. بنود 1-3 شغل صغير في الباك (يوم تقريبًا) — أو نبدأ بـ MSW mock على نفس الشكل ونبدّله لما يخلص.

### 0.3 الجدول المعدّل (14 يوم بدل 10، ومرن)

10 أيام مش كفاية لـ: لوحة 38 module + متجر كامل + SEO + حركة كتير بجودة عالية + اختبار كل خطوة. الاقتراح:

| المرحلة | المحتوى | الأيام |
| --- | --- | --- |
| **0 — تجهيز** | داتابيز + migration + استيراد الكتالوج الحقيقي (CSV)، تثبيت الـ deps، حل بنود 4-6، اتفاق على اللوجو | 1 |
| **A — Foundation** | i18n/RTL، `baseApi`، الـ store، **Design System + Animation kit** (`DESIGN_SYSTEM.md`)، SEO base، صفحة `/design` داخلية | 2 |
| **C — Storefront** | هوم → كتالوج → منتج → سلة (fly-to-cart) → checkout → تتبع → حساب العميل | 5 |
| **B — Dashboard أساسي** | دخول + هيكل + منتجات + أقسام + طلبات + مدفوعات | 4 |
| **B — Dashboard تكميلي** | فواتير، شحن، عروض، كوبونات، محتوى، تقارير، عملاء، audit | 2 |

**ليه المتجر قبل اللوحة (ترشيحي)؟** هو الواجهة اللي عايزها تبقى أقوى مشروع، وقرارات الحركة والألوان بتتثبّت على حاجة بتشوفها بعينك. اللوحة CRUD متكرر، وبعد ما نمط الجدول/الفورم يتثبّت في أول 2-3 شاشات الباقي بيمشي بسرعة. ولحد ما اللوحة تتبني، المنتجات والطلبات بتتدار من Swagger/CSV. لو إنت شايف عكس (لوحة الأول زي الاتفاق القديم) قولي ونبدّل — الأيام القديمة تحت (2-7 لوحة، 8-10 متجر) تفضل مرجع لمحتوى كل شاشة.

### 0.4 طريقة الشغل (زي ما طلبت: واحدة واحدة)
لكل خطوة:
1. أكتب قايمة الملفات ومسؤولية كل واحد (من غير كود) → توافق.
2. أكتب الهيكل/الـ types/الـ hooks.
3. **نقرر الشكل والحركة مع بعض** (إنت تشوف في المتصفح، تقول عدّل/زوّد).
4. نختبر (`lint` + `build` + تجربة يدوية على الموبايل والـ RTL) ونقفل الخطوة.

مفيش خطوة بتتفتح قبل اللي قبلها تتقفل.

---

## 1) مراجعة الـ API بعد تعديل الداتابيز (رأي صريح)

راجعت الـ endpoints بعد آخر تعديل على الـ schema. الخلاصة:

### اللي كويس وجاهز (90% من لوحة التحكم)
- كل module له CRUD كامل: `GET /api/<model>` (قائمة paginated)، `GET /api/<model>:id`، `POST`، `PATCH /:id`، `DELETE /:id` — مع Zod validation وصف `AuditLog` تلقائيًا في الحساسة.
- القراءة العامة مفتوحة (بدون auth) في: `categories`, `subcategories`, `products`, `product-images`, `product-aliases`, `product-packages`, `product-bundle-components`, `search-synonyms`, `banners`, `static-pages`, `faqs`. ده اللي المتجر هيبني عليه.
- كل الكتابة: JWT + `authorize(OWNER, ADMIN)`.
- جداول الـ auth الداخلية (`AuthAccount`, `Session`, `AuthVerificationToken`) **مفيش لها endpoints عمدًا** — ممنوع نطلبها.

### تغييرات على شكل البيانات لازم الفرونت ياخد باله منها
| الحقل | التغيير |
| --- | --- |
| `Customer.phone` | بقى `nullable` — أي شاشة عملاء تعرض `-` لو `null`. |
| `Invoice` | `orderId` بقى عادي (ممكن أكتر من فاتورة لنفس الطلب)، **وحُذف `taxAmount`** — استخدم `taxTotal` و `taxRateSnapshot` بس. |
| `Order` | فيه `trackingToken` (متعرضهوش للعميل غير في صفحة التتبع) + العلاقة `invoices[]` (list مش object). |

### الفجوات — مفيش HTTP endpoints ليها لسه (الخدمات موجودة في الباك بس)
1. **Customer auth**: `POST /api/auth/login` الحالي للموظفين فقط. مفيش تسجيل عميل (Google / Email)، مفيش refresh/session.
2. **Guest checkout**: مفيش `POST` endpoint — الخدمة `guest-checkout.service.ts` جاهزة في الباك.
3. **تتبع الطلب**: مفيش `GET /api/orders/track/:trackingToken`.
4. **دمج سلة الضيف**: `mergeGuestCart` موجودة — مفيش endpoint.
5. **البحث**: دالة `search_products` في SQL ممتازة — مفيش endpoint يكشفها، ومفيش endpoint يكتب `SearchLog` من غير auth موظف.
6. **رفع إثبات الدفع**: الـ customer مفيش له endpoint يرفع proof على `Payment`.
7. **التقارير**: الـ views (`report_sales_daily`, `report_top_products`...) موجودة في الـ DB — مفيش endpoints للوحة التحكم.
8. **إشعارات العميل**: مفيش endpoint يعمل list إشعاراته.

> **القرار المطلوب:** أيام الـ Storefront (اليوم 8-10) معتمدة على 5 endpoints جداد من الباك (مسمية في الجدول تحت). لو الباك مش هيبعتها في وقتها، هنشتغل بالـ MSW/mock طبقة عشان الفرونت ميعتكلش.

---

## 2) شكل الردود الموحد (مصدر الحقيقة للـ RTK Query)

كل رد من الباك بيمر على `ApiResponse`:

```ts
// نجاح
{ success: true, message: string, data?: T, meta?: IPaginationMeta }
// 201 للإنشاء، 200 لغيره

//Paginated:
{
  success: true,
  message: string,
  data: IProduct[],
  meta: { page: number, limit: number, total: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean }
}

// خطأ (errorHandler):
{ success: false, message: string, code: "ORDER_NOT_FOUND" | ... }
```

الفرونت يعامل:
- `fetchBaseQuery` + `transformResponse` يفك الـ envelope ويخزن `data` و `meta` (نكتب `store/services/baseApi.ts` مرة واحدة في اليوم الأول).
- `code` من الخطأ يتترجم في `messages/ar.json` و `en.json` — ممنوع نعرض الـ code الخام للمستخدم.

---

## 3) متطلبات الجودة (ملزمة — دي الذوق الشخصي، مش اقتراحات)

### 3.1 الهوية والسايكولوجي (المتجر)
- **البراند أول ما الصفحة تفتح:** لون وعنوان وخط عربي فخم — أول 3 ثواني لازم يبان إن "أم إيمان" علامة أعشاب/طبيعة موثوقة، لايتمزح بيها. Palette أرضي: أخضر عشبي غامق + كريمي/بيج + لمسة نحاسية. Tokens في `globals.css` (Tailwind v4 `@theme`).
- **الثقة قبل الشرط:** سوشال بروف، ضمان الاستبدال، بيانات تواصل واضحة، آيات/عناصر طبيعية هادية، وأسعار واضحة من غير مفاجآت في الشيك آوت (بيبني psych-up للعميل المصري: "الدفع عند الاستلام موجود" لافتة في الهيرو وفي الشيك آوت).
- **السرعة نفسها سايكولوجي:** مفيش layout shift، صور lazy بـ placeholder، skeleton مطابق للشكل النهائي.
- **Animations:** `framer-motion` هادئة (fade/slide 150-300ms, spring للكروت، hover scale 1.02) — ممنوع الحركة اللي تبطئ أو تزعج. Countdown للعرض، Add-to-cart animation (المنتجة تطير للسلة) — دي بتبيع.
- **الشكل "مش معمول بالـ AI":** ممنوع purple gradient template، ممنوع صور picsum في أي مكان حقيقي، ممنوع Lorem ipsum، الكتالوج بكلمات أم إيمان الحقيقية، ميكروكوبي مصري محترم ("اطلب دلوقتي"، "الأسعار شاملة"). كل شاشة تتعمل مراجعة تفاصيل: spacing، ظلال، حروف.

### 3.2 SEO (أولوية قصوى — هدفنا قمة جوجل)
- Server rendering للمتجر بالكامل (App Router RSC) — ممنوع تقدّم بيانات الكتالوج من client fetch لو ينفع RSC + RTK Query للـ client فقط.
- `generateMetadata` لكل صفحة: title/description/canonical/OpenGraph/Twitter بالعربي والإنجليزي.
- `hreflang` + `alternates.languages` لكل صفحة (`ar`, `en`, `ar-EG`).
- **JSON-LD**: `Organization` + `WebSite` (SearchAction) في الـ layout، `Product` + `Offer` في صفحة المنتج، `BreadcrumbList` في كل صفحات الكتالوج، `FAQPage` في الـ FAQ.
- `app/sitemap.ts` + `app/robots.ts` — sitemap لكل منتج/قسم بأضعاف الـ locale.
- Slugs إنجليزية من الباك + URLs: `/{locale}/products/[slug]`.
- Core Web Vitals: LCP < 2.5s، CLS ≈ 0، INP < 200ms — الهدف Lighthouse ≥ 95 على صفحات المتجر.
- عناوين H1 واحد لكل صفحة، alt عربي وصفحي لكل صورة منتج.

### 3.3 اللغة
- `next-intl`: `ar` (افتراضي، RTL) + `en`. الـ dashboard كمان بالاتنين — نفس الـ messages.
- ممنوع نص عربي hard-coded في JSX. كل حاجة في `messages/`.

### 3.4 البنية (من AGENTS.md — تذكير سريع)
- ملف ≤ 150 سطر (خطر عند 200)، صفحة ≤ 30 سطر بتولّف sections، component مسؤولية واحدة، RTK Query للسيرفر ستيت، Redux للـ client ستيت (cart guest token, locale UI)، Zod لكل payload، وكل شاشة ليها skeleton/error/empty.

---

## 4) الخطة — 3 مسارات متوازية

| المسار | الوصف | الأيام |
| --- | --- | --- |
| **A — Foundation** | مشترك بين الاتنين: design system, i18n, API layer, SEO base | 1 |
| **B — Dashboard** | لوحة تحكم الموظفين | 2 - 7 |
| **C — Storefront** | المتجر للعميل | 8 - 10 (التحضير يبدأ مبكرًا) |

(قديم — الترتيب المعدّل في القسم 0.3) الـ Dashboard الأول زي ما اتفقنا، بس الـ storefront محتاج endpoints من الباك — نبلّغ الباك بالقائمة (قسم 1) من النهاردة.

---

### اليوم 1 — Foundation (مسار A)
**المخرجات:**
1. `app/[locale]/layout.tsx`: html/dir حسب الـ locale + خطوط (عربي: Google font فخم زي "Readex Pro" أو "IBM Plex Sans Arabic" — نجرب الاتنين ونثبت واحد) + `Providers`.
2. `store/baseApi.ts`: `fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL })` + فك الـ envelope + معالجة `success:false` + interceptors للـ employee JWT (httpOnly cookie من الباك لو متاح، غير كده Bearer من cookie غير متاح للـ JS).
3. `store/store.ts` + `Providers/ReduxProvider.tsx` + `Providers/ThemeProvider.tsx` (وضع داكن للوحة التحكم).
4. Design system: `components/ui/` (shadcn: Button, Input, Dialog, Table, Badge, Tabs, Select, Skeleton, Sheet, Toaster sonner) + tokens البراند في `globals.css` + `components/Animation/` wrappers (FadeIn, ScaleOnHover, PageTransition).
5. `interface/` + `IProduct/ICategory/...` الأساسية المطابقة لشكل بيانات الباك + `IApiResponse<T>` + `IPaginated<T>`.
6. `validation/` برميل + أول schemas.
7. SEO base: `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts` (دالة `buildMetadata`)، JSON-LD helper `components/shared/JsonLd.tsx`.
8. صفحات error/not-found مخصصة بالاتنين اللغتين (مش صفحات Next الافتراضية).

**ملفات متوقعة:** ~25 ملف صغير. **مفيش endpoints تُستهلك غير بتجربة اتصال واحدة** (GET /api/products?page=1&limit=1) للتأكد من الـ envelope.

---

### اليوم 2 — Dashboard: الدخول + الهيكل + المنتجات (مسار B)
- `app/[locale]/(Dashboard)/dashboard/login/page.tsx`: `POST /api/auth/login` → `{ success, data: { employee, token } }` (زي `auth/service.ts`). Token في httpOnly cookie — لو الباك مش مبعتها cookie، نطلبها منهم (أمان).
- `dashboard/layout.tsx` + `components/Dashboard/` (sidebar مع Collapse، topbar بالـ locale switcher والـ employee menu، breadcrumb). Sidebar: `data/` ثابت `dashboardNavLinks.ts`.
- **صفحة المنتجات**: جدول كامل — `GET /api/products?page&limit&sortBy&sortOrder&q` → paginated. Cols: الصورة (primary image)، nameAr، slug، productType badge، status badge، عدد الـ packages. Row actions: edit/delete/archive. URL state بالـ `q` + pagination (SearchParams مش useState).
- Skelton مطابق + empty state ("مفيش منتجات — أضف أول منتج") + error state.
- `components/Model/Product/` → AddProduct dialog shell + `ProductForm` (RHF + Zod من `validation/productSchema.ts`) + `ProductFields`.
- Mutations: `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id` مع invalidate tag + toast.

---

### اليوم 3 — Dashboard: الكتالوج الكامل (مسار B)
- **صفحة تفاصيل منتج** `dashboard/products/[id]/page.tsx`: tabs (بيانات، packages، صور، aliases، bundle components).
  - Packages: جدول + dialog — `GET/POST/PATCH/DELETE /api/product-packages` (`GET /api/product-packages?productId=...` — لو مش متدعم في list query نطلب إضافتها من الباك). حقول: sku, sizeValue/sizeUnit, sellingPrice, compareAtPrice (validation: أكبر من سعر البيع), stockStatus, isPublished.
  - Images: `product-images` + isPrimary toggle (partial unique index في الداتابيز هيرفض تاني primary — الفرونت يعمل unset الأول بصريًا).
  - Aliases: `product-aliases` + تحسين عربي (normalizedAlias بيتولد في الباك).
  - Bundle: `product-bundle-components` (لو productType = PREDEFINED_BUNDLE) مع رسالة خطأ من trigger "ممنوع bundle جوه bundle".
- **الأقسام**: `categories` + `subcategories` (nested tables + drag أو sortOrder arrows) + صور الأقسام.
- يعتمد: `GET /api/categories` (public read).

---

### اليوم 4 — Dashboard: الطلبات والمدفوعات (مسار B — قلب اللوحة)
- **صفحة الطلبات**: `GET /api/orders?status&paymentStatus&page...` + فلاتر tabs (RECEIVED, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELED, FAILED_DELIVERY).
- **تفاصيل الطلب** `dashboard/orders/[id]/page.tsx`: بنود الطلب (snapshots)، العنوان (`order-address-snapshots?orderId=` — نفس ملاحظة الـ query)، timeline `order-status-histories`، تغيير الحالة (`PATCH /api/orders/:id` + سجل `order-status-histories`) مع تأكيد قبل DELIVERED/CANCELED.
- **المدفوعات**: جدول `payments` + صف رفع الإثبات مكانة + أزرار تأكيد/رفض (rejectionReason dialog): `PATCH /api/payments/:id`. عرض `Order.paymentStatus` cache + مصدر الحقيقة من الـ Payment.
- شارات ألوان للـ status بألوان البراند (مش الطريق الحمراء/الخضراء العادية).

---

### اليوم 5 — Dashboard: الفواتير والشحن (مسار B)
- **الفواتير**: `GET /api/invoices` + تفاصيل + lines (`invoice-lines?invoiceId=`) + Void (reason dialog) + إعادة إصدار. عرض `taxTotal` و `taxRateSnapshot` — مفيش `taxAmount` (اتشال من الداتابيز). لو فيه أكتر من فاتورة لنفس الطلب: قائمة فواتير بجنب الـ order، الـ ISSUED بس هي اللي بتتحمل.
- **الشحنات**: `shipments` + `shipment-status-histories` (timeline) + `codSettledAt` (لغة: "الكابتن سلّم فلوس؟") + `shipping-carriers` و `shipping-tariffs` CRUD (محافظة × مدينة × تكلفة × ETA).
- إعدادات الشحن تظهر في صفحة الإعدادات العامة.

---

### اليوم 6 — Dashboard: التسويق والإعدادات (مسار B)
- **العروض**: `promotions` (form معقد: نوع، خصم، حدود استخدام، audience، targets) — targets تتعمل segmented control حسب `EPromotionScope` (ORDER/PRODUCT/PACKAGE/CATEGORY/SUBCATEGORY/SHIPPING) — كل scope شكله مختلف. `promotion-targets` CRUD.
- **الكوبونات**: `coupons` + عدّادات الاستخدام — نعرض الحد الفعلي (min بين العرض والكوبون) لأن دي القاعدة في الداتابيز.
- **`system-settings`**: العملة EGP، ضريبة `TAX_RATE` (slider/number)، معلومات التواصل.
- **المحتوى**: `banners`، `static-pages`، `faqs` — CRUD بسيط بجودة عالية (banner preview حقيقي).
- **`notifications`**: inbox موظفين + جدول إشعارات العملاء المرسلة.
- **`marketing-events`**: read-only جدول حالات CAPI (SENT/FAILED/SKIPPED) — للثقة الداخلية.

---

### اليوم 7 — Dashboard: التقارير + العملاء + الأمان (مسار B — إغلاق اللوحة)
- **العملاء**: `GET /api/customers` — عرض الإحصائيات الكاش (completedOrdersCount, totalSpent, firstOrderAt/lastOrderAt)، شارة Guest/مسجل/Merged، حالة الدمج (`mergedIntoCustomerId` link)، صفحة تفاصيل عميل بطلباته وعناوينه وسلاته.
- **التقارير** (محتاج endpoints من الباك — ممكن مؤقتًا نجمع من endpoints موجودة): `report_sales_daily` (chart recharts)، `report_top_products`، `report_customers_summary`. لو الباك عمل `/api/reports/*` نستهلكه، لو لأ: نجيب من endpoints موجودة ونحسب في `lib/reportTransforms.ts` — ونسجل ملاحظة إن الحساب أحسن يكون في الباك.
- **`audit-logs`**: read-only + فلاتر (module/result/actor).
- **`document-sequences`**: عرض/تعديل prefix و padding فقط (مع تحذير).
- **`search-logs`**: `report_zero_result_searches` — جدول "الناس بتدور على إيه ومش لاقياه" (ده كنز للـ owner).
- **المراجعة النهائية للوحة:** كل شاشة عليها الـ 5 states + responsive + dark mode.

---

### اليوم 8 — Storefront: الهوم + SEO الثقيل (مسار C)
- `app/[locale]/(Store)/page.tsx` (شرط: صفحة هوم SSR بالكامل):
  - Hero براند: كلمة أم إيمان + صورة منتج حقيقي + CTA "اتسوق دلوقتي" + لافتة COD والثقة (سايكولوجي الثقة).
  - Banners من `GET /api/banners` + Featured من `GET /api/products?isFeatured=true...`.
  - الأقسام من `GET /api/categories` كروت صور.
  - Animation: دخول متتابع (stagger) هادي + hover على الكروت.
- **JSON-LD**: Organization + WebSite(SearchAction) + BreadcrumbList.
- `generateMetadata` كامل + hreflang. الصورة الـ OG مخصصة (مش default).
- Header/Footer components: `components/ECommerce/Header/` (search bar ظاهر، السلة، اللغة، الـ wishlist) + `components/ECommerce/Footer/` (ثقة: تليفون، واتساب، سوشال، روابط SEO للـ static-pages والـ FAQ).
- Skeletons + empty/error states من أول يوم.

---

### اليوم 9 — Storefront: الكتالوج + المنتج + البحث + السلة (مسار C)
- **قائمة المنتجات** `/{locale}/products`: SSR + فلاتر URL (`?category=&subcategory=&sort=`) + pagination. Card: صورة، nameAr، سعر، سعر قديم مشطوب (psychology), badge bundle. **masonry/grid responsive.**
- **صفحة المنتج** `/{locale}/products/[slug]`: `GET /api/products/:id` (أو by-slug لو الباك زوّده — ملاحظة للباك: نحتاج lookup بالـ slug). packages selector (حجم/وزن)، bundle components واضحة بالسعر والـ savings، gallery، aliases بتظهر في الـ description، زرار مشاركة واتساب (المصري بيبعت للـ واتساب — ده بيبيع).
- **JSON-LD**: `Product` + `Offer` (sellingPrice من الـ package).
- **البحث**: input في الهيدر → صفحة نتائج + suggestions (`suggest_similar` لما الباك يكشف الـ endpoint). تسجيل `POST /api/search-logs` (محتاج endpoint عام من الباك).
- **السلة**: guest cart بـ `guestToken` (cookie) — الـ CRUD على `carts`/`cart-items` (محتاج من الباك: endpoints سلة للزائر بـ guestToken — الخدمة موجودة). drawer جانبي + header badge animation.

---

### اليوم 10 — Storefront: Checkout + التتبع + الحساب + الإطلاق (مسار C)
- **Guest checkout** (المسار الأساسي): خطوة واحدة قصيرة (تليفون + اسم + عنوان) — ميكروكوبي مصري، validation Zod، `POST /api/orders/checkout` (endpoint جديد من الباك — الخدمة جاهزة) → الرد فيه `orderNumber` + `trackingToken`.
- **صفحة نجاح الطلب** + **تتبع**: `/{locale}/track/[trackingToken]` → `GET /api/orders/track/:trackingToken` (endpoint جديد) — يعرض حالة الطلب فقط، من غير أي بيانات شخصية (الأمان في تصميم الـ trackingToken).
- **تسجيل/دخول العميل** (اختياري): Google + Email — `POST /api/customers/auth/*` (endpoint جديد من الباك) + claim تلقائي لطلباته القديمة + دمج سلة الضيف (`mergeGuestCart` endpoint).
- **الدفع**: صفحة رفع إثبات التحويل (InstaPay) → endpoint جديد، أو COD.
- **التحقق النهائي للإطلاق:**
  - Lighthouse ≥ 95 للمتجر (Performance/SEO/A11y) على الموبايل.
  - مفيش نص hard-coded، الـ RTL سليم 100% (padding/margin logical properties).
  - `npm run lint` + `npm run build` خضرا.
  - روابط الـ sitemap كلها تستجيب 200.

---

## 5) ملخص الاعتماد على الباك — اتنفذت (2026-11-11) + نواقص (2026-11-13)

> **تحديث 2026-11-13:** الجدول تحت صح للي اتنفذ، بس المراجعة لقت نواقص (كارت المنتج، كوبون، شحن، settings، cart/search غنيين، out-of-stock...). كلها في `backend/docs/STORE_BACKEND_TASKS.md` (B1-B16)، وبنقفل الباك قبل ما نبدأ المتجر.
> الصور: URLs نصية + Cloudinary (signed direct upload) — التفاصيل في قسم 6 من نفس الملف. الفرونت هيكتب `next/image` loader يضيف `f_auto,q_auto,w_*`.

الباك نفذ الجدول كله بنفس الاركتيكتشر. المسارات النهائية (كل الـ store تحت `/api/store`):

| # | Endpoint | الحالة |
| --- | --- | --- |
| 1 | `POST /api/store/checkout` (guest) | ✅ متاح |
| 2 | `GET /api/store/track/:trackingToken` | ✅ متاح |
| 3 | `POST /api/store/auth/register` + `verify-email` + `login` + `google` + `forgot-password` + `reset-password` + `logout` + `me` | ✅ متاح |
| 4 | `GET /api/store/cart` + `POST /api/store/cart/merge` (دمج الضيف بجلسة العميل — استخدم `mergeGuestCart` من `/store`؟ **لاحظ:** دمج السلة اتعمل عبر `cart merge` service — راجع مسار الـ endpoint لو اتغير) | ✅ متاح |
| 5 | `GET /api/store/search?q=` (+ تسجيل SearchLog تلقائيًا) | ✅ متاح |
| 6 | `POST /api/store/payments/proof` | ✅ متاح |
| 7 | `GET /api/reports/*` (10 تقارير — OWNER/ADMIN) | ✅ متاح |
| 8 | `GET /api/store/products/:slug` (بالـ slug للـ SEO) | ✅ متاح |

ملاحظات مهمة للفرونت:
- **جلسات العملاء = opaque token مش JWT**: هجّي `Authorization: Bearer <token>` والرد من الـ login فيه `{ customer, token, expiresInDays }`.
- **rate limits شغالة**: auth (10/15د)، checkout (20/15د)، proof (10/س) — الرد `429` بصيغة الـ envelope العادي، اعمل handling ليه.
- **`POST /api/store/cart/merge`**: دمج سلة الضيف في سلة العميل — يتنده بعد الـ login بالـ guestToken.
- الـ errors بتجي بصيغة `{ success: false, message, code }` — عيّن الـ `code` في الـ messages.

## 6) معايير القبول لكل يوم (checklist قبل ما نقفل اليوم)

1. `npm run lint` + `npm run build` خضرا.
2. ملفات ≤ 150 سطر، صفحات ≤ 30 سطر، component = مسؤولية واحدة.
3. كل شاشة: loading skeleton + error + empty + success feedback.
4. مفيش `any`، مفيش نص hard-coded، الـ RTL سليم، الوضع الداكن سليم.
5. في المتجر: metadata + hreflang + JSON-LD موجودة، والصور lazy بـ alt.
6. مفيش شكل "template AI": الألوان من tokens البراند، الميكروكوبي مصري حقيقي.

---

## Future Feature: Smart Egypt Address & Location System

> حالة القسم: **تخطيط مستقبلي فقط — التنفيذ غير مأذون**. تاريخ التخطيط: 2026-11-22.
> لا يفتح القسم ده أي Gate من Day 6، ولا يسمح بتعديل checkout الحالي أو الباك أو الداتابيز أو الدependencies.
> المرجع الباكي: `../../backend/docs/FUTURE_SMART_EGYPT_ADDRESS_SYSTEM.md`.

### 7.1 الوضع الحالي (Existing Implementation — بأدلة)

- `CustomerAddress` في الباك يخزّن `governorate` و`city` كنص، و`district/street/building/floor/landmark` كنصوص، مع `latitude/longitude` اختياريين. مفيش جداول مرجعية للمحافظات/المدن/الأحياء.
- Checkout الحالي يعرض حقول العنوان في `components/ECommerce/Checkout/CheckoutAddressForm.tsx` و`CheckoutAddressMainFields.tsx` و`CheckoutAddressOptionalFields.tsx`، عبر `useCheckoutForm.ts` و`validation/checkout.ts`.
- `store/shippingApi.ts` يقرأ `GET /api/store/shipping/areas` و`GET /api/store/shipping/quote`. قائمة المدن الحالية هي datalist مبنية على التعريفات الموجودة في الباك فقط، مش قائمة كل مدن مصر.
- `CheckoutShipping.tsx` يعرض `cost` وETA القادمين من الباك؛ لو مفيش تعريفة بيظهر `SHIPPING_AREA_NOT_CONFIGURED`، ومفيش شحن مجاني ضمني.
- مفيش اليوم: browser geolocation، reverse geocoding، address autocomplete، خريطة، بحث عن عنوان، أو إدارة/reference data للجغرافيا.
- البنية المتاحة للاستخدام عند الإذن: `store/baseApi.ts` لـRTK Query، `validation/*` لـZod، `interface/*`، `messages/{ar,en}.json`، `components/ui` و`components/shared`، و`next-intl` بالعربية والإنجليزية.

### 7.2 المشكلة والقاعدة المعمارية

المشكلة ليست "العميل مش عارف عنوانه" بس، بل إن العنوان نفسه ممكن يتبنى بشكل خاطئ، والمنطقة الجغرافية مش بالضرورة منطقة توصيل.

قاعدة لازم تتفهم قبل أي تصميم:

> **الجغرافيا الإدارية مش قابلية التوصيل.** وجود محافظة أو مدينة أو حي في مصدر خرائط أو قاعدة مرجعية لا يعني أن Om Eman توصّل إليها، ولا يعني أن الشحن مجاني. أي عنوان لازم يمر عبر قاعدة `ShippingTariff` الحالية، وغياب التعريفة يفضل خطأ صريح `SHIPPING_AREA_NOT_CONFIGURED`.

### 7.3 UX Approaches A–D (مقارنة تخطيطية)

| Approach | الفكرة | الإيجابيات | التكلفة/المخاطر | الحالة المقترحة |
| --- | --- | --- | --- | --- |
| **A — Structured manual entry** | محافظة ← مدينة ← حي/شارع/مبنى/دور/علامة مميزة، مع قوائم مرجعية صحيحة ورسالة واضحة للمنطقة غير المهيأة. | الأرخص، يعمل بدون provider، سهل في ar/en وRTL، قابل للاختبار، يحافظ على قاعدة الشحن الحالية. | ما بيحلش مشكلة العميل اللي مش عارف يكتب اسم الحي أو يقع في محافظة غلط. | **Baseline إلزامي**؛ لا يُلغى في أي خيار تاني. |
| **B — Browser location + reverse geocode prefill** | زر "استخدم موقعي" يطلب إذن المتصفح، ثم reverse geocoding يقترح محافظة/مدينة/شارع، والمستخدم يراجع ويعدّل. | سريع على الموبايل، يقلل الإملاء، تجربة حديثة. | HTTPS + إذن صريح + خصوصية + جودة غير مضمونة؛ Nominatim قد يرجع أقرب object أو شارع مختلف في المدن الكثيرة؛ الفشل/الرفض حالة طبيعية. | مرحلة لاحقة اختيارية بعد موافقة provider وconsent. |
| **C — Address search / autocomplete** | المستخدم يكتب جزءًا من العنوان فيظهر مرشّحون منظّمون من مصدر جغرافي أو مزوّد. | أسرع من القوائم الطويلة، يساعد الأسماء البديلة والإنجليزية. | تكلفة/رخصة/تغطية عربية، ونتائجه لا تساوي قابلية التوصيل؛ محتاج cache وrate limit. | مرحلة متقدمة بعد تثبيت reference data. |
| **D — Interactive map / drag pin** | خريطة + pin قابل للسحب، واستخدام الموقع الحالي، ثم عرض المقترح في الحقول. | أوضح للعقارات والشوارع الجديدة والعلامات المميزة. | أثقل حزمة وأداءً، تعقيد RTL/accessibility، سياسات tiles، ومخاطر الاعتماد على الخريطة كبديل للحقول. | اختياري تمامًا ومؤجل؛ لا يكون المسار الوحيد. |

**الترشيح التخطيطي:** hybrid متدرّج: A كأساس دائم، ثم B كـprefill اختياري، ثم C بعد توفر بيانات مرجعية موثوقة، وD للاستخدام الضروري فقط. أي prefill أو خريطة يجب أن يمر على نفس حقول Zod وأن يبقى قابلًا للتعديل اليدوي قبل الإرسال.

### 7.4 مصادر البيانات والـproviders (خلاصة)

التفاصيل والروابط الرسمية في مستند الباك. الخلاصة:

- OSM/Nominatim: policy تسمح استخدامًا تفاعليًا محدودًا بحد `1 request/sec` مع attribution وUser-Agent/Referer صالح، وتفضّل proxy+caching؛ غير مناسب كـSLA إنتاجي عالي الحجم.
- Photon: بديل OSM ببحث/عكس و`lang`؛ الاستخدام الكثيف قد يُخنق.
- geoBoundaries/GADM: حدود إدارية؛ geoBoundaries يتطلب attribution ولا يضمن uptime، وGADM ترخيصه غير تجاري بدون إذن، لذا يحتاج قرار قانوني.
- Google/Mapbox/OpenCage: جودة وتغطية مقابل تكلفة وقيود تخزين وربط بالخريطة؛ OpenCage free trial للتجربة فقط.
- أي خريطة تعتمد على OSM tiles لازم تحترم attribution وcache policy ومنع الاستهلاك الجماعي.

المالك لسه لم يختر مصدرًا أو مزوّدًا؛ لا يُفترض وجود حساب أو مفتاح أو رخصة.

### 7.5 Frontend Architecture المقترح — عند الإذن فقط

| الملف/المجلد المقترح | المسؤولية الواحدة |
| --- | --- |
| `interface/location.ts` | عقود `IGovernorate` و`ICity` و`IDistrict` و`IAddressCandidate` و`IReverseGeocodeResult` بالـ`I` prefix. |
| `validation/location.ts` | Zod لكل payload خارجي ومدخلات البحث والإحداثيات، برسائل من `messages/`. |
| `store/locationsApi.ts` | RTK Query endpoints عبر `baseApi` فقط، مع tag invalidation وعدم تكرار الطلبات. |
| `hooks/useBrowserLocation.ts` | طلب إذن المتصفح، حالات `idle/loading/denied/unavailable/success`، بدون setState متزامن في effect. |
| `hooks/useAddressSuggestions.ts` | تحويل استجابة البحث/الـreverse إلى مرشّح عنوان موحّد. |
| `lib/locationDisplay.ts` | تنسيق الاسم العربي/الإنجليزي واتجاه RTL/LTR ودمج الأجزاء داخل سطر عنوان واحد. |
| `components/ECommerce/Checkout/Location/*` | حقول المحافظة/المدينة/الحي، زر "استخدم موقعي"، قائمة الاقتراحات، اختياريًا خريطة صغيرة منفصلة. |
| `components/ECommerce/Address/*` | إدارة عناوين العميل المستقبلية، منفصلة عن checkout. |
| `messages/{ar,en}.json` | namespace جديد `checkout.location.*` و`errors.location.*` بنفس المفاتيح بالضبط. |

شروط بناء لاحقة:

- صفحة checkout تظل رقيقة؛ المنطق في hooks/services/components صغيرة ≤150 سطر.
- لا مكوّن يستدعي `navigator.geolocation` أو API مباشرة؛ كل ده عبر hooks/RTK Query.
- لا dependency جديدة بدون موافقة؛ لو احتُجت خريطة تُقارَن MapLibre/Leaflet أولًا.
- لا عرض raw provider message أو error code؛ كل خطأ يُترجم من `messages/`.
- لا تخزين إحداثيات أو نتائج مقترحة في localStorage بدون قرار خصوصية صريح.

### 7.6 UI States وAccessibility و i18n

- كل أداة جديدة لازم لها: loading skeleton، error، empty، success، وfeedback بعد الاختيار.
- زر الموقع: حالة واضحة لو الإذن مرفوض أو المتصفح مش مدعم أو الموقع خارج نطاق مصر المسموح؛ لازم يفضل الإدخال اليدوي شغال.
- reverse geocoding مقترح وليس حقيقة؛ المستخدم يوافق على الحقول أو يعدّلها قبل الإرسال.
- `aria-live` للاقتراحات، focus واضح، ترتيب tab منطقي، logical properties بدل left/right، واختبار 360px + desktop في ar/en والثيمات الأربعة.
- أي حركة بسيطة (مثل ظهور الاقتراحات) تتبع قواعد `motion/react` و`prefers-reduced-motion`؛ مفيش حركة تحجب المحتوى فوق الـfold.

### 7.7 مراحل مقترحة واعتماديات

| المرحلة | العمل | الاعتماد |
| --- | --- | --- |
| 0 — قرار | اختيار مصدر/مزوّد، الرخصة، الميزانية، ملكية تحديث البيانات، هل الخريطة مطلوبة؟ | موافقة مالك؛ لا كود. |
| 1 — أساس | بيانات مرجعية للمحافظات/المدن + قوائم تقليل الأخطاء، من غير تغيير قاعدة الشحن. | مصدر بيانات موثوق. |
| 2 — ربط الخدمة | ربط اختياري بين المرجع ومناطق الشحن مع اختبارات quote/checkout. | موافقة على النمذجة في الباك. |
| 3 — Location assist | زر استخدام الموقع + reverse geocoding عبر proxy مع consent وcache. | HTTPS + مزوّد + سياسة خصوصية. |
| 4 — Autocomplete | بحث عن عنوان/منطقة ونتائج منظّمة قابلة للتعديل. | Phase 1/2 + رخصة مزوّد. |
| 5 — الخريطة | pin/خريطة اختيارية تمامًا مع manual fallback. | قرار مالك + أداء/accessibility/tiles policy. |

### 7.8 قرارات مفتوحة

1. نبدأ بالقوائم المرجعية فقط ولا نضمّن geocoding من البداية؟
2. إيه هو مصدر الأسماء المعتمد لمصر، خصوصًا الأحياء والمناطق غير الرسمية؟
3. هل نحتاج مناطق شحن صريحة ولا يكفي نص `governorate/city` الحالي؟
4. إيه مدة الاحتفاظ بالإحداثيات وبيانات الاقتراحات المرفوضة؟
5. هل الخريطة التفاعلية مطلوبة في الإصدار الأول ولا مؤجلة؟

### 7.9 المراجع

- Planning كامل: `../../backend/docs/FUTURE_SMART_EGYPT_ADDRESS_SYSTEM.md`.
- عقود الشحن الحالية: `../../backend/docs/STORE_BACKEND_TASKS.md` B9/B10.
- سجل التخطيط: `./PROGRESS.md` §32.

**Planning status: DOCUMENTATION ONLY — IMPLEMENTATION NOT AUTHORIZED.**
