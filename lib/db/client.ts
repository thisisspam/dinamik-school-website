import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import {
  CREATE_TABLE_STATEMENTS,
  ensureHomepageSections,
  seedInitialContent,
} from "./setup";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL ortam değişkeni tanımlı değil. Yerelde `vercel env pull .env.local` çalıştırın veya Vercel proje ayarlarında Postgres bağlantısını kontrol edin.",
  );
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

let ready: Promise<void> | null = null;

async function ensureReady(): Promise<void> {
  for (const statement of CREATE_TABLE_STATEMENTS) {
    await sql(statement);
  }
  const rows = await sql`SELECT COUNT(*)::int AS count FROM departments`;
  if ((rows[0] as { count: number }).count === 0) {
    await seedInitialContent(db);
  } else {
    await ensureHomepageSections(db);
  }
}

export async function getDb() {
  if (!ready) ready = ensureReady();
  await ready;
  return db;
}

export { schema };
