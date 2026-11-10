# Om Eman — Backend

مشروع Backend لمتجر **Om Eman** المصري المتخصص في الأعشاب والتوابل والمنتجات
الطبيعية. المشروع حاليًا في مرحلة **Schema-First**: تم بناء قاعدة البيانات
والتوثيق والبنية التحتية، وتوليد **38 CRUD module + Auth module** من الـ Schema
تحت `/api`، مع استيراد منتجات من CSV.

> التطبيق يحتوي على CRUD عام مولد من الـ Schema، واستيراد منتجات من CSV على
> `POST /api/products/import`، وSwagger UI على `/api/docs`، لكنه لا يحتوي على
> `/health` ولا `/`. القواعد التجارية الدقيقة (AuditLog داخل transactions،
> transition rules، وحساب الإجماليات) ما زالت تحتاج تنفيذًا يدويًا.
>
> **دليل المشروع الكامل بالعربي:** [`docs/PROJECT_OVERVIEW_AR.md`](docs/PROJECT_OVERVIEW_AR.md)

---

## 1. الفكرة

Om Eman متجر مصري يبيع منتجات طبيعية وأعشاب وتوابل، والـ MVP الحالي يركز على:

- الكتالوج والعبوات والأسعار والخصومات.
- التوفر اليدوي بدون نظام مخزون أو لوطات.
- الطلبات والفواتير والمدفوعات والشحن والتحصيل.
- العروض والكوبونات.
- الموظفين والأدوار البسيطة و`AuditLog`.
- المحتوى والإشعارات.
- البحث العربي بالأسماء البديلة والـ Synonyms.

الـ Schema الكامل القديم محفوظ في `prisma/legacy/full-schema.prisma` للرجوع فقط.
قاعدة البيانات النشطة مصممة لتكون مصدر الحقيقة الأول، مع قواعد صارمة للمال
والكميات والـ Snapshots.

---

## 2. الحالة الحالية

| العنصر | الحالة |
| --- | --- |
| `prisma/schema.prisma` | الـ MVP النشط وصالح |
| `prisma/legacy/full-schema.prisma` | أرشيف الـ Schema الكامل — غير مستخدم |
| عدد الـ Models | 38 |
| عدد الـ Enums | 25 |
| Prisma Client | تم توليده بنجاح |
| Migration | لم يتم إنشاء migration فعلي بعد |
| Seed | لا يوجد |
| API Endpoints | 38 CRUD module + Auth module + CSV product import تحت `/api` |
| Swagger UI | مُركّب على `/api/docs` + JSON على `/api/docs.json` |
| `src/app.ts` | Helmet + CORS + body parsing + Morgan + `/api` router + error handling |
| `src/server.ts` | HTTP server + Prisma connect + graceful shutdown |
| Logging | Console + ملف `logs/app.log` |
| Error handling | `AppError` hierarchy + Prisma mapper + central handler |
| ERD والتوثيق | مكتمل داخل `docs/` |

---

## 3. التقنيات

- **Node.js + TypeScript** (strict, ESM, NodeNext).
- **Express 5**.
- **Prisma 7** + `@prisma/adapter-pg` + **PostgreSQL**.
- **Zod 4** (validation للـ body/query/params).
- **JWT + bcrypt** (مصادقة الموظفين وصلاحيات `OWNER`/`ADMIN`/`STAFF`).
- **Nodemailer** (البريد الإلكتروني).
- **Morgan** (HTTP request logging).
- **Swagger** (`swagger-ui-express` — UI مُركّب على `/api/docs`، والـ spec مولّد
  من `src/modules/module-metadata.ts`).
- **CSV import** (`csv-parser` + `multer` memory storage، حد 5 MB).

---

## 4. بنية المشروع

```text
Om-Eman/
├── prisma/
│   ├── schema.prisma              # المصدر النشط (MVP: 38 model / 25 enum)
│   ├── legacy/full-schema.prisma  # أرشيف الـ Schema الكامل — غير مستخدم
│   └── mvp/
│       ├── manual_constraints.sql # قيود وفهارس ودوال وviews خاصة بـ PostgreSQL
│       ├── dry-run.sql            # بيانات تجريبية واختبارات بحث/views
│       └── README.md              # قرارات وخطوات الـ MVP
├── prisma7.config.ts              # إعدادات Prisma CLI (يشير إلى schema.prisma النشط)
├── src/
│   ├── app.ts                     # Express app + تركيب /api router
│   ├── server.ts                  # bootstrap + graceful shutdown
│   ├── config/
│   │   ├── env.ts                 # كل متغيرات البيئة + IEnvConfig
│   │   ├── prisma.ts              # PrismaClient + pg adapter + log routing
│   │   ├── email.ts               # Nodemailer + IEmailMessage
│   │   └── swagger.ts             # OpenAPI spec مولّد من module metadata
│   ├── enums/
│   │   ├── EEnvironment.ts
│   │   └── ELogLevel.ts
│   ├── interfaces/
│   │   ├── auth/IAuthPayload.ts
│   │   ├── email/IEmailMessage.ts
│   │   └── logger/ILogger.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT + Employee status
│   │   ├── role.middleware.ts     # authorize(...roles)
│   │   ├── validate.middleware.ts # Zod body/query/params
│   │   └── error.middleware.ts
│   ├── shared/
│   │   ├── errors.ts
│   │   ├── errors/prisma-error.mapper.ts
│   │   ├── pagination.ts
│   │   └── response.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts            # bcrypt hash/compare
│   │   ├── logger/index.ts        # Console + file logger
│   │   └── arabic/normalize-arabic.ts # تطبيع وتقطيع البحث العربي
│   ├── modules/
│   │   ├── index.ts               # يجمع Auth + 38 module + CSV import
│   │   ├── auth/                  # login/me
│   │   ├── productImport/         # استيراد المنتجات من CSV
│   │   └── <model>/               # controller/service/router/validation/types
│   └── jobs/                      # فارغ عمدًا — لا cron jobs
├── scripts/
│   └── generate-modules.ts        # مولّد CRUD من prisma/schema.prisma
├── logs/
│   ├── .gitkeep
│   └── app.log                    # ملف السجل الفعلي (append-only)
├── docs/                          # ERD + architecture + rules + CSV example
├── .env.example
├── AGENTS.md
├── FEEDBACK.md
└── README.md
```

---

## 5. التشغيل

### 5.1 المتطلبات

- Node.js 20+.
- PostgreSQL يعمل ومتاح عبر `DATABASE_URL`.

### 5.2 التثبيت

```bash
npm install
```

### 5.3 متغيرات البيئة

انسخ `.env.example` إلى `.env` وعدّل القيم:

```bash
cp .env.example .env
```

أهم المتغيرات:

| المتغير | الوصف | الافتراضي |
| --- | --- | --- |
| `NODE_ENV` | `development` / `production` / `test` | `development` |
| `PORT` | منفذ HTTP | `3000` |
| `DATABASE_URL` | اتصال PostgreSQL | مطلوب |
| `CORS_ORIGIN` | أصل واحد أو قائمة مفصولة بفواصل أو `*` | `*` |
| `APP_NAME` | اسم التطبيق | `Om Eman` |
| `APP_TIMEZONE` | المنطقة الزمنية | منطقة النظام |
| `DEFAULT_CURRENCY` | العملة الافتراضية | `EGP` |
| `JWT_SECRET` | سر JWT | مطلوب في production |
| `JWT_EXPIRES_IN` | مدة التوكن | `7d` |
| `BCRYPT_SALT_ROUNDS` | عدد rounds | `12` |
| `LOG_LEVEL` | `debug` / `info` / `warn` / `error` | `info` |
| `LOG_FILE` | مسار ملف السجل | `logs/app.log` |
| `EMAIL_ENABLED` | تفعيل البريد | `false` |
| `SMTP_HOST` | SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | TLS مباشر | حسب المنفذ |
| `SMTP_USER` / `SMTP_PASS` | بيانات SMTP | فارغ |
| `SMTP_FROM` | مرسل البريد | مشتق من `APP_NAME` |

> `DATABASE_URL` مطلوب دائمًا. في production يجب توفير `JWT_SECRET` قوي، وإلا
> سيرفض التطبيق البدء.

### 5.4 الأوامر

```bash
npm run dev          # tsx watch src/server.ts
npm run build        # tsc -> dist/
npm run start        # node dist/server.js
npm run typecheck    # tsc --noEmit
npm run modules:generate # توليد CRUD modules من schema.prisma

npm run db:format    # prisma format
npm run db:validate  # prisma validate
npm run db:generate  # prisma generate
npm run db:migrate   # prisma migrate dev
npm run db:deploy    # prisma migrate deploy
npm run db:studio    # prisma studio
```

---

## 6. Logging

- يكتب Logger إلى **Console** و**ملف** في نفس الوقت.
- الملف الافتراضي: `logs/app.log`، ويمكن تغييره عبر `LOG_FILE`.
- الملف يُفتح بنمط `append`، ولا يُعاد إنشاؤه عند كل تشغيل.
- في `development`: سجل نصي مقروء.
- في `production`: سجل JSON يحتوي `timestamp` و`level` و`message` و`pid`
  و`context`.
- يتم فلترة السجلات حسب `LOG_LEVEL`.
- طلبات HTTP من Morgan تُمرَّر إلى نفس الـ logger.
- أخطاء وتحذيرات Prisma تُمرَّر إلى نفس الـ logger.
- عند graceful shutdown يتم إغلاق stream الملف عبر `logger.close()`.

ملف السجل غير مُتتبع في Git (`logs/*.log`)، ويمكن أرشفته أو تفريغه يدويًا أو
بسكربت خارجي لاحقًا. لا يتم تدوير الملف تلقائيًا في هذه المرحلة.

---

## 7. قاعدة البيانات

`prisma/schema.prisma` هو الـ MVP النشط (38 model / 25 enum) ويغطي:

- الموظفين والأدوار البسيطة و`AuditLog`.
- العملاء والعناوين والسلة والمفضلة.
- الكتالوج: أقسام، منتجات، عبوات/SKU، صور، أسماء بديلة، وBundles معرفة مسبقًا.
- البحث العربي: Synonyms وSearchLog و`searchText`.
- الطلبات، بنود الطلب، Snapshots، الفواتير، المدفوعات، والشحن.
- العروض والكوبونات و`PromotionRedemption`.
- Marketing Events وMeta Pixel/CAPI attribution.
- المحتوى والإشعارات والإعدادات وتسلسل المستندات.

الـ Schema الكامل القديم (133 model / 72 enum) محفوظ في
`prisma/legacy/full-schema.prisma` للرجوع فقط، ولا يستخدمه Prisma CLI أو
التطبيق.

### قواعد لا تُكسر

- المال والكميات بـ `Decimal` فقط، لا `Float`.
- المعرّفات `cuid()`.
- `AuditLog` وسجلات الحالة وبنود الفواتير Append-only.
- Snapshots إلزامية في الطلبات والفواتير.
- فصل `Product` عن `ProductPackage`.
- لا يوجد نظام مخزون: التوفر يدوي عبر `ProductPackage.stockStatus`.
- لا مرتجعات أو Refunds: الإلغاء وإبطال الفاتورة فقط.
- `Payment` هو مصدر الحقيقة، و`Order.paymentStatus` قيمة مخزنة مؤقتًا.
- الخصومات من `PromotionRedemption` فقط.
- Bundles معرفة مسبقًا، وبند واحد لكل Bundle، وممنوع تداخل الـ Bundles.
- البحث العربي يعتمد على الأسماء البديلة والـ Synonyms، ولا يحذف "ال" تلقائيًا.
- الصلاحيات تُفرض في الـ Backend، وليس في الواجهة فقط.
- كل `enum` يبدأ بـ `E` (`ELanguage`, `EOrderStatus`)، وكل `interface`/`type`
  يبدأ بـ `I` (`ILanguage`, `IEnvConfig`).
- لا قيم أعمال مفترضة (عمولات، أسعار جملة، آجال سداد، ضرائب) بدون إعداد صريح.

الدليل العربي الكامل للمشروع في `docs/PROJECT_OVERVIEW_AR.md`، والتفاصيل الكاملة
للـ MVP في `prisma/mvp/README.md`، وتوثيق الـ Schema الكامل المؤرشف في:

- `docs/architecture.md`
- `docs/entity-inventory.md`
- `docs/integrity-rules.md`
- `docs/indexes-and-queries.md`
- `docs/migration-plan.md`
- `docs/business-rule-coverage.md`
- `docs/reseller-module.md`
- `docs/assumptions.md`
- `docs/erd.md` و`docs/erd-ar.md`

### 7.1 وحدات API

- `POST /api/auth/login` و`GET /api/auth/me`.
- 38 CRUD module مولدة من `prisma/schema.prisma`، كل واحدة تحت مسار جمع
  بصيغة kebab-case (مثل `/api/products`, `/api/product-packages`).
- القراءة العامة متاحة لـ: `Category`, `Subcategory`, `Product`,
  `ProductImage`, `ProductAlias`, `ProductPackage`, `ProductBundleComponent`,
  `SearchSynonym`, `Banner`, `StaticPage`, `Faq`.
- كل عمليات الكتابة تتطلب `authenticate` + `authorize(OWNER, ADMIN)`.
- `Employee` و`Customer` يقبلان `password` ويُخزَّنان كـ `passwordHash`.
- الوحدات Append-only (`AuditLog`, `OrderStatusHistory`,
  `ShipmentStatusHistory`, `InvoiceLine`, `PromotionRedemption`,
  `OrderAddressSnapshot`) توفر القراءة والإنشاء فقط، وترفض التعديل/الحذف.
- استيراد المنتجات من CSV: `POST /api/products/import` (multipart، الحقل
  `file`، OWNER/ADMIN، بحد أقصى 5 MB). الإضافة اليدوية عبر `POST /api/products`
  ما زالت تعمل. النموذج: `docs/examples/products-import.csv`.
- المولد: `npm run modules:generate`، ويحافظ على `src/modules/auth` و
  `src/modules/productImport` كما هما.
- Swagger UI على `/api/docs`، والـ JSON على `/api/docs.json`.
- هذه الوحدات CRUD عامة؛ القواعد التجارية الدقيقة (transactions، audit،
  transition rules، حساب الإجماليات) تحتاج تنفيذًا يدويًا.

---

## 8. ما تم إنجازه

- اعتماد Schema الـ MVP النشط (38 model و25 enum) في `prisma/schema.prisma`.
- أرشفة الـ Schema الكامل القديم (133 model و72 enum) في
  `prisma/legacy/full-schema.prisma` بدون استخدامه.
- إضافة قيود PostgreSQL ودوال البحث العربي وviews التقارير في
  `prisma/mvp/manual_constraints.sql`.
- إضافة `src/utils/arabic/normalize-arabic.ts` للبحث العربي.
- توليد Prisma Client بنجاح.
- توليد SQL مبدئي عبر `prisma migrate diff` للتحقق من الـ schema (بدون تطبيقه).
- بناء Express app مع تركيب `/api` router.
- إعداد Helmet وCORS وJSON/urlencoded وMorgan.
- إعداد Prisma مع `@prisma/adapter-pg`.
- بناء `AppError` hierarchy وPrisma error mapper وcentral error handler.
- بناء `shared/response.ts` و`shared/pagination.ts` و`validate.middleware.ts`.
- بناء Auth module (login/me) مع JWT + bcrypt + Employee status check.
- بناء `scripts/generate-modules.ts` وتوليد 38 CRUD module من الـ Schema.
- بناء `src/modules/index.ts` لتجميع كل الـ routers تحت `/api`.
- التحقق من `npx tsc --noEmit` و`npm run build` بنجاح بعد التوليد.
- بناء logger يكتب إلى Console وملف `logs/app.log`.
- إعداد `env.ts` مع `IEnvConfig` و`EEnvironment` و`ELogLevel`.
- إعداد `email.ts` مع `IEmailMessage` وNodemailer.
- إعداد `swagger.ts` مع OpenAPI كامل وتركيب Swagger UI على `/api/docs`.
- إضافة استيراد المنتجات من CSV على `POST /api/products/import` مع دعم إنشاء
  `ProductPackage` اختياريًا.
- إعداد graceful shutdown يغلق HTTP وPrisma وlogger.
- كتابة ERD مقسمة حسب المجال والتوثيق المعماري.
- كتابة `README.md` و`FEEDBACK.md` و`AGENTS.md`.

---

## 9. ما لم يتم بعد

- Migration فعلي (`prisma migrate dev`) — يحتاج قاعدة بيانات حقيقية.
- تطبيق `prisma/mvp/manual_constraints.sql` — يحتاج قاعدة بيانات حقيقية.
- Seed أساسي حقيقي (عملة EGP، إعدادات المتجر، تسلسلات، دور إداري).
- JWT refresh token وpermission middleware تفصيلي (الصلاحيات الحالية دورية فقط).
- القواعد التجارية الدقيقة داخل الـ modules المولدة (transactions، audit،
  transition rules، حساب الإجماليات، Snapshot enforcement).
- Jobs للإشعارات ومهام المحتوى.
- اختبارات آلية.

---

## 10. الخطوات التالية المقترحة

1. توفير `DATABASE_URL` حقيقي وإنشاء Migration أولي:
   ```bash
   npm run db:migrate -- --name init
   ```
2. تطبيق القيود اليدوية، ثم تشغيل dry-run اختياريًا:
   ```bash
   npx prisma db execute --file prisma/mvp/manual_constraints.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/mvp/dry-run.sql
   ```
3. إعداد Seed أساسي حقيقي فقط — بدون بيانات وهمية.
4. مراجعة الـ modules المولدة وإضافة القواعد التجارية لكل module.
5. إضافة refresh token وpermission middleware تفصيلي عند الحاجة.
6. تحديث أمثلة Swagger بعد استقرار القواعد التجارية.
7. إضافة Jobs والاختبارات.
8. مراجعة فهارس البحث العربي باستخدام `EXPLAIN ANALYZE` بعد بيانات حقيقية.
9. بعد أي تغيير في الـ Schema: `npm run modules:generate` ثم `npm run typecheck`.

---

## 11. قواعد التطوير

- TypeScript strict، وESM، وكل import محلي ينتهي بـ `.js`.
- أسماء `enum` تبدأ بـ `E`، وأسماء `interface` تبدأ بـ `I`.
- لا `any` إلا لضرورة موثقة.
- لا منطق أعمال داخل controllers.
- لا استجابات HTTP داخل services.
- اتبع نمط `module/controller/service/router/validation/types` عند إضافة
  endpoints جديدة، وأعد توليد الـ modules بعد تغييرات الـ Schema.
- لا بيانات تجريبية في production.
- لا migrations على production دون نسخة احتياطية.

---

## 12. التحقق قبل التسليم

```bash
npx prisma format
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
```

يجب أن تنجح كلها. راجع `AGENTS.md` قبل أي تعديل، و`FEEDBACK.md` لسجل العمل
والقرارات المفتوحة.
