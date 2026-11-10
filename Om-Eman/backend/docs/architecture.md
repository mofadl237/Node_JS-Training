# Om Eman — Architecture & Schema Status

> **Note:** This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md` for its current scope.

## 1. Purpose

Om Eman is an Egyptian store for herbs, spices, natural products, and related
goods. This repository currently contains the **database schema**, the
**application bootstrap**, generated CRUD/auth endpoints, and CSV product
import. It does not contain a business-rule layer, frontend code, or production
seed data.

The schema is intentionally broader than a simple e-commerce store because the
business needs to model:

- finished products, raw materials, packaging, and bundles;
- multi-warehouse inventory with lots, expiry, reservations, and costing;
- purchasing, supplier invoices, landed cost, and supplier payables;
- orders, invoices, payments, refunds, returns, shipping, and carrier settlement;
- cash/bank accounts, expenses, and recurring expenses;
- authorized resellers with public discovery, custody stock, ledgers, and
  reconciliation;
- employees, roles, permissions, and a protected audit trail;
- content, notifications, and attachments.

## 2. Current status

| Area | Status |
| --- | --- |
| Prisma schema | Complete and valid (`prisma validate` passes) |
| Prisma client | Generated successfully |
| Express app bootstrap | Implemented with `/api` router |
| Server bootstrap | Implemented with graceful shutdown |
| Error handling | Central middleware + Prisma error mapper |
| Environment config | Implemented in `src/config/env.ts` (`IEnvConfig`) |
| Logging | Console + file (`logs/app.log`) with level filtering |
| Email config | Implemented in `src/config/email.ts` |
| Swagger spec | Implemented in `src/config/swagger.ts`; UI mounted at `/api/docs` |
| ERD | Written as Mermaid diagrams under `docs/` |
| Business API endpoints | Generated CRUD + Auth + CSV product import; business-rule layer not implemented |
| Seed data | **Not created** |
| Cron jobs / background workers | **Not implemented yet** |

Active schema size: **38 models** and **25 enums**. The archived full schema has
**133 models** and **72 enums** under `prisma/legacy/full-schema.prisma`.

## 3. Stack

- Node.js + TypeScript (strict)
- Express 5
- Prisma 7 + `@prisma/adapter-pg` + PostgreSQL
- Zod (request validation)
- JWT + bcrypt (employee authentication and role checks)
- Nodemailer (configured, not used by endpoints yet)
- node-cron (planned for scheduled tasks)
- Swagger (`swagger-ui-express` mounted at `/api/docs`; spec built from generated
  module metadata)
- CSV import (`csv-parser` + `multer` memory storage; 5 MB limit)

## 4. Directory layout

```text
Om-Eman/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts                  # Express app: security, logging, error handling
│   ├── server.ts               # HTTP server, Prisma connect, graceful shutdown
│   ├── config/
│   │   ├── env.ts
│   │   ├── prisma.ts
│   │   ├── email.ts
│   │   └── swagger.ts
│   ├── enums/
│   │   ├── EEnvironment.ts
│   │   └── ELogLevel.ts
│   ├── interfaces/
│   │   ├── email/IEmailMessage.ts
│   │   └── logger/ILogger.ts
│   ├── middlewares/
│   │   └── error.middleware.ts
│   ├── shared/
│   │   ├── errors.ts
│   │   └── errors/prisma-error.mapper.ts
│   ├── utils/logger/index.ts
│   ├── jobs/                   # reserved for scheduled jobs
│   └── modules/                # reserved for business modules
├── logs/
│   ├── .gitkeep
│   └── app.log                 # runtime log file (ignored by Git)
├── docs/
│   ├── erd.mmd
│   ├── erd-*.mmd
│   ├── architecture.md
│   ├── entity-inventory.md
│   ├── integrity-rules.md
│   ├── indexes-and-queries.md
│   ├── migration-plan.md
│   ├── business-rule-coverage.md
│   ├── reseller-module.md
│   └── assumptions.md
├── prisma7.config.ts
├── package.json
└── tsconfig.json
```

## 5. Architectural principles

### 5.1 Schema-first, business logic later

The current task deliberately stops at the persistence model and application
bootstrap. Services, controllers, validation schemas, and routes will be added
later without changing the foundational conventions.

### 5.2 Decimal only for money and quantities

All monetary values, quantities, conversion factors, tax rates, and stock
balances use `Decimal` with explicit precision. `Float` is never used for
business values.

### 5.3 Identity vs. package vs. inventory item

- `Product` is the commercial identity.
- `ProductPackage` is the sellable/stockable package (SKU, barcode, size).
- `InventoryItem` is the stock-keeping unit.
- A package may point to one inventory item; raw materials and packaging have
  their own inventory items without a product package.

This separation prevents a single “product” row from carrying incompatible
selling, purchasing, and inventory semantics.

### 5.4 Immutable ledgers and append-only history

Stock movements, supplier ledger entries, reseller account entries, financial
account entries, status histories, and audit logs are append-only. Corrections
are made with reversal or adjustment records, not by editing history.

### 5.5 Historical snapshots

Orders, invoices, reviews, and fulfillment records keep snapshots of names,
prices, tax rates, addresses, and costs so later catalog changes cannot rewrite
history.

### 5.6 Separate status dimensions

Order status, payment status, shipment status, return status, and reseller
availability are separate fields/enums. They must not be collapsed into one
“status” field.

### 5.7 Backend-enforced permissions and auditability

Roles and permissions are stored in the database, but authorization is enforced
in the backend. `AuditLog` is protected and should not be editable through
normal APIs. Sensitive actions must write an audit entry in the same transaction
as the business change.

### 5.8 Reseller stock is not Om Eman stock by default

Reseller custody stock is tracked in dedicated reseller tables. It must not be
included in Om Eman inventory valuation or FIFO unless an explicit ownership /
consignment workflow moves it into Om Eman inventory.

## 6. Domain modules

| Module | Main models |
| --- | --- |
| Identity & access | `Employee`, `Role`, `Permission`, `RolePermission`, `EmployeeRole`, `LoginAttempt`, `AuditLog` |
| Customers | `Customer`, `CustomerAddress`, `CustomerActivityEvent`, `WishlistItem` |
| Cart | `Cart`, `CartItem`, `CartItemBundleComponent` |
| Loyalty | `LoyaltyLevel`, `CustomerLoyalty`, `LoyaltyQualification`, `LoyaltyEvent` |
| Reviews | `ProductReview`, `StoreReview`, `ReviewModerationHistory` |
| Catalog | `Category`, `Subcategory`, `Product`, `ProductSubcategory`, `ProductImage`, `ProductAlias`, `ProductPackage`, `ProductBundleComponent`, `ProductAttribute`, `ProductAttributeValue` |
| Units & settings | `UnitOfMeasure`, `UnitConversion`, `Currency`, `TaxRate`, `SystemSetting`, `DocumentSequence` |
| Warehouses & inventory | `Warehouse`, `WarehouseLocation`, `InventoryItem`, `InventoryItemCostReference`, `ReorderPolicy`, `InventoryLot`, `StockBalance`, `StockMovement`, `StockMovementLine`, `StockReservation`, `StockTransfer`, `StockTransferLine`, `StockCountSession`, `StockCountLine`, `StockLoss`, `ExpiryAlert` |
| Production | `ProductionBatch`, `ProductionInputLine`, `ProductionOutputLine`, `ProductionLossLine` |
| Procurement | `Supplier`, `SupplierContact`, `SupplierItem`, `PurchaseOrder`, `PurchaseOrderLine`, `SupplierInvoice`, `SupplierInvoiceLine`, `PurchaseAdditionalCost`, `LandedCostAllocation`, `GoodsReceipt`, `GoodsReceiptLine`, `SupplierInvoiceDiscrepancy`, `SupplierReturn`, `SupplierReturnLine`, `SupplierLedgerEntry`, `SupplierPayment`, `SupplierPaymentAllocation` |
| Sales | `Order`, `OrderItem`, `OrderItemBundleComponent`, `OrderStatusHistory`, `OrderDiscount`, `OrderAddressSnapshot`, `Invoice`, `InvoiceLine` |
| Payments & returns | `Payment`, `PaymentAttempt`, `PaymentProof`, `Refund`, `CustomerReturn`, `CustomerReturnItem` |
| Shipping | `ShippingCarrier`, `ShippingTariff`, `Shipment`, `ShipmentStatusHistory`, `ShipmentDeliveryAttempt`, `CarrierRemittance`, `CarrierRemittanceLine` |
| Fulfillment | `OrderFulfillment`, `OrderFulfillmentAllocation`, `ResellerFulfillmentConfirmation` |
| Promotions | `Promotion`, `PromotionTarget`, `Coupon`, `PromotionRedemption` |
| Finance | `FinancialAccount`, `FinancialAccountEntry`, `FinancialTransfer`, `ExpenseCategory`, `Expense`, `ExpensePayment`, `RecurringExpense`, `RecurringExpenseOccurrence` |
| Resellers | `Reseller`, `ResellerAddress`, `ResellerProduct`, `ResellerPackageAvailability`, `ResellerAvailabilityHistory`, `ResellerSupply`, `ResellerSupplyLine`, `ResellerStockMovement`, `ResellerStockBalance`, `ResellerAccountEntry`, `ResellerPayment`, `ResellerPaymentAllocation`, `ResellerStockReconciliation`, `ResellerStockReconciliationLine` |
| Content | `HomepageSection`, `Banner`, `StaticPage`, `Faq`, `Article` |
| Notifications & files | `Notification`, `NotificationDeliveryAttempt`, `Attachment`, `AttachmentVersion` |

## 7. Request/transaction shape (planned)

```text
HTTP request
  -> route
  -> authentication middleware
  -> permission middleware
  -> Zod validation middleware
  -> controller
  -> service
  -> Prisma transaction
       -> business writes
       -> stock / ledger entries
       -> audit log
  -> response
```

The current `src/app.ts` wires security, body parsing, logging, the `/api`
router, Swagger UI, 404 handling, and error handling. `src/modules/index.ts`
mounts Auth, 38 generated CRUD modules, and CSV product import under `/api`;
business rules still need a dedicated layer.

## 8. What is intentionally missing

- No business-rule layer beyond generic CRUD (transactions, audit, transitions,
  totals, snapshots).
- No infrastructure endpoints (`/health` or `/`); Swagger UI is mounted at
  `/api/docs`.
- No refresh-token or fine-grained permission flow.
- No seed or fake data.
- No payment gateway integration.
- No email templates or cron jobs.
- No frontend.
- No generated migration yet; the migration plan is documented in
  `docs/migration-plan.md`.
