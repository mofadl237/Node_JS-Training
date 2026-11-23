# اليوم 6 — Checkout الضيف + إثبات التحويل — تاسكات التخطيط والتفكيك

> آخر تحديث: 2026-11-23. **حالة المستند: DAY 6 GATE 6 VERIFICATION COMPLETE + OWNER-ACCEPTED BACKEND SECURITY REMEDIATION + OWNER-ACCEPTED LATEST DECISIONS — PRIVATE PROOF IMAGE DELIVERY EXTERNALLY BLOCKED — RUNTIME/BROWSER/REAL UPLOAD NOT TESTED — G6 REMAINS BLOCKED / NO-GO — DAY 7 IMPLEMENTATION NOT AUTHORIZED.**
> **المدير/المراجع:** Astra. **المنفّذ المقترح:** GLM. **المالك:** صاحب القرار في النطاق، العقود، نقل الإيصال، الشكل/الحركة، فتح كل Gate والانتقال للي بعدها.
> المسارات نسبية إلى `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. هذا المستند سجل تخطيط ومراجعة Day 6؛ خطة اليوم وG0 وG1 وG2 وG3 معتمدة من المالك، ونُفّذ كود العقود/الـvalidation/الـendpoints في G1 وواجهة checkout في G2 وإرسال الطلب والإيصال في G3 وإثبات التحويل في G4، ثم أذن المالك بـG5 ونُفّذ كود الشكل والحركة؛ نُفّذ G6 كمراجعة وتسليم فقط بلا implementation. الاعتماد البصري والنهائي ما زال مطلوبًا.

---

## 0) قواعد التعامل — اقرأها الأول

1. قبل كل Gate: اقرأ `AGENTS.md`، آخر سجل في `docs/PROGRESS.md`، وقسم الـGate هنا. تحقّق من إذن مالك **صريح باسم الـGate**، وافحص `git status` والكود قبل أي تعديل. أي اختلاف عقد أو قرار غير واضح ⇒ سجّله واسأل؛ لا تخمّن.
2. منفّذ واحد فقط في كل وقت: GLM يعرض قائمة الملفات ومسؤولية كل ملف، ينفّذ Gate واحدة مصرّح بها، يشغّل فحوصها، يراجع الـdiff والملفات الجديدة غير المتتبعة، يحدّث `PROGRESS.md`، يسلّم التقرير ويقف. Astra يراجع ولا يعدّل بالتوازي.
3. حتى مع توصية Astra بالقبول، الانتقال للـGate التالية أو اعتماد الشكل/الحركة النهائي يحتاج موافقة المالك. لا يُترجم «كود جاهز» إلى «اعتماد بصري 🟢».
4. **ممنوع تغيير الاركتيكتشر بدون إذن صريح:** نفس App Router، نفس `Providers/` وترتيبهم، نفس `store/baseApi.ts` كبوابة API واحدة، نفس `interface/` و`components/Skelton/` بالأسماء الحالية، نفس `hooks/` و`components/Animation/` كأماكن للمنطق والحركة. لا restructure، لا design system ثاني، لا provider/slice/fetch wrapper موازٍ، لا cart slice جديد، لا cookie/localStorage key جديد للسلة، ولا تغيير استراتيجية الكاش العامة.
5. `@/` imports، TypeScript strict، interfaces بـ`I` وunions بـ`T`، ملف لكل مسؤولية، استهدف ≤150 سطر وحد أقصى 200، والصفحة للتركيب فقط (هدف ≤30). لا `any`، لا casts لإسكات أخطاء، لا نصوص مستخدم hard-coded، لا ألوان خام.
6. مفيش dependencies، edits للباك/DB/migrations/seed/npm scripts/config/n deployment، ولا commit/push/deploy. مفيش mock/MSW/بيانات تجريبية في صفحات المتجر؛ fixtures `/design` المعنونة تبقى معزولة.
7. الـUI states إلزامية: loading skeleton، error، empty cart، success، ومutation feedback. كل فشل يظهر رسالة مترجمة من `messages/` حسب `code`، لا raw message/stack/SQL.
8. في كل تقرير افصل صراحة: **منفّذ في المصدر / فحص آلي ناجح بدليل / شوهد في متصفح / 🟢 اعتمده المالك / ⛔ محجوب أو لم يُختبر**. HTTP 200 مش دليل إن الزرار اشتغل.
9. **ترتيب الشغل اللي اتفق عليه:** نبني أولًا الـArchitecture والـFields والـContracts في G1–G4؛ وبعدين في G5 فقط نحدد الشكل والـAnimation مع المالك. ممنوع تجميل أو حركة جديدة قبل اعتماد الهيكل الوظيفي.
10. الستايل: Tailwind CSS فقط، variables/tokens ثابتة في `styles/tokens.css` و`styles/themes.css`، ألوان دلالية فقط (`text-ink`, `bg-primary`, ...)، ممنوع Sass أو hex/rgb داخل المكوّنات. الحركة من `motion/react` عبر `m.*` والـwrappers الموجودة، مع `prefers-reduced-motion` وأولوية الأداء والسلاسة.
11. العقود من مصدرين فقط: `backend/src/modules/store/**`، `backend/src/services/{checkout-*,coupon.service,shipping.service,guest-checkout.service}.ts`، و`backend/docs/{STORE_BACKEND_TASKS,BACKEND_PROGRESS}.md`. الخطة القديمة `FRONTEND_TASKS_10_DAYS.md:247-250` مرجع تاريخي للمحتوى؛ لو تعارضت، المُقدَّم هو الكود الحقيقي وهذا المستند.
12. working tree مورّث dirty من Days 1–5 ومن إضافات UI بعد G5 (floating cart CTA، rolling numbers، لون سهم BackToTop، PREMIUM badge، filters أصغر). هذه الإضافات **موروثة للمراجعة البصرية**، ليست Gates Day 6، ولا يُعاد تنفيذها أو إصلاحها هنا إلا بإذن منفصل.

---

## 1) الهدف والنطاق

### 1.1 الهدف
- **D6-CHECKOUT:** الزائر يكمل من سلة الضيف إلى طلب حقيقي: عنوان وبيانات مستلم، مناطق شحن من الباك، كوبون اختياري من الباك، اختيار `COD` أو `ONLINE_TRANSFER`، ثم `POST /api/store/checkout` وإيصال نجاح بـ`orderNumber` ووسيلة الدفع والإجماليات القادمة من الباك.
- **D6-PROOF:** لو اختار `ONLINE_TRANSFER`، يرفع إثبات تحويل مباشرًا إلى Cloudinary بتوقيع من `/api/uploads/sign-proof`، ثم يرسل `POST /api/store/payments/proof` ويظهر حالة `PROOF_UPLOADED`.
- **D6-MOTION:** في Gate مستقل بعد الهيكل: checkout حيّ، stepper يتقدّم بسلاسة، خطأ الكوبون يهتز ويرجع برسالة مصرية، نجاح الطلب يرسم علامة صح، الأرقام تتحرك، والكروت/Actions ليها إحساس حركة خفيف ومتسق مع هوية البهارات والعطارة.

### 1.2 داخل النطاق
- Contracts وvalidation ورسائل الأخطاء: `interface/checkout.ts`، `validation/checkout.ts`، `lib/checkoutError.ts`، مفاتيح `checkout.*`/`payment.*`/`orderSuccess.*` في ar/en.
- Endpoints عبر `baseApi.injectEndpoints` فقط: checkout، shipping areas/quote، coupon validate، sign-proof، submit-proof.
- صفحة `/{locale}/checkout` رفيعة + skeleton + حالات، صفحة إيصال `/{locale}/checkout/success` (noindex)، وربط آمن للإيصال بدون كشف `trackingToken` في الرابط/canonical/JSON-LD/السجلات.
- نموذج Zod، تحويل cart lines إلى `items`، قراءة cart token الموجود، أوضاع empty/error/success، ومنع double submit من أول فتح لحد نهاية الاستجابة.
- صفحة التتبع الكاملة وحساب العميل ودمج السلة مؤجلة صريحًا لـDay 7.

### 1.3 خارج النطاق / موعده
- TODO: track page، حساب العميل، `POST /api/store/cart/merge`، claim، السجل الكامل للطلبات، Dashboard، wishlist، countdown، أسعار/ضريبة/شحن محسوبة في الفرونت.
- TODO: إصلاح `R-API-SEARCH` أو `R-CART-WRITE` أو `R-G4-MAJOR` أو `D3-RM` أو انحرافات Day 5؛ كلها تُسجّل وتُوزَّع في §6، ولا تُصلح داخل Day 6 تلقائيًا.
- TODO: تغيير `next.config.ts`، CSS loader، محرك البناء، dependencies، الباك، DB، migrations، seed، نشر، commit/push.
- TODO: حركة جديدة في G1–G4؛ الـMotion كله في G5 بعد موافقة المالك على الهيكل.

### 1.4 الروابط והـKS
- KS-1 وKS-2 وKS-3 من Days 4/5: منفّذة في المصدر؛ الاعتماد البصري 🟡 ما زال قائمًا عبر `R-VIS`.
- **KS-4 مقترح:** `/{locale}/checkout` يحوّل سلة حقيقية إلى طلب حقيقي بنفس الـtoken وبإجماليات الباك. يظل مفتوحًا حتى وجود دليل منفّذ/API/browser/اعتماد مالك.
- **KS-5 مقترح:** إثبات التحويل للطلبات `ONLINE_TRANSFER` يصل للباك ويظهر `PROOF_UPLOADED`. بدون بيئة مأذونة يبقى `NOT-TESTED`.

---

## 2) تدقيق الحالة الحقيقية قبل التخطيط

### 2.1 مصادر الحجة
- `frontend/docs/DAY5_TASKS.md:3-9,164-199,282-295,363-375`: الحالة النهائية، الـblockers، وSTOP اليوم الخامس.
- `frontend/docs/PROGRESS.md:1640-1738`: §27، تدقيق G5، الانحرافات، والمتبقي.
- `frontend/docs/FRONTEND_TASKS_10_DAYS.md:39,247-250,269-280`: ترتيب المتجر، محتوى checkout القديم، وتوفر endpoints الباك.
- `frontend/docs/DESIGN_SYSTEM.md:125-155`: طبقات الحركة ووصف checkout/coupon/success، بشرط فتح G5 للتنفيذ.
- كود الباك المقروء أثناء التخطيط: `backend/src/modules/store/{checkout,payments,shipping,coupons,track}/**`، `backend/src/services/{checkout-contracts,checkout-totals,coupon,shipping,guest-checkout}.ts`، `backend/src/modules/uploads/{routes,validation}.ts`.
- كود الفرونت المقروء: `store/cartApi.ts`، `lib/cartToken.ts`، `lib/routes.ts`، `interface/index.ts`، `components/ECommerce/Cart/*`، `messages/{ar,en}.json`.

### 2.2 تصنيف الأيام 1–5 والعناصر المؤجلة

| اليوم/البند | التصنيف | الحالة المبنية على الدليل | ما يُحمل لـDay 6 |
| --- | --- | --- | --- |
| Day 1 Foundation | Completed and verified | كود + lint + build + اعتماد بصري تاريخي. | لا شيء إلزامي. |
| Day 2 Foundation + 2.5 | Completed and verified | 24/24 مهمة وعيوب D2-01…D2-09 أُصلحت. | لا شيء إلزامي. |
| Day 3 Storefront | Implemented but not fully verified | shell/هوم/SEO موجودة؛ `D3-RM` follow-up مستقل. | `D3-RM` يبقى P2؛ لا يُلمس هنا. |
| Day 4 Catalog/PDP/Add | Completed with findings | G2/G3/G4 منفّذة؛ `R-G4-MAJOR` fly-target وB-PUB negative cases مسجّلة. | لا إعادة فتح؛ استخدم `ProductCard` و`cartApi` كما هما. |
| Day 5 Search/Cart | Complete — technical handoff | G0–G5 منفّذة؛ `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS` مفتوحة. | G0 يتحقق من البيئة؛ لا إصلاح implementation داخل Day 6. |
| Post-G5 UI polish | Implemented in working tree, visual review pending | floating cart CTA، rolling/badge، سهم ثيم، PREMIUM، filters أصغر؛ lint/check/build خضرا في جولاتها. | يُعرض في مصفوفة G5/G6 ولا يُعدّل في Gates الوظيفية. |
| Checkout | Deferred — Now Day 6 P0 | `DAY5_TASKS.md:36,199`; roadmap `FRONTEND_TASKS_10_DAYS.md:247-250`. | كل الشاشتين/العقود في هذا المستند. |
| Track/account/guest-merge | Deferred intentionally | `PROGRESS.md:1719`; ترتيب المتجر: checkout ثم تتبع+حساب. | **Day 7**؛ لا يُبدأ هنا. |
| B-PUB negative cases | Deferred | Day 4 G5 سجّلها كـNOT-TESTED. | لا تُعاد في Day 6. |
| No-longer-relevant | none | لا بند أُلغي؛ الأسطر القديمة superseded فقط. | لا حذف من السجل. |

### 2.3 قيود تاريخية تؤثر على Day 6
- `B-BUILD`: build G5 نجح (`BUILD_EXIT=0`)، لكن الخطر التاريخي مسجّل؛ لا ختم production-ready ولا ادعاء متصفح إلا بدليل جديد.
- `R-VIS`: لا اعتماد متصفح شامل لDay 3/4/5؛ Day 6 يحتاج مصفوته الخاصة ولا يرث 🟢.
- `R-API-SEARCH` و`R-CART-WRITE`: فجوات runtime/بيئة؛ checkout يعتمد على قراءة السلة والمنتجات، وليس على إصلاح البحث أو PATCH/DELETE.
- `R-PORTS`: `:3001` كان مستمعًا، `:3002` غير متاح في G5؛ لا إيقاف/تشغيل عمليات بدون إذن.
- `R-STYLE-ANIM`: رغبة المالك في الحركة موجودة، لكن التنفيذ مؤجل إلى G5 بعد الهيكل؛ لا تخمين للـStyles قبل المراجعة.

---

## 3) العقود الحقيقية — قراءة فقط

### 3.1 قواعد عامة
- Base frontend: `NEXT_PUBLIC_API_URL` = `http://localhost:3002/api`؛ الفرونت على `:3001`.
- Success: `{ success: true, message, data, meta? }`. Failure: `{ success: false, message, code, details? }`.
- `store/baseApi.ts` يفك الـenvelope ويحوّل الفشل إلى `IApiError {status,message,code}`؛ كل message معروضة تترجم من `messages/` حسب `code`.
- Money/decimal strings (`"200.0000"`)؛ لا `Number()` للحساب، لا ضريبة أو إجمالي محلي، لا قيمة افتراضية للشحن.
- أي mutation حقيقي (checkout/proof) يحتاج بيئة مأذونة وبيانات حقيقية؛ لا seed صناعي ولا guestToken حقيقي في التقارير.

### 3.2 Shipping
- `GET /api/store/shipping/areas` (`backend/src/modules/store/shipping/routes.ts:9`) ⇒ `data: IShippingArea[]` = `{ governorate, cities: [{ city: string|null, cost: string, etaMinDays: number, etaMaxDays: number }] }` (`backend/src/services/shipping.service.ts:48-58`).
- `GET /api/store/shipping/quote?governorate=...&city=...` (`routes.ts:10`, `validation.ts:6-19`) ⇒ `data: { cost: string; etaMinDays: number; etaMaxDays: number }` (`shipping/service.ts:13-17`).
- منطقة بلا تعريفة ⇒ `400 SHIPPING_AREA_NOT_CONFIGURED` (`shipping.service.ts:38-42`)؛ **مش شحن مجاني**. استخدم نفس ASCII/Arabic pattern في `validation.ts`؛ لا تخترع مدنًا.
- كل query/quote يعرض تكلفة الباك فقط؛ الإجمالي النهائي يظهر من استجابة checkout.

### 3.3 Coupon preview
- `POST /api/store/coupons/validate` (`coupons/routes.ts:25-31`)، rate limit 10/15د.
- Body: `{ couponCode: string(1..60), items: [{ productPackageId: string, quantity: number>0≤1000 }] (1..50) }` (`coupons/validation.ts:3-14`).
- Response: `{ valid, couponCode, discountType, discount, subtotal, discountedSubtotal }`، كل حقولها decimal strings (`validation.ts:18-25`).
- أخطاء متوقعة: `COUPON_INVALID`, `COUPON_NOT_ACTIVE`, `COUPON_EXPIRED`, `RATE_LIMITED`. الكود الغلط = shake/رسالة في G5، مش حالة «مفيش خصم» صامتة.

### 3.4 Checkout
- `POST /api/store/checkout` (`checkout/routes.ts:23`)، rate limit 20/15د، `clientIp` من الطلب وليس من العميل (`controller.ts:12-17`).
- Body (`checkout/validation.ts:3-41`): `phone` regex، `recipientName` 2..120، `address { governorate, city, street, district?, building?, floor?, landmark?, latitude?, longitude? }`، `items` 1..50 من `{ productPackageId, quantity: 1..1000 }`، `couponCode?`, `customerNotes?`, `guestToken?`, `paymentMethod: "COD" | "ONLINE_TRANSFER"` إجباري. `firstName/lastName/email` اختيارية.
- Response `IGuestCheckoutResult` (`backend/src/services/checkout-contracts.ts:35-42`): `orderId`, `orderNumber`, `trackingToken`, `paymentMethod`, `paymentId`, `totals`.
- `totals` (`checkout-totals.service.ts:10-17`): `subtotal`, `discountTotal`, `shippingTotal`, `taxTotal`, `grandTotal`, `currency` — كلها decimal strings عدا الحروف.
- `trackingToken` سر ownership للضيف (43+ base64url). لا يظهر في canonical/OG/JSON-LD/analytics/logs؛ الإيصال يستخدم helper محلي، وصفحة التتبع الكاملة Day 7.

### 3.5 Payment proof
- `POST /api/uploads/sign-proof` (`uploads/routes.ts:37-42`) rate limit 10/ساعة؛ body `{ orderId, trackingToken }` (`uploads/validation.ts:14-21`) ⇒ `IUploadSignature { cloudName, apiKey, timestamp, signature, folder, allowedFormats, uploadUrl }` (`validation.ts:26-35`)؛ المتصفح يرفع الملف مباشرة لـCloudinary، الباك لا يستقبل الملف.
- `POST /api/store/payments/proof` (`payments/routes.ts:18-24`) rate limit 10/ساعة؛ body (`payments/validation.ts:4-18`): `orderId`, `trackingToken` (43..64), `method: "ONLINE_TRANSFER"` literal, `amount: number>0≤1000000`, `proofImageUrl`: Cloudinary URL، `transactionReference?` ≤100.
- Response `{ paymentId, paymentStatus }` (`payments/service.ts:21`)؛ الحالة المتوقعة `PROOF_UPLOADED` (`service.ts:81-100`).
- أخطاء متوقعة: `ORDER_NOT_FOUND`, `ORDER_ACCESS_DENIED`, `PAYMENT_ALREADY_CONFIRMED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_METHOD_NOT_ONLINE`, `RATE_LIMITED`, `VALIDATION_ERROR`.

### 3.6 Track (مرجع فقط — Day 7)
- `GET /api/store/track/:trackingToken` (`track/routes.ts:20`) rate-limited؛ `data: ITrackedOrder` (`track/types.ts:3-19`) فيه `orderNumber`, `status`, `paymentStatus`, `placedAt`, `deliveredAt`, `etaMinDays/MaxDays`, `items`. لا يُنفّذ هنا؛ يُستخدم فقط كمرجع لتصميم الإيصال بدونdead link.

---

## 4) الموجود فعليًا في الفرونت — أعد استخدامه

| الاحتياج | الموجود | القرار |
| --- | --- | --- |
| Envelope/base query | `store/baseApi.ts` + `unwrapEnvelope` | كل endpoint جديد عبر `injectEndpoints`؛ لا fetch مباشر، لا API slice موازٍ. |
| السلة والعناصر | `store/cartApi.ts`, `IStoreCartLine.package.id`, `itemsCount`, `subtotal`, `hooks/useCartBadge.ts` | اقرأ السلة بالتوكن الموجود؛ `items` للـcheckout من `package.id` و`quantity`؛ لا حساب سعر محلي. |
| التوكن | `lib/cartToken.ts`, `hooks/useCartToken.ts` | استخدم القارئ الحالي؛ لا cookie/new key. أرسل `guestToken` في body فقط عند وجوده. |
| الإعدادات | `getStoreSettings()` في `lib/server/storeQueries.ts`, `IStoreSettings.currency` | العملة من الباك؛ لو غائبة لا تخترع `EGP`. |
| الرسائل | `messages/{ar,en}.json` (مفاتيح متطابقة) | أضف namespaces `checkout`, `payment`, `orderSuccess` بالتساوي وICU مفردة `{count}`. |
| الحالات | `EmptyState`, `ErrorState`, `Skeleton`, `components/Skelton/*`, `PriceTag`, `Badge`, `Button`, `Input`, `Toaster` | أعد الاستخدام؛ لا primitive جديد قبل حاجة حقيقية. |
| الأنيميشن الموجود | `CountUp`, `Shake`, `BorderBeam`, `Spotlight`, `FadeIn`, `ScaleOnHover`, `hooks/useConfetti.ts`, `m.*` | لا حركة جديدة قبل G5؛ في G5 تُستخدم هذه أولًا. |
| التوجيه | `@/i18n/navigation`, `lib/routes.ts` | أضف `CHECKOUT_HREF`/`CHECKOUT_SUCCESS_HREF` فقط؛ لا `/en/` hard-coded. |
| الصفحات | `app/[locale]/(Store)/cart/*`, `(Store)/search/*` | انسخ نمط الصفحة الرفيعة + metadata + loading، لا نسخ منطق cart/search. |

---

## 5) جرد الملفات المتوقع — أسماء متوقعة، ليست إذن إنشاء

> كل ملف جديد يجب أن يمرّ باختبار «مسؤولية واحدة». لو ملف موجود يؤدي نفس الدور، أعد استخدامه وسجّل الاسم الفعلي. لا تُنشأ ملفات Gate لاحقة قبل إذنها.

### 5.1 Contracts وvalidation وhelpers

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `interface/checkout.ts` + `interface/index.ts` | جديد/تعديل | `IOrderTotals`, `ICheckoutResult`, `IShippingArea`, `IShippingQuote`, `ICouponPreview`, `IOrderReceipt`, `TPaymentMethod`. لا DTO موازٍ. |
| `validation/checkout.ts` | جديد | Zod لنموذج checkout وaddress وitems وطريقة الدفع، مطابق لعقد الباك؛ لا ثقة بـ`localStorage` أو رد أعمى. |
| `lib/checkoutForm.ts` | جديد | تحويل cart lines إلى `items` وتطبيع النموذج إلى body؛ لا prices/count محلية. |
| `lib/checkoutError.ts` | جديد | خريطة `code` إلى مفتاح `messages/`؛ لا raw message/stack. |
| `lib/orderReceipt.ts` | جديد | قراءة/كتابة إيصال جلسة عبر `sessionStorage` مع SSR guard؛ لا `trackingToken` في URL/canonical/logs. قرار المالك في G0. |
| `lib/routes.ts` | تعديل | `CHECKOUT_HREF`, `CHECKOUT_SUCCESS_HREF`؛ لا مسارات مبنية باليد في المكوّنات. |

### 5.2 API endpoints

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `store/checkoutApi.ts` | جديد | `placeOrder` mutation عبر `baseApi.injectEndpoints`، tag `Cart` عند النجاح فقط. |
| `store/shippingApi.ts` | جديد | `getShippingAreas` query + `getShippingQuote` query؛ لا cache عام جديد. |
| `store/couponApi.ts` | جديد | `validateCoupon` mutation؛ لا تخزين للنتائج في Redux. |
| `store/paymentApi.ts` | جديد | `signProof` + `submitProof` mutations؛ لا file في body. |
| `lib/proofUpload.ts` | جديد | رفع FormData إلى `uploadUrl` الموقّع؛ يقرأ مفاتيح الحقول من `uploads/controller.ts` وقت التنفيذ، لا تخمين. |

### 5.3 Routes وUI

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `app/[locale]/(Store)/checkout/{page,metadata,loading}.tsx` | جديد | صفحة تركيب، metadata noindex للcheckout، skeleton مطابق. |
| `app/[locale]/(Store)/checkout/success/{page,metadata,loading}.tsx` | جديد | إيصال noindex؛ يقرأ من `lib/orderReceipt.ts`، لا token في الرابط. |
| `components/ECommerce/Checkout/CheckoutSection.tsx` | جديد | تركيب خطوات checkout وحالاتها فقط. |
| `components/ECommerce/Checkout/CheckoutStepper.tsx` | جديد | عرض تقدّم الخطوات؛ الحركة تُضاف في G5. |
| `components/ECommerce/Checkout/CheckoutItems.tsx` | جديد | عرض بنود السلة من `IStoreCart`؛ لا تعديل كمية هنا. |
| `components/ECommerce/Checkout/CheckoutAddressForm.tsx` | جديد | حقول الاسم/الهاتف/العنوان من قوائم الشحن؛ Zod/next-intl/RTL. |
| `components/ECommerce/Checkout/CheckoutShipping.tsx` | جديد | اختيار governorate/city وعرض quote وETA من الباك. |
| `components/ECommerce/Checkout/CheckoutCoupon.tsx` | جديد | إدخال الكوبون وعرض نتيجة `coupon/validate`؛ لا خصم محلي. |
| `components/ECommerce/Checkout/CheckoutSummary.tsx` | جديد | عرض subtotal/discount/shipping من الباك والإجمالي النهائي بعد الطلب فقط. |
| `components/ECommerce/Checkout/CheckoutPaymentMethod.tsx` | جديد | اختيار `COD`/`ONLINE_TRANSFER`؛ لا حالة دفع مختلقة. |
| `components/ECommerce/Checkout/CheckoutSubmit.tsx` | جديد | زر الإرسال، loading/disabled، حماية double submit. |
| `components/ECommerce/Checkout/PaymentProofForm.tsx` | جديد | رفع إثبات ONLINE_TRANSFER فقط. |
| `components/ECommerce/Checkout/OrderSuccess.tsx` | جديد | عرض orderNumber/paymentMethod/totals ورسالة الدفع التالية. |
| `components/ECommerce/Checkout/CheckoutState.tsx` | جديد | empty cart / error / network failure موحّدة. |
| `components/Skelton/{CheckoutSkeleton,CheckoutSuccessSkeleton}.tsx` | جديد | skeletons بنفس أبعاد الشاشات، بلا layout shift. |
| `hooks/{useCheckoutForm,useCheckoutSubmit,useOrderReceipt,useProofUpload}.ts` | جديد | منطق منفصل: نموذج، إرسال، إيصال، رفع. لا hook واحد كبير. |
| `messages/{ar,en}.json` | تعديل | `checkout.*`, `payment.*`, `orderSuccess.*`, ورسائل الأخطاء الجديدة بالتساوي. |

---

## 6) أولويات backlog

### P0 — لازم لأي تسليم Day 6 مقبول
1. G0: تثبيت `:3002` وعقود shipping/coupon/checkout/proof/sign-proof، وتوزيع المؤجلات، وقرار نقل الإيصال.
2. D6-CHECKOUT: سلة حقيقية → نموذج محقق → `POST /checkout` → إيصال من الرد، مع `COD` و`ONLINE_TRANSFER`.
3. D6-PROOF: sign-proof ثم submit-proof لحالة `PROOF_UPLOADED`، مع حدود الملف/الصيغة من `allowedFormats`.
4. حماية الإضافة الحالية: لا تعديل على cart token، لا double submit، لا إجمالي/ضريبة/شحن مختلقة، لا dead link للتتبع.
5. رسائل ar/en متطابقة، RTL/LTR، الثيمات الأربعة، موبايل 360px، وكل الـUI states.

### P1 — مطلوب للاكتمال الوظيفي
1. Coupon preview من الباك مع رسالة خطأ واضحة، بدون كتابة redemption في الفرونت.
2. Shipping areas/quote من الباك فقط، منع اختيار منطقة غير مهيأة، عرض ETA الحقيقي.
3. إيصال آمن: `orderNumber` ظاهر، `trackingToken` مخفي عن URL/canonical/JSON-LD/ السجلات.
4. Network assertions: طلب واحد لكل فعل، لا تكرار عند double-click، لا toast نجاح قبل 201.
5. توثيق أي انحراف عن الأسماء المتوقعة أو أي قرار إيصال/كاش.

### P2 — مرجأ/محجوب، لا يدخل Day 6 تلقائيًا
1. Track page كامل + timeline + ETA: **Day 7**.
2. حساب العميل/Login/Google/Email + `POST /api/store/cart/merge`: **Day 7**.
3. `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, B-PUB negative cases.
4. انحرافات Day 5: native search fallback، تكرار grid classes، noindex/SearchAction، dual-mode CartDrawer، double focus restore، `Number(subtotal)`.
5. إصلاح B-Build التاريخي أو تغيير tooling/Next config.

### سجل التوزيع حتى ما تراكمش

| ID | البند | الموعد/الحالة | القرار في Day 6 |
| --- | --- | --- | --- |
| D6-CHECKOUT | Guest Checkout | **Day 6 P0** | يُنفّذ في G2/G3. |
| D6-PROOF | Payment proof | **Day 6 P0** | يُنفّذ في G4. |
| D6-MOTION | Checkout/coupon/success motion | **Day 6 G5** | لا يُنفّذ قبل مراجعة الهيكل مع المالك. |
| D7-TRACK | Track page | Day 7 | لا يُنفّذ هنا؛ الإيصال لا يحوي رابطًا ميتًا. |
| D7-ACCOUNT | Customer auth + merge | Day 7 | لا يُنفّذ هنا. |
| R-API-SEARCH | Search runtime | مفتوح من Day 5 | G0 يسجّل البيئة فقط؛ لا إصلاح implementation. |
| R-CART-WRITE | Cart write runtime | مفتوح من Day 5 | G0/G2 يسجّلان القيد؛ لا PATCH/DELETE جديد. |
| R-VIS | Browser acceptance | مفتوح من Day 3 | مصفوفة Day 6 مستقلة في G5/G6. |
| R-STYLE-ANIM | Style/animation debt | مفتوح | يُغلق جزئيًا في G5 بما يخص Day 6 فقط. |
| R-G4-MAJOR / D3-RM | Fly target / reduced motion | مفتوح | P2؛ لا يُلمس. |

---

## 7) خطة الـGates — 12 حقل لكل Gate

> كل Gate تقف وحدها. جدول الملفات في §5 «متوقّع»؛ لا يُنشأ شيء قبل إذن هذه الـGate بعينها.

### Gate 0 — Pre-flight وتثبيت العقود (docs/baseline فقط)

1. **ID/الهدف:** G0؛ فصل سلامة البيئة وتوزيع المؤجلات عن implementation.
2. **الاعتماد/الإذن:** إذن مالك مستقل باسم G0، مُمنح 2026-11-22؛ لا كود تطبيق.
3. **النطاق:** قراءة AGENTS/PROGRESS/هذا المستند/عقود الباك؛ `git status --short`؛ فحص `:3001/:3002`؛ آخر build/check؛ مراجعة الإضافات بعد G5 بصريًا.
4. **خارج النطاق:** لا checkout UI، لا proof، لا إصلاح blockers، لا باك/DB.
5. **الملفات المتوقعة:** `docs/PROGRESS.md` فقط لتسجيل الأدلة والقرارات.
6. **المسؤولية:** وثيقة فقط؛ صفر تعديل مصدر.
7. **العقود المطلوب تأكيدها:** shipping areas/quote، coupon validate، checkout result/totals، sign-proof، submit-proof، ودرجة تحقق كل واحد من المصدر أو runtime.
8. **قرار المالك المطلوب:** نُفّذ الافتراضي المذكور في الخطة المعتمدة: نقل الإيصال عبر `sessionStorage` دون token في الرابط/canonical/logs؛ G5 للـMotion يبقى جلسة مراجعة منفصلة بعد G1–G4.
9. **الفحوص:** سجّل أوامر القراءة separately؛ لا tokens في التقارير؛ اذكر أن HTTP 200 ليس acceptance.
10. **المتصفح:** لا شاشة Day 6 هنا؛ سجّل توفر المتصفح/قيوده فقط.
11. **DoD:** baseline مؤرّخ + جدول مؤجلات موزّع + قرار إيصال + كل blockers مسجّلة.
12. **STOP:** `⛔ STOP — Gate 0`

### Gate 1 — Contracts وValidation وAPI helpers

1. **ID/الهدف:** G1؛ تجهيز العقود والمدخلات وكل endpoints بدون صفحة أو حركة.
2. **الاعتماد/الإذن:** G0 مقبول + إذن G1 + عقود الباك متاحة للقراءة.
3. **النطاق:** §5.1 و§5.2؛ `messages/` للرسائل فقط عند الحاجة.
4. **خارج النطاق:** لا route/checkout UI، لا رفع ملف، لا إجمالي محلي.
5. **الملفات المتوقعة:** `interface/checkout.ts`, `validation/checkout.ts`, `lib/checkoutForm.ts`, `lib/checkoutError.ts`, `lib/orderReceipt.ts`, `store/{checkout,shipping,coupon,payment}Api.ts`, `lib/routes.ts`, messages.
6. **المسؤولية:** لكل ملف مسؤولية واحدة؛ كل mutation عبر `baseApi`؛ لا DTO موازٍ ولا تخزين سلة جديد.
7. **العقد:** Zod يطابق `guestCheckoutSchema` و`paymentProofSchema`؛ decimal strings تبقى strings؛ `trackingToken` لا يخرج للـlogs.
8. **الفحوص:** lint/check/tsc/diff، كل أمر على حدة؛ ثم build منفصلًا.
9. **API smoke:** للقراءة فقط في البيئة المأذونة: areas، quote، invalid coupon؛ لا checkout/proof قبل G3/G4.
10. **المتصفح:** لا شاشة؛ سجّل أن لا حركة/ستايل أُضيفت في G1.
11. **DoD:** مدخلات غير صالحة لا تصل للباك؛ الفشل يبقى failure؛ لا أرقام/ضرائب مختلقة.
12. **STOP:** `⛔ STOP — Gate 1`

**الحالة الفعلية:** COMPLETE — SOURCE + CHECKS PASS — WAITING FOR OWNER REVIEW — G2 LOCKED.
**الدليل:** `PROGRESS.md:1845+` §30 — 13 ملفًا جديدًا + 7 تعديلات؛ `G1_LINT_EXIT=0`, `G1_CHECK_EXIT=0`, `G1_TSC_EXIT=0`, `G1_DIFF_CHECK_EXIT=0`, `G1_BUILD_EXIT=0`؛ API قراءة فقط settings/areas/quote/coupon بلا checkout/proof write.
**انحراف موثّق:** Zod قُسّم لملفات صغيرة حسب `AGENTS.md`؛ `lib/proofUpload.ts` أُجّل لـG4 لتفادي رفع ملف/تخمين FormData.

### Gate 2 — Checkout: العنوان والشحن والكوبون والبنود

1. **ID/الهدف:** G2؛ تجربة تعبئة checkout بالكامل بدون تقديم طلب.
2. **الاعتماد/الإذن:** G1 مقبول + إذن G2 + سلة حقيقية قابلة للقراءة.
3. **النطاق:** route checkout، skeleton، CheckoutSection/Stepper/Items/AddressForm/Shipping/Coupon/Summary/State، useCheckoutForm.
4. **خارج النطاق:** لا `POST /checkout`، لا proof، لا Motion جديد، لا تعديل cart.
5. **الملفات المتوقعة:** §5.3 عدا Submit/Success/Proof.
6. **المسؤولية:** الصفحة تركيب فقط؛ القوائم من `/shipping/areas`؛ quote وcoupon من الباك؛ الإجمالي النهائي ما زال غير معروض قبل الطلب.
7. **العقد:** `governorate/city` من القائمة فقط؛ `items` من cart lines؛ أي `SHIPPING_AREA_NOT_CONFIGURED`/`COUPON_*` رسالة مترجمة منفصلة.
8. **الفحوص:** lint/check/tsc/diff/build؛ اختبار Zod للهاتف/العنوان/الكمية، وحالات السلة الفارغة والمنطقة غير المهيأة.
9. **المتصفح:** ar/en، RTL/LTR، 360px/desktop، 4 ثيمات، Tab/Enter/focus-visible، SSR مرئي، لا `opacity:0` فوق ال fold.
10. **البيانات:** لا مدن وهمية، لا سعر شحن محلي، لا خصم محلي؛ لا guestToken في التقارير.
11. **DoD:** المستخدم يكمل الخطوات ويرى ملخصًا صادقًا؛ لا طلب أُرسل؛ Astra review مطلوب.
12. **STOP:** `⛔ STOP — Gate 2`

**الحالة الفعلية:** COMPLETE — SOURCE + CHECKS PASS — API READ-ONLY VERIFIED — BROWSER NOT TESTED — WAITING FOR OWNER REVIEW — G3 LOCKED.
**الدليل:** `PROGRESS.md:1926+` §31 — 21 ملفًا جديدًا + تعديل رسائل ar/en؛ `G2_LINT_EXIT=0`, `G2_CHECK_EXIT=0`, `G2_TSC_EXIT=0`, `G2_DIFF_CHECK_EXIT=0`, `G2_BUILD_EXIT=0`؛ Zod `BASE=true/BAD_PHONE=false/BAD_STREET=false/BAD_QTY=false`؛ API settings/areas 200، quote حقيقي 200، unconfigured 400، coupon validation 400، بدون أي order/proof write.
**انحراف موثّق:** أُضيف `CheckoutPaymentMethod` كاختيار نموذج فقط؛ أُضيف `CheckoutContent` وفُصلت الحقول لحدود الملفات؛ حقل المدينة يستخدم `Input` + `datalist` من مدن الباك فقط لأن `/shipping/areas` يعيد `city: null` (تعريفة محافظة) بينما quote يشترط city نصيًا. لا Motion ولا إجمالي محلي ولا submit.

⛔ STOP — DAY 6 GATE 2 COMPLETE — WAITING FOR OWNER REVIEW — G3 LOCKED

### Gate 3 — تقديم الطلب والإيصال

1. **ID/الهدف:** G3؛ إغلاق KS-4 في المصدر/API المسموح.
2. **الاعتماد/الإذن:** G2 مقبول + إذن G3 + بيئة checkout كتابة مأذونة.
3. **النطاق:** CheckoutPaymentMethod/Submit، route success، OrderSuccess، useCheckoutSubmit، useOrderReceipt، حماية double submit.
4. **خارج النطاق:** proof upload، track page، محاولة دفع حقيقية، إرسال إيميل، تعديل cart token.
5. **الملفات المتوقعة:** §5.3 المقابلة.
6. **المسؤولية:** تحويل النموذج إلى body واحد؛ `guestToken` من القارئ الحالي؛ `clientIp/clientUserAgent` لا يُرسلان من العميل؛ لا toast/fly قبل 201.
7. **العقد:** `paymentMethod` إجباري؛ response `IGuestCheckoutResult`؛ الإيصال يحفظ `orderNumber/paymentMethod/totals` محليًا ولا يعرض `trackingToken` في الرابط أو metadata.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network: طلب checkout واحد فقط عند double-click، لا طلبات بعد فشل validation، لا رد 4xx يُفسَّر كنجاح.
9. **المتصفح:** COD وONLINE_TRANSFER، reload لصفحة الإيصال، back/forward، رسائل rate-limit، أوضاع فشل الشحن/المخزون/الكوبون، noindex للصفحتين.
10. **القرار المعلّق:** قرار G0 لنقل الإيصال؛ لو تغيّر ⇒ STOP وطلب إذن قبل implementation.
11. **DoD:** إيصال من بيانات الباك فقط؛ السلة لا تُعاد إنشاؤها؛ لا رابط تتبع ميت؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 3`

### Gate 4 — إثبات التحويل ONLINE_TRANSFER

1. **ID/الهدف:** G4؛ إغلاق KS-5 في المصدر/API المسموح.
2. **الاعتماد/الإذن:** G3 مقبول + إذن G4 + إيصال يحوي `orderId/trackingToken` في الذاكرة المحلية للجلسة + بيئة proof مأذونة.
3. **النطاق:** PaymentProofForm، store/paymentApi.ts، lib/proofUpload.ts، useProofUpload، رسائل `payment.*`.
4. **خارج النطاق:** رفع صور المنتجات، تعديل uploads config، رفع ملف عبر الباك، السماح للـCOD برفع إثبات.
5. **الملفات المتوقعة:** §5.2/§5.3 proof rows.
6. **المسؤولية:** sign أولًا ثم upload مباشر ثم submit؛ حقل `method` literal `ONLINE_TRANSFER`؛ `amount` من `grandTotal` القادم من الباك لا من إدخال حر.
7. **العقد:** `trackingToken` 43..64؛ `proofImageUrl` Cloudinary؛ `allowedFormats` من التوقيع؛ أخطاء `ORDER_ACCESS_DENIED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_METHOD_NOT_ONLINE` مترجمة.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network: sign/upload/proof بالترتيب، لا رفع قبل توقيع، لا submit قبل اكتمال الرفع، لا token في التقارير.
9. **المتصفح:** ملف صالح/خاطئ/كبير، رفض COD، ربط الإيصال، حالة `PROOF_UPLOADED`، reduced-motion لحالة التحميل.
10. **البيانات:** صورة إثبات حقيقية من بيئة اختبار مأذونة فقط؛ لا base64 مخلق ولا URL وهمي في المتجر.
11. **DoD:** لا يمكن رفع إثبات لطلب COD؛ أي فشل يترك الزر قابلًا لإعادة المحاولة؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 4`

**الحالة الفعلية:** COMPLETE — SOURCE + CHECKS PASS — ASTRA APPROVED WITH WARNINGS — PROOF WRITE/BROWSER NOT TESTED — WAITING FOR OWNER REVIEW — G5 LOCKED.
**الدليل:** `PROGRESS.md:2118+` §34 — 3 ملفات جديدة (`lib/proofUpload.ts`, `hooks/useProofUpload.ts`, `components/ECommerce/Checkout/PaymentProofForm.tsx`) + تعديل `OrderSuccess.tsx` ورسائل `payment.*`؛ `G4_LINT_EXIT=0`, `G4_CHECK_EXIT=0`, `G4_TSC_EXIT=0`, `G4_DIFF_CHECK_EXIT=0`, `G4_BUILD_EXIT=0`؛ `check` سجّل `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`.
**انحراف موثّق:** لا تغيير في `store/paymentApi.ts` لأن endpoints المطلوبة كانت موجودة من G1؛ لا Cloudinary client ولا backend proxy ولا تعديل uploads config؛ لا إرسال proof إلى الباك قبل نجاح الرفع؛ لا إظهار `PROOF_UPLOADED` قبل رد الباك؛ 429 وstatus 0 يُترجمان إلى رسائل `payment.errors.*`؛ لا browser/write runtime مأذون ⇒ `NOT TESTED`.

### Gate 5 — الشكل والأنيميشن (بعد الهيكل، بإذن منفصل)

1. **ID/الهدف:** G5؛ تحويل checkout المُبني إلى تجربة “حيّة” متسقة مع الهوية، بدون تغيير العقود/الاركتيكتشر.
2. **الاعتماد/الإذن:** G1–G4 مقبولة + إذن مالك صريح باسم `G5 — CHECKOUT STYLE & MOTION` + مراجعة شكل مع المالك.
3. **النطاق:** Stepper line fill، انزلاق الخطوات، micro-shake للكوبون الغلط، count-up للإجماليات بعد الرد، button loading→check morph، رسم علامة صح في الإيصال، hover/spotlight/border-beam خفيف على summary/card، تناسق مع الثيمات الأربعة.
4. **خارج النطاق:** مكتبات حركة جديدة، GSAP/Lottie/Three، Sass، ألوان خام، حركة على كل عنصر في نفس الوقت، إصلاح `R-G4-MAJOR`/`D3-RM`، تغيير الهيدر/الفوتر/السلة.
5. **الملفات المتوقعة:** تعديل مكوّنات Checkout الحالية فقط + `styles/tokens.css`/`styles/themes.css`/`styles/animations.css` لو لزم token/keyframes جديد باسم دلالي وفي كل الثيمات.
6. **المسؤولية:** استخدام `m.*` والـwrappers الموجودة أولًا (`CountUp`, `Shake`, `FadeIn`, `ScaleOnHover`, `BorderBeam`, `Spotlight`, `useConfetti`)؛ transform/opacity في الغالب؛ `prefers-reduced-motion` إلزامي.
7. **العقد:** أي حركة لا تُغيّر القيم المرسلة/المعروضة؛ لا تأخير يخفي نجاح/فشل mutation؛ لا حركة فوق ال fold تعتمد على JS فقط.
8. **الفحوص:** lint/check/tsc/diff/build + قياس تقريبي للتأثير (لا animation على كل البطاقات؛ beam كارت واحد/اثنين بالتناوب).
9. **المتصفح:** مصفوفة كاملة مع `prefers-reduced-motion`، 360px/desktop، الثيمات الأربعة، لا overflow أفقي، لا وميض hydration، لا حركة تمنع التركيز/ الكيبورد.
10. **اعتماد المالك:** اختيار الشكل النهائي والإحساس؛ 🟡 حتى يعتمد المالك.
11. **DoD:** الحركة تحسّن الفهم ولا تبطّئ؛ لا تغيير منطق/عقود؛ انحرافات R-STYLE-ANIM الخاصة بـDay 6 موثّقة.
12. **STOP:** `⛔ STOP — Gate 5`

**الحالة الفعلية:** COMPLETE — SOURCE + CHECKS PASS — ASTRA APPROVED WITH WARNINGS — BROWSER/VISUAL NOT TESTED — WAITING FOR OWNER VISUAL REVIEW — G6 LOCKED.
**الدليل:** `PROGRESS.md:2183+` §35 — تعديل 7 مكوّنات checkout + `styles/animations.css`؛ إذن صريح `G5 — CHECKOUT STYLE & MOTION`؛ `G5_LINT_EXIT=0`, `G5_CHECK_EXIT=0`, `G5_TSC_EXIT=0`, `G5_DIFF_CHECK_EXIT=0`, `G5_BUILD_EXIT=0`؛ `check` سجّل `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`.
**انحراف موثّق:** لا runtime/visual browser matrix ولا اعتماد بصري نهائي؛ `styles/animations.css` موروث فوق 200 سطر قبل G5، فأُضيفت له حركات checkout وفق خطة Gate 5 بدل ملف CSS جديد؛ تحذير Astra بسيط بشأنSpinner الافتراضي خارج نطاق G5 لم يُلمس.

### Gate 6 — المراجعة والتسليم (Day 6 فقط)

1. **ID/الهدف:** G6؛ تقرير كامل وتوصية Astra، لا implementation.
2. **الاعتماد/الإذن:** إذن مالك بعد مراجعة Gates المفتوحة؛ لو G3 وحده جاهز يسمّى «تسليم جزئي D6-CHECKOUT».
3. **النطاق:** `docs/PROGRESS.md` و`docs/DAY6_TASKS.md` فقط لتحديث الحالة/الأدلة.
4. **خارج النطاق:** لا إصلاح عيوب، لا فتح Day 7، لا ختم production مع أي blocker مفتوح.
5. **الملفات المتوقعة:** الوثائق فقط.
6. **المسؤولية:** جدول Task ID/الحالة/الملف/الدليل؛ انحرافات؛ أوامر؛ KS-4/5؛ blockers؛ سجل المؤجلات.
7. **العقد:** راجع كل Gate مقابل §3 و§5 و§7؛ لا accepts بلا دليل؛ لا ترقية 🟡 إلى 🟢.
8. **الفحوص:** استشهد بالأوامر المؤرّخة؛ لا تعيد build فاشل في حلقة.
9. **المتصفح:** اذكر ما شوهد فعليًا وما لم يُرَ؛ افصل `API VERIFIED` عن `BROWSER VERIFIED`.
10. **الاعتماد:** Astra يوصي؛ المالك وحده يعتمد الشكل والانتقال.
11. **DoD:** تقرير صادق بالقيود؛ DAY6_TASKS يعكس الحالة الفعلية؛ STOP أخير.
12. **STOP:** `⛔ STOP — DAY 6 GATE 6 COMPLETE — WAITING FOR OWNER REVIEW`

**الحالة الفعلية:** VERIFICATION COMPLETE — SOURCE + AUTOMATED CHECKS PASS — RUNTIME/BROWSER/SECURITY NOT TESTED — ASTRA BLOCKED / NO-GO — TECHNICAL HANDOFF ONLY — PRODUCTION SEAL REFUSED — OWNER ACCEPTANCE PENDING.
**الدليل:** `PROGRESS.md:2239+` §36 — لا كود جديد في G6؛ لا بيئة اختبار مأذونة ولا بيانات اختبار، لذلك كل فحوص المتصفح والكتابة والرفع/الخصوصية `NOT TESTED`. الأوامر الآلية: `npm run lint`, `npm run check`, `tsc --noEmit`, `git diff --check -- .`, `npm run build` — كلها exit 0؛ `check` سجّل `221 code files`, `344 message keys per locale`, `0 failure(s), 0 warning(s)`؛ build سجّل 35 route entries، success route `/{locale}/checkout/success` dynamic.
**النتائج:** نموذج إثبات التحويل موجود في مصدر `components/ECommerce/Checkout/PaymentProofForm.tsx` ولا يظهر إلا على `/{locale}/checkout/success` بعد إيصال صالح في `oe.order.receipt` ولـ`ONLINE_TRANSFER` فقط؛ لا يظهر في صفحة checkout ولا لـCOD ولا عند غياب الإيصال (مثل فتح الرابط مباشرة/جلسة جديدة). الكوبون اختياري في المصدر ولا يعتمد عليه إرسال الطلب. تدفق sign→upload→submit وملكية الطلب وحالة `PROOF_UPLOADED` موجود في المصدر، لكن الرفع الفعلي وخصوصية Cloudinary لم يُختبرا.
**انحرافات/blockers موثّقة:** لا runtime/browser/visual ولا acceptance؛ صورة الإثبات تُرفع إلى Cloudinary `/image/upload` العام ولا يوجد ربط URL بالطلب/المجلد أو تسليم خاص، وتوقيع الرفع يسمح `PROOF_UPLOADED` قبل منع submit، وكتابة الدفع وتحديث الحالة ليست في transaction واحد ولا audit log في التدفق؛ انحرافات Swagger واسم endpoint في وثيقة الباك موثّقة ولا تُصلَح في G6. طلب البحث داخل المحافظات خارج نطاق G6 ويحتاج إذنًا منفصلًا.

---

## 8) أوامر التحقق (تُسجَّل وقت التنفيذ، لا تعليمات الآن)

### 8.1 من `Om-Eman/frontend` — بعد كل Gate كود
```bash
npm run lint
npm run check
node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false
npm run build
git status --short --untracked-files=all
git diff --check
git diff --stat
git diff -- package.json package-lock.json
```
شغّل كل أمر منفصلًا؛ سجّل exit code وآخر سطور مفيدة. أي dependency diff ⇒ STOP.

### 8.2 قراءة العقود — G0/G1/G2
```bash
curl -i 'http://localhost:3002/api/store/shipping/areas'
curl -i 'http://localhost:3002/api/store/shipping/quote?governorate=<AREA>&city=<CITY>'
curl -i -X POST 'http://localhost:3002/api/store/coupons/validate' -H 'Content-Type: application/json' -d '<BODY>'
curl -i 'http://localhost:3002/api/store/settings'
```
لا ترسل guestToken حقيقيًا أو trackingToken في تقرير. `<AREA>/<CITY>/<BODY>` تُملأ من بيئة مأذونة وقت التنفيذ، لا من seed متخيل.

### 8.3 كتابة مقيدة — G3/G4 فقط وبإذن
```bash
curl -i -X POST 'http://localhost:3002/api/store/checkout' -H 'Content-Type: application/json' -d '<BODY>'
curl -i -X POST 'http://localhost:3002/api/uploads/sign-proof' -H 'Content-Type: application/json' -d '<BODY>'
curl -i -X POST 'http://localhost:3002/api/store/payments/proof' -H 'Content-Type: application/json' -d '<BODY>'
```
فقط في بيئة اختبار مأذونة؛ سجّل method/path/status وشكل الـdata المختصر بلا token. لو `:3002` غير متاح ⇒ `NOT-TESTED`، لا قيم مختلقة.

### 8.4 مصفوفة المتصفح/SSR
| السطح | الحد الأدنى |
| --- | --- |
| Checkout | سلة فارغة، تعبئة، منطقة غير مهيأة، كوبون غلط/صح، COD، ONLINE_TRANSFER، double-click، فشل network/rate-limit، back/forward. |
| Success | orderNumber ظاهر، trackingToken غير ظاهر في DOM/URL/metadata، reload، noindex، لا رابط تتبع ميت. |
| Proof | sign/upload/submit بالترتيب، صيغة خاطئة، رفض COD، `PROOF_UPLOADED`، إعادة محاولة بعد فشل. |
| Common | `/ar` RTL و`/en` LTR، 360px/desktop، الثيمات الأربعة، لا overflow، Tab/Enter/focus-visible، `prefers-reduced-motion`، SSR مرئي. |
| Style/Motion | الحركة تخدم الفهم، لا وميض ولا تأخير نجاح/فشل، لا حركة على كل الكروت، تناسق الألوان مع البهارات/العطارة. |

---

## 9) المخاطر والـblockers

| ID | الدليل/الخطر | الإجراء المسموح |
| --- | --- | --- |
| R-OWNER | لا إذن Day 6 حاليًا؛ هذه الوثيقة تخطيط فقط. | STOP؛ لا Gate قبل إذن مالك صريح. |
| R-API | `:3002` كان غير متاح في G5؛ توفر اليوم ليس ضمانًا للغد. | G0 يتحقق من البيانات الحية لكل Gate كتابة/قراءة. |
| R-API-SEARCH | Search runtime BLOCKED من Day 5. | سجّل فقط؛ لا إصلاح أو اختبار ضمن Day 6. |
| R-CART-WRITE | PATCH/DELETE cart لم تُختبر حيًا. | checkout يقرأ السلة ولا يعتمد على تعديلها هنا. |
| R-CHECKOUT-WRITE | POST checkout/proof تحتاج بيئة مأذونة. | لو غير متاحة: `NOT-TESTED`، لا mutation وهمية. |
| R-RECEIPT | `trackingToken` سر الضيف. | الافتراضي `sessionStorage`؛ لا URL/canonical/logs؛ قرار المالك في G0. |
| R-TOTALS | الضريبة والإجمالي لا يظهران قبل checkout response. | لا حساب محلي؛ اعرض المبالغ المتاحة من الباك فقط، والإجمالي بعد 201. |
| R-COUPON | endpoint `/api/store/coupons/validate` rate-limited وقد يرجع أخطاء متعددة. | لا خصم محلي؛ رسالة مترجمة لكل code؛ لا إعادة محاولة تلقائية. |
| R-PROOF | Cloudinary direct upload قد يفشل بعد التوقيع. | لا تُرسل submit-proof قبل اكتمال الرفع؛ لا base64 URL مختلق. |
| R-VIS | لا اعتماد متصفح شامل للأيام السابقة. | مصفوفة Day 6 مستقلة؛ 🟡 حتى اعتماد المالك. |
| R-STYLE-ANIM | رغبة قوية في حركة مكثفة مع حساسية الأداء. | G5 فقط؛ مكوّن واحد/اثنان beam، reduced-motion، لا Sass ولا مكتبة جديدة. |
| R-PORTS | `:3001/:3002` إدارة بيئة. | لا إيقاف أو تشغيل عمليات بدون إذن. |
| B-BUILD | خطر Turbopack تاريخي رغم نجاح آخر build. | لا ختم production-ready؛ سجّل أي تكرار. |
| R-G4-MAJOR / D3-RM | fly target وreduced-motion قديمان. | P2؛ لا يُلمسا في Day 6. |

---

## 10) قالب تقرير كل Gate

1. **Gate / الإذن / البيئة / التاريخ:** ما فُتح وما لم يُفتح.
2. **جدول:** `Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل`.
3. **الفحص:** أوامر + exit codes + مقتطفات API/HTML بلا tokens أو أسرار.
4. **الانحرافات:** ملفات جديدة/معدّلة، untracked، dependencies، باك/DB، أي قرار معلّق.
5. **المتبقي:** KS-4/5، `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, D7 items.
6. **القرار:** توصية Astra + أسبابها، ثم خانة اعتماد المالك منفصلة.
7. آخر سطر دائمًا: `⛔ STOP — Gate N` (أو STOP النهائي في G6).

---

## 11) طلب مراجعة Astra

يرجى من Astra مراجعة هذا المستند مقابل:
- `frontend/AGENTS.md`، `frontend/docs/PROGRESS.md` §27، `frontend/docs/DAY5_TASKS.md`، و`DESIGN_SYSTEM.md` §5؛
- عقود `backend/src/modules/store/{checkout,payments,shipping,coupons}/**` و`backend/src/services/checkout-*`؛
- اكتمال الـ12 حقلًا لكل Gate، وعدم خروج النطاق على track/account/backend/DB/tooling/performance؛
- دقة تصنيف «Deferred» و«Now Day 6» و«Day 7»، وعدم تراكم المؤجلات بدون مالك؛
- أن الملفات كلها «متوقعة» وليست إذن تنفيذ، وأن STOP موجود؛
- أن G5 للشكل/الحركة فقط بعد الهيكل، بما يتوافق مع رغبة المالك في التصميم معًا.

**قرار Astra:** G2 `APPROVE_WITH_WARNINGS` — لا blockers ولا تغييرات مطلوبة قبل الاعتماد؛ G3 `APPROVE_WITH_WARNINGS` بعد مراجعة الإصلاحات — لا blockers ولا تغييرات مطلوبة؛ G4 `APPROVE_WITH_WARNINGS` بعد إصلاح ترجمة `payment.errors.methodNotOnline` — `Blockers: NONE`، `Required changes: NONE`، `Scope compliance: PASS`؛ G5 `APPROVE_WITH_WARNINGS` — `Blockers: NONE`، `Required changes: NONE`، `Scope compliance: PASS`؛ G6 `BLOCKED / NO-GO` — `Scope compliance: PASS`، `G6_CLEAR: NO`؛ Payment Proof Security Remediation `PASS` مع ملاحظات منخفضة غير حاجزة و`ASTRA-PPS-05 resolved`؛ لا توصية باعتماد الإنتاج أو الاعتماد النهائي.
**اعتماد المالك / إذن فتح Gate:** APPROVED لـDay 6 Plan وGate 0 وGate 1 وGate 2 وGate 3 وGate 4 (2026-11-22) وGate 5 (`تمم اعتمنا واعمل G5`). G6 صَدَر بإذن `G6 VERIFICATION ONLY` للمراجعة والتسليم فقط؛ لا اعتماد بصري أو إنتاجي تلقائي.
**سجل G3:** نُفّذ `useCheckoutSubmit` و`useOrderReceipt` و`CheckoutSubmit` و`OrderSuccess` وصفحة success مع `noindex`؛ lint/check/tsc/diff/build بـexit codes 0؛ لا checkout/proof write runtime؛ لا browser verification؛ Astra G3 acked بتحذيرات غير حاجزة واعتماد المالك معلّق.
**سجل G4:** نُفّذ `proofUpload` و`useProofUpload` و`PaymentProofForm` وربط `OrderSuccess` ورسائل `payment.*`؛ lint/check/tsc/diff/build بـexit codes 0؛ لا sign/upload/proof write runtime؛ لا browser verification؛ Astra G4 acked بتحذيرات غير حاجزة بعد إصلاح الترجمة واعتماد المالك معلّق.
**سجل G5:** نُفّذت حركات checkout داخل المكوّنات المصرّح بها و`styles/animations.css`؛ lint/check/tsc/diff/build بـexit codes 0؛ Astra G5 `APPROVE_WITH_WARNINGS`؛ لا browser/visual matrix ولا اعتماد بصري من المالك.
**سجل G6:** مراجعة source/static وتسليم فقط؛ لا implementation ولا playwright/API write/real orders/proof uploads. lint/check/tsc/diff/build بـexit codes 0؛ Astra `BLOCKED / NO-GO` بسبب غياب بيئة مأذونة ونتائج runtime/browser/security، مع انحرافات proof integrity/privacy وatomicity/audit موثّقة في `PROGRESS.md` §36.
**تحذيرات Astra G4 المقبولة:** لا runtime/browser؛ بعض أخطاء `checkout.errors.*` تظهر عبر namespace آخر مع بقائها مترجمة؛ كل الأخطاء تظهر تحت حقل الملف؛ `uploadUrl` مطابق حرفيًا لعقد الباك الحالي؛ تحديثات الحالة في الوثائق.

---

## 12) Payment Proof Security Remediation — Backend Only

- **الإذن:** المالك سمح صراحةً بإصلاح ملاحظات G6 الأمنية داخل backend source فقط بعد STOP السابق. هذا لا يفتح Gate جديدًا ولا يمنح production seal.
- **النطاق المنفّذ:** توقيع إثبات مرتبط بالطلب، رفض الحالات غير المسموحة، تحقق صارم من رابط Cloudinary، `Serializable` transaction مع conditional update، تدقيق نجاح/رفض بلا أسرار، وتقييد قراءة Payment بـ`OWNER/ADMIN`. التفاصيل الكاملة في `PROGRESS.md` §37.
- **خارج النطاق:** لا frontend، لا schema/migration/DB writes، لا Cloudinary dashboard/env، لا dependencies/cron، لا عقد API جديد، لا commit/push/deploy. المسارات القديمة غير المتعلقة تُرِكت.
- **ما انغلق:** `PROOF_UPLOADED` لم يعد يحصل على توقيع جديد؛ ربط الصورة بالطلب/token؛ منع صفّين متزامنين للإثبات على مستوى المصدر؛ AuditLog؛ منع `STAFF` من قائمة/تفاصيل Payment؛ حفظ القواعد في المولّد.
- **ما بقي محجوبًا:** الصورة نفسها ما زالت public `image/upload`. الخصوصية الحقيقية تحتاج frontend + endpoint توقيع تسليم + قرار Cloudinary؛ لم يُنفَّذ بديل أضعف. runtime/browser/real upload/production ما زالوا `NOT TESTED`.
- **الفحوص:** backend `npm run typecheck` exit 0؛ `npm run build` exit 0؛ `npx prisma validate` valid؛ `npm test` `5 files / 47 tests passed`؛ `git diff --check` بلا أخطاء محتوى.
- **Astra:** `PASS` للإصلاح المأذون؛ `ASTRA-PPS-05 resolved`؛ لا blocker جديد. ملاحظات منخفضة: denial audit best-effort، حماية الإنشاء بعد الرفض تعتمد على `SERIALIZABLE` لا قيد DB، ولا اختبار مزدوج المعاملات حقيقي.
- **القرار:** المالك اعتمد إصلاح المصدر وتحديثات §37 في 2026-11-23 (`تمم اعتمدته`)؛ هذا الاعتماد للمصدر/Astra لا يمنح production seal. G6 الكلي ما زال `BLOCKED / NO-GO` لحين بيئة مأذونة.
- **القرارات المُعتمدة معه:** بقاء private proof images محجوبة خارجيًا بلا workaround أضعف؛ بقاء G6 `NO-GO`؛ تثبيت قرار الإيصال (`sessionStorage` بلا `trackingToken` في URL/canonical/logs)؛ تجميد الاركتيكتشر الحالية (App Router، ترتيب `Providers/`، `store/baseApi.ts`، `interface/`، `components/Skelton/`، `hooks/`، `components/Animation/`)؛ لا تغيير decision أو ملف خارج نطاق التخطيط في هذه الجلسة.

⛔ STOP — SECURITY REMEDIATION OWNER-ACCEPTED — NO IMPLEMENTATION AUTHORIZED
