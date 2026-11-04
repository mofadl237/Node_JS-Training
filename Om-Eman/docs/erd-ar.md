# مخططات ERD — Om Eman

تم تقسيم مخطط العلاقات إلى عدة ملفات Mermaid لأن الـ Schema يحتوي على 133
model. كل ملف يمكن عرضه مباشرة في GitHub أو VS Code.

| المخطط | الملف | النطاق |
| --- | --- | --- |
| نظرة عامة | [`erd.mmd`](./erd.mmd) | العلاقات الأساسية بين كل المجالات |
| الكتالوج والمخزون | [`erd-catalog-inventory.mmd`](./erd-catalog-inventory.mmd) | المنتجات، العبوات، الوحدات، اللوطات، الأرصدة، الإنتاج |
| المشتريات | [`erd-procurement.mmd`](./erd-procurement.mmd) | الموردون، أوامر الشراء، الاستلام، فواتير الموردين، المدفوعات |
| المبيعات | [`erd-sales.mmd`](./erd-sales.mmd) | السلة، الطلبات، الفواتير، المدفوعات، المرتجعات، الشحن، الوفاء |
| الريسلر والمالية | [`erd-resellers-finance.mmd`](./erd-resellers-finance.mmd) | اكتشاف الريسلر، العهدة، الدفتر، التسويات، الحسابات، المصروفات |
| الهوية والمحتوى | [`erd-identity-content.mmd`](./erd-identity-content.mmd) | الموظفون، الصلاحيات، التدقيق، الولاء، التقييمات، المحتوى، الإشعارات |

## قراءة الرموز

- `||--o{` علاقة واحد إلى متعدد.
- `||--o|` علاقة واحد إلى صفر أو واحد.
- `}o--o|` علاقة صفر أو واحد إلى صفر أو واحد.
- `||--|{` علاقة واحد إلى واحد أو أكثر.
- أسماء الكيانات في المخططات تستخدم `_` للقراءة فقط، أما أسماء Prisma الفعلية
  فهي PascalCase، مثال: `ORDER_ITEM` = `OrderItem`.

## حدود مهمة يجب عدم الخلط بينها

- `ResellerStockBalance` ليست `StockBalance`.
- `ResellerStockMovement` ليست `StockMovement`.
- `ResellerPackageAvailability` ليست حجزًا ولا التزامًا.
- `Invoice` ليست `Payment`.
- `Order.status` ليست `Order.paymentStatus`.
- `SupplierLedgerEntry` ليست `FinancialAccountEntry`.
- `ResellerAccountEntry` ليست `FinancialAccountEntry`.

## عرض المخططات

```bash
npx @mermaid-js/mermaid-cli -i docs/erd.mmd -o docs/erd.svg
```

أو استخدم إضافة Mermaid Preview في VS Code.
