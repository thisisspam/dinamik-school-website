/**
 * Manual (re)seed script — run with `npm run db:seed`.
 * Clears all admin-managed content and reloads it from the /content JSON
 * snapshots. The app already seeds itself automatically on first run when
 * the database is empty (see lib/db/client.ts); use this script only to
 * reset content back to the original defaults.
 */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { CREATE_TABLES_SQL, seedInitialContent } from "./setup";

const DB_PATH = resolve(process.cwd(), "data", "app.db");

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec(CREATE_TABLES_SQL);
db.exec("DELETE FROM departments; DELETE FROM staff; DELETE FROM gallery_images; DELETE FROM site_settings; DELETE FROM homepage_sections;");
seedInitialContent(db);

console.log("Database reseeded from /content JSON snapshots.");
