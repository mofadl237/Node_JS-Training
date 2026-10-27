# AGENTS.md — Clinica (project2_clinica)

> اقرأ الملف ده قبل أي تعديل. الهدف منه إن أي AI أو مطوّر يفهم المشروع، يعرف إيه الموجود فعلاً، يتبع نفس الأسلوب، وما يعيدش بناء حاجة معمولة.

آخر تحديث: 2026-10-25

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
7. **الملفات الفاضية مقصودة**: موديولات غير Auth لسه placeholders. املأها بنفس النمط، ما تعملش ملفات موازية.
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
  - `src/server.ts` — graceful shutdown + DB connect.
- **Seed** — `prisma/seed.ts` مع بيانات أطباء/خدمات/مواعيد.
- **Documentation** — ERD وBooking workflow وArchitecture review.

### 🚧 Placeholders (ملفات موجودة وفاضية — كمّل فيها)

- `src/modules/users/`
- `src/modules/specialization/`
- `src/modules/clinicService/`
- `src/modules/doctors/`
- `src/modules/doctorService/`
- `src/modules/doctorAvailability/`
- `src/modules/appointment/`

كل موديول فيهم فيه: `router.ts`, `controller.ts`, `service.ts`, `validation.ts`, `types.ts`.

### ❌ غير موجود / لسه

- Endpoints لأي موديول غير Auth.
- ربط الـ frontend بالـ API.
- Tests.
- Migrations (المشروع بيستخدم `prisma db push`).
- Payments / medical records / notifications كاملة.

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
- أمثلة: `admin@clinica.com`, `karim.fouad@clinica.com`, `ahmed.mohamed@example.com`.

### ملاحظات تشغيل

- Node المطلوب: `>=20.19` (متوافق مع Prisma 7).
- `type: module` مفعّل، وكل الاستيرادات تستخدم امتداد `.js` (ESM).
- قاعدة البيانات الحالية local PostgreSQL `clinica`، ومفيش migration history.
- لو شغّلت `prisma db push` على DB فيها بيانات، خد بالك من reset.

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
- أكواد موجودة بالفعل: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TOKEN_MISSING`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `USER_NOT_FOUND`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `EMAIL_EXISTS`, `INVALID_CREDENTIALS`, `DB_UNAVAILABLE`, `ROUTE_NOT_FOUND`, `INTERNAL_ERROR`.

### Pagination / meta

`ApiResponse` الحالي لا يدعم `meta` أو pagination. لو محتاجها، وسّع `ApiResponse` بشكل متسق (مثلاً `meta` اختياري) — ما تعملش response helper جديد.

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

- المريض يختار `DoctorService` نشط.
- النظام يحسب `startsAt` → `startsAt + durationMinutes`.
- لازم الفترة تكون **داخل** `DoctorAvailability` نشطة بالكامل.
- ممنوع تعارض مواعيد نشطة لنفس الدكتور (`BOOKED`).
- يفضّل فحص تعارض المريض أيضاً.
- الحجز لازم يكون داخل transaction + إعادة فحص داخل الـ transaction.
- الـ snapshots لا تتغير بعد الحجز: `priceAtBooking`, `durationMinutesAtBooking`, `serviceNameSnapshot`, `doctorDisplayNameSnapshot`.
- الإلغاء لا يحذف السجل (`status = CANCELED`).
- Soft deactivate بـ `isActive` بدل الحذف.

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
- **`backend/README.md`** اتحدّث ليعكس الحالة الحالية، لكن `CHANGELOG.md` هو سجل التغييرات.

---

## 11) Definition of Done لأي مهمة

قبل ما تقول إن المهمة خلصت:

1. `npm run typecheck`
2. `npm run prisma:validate` (لو لمست schema)
3. `npm run build` (لو غيّرت كود runtime)
4. جرّب الـ endpoint/script المتأثر
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
