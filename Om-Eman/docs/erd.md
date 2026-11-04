# ERD Index

> These diagrams describe the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md` for its decisions and
> reporting views.

The ERD is split by domain because the full schema contains 133 models. Each
file is a standalone Mermaid `erDiagram`.

| Diagram | File | Scope |
| --- | --- | --- |
| Overview | [`erd.mmd`](./erd.mmd) | Core relationships across all domains |
| Catalog & inventory | [`erd-catalog-inventory.mmd`](./erd-catalog-inventory.mmd) | Products, packages, units, lots, stock, production |
| Procurement | [`erd-procurement.mmd`](./erd-procurement.mmd) | Suppliers, purchase orders, receipts, invoices, payments |
| Sales | [`erd-sales.mmd`](./erd-sales.mmd) | Cart, orders, invoices, payments, returns, shipping, fulfillment |
| Resellers & finance | [`erd-resellers-finance.mmd`](./erd-resellers-finance.mmd) | Reseller discovery, custody, ledger, reconciliation, accounts, expenses |
| Identity & content | [`erd-identity-content.mmd`](./erd-identity-content.mmd) | Employees, permissions, audit, loyalty, reviews, CMS, notifications |

## Rendering

- GitHub renders `.mmd` files with Mermaid support.
- VS Code: install a Mermaid preview extension.
- CLI: `npx @mermaid-js/mermaid-cli -i docs/erd.mmd -o docs/erd.svg`.

## Reading the diagrams

- `||--o{` = one-to-many.
- `||--o|` = one-to-zero-or-one.
- `}o--o|` = zero-or-one-to-zero-or-one.
- `||--|{` = one-to-one-or-more.
- Entity names use underscore notation for readability; the actual Prisma model
  names are PascalCase (e.g. `ORDER_ITEM` = `OrderItem`).

## Important boundaries

- `ResellerStockBalance` is **not** `StockBalance`.
- `ResellerStockMovement` is **not** `StockMovement`.
- `ResellerPackageAvailability` is **not** a reservation.
- `Invoice` is **not** `Payment`.
- `Order.status` is **not** `Order.paymentStatus`.
- `SupplierLedgerEntry` is **not** `FinancialAccountEntry`.
- `ResellerAccountEntry` is **not** `FinancialAccountEntry`.
