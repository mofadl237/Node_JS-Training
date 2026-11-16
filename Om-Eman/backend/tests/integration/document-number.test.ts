import { beforeAll, describe, expect, it } from "vitest";
import { prisma, isDatabaseUp } from "../helpers/db.js";
import { allocateDocumentNumber } from "../../src/services/document-number.service.js";

const isDbUp = await isDatabaseUp();

// The 50-concurrent-calls proof: every caller receives a distinct number and
// the successful allocations form a gapless range starting from the previous
// counter value. The allocation runs inside the caller's transaction; if the
// document insert failed and rolled back, the number would be freed, which is
// exactly how the system stays gapless in production.
describe.skipIf(!isDbUp)("document numbering (integration)", () => {
  it("allocates 50 concurrent numbers with no duplicates and no gaps", async () => {
    const year = new Date().getFullYear();
    const existing = await prisma.documentSequence.findUnique({
      where: { documentType_year: { documentType: "TEST", year } },
      select: { nextNumber: true },
    });
    const start = existing?.nextNumber ?? 1;

    const results = await Promise.all(
      Array.from({ length: 50 }, () =>
        // 50 interactive transactions serialize on the same sequence row while
        // sharing a small connection pool; the default 5s timeout is too tight.
        prisma.$transaction(
          async (tx) => {
            return allocateDocumentNumber(tx, {
              documentType: "TEST",
              prefix: "TST",
            });
          },
          { timeout: 30_000, maxWait: 30_000 },
        ),
      ),
    );

    const unique = new Set(results);
    expect(unique.size).toBe(50);

    const numbers = results.map((value) => {
      const parts = value.split("-");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe("TST");
      expect(Number.parseInt(parts[1]!, 10)).toBe(year);
      return Number.parseInt(parts[2]!, 10);
    });

    numbers.sort((a, b) => a - b);
    expect(numbers[0]).toBe(start);
    for (let index = 1; index < numbers.length; index += 1) {
      expect(numbers[index]).toBe(numbers[index - 1]! + 1);
    }
  });

  it("pads numbers to the configured width", async () => {
    const number = await prisma.$transaction((tx) =>
      allocateDocumentNumber(tx, {
        documentType: "TEST",
        prefix: "TST",
        padding: 6,
      }),
    );
    const serial = number.split("-")[2]!;
    expect(serial).toMatch(/^\d{6}$/);
  });
});
