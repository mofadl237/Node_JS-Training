# حالة Backend المتجر (BACKEND_PROGRESS)

> آخر تحديث: 2026-11-13. يلخص تنفيذ `docs/STORE_BACKEND_TASKS.md` (B1–B16)
> وما تبقى، وما مطلوب من صاحب المتجر شخصيًا.

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

1. **تشغيل قاعدة البيانات**: `npx prisma dev` يفشل حاليًا بخطأ
   `EBUSY ... Temp\@prisma\cli-dev@latest-...` (عملية node قديمة قفلته).
   الحل: إغلاق عمليات node معلقة ثم إعادة التشغيل.
2. `npx prisma migrate dev --name init` (B1).
3. `npx prisma db execute --file prisma/mvp/manual_constraints.sql` (قيود + دوال `search_products` / `suggest_similar`).
4. `cp seed.config.example.json seed.config.json` ثم تعبئة القيم الحقيقية ثم `npm run db:seed`.
5. تشغيل الاختبارات Integration كاملة بدون skip + تجربة curl سريعة للـ endpoints.
6. إعداد Cloudinary الفعلي (حساب + تعبئة `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` في `.env`).

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
