# FEEDBACK / Work Log — Om Eman

> سجل عمل وقرارات وملاحظات. يُحدّث بعد كل جلسة عمل.
> آخر تحديث: 2026-11-03.

---

## الجلسة الحالية — 2026-11-03

### النطاق المطلوب

إضافة استيراد المنتجات من ملف CSV بجانب الإضافة اليدوية الحالية، باستخدام
`csv-parser` مع الحفاظ على بنية المشروع الحالية.

### ما تم تنفيذه

- إضافة `src/modules/productImport/` (controller/service/router/validation/types).
- إضافة `src/modules/productImport/csv.ts` لقراءة CSV وتنظيف الصفوف ودعم أسماء
  أعمدة مرنة (`name_ar`, `price`, `packageSku`, ...).
- إضافة `POST /api/products/import` (multipart، الحقل `file`، OWNER/ADMIN).
- إضافة `src/middlewares/csv-upload.middleware.ts` باستخدام `multer` memory
  storage، بحد أقصى 5 MB وملفات CSV فقط.
- دعم إنشاء `ProductPackage` اختياريًا عند وجود `sku`، مع التحقق من
  `sizeValue`/`sizeUnit`/`sellingPrice` و`compareAtPrice > sellingPrice`.
- رفض التكرار داخل الملف وفي قاعدة البيانات لـ `slug`/`sku`/`barcode` على مستوى
  الصف، مع إرجاع رقم الصف والسبب.
- توليد `searchNameArNormalized` و`searchNameEnNormalized` و`searchText`
  تلقائيًا عند عدم إرسالهم.
- تعديل `scripts/generate-modules.ts` للحفاظ على `productImport/` وتركيبه في
  `src/modules/index.ts` بعد إعادة التوليد.
- توثيق المسار في Swagger وإضافة نماذج `ProductImportResult`.
- إضافة `docs/examples/products-import.csv` وتحديث README/AGENTS/CHANGELOG/
  PROJECT_OVERVIEW_AR.

### التحقق

- `npm run modules:generate` نجح مع الحفاظ على `productImport/`.
- `npx tsc --noEmit` نجح.
- `npm run build` نجح.
- Swagger JSON: 79 path / 181 operation / 123 schema، وكل `$ref` موجود.
- `POST /api/products/import` موجود ويرجع `401` بدون توكن (أي أن الـ route
  مسجل، وليس `404`).
- اختبار parser/validation محليًا على CSV عربي نجح.
- اختبار service ببيانات Prisma وهمية نجح (صفوف صالحة + تكرار slug).
- اختبار multer: ملف CSV صالح يرجع 200، وملف `.txt` يرجع 400.

### ملاحظات

- الاستيراد ينشئ صفوفًا صالحة ويبلغ عن الصفوف الفاشلة؛ وليس كل شيء أو لا شيء.
- لا يزال Migration/Seed/Business Layer غير منفذين.
- الإضافة اليدوية `POST /api/products` لم تتغير.

---

## جلسة سابقة — 2026-11-01

### النطاق المطلوب

توليد CRUD modules من `prisma/schema.prisma` بنفس بنية
`projects/project2_clinica/backend/src/modules` تحت `src/modules`، مع Auth
module، ثم جعل المشروع typecheck/build.

### ما تم تنفيذه

- إضافة `src/shared/response.ts` و`src/shared/pagination.ts`.
- إضافة `src/middlewares/validate.middleware.ts` (Zod body/query/params).
- إضافة `src/interfaces/auth/IAuthPayload.ts` و`src/utils/jwt.ts` و
  `src/utils/password.ts`.
- إضافة `src/middlewares/auth.middleware.ts` و`src/middlewares/role.middleware.ts`.
- إضافة Auth module: `src/modules/auth/{validation,types,service,controller,routes}.ts`.
- إضافة `scripts/generate-modules.ts` وتوليد 38 module (controller/service/router/
  validation/types).
- إضافة `src/modules/index.ts` وتركيبه في `src/app.ts` تحت `/api`.
- إضافة `npm run modules:generate`.
- إضافة `src/modules/module-metadata.ts` لتوليد OpenAPI من الـ Schema.
- بناء OpenAPI spec كامل في `src/config/swagger.ts` وتركيب Swagger UI على
  `/api/docs` وJSON على `/api/docs.json`.
- إضافة `docs/PROJECT_OVERVIEW_AR.md` كدليل عربي كامل للمشروع.
- تحديث README وAGENTS.md وCHANGELOG.md وdocs لتوثيق الـ API وSwagger.

### التحقق

- `npm run modules:generate` نجح.
- `npx tsc --noEmit` نجح.
- `npm run build` نجح.
- تحميل `dist/app.js` نجح.
- Swagger JSON: 78 path / 180 operation / 119 schema، وكل `$ref` موجود.
- Swagger UI يستجيب بنجاح على `/api/docs/`.

### ملاحظات

- الـ modules CRUD عامة؛ القواعد التجارية تحتاج تنفيذًا يدويًا.
- وقتها لم يكن هناك migration/seed/Swagger UI؛ Swagger أُضيف في نفس اليوم لاحقًا.
- `psql` غير مثبت وقاعدة البيانات الحية غير متاحة.

---

## جلسة سابقة — 2026-10-30

### النطاق المطلوب

تحويل البنية التحتية الحالية إلى أساس إنتاجي بمنطق **Config-First** مشابه
لمشروع `project2_clinica/backend`، مع:

- إعدادات env / prisma / email / swagger.
- Logging إلى ملف حقيقي.
- **بدون أي API endpoints** — بما في ذلك `/health` و`/` وSwagger UI.
- توثيق عربي كامل + ملف feedback.

### ما تم تنفيذه

#### 1. Enums و Interfaces

- `src/enums/EEnvironment.ts`: `DEVELOPMENT`, `PRODUCTION`, `TEST`.
- `src/enums/ELogLevel.ts`: `DEBUG`, `INFO`, `WARN`, `ERROR`.
- `src/interfaces/logger/ILogger.ts`:
  - `ILogContext`, `ILogEntry`, `ILogger`.
- `src/interfaces/email/IEmailMessage.ts`:
  - `to`, `subject`, `text`, `html`.

#### 2. الإعدادات

- `src/config/env.ts`:
  - `IEnvConfig` مع كل المتغيرات الحالية.
  - `EEnvironment` و`ELogLevel`.
  - JWT / bcrypt / SMTP / timezone / currency / logging.
  - `JWT_SECRET` مطلوب في production فقط.
  - `Object.freeze` على كائن `env`.
- `src/config/prisma.ts`:
  - Prisma + `@prisma/adapter-pg` + `pg.Pool`.
  - تمرير أخطاء/تحذيرات/استعلامات Prisma إلى الـ logger.
  - الاستعلامات تُسجل في development فقط.
- `src/config/email.ts`:
  - Nodemailer transport كسول (lazy).
  - `isEmailConfigured`.
  - `sendEmail` مع تسجيل النجاح/الفشل.
- `src/config/swagger.ts`:
  - OpenAPI 3.0.3.
  - `info`, `servers`, `tags`, `securitySchemes`, `schemas`, `parameters`,
    `responses`.
  - `paths: {}` و`apis: []` — لا endpoints.

#### 3. Logger

- `src/utils/logger/index.ts`:
  - Console + file في نفس الوقت.
  - ملف `logs/app.log` افتراضيًا، أو `LOG_FILE`.
  - `append` وليس overwrite.
  - JSON في production، نص مقروء في development.
  - فلترة حسب `LOG_LEVEL`.
  - `close(): Promise<void>` لإغلاق stream الملف.
  - في حال فشل فتح الملف، يستمر التطبيق مع Console فقط.

#### 4. App / Server

- `src/app.ts`:
  - Helmet, CORS, JSON/urlencoded, Morgan, notFound, errorHandler.
  - Morgan يكتب عبر الـ logger.
  - **تمت إزالة `/health` و`/`**.
  - لا Swagger UI ولا أي routes.
- `src/server.ts`:
  - تسجيل حالة الاتصال بقاعدة البيانات وحالة البريد.
  - تسجيل مسار ملف السجل عند البدء.
  - `server.on("error")`.
  - graceful shutdown يغلق Prisma ثم logger.
  - `unhandledRejection` و`uncaughtException` تؤدي إلى shutdown.
- `src/middlewares/error.middleware.ts`:
  - `notFoundHandler` يسجل تحذيرًا بالمسار والطريقة وIP.

#### 5. الملفات والبيئة

- `.env.example`: كل المتغيرات الحالية موثقة.
- `.gitignore`: `logs/*.log` مع استثناء `logs/.gitkeep`.
- `logs/.gitkeep` و`logs/app.log` (فارغ).
- `README.md`: نسخة عربية كاملة.
- `AGENTS.md`: تحديث الحالة والملفات وقواعد التشغيل.
- `CHANGELOG.md`: إضافة `0.2.0`.

---

## القرارات

1. **لا endpoints في هذه المرحلة.** حتى `/health` و`/` أُزيلا. Swagger spec
   موجود لكنه غير مُركّب.
2. **أسماء TypeScript:** `enum` تبدأ بـ `E`، `interface` تبدأ بـ `I`.
3. **أسماء Prisma enums لا تتغير** لأنها مرتبطة بقاعدة البيانات.
4. **Logging إلى ملف حقيقي** مع إمكانية تغيير المسار عبر `LOG_FILE`.
5. **Prisma global cache أُزيل** لأن `tsx watch` يعيد تشغيل العملية كاملة،
   ولتجنب تعقيد نوع `$on` مع الـ generic.
6. **JWT_SECRET مطلوب في production فقط**، مع قيمة افتراضية واضحة في غير
   production.

---

## المشكلة التي تم اكتشافها وإصلاحها

- كان شرط `getEnv("JWT_SECRET", ...)` معكوسًا، فيطلب `JWT_SECRET` في
  development أيضًا. تم تصحيحه إلى:
  `getEnv("JWT_SECRET", nodeEnv === EEnvironment.PRODUCTION)`.
- تم التحقق بعد الإصلاح: التطبيق/الـ logger يعمل بدون `JWT_SECRET` في
  development.

---

## التحقق المنفذ

نجحت الأوامر التالية:

```bash
npx prisma format
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
```

وتم تنفيذ اختبار smoke للـ logger:

```bash
node -e "import('./dist/utils/logger/index.js').then(async ({logger}) => { logger.info('logger smoke test'); await logger.close(); })"
```

النتيجة: كُتب السجل في `logs/app.log`، ثم تم تفريغ الملف ليظل فارغًا في
التسليم.

كما تم التحقق من تحميل الوحدات وقت التشغيل:

- `dist/app.js` — تحميل ناجح.
- `dist/config/prisma.js` — تحميل ناجح دون اتصال بالقاعدة.
- `dist/config/email.js` — تحميل ناجح، `isEmailConfigured=false` بدون SMTP.
- `dist/config/swagger.js` — OpenAPI `3.0.3` مع `paths=0`.

---

## ملاحظات وقيود

- `logs/app.log` غير مُتتبع في Git.
- لا يوجد log rotation تلقائي في هذه المرحلة؛ الأرشفة/التفريغ مسؤولية خارجية
  أو سكربت لاحق.
- `.env` الحالي يحتوي `DATABASE_URL` فقط، وقيمته قد تشير إلى قاعدة محلية غير
  تعمل.
- لا migration فعلي ولا seed.
- `swagger-ui-express` موجود كاعتمادية لكنه غير مستخدم بعد.
- لم يتم تشغيل السيرفر فعليًا ضد قاعدة بيانات حقيقية في هذه الجلسة.

---

## أسئلة مفتوحة / تحتاج قرارًا لاحقًا

1. هل سيتم استخدام Redis أو أي cache خارجي؟
2. هل سيتم تفعيل Swagger UI في development فقط أم في بيئات محددة؟
3. هل مطلوب log rotation داخلي (مثل `pino`/`winston` أو سكربت) أم يكفي ملف
   واحد قابل للأرشفة؟
4. هل سيتم اعتماد `refresh token` منفصل أم JWT واحد؟
5. هل سيتم استخدام `prisma migrate dev` محليًا ثم `deploy` في الإنتاج؟
6. هل هناك حاجة إلى PostGIS للبحث الجغرافي للريسلر؟

---

## الخطوات التالية

1. توفير `DATABASE_URL` حقيقي.
2. إنشاء migration أولي.
3. إعداد seed أساسي حقيقي فقط.
4. بناء المصادقة والصلاحيات.
5. بناء الـ modules تدريجيًا.
6. إضافة Zod validation.
7. تركيب Swagger UI بعد استقرار الـ endpoints.
8. إضافة jobs واختبارات.
