import { asc } from "drizzle-orm";
import { Trash2, Upload } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { deleteGalleryImageAction, uploadGalleryImageAction } from "@/lib/actions/gallery";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";
import { AdminPageHeader } from "../../AdminPageHeader";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const db = await getDb();
  const rows = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.sortOrder));

  return (
    <>
      <AdminPageHeader
        eyebrow="Medya kütüphanesi"
        title="Galeri"
        description={`${rows.length} görsel yayında. Yeni fotoğraf yükleyin veya artık kullanılmayan görselleri kaldırın.`}
      />
      {saved ? <div className="admin-flash">Kaydedildi.</div> : null}
      <div className="admin-card">
        <form className="admin-form" action={uploadGalleryImageAction} encType="multipart/form-data">
          <label>
            Fotoğraf
            <input type="file" name="imageFile" accept="image/*" required />
          </label>
          <label>
            Açıklama (alt metin)
            <input type="text" name="alt" required placeholder="Örn. Dinamik öğrencileri laboratuvar uygulamasında" />
          </label>
          <label>
            Galeri başlığı
            <input type="text" name="caption" placeholder="Örn. Kimya laboratuvarı" />
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="submit"><Upload aria-hidden="true" size={16} /> Görseli yükle</button>
          </div>
        </form>
      </div>
      <div className="admin-gallery-grid">
        {rows.map((row) => (
          <div className="admin-gallery-item" key={row.id}>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail, arbitrary uploaded image dimensions */}
            <img src={row.src} alt={row.alt} />
            <div className="admin-gallery-meta">
              <div>{row.caption ?? row.alt}</div>
              <form action={deleteGalleryImageAction}>
                <input type="hidden" name="id" value={row.id} />
                <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage="Bu görsel kaldırılsın mı?">
                  <Trash2 aria-hidden="true" size={14} /> Sil
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 ? <p className="admin-empty">Henüz görsel eklenmedi.</p> : null}
      </div>
    </>
  );
}
