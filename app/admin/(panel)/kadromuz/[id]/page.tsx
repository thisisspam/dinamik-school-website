import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { updateStaffAction } from "@/lib/actions/staff";
import { AdminPageHeader } from "../../../AdminPageHeader";

export default async function AdminEditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const row = (await db.select().from(schema.staff).where(eq(schema.staff.id, Number(id))))[0];
  if (!row) notFound();

  const categoryRows = await db.select({ category: schema.staff.category }).from(schema.staff);
  const categories = [...new Set(categoryRows.map((item) => item.category))];

  return (
    <>
      <AdminPageHeader
        eyebrow="Kadro düzenleme"
        title={row.name}
        description="Kadro üyesinin görev veya branş, ana unvan ve varsa ek görev bilgilerini güncelleyin."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/kadromuz"><ArrowLeft aria-hidden="true" size={16} /> Kadroya dön</Link>}
      />
      <div className="admin-card">
        <form className="admin-form" action={updateStaffAction} encType="multipart/form-data">
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="existingImage" value={row.image ?? ""} />
          <label>
            Ad Soyad
            <input type="text" name="name" defaultValue={row.name} required autoFocus />
          </label>
          <label>
            Branş / Kategori
            <input type="text" name="category" list="kategori-listesi" defaultValue={row.category} required />
          </label>
          <label>
            Ana unvan
            <input type="text" name="role" defaultValue={row.role} required />
          </label>
          <label>
            Ek görev (isteğe bağlı)
            <input type="text" name="additionalRole" defaultValue={row.additionalRole ?? ""} placeholder="Örn. Müdür Yardımcısı" />
            <span className="admin-hint">Ek görev, kadro kartında farklı renkle gösterilir.</span>
          </label>
          <div className="admin-media-field admin-staff-media-field">
            <div className="admin-current-media admin-staff-current-media">
              {row.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview supports local and uploaded URLs
                <img src={row.image} alt={`${row.name} mevcut kadro fotoğrafı`} />
              ) : (
                <span>Fotoğraf yok</span>
              )}
            </div>
            <div className="admin-staff-media-controls">
              <label>
                Yeni kadro fotoğrafı
                <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp" />
              </label>
              {row.image ? (
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="removeImage" />
                  Mevcut fotoğrafı kaldır
                </label>
              ) : null}
              <span className="admin-hint">Dosya seçmezseniz mevcut fotoğraf korunur.</span>
            </div>
          </div>
          <datalist id="kategori-listesi">
            {categories.map((category) => (
              <option value={category} key={category} />
            ))}
          </datalist>
          <div className="admin-actions">
            <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Değişiklikleri kaydet</button>
            <Link className="admin-btn admin-btn-secondary" href="/admin/kadromuz">Vazgeç</Link>
          </div>
        </form>
      </div>
    </>
  );
}
