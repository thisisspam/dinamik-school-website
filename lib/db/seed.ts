/**
 * Manual (re)seed script — run with `npm run db:seed`.
 * Clears all admin-managed content and reloads it from the /content JSON
 * snapshots. The app already seeds itself automatically on first run when
 * the database is empty (see lib/db/client.ts); use this script only to
 * reset content back to the original defaults.
 *
 * Requires POSTGRES_URL (or DATABASE_URL) in the environment — run
 * `vercel env pull .env.local` first if seeding against the deployed
 * database.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { CREATE_TABLE_STATEMENTS, reseedInitialContent } from "./setup";

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
    }
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL bulunamadı. `vercel env pull .env.local` çalıştırın.");

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });
  for (const statement of CREATE_TABLE_STATEMENTS) {
    await sql(statement);
  }
  await reseedInitialContent(db);
  console.log("Database reseeded from /content JSON snapshots.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
