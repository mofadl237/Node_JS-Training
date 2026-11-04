# Assumptions & Open Business Decisions

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md`.

The schema avoids inventing business values. The following assumptions and
open decisions must be confirmed before implementing services.

## Confirmed modeling decisions

1. **Currency default is EGP.** `Currency` supports more, but EGP is the default
   in environment configuration and expected base currency.
2. **Arabic is the primary content language.** Most names have `nameAr` required
   and `nameEn` optional. English fields exist for bilingual content.
3. **Money uses `Decimal(18,4)`.** Tax rates use `Decimal(9,6)`. Conversion
   factors use `Decimal(18,8)`.
4. **Stock is lot-based.** Even if the business does not use expiry for every
   item, `InventoryLot` is the costing/quantity layer.
5. **Reseller custody stock is separate.** It is not Om Eman inventory unless an
   explicit ownership transfer occurs.
6. **Availability is not reservation.** `ResellerPackageAvailability` is a
   reported/confirmed signal only.
7. **Historical records are immutable.** Reversals/adjustments replace edits.
8. **Soft archival, not hard deletion.** Products use `status`/`archivedAt`;
   history references should use `Restrict` or `SetNull` rather than cascade
   deletes.
9. **No fake seed data.** Production data must not be fabricated.
10. **Audit logs are protected.** No normal CRUD endpoint should update/delete
    them.

## Open business decisions

| Topic | Why it is open | Suggested resolution |
| --- | --- | --- |
| VAT/tax rate | Egyptian tax treatment may vary by product | Configure `TaxRate` rows explicitly; never hardcode |
| Shipping tariff rules | By governorate, weight, order value, or carrier | Use `ShippingTariff`; define rule evaluation in service |
| Reseller commission model | Percentage, fixed, tiered, or none | Add configuration/snapshot fields if needed; do not assume |
| Wholesale price lists | May differ per reseller/volume | Add price-list tables or `agreedPrice` snapshots when confirmed |
| Credit terms/due dates | May be reseller-specific | Use explicit `dueDate` values from business input; no defaults |
| Consignment ownership | Who owns stock at reseller? | Encode in `ResellerTransactionType` and document each flow |
| Return window | Policy not specified | Store policy in `SystemSetting`; enforce in service |
| Loyalty earning rules | Points per EGP, tier rules | Define in `LoyaltyLevel`/settings and service |
| Low-stock thresholds | Per item/warehouse | `ReorderPolicy` |
| Expiry warning windows | Per category/item | `SystemSetting` + job logic |
| COD reconciliation | Carrier remits cash after delivery | `CarrierRemittance` + financial entries |
| Reseller public fields | Phone, exact address, map pin | Control with `publicVisibility`, `ResellerAddress.isPublic` |
| Radius search | Need distance ranking | PostGIS or bounding-box + Haversine; current schema stores GPS only |
| Multi-currency accounting | Rates and revaluation | Add exchange-rate history before enabling |
| Employee deletion | Audit/history preservation | Deactivate, never delete |
| Customer deletion | Privacy vs. order history | Anonymize, keep order snapshots |
| Attachment storage | Local, S3, or other | Store metadata now; add storage provider config later |
| Notification providers | Email/SMS/WhatsApp | `NotificationChannel` + provider fields |
| Audit retention | Legal/operational | Define retention/archive policy |
| Numbering format | Prefix/year/padding | `DocumentSequence` per type/year |

## Non-goals for the current task

- No business-rule layer beyond generated CRUD.
- No refresh-token or fine-grained permission flow.
- No payment gateway.
- No carrier integration.
- No frontend.
- No production seed data.
- No commission/credit defaults.
- No migration executed against a real database.

## Data-quality rules for future seed/setup

When setup data is eventually created, it should be explicit and minimal:

- one base currency (EGP);
- units actually used (kg, g, piece, box, etc.);
- tax rates confirmed by the business;
- document sequences for each business document type;
- at least one warehouse and location;
- roles/permissions required by the first release;
- no fake customers, orders, payments, or stock.
