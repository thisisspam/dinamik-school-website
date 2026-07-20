import { DatabaseSync, type StatementSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";
import { CREATE_TABLES_SQL, ensureDepartmentManagementColumns, ensureHomepageSections, ensureRegistrationPrivacyColumns, seedInitialContent } from "./setup";

const DB_PATH = resolve(process.cwd(), "data", "app.db");

let sqlite: DatabaseSync | null = null;

function getSqlite(): DatabaseSync {
  if (sqlite) return sqlite;

  mkdirSync(dirname(DB_PATH), { recursive: true });
  sqlite = new DatabaseSync(DB_PATH);
  sqlite.exec("PRAGMA journal_mode = WAL;");
  sqlite.exec(CREATE_TABLES_SQL);
  ensureDepartmentManagementColumns(sqlite);
  ensureRegistrationPrivacyColumns(sqlite);

  const { count } = sqlite.prepare("SELECT COUNT(*) as count FROM departments").get() as { count: number };
  if (count === 0) {
    seedInitialContent(sqlite);
  }
  ensureHomepageSections(sqlite);

  return sqlite;
}

function toRowValues(row: Record<string, unknown> | undefined): unknown[] {
  return row ? Object.values(row) : [];
}

async function proxyCallback(sqlText: string, params: unknown[], method: "run" | "all" | "values" | "get") {
  const db = getSqlite();
  const stmt: StatementSync = db.prepare(sqlText);

  if (method === "run") {
    stmt.run(...(params as never[]));
    return { rows: [] };
  }

  if (method === "get") {
    const row = stmt.get(...(params as never[])) as Record<string, unknown> | undefined;
    return { rows: toRowValues(row) };
  }

  const rows = stmt.all(...(params as never[])) as Array<Record<string, unknown>>;
  return { rows: rows.map((row) => Object.values(row)) };
}

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    db = drizzle(proxyCallback, { schema });
  }
  return db;
}

export { schema };
