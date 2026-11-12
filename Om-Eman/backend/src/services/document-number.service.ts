import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { BadRequestError } from "../shared/errors.js";

export type ITransactionClient = Prisma.TransactionClient;

export interface IDocumentNumberConfig {
  // Document type key in DocumentSequence, e.g. "ORDER" or "INVOICE".
  documentType: string;
  // Only used when the sequence row for (documentType, year) does not exist yet.
  prefix?: string | null;
  // Only used when the sequence row does not exist yet. Defaults to 6.
  padding?: number;
}

interface IAllocatedRow {
  allocated: bigint;
  padding: number;
  prefix: string | null;
}

// Resolves the year in the application timezone so a Cairo order placed at
// 00:30 on January 1st UTC still gets the correct sequence year.
function currentSequenceYear(): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: env.APP_TIMEZONE,
    year: "numeric",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const parsed = year ? Number.parseInt(year, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) {
    throw new BadRequestError(
      "Unable to resolve the current sequence year",
      "SEQUENCE_YEAR_UNRESOLVED",
    );
  }
  return parsed;
}

function formatDocumentNumber(
  prefix: string | null,
  year: number,
  allocated: number,
  padding: number,
): string {
  const padded = String(allocated).padStart(padding, "0");
  return prefix ? `${prefix}-${year}-${padded}` : `${year}-${padded}`;
}

// Allocates the next document number for (documentType, year) with no gaps and
// no duplicates, even under concurrency.
//
// How it works:
//   - A single atomic INSERT ... ON CONFLICT DO UPDATE ... RETURNING statement
//     either creates the row for the new year (nextNumber starts at 2, the
//     caller receives 1) or increments the existing row and returns the old
//     value. PostgreSQL serializes concurrent upserts on the same conflict
//     target, so two callers can never receive the same number.
//   - The allocation MUST run inside the same transaction that creates the
//     document (Order/Invoice). If the document insert fails, the whole
//     transaction rolls back and the number is freed, which keeps the sequence
//     gapless. Never call this with a standalone client if the caller cares
//     about gaps.
export async function allocateDocumentNumber(
  tx: ITransactionClient,
  config: IDocumentNumberConfig,
): Promise<string> {
  const documentType = config.documentType.trim();
  if (!documentType) {
    throw new BadRequestError(
      "documentType is required",
      "SEQUENCE_TYPE_REQUIRED",
    );
  }

  const year = currentSequenceYear();
  const padding = config.padding ?? 6;
  const id = randomUUID();

  const rows = await tx.$queryRaw<IAllocatedRow[]>`
    INSERT INTO "DocumentSequence"
      ("id", "documentType", "year", "prefix", "nextNumber", "padding", "createdAt", "updatedAt")
    VALUES
      (${id}, ${documentType}, ${year}, ${config.prefix ?? null}, 2, ${padding}, now(), now())
    ON CONFLICT ("documentType", "year")
    DO UPDATE SET
      "nextNumber" = "DocumentSequence"."nextNumber" + 1,
      "updatedAt" = now()
    RETURNING
      ("nextNumber" - 1) AS "allocated",
      "padding" AS "padding",
      "prefix" AS "prefix"
  `;

  const row = rows[0];
  if (!row) {
    throw new BadRequestError(
      "Document sequence allocation returned no row",
      "SEQUENCE_ALLOCATION_FAILED",
    );
  }

  const allocated = Number(row.allocated);
  return formatDocumentNumber(row.prefix, year, allocated, row.padding);
}
