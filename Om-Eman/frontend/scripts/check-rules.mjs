import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "hooks", "store", "Providers", "i18n", "interface", "validation"];
const EXTRA_FILES = ["proxy.ts"];
const COLOR_EXEMPT = new Set(["lib/theme.ts"]);
const ARABIC = /[\u0600-\u06FF]/;
const RAW_COLOR = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\brgba?\(|\bhsla?\(/;
const PHYSICAL_CLASS = /\b(ml|mr|pl|pr)-\d|\b(left|right)-\d|\btext-(left|right)\b/;
const BANNED = [
  { pattern: /:\s*any\b|\bas any\b/, label: "any" },
  { pattern: /@ts-ignore|@ts-nocheck/, label: "@ts-ignore" },
  { pattern: /console\.log\(/, label: "console.log" },
  { pattern: /from\s+["']framer-motion["']/, label: "framer-motion import (use motion/react)" },
  { pattern: /(bg|text|border|ring|from|to|via)-\$\{/, label: "dynamic Tailwind class" },
];

const failures = [];
const warnings = [];

const toPosix = (path) => relative(ROOT, path).split(sep).join("/");

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
};

const isCode = (file) => /\.(ts|tsx)$/.test(file);

const checkFile = (file) => {
  const path = toPosix(file);
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const count = text.endsWith("\n") ? lines.length - 1 : lines.length;

  if (count > 200) failures.push(`${path}: ${count} lines (hard limit 200)`);
  else if (count > 150) warnings.push(`${path}: ${count} lines (soft limit 150)`);
  if (/(^|\/)page\.tsx$/.test(path) && count > 30) warnings.push(`${path}: page has ${count} lines (target 30)`);

  lines.forEach((line, index) => {
    const where = `${path}:${index + 1}`;
    if (ARABIC.test(line)) failures.push(`${where}: hardcoded Arabic text`);
    if (!COLOR_EXEMPT.has(path) && RAW_COLOR.test(line)) failures.push(`${where}: raw color (use tokens)`);
    if (PHYSICAL_CLASS.test(line)) warnings.push(`${where}: physical left/right class (use ms/me/ps/pe/start/end)`);
    BANNED.forEach(({ pattern, label }) => {
      if (pattern.test(line)) failures.push(`${where}: ${label}`);
    });
  });
};

const flatKeys = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) =>
    child !== null && typeof child === "object" ? flatKeys(child, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

const checkMessages = () => {
  const ar = flatKeys(JSON.parse(readFileSync("messages/ar.json", "utf8")));
  const en = flatKeys(JSON.parse(readFileSync("messages/en.json", "utf8")));
  ar.filter((key) => !en.includes(key)).forEach((key) => failures.push(`messages: "${key}" missing in en.json`));
  en.filter((key) => !ar.includes(key)).forEach((key) => failures.push(`messages: "${key}" missing in ar.json`));
  return ar.length;
};

const files = [...SCAN_DIRS.flatMap((dir) => walk(join(ROOT, dir))), ...EXTRA_FILES.map((file) => join(ROOT, file))];
const codeFiles = files.filter((file) => isCode(file) && existsSync(file));
codeFiles.forEach(checkFile);

if (existsSync("middleware.ts")) failures.push("middleware.ts exists (Next 16 uses proxy.ts)");
if (existsSync("app/layout.tsx")) failures.push("app/layout.tsx exists (root layout is app/[locale]/layout.tsx)");
const keyCount = checkMessages();

console.log(`Scanned ${codeFiles.length} code files, ${keyCount} message keys per locale.`);
warnings.forEach((message) => console.log(`WARN  ${message}`));
failures.forEach((message) => console.log(`FAIL  ${message}`));
console.log(`\n${failures.length} failure(s), ${warnings.length} warning(s).`);
process.exit(failures.length > 0 ? 1 : 0);
