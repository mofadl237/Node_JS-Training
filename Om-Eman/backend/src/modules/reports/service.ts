import { prisma } from "../../config/prisma.js";

// Reads the reporting views created by prisma/mvp/manual_constraints.sql.
// All of them are admin-only and read-only: no business logic here, just
// typed access to precomputed SQL.
export class ReportsService {
  async salesDaily() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_sales_daily" LIMIT 400
    `;
  }

  async topProducts() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_top_products" LIMIT 100
    `;
  }

  async topProductsMonthly() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_top_products_monthly" LIMIT 200
    `;
  }

  async customersSummary() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_customers_summary" LIMIT 500
    `;
  }

  async customerSegments() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_customer_segments" LIMIT 500
    `;
  }

  async paymentsPending() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_payments_pending" LIMIT 200
    `;
  }

  async promotionsPerformance() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_promotions_performance" LIMIT 200
    `;
  }

  async zeroResultSearches() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_zero_result_searches" LIMIT 200
    `;
  }

  async topSearches() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "report_top_searches" LIMIT 200
    `;
  }

  async codAwaitingSettlement() {
    return prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT * FROM "cod_awaiting_settlement" LIMIT 200
    `;
  }
}
