# Om Eman MVP Schema

The MVP schema is the active Prisma schema at `prisma/schema.prisma`. The old
133-model schema is archived at `prisma/legacy/full-schema.prisma` and is not used
by Prisma CLI, the application, or migrations.

This directory contains the MVP manual SQL, dry-run SQL, and adoption notes.

## Status

| Item | Value |
| --- | --- |
| Active schema | `prisma/schema.prisma` (MVP) |
| Legacy schema | `prisma/legacy/full-schema.prisma` (archived, not used) |
| Validation | `npx prisma validate` passes |
| Models | 38 |
| Enums | 25, all prefixed with `E` |
| Manual SQL | `prisma/mvp/manual_constraints.sql` |
| Dry run | `prisma/mvp/dry-run.sql` |
| Arabic helper | `src/utils/arabic/normalize-arabic.ts` |
| Migration | Not created |
| Seed | Not created |

## Files

| File | Purpose |
| --- | --- |
| `../schema.prisma` | Active MVP Prisma models, enums, relations, and indexes expressible in Prisma |
| `../legacy/full-schema.prisma` | Archived full schema; reference only, never point Prisma at it |
| `manual_constraints.sql` | PostgreSQL extensions, Arabic search functions, triggers, CHECK constraints, trigram indexes, and reporting views |
| `dry-run.sql` | Idempotent sample data plus search/view smoke tests |
| `../../src/utils/arabic/normalize-arabic.ts` | TypeScript Arabic normalization and tokenization used by application services |

## Commands

```bash
# Format, validate, and generate the active MVP schema.
npx prisma format
npx prisma validate
npx prisma generate

# Apply the manual PostgreSQL objects after the tables and enum types exist.
npx prisma db execute --file prisma/mvp/manual_constraints.sql

# Optional smoke test on an empty database.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f prisma/mvp/dry-run.sql
```

`prisma7.config.ts` points to `prisma/schema.prisma` and `prisma/migrations`, so
the MVP schema is the default for Prisma CLI commands. Do not change the config
to point at `prisma/legacy/full-schema.prisma`.

Before creating the first migration, confirm that the target database is empty
or safe to migrate. Do not run the MVP migration against a database that already
contains the legacy full schema without a backup and an explicit migration plan.

## Changelog From The Full Schema

| Area | Full schema | MVP |
| --- | --- | --- |
| Models | 133 | 38 |
| Enums | 72 | 25, prefixed with `E` |
| Inventory | Warehouses, lots, FIFO, stock movements | Removed; manual `ProductPackage.stockStatus` |
| Purchasing | Suppliers, POs, receipts, supplier invoices | Removed |
| Returns/refunds | Returns, refunds, return dispositions | Removed; cancel/void only |
| Finance | Accounts, entries, expenses, transfers | Removed |
| Resellers | Profiles, custody stock, ledgers, settlements | Removed |
| Loyalty/reviews | Loyalty events, reviews | Removed |
| RBAC | Roles, permissions, joins | Simple `EEmployeeRole` enum |
| Catalog | Attributes, articles, many inventory joins | Categories, subcategories, products, packages, images, aliases, bundles |
| Search | Basic names | Normalized names, aliases, synonyms, search logs, trigram indexes |
| Orders | Orders, returns, fulfillment | Orders, invoices, payments, shipments, snapshots |
| Promotions | Promotions, coupons, redemptions | Same core, with `PromotionRedemption` as the single discount source |
| Marketing | Not present | Meta Pixel/CAPI events, consent-aware statuses |
| Content | Articles, banners, FAQs, attachments | Banners, static pages, FAQs |
| Notifications | Multi-recipient notification system | Customer/employee notifications |
| Settings | Currency, tax, units, sequences | `SystemSetting` JSON plus `DocumentSequence` |

## Confirmed Decisions

1. **Money is `Decimal(18, 4)`.** Never `Float`. The only currency is EGP,
   stored in `SystemSetting`.
2. **IDs are `cuid()` strings.** No auto-increment business keys.
3. **Explicit `onDelete` everywhere.** History and financial records use
   `Restrict`; optional relations use `SetNull`; owned children use `Cascade`.
4. **Naming:** every enum starts with `E`; every interface/type starts with `I`.
5. **No inventory module.** Availability is a manual `EStockStatus` on each
   `ProductPackage`; bundles are out of stock if any component is out of stock
   (application rule).
6. **No returns or refunds.** Cancellation and invoice voiding are the MVP
   correction paths.
7. **`Payment` is the source of truth.** `Order.paymentStatus` is a cached
   derived value updated in the same transaction.
8. **Customer statistics are cached.** `Customer.completedOrdersCount`,
   `totalSpent`, `firstOrderAt`, and `lastOrderAt` come from delivered orders.
   `customer_order_stats_drift` audits them.
9. **`PromotionRedemption` is the single source** for promotion usage and
   display. There is no `OrderDiscount` model.
10. **Bundles are predefined.** A bundle is a `Product` with
    `productType = PREDEFINED_BUNDLE` and exactly one package. Components carry
    no price. Nested bundles are rejected by a SQL trigger.
11. **Arabic search is alias/synonym based.** `normalize_arabic` preserves the
    definite article `ال`; article-insensitive matching is opt-in.
12. **`Product.searchText` is maintained by application services** whenever
    product names, aliases, keywords, brand, category, or subcategory names
    change.
13. **Meta CAPI token is environment-only.** It is never stored in
    `SystemSetting`.
14. **Notifications must target exactly one recipient.** The SQL CHECK enforces
    `customerId` for `CUSTOMER` and `employeeId` for `EMPLOYEE`.

## Manual SQL Contents

`manual_constraints.sql` adds only objects Prisma does not manage:

- Extensions: `pg_trgm`, `unaccent`.
- `normalize_arabic(text, boolean)` as `IMMUTABLE`.
- GIN trigram indexes on `Product.searchText`,
  `Product.searchNameArNormalized`, `Product.searchNameEnNormalized`,
  `ProductAlias.normalizedAlias`, and `SearchSynonym.normalizedTerm`.
- `search_products(q, lim)` with exact, prefix, synonym-expanded, and trigram
  tiers. It only returns `ACTIVE` products with at least one published and
  active package, and uses `ProductAlias.weight` plus `isFeatured` as
  tie-breakers.
- `suggest_similar(q, lim)` for typo suggestions.
- CHECK constraints for quantities, non-negative money, compare-at price,
  notification recipients, promotion targets, date ranges, shipping ETA ranges,
  promotion audience ranges, and confirmed payment timestamps.
- Append-only triggers for `OrderStatusHistory`, `ShipmentStatusHistory`, and
  `AuditLog`.
- Nested-bundle rejection trigger for `ProductBundleComponent`.
- Reporting views: `customer_order_stats_drift`, `cod_awaiting_settlement`,
  `bundle_pricing`, `report_sales_daily`, `report_top_products`,
  `report_top_products_monthly`, `report_customers_summary`,
  `report_customer_segments`, `report_payments_pending`,
  `report_promotions_performance`, `report_zero_result_searches`, and
  `report_top_searches`.

## Open Questions

1. Should `PromotionRedemption`, `InvoiceLine`, and `OrderAddressSnapshot` stay
   strictly append-only, or should an owner correction path be allowed? The
   current design requires void/reissue instead of edits.
2. Is one active cart per customer too strict? The merge flow must close or
   merge the old cart before creating a new one.
3. Should `Customer.email` have a case-insensitive unique index for non-null
   values? The current schema only indexes it.
4. Should a COD `Payment` row be created when the order is placed, when the
   shipment is delivered, or both?
5. Should `Product.searchText` be maintained by application services or by a
   database trigger? The current plan is application services.
6. How long should `prisma/legacy/full-schema.prisma` be retained? Keep it as
   reference until the MVP migration and first release are stable.
7. Are the payment proof and rejection CHECK constraints compatible with the
   exact owner workflow?
8. Should `unaccent` remain fixed, or should the project own a versioned
   dictionary?

## Recommended Next Steps

1. Review this schema with the store owner and confirm the removed modules.
2. Create the initial MVP migration and apply it to a fresh database.
3. Run `manual_constraints.sql` and verify the triggers, indexes, functions, and
   views.
4. Run `dry-run.sql` on the fresh database.
5. Wire `normalizeArabic` and `tokenize` into catalog, search, and synonym
   services.
6. Implement `Product.searchText` maintenance whenever product names, aliases,
   categories, or keywords change.
7. Seed only real settings, categories, synonyms, and aliases. Do not seed fake
   customers, orders, or products in production.
8. Build authentication, then catalog, then cart/order/payment/shipping APIs.
9. Review Arabic search indexes with `EXPLAIN ANALYZE` after real data exists.
