/**
 * Nitro's cloudflare preset regenerates `.output/server/wrangler.json` on every
 * build and auto-generates the worker name. It does merge the root
 * `wrangler.jsonc`, but the generated file is rebuilt from scratch every time, so we re-stamp the deploy target
 * and the bindings here after the build. `wrangler.jsonc` stays the single
 * source of truth; this script just guarantees it reaches the generated config.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/** Strip JSONC comments so the root config can stay commented and readable. */
function parseJsonc(text) {
  const stripped = text
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*$)/gm, (match, lineComment) => (lineComment ? "" : match))
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\*[\s\S]*?\*\/)/g, (match, blockComment) =>
      blockComment ? "" : match,
    );
  return JSON.parse(stripped);
}

const sourcePath = resolve(process.cwd(), "wrangler.jsonc");
const outputPath = resolve(process.cwd(), ".output/server/wrangler.json");

const source = parseJsonc(readFileSync(sourcePath, "utf8"));
const config = JSON.parse(readFileSync(outputPath, "utf8"));

// Everything except $schema — `main`, `assets` and compatibility settings are
// nitro's to own and must survive untouched.
for (const key of ["name", "compatibility_date", "routes", "vars", "d1_databases", "r2_buckets"]) {
  if (source[key] !== undefined) config[key] = source[key];
}

// migrations_dir resolves relative to the config file, which now lives in .output/server.
for (const db of config.d1_databases ?? []) {
  if (db.migrations_dir) db.migrations_dir = "../../" + db.migrations_dir;
}

writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`);

// Local secrets: wrangler dev reads .dev.vars from next to the config file.
// (Git-ignored; production uses `wrangler secret put` instead.)
const devVars = resolve(process.cwd(), ".dev.vars");
if (existsSync(devVars)) copyFileSync(devVars, resolve(process.cwd(), ".output/server/.dev.vars"));

console.log(`patched ${outputPath}`);
console.log(`  name   : ${config.name}`);
console.log(`  domain : ${config.routes?.map((r) => r.pattern).join(", ") ?? "—"}`);
console.log(`  d1     : ${config.d1_databases?.map((d) => d.binding).join(", ") ?? "—"}`);
console.log(`  r2     : ${config.r2_buckets?.map((r) => r.binding).join(", ") ?? "—"}`);
