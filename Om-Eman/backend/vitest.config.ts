import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // Integration tests need a reachable PostgreSQL; they self-skip when the
    // database is down so `npm test` still passes on a clean machine.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
