# Om Eman — دليل المشروع بالعربي

> آخر تحديث: 2026-11-03
>
> هذا الملف مكتوب لك تحديدًا: يشرح المشروع من أوله لآخره بلغة واضحة، ويوضح
> **ما هو موجود فعلًا**، و**ما هو غير موجود بعد**، و**لماذا اتخذنا كل قرار**.

---

## 1. المشروع في سطرين

**Om Eman** هو Backend لمتجر مصري متخصص في الأعشاب والتوابل والمنتجات الطبيعية.
المشروع مبني بـ **Node.js + TypeScript + Express + Prisma + PostgreSQL**،
والجزء الحالي هو **MVP** يركز على الكتالوج والبحث العربي والطلبات والفواتير
والمدفوعات والشحن والعروض، **بدون** نظام مخزون أو مشتريات أو مرتجعات أو مالية
كاملة.

المشروع الآن يمر بمرحلة **Schema-First**:

1. قاعدة البيانات هي مصدر الحقيقة الأول.
2. تم توليد **38 CRUD module + Auth module** من الـ Schema تلقائيًا، مع
   استيراد منتجات من CSV بجانب الإضافة اليدوية.
3. القواعد التجارية الدقيقة (transactions، audit، انتقالات الحالة، حساب
   الإجماليات) **لم تُنفذ بعد** وتحتاج طبقة Business يدوية.
4. لا يوجد Migration فعلي ولا Seed ولا اختبارات آلية حتى الآن.

---

## 2. المشروع بيحل إيه؟

المتجر يحتاج نظامًا يدير:

- عرض المنتجات والعبوات والأسعار.
- البحث بالعربي بأسماء بديلة وأخطاء إملائية.
- السلة والمفضلة.
- الطلبات وتتبع حالتها.
- الفواتير والمدفوعات (تحويل أونلاين أو دفع عند الاستلام).
- الشحن والتحصيل.
- العروض والكوبونات.
- العملاء وعناوينهم.
- الموظفين والأدوار البسيطة.
- المحتوى (بانرات، صفحات، أسئلة شائعة).
- الإشعارات وإعدادات النظام.

الـ MVP يحاول يغطي هذه الأشياء **بأقل تعقيد ممكن**، مع ترك أشياء كثيرة خارج
النطاق عن قصد.

---

## 3. نطاق الـ MVP

### داخل النطاق

- كتالوج: أقسام، أقسام فرعية، منتجات، عبوات/SKU، صور، أسماء بديلة، Bundles.
- بحث عربي: Synonyms + Aliases + Trigram + تسجيل البحث.
- سلة ومفضلة.
- طلبات وبنود طلب و Snapshots.
- فواتير وبنود فاتورة.
- مدفوعات أونلاين/COD.
- شركات شحن وتعرفات وشحنات وتتبع حالتها.
- عروض وكوبونات و`PromotionRedemption`.
- Marketing Events لـ Meta Pixel/CAPI.
- عملاء وعناوين.
- موظفين وأدوار `OWNER` / `ADMIN` / `STAFF`.
- `AuditLog` و`DocumentSequence` و`SystemSetting`.
- محتوى وإشعارات.
- 12 Reporting View داخل PostgreSQL.

### خارج النطاق عن قصد

- نظام مخزون أو لوطات أو حركات مخزون.
- مشتريات وموردون.
- مرتجعات أو Refunds.
- مالية كاملة (قيود، حسابات، مصروفات).
- ريسلر / موزعون.
- ولاء أو تقييمات أو مقالات.
- RBAC تفصيلي (الصلاحيات الحالية دورية فقط).
- Multi-currency (العملة EGP فقط).
- Multi-warehouse.
- Payment Gateway مباشر.
- Carrier API مباشر.
- Frontend.

---

## 4. الصورة الكبيرة — Architecture

```text
Client / Postman / Swagger
        |
        v
Express App (src/app.ts)
        |
        +-- Helmet / CORS / JSON / Morgan
        +-- /api router
        |      |
        |      +-- Auth module
        |      +-- 38 CRUD modules
        |
        +-- /api/docs  (Swagger UI)
        +-- /api/docs.json (OpenAPI JSON)
        |
        v
Middlewares
        |
        +-- authenticate (JWT)
        +-- authorize (OWNER/ADMIN)
        +-- validateBody / validateQuery / validateParams (Zod)
        |
        v
Controller
        |
        v
Service
        |
        v
Prisma Client
        |
        v
PostgreSQL
```

### طبقات الكود

| الطبقة | مكانها | دورها |
| --- | --- | --- |
| Router | `src/modules/<model>/router.ts` | تعريف المسارات والميدلوير |
| Controller | `src/modules/<model>/controller.ts` | استقبال Request وإرجاع Response |
| Service | `src/modules/<model>/service.ts` | التعامل مع Prisma |
| Validation | `src/modules/<model>/validation.ts` | Zod schemas |
| Types | `src/modules/<model>/types.ts` | واجهات TypeScript |
| Shared | `src/shared/` | Response + Pagination + Errors |
| Middlewares | `src/middlewares/` | Auth + Roles + Validation + Errors |
| Config | `src/config/` | Env + Prisma + Email + Swagger |
| Utils | `src/utils/` | JWT + Password + Logger + Arabic |

**قاعدة مهمة:** الـ Controller لا يحتوي منطق أعمال، والـ Service لا يبني HTTP
Response.

---

## 5. التقنيات

| التقنية | الاستخدام |
| --- | --- |
| Node.js 20+ | بيئة التشغيل |
| TypeScript strict | لغة الكود |
| ESM + NodeNext | نظام الوحدات |
| Express 5 | HTTP framework |
| Prisma 7 | ORM |
| PostgreSQL | قاعدة البيانات |
| `@prisma/adapter-pg` | ربط Prisma بـ PostgreSQL |
| Zod 4 | Validation |
| JWT | المصادقة |
| bcrypt | تشفير كلمات المرور |
| Helmet | Security headers |
| CORS | التحكم في الأصول |
| Morgan | HTTP logging |
| Nodemailer | البريد (مهيأ لكن غير مستخدم في endpoints) |
| Swagger UI | توثيق API |
| PGlite | اختبار SQL محليًا بدون PostgreSQL |

---

## 6. رحلة الطلب — مثال يوضح كل حاجة

1. العميل يتصفح المنتجات:
   `GET /api/products?q=شيبس`
2. يضيف عبوة للسلة:
   `POST /api/cart-items`
3. ينشئ طلب:
   `POST /api/orders`
4. النظام (في التنفيذ الكامل) يجب أن:
   - يحسب `subtotal` و`discountTotal` و`shippingTotal` و`taxTotal` و`grandTotal`.
   - ينشئ `OrderItem` مع Snapshot للاسم وSKU والسعر.
   - ينشئ `OrderAddressSnapshot`.
   - ينشئ `PromotionRedemption` لو فيه خصم.
   - ينشئ `OrderStatusHistory` أول سطر بحالة `RECEIVED`.
   - يكتب `AuditLog`.
   - كل ده داخل Transaction واحدة.
5. الموظف يؤكد الطلب:
   `PATCH /api/orders/:id` أو endpoint مخصص لاحقًا.
6. الدفع:
   - تحويل أونلاين: `Payment` بحالة `PENDING` ثم `PROOF_UPLOADED` ثم
     `CONFIRMED`.
   - COD: `Payment` يتأكد عند تحصيل الشحنة.
7. الشحن:
   `Shipment` + `ShipmentStatusHistory`.
8. الفاتورة:
   `Invoice` + `InvoiceLine` من Snapshot فقط.
9. التسليم:
   `Order.status = DELIVERED` ويتم تحديث إحصائيات العميل المخزنة.

> **مهم:** الـ CRUD المولد حاليًا ينفذ الخطوات الميكانيكية فقط. الخطوات
> التجارية المذكورة أعلاه (حساب الإجماليات، Snapshot، Audit، Transition rules)
> **ليست منفذة تلقائيًا** بعد.

---

## 7. قاعدة البيانات

### 7.1 الأرقام

| العنصر | القيمة |
| --- | --- |
| Schema النشط | `prisma/schema.prisma` |
| عدد الـ Models | **38** |
| عدد الـ Enums | **25** |
| Schema القديم | `prisma/legacy/full-schema.prisma` (133 model / 72 enum) — أرشيف فقط |
| Migration | **غير موجود** |
| Seed | **غير موجود** |
| Manual SQL | `prisma/mvp/manual_constraints.sql` |

### 7.2 الـ Models الـ 38

| المجموعة | Models | الوظيفة |
| --- | --- | --- |
| الموظفون والتدقيق | `Employee`, `AuditLog` | حسابات الموظفين وسجل التدقيق Append-only |
| العملاء | `Customer`, `CustomerAddress` | العملاء والعناوين |
| السلة | `Cart`, `CartItem`, `WishlistItem` | السلة والمفضلة |
| الكتالوج | `Category`, `Subcategory`, `Product`, `ProductImage`, `ProductAlias`, `ProductPackage`, `ProductBundleComponent` | الأقسام والمنتجات والعبوات والأسماء البديلة والصور والـ Bundles |
| البحث | `SearchSynonym`, `SearchLog` | Synonyms وتسجيل البحث |
| الطلبات | `Order`, `OrderItem`, `OrderStatusHistory`, `OrderAddressSnapshot` | الطلب وبنوده وتاريخ حالته وعنوانه |
| الفواتير | `Invoice`, `InvoiceLine` | الفاتورة وبنودها |
| المدفوعات | `Payment` | التحويل الأونلاين وCOD |
| الشحن | `ShippingCarrier`, `ShippingTariff`, `Shipment`, `ShipmentStatusHistory` | شركات الشحن والتعرفات والشحنات وتاريخ حالتها |
| العروض | `Promotion`, `PromotionTarget`, `Coupon`, `PromotionRedemption` | العروض والكوبونات والاستخدام |
| التسويق | `MarketingEvent` | أحداث Meta Pixel/CAPI |
| المحتوى | `Banner`, `StaticPage`, `Faq` | بانرات وصفحات وأسئلة شائعة |
| الإشعارات | `Notification` | إشعارات العملاء والموظفين |
| النظام | `SystemSetting`, `DocumentSequence` | إعدادات وتسلسل أرقام المستندات |

### 7.3 علاقات مهمة

- `Product` ≠ `ProductPackage`:
  - `Product` هو الهوية التجارية.
  - `ProductPackage` هو العبوة/SKU القابلة للبيع.
- `ProductPackage` هو ما يدخل السلة والطلب والفاتورة.
- `Order` له `OrderAddressSnapshot` إلزامي في التنفيذ الكامل.
- `OrderItem` يحتوي Snapshot للاسم وSKU والسعر، و`bundleSnapshot` لو المنتج
  Bundle.
- `Invoice` له `InvoiceLine` من Snapshot فقط.
- `PromotionRedemption` هو المصدر الوحيد للخصم والاستخدام.
- `Shipment` مرتبط بـ `Order` و`ShippingCarrier`.
- `Customer.completedOrdersCount` و`totalSpent` قيم مخزنة مؤقتًا، ومصدر
  الحقيقة هو `Order` بحالة `DELIVERED`.

### 7.4 الـ Enums الـ 25

| Enum | القيم |
| --- | --- |
| `ELanguage` | `AR`, `EN` |
| `EEmployeeStatus` | `ACTIVE`, `DISABLED`, `REMOVED` |
| `EEmployeeRole` | `OWNER`, `ADMIN`, `STAFF` |
| `ECustomerStatus` | `ACTIVE`, `BLOCKED`, `MERGED` |
| `EAuditResult` | `SUCCESS`, `FAILURE`, `DENIED` |
| `ECartStatus` | `ACTIVE`, `MERGED`, `CHECKED_OUT`, `ABANDONED` |
| `EProductType` | `FINISHED`, `PREDEFINED_BUNDLE` |
| `EProductStatus` | `DRAFT`, `ACTIVE`, `INACTIVE`, `ARCHIVED` |
| `EStockStatus` | `IN_STOCK`, `OUT_OF_STOCK` |
| `ESizeUnit` | `G`, `KG`, `ML`, `L`, `PIECE`, `PACK`, `OTHER` |
| `EOrderStatus` | `RECEIVED`, `CONFIRMED`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELED`, `FAILED_DELIVERY` |
| `EInvoiceStatus` | `ISSUED`, `VOID` |
| `EPaymentMethod` | `ONLINE_TRANSFER`, `COD` |
| `EPaymentStatus` | `PENDING`, `PROOF_UPLOADED`, `CONFIRMED`, `REJECTED`, `CANCELED` |
| `EShipmentStatus` | `PENDING`, `PREPARING`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `CANCELED` |
| `EPromotionType` | `PRODUCT_DISCOUNT`, `CATEGORY_DISCOUNT`, `STOREWIDE_DISCOUNT`, `COUPON`, `FREE_SHIPPING` |
| `EDiscountType` | `FIXED`, `PERCENTAGE` |
| `EPromotionScope` | `ORDER`, `PRODUCT`, `PACKAGE`, `CATEGORY`, `SUBCATEGORY`, `SHIPPING` |
| `ENotificationRecipientType` | `CUSTOMER`, `EMPLOYEE` |
| `ENotificationChannel` | `EMAIL`, `DASHBOARD`, `WHATSAPP`, `SMS` |
| `ENotificationStatus` | `PENDING`, `SENT`, `FAILED`, `READ`, `CANCELED` |
| `ENotificationType` | `ORDER_CONFIRMATION`, `ORDER_STATUS`, `PAYMENT`, `SHIPMENT`, `SYSTEM` |
| `EContentStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `EMarketingEventName` | `VIEW_CONTENT`, `SEARCH`, `ADD_TO_CART`, `INITIATE_CHECKOUT`, `PURCHASE` |
| `EMarketingEventStatus` | `PENDING`, `SENT`, `FAILED`, `SKIPPED` |

### 7.5 قواعد التسمية

- كل Prisma enum يبدأ بـ `E`: `EOrderStatus`, `EPaymentStatus`.
- كل TypeScript interface/type يبدأ بـ `I`: `IEnvConfig`, `IAuthPayload`.
- المعرّفات `cuid()`.
- المال `Decimal(18, 4)`.
- الضرائب `Decimal(9, 6)`.
- كل حقل علاقة له `onDelete` صريح.

---

## 8. قواعد لا تُكسر

1. **المال والكميات `Decimal` فقط، ممنوع `Float`.**
2. **لا يوجد نظام مخزون.** التوفر يدوي عبر `ProductPackage.stockStatus`.
3. **`Product` منفصل عن `ProductPackage`.**
4. **Snapshots إلزامية** في الطلبات والفواتير: الأسماء، SKU، السعر، الضريبة،
   والعنوان.
5. **`Payment` هو مصدر الحقيقة للمدفوعات**، و`Order.paymentStatus` قيمة مخزنة
   مؤقتًا.
6. **الخصومات من `PromotionRedemption` فقط.** لا يوجد `OrderDiscount`.
7. **Bundles معرفة مسبقًا**:
   - `Product.productType = PREDEFINED_BUNDLE`.
   - له عبوة واحدة.
   - مكوناته بدون سعر.
   - ممنوع Bundle داخل Bundle (Trigger).
8. **السجلات التاريخية Append-only**:
   - `AuditLog`
   - `OrderStatusHistory`
   - `ShipmentStatusHistory`
   - `InvoiceLine`
   - `PromotionRedemption`
   - `OrderAddressSnapshot`
9. **لا مرتجعات أو Refunds.** الإلغاء وإبطال الفاتورة فقط.
10. **العملة EGP فقط**، ومخزنة في `SystemSetting`.
11. **لا قيم أعمال مفترضة** (عمولات، أسعار جملة، آجال سداد، ضرائب) بدون إعداد
    صريح.
12. **الصلاحيات تُفرض في الـ Backend**، وليس في الواجهة فقط.
13. **كل عملية حساسة يجب أن تكتب `AuditLog` داخل نفس الـ transaction** (غير
    منفذ في CRUD المولد بعد).
14. **ترقيم المستندات عبر `DocumentSequence`** حسب النوع والسنة، وليس
    timestamps.
15. **الحذف للأرشفة/التعطيل** للكيانات المرتبطة بتاريخ، وليس الحذف النهائي.

---

## 9. البحث العربي

### 9.1 التطبيع

دالة `normalize_arabic(text, strip_definite_article DEFAULT false)` في SQL،
ومقابلها TypeScript في `src/utils/arabic/normalize-arabic.ts`.

خطوات التطبيع:

1. تحويل لحروف صغيرة.
2. إزالة التشكيل والتطويل.
3. توحيد الألف: `أ إ آ ٱ` → `ا`.
4. الألف المقصورة `ى` → `ي`.
5. التاء المربوطة `ة` → `ه`.
6. الهمزات على الواو/الياء → `و`/`ي`.
7. تحويل الأرقام العربية والفارسية إلى أرقام إنجليزية.
8. تحويل أي رمز غير حرف/رقم إلى مسافة، ثم دمج المسافات.
9. **"ال" محفوظة افتراضيًا.** من يريد تجاهلها يستخدم
   `normalize_arabic(value, true)` أو يضيف Alias/Synonym.

### 9.2 الحقول المستخدمة في البحث

- `Product.searchNameArNormalized`
- `Product.searchNameEnNormalized`
- `Product.searchText` (Blob مجمع: الأسماء + Aliases + Keywords + Brand +
  أسماء الأقسام)
- `ProductAlias.normalizedAlias`
- `SearchSynonym.normalizedTerm`

### 9.3 `search_products(q, lim)`

يرجع فقط المنتجات:

- `status = ACTIVE`
- ولها `ProductPackage` بحالة `isPublished = true` و`isActive = true`

ثم يطبق 4 مستويات:

1. **Exact**: تطابق تام مع الاسم المطبع أو Alias.
2. **Prefix**: يبدأ بـ q.
3. **Synonym-expanded**: توسيع البحث بالـ Synonyms ثم مطابقة جزئية.
4. **Trigram fallback**: تشابه >= 0.15 للأخطاء الإملائية.

الترتيب النهائي:

```text
matchTier ASC
isFeatured DESC
score DESC
nameAr ASC
```

### 9.4 `suggest_similar(q, lim)`

يرجع اقتراحات من:

- أسماء المنتجات النشطة.
- Alias النشطة.
- Synonym النشطة.

بشرط تشابه Trigram >= 0.15.

### 9.5 الفهارس

5 فهارس GIN Trigram:

- `Product_searchText_trgm_idx`
- `Product_searchNameArNormalized_trgm_idx`
- `Product_searchNameEnNormalized_trgm_idx`
- `ProductAlias_normalizedAlias_trgm_idx`
- `SearchSynonym_normalizedTerm_trgm_idx`

---

## 10. الـ API

### 10.1 Auth

| Method | Path | الوظيفة | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | تسجيل دخول موظف | لا |
| GET | `/api/auth/me` | بيانات الموظف الحالي | JWT |

`POST /api/auth/login`:

```json
{
  "email": "owner@om-eman.local",
  "password": "StrongPassword123"
}
```

الرد:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "employee": {
      "id": "cm...",
      "fullName": "Om Eman Owner",
      "email": "owner@om-eman.local",
      "phone": null,
      "role": "OWNER"
    },
    "token": "eyJhbGciOi..."
  }
}
```

### 10.2 CRUD Modules

تم توليد **38 module** من الـ Schema. كل module فيه:

```text
src/modules/<model>/
├── controller.ts
├── service.ts
├── router.ts
├── validation.ts
└── types.ts
```

المسارات:

```text
GET    /api/<plural-kebab>
GET    /api/<plural-kebab>/:id
POST   /api/<plural-kebab>
PATCH  /api/<plural-kebab>/:id
DELETE /api/<plural-kebab>/:id
```

أمثلة:

```text
/api/employees
/api/audit-logs
/api/customers
/api/carts
/api/products
/api/product-packages
/api/orders
/api/order-items
/api/invoices
/api/payments
/api/shipments
/api/promotions
/api/coupons
/api/banners
/api/faqs
/api/notifications
/api/system-settings
```

### 10.3 الصلاحيات

- **القراءة العامة** متاحة لـ:
  - `Category`
  - `Subcategory`
  - `Product`
  - `ProductImage`
  - `ProductAlias`
  - `ProductPackage`
  - `ProductBundleComponent`
  - `SearchSynonym`
  - `Banner`
  - `StaticPage`
  - `Faq`
- **كل عمليات الكتابة** تتطلب:
  - `authenticate`
  - `authorize(OWNER, ADMIN)`
- **`STAFF` لا يستطيع الكتابة حاليًا.** الصلاحيات دورية بسيطة، وليست
  permission-based.

### 10.4 Pagination والبحث

كل قائمة تدعم:

```text
?q=شيبس&page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

- `page` يبدأ من 1.
- `limit` أقصى 100.
- `q` يبحث في الحقول النصية فقط.
- `sortBy` مقيد بالحقول المسموحة لكل model.
- `sortOrder` = `asc` أو `desc`.

شكل الرد:

```json
{
  "success": true,
  "message": "Product records fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### 10.5 Append-only Modules

هذه الوحدات توفر **قراءة + إنشاء فقط**، وترفض `PATCH`/`DELETE`:

- `AuditLog`
- `OrderStatusHistory`
- `ShipmentStatusHistory`
- `InvoiceLine`
- `PromotionRedemption`
- `OrderAddressSnapshot`

في حالة محاولة التعديل/الحذف عبر Prisma مباشرة، توجد Triggers في PostgreSQL
ترفض العملية أيضًا.

### 10.6 Password Models

- `Employee`
- `Customer`

يقبلان `password` في الطلب، ويخزنان `passwordHash` فقط، ولا يرجعان
`passwordHash` أبدًا في الرد.

### 10.7 شكل الأخطاء

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "errors": []
  }
}
```

### 10.8 استيراد المنتجات من CSV

الإضافة اليدوية القديمة شغالة زي ما هي:

```text
POST /api/products
Content-Type: application/json
```

وأضفنا مسار CSV منفصل:

```text
POST /api/products/import
Content-Type: multipart/form-data
Auth: Bearer token
Role: OWNER أو ADMIN
Field: file
```

- الملف لازم يكون `.csv` وUTF-8، وبحد أقصى **5 MB** و**5000 صف**.
- كل صف ينشئ `Product`، ولو فيه `sku` ينشئ معاه `ProductPackage` في نفس
  العملية.
- الصفوف غير الصالحة ترجع بأرقامها وأسبابها، والصفوف الصالحة يتم استيرادها.
- التكرار داخل الملف أو في قاعدة البيانات (`slug` / `sku` / `barcode`) يتم
  رفضه للصف فقط.
- لو لم يكن هناك أي صف صالح، يرجع `400` بكود `CSV_NO_VALID_ROWS`.

#### الأعمدة المطلوبة

| العمود | ملاحظات |
| --- | --- |
| `primarySubcategoryId` | لازم يكون موجود في `Subcategory` |
| `nameAr` | اسم المنتج بالعربي |
| `slug` | lowercase + numbers + hyphens فقط |

#### أعمدة المنتج الاختيارية

`nameEn`, `descriptionAr`, `descriptionEn`, `productType`, `status`, `brand`,
`searchKeywords`, `searchNameArNormalized`, `searchNameEnNormalized`,
`searchText`, `isFeatured`, `publishedAt`, `archivedAt`.

لو لم ترسل `searchNameArNormalized` أو `searchNameEnNormalized` أو `searchText`،
يتم توليدهم تلقائيًا باستخدام `normalizeArabic`.

#### أعمدة العبوة الاختيارية

لو أرسلت `sku`، تصبح هذه الحقول مطلوبة:

`sizeValue`, `sizeUnit`, `sellingPrice`.

وحقول اختيارية إضافية:

`barcode`, `packageNameAr`, `packageNameEn`, `compareAtPrice`, `saleEndsAt`,
`stockStatus`, `isActive`, `isPublished`, `sortOrder`.

- `compareAtPrice` لازم يكون أكبر من `sellingPrice`.
- `sizeUnit`: `G`, `KG`, `ML`, `L`, `PIECE`, `PACK`, `OTHER`.
- `stockStatus`: `IN_STOCK`, `OUT_OF_STOCK`.
- `Product.status` افتراضيًا `DRAFT`، و`ProductPackage.isPublished` افتراضيًا
  `false`؛ لو عايز المنتج يظهر للعميل لازم تحدد `status=ACTIVE` و
  `isPublished=true`.

#### أسماء أعمدة مرنة

المستورد يقبل `nameAr` أو `name_ar` أو `name-ar`، ويقبل `sellingPrice` أو
`price`، و`sku` أو `packageSku`، وبعض الاختصارات الشائعة. الأعمدة غير المعروفة
يتم تجاهلها.

#### مثال

```csv
primarySubcategoryId,nameAr,nameEn,slug,productType,status,sku,sizeValue,sizeUnit,sellingPrice,compareAtPrice,stockStatus,isPublished
subcategory_id_here,زعتر بلدي,Baladi Thyme,baladi-thyme,FINISHED,ACTIVE,THYME-100G,100,G,45.50,55.00,IN_STOCK,true
```

نموذج جاهز: `docs/examples/products-import.csv`.

#### شكل الرد

```json
{
  "success": true,
  "message": "Product import completed",
  "data": {
    "totalRows": 2,
    "created": 1,
    "failed": 1,
    "createdProducts": [
      {
        "id": "cm...",
        "nameAr": "زعتر بلدي",
        "slug": "baladi-thyme",
        "packageSku": "THYME-100G"
      }
    ],
    "errors": [
      {
        "row": 3,
        "message": "sizeUnit: Invalid option"
      }
    ]
  }
}
```

---

## 11. Swagger

تم تركيب Swagger UI فعليًا.

| الرابط | الوظيفة |
| --- | --- |
| `/api/docs` | Swagger UI |
| `/api/docs.json` | OpenAPI JSON الخام |

### كيف تستخدمه؟

1. شغّل السيرفر:
   ```bash
   npm run dev
   ```
2. افتح:
   ```text
   http://localhost:3000/api/docs
   ```
3. اعمل Login من `POST /api/auth/login`.
4. خد `token` من الرد.
5. اضغط **Authorize** في Swagger.
6. الصق التوكن **بدون** كلمة `Bearer` (Swagger بيضيفها بنفسه).
7. جرّب أي endpoint.

### المواصفات الحالية

- **79 path**
- **181 operation**
- **123 schema**
- Auth + 38 CRUD module + CSV product import.
- Schemas مولدة من حقول Prisma نفسها.
- `PATCH`/`DELETE` غير موجودة للـ Append-only modules.
- الأخطاء موثقة (`400`, `401`, `403`, `404`, `409`, `500`).

### ملاحظات مهمة

- Swagger spec مبني من `src/modules/module-metadata.ts`، ومسار
  `POST /api/products/import` مضاف يدويًا في `src/config/swagger.ts`.
- ملف الـ metadata ده **مولد تلقائيًا** بواسطة `npm run modules:generate`.
- بعد أي تغيير في `prisma/schema.prisma`:
  ```bash
  npm run modules:generate
  npm run typecheck
  npm run build
  ```
- Swagger UI نفسه لا يحتاج قاعدة بيانات، لكن `npm run dev` يحتاج
  `DATABASE_URL` شغال لأن `server.ts` يتصل بـ Prisma قبل تشغيل HTTP.
- لو حابب تشوف الـ spec بدون تشغيل السيرفر، شغّل:
  ```bash
  npx tsx -e "import('./src/config/swagger.js').then(m=>console.log(JSON.stringify(m.swaggerSpec,null,2)))"
  ```

---

## 12. الأمان

الموجود:

- JWT access token (افتراضي 7 أيام).
- bcrypt بـ 12 rounds افتراضيًا.
- التحقق من `Employee.status = ACTIVE` في كل طلب.
- Helmet Security Headers.
- CORS حسب `CORS_ORIGIN`.
- Zod validation للـ body/query/params.
- Prisma error mapping.
- Central error handler.
- كلمات المرور لا ترجع في أي Response.

غير الموجود:

- Refresh token.
- Fine-grained permissions.
- Rate limiting.
- Account lockout.
- 2FA.
- AuditLog تلقائي لكل عملية حساسة (الـ module موجود، لكن التسجيل التلقائي غير
  منفذ).
- CSRF (غير مطلوب حاليًا لأن الـ API token-based).

---

## 13. بنية الملفات

```text
Om-Eman/
├── prisma/
│   ├── schema.prisma                  # الـ Schema النشط (38 model / 25 enum)
│   ├── legacy/full-schema.prisma      # أرشيف (133 model / 72 enum)
│   └── mvp/
│       ├── manual_constraints.sql     # Constraints + Triggers + Indexes + Views
│       ├── dry-run.sql                # بيانات تجريبية واختبارات بحث/views
│       └── README.md                  # قرارات الـ MVP
├── scripts/
│   └── generate-modules.ts            # مولد الـ CRUD + Swagger metadata
├── src/
│   ├── app.ts                         # Express + /api + /api/docs
│   ├── server.ts                      # HTTP + Prisma + graceful shutdown
│   ├── config/
│   │   ├── env.ts
│   │   ├── prisma.ts
│   │   ├── email.ts
│   │   └── swagger.ts                 # OpenAPI spec
│   ├── enums/
│   ├── interfaces/
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── csv-upload.middleware.ts
│   │   └── error.middleware.ts
│   ├── shared/
│   │   ├── errors.ts
│   │   ├── pagination.ts
│   │   └── response.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── logger/
│   │   └── arabic/normalize-arabic.ts
│   └── modules/
│       ├── index.ts                   # يجمع Auth + 38 module + CSV import
│       ├── module-metadata.ts         # مولد — لا تعدله يدويًا
│       ├── auth/
│       ├── productImport/             # استيراد المنتجات من CSV
│       └── <model>/
├── docs/
│   ├── PROJECT_OVERVIEW_AR.md         # هذا الملف
│   ├── examples/products-import.csv   # نموذج CSV للاستيراد
│   ├── architecture.md
│   ├── assumptions.md
│   ├── business-rule-coverage.md
│   ├── entity-inventory.md
│   ├── integrity-rules.md
│   ├── indexes-and-queries.md
│   ├── migration-plan.md
│   └── erd*.md / erd*.mmd
├── README.md
├── AGENTS.md
├── CHANGELOG.md
└── FEEDBACK.md
```

---

## 14. التشغيل

### 14.1 المتطلبات

- Node.js 20+.
- PostgreSQL شغال.
- `DATABASE_URL` صحيح.

### 14.2 التثبيت

```bash
npm install
cp .env.example .env
```

### 14.3 المتغيرات المهمة

| المتغير | الوصف |
| --- | --- |
| `DATABASE_URL` | اتصال PostgreSQL — مطلوب |
| `PORT` | منفذ HTTP — افتراضي 3000 |
| `JWT_SECRET` | سر JWT — مطلوب في production |
| `JWT_EXPIRES_IN` | مدة التوكن — افتراضي 7d |
| `BCRYPT_SALT_ROUNDS` | افتراضي 12 |
| `CORS_ORIGIN` | `*` أو قائمة أصول |
| `APP_NAME` | اسم التطبيق |
| `APP_TIMEZONE` | المنطقة الزمنية |
| `DEFAULT_CURRENCY` | افتراضي EGP |
| `LOG_LEVEL` | debug/info/warn/error |
| `LOG_FILE` | افتراضي logs/app.log |
| `EMAIL_ENABLED` | افتراضي false |
| `SMTP_*` | إعدادات البريد |

### 14.4 الأوامر

```bash
npm run dev              # tsx watch
npm run build            # tsc -> dist/
npm run start            # node dist/server.js
npm run typecheck        # tsc --noEmit
npm run modules:generate # إعادة توليد CRUD + Swagger metadata
npm run db:validate      # prisma validate
npm run db:format        # prisma format
npm run db:generate      # prisma generate
npm run db:migrate       # prisma migrate dev
npm run db:deploy        # prisma migrate deploy
npm run db:studio        # prisma studio
```

### 14.5 أول Migration

> **غير منفذ بعد** لأن قاعدة البيانات الحية غير متاحة.

```bash
npm run db:migrate -- --name init
npx prisma db execute --file prisma/mvp/manual_constraints.sql
```

### 14.6 Dry-run

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/mvp/dry-run.sql
```

> `psql` غير مثبت حاليًا على البيئة الحالية.

---

## 15. الحالة الحالية — بصراحة

### تم

- Schema MVP صالح (`prisma validate`).
- Prisma Client مولّد.
- 38 CRUD module + Auth module.
- استيراد المنتجات من CSV: `POST /api/products/import`.
- `/api` router.
- Swagger UI + OpenAPI JSON.
- Zod validation.
- JWT + bcrypt + Roles.
- Response + Pagination + Error handling.
- Logger.
- Arabic normalization (SQL + TS).
- Manual SQL objects (Constraints + Triggers + Indexes + Views).
- Dry-run SQL تم اختباره محليًا بـ PGlite.
- `npx tsc --noEmit` ناجح.
- `npm run build` ناجح.
- Swagger: 79 path / 181 operation / 123 schema.
- README + AGENTS + CHANGELOG + FEEDBACK + Docs.

### غير تم

- Migration فعلي.
- تطبيق `manual_constraints.sql` على قاعدة حقيقية.
- Seed أساسي.
- Business rules داخل الـ modules:
  - حساب الإجماليات.
  - Snapshot enforcement.
  - AuditLog تلقائي.
  - Transition rules.
  - Promotion calculation.
  - Bundle pricing.
- Refresh token.
- Fine-grained permissions.
- Jobs.
- اختبارات آلية.
- Frontend.

---

## 16. المتبقي — خطة عمل واضحة

1. **Migration أولي**
   ```bash
   npm run db:migrate -- --name init
   ```
2. **تطبيق Manual SQL**
   ```bash
   npx prisma db execute --file prisma/mvp/manual_constraints.sql
   ```
3. **Seed أساسي حقيقي**
   - EGP.
   - إعدادات المتجر.
   - DocumentSequence.
   - أول `OWNER`.
4. **Business Layer**
   - Order creation transaction.
   - Totals calculation.
   - Snapshots.
   - AuditLog.
   - Status transitions.
   - Promotion redemption.
   - Bundle pricing.
5. **Auth تحسين**
   - Refresh token.
   - Permissions تفصيلية.
6. **Jobs**
   - إشعارات.
   - Marketing events retry.
7. **Tests**
   - Unit للـ services.
   - Integration للـ API.
   - SQL constraints tests.
8. **Swagger تحسين مستمر**
   - أضف أمثلة واقعية.
   - أضف tags descriptions عند الحاجة.
   - أعد التوليد بعد أي Schema change.

---

## 17. قاموس مصطلحات سريع

| المصطلح | المعنى |
| --- | --- |
| `Product` | الهوية التجارية للمنتج |
| `ProductPackage` | العبوة/SKU القابلة للبيع |
| `Bundle` | منتج مجمع من مكونات معرفة مسبقًا |
| `Snapshot` | نسخة ثابتة من البيانات وقت العملية |
| `Append-only` | لا تعديل ولا حذف، إنشاء فقط |
| `Redemption` | استخدام عرض/كوبون |
| `COD` | الدفع عند الاستلام |
| `CAPI` | Meta Conversions API |
| `Trigger` | كود يعمل تلقائيًا داخل PostgreSQL |
| `View` | استعلام محفوظ للتقارير |
| `Trigram` | تقنية تشابه نصوص للأخطاء الإملائية |
| `Normalization` | توحيد شكل النص العربي للبحث |
| `Migration` | ملف يطبق تغييرات Schema على DB |
| `Seed` | بيانات أساسية أولية |
| `CRUD` | Create / Read / Update / Delete |

---

## 18. كيف تقرأ المشروع؟

لو أنت جديد على المشروع، اقرأ بالترتيب:

1. هذا الملف.
2. `README.md` — نظرة عامة وتشغيل.
3. `prisma/schema.prisma` — مصدر الحقيقة.
4. `prisma/mvp/README.md` — قرارات قاعدة البيانات.
5. `src/modules/auth/` — مثال module كامل.
6. `src/modules/product/` — مثال CRUD.
7. `src/config/swagger.ts` — شكل الـ API.
8. `src/middlewares/` — Auth/Validation.
9. `src/shared/` — Response/Pagination/Errors.
10. `docs/` — تفاصيل إضافية.

### لو هتعدل على Schema

```bash
# 1. عدل prisma/schema.prisma
npm run db:format
npm run db:validate
npm run db:generate
npm run modules:generate
npm run typecheck
npm run build
```

### لو هتضيف Business Rule

- لا تعدل الـ Controller.
- أضف المنطق في Service أو طبقة Business منفصلة.
- استخدم Transaction لو العملية بتكتب في أكثر من جدول.
- اكتب `AuditLog` داخل نفس الـ transaction.
- حدّث Swagger/README لو الـ endpoint اتغير.

---

## 19. الخلاصة

المشروع الآن **أساس قوي**:

- Schema ناضج ومقيد.
- API مولّد وسريع.
- Swagger شغال.
- Auth موجود.
- البحث العربي مجهز.

لكنه **ليس متجرًا جاهزًا للإنتاج بعد**، لأن الطبقة التجارية (Transactions،
Snapshots، Audit، Status transitions، حساب الإجماليات) لسه محتاجة تنفيذ
يدوي. الخطوة الصحيحة التالية هي Migration + Seed + Business Layer، وليس إضافة
المزيد من الـ CRUD.
