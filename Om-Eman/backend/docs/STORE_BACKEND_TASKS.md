# مهام الباك إند المطلوبة قبل بناء المتجر (Storefront)

> آخر تحديث: 2026-11-13. الملف ده بيتسلّم لـ AI agent (أو مطور) ينفّذ الباك إند كله **قبل** ما نبدأ الفرونت.
> كل بند اتأكدت منه من الكود الحالي (مش افتراض). اقرأ `AGENTS.md` بتاع الباك الأول.
> الفرونت هيتكتب فوق الـ shapes المكتوبة هنا بالظبط — **أي تغيير في الـ shape لازم يتبلّغ**.

---

## 0) قواعد التنفيذ (من `AGENTS.md` — ملزمة)

1. نفس النمط: `module/controller/service/router/validation/types`. الـ store modules تحت `src/modules/store/<name>/`.
2. **المنطق في `service`** مش في الـ controller. الـ service مايبنيش HTTP response.
3. الاستيرادات المحلية تنتهي بـ `.js`. `import type` للأنواع. مفيش `any`.
4. أي `interface/type` يبدأ بـ `I`، وأي `enum` بـ `E`.
5. **ممنوع اختراع قيم أعمال** (ضريبة، حد شحن مجاني، عمولات...). لو القيمة مش موجودة في `SystemSetting` يرجع `null`.
6. الـ CRUD المولّد ممنوع يتعدّل يدويًا → التعديلات العامة تتعمل في `scripts/generate-modules.ts`.
7. المبالغ بترجع **string** (زي `ICartLine`) — مفيش `number` للفلوس في الـ responses.
8. كل رد بيمر على `ApiResponse`، والأخطاء بـ `code` ثابت (الفرونت بيترجم الـ code).
9. كل endpoint عام جديد ليه rate limit مناسب (زي `checkoutLimiter`) + Zod validation.
10. بعد كل بند: `npx tsc --noEmit` + `npm run build` + `npm test` + تحديث Swagger (`src/config/swagger.ts`) + `CHANGELOG.md` + `AGENTS.md`.

### الأولويات
- **P0** = بيعطّل الفرونت (مفيش هوم/كتالوج/checkout من غيره).
- **P1** = لازم قبل الإطلاق.
- **P2** = بعد ما المتجر يشتغل.

---

## 1) P0 — تجهيز الداتابيز (مفيش شغل فرونت بدونه)

### B1. Migration + قيود + إعدادات أساسية
الوضع: `prisma/migrations` مش موجود، ومفيش seed. اختبارات الـ integration (`checkout-claim`, `document-number`) بتعمل **skip** لما مفيش DB، يعني الـ checkout ممكن ما اتجرّبش على داتابيز حقيقية أبدًا.

المطلوب:
1. `npx prisma migrate dev --name init` على داتابيز **فاضية** (نسخة احتياطية الأول لو فيها حاجة).
2. `npx prisma db execute --file prisma/mvp/manual_constraints.sql`.
3. `scripts/seed-base.ts` يقرأ ملف `seed.config.json` (في `.gitignore`، وبيتكتب منه `seed.config.example.json`) ويعمل **إعدادات حقيقية بس**:
   - Employee الـ OWNER (الإيميل/الباسورد من الملف، مش hard-coded).
   - `DocumentSequence` لكل نوع بيستخدمه الكود (`ORDER`, `INVOICE`... راجع `document-number.service.ts`).
   - `SystemSetting` للمفاتيح في B5 — القيم من `seed.config.json` اللي صاحب المتجر بيملاه. **مفيش قيمة افتراضية متخمّنة.**
4. `npm run db:seed` في `package.json`.
5. شغّل الـ integration tests على الداتابيز دي وتأكد إنها بتعدي **فعلًا** (مش skip).

**القبول:** على DB جديدة: migrate → constraints → seed → `npm test` كلها خضرا بدون skip، وجرّب بـ curl: checkout كامل ثم track ثم proof.

> **بيانات لازم صاحب المتجر يدخلها** (مش شغل كود): الكتالوج (عن طريق CSV import الموجود)، شركات الشحن + `ShippingTariff` لكل المحافظات، `Coupon`/`Promotion` لو فيه، الـ `STORE_CONTACT`. بدون tariffs الـ checkout بيرجع `SHIPPING_AREA_NOT_CONFIGURED`.

---

## 2) P0 — endpoints المتجر الناقصة

> كلها تحت `/api/store`، عامة (من غير auth)، **ACTIVE فقط** ومش بترجع DRAFT/INACTIVE/ARCHIVED.

### B2. `GET /api/store/products` — قايمة المنتجات (كارت المنتج)
الوضع الحالي: `GET /api/products` العام مفيهوش صور ولا أسعار ولا فلتر `status` (بيرجع DRAFT).

Query: `page, limit(≤48), category(slug), subcategory(slug), featured=true, inStock=true, minPrice, maxPrice, sort=newest|price_asc|price_desc|name`.

الشرط: product `ACTIVE` + (`publishedAt` null أو ≤ now) + فيه **عبوة واحدة على الأقل** `isActive && isPublished`.

```ts
interface IStoreProductCard {
  id: string; slug: string;
  nameAr: string; nameEn: string | null; brand: string | null;
  productType: "FINISHED" | "PREDEFINED_BUNDLE"; isFeatured: boolean;
  primaryImage: { url: string; altAr: string | null; altEn: string | null } | null;
  secondaryImage: { url: string } | null;          // صورة الـ hover
  price: {
    from: string;                 // أقل sellingPrice بين العبوات المتاحة
    compareAtFrom: string | null; // compareAtPrice لنفس العبوة اللي عليها from
    hasMultiplePackages: boolean;
  };
  defaultPackageId: string;       // العبوة اللي عليها from
  saleEndsAt: string | null;      // ISO، لنفس العبوة
  inStock: boolean;               // في عبوة واحدة على الأقل IN_STOCK
  category: { slug: string; nameAr: string; nameEn: string | null };
  subcategory: { slug: string; nameAr: string; nameEn: string | null };
}
// الرد: data: IStoreProductCard[] + meta: IPaginationMeta
```
- ترتيب السعر على `price.from`. **query واحدة (أو اتنين) — مفيش N+1.**
- `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.

### B3. `GET /api/store/categories` — شجرة الأقسام
`data: [{ id, slug, nameAr, nameEn, descriptionAr, descriptionEn, imageUrl, sortOrder, productsCount, subcategories: [{ id, slug, nameAr, nameEn, imageUrl, sortOrder, productsCount }] }]`
- `isActive` فقط، مرتبة بـ `sortOrder`.
- `productsCount` = المنتجات اللي بتتحسب في B2 (نفس الشرط).

### B4. تحسين `GET /api/store/products/:slug`
ضيف في الرد الحالي (من غير ما تكسر الموجود):
`category`, `subcategory` (للـ breadcrumb)، `aliases: string[]`، `publishedAt`, `updatedAt`، `related: IStoreProductCard[]` (حد أقصى 8، نفس الـ subcategory، من غير المنتج نفسه)، وعلى كل عبوة `pricePer100g: string | null` (محسوبة من `sizeValue/sizeUnit` لو الوحدة وزن أو حجم قابل للتحويل، وإلا `null`).

### B5. `GET /api/store/settings` — إعدادات عامة (whitelist)
الوضع: `system-settings` محتاج auth موظف. المتجر محتاج رقم الواتساب والتواصل.

يرجع **فقط** المفاتيح دي (whitelist hard-coded في الكود — ممنوع تكشف باقي الـ settings):
```ts
interface IStoreSettings {
  currency: string;                                   // من DEFAULT_CURRENCY
  taxRate: number | null;                             // من TAX_RATE.rate
  freeShippingThreshold: string | null;               // FREE_SHIPPING_THRESHOLD.amount
  contact: { whatsapp: string | null; phone: string | null; email: string | null; workingHours: string | null; address: string | null };
  social: { facebook: string | null; instagram: string | null; tiktok: string | null; youtube: string | null };
}
```
مفاتيح `SystemSetting`: `TAX_RATE` (موجود) + `FREE_SHIPPING_THRESHOLD` `{amount}` + `STORE_CONTACT` + `STORE_SOCIAL`. أي مفتاح ناقص = `null`.

### B6. محتوى: بانرات وصفحات وأسئلة
- `GET /api/store/banners` — `isActive` وداخل نافذة `startsAt/endsAt`، مرتبة `sortOrder`. (الـ `/api/banners` العام بيرجع كل حاجة بدون فلتر).
- `GET /api/store/faqs` — `isActive`، مرتبة.
- `GET /api/store/pages/:slug` — الـ `StaticPage` المنشورة بالـ slug (الـ CRUD العام بالـ id بس). راجع حقول الـ SEO في الـ model.

### B7. `GET /api/store/sitemap` — للـ SEO
`{ products: [{ slug, updatedAt }], categories: [{ slug, updatedAt }], subcategories: [{ slug, updatedAt }], pages: [{ slug, updatedAt }] }` — الظاهر فقط. الفرونت هيبني منه `sitemap.ts`.

---

## 3) P0 — Checkout والكوبون والشحن

### B8. `POST /api/store/coupons/validate` — معاينة الكوبون (عشان الفرونت يعرض الخصم أو أنيميشن "غلط")
Body: `{ couponCode, items: [{ productPackageId, quantity }] }` (+ `optionalCustomer`).
- **ماتكتبش منطق جديد:** اسحب `resolveCoupon` من `guest-checkout.service.ts` لـ `services/coupon.service.ts`، واستخدمه في الاتنين بدون تغيير سلوك. مفيش كتابة في الداتابيز (مفيش redemption).
- نجاح: `{ valid: true, couponCode, discountType, discount: string, subtotal: string, discountedSubtotal: string }`.
- فشل: نفس الـ codes الموجودة (`COUPON_INVALID`, `COUPON_EXPIRED`, `COUPON_NOT_ACTIVE`, `COUPON_MIN_ORDER`, `COUPON_LIMIT_REACHED`, `COUPON_PER_CUSTOMER_REACHED`, `COUPON_NOT_FOR_CUSTOMER`) بـ HTTP 400.
- rate limit **أشد** (anti brute-force تخمين كوبونات)، مثلًا 10 / 15 دقيقة لكل IP — القيمة قابلة للتعديل.

### B9. الشحن: `GET /api/store/shipping/areas` و `GET /api/store/shipping/quote`
- `areas`: `[{ governorate, cities: [{ city: string | null, cost: string, etaMinDays: number, etaMaxDays: number }] }]` — من الـ tariffs `isActive` وشركتها `isActive` **فقط**. بيستخدمه الفرونت في dropdown المحافظة/المدينة، فمفيش حد يختار منطقة مش مضبوطة.
- `quote?governorate&city`: `{ cost, etaMinDays, etaMaxDays }` أو 400 `SHIPPING_AREA_NOT_CONFIGURED`.
- **نفس قاعدة الاختيار بالظبط** اللي في `readShippingTotal` (اسحبها لدالة مشتركة `resolveShippingTariff` والاتنين يستخدموها — ممنوع تتكرر القاعدة).

### B10. تعديل `POST /api/store/checkout`
الوضع: الرد `{ orderId, orderNumber, trackingToken }` بس، ومفيش اختيار طريقة دفع، ومفيش Payment row بيتعمل.

1. ضيف `paymentMethod: "COD" | "ONLINE_TRANSFER"` (إجباري، الفرونت دايمًا بيبعته).
2. داخل **نفس الـ transaction** أنشئ `Payment { method, status: PENDING, amount: grandTotal }`.
3. عدّل `StorePaymentService.submitProof` (**اقرأه كامل الأول** — اللي شفته إنه بيرفض لو آخر payment `PENDING`/`PROOF_UPLOADED`): بدل ما يرفض، يحدّث الـ row الـ `PENDING` من نوع `ONLINE_TRANSFER` لـ `PROOF_UPLOADED`، ويعمل row جديد فقط بعد `REJECTED`. والـ proof على طلب `COD` يرجع 400 `PAYMENT_METHOD_NOT_ONLINE`.
4. الرد يبقى:
```ts
interface ICheckoutResult {
  orderId: string; orderNumber: string; trackingToken: string;
  paymentMethod: "COD" | "ONLINE_TRANSFER";
  totals: { subtotal: string; discountTotal: string; shippingTotal: string; taxTotal: string; grandTotal: string; currency: string };
}
```
5. حدّث اختبارات `checkout-claim` للحالتين (COD / ONLINE_TRANSFER) + proof.

### B11. 🐞 ثغرة: المنتج الـ `OUT_OF_STOCK` ينفع يتطلب
الوضع: `EStockStatus` = `IN_STOCK | OUT_OF_STOCK`. `guest-checkout.service.ts:350` بيفحص `isActive && isPublished` بس، وكمان `cart/service.ts:148`. يعني عميل يقدر يطلب منتج خلص.
- Checkout يرفض بـ 400 `PACKAGE_OUT_OF_STOCK` (والرسالة فيها أي عبوة).
- إضافة للسلة: مسموحة، بس `isAvailable` في `ICartPackageSnapshot` يبقى `isActive && isPublished && stockStatus === IN_STOCK`.
- اختبار unit/integration للحالة.

### B12. إثراء الـ cart
`ICartPackageSnapshot` حاليًا فيه `id, sku, sellingPrice, isAvailable, nameAr` بس — الـ drawer مش هيعرض اسم المنتج ولا صورته. ضيف (من غير ما تشيل حاجة):
`productId, productSlug, productNameAr, productNameEn, imageUrl (primary), sizeValue, sizeUnit, compareAtPrice, stockStatus` + على الـ cart: `itemsCount`.
(ملحوظة: `loadCart` بيعمل query للعبوات أصلًا، زوّد الـ `select` بـ relation `product.images`).

### B13. إثراء البحث
`GET /api/store/search` حاليًا بيرجع `{productId,nameAr,nameEn,slug,isFeatured,matchTier,score,matchedTerm}` — مفيش صورة ولا سعر.
- كل نتيجة تبقى `IStoreProductCard` (من B2) + `matchTier/score/matchedTerm`. استعلام واحد إضافي بالـ ids، مش N+1.
- لو النتائج 0: رجّع `suggestions: IStoreProductCard[]` من دالة `suggest_similar` الموجودة في `manual_constraints.sql:294`.

---

## 4) P1

### B14. حساب العميل (لو هنعمل صفحة "حسابي")
الـ modules العامة `customerAddress` / `wishlistItem` / `order` بتاعة الموظفين. العميل محتاج نسخ `/api/store/*` بـ `authenticateCustomer` ومحصورة على ملكه:
- `GET /api/store/orders` (paginated) + `GET /api/store/orders/:orderNumber` (ملكه بس).
- `GET/POST/PATCH/DELETE /api/store/addresses`.
- `GET/POST/DELETE /api/store/wishlist`.
- `PATCH /api/store/auth/me` (الاسم/التليفون).

### B15. Cloudinary (قسم 5 تحت) — **P0 للصور، بس مش بيعطّل الهوم لو الصور اتحطت يدويًا**

### B16. اختبارات ومراجعة
- اختبار لكل endpoint جديد (unit للقواعد + integration لو فيه DB).
- مراجعة الـ Swagger: كل endpoint جديد موثّق بالـ shape بتاعه.
- تأكد إن `CORS_ORIGIN` فيه `http://localhost:3001` (الفرونت هيشتغل عليه) — موجود في `.env.example`.

## 5) P2
- CSV import: عمود اختياري `imageUrl` (ينشئ `ProductImage` primary) — يتحقق منه `cloudinaryUrlSchema`.
- حذف asset من Cloudinary best-effort لما `ProductImage` يتمسح.
- Payment proof بـ `type: authenticated` (سري) بدل عام + endpoint لـ signed delivery URL للوحة.
- `GET /api/store/orders/:orderNumber/invoice` (PDF) لو احتجناه.

---

## 6) Cloudinary — الصور

### 6.1 القرار
**الداتابيز بتخزّن URL كـ text فقط** (الأعمدة موجودة: `ProductImage.url`، `Category.imageUrl`، `Subcategory.imageUrl`، `Banner.imageUrl/mobileImageUrl`، `Payment.proofImageUrl`). مفيش تغيير في الـ schema.
- بنخزّن `secure_url` **زي ما Cloudinary رجّعه بالظبط**، من غير أي transformation في الـ URL (مثال: `https://res.cloudinary.com/<cloud>/image/upload/v1700000000/om-eman/products/zaatar-1.jpg`).
- الفرونت هو اللي يضيف `f_auto,q_auto,w_<size>` وقت العرض (custom loader لـ `next/image`). يعني نفس الصورة الأصلية تخدم كل المقاسات.

### 6.2 الرفع: signed direct upload (ترشيحي — الملف مايعديش على السيرفر)
المتصفح بيرفع على Cloudinary مباشرة بتوقيع من الباك. أوفر في الـ bandwidth، ومفيش `multer` للصور، والـ `API_SECRET` عمره ما بيطلع للفرونت.

env جديدة (في `.env.example` + `env.ts` + `IEnvConfig`):
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
dependency: `cloudinary` (للتوقيع بـ `cloudinary.utils.api_sign_request` بس).

**`POST /api/uploads/sign`** — `authenticate` + `authorize(OWNER, ADMIN)`
Body: `{ kind: "product" | "category" | "banner" }`
الرد:
```ts
interface IUploadSignature {
  cloudName: string; apiKey: string; timestamp: number; signature: string;
  folder: string;               // om-eman/products | om-eman/categories | om-eman/banners
  allowedFormats: string;       // "jpg,jpeg,png,webp"
  uploadUrl: string;            // https://api.cloudinary.com/v1_1/<cloud>/image/upload
}
```
الباراميترز اللي بتتوقّع: `folder`, `allowed_formats`, `timestamp` (والفرونت ملزم يبعتهم هما هما). `folder` بيتحدد من `kind` على السيرفر — **الفرونت مايختارش الفولدر**.

**`POST /api/store/uploads/sign-proof`** — عام، بس: Body `{ orderId, trackingToken }`، يتحقق إن الـ trackingToken بتاع الطلب ده، وإن الطلب `ONLINE_TRANSFER` ومفيش payment `CONFIRMED`. فولدر `om-eman/proofs`، rate limit زي `proofLimiter` (10/ساعة).

### 6.3 حماية الـ URL (مهم)
`proofImageUrl` endpoint عام وبيقبل أي URL (`z.string().url()`) — حد يقدر يحط رابط خارجي مضر يتفتح في لوحة التحكم.
- ملف `src/shared/cloudinary-url.ts` فيه `cloudinaryUrlSchema`: `https` فقط + host `res.cloudinary.com` + أول المسار `/<CLOUDINARY_CLOUD_NAME>/image/upload/` + طول ≤ 500.
- لو `CLOUDINARY_CLOUD_NAME` فاضي **وفي development فقط** → يرجع لـ `z.string().url()`. في production يرفض.
- يتطبق على: `ProductImage.url`, `Category/Subcategory.imageUrl`, `Banner.imageUrl/mobileImageUrl`, `proofImageUrl`.
- الـ CRUD مولّد، فالتطبيق يتم **في المولّد**: قاعدة بالاسم للحقول `url|imageUrl|mobileImageUrl|proofImageUrl` ثم `npm run modules:generate`. (ولا تطبّقها على `linkUrl/canonicalUrl/eventSourceUrl/pdfUrl`.)

### 6.4 إيه اللي يتحط على Cloudinary وبأي مقاسات (توصيات)
| النوع | الفولدر | المقاس | ملاحظات |
| --- | --- | --- | --- |
| صور المنتج | `om-eman/products` | **1:1، 1200×1200 على الأقل** | 3-6 صور للمنتج. الأولى `isPrimary` (خلفية نضيفة/دافية موحدة). التانية تظهر عند الـ hover في الكارت، فتبقى صورة مختلفة (زاوية/استخدام) |
| الأقسام | `om-eman/categories` | **1:1، 800×800** | نفس الأسلوب البصري لكل الأقسام |
| بانر الهوم (ديسكتوب) | `om-eman/banners` | **16:6، 1920×720** | الجزء المهم في النص (الكروب بيتغير) |
| بانر الهوم (موبايل) | `om-eman/banners` | **4:5، 1080×1350** | `mobileImageUrl` |
| إثبات التحويل | `om-eman/proofs` | أي (حد أقصى 5MB) | الفرونت يضغطه قبل الرفع |
| **مش على Cloudinary** | — | — | اللوجو، الأيقونة، الـ OG الافتراضي، الـ favicon → ملفات في `frontend/public/` (أسرع وبتتكاش مع الـ build) |

الأسماء: ASCII بس (kebab-case) لو هتتحدد يدويًا، مثال `zaatar-1`. مفيش مسافات ولا عربي.

### 6.5 لحد ما الـ endpoints تخلص
تقدر ترفع من Cloudinary Console يدويًا وتنسخ `secure_url` وتحطه في `POST /api/product-images` (أو في الـ CSV بعد P2). الـ `cloudinaryUrlSchema` هيقبله طالما من نفس الـ cloud.

---

## 7) ترتيب التنفيذ المقترح

1. B1 (داتابيز + seed + اختبارات حقيقية) — **أول حاجة، وكل اللي بعده بيتجرب عليها**
2. B11 (ثغرة OUT_OF_STOCK) — صغيرة وتأمينية
3. B2, B3, B4 (كتالوج)
4. B5, B6, B7 (إعدادات/محتوى/sitemap)
5. B9, B8, B10, B12 (شحن + كوبون + checkout + cart)
6. B13 (بحث)
7. Cloudinary (6.2 → 6.3)
8. B14 (حساب العميل) — ممكن يتأجل لما المتجر الأساسي يشتغل

## 8) تعريف الإنجاز (Definition of Done)

- [ ] DB جديدة تتبني من الصفر بأمر واحد (migrate + constraints + seed).
- [ ] `npx tsc --noEmit` + `npm run build` + `npm test` خضرا **بدون skip**.
- [ ] Swagger محدّث بكل endpoint جديد والـ shapes اللي فوق.
- [ ] Smoke test بـ curl: categories → products → product/:slug → cart add → coupon/validate → shipping/quote → checkout (COD و ONLINE_TRANSFER) → track → sign-proof → proof.
- [ ] `AGENTS.md` و`CHANGELOG.md` و`docs/PROJECT_OVERVIEW_AR.md` محدّثين.
- [ ] الـ shapes في الملف ده = الـ shapes في الكود (لو اختلفت، الملف يتحدّث وتبلّغنا).
