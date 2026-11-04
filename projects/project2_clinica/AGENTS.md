# AGENTS.md — Clinica (project2_clinica)

> اقرأ الملف ده قبل أي تعديل. الهدف منه إن أي AI أو مطوّر يفهم المشروع، يعرف إيه الموجود فعلاً، يتبع نفس الأسلوب، وما يعيدش بناء حاجة معمولة.

آخر تحديث: 2026-10-27

---

## 1) المشروع باختصار

**Clinica / كلينيكا** نظام إدارة وحجز مواعيد عيادات.

- المريض يحجز مع دكتور حسب **فترات العمل الفعلية** و**مدة الخدمة**.
- الأدمن يدير التخصصات، الخدمات، أسعار ومدد كل دكتور، وفترات العمل.
- كل حجز بياخد **snapshot** للسعر والمدة واسم الخدمة والدكتور وقت الحجز.

### الستاك

| الجزء | التقنية |
|------|---------|
| Backend | TypeScript + Node.js + Express 5 |
| ORM / DB | Prisma 7 + PostgreSQL |
| Auth | JWT + bcrypt + Zod |
| Notifications | nodemailer + node-cron |
| API Docs | Swagger UI + OpenAPI 3 (`swagger-jsdoc`) |
| Frontend | Next.js 16 + React 19 + Tailwind 4 (لسه starter template) |

المسارات:
- `backend/` — كل كود الـ API.
- `frontend/` — تطبيق Next.js منفصل (sibling، مش جوه backend).
- `backend/docs/` — ERD + booking workflow + architecture review.

---

## 2) القواعد الذهبية — اقرأ قبل ما تكتب أي كود

1. **ممنوع إعادة إنشاء الموجود.** افحص `backend/src` و`backend/prisma/schema.prisma` الأول. لو الملف/الموديول موجود، كمّل فيه بدل ما تعمل نسخة جديدة.
2. **`prisma/schema.prisma` هو مصدر الحقيقة الوحيد** لنموذج البيانات. لا تعيد تصميم الجداول ولا تغيّر الأسماء بدون سبب موثّق.
3. **اتبع البنية الحالية**: `routes → controller → service → validation → Prisma`. ممنوع تعمل architecture جديدة أو مجلدات إضافية بدون داعي.
4. **كل رد API يمر عبر `ApiResponse`، وكل خطأ يمر عبر `AppError` + `errorHandler`.** ممنوع `res.json` مباشرة في controller.
5. **أي تغيير مهم يتوثّق** في `backend/CHANGELOG.md`، ولو غيّر طريقة التشغيل يتحدّث `backend/README.md` والملف ده.
6. **لا تعيد بناء Auth أو error handling أو Prisma client أو logger.** دول مكتملين.
7. **متكررش الموجود**: لو لقيت ملف/موديول ناقص، املأه بنفس النمط بدل ما تعمل نسخة موازية.
8. **Frontend لسه template**. قبل أي شغل Next.js اقرأ `frontend/AGENTS.md` (Next 16 فيه breaking changes).
9. **لا تشغّل `db:seed` على قاعدة بيانات فيها بيانات حقيقية** — السكربت بيمسح كل الجداول قبل الإدخال.
10. **لا تضف مكتبات جديدة** إلا لو محتاجة فعلاً وموجودة في conventions المشروع (Zod, Express, Prisma...).

---

## 3) حالة المشروع الحالية (مهم جداً)

### ✅ مكتمل ومطبّق

- **Prisma schema كامل**: `User`, `Specialization`, `Doctor`, `ClinicService`, `DoctorService`, `DoctorAvailability`, `Appointment`.
- **Auth module كامل**:
  - `POST /api/auth/register` — يسجّل PATIENT فقط، بيرجّع user + token.
  - `POST /api/auth/login` — بيرجّع user + token، ورسالة خطأ موحّدة `Invalid email or password`.
- **Middleware**:
  - `authenticate` — يتحقق من `Authorization: Bearer <token>` ويجيب المستخدم من DB.
  - `authorize(...roles)` / `requireRole` — صلاحيات حسب الدور.
  - `validateBody/Query/Params` — Zod validation.
  - `errorHandler` + `notFoundHandler` + Prisma error mapping.
- **Infrastructure**:
  - `src/config/env.ts` — تحميل env.
  - `src/config/prisma.ts` — PrismaClient + `@prisma/adapter-pg` + pool + singleton.
  - `src/shared/response.ts` — `ApiResponse`.
  - `src/shared/errors.ts` — كل أخطاء التطبيق.
  - `src/utils/jwt.ts`, `src/utils/password.ts`, `src/utils/logger/index.ts`.
  - `src/server.ts` — graceful shutdown + DB connect + تشغيل/إيقاف reminder job.
  - `src/config/email.ts` — nodemailer transporter + تعطيل آمن لو SMTP مش مظبوط.
  - `src/config/swagger.ts` — OpenAPI 3.0 spec كامل لكل الـ endpoints.
  - `src/jobs/appointmentReminder.job.ts` — cron job يومي مع `noOverlap` وحماية من التشغيل المتكرر.
- **Seed** — `prisma/seed.ts` مع بيانات أطباء/خدمات/مواعيد.
- **Documentation** — ERD وBooking workflow وArchitecture review + Swagger UI على `/api-docs` و`/api-docs.json`.

### ✅ Modules implemented (مطابقين للنمط)

- `modules/auth` — كامل (register/login)
- `modules/doctors` — CRUD (ADMIN only for create/update/delete), list/get عام
- `modules/specialization` — CRUD (ADMIN only for writes), list/get عام
- `modules/clinicService` — CRUD (ADMIN only for writes), list/get عام
- `modules/doctorAvailability` — إدارة فترات عمل؛ ADMIN يقدر يضيف لأي دكتور، DOCTOR يقدر يضيف/يعدل/يحذف لنفسه فقط
- `modules/doctorService` — ربط خدمة بالعيادة بالدكتور مع السعر والمدة؛ ADMIN يقدر لأي دكتور، DOCTOR لنفسه فقط
- `modules/appointment` — حجز مواعيد مع حماية تزامن (transaction + row lock + partial EXCLUDE constraint يستثني CANCELED)، وأيضًا:
  - `GET /api/appointments?status=&doctorServiceId=&from=&to=&page=&limit=&sortBy=&sortOrder=` — قائمة بنطاق الدور (PATIENT: مواعيده، DOCTOR: مواعيده، ADMIN: الكل) مع `meta`؛ `status` يقبل `PENDING`/`BOOKED`/`COMPLETED`/`CANCELED`.
  - `GET /api/appointments/:id` — تفاصيل بنفس نطاق الدور.
  - `GET /api/appointments/availability?doctorServiceId=...&date=YYYY-MM-DD` — Slots محسوبة من `DoctorAvailability` × `durationMinutes`.
  - `POST /api/appointments` — يستقبل `{ doctorServiceId, startsAt, patientId?, notes? }` ويحسب `endsAt/price/duration` من DB؛ ينشئ الحجز بحالة `PENDING` ويحجز الوقت، ولا يرسل إيميل تأكيد. ADMIN لازم يحدد `patientId` لمريض PATIENT، وغير ADMIN لا يقدر يحجز لغيره.
  - `PATCH /api/appointments/:id/confirm` — ADMIN فقط؛ يحول `PENDING` إلى `BOOKED` ويرسل إيميل التأكيد للمريض.
  - `PATCH /api/appointments/:id/cancel` — صاحب الحجز (PATIENT) أو ADMIN؛ soft cancel.
  - `DELETE /api/appointments/:id` — ADMIN فقط؛ حذف نهائي للصف ويحرر الوقت.
  - `notification.service.ts` — إيميل تأكيد بعد موافقة الأدمن + إيميلات تذكير مع HTML escaping وsnapshots؛ المستلم دائمًا `appointment.patient.email` وبس لو الدور PATIENT (ممنوع إيميل للأدمن).
  - التذكيرات بتشتغل من `src/jobs/appointmentReminder.job.ts` لكل `BOOKED` و`reminderSent=false` من الآن لآخر بكرة (توقيت السيرفر)، و`reminderSent` بيتحول `true` بعد نجاح الإرسال فقط.
- `modules/users` — `GET /me` (أي مستخدم)، `GET /` (ADMIN)، `GET /:id` (ADMIN أو نفسه)، `PATCH /:id` (ADMIN أو نفسه) مع Zod validation؛ تغيير `role` مسموح لـ ADMIN فقط.

### 🚧 Placeholders

مفيش placeholders حاليًا.

### ❌ غير موجود / لسه

- ربط الـ frontend بالـ API.
- Tests إضافية لبقية الموديولات (فيه تكامل للمواعيد والـ auth، وunit tests للإيميلات في `backend/test/`).
- Migrations حقيقية مُدارة (المشروع بيستخدم `prisma db push` + ملف SQL للـ EXCLUDE constraint).
- Payments / medical records / SMS أو push notifications / email retry queue.

---

## 4) أوامر التشغيل (من داخل `backend/`)

| الأمر | الوظيفة |
|------|---------|
| `npm run dev` | تشغيل API مع hot reload (`tsx watch`) |
| `npm run build` | بناء TypeScript إلى `dist/` |
| `npm start` | تشغيل النسخة المبنية من `dist/` |
| `npm run typecheck` | فحص TypeScript بدون emit |
| `npm run check` | typecheck + Prisma validate |
| `npm run prisma:generate` | توليد Prisma Client |
| `npm run prisma:validate` | التحقق من schema |
| `npm run prisma:format` | تنسيق schema |
| `npm run prisma:studio` | فتح Prisma Studio |
| `npm run db:push` | مزامنة schema مع DB (بدون migrations) |
| `npm run db:seed` | مسح وإدخال بيانات تجريبية |

### Seed credentials

- كل الحسابات المزروعة باسوردها `SEED_PASSWORD` أو `Password123` افتراضياً.
- أمثلة: `mohamedfadldev@gmail.com`, `karim.fouad@clinica.com`, `ahmed.mohamed@example.com`.

### ملاحظات تشغيل

- Node المطلوب: `>=20.19` (متوافق مع Prisma 7).
- `type: module` مفعّل، وكل الاستيرادات تستخدم امتداد `.js` (ESM).
- قاعدة البيانات الحالية local PostgreSQL `clinica`، ومفيش migration history.
- لو شغّلت `prisma db push` على DB فيها بيانات، خد بالك من reset.
- الإيميل بيتفعّل فقط لو `EMAIL_ENABLED` مش false و`SMTP_USER` + `SMTP_PASS` موجودين. فشل الإرسال بيتسجل ولا يوقف الحجز.
- reminder cron بيتظبط بـ `REMINDER_CRON` (افتراضي `0 8 * * *`) و`REMINDER_TIMEZONE`؛ نافذة التذكير من وقت التشغيل لآخر بكرة بتوقيت السيرفر.
- الاختبارات لازم تتشغّل بـ `EMAIL_ENABLED=false` عشان ما تبعتش إيميلات حقيقية.
- Swagger UI على `/api-docs` وJSON على `/api-docs.json`، ومتسجلين قبل `helmet()` عشان CSP ما يمنعش Swagger UI.

---

## 5) بنية الموديول القياسية

```
src/modules/<module>/
├── router.ts       # Router + ربط الـ middleware، default export
├── controller.ts   # class، كل method = async handler + try/catch(next)
├── service.ts      # class، business logic + Prisma، throw AppError
├── validation.ts   # Zod schemas
└── types.ts        # I-prefixed interfaces / types
```

### قواعد التسمية والأسلوب

- Interfaces تبدأ بـ `I`: `IRegisterInput`, `IAuthResponse`, `IAuthRequest`.
- Classes بأسماء واضحة: `AuthService`, `AuthController`.
- الملفات lower camel: `clinicService`, `doctorAvailability`.
- Service/Controller تتعمل instantiate مرة واحدة في `router.ts`.
- كل استيراد داخلي ينتهي بـ `.js` (مثال: `../../config/prisma.js`).
- لا تضيف comments كتفسير كود؛ الشرح مكانه الملفات/docs.

### ربط الموديول

في `src/app.ts`:

```ts
import xRoutes from "./modules/x/router.js";
app.use("/api/x", xRoutes);
```

في الـ router:

```ts
router.get("/", authenticate, authorize("ADMIN"), validateQuery(schema), controller.list);
```

---

## 6) عقد الردود — Response Contract

**النجاح:**

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

- `data` تختفي لو `undefined`.
- استخدم `ApiResponse.ok` / `ApiResponse.created` / `ApiResponse.success`.
- HTTP status: GET/PATCH 200، POST إنشاء 201، delete غالباً 200 مع message.

**الخطأ:**

```json
{
  "success": false,
  "message": "Human readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

- لا ترجّع stack traces أو تفاصيل DB في production.
- `errorHandler` هو المسؤول عن شكل الخطأ؛ الـ controller ما يبنيش error response بنفسه.
- أكواد موجودة بالفعل: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TOKEN_MISSING`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `USER_NOT_FOUND`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `EMAIL_EXISTS`, `INVALID_CREDENTIALS`, `DB_UNAVAILABLE`, `ROUTE_NOT_FOUND`, `INTERNAL_ERROR`, `APPOINTMENT_IN_PAST`, `AVAILABILITY_NOT_COVERED`, `DOCTOR_SERVICE_NOT_FOUND`, `APPOINTMENT_CONFLICT`, `APPOINTMENT_ALREADY_CANCELED`, `APPOINTMENT_ALREADY_CONFIRMED`, `APPOINTMENT_CANNOT_BE_CONFIRMED`.

### Pagination / meta

- `ApiResponse` يدعم `meta` اختياري و`ApiResponse.paginated(res, message, data, meta)`.
- `src/shared/pagination.ts` هو المصدر الوحيد: `resolvePagination(page, limit)` (default 1/20، max 100)، `buildPaginationMeta`، `toPaginatedResult`.
- كل list endpoint بيرجّع `data` كـ array + `meta: { page, limit, total, totalPages }`.
- أي list جديد يستخدم Zod schema مع `page/limit/sortBy/sortOrder` وقيم افتراضية، ويمررها عبر `resolvePagination` — ممنوع تعمل helper موازي.

---

## 7) معايير الأخطاء — Error Handling

- ارمِ `AppError` أو subclass منه فقط:
  - `ValidationError` 400
  - `BadRequestError` 400
  - `UnauthorizedError` 401
  - `ForbiddenError` 403
  - `NotFoundError` 404
  - `ConflictError` 409
  - `TooManyRequestsError` 429
  - `InternalServerError` 500
- في الـ controller:

```ts
try {
  const result = await this.service.do(req.body);
  return ApiResponse.ok(res, "Done", result);
} catch (error) {
  next(error);
}
```

- التحقق من المدخلات في `validation.ts` بـ Zod + `validateBody/Query/Params`.
- أخطاء Prisma تتحول تلقائياً عبر `src/shared/errors/prisma-error.mapper.ts`.
- ممنوع `console.log` للـ errors؛ استخدم `logger` أو `errorHandler`.

---

## 8) قاعدة البيانات — حقائق مهمة

- Schema: `prisma/schema.prisma`.
- Client المستخدم: `@prisma/client` من `node_modules`.
- ممنوع الرجوع لـ `src/generated/prisma` — اتحذف لأنه كان stale. أي `prisma generate` جديد يحدّث `node_modules`.
- Prisma config اسمه `prisma7.config.ts` (Prisma 7.10 بيتعرف عليه). فيه `migrations.seed = "tsx prisma/seed.ts"`.
- مفيش migrations في `prisma/migrations`. لا تشغّل `prisma migrate dev` بدون قرار صريح.
- `src/config/prisma.ts` هو الـ singleton الوحيد. أي كود جديد (seed/scripts) يستورده بدل `new PrismaClient()`.
- `Decimal` للسعر، `Int` للمدة بالدقائق.

### قواعد الحجز (Business Rules)

- المريض يختار `DoctorService` نشط + `ClinicService` نشطة.
- العميل يرسل `{ doctorServiceId, startsAt, patientId?, notes? }`. السيرفر يحسب `endsAt = startsAt + durationMinutes` والسعر من DB — ممنوع الثقة في `endsAt`/السعر/المدة من العميل.
- ADMIN لازم يبعت `patientId` لمستخدم PATIENT عند الحجز بالنيابة؛ PATIENT/DOCTOR لا يقدرون يحجزوا لحد تاني (`403`). إيميلات التأكيد/التذكير بتروح لـ `appointment.patient.email` فقط لو دور المريض PATIENT.
- `startsAt` لازم يكون في المستقبل وقت تنفيذ الطلب (ساعة السيرفر)، وليس وقت فتح الصفحة.
- لازم الفترة تكون **داخل** `DoctorAvailability` نشطة بالكامل.
- `GET /api/appointments/availability` يحسب slots من `DoctorAvailability` × `durationMinutes`، ويستبعد الماضي والمحجوز والمتداخل، ويسمح بالمتجاور (`[start,end)[end,...)`).
- الحجز الجديد يبدأ `PENDING` ويحجز الوقت فورًا؛ التأكيد (`BOOKED`) مسموح لـ ADMIN فقط عبر `PATCH /api/appointments/:id/confirm`، وبعدها فقط يتعمل إيميل التأكيد للمريض.
- ممنوع تعارض مواعيد نشطة لنفس الدكتور (`PENDING`/`BOOKED`/`COMPLETED`)، والحجوزات `CANCELED` فقط لا تُحسب إشغال.
- الحجز لازم يكون داخل transaction + `SELECT ... FOR UPDATE` على `Doctor` + فحص التوفر داخل الـ transaction، والـ EXCLUDE constraint هو الضمان النهائي.
- تعارض الـ EXCLUDE (`23P01`) يتحول لـ `409 APPOINTMENT_CONFLICT`؛ ممنوع الاعتماد على فحص التوفر وحده.
- الـ snapshots لا تتغير بعد الحجز: `priceAtBooking`, `durationMinutesAtBooking`, `serviceNameSnapshot`, `doctorDisplayNameSnapshot`.
- الإلغاء لا يحذف السجل (`status = CANCELED`) عبر `PATCH /api/appointments/:id/cancel`، ومسموح لصاحب الحجز (PATIENT) أو ADMIN فقط. الحذف النهائي عبر `DELETE /api/appointments/:id` لـ ADMIN فقط ويحرر الوقت.
- قوائم المواعيد مقيّدة بالدور: PATIENT/DOCTOR لا يقدرون يفلتروا على دكتور/مريض تاني (يرجع `403`).
- Soft deactivate بـ `isActive` بدل الحذف.
- **الوقت:** تخزين `DateTime` في Postgres كـ UTC. API يرجّع ISO-8601 بـ `Z`. تاريخ الـavailability (`YYYY-MM-DD`) يُفسَّر في التوقيت المحلي للسيرفر، والرد يحتوي `timezone`. لا تعتمد على ساعة المتصفح.

---

## 9) ممنوع إعادة إنشاء الحاجات دي (موجودة بالفعل)

- ❌ Auth module وroutes بتاعته.
- ❌ Prisma schema أو نماذج البيانات.
- ❌ `ApiResponse` / `AppError` / Prisma error mapper / `errorHandler`.
- ❌ `authenticate` / `authorize` / validation middlewares.
- ❌ `src/config/prisma.ts` / `src/config/env.ts`.
- ❌ `jwt.ts` / `password.ts` / `logger`.
- ❌ ERD وBooking workflow docs.
- ❌ Seed structure (عدّل فيه، ما تعملش seed جديد).
- ❌ Package scripts (موجودة في `backend/package.json`).

---

## 10) مزالق معروفة

- **`Training/package.json`** (بره المشروع) فيه `@types/*` قديمة كانت بتحل مشكلة types بالغلط. دلوقتي الأنواع موجودة في `backend/package.json`؛ لا تعتمد على الـ root.
- **CORS**: افتراضي `CORS_ORIGIN` في `.env.example` محدد origins. لو اتغير لـ `*` مع `credentials: true`، المتصفح هيرفض. الأفضل origins صريحة.
- **`.env` مش متتبّع في git** — لا تحط credentials حقيقية في ملفات متتبعة.
- **`frontend/`** لسه قالب create-next-app. لا تفترض وجود API client أو auth UI.
- **Swagger + Helmet**: مسارات `/api-docs` لازم تفضل قبل `app.use(helmet())`، وإلا CSP هيمنع تحميل الـ UI.
- **Email in tests**: استخدم `EMAIL_ENABLED=false` مع سيرفر الاختبار؛ الإيميلات بتتبعت asynchronously بعد نجاح الحجز.
- **Reminder cron**: `REMINDER_CRON` أو `REMINDER_TIMEZONE` غير الصالح بيعطّل الـ job فقط، مش السيرفر (الـ timezone بيرجع لـ `APP_TIMEZONE` أو توقيت السيرفر).
- **`backend/README.md`** اتحدّث ليعكس الحالة الحالية، لكن `CHANGELOG.md` هو سجل التغييرات.

---

## 11) Definition of Done لأي مهمة

قبل ما تقول إن المهمة خلصت:

1. `npm run typecheck`
2. `npm run prisma:validate` (لو لمست schema)
3. `npm run build` (لو غيّرت كود runtime)
4. جرّب الـ endpoint/script المتأثر وشغّل الاختبارات ذات الصلة
5. حدّث `backend/CHANGELOG.md`
6. حدّث `backend/README.md` لو الأوامر/السلوك اتغير
7. حدّث `AGENTS.md` لو أضفت conventions أو موديول جديد

---

## 12) سجل القرارات المهمة

| التاريخ | القرار |
|---------|--------|
| 2026-10-25 | توحيد Prisma Client على `@prisma/client` وحذف `src/generated` القديم |
| 2026-10-25 | Seed يستخدم adapter + bcrypt + `SEED_PASSWORD` |
| 2026-10-25 | إضافة npm scripts رسمية و`type: module` و`engines` |
| 2026-10-25 | توثيق كل القواعد في `AGENTS.md` لمنع إعادة البناء |
| 2026-10-25 | تحسين validation middleware لعرض اسم الحقل + details.errors، ودعم role اختياري في register |
| 2026-10-25 | إضافة modules: doctors, specialization, clinicService, doctorAvailability, doctorService مع صلاحيات ADMIN/DOCTOR حسب القواعد |
| 2026-10-27 | منع إرسال `role` في التسجيل العام؛ التسجيل ينشئ `PATIENT` فقط دائمًا |
| 2026-10-27 | تغيير `role` عبر `PATCH /api/users/:id` مقصور على ADMIN؛ غير ADMIN يُرفض بـ `403` |
| 2026-10-27 | إضافة إيميل تأكيد الحجز + cron تذكيرات مع `reminderSent` بعد نجاح الإرسال فقط؛ فشل الإيميل لا يفشل الحجز |
| 2026-10-27 | إضافة Swagger/OpenAPI كامل ومتاح على `/api-docs` قبل Helmet CSP |
