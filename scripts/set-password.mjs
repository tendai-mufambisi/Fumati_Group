/**
 * Set the owner dashboard password on the live site in one step:
 *
 *   node scripts/set-password.mjs "the new password"
 *
 * Hashes the password (same format as hash-password.mjs) and writes it to the
 * production D1 database. Add --local to set it on the local dev database instead.
 * The SQL goes through a temporary file, so no shell quoting can mangle the hash.
 */
import { spawnSync } from "node:child_process";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const local = args.includes("--local");
const password = args.find((a) => a !== "--local");

if (!password || password.length < 8) {
  console.error('Usage: node scripts/set-password.mjs "new password"   (at least 8 characters)');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, 100_000, 32, "sha256");
const stored = `pbkdf2$100000$${salt.toString("hex")}$${hash.toString("hex")}`;

const dir = mkdtempSync(join(tmpdir(), "fumati-pw-"));
const sqlFile = join(dir, "set-password.sql");
writeFileSync(
  sqlFile,
  `INSERT INTO settings (key, value, updated_at) VALUES ('admin_password_hash', '${stored}', datetime('now'))
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;\n`,
);

const target = local
  ? ["--local", "--persist-to", ".wrangler/state", "-c", ".output/server/wrangler.json"]
  : ["--remote"];
// One command string: the only variable part is our own temp file path, quoted for spaces.
const command = [
  "npx wrangler d1 execute fumati-group",
  ...target,
  `--file "${sqlFile}"`,
  "--yes",
].join(" ");
const result = spawnSync(command, { stdio: "inherit", shell: true });
rmSync(dir, { recursive: true, force: true });

if (result.status !== 0) {
  console.error("\nThe password was NOT changed. See the error above.");
  process.exit(1);
}
console.log(`\nDone. The dashboard password is set${local ? " (local database)" : ""}.`);
