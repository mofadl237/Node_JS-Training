# Day7-caching implementation (restaurant API)

## Structure (mirrors Day6-DB)
- `src/config/` → `env.ts`, `prisma.ts`, `redis.ts`
- `src/interfaces/` → shared + `user/product/offer/order` contracts
- `src/shared/` → `errors.ts`, `validate.ts`, `error.middleware.ts`, `request.middleware.ts`, `list-query.ts`, `logger.ts`, `cache.ts`, `offer-pricing.ts`
- `src/services/` → business logic (Prisma + Redis cache + transactions)
- `src/controllers/` → thin HTTP handlers (parse + delegate)
- `src/routers/` → route registration
- `src/app.ts` → middleware + routes + health + 404 + error handler
- `src/server.ts` → bootstrap + graceful shutdown + unhandled/error handlers
- `src/types/express.d.ts` → `req.requestId`

## Production/API behaviour
- Central `AppError` + `errorHandler` maps Prisma errors (P2025/P2002/P2003/validation) and SyntaxError JSON; unknown errors logged only, no internals leaked.
- `notFoundHandler` for unmatched routes.
- `requestLogger` sets/reuses `x-request-id`, attaches to response headers and logs, passed into errors.
- Helmet + CORS; JSON body limit 1mb.
- Graceful shutdown (SIGINT/SIGTERM) with timeouts, disconnects Prisma/Redis, closes logs.
- Health: `GET /` and `GET /health`; readiness `GET /health/ready` (DB required, Redis optional/degraded).
- File-based JSON logging: `logs/app-YYYY-MM-DD.log` and `logs/error-YYYY-MM-DD.log` (daily rotation by filename). Console logs only in non-production. Falls back safely if disk fails.
- `package.json` scripts: dev/build/start/typecheck/prisma:generate/migrate/deploy/studio/db:push/db:format; type=module; tsconfig compiles `src/` to `dist/` with strict checks (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- `.gitignore` covers `node_modules/`, `dist/`, `logs/`, `*.log`, `.env*` (keep `.env.example`), generated Prisma client.

## Schema (Prisma 7)
Enums `OfferType { PERCENTAGE, BUNDLE }`, `OrderStatus { PENDING, CONFIRMED, PREPARING, COMPLETED, CANCELLED }`.
Models: `User`, `Product`, `Offer`, `OfferItem`, `Order`, `OrderItem`, `OrderOffer` with indexes/relations/cascades. Money stored as `Decimal(12,2)`. Ids are `BigInt` serialized as strings in API DTOs.

## Modules
### Products
CRUD + filtering (search/category/isActive/inStock/minPrice/maxPrice) + pagination + sorting. DTO includes `price`, `finalPrice` (after best active PERCENTAGE offer), `activeOffer`. Cached in Redis (`products:list:*`, `products:item:*`); writes invalidate product + offer caches.

### Offers
Two types:
- `PERCENTAGE` → one product + `discountPercent` (0.01-100). Only allowed fields `productId`, `discountPercent`.
- `BUNDLE` → `>=2` products in `items` (each with quantity) + unified `bundlePrice` < sum of item prices. Cannot mix percentage/bundle fields.

Validation enforces type-specific rules on create/update. DTO returns items with product info, `originalBundlePrice`, `savings`, and `finalProductPrice` for percentage offers. Caching invalidated on writes; offer writes also invalidate product caches.

### Orders
Create order from `userId` + `items[]` (each `{productId, quantity}`). 
Pricing/logic:
- Validate user exists, products active and have stock.
- Apply best active PERCENTAGE offer per product (highest discount wins); track applied percentage offers.
- Find best applicable BUNDLE offer whose all products are present with required quantities and products active; bundle discount = min(bundle savings, subtotal - item discounts). Only best bundle applied.
- All money via `Prisma.Decimal`, rounded to 2 places (`ROUND_HALF_UP`).
- Stock decremented atomically with `updateMany` (`stock >= qty`) inside transaction to prevent oversell.
- Persist `Order` (subtotal/discountAmount/totalAmount), `OrderItem` (originalUnitPrice, unitPrice after percentage, discountAmount), `OrderOffer` for applied offers. Order not deleted; stock restored on `CANCELLED`.
Status transitions validated: PENDING->CONFIRMED|CANCELLED, CONFIRMED->PREPARING|CANCELLED, PREPARING->COMPLETED|CANCELLED, others terminal.

## Redis caching
- Optional; disabled if `REDIS_URL` missing or Redis down (API still works, logs + skips cache).
- Keys namespaced with SHA1 of query payload; item keys by id.
- Prefix-based invalidation via SCAN. Invalidation: products<->offers cross-invalidated because of price/offer coupling.

## How to run
1. Set `DATABASE_URL` (and optionally `REDIS_URL`) in `.env`.
2. `npm install` (deps already present in node_modules)
3. `npx prisma migrate dev` / `npx prisma migrate deploy`
4. `npm run dev` (tsx) or `npm run build && npm start`.
