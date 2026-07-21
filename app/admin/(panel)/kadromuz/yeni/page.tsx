import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { createStaffAction } from "@/lib/actions/staff";
import { AdminPageHeader } from "../../../AdminPageHeader";

export default async function AdminNewStaffPage() {
  const db = await getDb();
  const rows = await db.select({ category: schema.staff.category }).from(schema.staff);
  const categories = [...new Set(rows.map((row) => row.category))];

  return (
    <>
      <AdminPageHeader
        eyebrow="Yeni kadro kaydı"
        title="Yeni öğretmen ekle"
        description="Öğretmenin adını, branş grubunu ve unvanını girerek kadroya ekleyin."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/kadromuz"><ArrowLeft aria-hidden="true" size={16} /> Kadroya dön</Link>}
      />
      <div className="admin-card">
        <form className="admin-form" action={createStaffAction} encType="multipart/form-data">
          <label>
            Ad Soyad
            <input type="text" name="name" required autoFocus />
          </label>
          <label>
            Branş / Kategori
            <input type="text" name="category" list="kategori-listesi" required />
          </label>
          <label>
            Unvan
            <input type="text" name="role" required placeholder="Örn. Matematik Öğretmeni" />
          </label>
          <label>
            Öğretmen fotoğrafı
            <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp" />
            <span className="admin-hint">Dikey, net ve en az 400 × 500 piksel bir görsel kullanın.</span>
          </label>
          <datalist id="kategori-listesi">
            {categories.map((category) => (
              <option value={category} key={category} />
            ))}
          </datalist>
          <div className="admin-actions">
            <button className="admin-btn" type="submit"><Plus aria-hidden="true" size={16} /> Öğretmeni ekle</button>
            <Link className="admin-btn admin-btn-secondary" href="/admin/kadromuz">Vazgeç</Link>
          </div>
        </form>
      </div>
    </>
  );
}
