# ترقية الـ MVP: Guest Checkout + الحسابات + الترقيم بدون فجوات

> التاريخ: 2026-11-11.
> النطاق: `prisma/schema.prisma` + `prisma/mvp/manual_constraints.sql` + خدمات جديدة في `src/services/` + اختبارات في `tests/`.
> الهدف: تجهيز الداتابيز والمنطق للإطلاق الأول في السوق، بأمان إنتاجي، بدون ميزات خارج الطلب.

---

## 1) تعديلات الـ Schema (وليه)

| التغيير | السبب |
| --- | --- |
| `Customer.phone` بقى `String? @unique` | التسجيل بالإيميل/Google ممكن يحصل قبل ما يكون فيه تليفون، و checkout هو اللي يفرض التليفون على مستوى التطبيق. في PostgreSQL الـ unique بيسمح بأكثر من `NULL` فمفيش تعارض. **تأثيره على الـ claim:** المطابقة بالتليفون بقت أضعف (ممكن يكون `NULL`)، فالـ claim بقى لازم يعتمد على هوية **متتحقق منها** فعليًا — انظر قسم الأمان تحت. |
| جدول `AuthAccount` (provider GOOGLE/PASSWORD + `@@unique([provider, providerAccountId])`) | حساب واحد للعميل ممكن يشتغل بأكثر من هوية. الـ providerAccountId هو `sub` بتاع Google — ثابت ومش بيتغير، عكس الإيميل اللي ممكن يتغير. |
| جدول `Session` (يخدم Customer و Employee) | refresh/opaque token واحد مش جداول منفصلة. بيخزن **SHA-256 hash** فقط (`tokenHash`) + `expiresAt/revokedAt/userAgent/ip`. CHECK في الـ SQL يمنع أن الصف يبقى لاتنين أو ولا حد. الـ JWT access tokens مفيش له صفوف هنا (stateless). |
| جدول `AuthVerificationToken` (`EMAIL_VERIFY` / `PASSWORD_RESET`) | توكن استخدام واحد بـ hash وانتهاء صلاحية + `usedAt`. جدول واحد بدل جدولين لنفس الآلية. |
| **لا يوجد** جدول OTP للتليفون | التليفون مصدر إيراد مباشر بالفعل (الطلب بيوصل بعنوان)، و OTP بيكلف رسائل SMS ولازم مزوّد بعقد. المشروع ما هوش جاهز لده. **الأهم:** الـ claim بالتليفون من غير OTP = سرقة حسابات (انظر الأمان). السياسة: claim بالإيميل المتحقق منه فقط لحد ما نضيف OTP. الحارس في الكود بيرفض صراحة أي claim بتليفون غير متحقق منه. |
| `Order.trackingToken` (`@unique`، يتولد بالتطبيق) | تتبع طلب الضيف بدون حساب. **ليه مش orderNumber + phone:** الـ orderNumber متسلسل وعام — التخمين سهل، والتليفون في الاستجابة بيكشف بيانات. التوكن 256-bit من `crypto.randomBytes` = تخمين مستحيل. مفيش `@default` عمدًا عشان التطبيق يضطر يولّد قيمة عشوائية حقيقية دايمًا. |
| `Invoice.orderId` مش `@unique` + partial unique index على `(orderId) WHERE status='ISSUED'` | يسمح بإلغاء الفاتورة (VOID) وإصدار فاتورة بديلة لنفس الطلب، مع ضمان أن هناك فاتورة ISSUED واحدة فقط. ملف Prisma لوحده مش بيدعم partial indexes — عشان كده هي في `manual_constraints.sql`. |
| حذف `Invoice.taxAmount` (الباقي: `taxTotal` + `taxRateSnapshot`) | `taxAmount` كان تكرار حرفي لـ `taxTotal` على مستوى الفاتورة (الفاتورة كله ضريبة واحدة). `taxRateSnapshot` فايدته مختلفة (النسبة وقت الإصدار). `Order.taxTotal` و `InvoiceLine.taxAmount` فاضل كما هم. |
| حدود الاستخدام: `Promotion.usageLimitTotal/PerCustomer` + `Coupon.usageLimit/perCustomerLimit` (اتثبتوا الاتنين) | قاعدة موثقة كتعليق في الـ schema: **الحد الفعلي = الأضيق (min)** بين مستوى العرض ومستوى الكوبون، والـ NULL = بلا حد في ذلك المستوى. الكوبون **يضيّق ولا يوسّع**. الاتنين محتاجين لأن العرض الواحد ممكن عليه كذا كوبون بميزانيات مختلفة (كوبون مؤثرين مثلاً). |
| `prisma-client-js` اتسيب زي ما هو (مش `prisma-client`) | جربته فعليًا على 7.10.1: `prisma validate` و `prisma generate` بيعدّوا تمام وبيولّدوا لـ `node_modules/@prisma/client` بدون أي تحذير. التحويل لـ `prisma-client` يفرض `output` مخصص ويعيد كتابة **كل** الـ imports في ~40 module — churn ضخم بصفر فايدة وظيفية دلوقتي. القرار: ننتقل قبل Prisma 8، مش قبل النزول للسوق. |
| `datasource` بدون `url` | متوافق مع `prisma7.config.ts` الموجود اللي بيقرأ `process.env.DATABASE_URL` — مفيش أي تغيير محتاج. |

الـ enum الجديدة: `EAuthProvider`، `EVerificationPurpose` (بالاصطلاح: بحرف E).

## 2) ملف الـ SQL — الجديد في `prisma/mvp/manual_constraints.sql`

الموجود قبل كده (CHECKs، triggers، فهارس trgm، دوال البحث العربي، views) اتسيب زي ما هو. **المضاف:**

1. **Partial unique indexes:**
   - `Invoice_orderId_issued_key`: فاتورة ISSUED واحدة لكل order.
   - `CustomerAddress_customerId_default_key`: عنوان isDefault واحد لكل عميل (باستثناء غير النشط).
   - `Cart_customerId_active_key`: سلة ACTIVE واحدة لكل عميل.
   - `ProductImage_productId_primary_key`: صورة isPrimary واحدة لكل منتج.
2. **`Session_owner_exactly_one`** CHECK: الصف يخص عميل أو موظف، مش الاتنين ولا ولا واحد.
3. **`Customer_merged_requires_target`** CHECK: عميل MERGED لازم يشاور على الهدف.
4. **`enforce_bundle_single_package`** trigger: الـ bundle لازم يفضل معاه Package واحد بالظبط (يمنع تاني Package، ويمنع حذف الأخير). trigger `ProductBundleComponent_no_nested_bundles` القديم شغال: المكوّن لازم يكون منتج FINISHED.
5. تصحيح `Invoice_money_nonnegative` — كان بيخش على `taxAmount` اللي اتشال.

طريقة التطبيق (بعد الـ migration):
```bash
npx prisma migrate dev --name init     # أول مرة فقط
npx prisma db execute --file prisma/mvp/manual_constraints.sql
```

## 3) ملفات TypeScript جديدة (كلها في `src/services/` — طبقة business فوق الـ modules المولدة)

| الملف | وظيفته |
| --- | --- |
| `document-number.service.ts` | ترقيم بدون فجوات: `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` جملة واحدة ذرية. أول إدراج للسنة بيرجع 1، والتعارض بيزوّد العدّاد. لازم تتنده جوا نفس الـ transaction اللي بتنشئ المستند — لو الإنشاء فشل الـ rollback بيرجّع الرقم. رقمنة السنة بتتبع `APP_TIMEZONE` (Cairo). |
| `order-payment-status.service.ts` | `deriveOrderPaymentStatus`: تجاهل CANCELED، أي CONFIRMED يكسب، بعدها PROOF_UPLOADED ثم PENDING، و REJECTED لما الكل مرفوض. + `refreshOrderPaymentStatus` + `markOrderDelivered` (الطلب + History + إحصائيات العميل في **نفس** transaction) + `createOrderRecord` (رقم + trackingToken). |
| `customer-stats.service.ts` | `recalculateCustomerStats(customerId)`: إعادة الحساب من Orders DELIVERED — للتصحيح بعد تعديل مبلغ، أو إلغاء بعد تسليم، أو merge. Idempotent. |
| `guest-checkout.service.ts` | guest checkout كامل في transaction واحدة: find-or-create عميل بالتليفون (normalize)، snapshots للبنود، كوبون بحدود min()، شحن من `ShippingTariff` (لو المدينة مالهاش تعريفة → **فشل صريح**، مش شحن مجاني مفترض)، ضريبة من `SystemSetting` (TAX_RATE؛ لو مفيش → صفر، مش قيمة مفترضة)، Order + Items + AddressSnapshot + Redemption، وغلق سلة الضيف CHECKED_OUT. |
| `customer-claim.service.ts` | claim/merge/دمج السلة (تفاصيل الأمان تحت). |
| `../utils/secure-token.ts` | توليد توكنات opaque (256-bit) + SHA-256 hashing + مقارنة timing-safe. **مفيش أي raw token بيتهنز في الداتابيز ولا في اللوجز.** |

## 4) أمان الـ claim والـ merge (أهم جزء في الملف ده)

**قاعدة الثبات: الـ claim يحصل فقط على هوية قام المستخدم بإثبتها لحظة التوثيق:**

1. **Google:** الإيميل متحقق منه من Google نفسها → claim آمن على عميل Guest له نفس الإيميل و `emailVerifiedAt` مش `NULL`.
2. **Email + Password:** الـ claim لازم يحصل **بعد** ضغط رابط التحقق فقط (استهلاك `AuthVerificationToken`)، مش عند التسجيل.
3. **التليفون لوحده = ممنوع في الـ MVP.** أي حد يقدر يكتب أي رقم تليفون في فورم التسجيل. لو عملنا claim على التليفون غير المتحقق منه، المهاجم يسجل برقم الضحية ويستلم تاريخ طلباته واسمه وعناوينه فورًا — ثغرة سرقة هوية كاملة. عشان كده `claimGuestByVerifiedPhone` بيرمي `PHONE_NOT_VERIFIED` صراحة لحد ما فيه OTP بيضبط `phoneVerifiedAt`. سؤالك رقم 4 في الرسالة الأولى: ده هو الجواب — **مفيش claim إلا بإثبات ملكية.**
4. الضيف اللي مالوش إيميل أصلاً؟ طلباته تفضل متاحة بالـ `trackingToken`، ولما يدفع أو يتواصل بيوصلنا إيميله — أول ما يتحقق نعمل claim يدوي أو أوتوماتيك.

**الـ merge (`mergeCustomers`):** ينقل Orders و Addresses (بيصفّر isDefault الأول عشان الـ partial index ما يزعقش) و Carts (دمج بنود بالتجميع) و Wishlist (بدون تكرار) و AuthAccounts و Coupons، يلغي جلسات المصدر، يحدّث إحصائيات الهدف، ويسيب المصدر `MERGED` + `mergedIntoCustomerId` (مش بيتحذف أبدًا — الـ AuditLog و PromotionRedemption مرتبطين بيه بـ Restrict). **الصفوف الـ append-only (Redemptions، AuditLog، سجلات الحالات) متتحركش** — تغييرها يزوّر التاريخ. كل ده جوا transaction + صف `AuditLog` بنفس الـ transaction.

**دمج سلة الضيف:** `mergeGuestCart(customerId, guestToken)` — بيدمج البنود بالتجميع في السلة ACTIVE بتاعة العميل (أو بيعمل واحدة)، ويسيب سلة الضيف `ECartStatus.MERGED` + `mergedIntoCartId`.

## 5) الاختبارات

- `npm test` (Vitest — `vitest.config.ts`).
- Unit (بتشتغل دايمًا): قواعد `paymentStatus`، `normalizePhone`، قوة التوكنات والـ hash.
- Integration (بتشتغل على PostgreSQL حقيقي، وبتعمل **skip** تلقائي لو الداتابيز مش متاحة عشان `npm test` يفضل أخضر على أي جهاز):
  - ترقيم: 50 allocation متزامنة → صفر تكرار + صفر فجوة + padding.
  - checkout: snapshots، عنوان، تليفون normalize، إعادة استخدام نفس العميل، trackingToken.
  - تسليم: إحصائيات العميل في نفس transaction + idempotency.
  - recalc: بيصلح أي drift بعد تعديل يدوي.
  - claim بالإيميل المتحقق + رفض claim بتليفون غير متحقق.
  - merge: نقل كل حاجة + MERGED + تصفير defaults.
  - دمج السلة بالتوكن.

## 6) مشاكل لقيتها (وليس حلولاً مخترعة — قرارات محتاجة منك)

1. **`.env` الحالي بيرفض الدخول لـ PostgreSQL المحلي** (`P1000: Authentication failed ... credentials for postgres are not valid` على `localhost:5432/om_eman`). الـ integration tests بتعمل skip بسبب ده. ظبط `DATABASE_URL` وبعدها `npx vitest run` هيجنّي الاختبارات كلها.
2. **مفيش migration فعلي لسه** (`prisma/migrations` مش موجود). أول ما الداتابيز تبقى صالحة: `npx prisma migrate dev --name init` ثم طبق الـ SQL اليدوي. أنا مكتبتش الـ migration بنفسي لأنها محتاجة الداتابيز شغالة.
3. **الـ modules المولدة لسه CRUD خام**: عشان الـ endpoints الجديدة (checkout/claim/track) تظهر، لازم routers تربط على خدمات `src/services/` — ده شغل طبقة الـ API مش شغل الـ schema، وسبته ليك عشان حابب تقرر التسمية (`/api/orders/checkout` guest، `/api/orders/track/:trackingToken`...).
4. **BullMQ متسطب فعلاً** في `package.json` بس مفيش أي استخدامه في اللي عملته ده. **ما استخدمتهوش عمدًا:** إحصائيات الدفع والتسليم لازم تتم في نفس transaction الـ DB — queue هنا بتكسر الضمانة. الـ queue مكانها الصح: الإشعارات، توليد PDF الفاتورة، و CAPI events.
5. ملفات معدلة في مشاريع تانية ظاهرة في `git status` (workTrack و frontend) — دي قبل ما أبدأ، أنا مسستهاش.

## 6-ب) Storefront + Reports API — endpoints ناقصة اتعملت (2026-11-11)

اتعملت بنفس نمط الـ modules (controller/service/routes/validation + ApiResponse + Zod). ملفات جديدة:

| المسار | الوصف |
| --- | --- |
| `src/modules/store/` | الـ API بتاع المتجر للعميل — كل حاجة تحت `/api/store` |
| `src/modules/reports/` | تقارير لوحة التحكم من الـ views — `/api/reports/*` |
| `src/middlewares/customer-auth.middleware.ts` | `authenticateCustomer` (Session token opaque) + `optionalCustomer` |
| `express-rate-limit` | مكتبة جديدة — حماية brute-force على الـ auth و checkout و proof |

### `/api/store/*`
| Endpoint | Auth | ملاحظات |
| --- | --- | --- |
| `POST /store/auth/register` | rate-limited | claim آمن لعميل Guest بنفس الإيميل + توكن تحقق بالبريد. لو SMTP مقفول يرجع `devVerificationLink` في **development فقط** |
| `POST /store/auth/verify-email` | rate-limited | استهلاك توكن الاستخدام الواحد + `emailVerifiedAt` + claim |
| `POST /store/auth/login` | rate-limited | مرفوض لو الإيميل مش متحقق أو الحساب مش ACTIVE |
| `POST /store/auth/google` | rate-limited | التحقق من ID token على `tokeninfo` بتاع Google + `aud` لازم يساوي `GOOGLE_CLIENT_ID` (env) |
| `POST /store/auth/forgot-password` | rate-limited | رد عام دايمًا — ممنوع account enumeration |
| `POST /store/auth/reset-password` | rate-limited | استهلاك توكن + **إلغاء كل الجلسات** الحية |
| `POST /store/auth/logout` / `GET /store/auth/me` | customer session | |
| `POST /store/checkout` | rate-limited | guest checkout — `createGuestOrder` |
| `GET /store/track/:trackingToken` | عام | حالة الطلب فقط — مفيش أي بيانات شخصية |
| `GET /store/cart`, `GET/POST/PATCH/DELETE /store/cart/:guestToken/items...` | عام | سلة الزائر بـ guestToken + snapshots للتوفّر |
| `GET /store/search?q=` | عام (optional customer) | `search_products()` SQL + تسجيل `SearchLog` |
| `POST /store/payments/proof` | rate-limited + optional customer | إثبات تحويل — الملكية بالـ trackingToken أو الجلسة |
| `GET /store/products/:slug` | عام | صفحة المنتج للـ SEO — published+active فقط |

### `/api/reports/*` (OWNER/ADMIN)
`sales-daily`, `top-products`, `top-products-monthly`, `customers-summary`, `customer-segments`, `payments-pending`, `promotions-performance`, `zero-result-searches`, `top-searches`, `cod-awaiting-settlement`.

### متغيرات البيئة الجديدة (متوثقة في `.env.example`)
- `GOOGLE_CLIENT_ID` — فاضي = تسجيل Google معطل (يرد `GOOGLE_NOT_CONFIGURED`).
- `SESSION_TTL_DAYS=30`، `EMAIL_VERIFY_TOKEN_TTL_HOURS=24`، `PASSWORD_RESET_TOKEN_TTL_MINUTES=30`.

> ملحوظة: الـ endpoints دي مش في Swagger metadata المولد (المولد بيغطي الـ CRUD models). لو محتاجها في `/api/docs` نضيفها بعدين.

## 7) أوامر التشغيل بعد ظبط الداتابيز

```bash
npx prisma format && npx prisma validate && npx prisma generate
npx prisma migrate dev --name init
npx prisma db execute --file prisma/mvp/manual_constraints.sql
npm test
npm run build
```

## 8) أسئلة مفتوحة محتاجة قرارك (مش افترضتها)

1. **OTP للتليفون:** هتوفر مزوّد SMS؟ من غيره الـ claim بالإيميل المتحقق هو الوحيد المتاح، وكتير من الضيوف (بدون إيميل) عمرهم ما هيتلعموا بحسابهم.
2. **شحن متعريفوش:** اتقررت أخلي checkout يفشل صريح لو مفيش `ShippingTariff` للمحافظة/المدينة — تحب يبقى fallback لسعر افتراضي من `SystemSetting` بدلاً من كده؟
3. **دمج بنود السلة:** اخترت **تجميع** الكميات. محتاج أقصى الكميتين (max) بدلاً منها؟
4. **prefix الأرقام:** `ORD-2026-000123` و `INV-2026-000123` — ظبطها كده، وبيتقرا من صف الـ `DocumentSequence` نفسه (قابل للتغيير بدون كود).
5. **TTLs** (الجلسة/توكنات التحقق): هتتحدد في endpoint الـ auth لما نكتبه — هل تحب تبقى env variables (زي `SESSION_TTL_DAYS`) ولا قيم `SystemSetting`؟
