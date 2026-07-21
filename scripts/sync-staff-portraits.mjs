import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
    }
  }
}

async function main() {
  loadEnvLocal();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL bulunamadı.");

  const shouldApply = process.argv.includes("--apply");
  const portraits = JSON.parse(
    readFileSync(resolve(process.cwd(), "content/staff-portraits.json"), "utf8"),
  );
  const sql = neon(databaseUrl);

  const columns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff'
  `;
  const hasImageColumn = columns.some((column) => column.column_name === "image");
  if (shouldApply && !hasImageColumn) {
    await sql`ALTER TABLE staff ADD COLUMN IF NOT EXISTS image TEXT`;
  }
  const currentRows = hasImageColumn
    ? await sql`
        SELECT id, name, category, role, image, sort_order
        FROM staff
        ORDER BY sort_order, id
      `
    : await sql`
        SELECT id, name, category, role, NULL::text AS image, sort_order
        FROM staff
        ORDER BY sort_order, id
      `;

  let nextSortOrder = currentRows.reduce(
    (highest, row) => Math.max(highest, Number(row.sort_order)),
    -1,
  ) + 1;
  const changes = [];

  for (const portrait of portraits) {
    const acceptedNames = new Set([portrait.name, ...(portrait.aliases ?? [])]);
    const existing = currentRows.find((row) => acceptedNames.has(row.name));

    if (!existing) {
      changes.push({ type: "insert", name: portrait.name, category: portrait.category });
      if (shouldApply) {
        await sql`
          INSERT INTO staff (name, category, role, image, sort_order)
          VALUES (${portrait.name}, ${portrait.category}, ${portrait.role}, ${portrait.image}, ${nextSortOrder})
        `;
      }
      nextSortOrder += 1;
      continue;
    }

    const needsUpdate =
      existing.name !== portrait.name ||
      existing.category !== portrait.category ||
      existing.role !== portrait.role ||
      existing.image !== portrait.image;
    if (!needsUpdate) continue;

    changes.push({ type: "update", id: existing.id, name: portrait.name, category: portrait.category });
    if (shouldApply) {
      await sql`
        UPDATE staff
        SET name = ${portrait.name},
            category = ${portrait.category},
            role = ${portrait.role},
            image = ${portrait.image}
        WHERE id = ${existing.id}
      `;
    }
  }

  const rowsForOrdering = shouldApply
    ? await sql`
        SELECT id, name, category, role, image, sort_order
        FROM staff
        ORDER BY sort_order, id
      `
    : currentRows;
  const categoryOrder = [...new Set(rowsForOrdering.map((row) => row.category))];
  const desiredOrder = categoryOrder.flatMap((category) =>
    rowsForOrdering.filter((row) => row.category === category),
  );
  for (const [sortOrder, row] of desiredOrder.entries()) {
    if (Number(row.sort_order) === sortOrder) continue;
    changes.push({ type: "reorder", id: row.id, name: row.name, category: row.category });
    if (shouldApply) {
      await sql`UPDATE staff SET sort_order = ${sortOrder} WHERE id = ${row.id}`;
    }
  }

  console.log(`${shouldApply ? "Applied" : "Planned"} ${changes.length} staff changes.`);
  for (const change of changes) {
    console.log(`${change.type.toUpperCase()} ${change.name} — ${change.category}`);
  }
  if (!shouldApply && changes.length > 0) {
    console.log("Run again with --apply to write these changes.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
