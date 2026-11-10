# Indexes & Query Plan

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/manual_constraints.sql` for its
> indexes.

Indexes in the schema are chosen for the operational queries below. Additional
indexes should be added only with evidence from real query plans (`EXPLAIN
ANALYZE`) and with awareness of write cost.

## 1. Public reseller discovery

Business filters:

- reseller is active and authorized;
- listing is public;
- authorization window contains now;
- address is current, public, and valid;
- optional governorate/city/district;
- optional nearby search by latitude/longitude;
- optional product/package assortment and availability.

Existing indexes:

```prisma
// Reseller
@@index([status, listingStatus, publicVisibility])
@@index([businessName])

// ResellerAddress
@@index([resellerId, isCurrent])
@@index([governorate, city, district])
@@index([latitude, longitude])

// ResellerProduct
@@unique([resellerId, productId])
@@index([productId, status, isActive])
@@index([resellerId, isActive])

// ResellerPackageAvailability
@@unique([resellerProductId, productPackageId])
@@index([productPackageId, availabilityStatus])
@@index([lastConfirmedAt])
```

Recommended query shape:

```sql
SELECT r.id, r.business_name, a.city, a.district, a.latitude, a.longitude
FROM "Reseller" r
JOIN "ResellerAddress" a ON a."resellerId" = r.id
WHERE r.status = 'ACTIVE'
  AND r."listingStatus" = 'PUBLIC'
  AND r."publicVisibility" = true
  AND (r."authorizationStart" IS NULL OR r."authorizationStart" <= now())
  AND (r."authorizationEnd" IS NULL OR r."authorizationEnd" >= now())
  AND a."isCurrent" = true
  AND a."isPublic" = true
  AND (a."validTo" IS NULL OR a."validTo" >= now())
  AND (:city IS NULL OR a.city = :city)
  AND (:district IS NULL OR a.district = :district)
ORDER BY a.city, a.district, r."businessName";
```

Notes:

- The current schema indexes support the status/listing/visibility filter and
  the location filter separately. If reseller discovery becomes a hot path, add
  a composite index such as
  `@@index([status, listingStatus, publicVisibility, authorizationStart, authorizationEnd])`.
- For true radius search, use PostGIS in a later migration; the current
  `(latitude, longitude)` index only helps bounding-box queries. A bounding-box
  prefilter followed by Haversine distance in SQL is acceptable for small data.
- Never scan reseller addresses without the `isCurrent` / `isPublic` filters.

## 2. Reseller assortment and availability lookup

```sql
SELECT rp.*, rpa.*
FROM "ResellerProduct" rp
JOIN "ResellerPackageAvailability" rpa
  ON rpa."resellerProductId" = rp.id
WHERE rp."resellerId" = $1
  AND rp."isActive" = true
  AND rp.status = 'LISTED';
```

Use `@@unique([resellerId, productId])` for idempotent assortment updates and
`@@unique([resellerProductId, productPackageId])` for availability upserts.

## 3. Catalog and product search

Existing indexes:

```prisma
// Product
@@index([primarySubcategoryId, status])
@@index([productType, status])
@@index([status, publishedAt])
@@index([isFeatured, status])

// ProductPackage
@@index([productId, isActive])
@@index([isPublished, isActive])
@@index([taxRateId])

// ProductAlias
@@unique([normalizedAlias, language])
@@index([productId])
```

Search strategy:

1. Exact/prefix search on `Product.searchNameArNormalized`,
   `Product.searchNameEnNormalized`, and `ProductAlias.normalizedAlias`.
2. Fallback to `ILIKE`/trigram search only after measuring performance.
3. Consider PostgreSQL `pg_trgm` GIN indexes on normalized name columns if
   fuzzy search is required. This is a future migration, not part of the current
   schema.

## 4. Inventory and FIFO

Existing indexes:

```prisma
// InventoryLot
@@unique([inventoryItemId, lotNumber])
@@index([inventoryItemId, status, expiryDate])
@@index([warehouseId, locationId, status])
@@index([receivedAt])

// StockBalance
@@unique([inventoryItemId, locationId])
@@index([warehouseId, locationId])

// StockMovementLine
@@index([stockMovementId])
@@index([inventoryItemId, lotId])
@@index([warehouseId, locationId])

// StockReservation
@@index([orderId, status])
@@index([inventoryItemId, warehouseId, locationId, status])
```

FIFO query for available lots:

```sql
SELECT *
FROM "InventoryLot"
WHERE "inventoryItemId" = $1
  AND "warehouseId" = $2
  AND status = 'AVAILABLE'
  AND "remainingQuantity" > 0
ORDER BY "receivedAt" ASC, "createdAt" ASC
FOR UPDATE;
```

Always lock and re-check `remainingQuantity` inside the transaction before
issuing stock.

## 5. Order operations

Existing indexes:

```prisma
// Order
@@index([customerId, placedAt])
@@index([status, placedAt])
@@index([paymentStatus, placedAt])
@@index([deliveredAt])

// OrderItem
@@index([orderId])
@@index([productId])
@@index([productPackageId])

// Payment
@@index([orderId, status])
@@index([confirmedAt])
```

Common queries:

- customer order history: `(customerId, placedAt desc)`;
- operations queue: `(status, placedAt)`;
- collections queue: `(paymentStatus, placedAt)`;
- product sales history: `OrderItem(productId)` joined to `Order(placedAt)`.

## 6. Supplier and reseller ledgers

```prisma
// SupplierLedgerEntry
@@index([supplierId, occurredAt])
@@index([supplierId, dueDate])
@@index([supplierInvoiceId])

// SupplierPayment
@@index([supplierId, paymentDate])
@@index([financialAccountId])

// ResellerAccountEntry
@@index([resellerId, occurredAt])
@@index([resellerId, dueDate])
@@index([resellerSupplyId])

// ResellerPayment
@@index([resellerId, paymentDate])
@@index([status])

// ResellerStockMovement
@@index([resellerId, inventoryItemId, occurredAt])
@@index([resellerSupplyId])
@@index([movementType, occurredAt])
```

Ledger balance queries should aggregate entries in a date range, not store a
mutable “balance” field as the source of truth. Cached balances may be added
later if performance requires it, with reconciliation jobs.

## 7. Financial reporting

```prisma
// FinancialAccountEntry
@@index([accountId, occurredAt])
@@index([entryType, occurredAt])
@@index([referenceType, referenceId])

// Expense
@@index([categoryId, expenseDate])
@@index([status, dueDate])
@@index([recurringExpenseId])
```

Reports should filter by `occurredAt`/`expenseDate` and aggregate Decimal values
in the database or in a reporting service.

## 8. Audit and security

```prisma
// AuditLog
@@index([module, createdAt])
@@index([entityType, entityId])
@@index([actorEmployeeId, createdAt])
@@index([createdAt])

// LoginAttempt
@@index([email, createdAt])
@@index([employeeId, createdAt])
```

Retention and archival are service-level policies, not schema constraints.
