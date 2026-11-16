import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { swaggerSpec } from "../src/config/swagger.js";

// Audit: every registered Express route (parsed from the router source files)
// vs the OpenAPI spec. Run: npx tsx scripts/verify-swagger.ts
// Exit 1 when a live route is missing from the spec.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_DIR = path.join(__dirname, "..", "src", "modules");

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;

interface IRouteEntry {
  path: string;
  methods: string[];
}

const collected: IRouteEntry[] = [];

function parseRoutesFile(filePath: string, prefixChain: string): void {
  const source = readFileSync(filePath, "utf8");

  // Sub-router mounts: router.use("<prefix>", someRouter)
  const mounts = [...source.matchAll(/\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g)];
  const importMap = new Map<string, string>();
  for (const match of source.matchAll(/import\s+(\w+)\s+from\s+["']\.\/([^"']+)\.js["']/g)) {
    importMap.set(match[1]!, match[2]!);
  }

  // HTTP routes: router.get("path", ...) - path may sit on the next line.
  for (const match of source.matchAll(
    /\.((?:get|post|put|patch|delete))\(\s*["']([^"']+)["']/g,
  )) {
    const method = match[1]!;
    const routePath = match[2]!;
    const full = prefixChain + routePath;
    const existing = collected.find((entry) => entry.path === full);
    if (existing) {
      if (!existing.methods.includes(method)) existing.methods.push(method);
    } else {
      collected.push({ path: full, methods: [method] });
    }
  }

  for (const mount of mounts) {
    const subPrefix = mount[1]!;
    const subVar = mount[2]!;
    const relative = importMap.get(subVar);
    if (!relative) continue;
    const subFile = path.join(path.dirname(filePath), `${relative}.ts`);
    parseRoutesFile(subFile, prefixChain + subPrefix);
  }
}

// Top-level mounts from src/modules/index.ts, each under /api.
const indexPath = path.join(MODULES_DIR, "index.ts");
const indexSource = readFileSync(indexPath, "utf8");
const topImportMap = new Map<string, string>();
for (const match of indexSource.matchAll(/import\s+(\w+)\s+from\s+["']\.\/([^"']+)\.js["']/g)) {
  topImportMap.set(match[1]!, match[2]!);
}
for (const mount of indexSource.matchAll(/\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g)) {
  const prefix = mount[1]!;
  const target = topImportMap.get(mount[2]!);
  if (!target) continue;
  parseRoutesFile(path.join(MODULES_DIR, `${target}.ts`), `/api${prefix}`);
}

// Normalize a live path into the spec's form: strip the /api server prefix,
// turn Express ":param" segments into "{param}", and treat a trailing "/" as
// the bare path (generated modules mount on "/" so GET /categories/ = /categories).
const normalize = (value: string): string =>
  value
    .replace(/^\/api/, "")
    .replace(/:([A-Za-z0-9_]+)/g, "{$1}")
    .replace(/\/{2,}/g, "/")
    .replace(/(.+?)\/+$/, "$1");

const livePaths = new Map<string, Set<string>>();
for (const entry of collected) {
  const key = normalize(entry.path);
  const methods = livePaths.get(key) ?? new Set<string>();
  for (const method of entry.methods) methods.add(method.toUpperCase());
  livePaths.set(key, methods);
}

const specPaths = (swaggerSpec.paths ?? {}) as Record<string, Record<string, unknown>>;
const specMethods = new Map<string, Set<string>>();
for (const [specPath, operations] of Object.entries(specPaths)) {
  specMethods.set(
    specPath,
    new Set(Object.keys(operations).filter((key) => (HTTP_METHODS as readonly string[]).includes(key))),
  );
}

const missing: string[] = [];
const documentedExtra: string[] = [];
for (const [livePath, methods] of [...livePaths.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const spec = specMethods.get(livePath);
  for (const method of methods) {
    if (!spec || !spec.has(method.toLowerCase())) {
      missing.push(`${method.padEnd(6)} ${livePath}`);
    }
  }
}
for (const [specPath, methods] of [...specMethods.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const live = livePaths.get(specPath);
  if (!live) {
    documentedExtra.push(`path  ${specPath}`);
    continue;
  }
  for (const method of methods) {
    if (!live.has(method.toUpperCase())) documentedExtra.push(`${method.padEnd(6)} ${specPath}`);
  }
}

const liveOperations = [...livePaths.values()].reduce((sum, methods) => sum + methods.size, 0);
const specOperations = [...specMethods.values()].reduce((sum, methods) => sum + methods.size, 0);
console.log(`Live routes: ${livePaths.size} paths / ${liveOperations} operations (app-level docs/UI routes excluded)`);
console.log(`Spec paths:  ${specMethods.size} paths / ${specOperations} operations`);

if (missing.length > 0) {
  console.log(`\nMISSING FROM SPEC (${missing.length}):`);
  missing.forEach((entry) => console.log(`  ${entry}`));
}
if (documentedExtra.length > 0) {
  console.log(`\nIN SPEC BUT NOT LIVE (${documentedExtra.length}):`);
  documentedExtra.forEach((entry) => console.log(`  ${entry}`));
}
if (missing.length === 0 && documentedExtra.length === 0) {
  console.log("\nSwagger spec matches the live routes exactly.");
}
process.exit(missing.length > 0 ? 1 : 0);
