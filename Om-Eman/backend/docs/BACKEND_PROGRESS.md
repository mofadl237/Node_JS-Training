# حالة Backend المتجر (BACKEND_PROGRESS)

> آخر تحديث: 2026-11-16. يلخص تنفيذ `docs/STORE_BACKEND_TASKS.md` (B1–B16)
> وما تبقى، وما مطلوب من صاحب المتجر شخصيًا.

## 🗄️ مزامنة قاعدة البيانات (2026-11-16)

قاعدة `om_eman` (PostgreSQL 17 في حاوية `postgres-db`) أصبحت متزامنة مع
`prisma/schema.prisma` بالكامل. **الأسلوب: `npx prisma db push`** — المشروع
لا يستخدم Prisma Migrate (لا يوجد مجلد `prisma/migrations`)، ولم يُنشأ أي
migration. تم أيضًا تطبيق `prisma/mvp/manual_constraints.sql` (مرتين —
idempotent). النتيجة المتحقق منها بالاستعلام المباشر:

| الكائن | العدد | ملاحظات |
| --- | --- | --- |
| Tables | 41 | = عدد الـ models بالضبط |
| Enums | 27 | |
| Foreign Keys | 61 | |
| Indexes (إجمالي) | 175 | 166 من Prisma + 5 trigram يدوية + 4 partial unique |
| CHECK constraints يدوية | 20 | كلها بأسمائها من `manual_constraints.sql` |
| Partial unique indexes | 4 | Invoice ISSUED، CustomerAddress default، Cart ACTIVE، ProductImage primary |
| Triggers | 5 | append-only ×3، bundle single package، no nested bundles |
| Views تقارير | 12 | `report_*` + `customer_order_stats_drift` + `cod_awaiting_settlement` + `bundle_pricing` |
| Extensions | 2 | `pg_trgm` + `unaccent` |

- Drift check بـ `prisma migrate diff --exit-code`: الاختلاف الوحيد هو فهارس
  trigram اليدوية الخمسة (Prisma لا يمثلها في الـ schema) — **لا drift فعلي**.
- `prisma validate` ✅ · `prisma generate` ✅ · `db pull --print` = 41 model / 27 enum مطابقة ✅
- دوال `search_products` / `suggest_similar` و`normalize_arabic` تعمل (smoke test).
- Backup قبل الـ push: `backups/om_eman_pre_push_20261116_200246.dump` (كانت القاعدة فارغة).
- Dry-run أُجري على قاعدة مؤقتة `om_eman_push_preview` ثم حُذفت — نجح بلا أي تحذير فقد بيانات.


## ✅ المنجز (الكود جاهز ومفحوص)

| المهمة | الحالة |
| --- | --- |
| B2 قائمة المنتجات + بطاقة `IStoreProductCard` (SQL واحد + lateral joins، فلاتر وترتيب وصفحات) | ✅ `src/modules/store/products/` |
| B3 تفاصيل منتج بالـ slug (صور، عبوات، `pricePer100g`، مكونات الباندل، منتجات مشابهة) | ✅ |
| B4 منتجات مشابهة (نفس القسم، 8 عناصر) | ✅ |
| B5 إعدادات عامة `GET /settings` (TAX_RATE / FREE_SHIPPING_THRESHOLD / STORE_CONTACT / STORE_SOCIAL — القيمة المفقودة = null بلا اختراع) | ✅ `store/settings/` |
| B6 شجرة أقسام مع عدّاد منتجات `GET /categories` | ✅ `store/categories/` |
| B7 محتوى: بانرز/FAQ/صفحات ثابتة `GET /banners` `GET /faqs` `GET /pages/:slug` | ✅ `store/content/` |
| B8 خريطة SEO `GET /sitemap` | ✅ `store/sitemap/` |
| B9 مناطق وعرض سعر الشحن `GET /shipping/areas` `GET /shipping/quote` | ✅ `store/shipping/` + `services/shipping.service.ts` |
| B10 Guest checkout كامل: `paymentMethod (COD / ONLINE_TRANSFER)` إجباري، كوبون، شحن، ضريبة، سناپشوتس، صف دفع PENDING، إجماليات سترينغ ديسيمال | ✅ `services/guest-checkout.service.ts` + `checkout-items/totals/contracts` |
| B10.3 إثبات التحويل `POST /payments/proof` (تحديث صف PENDING، رفض COD/المؤكد، رفع جديد بعد الرفض) | ✅ `store/payments/` |
| B11 كوبونات: `POST /coupons/validate` بلا كتابة + rate limit | ✅ `store/coupons/` + `services/coupon.service.ts` (قاعدة واحدة مشتركة بين الكوبونات والـ checkout) |
| B12 سلة مُثراة (بيانات المنتج/الصورة/الحجم/التوفر + itemsCount) | ✅ `store/cart/` |
| B13 بحث عربي مُثرى: نتائج = بطاقات + matchTier/score/matchedTerm، وصفر نتائج → اقتراحات من `suggest_similar`، وتسجيل `SearchLog` | ✅ `store/search/` |
| 6.2 رفع صور Cloudinary مباشر: `POST /uploads/sign` (موظف) و`POST /uploads/sign-proof` (عام بـ tracking token، 10/ساعة) | ✅ `modules/uploads/` |
| قاعدة Cloudinary URL في المولّد: `ProductImage.url`, `Category/Subcategory.imageUrl`, `Banner.imageUrl/mobileImageUrl`, `Payment.proofImageUrl` | ✅ `scripts/generate-modules.ts` + إعادة توليد |
| توثيق Swagger لكل endpoints المتجر والرفع | ✅ `src/config/swagger-store.ts` (116 paths, 168 schemas) |
| سكربت Seed الأساسي (OWNER + تسلسلات مستندات + إعدادات من `seed.config.json`) | ✅ `scripts/seed-base.ts` + `npm run db:seed` + `seed.config.example.json` |
| اختبارات integration موسعة (COD/ONLINE_TRANSFER، صف الدفع PENDING، رفض خارج المخزون، رفض منطقة بلا تعرفة، رفض sign-proof) | ✅ `tests/integration/checkout-claim.test.ts` |

الفحص النهائي: `npx tsc --noEmit` ✅ | `npm run build` ✅ | `npm test` ✅ (10 unit تمر، integration تعمل skip بدون قاعدة)

## ⏳ متبقي (يحتاج قاعدة البيانات تشتغل)

1. ~~تشغيل قاعدة البيانات~~ — تم (حاوية `postgres-db` تعمل، PostgreSQL 17).
2. ~~`npx prisma migrate dev --name init` (B1)~~ — تم بدلًا منه بـ `npx prisma db push` (لا migrations في المشروع). لو أُريد Migrate لاحقًا: `npx prisma migrate dev --name init` على قاعدة نظيفة ثم baseline.
3. ~~`npx prisma db execute --file prisma/mvp/manual_constraints.sql`~~ — تم (idempotent، نفّذ مرتين بنجاح).
4. `cp seed.config.example.json seed.config.json` ثم تعبئة القيم الحقيقية ثم `npm run db:seed`.
5. تشغيل الاختبارات Integration كاملة بدون skip + تجربة curl سريعة للـ endpoints.
6. إعداد Cloudinary الفعلي (حساب + تعبئة `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` في `.env`).

## ☁️ Cloudinary (مراجعة 2026-11-16)

- `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` تُقرأ من env فقط (`src/config/env.ts`) — لا أي قيمة hardcoded في الكود، والـ Secret لا يظهر في أي log أو API response.
- سكربت تحقق جاهز: `npx tsx scripts/verify-cloudinary.ts` (لا يطبع الـ Secret) — يوقّع لكل الـ folders، يقارن التوقيع بإعادة حساب SHA-1 مستقلة، يرفع فعليًا ويحذف، يجرّب توقيعًا مرفوضًا ورفض صيغة نصية، ويختبر رفض `signProof` لطلب مجهول.
- ⚠️ **مفتوح على المالك:** `CLOUDINARY_CLOUD_NAME` في `.env` قيمته `omEman` — غير موجود في Cloudinary (جرّبنا `om-eman` أيضًا). انسخ الاسم حرفيًا من لوحة Cloudinary (حقل Cloud name) ثم أعد تشغيل السكربت — أجزاء الاختبار المعتمدة على رفع فعلي تنتظر هذه القيمة (8/9 نجحوا).

## 🌱 Seed الديمو (للتطوير فقط — 2026-11-16)

- `npm run db:seed:demo` يبني بيانات تجريبية للعمل عليها: 3 أقسام/4 أقسام فرعية/10 منتجات (منهم سلة bundle واحدة) + 11 عبوة `DEMO-*` + بانر + 3 FAQ + صفحتان ثابتتان + ناقل شحن تجريبي بـ 4 تعرفات + مرادفات بحث + عرض خصم 10% على الأعشاب مع كوبون `DEMO10`. صور الصور من picsum.photos (placeholders).
- `npm run db:seed:demo -- --clean` يحذف بيانات الديمو فقط. السكربت idempotent، يرفض العمل في `NODE_ENV=production`، ولا يلمس Employee/SystemSetting/طلبات/عملاء (الإنتاج يبقى بـ `npm run db:seed` الحقيقي).
- الـ seed احترم كل الـ CHECKs والـ triggers (bundle عبوة واحدة، ممنوع bundle داخل bundle، `compareAtPrice > sellingPrice`، scope العرض، `endsAt >= startsAt`).

## 🧪 حالة الاختبارات (2026-11-16)

`npm test` = **24/24 ✅** على قاعدة حقيقية (integration بقتل تشتغل بدل skip). قبل ذلك كانت اختبارات integration لم تُشغَّل فعليًا أبدًا، وظهرت أخطاء مكتوبة على الـ schema القديم:

| الإصلاح | المكان | النوع |
| --- | --- | --- |
| `nameAr/nameEn` → `name` + إضافة `code` إلزامي في إنشاء ناقل الاختبار | `tests/integration/checkout-claim.test.ts` | إصلاح setup كتب على full-schema |
| حذف الـ payments قبل الـ orders (Restrict) + حذف الـ packages قبل المنتجات (Restrict) + تعطيل مؤقت لتريغر append-only داخل transaction التنظيف فقط | نفس الملف (afterAll) | إصلاح تنظيف |
| عميل واحد بدل عميلين بنفس الهاتف (unique) | اختبار `rejects phone-based claim` | إصلاح بيانات اختبار |
| السلة المصدر تترقى ACTIVE لو الـ target مفيهوش سلة (سلوك `mergeCartsInTransaction` المصمم) | اختبار `merges a duplicate account` | تصحيح توقع |
| الإحصائيات تعدّ الطلبات المسلمة فقط — ثاني طلب لم يُسلَّم | اختبار الإحصائيات بعد الدمج | تصحيح توقع |
| `timeout + maxWait: 30s` لـ 50 transaction متزامنة على نفس صف التسلسل | `tests/integration/document-number.test.ts` | إصلاح توقيت |
| إجماليات checkout ترجع `"200.0000"` بدل `"200"` (توافق مع العقد الموثق ونمط باقي الخدمات: cart/coupons/card/settings كلها `.toFixed(4)`) | `src/services/guest-checkout.service.ts` (5 أسطر تنسيق) | **bug عقد يحتاج تصديق المالك — سهل الاسترجاع** |
| قراءة `Decimal` من adapter-pg تفقد trailing zeros → الـ assertions تستخدم `toFixed(4)` | نفس ملف الاختبار | إصلاح assertions |

بقايا جولات الاختبار القديمة نُظفت يدويًا مرة واحدة (القاعدة رجعت: 0 عملاء/طلبات، 10 منتجات demo، 11 عبوة، ناقل واحد).

## 📚 جرد Swagger مقابل الـ API الفعلي (2026-11-17)

سؤال صاحب المتجر: "هل كل الـ endpoints طالعة في الـ Swagger؟" — تم البناء بمقارنة
آلية: جرد الـ routes من ملفات الـ routers + مقارنتها بـ `swaggerSpec` المولد.
سكربت دائم: `npx tsx scripts/verify-swagger.ts` (exit 1 عند أي فرق).

**النتيجة قبل الإصلاح:** 11 endpoint حي غير موثق + 8 عناصر موثقة بدون كود حي.
**النتيجة بعد الإصلاح:** مطابقة تامة — **119 مسار / 222 عملية** على الطرفين.

| الفرق | الحقيقة | الإصلاح |
| --- | --- | --- |
| `GET /reports/*` (10 endpoints) | موجودة وتركيب على `/api` لكن غير موثقة إطلاقًا | توثيقها في `buildReportsPaths()` الجديدة (تاج Reports + bearerAuth + 401/403) |
| `POST /store/auth/logout` | الـ route حي بـ POST، لكن الـ spec وثّقها GET (helper كان يخمن الطريقة من وجود body) | خيار `method` صريح في `path()` + `method: "post"` للـ logout |
| `/store/payments/status/{trackingToken}` + schema `PaymentStatus` | موثقة لكن **لا يوجد route حي** (تتبع الطلب يتم عبر `/store/track`) | حذف من الـ spec (endpoint + schema يتيم) |
| CRUD `/auth-accounts` + `/auth-verification-tokens` + `/sessions` (6 paths) | موثقة لكن ممنوع توليد CRUD لها (EXCLUDED_MODELS عمدًا في المولّد — بدون routes حية) | فلترة `exposedMetadata` في `swagger.ts` بعيدًا عن الـ spec |
| 10 views تقارير | `report_*` (9) + `cod_awaiting_settlement` (1) — التحقق من أسمائها من `manual_constraints.sql` | الأسماء موثقة كما هي فعليًا |

- السكربت يستثني مسارات الـ docs نفسها (`/api/docs`, `/api/docs.json`) — UI وليست API.
- التحقق بعد الإصلاح: typecheck ✅، build ✅، npm test 24/24 ✅، و`verify-swagger` = "matches exactly".

## 🙋 ما مطلوب من صاحب المتجر



1. **الشعار** (قيد الإعداد) — يرفع على Cloudinary لاحقًا.
2. **بيانات الكتالوج الحقيقية**: CSV للمنتجات (نموذج: `docs/examples/products-import.csv`) — أسماء عربية، أوصاف، عبوات وأسعار.
3. **شركات الشحن وتعرفاتها** لكل محافظة/مدينة (ShippingCarrier + ShippingTariff) — لوحة التحكم أو CSV.
4. **رقم واتساب/تواصل** وسوشيال: تُدخل في `STORE_CONTACT` / `STORE_SOCIAL` داخل `seed.config.json`.
5. **نسبة الضريبة** وحد الشحن المجاني: `TAX_RATE` / `FREE_SHIPPING_THRESHOLD`.
6. **أكواد كوبونات** إن وجدت (Promotion + Coupon عبر لوحة التحكم).
7. **حساب Cloudinary** (مجاني) وتعبئة المتغيرات في `.env`.

## ملاحظات تقنية للمراجع

- المال يُعاد كنصوص عشرية دائمًا (Decimal strings).
- لا قيم أعمال مُختلقة: إعداد مفقود = null.
- `normalizePhone` انتقل إلى `src/utils/phone.ts`.
- ملفات الرفع المولدة تُحفظ: `PRESERVED_MODULE_FOLDERS = auth, productImport, store, reports, uploads`.
