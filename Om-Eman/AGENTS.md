# AGENTS.md — ذاكرة مشروع Om Eman

> هذا الملف مخصص لأي AI أو مطور يعمل على المشروع لاحقًا. اقرأه قبل أي تعديل.
> آخر تحديث: 2026-11-03.

## 1. نظرة عامة

**Om Eman** متجر مصري للمنتجات الطبيعية والأعشاب والتوابل. المشروع حاليًا
**Backend Schema-First**، والتركيز على:

- اعتماد قاعدة بيانات Prisma/PostgreSQL MVP للإنتاج.
- بناء البنية التحتية لتطبيق Express.
- كتابة ERD وتوثيق القرارات.
- توفير CRUD modules مولدة من الـ Schema + Auth module + CSV product import
  تحت `/api`.
- **عدم** إنشاء migration/seed أو واجهة أمامية أو بيانات تجريبية بعد.

المسار: `E:\NODE_JS\Udemy\Training\Om-Eman`.

## 2. الحالة الحالية

| العنصر | الحالة |
| --- | --- |
| `prisma/schema.prisma` | الـ MVP النشط وصالح (`prisma validate` ينجح) |
| `prisma/legacy/full-schema.prisma` | أرشيف الـ Schema الكامل (133 model / 72 enum) — غير مستخدم |
| عدد الـ Models | 38 |
| عدد الـ Enums | 25 |
| Prisma Client | تم توليده من الـ MVP |
| `src/app.ts` | جاهز: Helmet, CORS, JSON, Morgan, `/api` router, error handling |
| `src/server.ts` | جاهز: HTTP server, Prisma connect, graceful shutdown |
| `src/config/env.ts` | جاهز مع `IEnvConfig` و`EEnvironment` و`ELogLevel` |
| `src/config/prisma.ts` | جاهز باستخدام `@prisma/adapter-pg` + log routing |
| `src/config/email.ts` | جاهز: Nodemailer + `IEmailMessage` |
| `src/config/swagger.ts` | جاهز: OpenAPI spec كامل + UI على `/api/docs` |
| `src/enums/` | `EEnvironment`, `ELogLevel` |
| `src/interfaces/` | `IAuthPayload`, `IEmailMessage`, `ILogger` |
| `src/shared/errors.ts` | جاهز |
| `src/shared/errors/prisma-error.mapper.ts` | جاهز |
| `src/shared/response.ts` | جاهز: `ApiResponse` |
| `src/shared/pagination.ts` | جاهز: `resolvePagination` + `toPaginatedResult` |
| `src/middlewares/error.middleware.ts` | جاهز |
| `src/middlewares/auth.middleware.ts` | جاهز: JWT + Employee ACTIVE check |
| `src/middlewares/role.middleware.ts` | جاهز: `authorize(...roles)` |
| `src/middlewares/validate.middleware.ts` | جاهز: Zod body/query/params |
| `src/utils/logger/index.ts` | جاهز: Console + file (`logs/app.log`) |
| `src/utils/jwt.ts` | جاهز: sign/verify |
| `src/utils/password.ts` | جاهز: bcrypt hash/compare |
| `src/modules/` | Auth + 38 CRUD module + CSV product import — `/api` |
| `scripts/generate-modules.ts` | مولّد CRUD من `prisma/schema.prisma` |
| `logs/app.log` | موجود وفارغ — append-only، غير مُتتبع في Git |
| `src/jobs/` | فارغ عمدًا — لا cron jobs |
| ERD | `docs/erd.mmd` + `docs/erd-*.mmd` |
| التوثيق | `docs/*.md` |
| Migration | **لم يتم إنشاء migration فعلي بعد** |
| Seed data | **لا يوجد** |

> **مهم:** الـ Schema النشط هو MVP (38 model). الأقسام التي تتحدث عن المخزون
> أو المشتريات أو الريسلر أو المرتجعات تصف الـ Schema الكامل المؤرشف في
> `prisma/legacy/full-schema.prisma`، وليست جزءًا من الـ MVP النشط.

## 3. التقنيات

- TypeScript strict + ESM (`"type": "module"` في `package.json`).
- Express 5.
- Prisma 7 + `@prisma/adapter-pg` + PostgreSQL.
- Zod 4 (validation للـ body/query/params).
- JWT + bcrypt (مصادقة الموظفين + أدوار `OWNER`/`ADMIN`/`STAFF`).
- Nodemailer (مهيأ في `src/config/email.ts`).
- node-cron (مخطط).
- Swagger (`swagger-ui-express` — UI على `/api/docs`، وJSON على `/api/docs.json`).

### اصطلاحات التسمية

- كل `enum` يبدأ بـ `E`، سواء في TypeScript أو Prisma:
  `ELanguage`, `EOrderStatus`, `EPaymentStatus`.
- كل `interface` أو `type` يبدأ بـ `I`: `ILanguage`, `IEnvConfig`, `ILogger`.
- لا تُضف enum أو interface بدون البادئة الصحيحة.

### ملاحظات TypeScript

- `tsconfig.json` يستخدم `module: nodenext` و `verbatimModuleSyntax`.
- كل الاستيرادات المحلية يجب أن تنتهي بـ `.js` (مثال: `./config/env.js`).
- `exactOptionalPropertyTypes` و `noUncheckedIndexedAccess` مفعّلان.
- استخدم `import type` للأنواع فقط.
- لا تستخدم `any` إلا لضرورة موثقة.

## 4. أوامر مهمة

من داخل `Om-Eman`:

```bash
npx prisma format
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run modules:generate
npm run dev
npm run build
npm run start
npx prisma migrate dev --name init
```

- `npm run modules:generate` يعيد توليد CRUD modules من الـ Schema.
- `npm run dev` يشغل `tsx watch src/server.ts`.
- `npm run build` يبني إلى `dist/`.
- `npm run start` يشغل `dist/server.js`.
- لا تشغّل `migrate dev` أو `db push` على قاعدة إنتاج.

## 5. قواعد تصميم قاعدة البيانات النشطة (MVP)

> هذه القواعد تخص `prisma/schema.prisma` النشط. الـ Schema الكامل القديم موجود في
> `prisma/legacy/full-schema.prisma` للرجوع فقط، ولا تُطبّق عليه التعديلات.

1. **المال والكميات بـ `Decimal` فقط.** ممنوع `Float`.
   - المال: `@db.Decimal(18, 4)`.
   - الضرائب: `@db.Decimal(9, 6)`.
2. **المعرّفات:** `String @id @default(cuid())`.
3. **التواريخ:** `createdAt @default(now())` و `updatedAt @updatedAt` للنماذج
   القابلة للتعديل.
4. **السجلات التاريخية Append-only.**
   - لا تعدّل أو تحذف `AuditLog`, `OrderStatusHistory`,
     `ShipmentStatusHistory`, `InvoiceLine`, `PromotionRedemption`,
     `OrderAddressSnapshot`.
   - التصحيح يكون بـ Void/Reissue أو سجل جديد مرتبط بالسجل الأصلي.
5. **Snapshots إلزامية** في الطلبات والفواتير: الأسماء، SKU، السعر، الضريبة،
   والعنوان.
6. **فصل الهويات:**
   - `Product` = هوية تجارية.
   - `ProductPackage` = عبوة/SKU قابلة للبيع.
   - لا يوجد `InventoryItem` في الـ MVP.
7. **فصل الحالات:**
   - `Order.status` مستقل عن `Order.paymentStatus`.
   - `Shipment.status` مستقل.
   - `Payment` هو مصدر الحقيقة، و`Order.paymentStatus` قيمة مخزنة مؤقتًا.
8. **لا مخزون ولا ريسلر في الـ MVP.**
   - التوفر يدوي عبر `ProductPackage.stockStatus`.
   - لا توجد مستودعات أو لوطات أو حركات مخزون أو عهدة ريسلر.
9. **الصلاحيات تُفرض في الـ Backend**، وليس فقط في الواجهة.
   - كل عملية حساسة تكتب `AuditLog` داخل نفس الـ transaction.
10. **لا تخترع قيم أعمال:** لا عمولات، لا أسعار جملة، لا فترات سداد، لا نسب
    ضريبة، لا شروط ائتمان افتراضية. استخدم إعدادات/مدخلات صريحة و snapshots.
11. **لا بيانات وهمية في الإنتاج.** أي seed يجب أن يكون إعدادًا أساسيًا حقيقيًا
    وموثقًا.
12. **الترقيم عبر `DocumentSequence`** حسب النوع والسنة، وليس timestamps.
13. **الحذف:** استخدم الأرشفة/التعطيل، وليس الحذف النهائي، للكيانات المرتبطة
    بتاريخ. استخدم `Restrict` أو `SetNull` بحذر.

## 6. خريطة الملفات

```text
prisma/schema.prisma                 # المصدر النشط (MVP: 38 model / 25 enum)
prisma/legacy/full-schema.prisma     # أرشيف الـ Schema الكامل — غير مستخدم
prisma/mvp/manual_constraints.sql    # قيود وفهارس ودوال وviews PostgreSQL
prisma/mvp/dry-run.sql               # بيانات تجريبية واختبارات بحث/views
prisma/mvp/README.md                 # قرارات وخطوات الـ MVP
src/utils/arabic/normalize-arabic.ts # تطبيع وتقطيع البحث العربي
prisma7.config.ts                    # Prisma config (يشير إلى schema.prisma النشط)
src/app.ts                           # Express app + تركيب /api router
src/server.ts                        # bootstrap + graceful shutdown
src/config/env.ts                    # متغيرات البيئة + IEnvConfig
src/config/prisma.ts                 # PrismaClient + pg adapter + log routing
src/config/email.ts                  # Nodemailer + IEmailMessage
src/config/swagger.ts                # OpenAPI spec + Swagger UI
src/enums/EEnvironment.ts            # بيئات التشغيل
src/enums/ELogLevel.ts               # مستويات السجل
src/interfaces/auth/IAuthPayload.ts  # JWT payload
src/interfaces/email/IEmailMessage.ts
src/interfaces/logger/ILogger.ts
src/shared/errors.ts                 # AppError hierarchy
src/shared/errors/prisma-error.mapper.ts
src/shared/pagination.ts             # pagination helpers
src/shared/response.ts               # ApiResponse
src/middlewares/error.middleware.ts
src/middlewares/auth.middleware.ts   # JWT + Employee ACTIVE
src/middlewares/role.middleware.ts   # authorize(...roles)
src/middlewares/validate.middleware.ts # Zod body/query/params
src/utils/logger/index.ts            # Console + file logger
src/utils/jwt.ts                     # JWT sign/verify
src/utils/password.ts                # bcrypt hash/compare
src/modules/index.ts                 # Auth + 38 module + CSV import
src/modules/module-metadata.ts       # مولّد — يستخدمه Swagger
src/modules/auth/                    # login/me
src/modules/productImport/           # استيراد المنتجات من CSV
src/modules/<model>/                 # controller/service/router/validation/types
src/middlewares/csv-upload.middleware.ts # رفع CSV في الذاكرة
scripts/generate-modules.ts          # مولّد CRUD + metadata
docs/PROJECT_OVERVIEW_AR.md          # دليل المشروع الكامل بالعربي
docs/examples/products-import.csv    # نموذج CSV للاستيراد
logs/app.log                         # ملف السجل الفعلي (غير مُتتبع)
logs/.gitkeep                        # إبقاء مجلد logs في Git
docs/erd.mmd                         # ERD رئيسي
docs/erd.md                          # فهرس مخططات ERD
docs/erd-ar.md                       # شرح ERD بالعربية
docs/erd-catalog-inventory.mmd
docs/erd-procurement.mmd
docs/erd-sales.mmd
docs/erd-resellers-finance.mmd
docs/erd-identity-content.mmd
docs/architecture.md
docs/entity-inventory.md
docs/integrity-rules.md
docs/indexes-and-queries.md
docs/migration-plan.md
docs/business-rule-coverage.md
docs/reseller-module.md
docs/assumptions.md
```

## 7. ما تم تنفيذه بالتفصيل

### 7.1 Schema

الـ Schema النشط هو MVP ويحتوي 38 model و25 enum:

- الموظفين والأدوار البسيطة و`AuditLog`.
- العملاء والعناوين والسلة والمفضلة.
- الكتالوج: أقسام، منتجات، عبوات، صور، أسماء بديلة، Bundles معرفة مسبقًا.
- البحث العربي: Synonyms وSearchLog و`searchText`.
- الطلبات، الفواتير، المدفوعات، الشحن، العروض، والكوبونات.
- Marketing Events، المحتوى، الإشعارات، الإعدادات، وتسلسل المستندات.

الـ Schema الكامل القديم (133 model / 72 enum) محفوظ في
`prisma/legacy/full-schema.prisma` للرجوع فقط، ويغطي:

- الموظفين والأدوار والصلاحيات و`AuditLog` و`LoginAttempt`.
- العملاء والعناوين والسلة والمفضلة ونشاط العملاء.
- الولاء والتقييمات.
- الكتالوج: أقسام، منتجات، عبوات، صور، أسماء بديلة، خصائص، Bundles.
- الوحدات والعملات والضرائب والإعدادات وتسلسل المستندات.
- المستودعات والمواقع والأصناف واللوطات والأرصدة والحركات والحجوزات والجرد
  والتحويلات والهوالك والإنتاج وتنبيهات الانتهاء.
- المشتريات: موردون، أوامر شراء، استلام، فواتير موردين، تكاليف إضافية/Landed
  Cost، فروقات، مرتجعات، دفتر موردين، مدفوعات وتخصيصات.
- المبيعات: طلبات، بنود، Snapshots، خصومات، فواتير، مدفوعات، محاولات دفع،
  إثباتات، مرتجعات، Refunds.
- الشحن: شركات، تعرفات، شحنات، محاولات تسليم، Carrier Remittance.
- الوفاء: `OrderFulfillment` و`OrderFulfillmentAllocation` وتأكيد الريسلر.
- العروض والكوبونات والاسترداد.
- المالية: حسابات، قيود، تحويلات، مصروفات، مصروفات متكررة.
- الريسلر: بروفايل، عناوين عامة، تشكيلة، توفر، سجل تغيرات، توريد، عهدة، دفتر
  حساب، مدفوعات، تسويات مخزون.
- المحتوى والإشعارات والمرفقات وإصداراتها.

### 7.2 Infrastructure

- `app.ts` يحتوي على:
  - Helmet.
  - CORS حسب `CORS_ORIGIN`.
  - `express.json` و `urlencoded`.
  - Morgan logging مع تمرير السجلات إلى الـ logger.
  - `app.use("/api", apiRouter)`.
  - `notFoundHandler` و `errorHandler`.
- **لا يوجد** `GET /health` ولا `GET /`.
- Swagger UI مُركّب على `/api/docs`، والـ JSON على `/api/docs.json`.
- CSV upload عبر `multer` memory storage في
  `src/middlewares/csv-upload.middleware.ts` (5 MB، CSV فقط).
- `server.ts` يتصل بـ Prisma، يشغل HTTP، ويتعامل مع `SIGINT`/`SIGTERM`
  و`unhandledRejection`/`uncaughtException` مع graceful shutdown، ويغلق
  الـ logger في النهاية.
- `logger` يكتب إلى Console و`logs/app.log` (أو `LOG_FILE`)، مع JSON في
  production ونص مقروء في development.

### 7.3 Error handling

- `AppError` وأبناؤه: `ValidationError`, `BadRequestError`, `UnauthorizedError`,
  `ForbiddenError`, `NotFoundError`, `ConflictError`, `TooManyRequestsError`,
  `InternalServerError`.
- `mapPrismaError` يحوّل أخطاء Prisma المعروفة إلى أخطاء تطبيقية.
- `errorHandler` هو المكان الوحيد الذي يبني استجابة الخطأ.

### 7.4 API Modules

- `POST /api/auth/login` و`GET /api/auth/me`.
- `src/modules/index.ts` يجمع Auth + 38 CRUD module مولدة من الـ Schema +
  CSV product import.
- كل module فيه: `controller.ts`, `service.ts`, `router.ts`, `validation.ts`,
  `types.ts`.
- القراءة العامة: `Category`, `Subcategory`, `Product`, `ProductImage`,
  `ProductAlias`, `ProductPackage`, `ProductBundleComponent`, `SearchSynonym`,
  `Banner`, `StaticPage`, `Faq`.
- كل الكتابة: `authenticate` + `authorize(OWNER, ADMIN)`.
- `Employee` و`Customer` يقبلان `password` ويُخزَّنان كـ `passwordHash`.
- Append-only (قراءة/إنشاء فقط): `AuditLog`, `OrderStatusHistory`,
  `ShipmentStatusHistory`, `InvoiceLine`, `PromotionRedemption`,
  `OrderAddressSnapshot`.
- `POST /api/products/import` يستورد منتجات من CSV (multipart، الحقل `file`،
  OWNER/ADMIN، بحد أقصى 5 MB)، مع إنشاء `ProductPackage` اختياريًا عند وجود
  `sku`. الإضافة اليدوية عبر `POST /api/products` ما زالت تعمل.
- `npm run modules:generate` يعيد توليد الـ modules ويحافظ على `auth/` و
  `productImport/`، ويولّد `src/modules/module-metadata.ts` المستخدم في Swagger.
- Swagger UI: `/api/docs`، وJSON: `/api/docs.json`.
- الـ modules CRUD عامة؛ القواعد التجارية الدقيقة تحتاج تنفيذًا يدويًا.
- الدليل العربي الكامل: `docs/PROJECT_OVERVIEW_AR.md`.

## 8. الريسلر — أهم القواعد (مؤرشف)

> الريسلر ليس جزءًا من الـ MVP النشط. هذا القسم يخص الـ Schema الكامل المؤرشف في
> `prisma/legacy/full-schema.prisma`.

راجع `docs/reseller-module.md` بالكامل. الملخص:

1. الاكتشاف العام يتطلب: `ACTIVE` + `PUBLIC` + `publicVisibility` + صلاحية
   الترخيص + عنوان حالي عام + تشكيلة نشطة.
2. `ResellerProduct` = التشكيلة.
3. `ResellerPackageAvailability` = إشارة توفر مُبلّغ عنها/مؤكدة، وليست حجزًا.
   - `REPORTED_IN_STOCK` تختلف عن `CONFIRMED_IN_STOCK`.
   - `reportedQuantity` تختلف عن `confirmedQuantity`.
   - `lastReportedAt` تختلف عن `lastConfirmedAt`.
4. `ResellerStockBalance/Movement` = عهدة فعلية منفصلة.
5. `OrderFulfillmentAllocation` + `ResellerFulfillmentConfirmation` = التزام
   فعلي بالوفاء.
6. لا تُدخل عهدة الريسلر في مخزون Om Eman إلا بتحويل ملكية صريح.
7. التسويات تُنشئ `ResellerStockMovement` تعديلي، ولا تعدّل الحركات القديمة.
8. دفتر حساب الريسلر Append-only، والمدفوعات تُخصص ضد القيود.
9. لا عمولات أو أسعار جملة أو آجال سداد مفترضة.

## 9. التوثيق والـ ERD

> ملفات `docs/*` التالية تصف الـ Schema الكامل المؤرشف في
> `prisma/legacy/full-schema.prisma`. توثيق الـ MVP النشط موجود في
> `prisma/mvp/README.md`.

- `docs/erd.mmd`: نظرة عامة على العلاقات الأساسية.
- `docs/erd-catalog-inventory.mmd`: الكتالوج والمخزون والإنتاج.
- `docs/erd-procurement.mmd`: المشتريات والموردون.
- `docs/erd-sales.mmd`: الطلبات والدفع والشحن والوفاء.
- `docs/erd-resellers-finance.mmd`: الريسلر والمالية.
- `docs/erd-identity-content.mmd`: الهوية والمحتوى.
- `docs/architecture.md`: المعمارية والحالة.
- `docs/entity-inventory.md`: جرد كل الـ models.
- `docs/integrity-rules.md`: قواعد المعاملات والـ invariants.
- `docs/indexes-and-queries.md`: الفهارس والاستعلامات.
- `docs/migration-plan.md`: خطة الترحيل.
- `docs/business-rule-coverage.md`: تغطية المتطلبات.
- `docs/assumptions.md`: الافتراضات والقرارات المفتوحة.

## 10. الخطوات التالية المقترحة

1. **إنشاء Migration أولي** بعد التأكد من `DATABASE_URL`:
   `npx prisma migrate dev --name init`.
2. **تطبيق القيود اليدوية**:
   `npx prisma db execute --file prisma/mvp/manual_constraints.sql`.
3. **إعداد Seed أساسي حقيقي فقط** (عملة EGP، إعدادات المتجر، تسلسلات
   المستندات، دور إداري). لا بيانات وهمية.
4. **مراجعة الـ modules المولدة** وإضافة القواعد التجارية لكل module
   (transactions، audit، transition rules، حساب الإجماليات، Snapshots).
5. **إضافة refresh token وpermission middleware تفصيلي** عند الحاجة؛
   الصلاحيات الحالية دورية فقط (`OWNER`/`ADMIN`/`STAFF`).
6. **تحديث أمثلة Swagger** بعد استقرار القواعد التجارية.
7. **Jobs** للإشعارات ومهام المحتوى.
8. **اختبارات آلية** للـ modules والـ constraints.
9. **مراجعة فهارس البحث العربي** بعد بيانات حقيقية باستخدام `EXPLAIN ANALYZE`.
10. **بعد أي تغيير في الـ Schema**: `npm run modules:generate` ثم
    `npm run typecheck`.

## 11. ممنوعات

- لا تضف endpoints يدويًا خارج نمط `module/controller/service/router/validation/types`.
- لا تعدّل الـ modules المولدة يدويًا دون توثيق؛ عدّل المولد أو أضف طبقة business.
- لا تضف بيانات تجريبية/وهمية.
- لا تغيّر أسماء الـ models أو الحقول الموجودة دون سبب موثق ومراجعة.
- لا تستخدم `Float` للمال أو الكميات.
- لا تحذف سجلات تاريخية.
- لا تضع منطق الأعمال داخل controllers.
- لا تبنِ استجابات HTTP داخل services.
- لا تخترع قيم أعمال غير مؤكدة.
- لا تشغّل migrations على قاعدة إنتاج دون نسخة احتياطية.

## 12. ملاحظات بيئة

- `.env` الحالي يحتوي `DATABASE_URL` فقط بصيغة Prisma Postgres محلية
  (`prisma+postgres://localhost:51213/...`) وقد لا تكون القاعدة تعمل.
- `prisma7.config.ts` يقرأ `process.env["DATABASE_URL"]`.
- `env.ts` يقرأ `DATABASE_URL` ويرفض التشغيل إذا كانت مفقودة.
- في production يجب توفير `JWT_SECRET` قوي، وإلا يرفض التطبيق البدء.
- `LOG_FILE` افتراضيًا `logs/app.log`، و`LOG_LEVEL` افتراضيًا `info`.
- البريد اختياري في development؛ `EMAIL_ENABLED=false` يعطّل الإرسال.
- المنطقة الزمنية تُقرأ من `APP_TIMEZONE` مع fallback لنظام التشغيل.
- العملة الافتراضية `EGP`.

## 13. معايير القبول قبل أي تسليم

```bash
npx prisma format
npx prisma validate
npx prisma generate
npm run modules:generate
npx tsc --noEmit
npm run build
```

يجب أن تنجح كلها. أي تغيير في الـ schema يجب أن يتبعه تحديث:

- `docs/erd*.mmd` إذا تغيرت العلاقات.
- `docs/entity-inventory.md` إذا أُضيف/حُذف model.
- `docs/integrity-rules.md` إذا تغيرت قواعد المعاملات.
- `docs/business-rule-coverage.md` إذا تغطت متطلبات جديدة.
- هذا الملف `AGENTS.md` إذا تغيرت الحالة أو الخطط.
