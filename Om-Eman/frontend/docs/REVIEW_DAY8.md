# مراجعة اليوم 8 + وضع المشروع + جاهزية الباك — 2026-11-26

> ده ملف مراجعة فقط (قراءة وفحص). **مفيش أي سطر كود اتعدّل** في المراجعة دي. كل بند تحت له دليل (ملف:سطر أو أمر + نتيجته).
> المراجع: Claude (بتكليف المالك). الملف ده بيغذّي `DAY9_TASKS.md` (G0 + G1).
> قاعدة الفصل (من `PROGRESS.md §62`): `SOURCE COMPLETE` ≠ `AUTOMATED PASS` ≠ `BROWSER VERIFIED` ≠ `OWNER ACCEPTED`.

---

## 1) الخلاصة في 10 أسطر

1. **الفرونت (متجر End-User) خلص في المصدر**: الأيام 1–8 كلها منفّذة. الـ 4 أوامر خضرا النهاردة (§2).
2. **Day 8 = `PARTIAL HANDOFF`**: الكود خلص، لكن **ما اتشافش في متصفح** (G6 كله `NOT TESTED`)، فمفيش حد يقدر يقول "اتقفل" بأمانة.
3. **توصيتي: نقفل Day 8 كـ "source-complete" بعد 4 إصلاحات صغيرة (§4 High/Medium)** — ونحوّل اختبار المتصفح لاختبار يدوي من المالك بقائمة جاهزة (§6) بدل ما نستنى Playwright.
4. **أخطر اكتشاف خارج الفرونت:** مفتاح + سر Cloudinary **حقيقيين شكلًا** مكتوبين في `backend/.env.example` المتتبع في git والمرفوع على GitHub (§5.1). لازم يتغيّروا (rotate) قبل أي حاجة.
5. **الباك للمتجر خلص فعلًا. الباك للداشبورد لأ**: لسه نص خام (CRUD) من غير فلاتر ولا relations ولا قواعد حالة طلب/دفع (§5.2). قولة "الباك خلص" صح للـ Storefront بس.
6. **مفيش "مشكلة build" حاليًا**: `npm run build` عدّى EXIT 0 النهاردة (مشكلة Turbopack `0xc0000142` القديمة ما اتكررتش). المشكلة الحقيقية الباقية هي **غياب بيئة متصفح** + **التوثيق القديم** + **سر Cloudinary**.
7. التوثيق فيه تناقضات بتلخبط أي AI جديد (§7) — أهمها بانر `PROGRESS.md` ورأس `DAY8_TASKS.md`.
8. الشغل كله **غير مرفوع**: Day 8 كله uncommitted (13 ملف معدّل + 8 جديد). لازم commit قبل ما نبدأ Day 9.

---

## 2) الفحص الآلي (نفّذته بنفسي — 2026-11-26)

من `Om-Eman/frontend`:

| الأمر | النتيجة |
|---|---|
| `npm run lint` | **EXIT 0** |
| `npm run check` | **EXIT 0** — `Scanned 309 code files, 513 message keys per locale. 0 failure(s), 0 warning(s).` |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false` | **EXIT 0** |
| `npm run build` | **EXIT 0** — كل مسارات Day 8 (`/faq`, `/wishlist`, `/cart`, `/checkout`, ...) ظاهرة في جدول الـ build |

ما اتشغّلش: browser / Lighthouse / dev server (مفيش أداة — `D8-BROWSER-ENVIRONMENT: BLOCKED`).

---

## 3) الخطة مقابل الواقع — إيه خلص وإيه لسه

### 3.1 جدول الأيام الفعلي

| اليوم | المحتوى الفعلي | المصدر | آلي | متصفح | قبول المالك |
|---|---|---|---|---|---|
| 1 | Foundation (i18n/tokens/4 themes/baseApi/motion/UI/`/design`/SEO base) | ✅ | ✅ | ✅ | 🟢 |
| 2 | باقي الحركة + recipes + إصلاحات D2 | ✅ | ✅ | ✅ | 🟢 |
| 3 | غلاف المتجر + هوم SSR + data layer + SEO | ✅ | ✅ | 🟡 | 🟡 (D3-RM reduced-motion CSS) |
| 4 | كتالوج + PDP + إضافة للسلة | ✅ | ✅ | 🟡 | 🟡 (`R-G4-MAJOR` fly-target مؤجل) |
| 5 | بحث + سلة الضيف | ✅ | ✅ | 🟡 | 🟡 |
| 6 | Checkout + شحن + كوبون + إثبات تحويل | ✅ | ✅ | ⛔ NOT TESTED | 🟡 |
| 7 | تتبع + Email auth + merge | ✅ | ✅ | 🟡 | ⚠️ partial (merge-read محجوب) |
| 8 | هوم/SEO/Google-UI/Cart→Checkout/FAQ/Wishlist-UI/Motion | ✅ | ✅ | ⛔ NOT TESTED | G5 🟢، باقي 🟡 |
| 9+ | Dashboard (الخطة الأصلية: يوم 2–7 لوحة) | ❌ | — | — | — |

### 3.2 مقابل الخطة الأصلية `FRONTEND_TASKS_10_DAYS.md`

| بند الخطة | الحالة |
|---|---|
| Phase 0 تجهيز (داتابيز/CSV/deps) | الباك متزامن (41 جدول)، الـ seed الحقيقي (`seed.config.json`) **لسه مستني قيم المالك** |
| Phase A Foundation | ✅ مقفولة |
| Phase C Storefront (هوم→كتالوج→منتج→سلة→checkout→تتبع→حساب) | ✅ كلها في المصدر (أيام 3–8) |
| Phase B Dashboard أساسي (4 أيام) | ❌ لم يبدأ → ده **اليوم 9** |
| Phase B Dashboard تكميلي (2 يوم) | ❌ |
| الإطلاق (Lighthouse ≥ 95 + SEO نهائي) | ❌ مؤجل لـ "يوم 15": `D15-SEO-SITEMAP` + مراجعة معمارية |

### 3.3 المتبقي المفتوح (غير الداشبورد)

| ID | البند | حالته |
|---|---|---|
| D8-BROWSER | أي اختبار متصفح لـ Day 6/7/8 | `NOT TESTED` — يتحل بقائمة المالك اليدوية (§6) |
| D8-BANNER-ASSETS | صور banners/categories/FAQ/Wishlist معتمدة | محجوب (مفيش أصول معتمدة) |
| D8-FAQ facts | حقائق الشحن/الدفع/الإرجاع/الضمان | غير موثقة → FAQ JSON-LD مؤجل |
| D8-MERGE-READ | قراءة سلة العميل بعد merge | محجوب (لا endpoint في الباك) |
| D8-GOOGLE-REAL | Google OAuth | مؤجل بقرار المالك |
| D8-WISHLIST-API | wishlist حقيقي | مؤجل (الباك فيه `/wishlist-items` CRUD عام بس مفيش `/store/wishlist`) |
| R-G4-MAJOR | fly-to-cart target | مؤجل |
| D3-RM | reduced-motion CSS bug | مفتوح من Day 3 |
| D15-SEO-SITEMAP | sitemap ديناميكي | مؤجل لـ Day 15 |
| D8-SEAL | ختم الإنتاج | NOT SEALED |

---

## 4) أخطاء كود Day 8 (مراجعة مفصلة — كلها بدليل)

> ملفات Day 8 كلها ≤ 43 سطر (الجديدة)، وأكبر ملف في المشروع 150 سطر (`CartDrawer.tsx`, `CheckoutAddressMainFields.tsx`) = على الحد الناعم بالظبط. مفيش `any` ولا `console.log` ولا `framer-motion` ولا ألوان خام ولا `ml-/mr-/pl-/pr-`. مفاتيح `ar/en` متطابقة (513). **ده كويس.** الأخطاء تحت حقيقية بس بسيطة.

### 🔴 High (SEO / a11y — لازم قبل القفل)

| # | الملف:سطر | المشكلة | الإصلاح |
|---|---|---|---|
| H1 | `components/ECommerce/Home/Hero.tsx:10` + `HomeSections.tsx` | **صفحة الهوم مفيهاش `<h1>` خالص.** (تحققت: grep `<h1` لقى 14 صفحة/section — كل صفحات المتجر عندها h1 **إلا الهوم**.) الخطة (§3.2) بتطلب "H1 واحد لكل صفحة" وSEO هو الأولوية القصوى. `Hero` بياخد `aria-label` بس، والـ slider `aria-hidden`، والـ CTA زرار. | اعرض `home.hero.title` كـ `<h1>` (مرئي أو `sr-only`) جوه `Hero`. وامسح المفاتيح الميتة `home.hero.subtitle` و`home.title` و`home.body` (نص placeholder قديم) من `ar.json` و`en.json`. |
| H2 | `components/Card/ProductCard.tsx:73` | رابط اسم المنتج عليه `focus-visible:outline-none` ومفيش بديل، والرابط ممدود بـ `after:absolute after:inset-0` → **التنقل بالكيبورد على كارت المنتج مفيهوش حلقة تركيز مرئية** (a11y + شرط §5 في AGENTS للـ focus-visible). | `focus-visible:after:outline-2 focus-visible:after:outline-primary` أو `focus-within:ring` على الكارت. |

### 🟠 Medium (أداء / نمط)

| # | الملف:سطر | المشكلة | الإصلاح |
|---|---|---|---|
| M1 | `components/ECommerce/Home/HeroCta.tsx:25` | `initial={{ opacity: 0, y: 16, scale: 0.96 }}` على الـ CTA أعلى الصفحة → السيرفر بيبعت `opacity:0` للـ CTA الأساسي (ممنوع صراحة في AGENTS §18: "لا تخفي above-the-fold content"). بيأخر ظهور الـ CTA لحد ما الـ JS يشتغل ويأثر على LCP/INP. | `initial={false}` أو الكلاس CSS `animate-fade-up` (مدعوم بدون JS وبيحترم reduced-motion). |
| M2 | `components/ECommerce/Home/HeroSlider.tsx:31` | `preload` على **كل الـ 3 slides** (≈2.9MB، بانر PNG واحد 2.5MB) رغم إن واحدة بس ظاهرة. بيضر LCP والباندويدث على الموبايل. | `preload={index === 0}`. |
| M3 | `CartCheckoutLink.tsx:18` · `GoogleSignInButton.tsx:23` · `WishlistEmptyState.tsx:26` · `ProductCard.tsx:85` | نفس بلوك Tailwind الطويل `motion-safe:transition-transform … motion-reduce:transition-none` متكرر 4 مرات (AGENTS §1.10 و§14 ممنوع). | variant واحد في `Button` أو ثابت `lib/` وإعادة الاستخدام. |
| M4 | `components/ECommerce/Home/HeroCta.tsx:39-43` | الـ shimmer بيتحرك `x: 0%→400%` (قيمة موجبة فيزيائية): في RTL (اللغة الافتراضية!) بيبدأ من اليمين ويجري لبرّه الزرار → **مش بيبان**. | اعكس الإشارة حسب `dir` أو استخدم CSS logical keyframe. |
| M5 | `lib/seo.ts:63-67` | كل الصفحات غير الهوم بتعلن `summary_large_image` من غير صورة → بدون `og:image`/`twitter:image`. ملفات `09_faq_banner.png` و`10_wishlist_empty_banner.png` موجودة ومش مستخدمة. | إما صورة افتراضية معتمدة أو `summary` لحد ما تتوفر. |

### 🟡 Low

| # | الملف:سطر | المشكلة |
|---|---|---|
| L1 | `FAQ/FaqItem.tsx:9` | `motion-safe:group-open:border-primary/20` مش بتشتغل: `<details>` هو الـ group نفسه (Tailwind v4: `group-open` للأبناء). الأنسب `open:border-primary/20`. السهم (سطر 14) شغال. |
| L2 | `faq/page.tsx:21` · `wishlist/page.tsx:23` | `StoreBreadcrumb` متسمّي بـ `t("breadcrumb")` = "الأسئلة الشائعة"/"المفضلة" بدل "مسار التنقل". استخدم `catalog.breadcrumb`. |
| L3 | `Wishlist/WishlistEmptyState.tsx:14` + `shared/EmptyState.tsx:17` | `<h1>` ثم `<h3>` مباشرة (تخطي مستوى). |
| L4 | `WishlistEmptyState.tsx:17` | كارت مش قابل للضغط بيرتفع عند hover (`hover:-translate-y-0.5 hover:shadow-hover`) → يوحي إنه رابط. |
| L5 | `shared/StoreBreadcrumb.tsx` مقابل `Product/ProductBreadcrumb.tsx` | نسخة مكررة. والقديمة بتحط `<li aria-hidden>` فواصل جوه `<ol>` (HTML غير صالح). استخدم `StoreBreadcrumb` للمنتج. |
| L6 | `Cart/CartDrawer.tsx:86` + `CartSummary.tsx:13` | شرط `showCheckout` دايمًا true عمليًا (الفرع النهائي بيضمن loaded + عناصر > 0). تكرار بلا فايدة. |
| L7 | `Cart/CartDrawer.tsx:41` | `href="/products"` literal بدل `PRODUCTS_HREF` من `lib/routes.ts`. |
| L8 | `hooks/useFloatingCartCta.ts:16` | زرار السلة العايم بيختفي في `/cart` بس، ويفضل ظاهر على `/checkout` و`/checkout/success` جنب الفورم. |
| L9 | `lib/brandAssets.ts:16-33, 81-91` | صادرات ميتة: `Set_01`/`Set_02` (متطابقين مع `Set_03`)، `jarMark`/`hero`/`brandVideo`، `IHomeImageCollection`/`HOME_IMAGE_COLLECTIONS` غير مستوردة. و`lib/seo.ts:25` بيعرّف `DEFAULT_LOCALE="ar"` بدل `routing.defaultLocale`. |
| L10 | `Account/GoogleSignInButton.tsx:22` | اسم الـ accessible بيتركّب في الكود: `${label} — ${unavailable}` (الفاصل `—` مش من `messages/`). |
| L11 | `messages/ar.json:605-637` | نص FAQ/Wishlist بالعربي الفصيح ("صفحة تحضيرية بلا حفظ") والباقي مصري ("ارجع لفوق"). وحدّد النبرة. |
| L12 | `ar.json:613` / `en.json:613` | إجابة FAQ بتقول روابط التواصل في الفوتر هي "الطريقة المدعومة" — لو مفيش إعدادات تواصل، الفوتر مش بيعرض أي بلوك فالإجابة تشاور على فراغ. (`StoreFooter.tsx:56-59`) |
| L13 | `hooks/useCheckoutSubmit.ts:87-90` | في `status === 0` (خطأ شبكة) بيعمل `isPending=false` من غير `release()` فالفورم يفضل مقفول ومفيش retry غير بـ reload. ممكن قصد (منع طلب مكرر) — **سؤال نية مش خطأ مؤكد**، والملف مش من تغييرات Day 8. |

### ⚪ ملاحظات خارج Day 8 (شفتها في الطريق، ما دققتش فيها)
- `Animation/FadeIn.tsx:25-26` و`Stagger.tsx:17` بـ `whileInView` + `initial` opacity 0: تأكد إنها تحت الـ fold بس (`CategoriesSection` بتستخدم `Stagger`).
- `app/[locale]/layout.tsx:46-47`: `getTranslations` بـ `locale` غير متحقق منه قبل `isLocale`.

---

## 5) الباك إند

### 5.1 🔴 أمني — سر Cloudinary في `.env.example` (تحققت)

- `backend/.env.example` **متتبع في git** (`git ls-files` يؤكد) وموجود في الـ commits `a9397c3`, `5c8639a`, `aff19ee`, `1a2360c`.
- فيه `CLOUDINARY_API_KEY` و`CLOUDINARY_API_SECRET` و`CLOUDINARY_CLOUD_NAME` بقيم شكلها حقيقي مش placeholders (القيم مش مكتوبة في أي تقرير بقرار المالك).
- الريبو `origin = github.com/mofadl237/Node_JS-Training` ومتزامن مع `origin/main` → **القيم على GitHub**.
- **المطلوب (إجراء على المالك — مش قراري):**
  1. افتح لوحة Cloudinary → Settings → API Keys → **Generate new / Revoke** القديم.
  2. حط القيمة الجديدة في `backend/.env` فقط (متجاهل في git).
  3. في `.env.example` اكتب `CLOUDINARY_API_SECRET=` فاضي أو `your_secret_here`.
  4. إزالة السر من التاريخ (BFG/`git filter-repo`) اختياري ومحتاج force-push؛ **تغيير المفتاح كافي وأهم**.
- مسجّل في `DAY9_TASKS.md` كـ `D9-SEC-CLOUDINARY` (blocker لـ G2 لأن رفع الصور هيعتمد عليه).

### 5.2 جاهزية الباك للداشبورد (تفحّص الكود — ما شغّلتش سيرفر ولا DB)

**الخلاصة: PARTIAL.** اللي يخص المتجر خلص ومتاخد في الاعتبار. الداشبورد محتاج شغل باك قبل أيام 10+.

| الميزة | الحالة | الدليل / الملاحظة |
|---|---|---|
| Login موظف | **READY** | `POST /api/auth/login` → `{employee{id,fullName,email,phone,role}, token}` (`auth/service.ts:67-76`). JWT HS256، 7 أيام. أخطاء: `INVALID_CREDENTIALS`, `EMPLOYEE_DISABLED`, `VALIDATION_ERROR` |
| `/auth/me` + أدوار | **READY** | OWNER/ADMIN/STAFF. `authenticate` بيعيد قراءة الموظف من DB كل طلب |
| Logout / refresh / rate-limit login | **MISSING** | مفيش — الخروج client-side فقط، وتسجيل الدخول بدون rate limit (brute-force ممكن) |
| CORS لـ `localhost:3001` | **READY** | `.env.example` يشمل 3000–3007؛ **تأكد من `backend/.env` الحقيقي** |
| قائمة منتجات | **PARTIAL** | `q/page/limit/sortBy/sortOrder` بس. مفيش فلتر `status`/`categoryId`/`isFeatured`، ومفيش صورة/سعر/اسم قسم في الصف |
| فورم منتج | **PARTIAL** | `POST/PATCH /products` شغالين. العميل لازم يبعت `searchText*` بنفسه (الـ CSV import هو اللي بيحسبها)، و`primarySubcategoryId` إلزامي، والمنتج من غير باكدج منشور = 404 في المتجر |
| CSV import | **READY** | `POST /products/import` (5MB). مفيش عمود صورة |
| رفع صور Cloudinary | **READY (غير مجرب حيًا)** | `POST /uploads/sign`. اسم الـ cloud كان غلط سابقًا (`BACKEND_PROGRESS:72`)؛ لازم تجربة حقيقية |
| أقسام/أقسام فرعية | **READY** | قراءة عامة + كتابة OWNER/ADMIN (الفرعية: `q=<categoryId>` كحل مؤقت) |
| قائمة الطلبات | **PARTIAL** | مفيش فلتر `status`/`paymentStatus`، ومفيش اسم العميل (`customerId` بس) |
| تفاصيل الطلب | **PARTIAL** | محتاجة 4–5 نداءات بحيلة `q=<orderId>` |
| **تغيير حالة الطلب** | **MISSING** | `PATCH /orders/:id` = `prisma.order.update` خام (`order/service.ts:105-111`): بلا تحقق انتقالات، بلا `OrderStatusHistory`، بلا timestamps. `markOrderDelivered` موجودة (`order-payment-status.service.ts:101`) **لكن غير موصولة بأي route** |
| **تأكيد/رفض دفع** | **MISSING** | `PATCH /payments/:id` خام (`payment/service.ts:87-93`): **ما بيحدّثش `Order.paymentStatus`** ومابيحطش `confirmedByEmployeeId` من الـ JWT. `refreshOrderPaymentStatus` مستخدمة في مسار العميل بس |
| فواتير / شحنات | **MISSING** | CRUD خام بلا ترقيم/void/تاريخ حالة |
| تقارير | **READY** | 10 endpoints OWNER/ADMIN، بلا params ولا نطاق تاريخ، `Record<string,unknown>[]` |
| ملخص KPIs للوحة | **MISSING** | مفيش endpoint لعدد الطلبات حسب الحالة/الإيراد |
| موظفين | **PARTIAL** | الباسورد بيتـhash. بس ADMIN يقدر يرقّي نفسه OWNER أو يمسح OWNER أو يمسح نفسه (hard delete) |
| صلاحيات STAFF | **خطر خفيف** | GET بـ `authenticate` بس: STAFF يقرأ `/employees` و`/system-settings` و`/audit-logs` و`/customers` و`/orders`، لكن `/payments` و`/reports` OWNER/ADMIN فقط |
| audit-logs | **PARTIAL** | الـ CRUD العام ما بيكتبش AuditLog فالسجل هيبان شبه فاضي |

**فلاتر الـ list** (البند 2 من `FRONTEND_TASKS §0.2`): **لسه مفتوح.** كل `list*QuerySchema` فيه `q/page/limit/sortBy/sortOrder` بس (تحققت من `product/validation.ts:55-61`). أي بارامتر تاني بيتتجاهل بصمت.

**الاختبارات:** `tests/` = unit(3) + integration(2) — بيغطوا checkout/claim/document-number بس. مفيش اختبارات auth/order/payment/reports.

### 5.3 اللي هيوقف أو يعقّد الداشبورد (بالأولوية — مرجع لطلب شغل الباك)

| # | الأولوية | المطلوب من الباك | يوقف إيه |
|---|---|---|---|
| BE-1 | 🔴 قبل Day 10 | فلاتر في **المولّد** `scripts/generate-modules.ts`: orders (`status`,`paymentStatus`,`customerId`, مدى تاريخ)، products (`status`,`primarySubcategoryId`,`isFeatured`)، payments (`status`,`orderId`)، والأبناء (`orderId`/`productId`/`invoiceId`) | قوائم الطلبات والمدفوعات، فلتر المنتجات |
| BE-2 | 🔴 قبل Day 11 | endpoint تغيير حالة طلب (`POST /orders/:id/status`) بخريطة انتقالات + `OrderStatusHistory` + timestamps + `markOrderDelivered` | إدارة الطلبات |
| BE-3 | 🔴 قبل Day 11 | `POST /payments/:id/confirm` و`/reject` في transaction واحدة + `refreshOrderPaymentStatus` + `confirmedByEmployeeId` من JWT + AuditLog | المدفوعات |
| BE-4 | 🟠 قبل Day 10 | تفاصيل غنية: product list (صورة primary + أقل سعر + عدد باكدجات + اسم القسم)، order detail aggregate (عميل/بنود/عنوان/دفعات/تاريخ) | تجنب N+1 |
| BE-5 | 🟠 Day 9–10 | rate limit على `/auth/login` | أمان الدخول |
| BE-6 | 🟠 | حماية OWNER (no role escalation / self-delete) وتقييد قراءة STAFF | أمان |
| BE-7 | 🟡 | KPI summary endpoint أو بارامترات تاريخ للتقارير | صفحة الـ overview |
| BE-8 | 🟡 | `AuditLog` تلقائي من الـ CRUD الحساسة | شاشة audit |
| BE-9 | ⏸ | فواتير/شحنات/`settings by key`: تتأجل (بلا UI في Day 9) | — |

---

## 6) بدائل اختبار المتصفح (حل مشكلة G6 العملي)

المشكلة مش كود — **مفيش بيئة متصفح مؤتمتة مأذونة**. الحل العملي بدون إضافة dependencies:

1. شغّل الباك (`:3002`) والفرونت (`npm run dev` → `:3001`) محليًا.
2. المالك (أو أنا بإشراف) يمشي على القايمة دي ويكتب `PASS/FAIL/NOT TESTED` + لقطة اختيارية في `PROGRESS.md`:

| الصفحة | اختبار | ar | en |
|---|---|---|---|
| `/` | skeleton ثم محتوى، Hero + CTA ظاهر فورًا (بعد M1)، الـ slider، **h1 موجود** (DevTools → Elements) | ☐ | ☐ |
| `/faq` | فتح/قفل التفاصيل، breadcrumb، التركيز بالـ Tab | ☐ | ☐ |
| `/wishlist` | empty state صادق، مفيش طلبات شبكة (Network) | ☐ | ☐ |
| `/account/login` | زر Google = رسالة غير متاح، صفر طلب شبكة | ☐ | ☐ |
| `/cart` | CTA الـ checkout يظهر بس لو في عناصر | ☐ | ☐ |
| `/checkout` | الانتقال محافظ على اللغة/الاتجاه | ☐ | ☐ |
| الكل | 360px + desktop، الثيمات الأربعة، reduced-motion (DevTools → Rendering) | ☐ | ☐ |
| الكل | Tab/Shift+Tab: حلقة التركيز ظاهرة (خصوصًا كارت المنتج بعد H2) | ☐ | ☐ |

3. Lighthouse من DevTools للهوم والـ PDP (موبايل) — يتسجل كـ "manual measurement" مش `seal`.

---

## 7) أخطاء التوثيق (تناقضات تلخبط أي AI جديد)

| # | الملف | المشكلة | التصحيح (في `DAY9_TASKS.md` G0) |
|---|---|---|---|
| D1 | `PROGRESS.md:4` | بانر "آخر تسليم" لسه `G6 — DAY 7` ومفيهوش Day 8 | تحديث البانر لـ Day 8 G7 |
| D2 | `PROGRESS.md:11-39` | جدول "الحالة العامة" و"حالة الأيام" قديم: بيقول Day 3 فيه 4 أخطاء TS وDay 4 خطة فقط وDay 5–7 "لاحقًا" والـ build `⛔` | استبداله بجدول §3.1 |
| D3 | `PROGRESS.md:37-39` | بيسمّي Dashboard "8-9" والإطلاق "13-14" | الترقيم الجديد: Dashboard يبدأ يوم 9، الإطلاق/المراجعة يوم 15 |
| D4 | `DAY8_TASKS.md:3` + `:440` | الرأس والخاتمة بيقولوا "NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED" بينما §12 بيقول G0–G7 اتنفذوا | سطر حالة واحد محدّث في الرأس |
| D5 | `FRONTEND_TASKS_10_DAYS.md:238-256` | "اليوم 9/10" القديمين (كتالوج/سلة/checkout/تتبع) **اتنفذوا فعلًا في أيام 4–7**. وبيوهم إن Day 9 = كتالوج | إضافة جدول ترقيم صريح "خطة الأصل → اليوم الفعلي" |
| D6 | `FRONTEND_TASKS_10_DAYS.md:272` | جدول الاعتماد على الباك بيقول `/api/store/cart/merge` لسه "راجع المسار" | تثبيت المسار الفعلي |
| D7 | `PROGRESS.md` | أقسام §43–§46 (Day 7 G3–G5) مش موجودة كعناوين `## ` | ملاحظة فهرسة |
| D8 | `AGENTS.md` (frontend) §3.1 | `[planned]` للـ `(Dashboard)` و`app/api/*` و`Dialog/Table/Tabs/Select/Sheet` — لازم تتحدث لما يتنفذوا | يتحدث في G8 من Day 9 |
| D9 | `backend/AGENTS.md` §1 | بيقول "لا migration/seed/واجهة" بينما الـ DB متزامنة وفيه seed وStore API وفرونت | يحدّثه المالك/الباك (خارج نطاقي) |
| D10 | git | **Day 8 كله uncommitted** (13 معدّل + 8 untracked) و`PROGRESS §50` لسه بيستشهد بـ HEAD `36d1d96` القديم | commit "End Day8" قبل Day 9 |

---

## 8) توصية القفل — نقفل Day 8 ولا لأ؟

**نقفل Day 8 كـ `SOURCE COMPLETE — PARTIAL HANDOFF` بالشروط دي:**

1. ✅ تنفيذ **H1 + H2 + M1 + M2** (أربع إصلاحات صغيرة؛ مش إعادة بناء) — موجودين في `DAY9_TASKS.md` كـ **G1**.
2. ✅ commit للشغل الحالي كـ `End Day8` **قبل** G1 (عشان الفرق يبان نظيف).
3. ✅ المالك يعمل قائمة §6 يدويًا (أو يؤجلها صراحةً لـ Day 15 — قرار مالك).
4. ⚠️ `D8-SEAL` يفضل `NOT SEALED` — مفيش دليل متصفح ولا Lighthouse.
5. ⏸ باقي الـ blockers (§3.3) تتسجل كمؤجلات لـ Day 15 ومتعطلش الداشبورد.

**مش بنقفله `SEALED`** لأن مفيش ملاحظة بصرية حقيقية لـ Home/FAQ/Wishlist/Google/Cart CTA. ده الصدق اللي بنمشي عليه.

---

## 9) أسئلة محتاجة قرار المالك

1. **"المشكلة الحالية"**: فهمت إنك تقصد (أ) غياب المتصفح/اختبار Day 8، و(ب) سر Cloudinary. لو كنت تقصد مشكلة تانية (build؟ بيئة؟ خطأ معين؟) قولّي عشان أضيفها.
2. هل تغيّر مفتاح Cloudinary الأول (مقترح) قبل أي G من Day 9؟
3. اختبار المتصفح: يدوي منك (§6) ولا تأجله لـ Day 15؟
4. الداشبورد: يفضل بالـ 4 ثيمات الحاليين ولا نضيف وضع داكن (الخطة القديمة كانت بتقول dark mode للوحة)؟
5. الباك: تفتح مهام BE-1/BE-5 الآن (بالتوازي مع Day 9) ولا نكتفي بالـ read-only في اليوم 9؟

---

## 10) تحديث التنفيذ + المراجعة الشاملة (2026-11-26 — بعد قرارات المالك)

> المالك اعتمد الشكل الحالي وأذِن بإصلاح ملاحظات §4 الأربع + زرار السلة العايم + تنضيف credentials. **الـ commit `End Day8` لا يعني Browser Verification ولا SEALED.**

### 10.1 اللي اتنفّذ (SOURCE) وأدلته

| البند | القرار | الملفات | الدليل |
|---|---|---|---|
| H1 `<h1>` للهوم | ✅ اتصلح (`sr-only` فلا تغيير بصري) + حذف مفاتيح `home.title/body/hero.subtitle` الميتة | `Home/Hero.tsx`, `messages/{ar,en}.json` | DOM على production build: `h1Count=1` ونصه صحيح؛ HTML المصدر `<h1` ×1 |
| H2 focus لكارت المنتج | ✅ `focus-visible:after:outline-2 -outline-offset-2 outline-primary` + `after:rounded-lg` | `Card/ProductCard.tsx` | مصدر فقط — **الرؤية بالكيبورد NOT TESTED** |
| M1 CTA بـ `opacity:0` | ✅ `initial={false}` + دخول CSS `animate-fade-up` (يشتغل بدون JS ويحترم reduced-motion) | `Home/HeroCta.tsx` | HTML المصدر: الغلاف `animate-fade-up` بدون `opacity:0`؛ الباقي `opacity:0` المتبقي = سلايد 2/3 المخفيين + أقسام تحت الـ fold (مقصود) |
| M2 preload | ✅ `preload={index === 0}` | `Home/HeroSlider.tsx` | HTML المصدر: `<link rel="preload" as="image">` ×1 (كان ×3) |
| **زرار السلة العايم** | ✅ السبب الجذري اتصلح (§10.2) + مخفي في `/checkout*` + شارة `99+` بدل `150+` | `styles/tokens.css`, `hooks/useFloatingCartCta.ts`, `FloatingCartCta.tsx`, `Header/CartLink.tsx` | قياس فعلي في Chrome (§10.2) |
| `/cart` noindex | ✅ (كان indexable رغم الخطة) | `cart/metadata.ts` | HTML المصدر: `<meta name="robots" content="noindex, nofollow"/>` |
| Credentials | ✅ `backend/.env.example` بقى placeholders (§10.3) | `backend/.env.example` | `grep` بعد التعديل |

**الفحوص بعد التعديل:** `npm run lint` EXIT 0 · `npm run check` EXIT 0 (309 ملف / **510** مفتاح لكل لغة — نزل 3 بحذف الميتة، ar/en متطابقين) · `tsc --noEmit` EXIT 0 · `npm run build` EXIT 0 (62/62).
**ملف دخيل اتشال:** `dupmsg.js` (سكربت مؤقت من وكيل المراجعة، untracked، كان بيفشّل lint).

### 10.2 زرار السلة العايم — السبب الجذري (مثبت بتجربة)

- **العَرَض:** الزرار `fixed` لكنه كان يظهر عند الفوتر بس.
- **السبب:** `app/[locale]/template.tsx` بيلف الصفحة بـ `.animate-page-in` وتوكنها `page-in … both`. بعد انتهاء الحركة يفضل الـ fill-mode `forwards` شغّال فالعنصر بيفضل بـ `transform: matrix(1,0,0,1,0,0)` ⇒ يتحول لـ **containing block** لأي `position: fixed` جواه ⇒ الزرار بيتقاس نسبةً للصفحة كلها مش الشاشة.
- **لماذا باقي الـ FABs سليمة؟** (واتساب/للأعلى) بيتعملوا `createPortal` لـ `document.body`، أما الزرار العايم وشريط التقدم والـ drawer فلأ.
- **الدليل 1 (صفحة معزولة في Chrome):** `none` ⇒ `top=469` · `both` ⇒ **`top=2864`** (آخر الصفحة) · `backwards` ⇒ `469`.
- **الدليل 2 (التطبيق الحقيقي، production build، Chrome headless):** القياس `getBoundingClientRect().top` للـ CTA بعد إضافة منتج:

| الحالة | scroll أعلى | وسط | آخر الصفحة | داخل الشاشة؟ |
|---|---|---|---|---|
| بعد الإصلاح — موبايل | 537 | 537 | 537 | ✅ ثابت |
| بعد الإصلاح — Desktop 1280 | 493 | 493 | 493 | ✅ ثابت |
| **قبل (محاكاة `both` على نفس التطبيق)** | **3239** (موبايل) / **2055** (desktop) | — | — | ❌ خارج الشاشة |

- **الإصلاح:** `--animate-fade-up` و`--animate-page-in` من `both` إلى **`backwards`** (`styles/tokens.css`). بصريًا نفس الحركة (الحالة الأولية أثناء التأخير، وبعد النهاية بيرجع للـ natural style = نفس آخر keyframe) لكن من غير ما الحركة تفضل "شغّالة" وتكسر `fixed`. بيصلّح كمان `ScrollProgressBar` والـ `CartDrawer` (نفس العلة).
- **ملاحظة تنبيه:** `npm run build` اتشغّل في نفس المجلد فمسح `.next` — لو الـ dev server بتاعك على 3001 شغّال اعمله restart.

### 10.3 Credentials — الوضع بعد التنضيف (بدون أي قيم)

| الفحص | النتيجة |
|---|---|
| `Om-Eman/backend/.env.example` | اتبدّل: `DATABASE_URL=…USER:PASSWORD@…`, `CLOUDINARY_CLOUD_NAME=your_cloud_name`, `CLOUDINARY_API_KEY=your_api_key`, `CLOUDINARY_API_SECRET=your_api_secret`. `JWT_SECRET=change_me_…` كان placeholder أصلًا |
| `Om-Eman/backend/.env` | **غير متتبع** ومتجاهل (`backend/.gitignore:4`)، `git ls-files` ما يلقاهوش ✅ |
| `Om-Eman/frontend/.env.local` | متجاهل (`frontend/.gitignore:34 .env*`) ✅ — ومع ذلك `frontend/.env.example` **متتبع ولازم** (قيم URL فقط) |
| **التاريخ (history)** | ⚠️ القيم القديمة لسه في commits `a9397c3, 5c8639a, aff19ee, 1a2360c` وعلى GitHub. **تغيير المفتاح (Revoke) هو الحل — تنضيف الملف ما بيمسحش التاريخ** |

**⚠️ ملفات متتبعة تانية في نفس الريبو (خارج Om-Eman — ما لمستهاش، قرارك):**
- `projects/project2_clinica/backend/.env.example`: فيه `SMTP_USER` (إيميل) و`SMTP_PASS` بطول 16 حرف **شكله Gmail App Password حقيقي** + `DATABASE_URL`. الأولى تعمله Revoke من حساب Google وتستبدله بـ placeholder.
- `Day1/.env` و`Day2/.env`: ملفات `.env` **متتبعة فعلًا** (فيها `DB_PASSWORD` محلي ضعيف). الأفضل `git rm --cached` وإضافتها لـ `.gitignore`.
- `projects/*/backend/dist/**` متتبعة (build output) — ما فيهاش أسرار لكن ما تتتبعش.

### 10.4 المراجعة الشاملة للمشروع (Day 1 → 8) — نتائج محققة

> مراجعة قراءة بالكود + قياسات (تباين WCAG محسوب من توكنات `themes.css`)؛ مفيش حاجة منها اتشافت بصريًا إلا اللي مكتوب صراحةً "[يحتاج متصفح]".

**أ) الامتثال للخطة — صفحة بصفحة:** كل الصفحات فيها `generateMetadata` عبر `buildMetadata` (canonical + hreflang + OG/Twitter) وh1 واحد (الهوم اتصلح)، و JSON-LD: Organization+WebSite في الـ layout، Product+Offer+Breadcrumb في الـ PDP، Breadcrumb في الكتالوج/FAQ/Wishlist. noindex على search/checkout/success/track/account/wishlist (و`/cart` اتصلح). **فجوات SEO متبقية (Medium، مؤجلة):** `robots.ts` بيمنع `/design` بس؛ `sitemap.ts` جذور اللغة فقط (= `D15-SEO-SITEMAP`)؛ `ogImage` للهوم فقط (PDP ما بتستخدمش `product.images`)؛ canonical الكتالوج دايمًا `/products` من غير category؛ Organization JSON-LD بدون `logo`؛ `EmptyState/ErrorState` بـ `<h3>` تحت `<h1>`.

**ب) أمنياتك في الأنيميشن (من `AGENTS.md`) — الموجود والناقص:**

| الأمنية | الحالة | الدليل |
|---|---|---|
| المنتج يطير للسلة | ✅ | `useFlyToCart.ts` + `CartBounce` + `useAddToCart.ts:75` (احترام reduced-motion) |
| أرقام متحركة | ✅ | `CountUp` (`PriceTag`, `CartSummary`, `TrackSummary`) + `RollingNumber` (الشارات والكمية) |
| خط يزيد مع السكرول | ✅ (اتأثر بنفس علة fixed → اتصلحت) | `ScrollProgressBar.tsx` |
| زرار للأعلى + دائرة تقدم حواليه | ✅ | `ScrollTopFab.tsx` + `ScrollProgressRing.tsx` (ملف `BackToTop.tsx` نسخة ميتة) |
| واتساب بأنيميشن حواليه | ✅ جزئي | `WhatsAppFab` + `PulseRing`؛ مفيش tooltip، ويظهر بعد `scrollY>10` فقط |
| إضاءة/خطوط متحركة على الكروت | ✅ جزئي | `GlowCard` + `BorderBeam`؛ `CategoryCard` ما بتفعّلش الـ beam، والـ beam بيظهر فجأة (من غير fade) |
| حركة ناعمة بين الأقسام مع السكرول | ⚠️ ناقص | `FadeIn`/`Stagger` في 3 أماكن بس؛ الهوم بيستخدم `animate-fade-up` وقت التحميل (بيشتغل خارج الشاشة)؛ الكتالوج/PDP/FAQ/الفوتر بلا reveal |
| Checkout متحرك كله | ⚠️ جزئي | stepper + رسم علامة صح + `Spotlight`/`BorderBeam` + `Shake` للكوبون |
| **أنيميشن "زعل" للكوبون الغلط** | ⚠️ الـ shake بس | مفيش أيقونة وش حزين ولا حد أحمر (`<Input>` بدون `hasError` في `CheckoutCoupon.tsx:83-95`)، ومفيش confetti لكوبون صح/نجاح الطلب (`useConfetti` مستخدم في `/design` بس) |
| hover على كل كارت وزرار | ✅ غالبًا | `Button`, `GlowCard`, صورة المنتج؛ و`ScaleOnHover` مش مستخدم |
| reduced-motion | ✅ مع ثغرة | `MotionProvider` + CSS + فحوص يدوية؛ ثغرة محتملة `CartBounce.tsx:22` [يحتاج متصفح] |

**أمنيات ناقصة تتخطط (مش في Day 9):** (1) وش حزين + حد أحمر للكوبون، (2) confetti للكوبون الصح ونجاح الطلب، (3) reveal بالسكرول في الكتالوج/PDP/FAQ/الفوتر/checkout، (4) tooltip واتساب + ظهوره من أول الصفحة، (5) انتقال دائري لتبديل الثيم (`startViewTransition` — DESIGN §2.4)، (6) اختياري: Lenis/scroll-snap للهوم، (7) sticky add-to-cart للموبايل.

**ج) التكرار (اللي سمّيته "مكروتن") — أعلى 15 مصدر واحد مقترح:** نسخة ميتة `BackToTop.tsx` مقابل `ScrollTopFab` · هيكل الـ FABs متكرر 3 مرات (`useIsMounted` + `<BodyPortal>` + `useIsScrolled`) · **3 تنفيذات breadcrumb** (`StoreBreadcrumb`/`ProductBreadcrumb`/inline في `CatalogSection`) · **خرائط أخطاء الـ API** متكررة (`accountError/cartError/checkoutError` + inline في 3 hooks، و`isApiError` معرّف في `cartError` ومستورد من 5 ملفات) → `lib/apiError.ts` · قيم رسائل مكررة (`errorBody` ×6, `rateLimited` ×4…) → `common.errors.*` · غلاف الصفحة `mx-auto max-w-… px-4 py-8` في **25** ملف → `PageContainer/PageHeader` · وصفة الكارت `rounded-lg bg-surface p-4 shadow-rest` في 11 ملف → `Card` · 3 wrappers لحالة (Empty/Error) → `StateView` · class الرابط النصي (140 حرف) ×3 · ثلاثي focus-ring ×13 في 11 ملف → `@utility focus-ring` · وصفة hover-lift ×4 · فحص `prefers-reduced-motion` يدوي في 9 ملفات → helper واحد · `safeLocale` في 22 ملف و17 `metadata.ts` شبه متطابقين → `buildPageMetadata` · كتلة `use cache` متكررة ×5 في `storeQueries.ts` · ثوابت صغيرة (`HOME_IMAGE_COLLECTIONS` 3 نسخ، فورمات السعر، فواصل 3600/3000). **كلها Low/Medium ومش أخطاء وظيفية — مرشحة لـ gate تنضيف مستقل بإذنك (أو Day 14).**

**د) جودة عامة:** صفر `any`/`@ts-ignore`/`dark:`/ألوان خام/`ml-`/`<img>` خام ✅. تخزين المتصفح متحقق منه بـ Zod ✅. **ثغرات متبقية:** (High) صور الهيرو والشعار المحلية بتتقدّم بدون تحسين (`imageLoader.ts:11` يرجّع الأصل — بانر PNG 2.5MB وشعار 1.8MB بيتعرض حوالي 160px)؛ (Medium) ردود الـ storefront والسلة `as T` بدون Zod (`storeFetch.ts:38`, `cartApi.ts`)؛ (Medium) حوالي 6MB صور غير مستخدمة في `public/` (Set_01/Set_02 + بانرات) وملفات Next الافتراضية؛ (Low) `OmEmanJarIcon.tsx:15` عربي hard-coded بـ `\u` escape يهرب من الـ check، و`animations.css:30` لون shimmer خام.

**هـ) التباين (WCAG محسوب من قيم `themes.css`):** نص الـ body الأساسي (`ink`/`paper`, `ink-soft`/`paper`, `on-primary`/`primary`) **بيعدّي 4.5 في الثيمات الأربعة**. المشاكل: **cinnamon** — `danger` على `surface` **2.78** وعلى `surface-2` **2.37** (نص الأخطاء `text-danger` في 12 ملف) و`success` 3.30؛ **zafran** — النص الفرعي `on-primary/80` على `primary` **3.79** (CTA السلة 12px). **الحل المقترح:** توكنات `danger/success` لكل ثيم (أفتح في cinnamon) ولون صريح بدل `on-primary/80`. **قرار الشكل بتاعك** (ما لمستوش).

### 10.5 حالة القفل بعد التنفيذ

| البند | الحالة |
|---|---|
| H1, H2, M1, M2 | ✅ SOURCE + AUTOMATED. اتقاس في Chrome headless: H1/M1/M2 (DOM/HTML) والـ CTA؛ H2 مصدر فقط |
| زرار السلة العايم | ✅ SOURCE + AUTOMATED + **اتقاس في Chrome headless** (موبايل + desktop، قبل/بعد). **ما اتشافش بصريًا من المالك** |
| Browser Verification (G6) | **NOT TESTED** بصريًا — قياسات DOM الجزئية أعلاه ما بتعوّضش القايمة اليدوية |
| Day 8 SEALED | ❌ **لا** — `D8-SEAL: NOT SEALED` |
| Day 8 commit | `End Day8` = حفظ المصدر فقط |

### 10.6 ملاحظة أداة اختبار المتصفح (تعديل على G6)

Chrome موجود فعليًا (`C:\Program Files\Google\Chrome\Application\chrome.exe`) وNode 22 فيه `WebSocket` مدمج، فـ **ممكن اختبار DOM/Network/Console/Viewport عبر Chrome DevTools Protocol بسكربت Node بدون أي dependency**. ده بيصحّح افتراض G6 ("لا أداة"). اللي يفضل يدوي: الحكم البصري للشكل والحركة والثيمات. بورت اختبار محلي غير `3001` محتاج `CORS_ORIGIN` أو Chrome بـ `--disable-web-security` (اتسخدم في القياس فقط).

### 10.7 قايمة اختبار يدوي مضافة لـ §6

| الصفحة | اختبار | ar | en |
|---|---|---|---|
| أي صفحة بعد إضافة منتج | الزرار العايم ثابت: أعلى/وسط/آخر الصفحة، فوق واتساب والـ للأعلى بدون تداخل | ☐ | ☐ |
| `/checkout`, `/checkout/success`, `/cart` | الزرار العايم **مش** ظاهر | ☐ | ☐ |
| الشارة | أكتر من 99 منتج ⇒ تظهر `99+` | ☐ | ☐ |
| موبايل 360px | فتح قايمة الموبايل بتغطي الشاشة صح (احتمال containing block بسبب `backdrop-blur` للهيدر) | ☐ | ☐ |
| كارت المنتج | Tab ⇒ حلقة تركيز ظاهرة حوالين الكارت | ☐ | ☐ |
| الهوم | الـ CTA بحركة دخول، الـ slider بيتبدّل، DevTools: h1 واحد | ☐ | ☐ |
