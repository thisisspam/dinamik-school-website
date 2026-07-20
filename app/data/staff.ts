import { asc } from "drizzle-orm";
import { getDb, schema } from "../../lib/db/client";

export type StaffGroup = { category: string; role: string; names: string[] };
export type StaffMember = { name: string; category: string; role: string };

export async function getStaffGroups(): Promise<StaffGroup[]> {
  const db = await getDb();
  const rows = await db.select().from(schema.staff).orderBy(asc(schema.staff.sortOrder));

  const groups: StaffGroup[] = [];
  for (const row of rows) {
    let group = groups.find((candidate) => candidate.category === row.category);
    if (!group) {
      group = { category: row.category, role: row.role, names: [] };
      groups.push(group);
    }
    group.names.push(row.name);
  }
  return groups;
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  const db = await getDb();
  const rows = await db.select().from(schema.staff).orderBy(asc(schema.staff.sortOrder));

  return rows.map(({ name, category, role }) => ({ name, category, role }));
}
