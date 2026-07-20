import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Eye, EyeOff, Palette, Pencil, Plus, Shapes, Trash2 } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { deleteDepartmentAction, toggleDepartmentVisibilityAction } from "@/lib/actions/departments";
import { AdminPageHeader } from "../../AdminPageHeader";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";

const ACCENT_LABELS: Record<string, string> = {
  red: "Kırmızı",
  indigo: "Lacivert",
  cyan: "Camgöbeği",
};

export default async function AdminDepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const db = getDb();
  const rows = await db.select().from(schema.departments).orderBy(asc(schema.departments.sortOrder));
  const visibleCount = rows.filter((row) => row.isVisible).length;
  const customCount = rows.filter((row) => row.isDeletable).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Akademik içerik"
        title="Bölümler"
        description="Bölüm ekleyin, içerikleri ve temaları düzenleyin; bir programı silmeden geçici olarak yayından kaldırın."
        actions={<Link className="admin-btn" href="/admin/bolumler/yeni"><Plus aria-hidden="true" size={16} /> Yeni bölüm</Link>}
      />
      {saved ? <div className="admin-flash">Bölüm ayarları kaydedildi.</div> : null}

      <section className="admin-component-summary" aria-label="Bölüm özeti">
        <article><Shapes aria-hidden="true" size={20} /><span><strong>{rows.length}</strong><small>Toplam bölüm</small></span></article>
        <article><Eye aria-hidden="true" size={20} /><span><strong>{visibleCount}</strong><small>Yayında</small></span></article>
        <article><Plus aria-hidden="true" size={20} /><span><strong>{customCount}</strong><small>Özel bölüm</small></span></article>
      </section>

      <div className="admin-department-list">
        {rows.map((row) => (
          <article className={`admin-department-card${row.isVisible ? "" : " is-hidden"}`} key={row.id}>
            <div className={`admin-department-thumb admin-department-thumb--${row.accent}`}>
              <Image src={row.image} alt="" fill sizes="130px" />
              <span aria-hidden="true" />
            </div>
            <div className="admin-department-copy">
              <div className="admin-component-title-row">
                <h2>{row.title}</h2>
                <span className={`admin-status-badge ${row.isVisible ? "is-visible" : "is-hidden"}`}>
                  {row.isVisible ? <Eye aria-hidden="true" size={13} /> : <EyeOff aria-hidden="true" size={13} />}
                  {row.isVisible ? "Yayında" : "Gizli"}
                </span>
              </div>
              <p>{row.branch}</p>
              <div className="admin-component-meta">
                <span><Palette aria-hidden="true" size={13} /> {ACCENT_LABELS[row.accent] ?? row.accent}</span>
                <span>{row.isDeletable ? "Özel bölüm" : "Kurumsal bölüm"}</span>
                <span>/bolumler/{row.slug}</span>
              </div>
            </div>
            <div className="admin-component-actions">
              <form action={toggleDepartmentVisibilityAction}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="nextVisible" value={String(!row.isVisible)} />
                <button className="admin-btn admin-btn-secondary" type="submit">
                  {row.isVisible ? <EyeOff aria-hidden="true" size={14} /> : <Eye aria-hidden="true" size={14} />}
                  {row.isVisible ? "Gizle" : "Göster"}
                </button>
              </form>
              <Link className="admin-btn admin-btn-secondary" href={`/admin/bolumler/${row.id}`}>
                <Pencil aria-hidden="true" size={14} /> Düzenle
              </Link>
              {row.isDeletable ? (
                <form action={deleteDepartmentAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage={`${row.title} kalıcı olarak silinsin mi?`}>
                    <Trash2 aria-hidden="true" size={14} /> Sil
                  </ConfirmSubmitButton>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
