import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { deleteStaffAction } from "@/lib/actions/staff";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";
import { AdminPageHeader } from "../../AdminPageHeader";

export default async function AdminStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const db = await getDb();
  const rows = await db.select().from(schema.staff).orderBy(asc(schema.staff.sortOrder));

  const grouped = new Map<string, typeof rows>();
  for (const row of rows) {
    if (!grouped.has(row.category)) grouped.set(row.category, []);
    grouped.get(row.category)!.push(row);
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Eğitim kadrosu"
        title="Kadromuz"
        description={`${rows.length} öğretmen, ${grouped.size} branş grubu. Kadro bilgilerini ekleyin, düzenleyin veya güncelliğini yitiren kayıtları kaldırın.`}
        actions={<Link className="admin-btn" href="/admin/kadromuz/yeni"><Plus aria-hidden="true" size={16} /> Yeni öğretmen</Link>}
      />
      {saved ? <div className="admin-flash">Kaydedildi.</div> : null}
      {[...grouped.entries()].map(([category, members]) => (
        <div className="admin-card" key={category}>
          <strong>{category}</strong> <span className="admin-hint">{members[0]?.role ?? ""}</span>
          <table>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="admin-staff-thumbnail-cell">
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- compact admin thumbnail supports local and uploaded URLs
                      <img className="admin-staff-thumbnail" src={member.image} alt="" />
                    ) : (
                      <span className="admin-staff-thumbnail admin-staff-thumbnail--empty" aria-hidden="true">—</span>
                    )}
                  </td>
                  <td>{member.name}</td>
                  <td className="admin-actions">
                    <Link className="admin-btn admin-btn-secondary" href={`/admin/kadromuz/${member.id}`}>
                      <Pencil aria-hidden="true" size={14} /> Düzenle
                    </Link>
                    <form action={deleteStaffAction}>
                      <input type="hidden" name="id" value={member.id} />
                      <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage={`${member.name} kaldırılsın mı?`}>
                        <Trash2 aria-hidden="true" size={14} /> Sil
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {rows.length === 0 ? <p className="admin-empty">Henüz kayıtlı öğretmen yok.</p> : null}
    </>
  );
}
