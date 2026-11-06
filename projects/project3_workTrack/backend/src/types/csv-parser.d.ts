// csv-parser doesn't ship its own TypeScript types and there is no @types package.
// This minimal declaration is enough for the way we use it: create a transform
// stream, pipe a CSV file into it, and listen for "data", "end", and "error".
declare module "csv-parser" {
  import type { Transform } from "node:stream";

  interface CsvParserOptions {
    separator?: string;
    quote?: string;
    escape?: string;
    headers?: string[] | false;
    mapHeaders?: (args: { header: string; index: number }) => string | null;
    mapValues?: (args: { header: string; index: number; value: string }) => string;
    skipLines?: number;
    strict?: boolean;
  }

  function csvParser(options?: CsvParserOptions): Transform;

  export = csvParser;
}
