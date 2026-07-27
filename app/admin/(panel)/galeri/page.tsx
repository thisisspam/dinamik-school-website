import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowDown, ArrowUp, Images, Layers3, Save, Trash2, Upload } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import {
  deleteGalleryImageAction,
  moveGalleryImageAction,
  updateGalleryImageAction,
  uploadGalleryImageAction,
} from "@/lib/actions/gallery";
import {
  isMediaCollectionKey,
  MEDIA_COLLECTIONS,
} from "@/lib/cms/media-collections";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";
import { AdminPageHeader } from "../../AdminPageHeader";

const GALLERY_COLLECTIONS = MEDIA_COLLECTIONS.filter((collection) => collection.scope === "gallery");

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; collection?: string }>;
}) {
  const { saved, collection } = await searchParams;
  const requestedCollection = collection && isMediaCollectionKey(collection)
    ? MEDIA_COLLECTIONS.find((item) => item.key === collection)
    : undefined;
  const collectionDefinition = requestedCollection?.scope === "gallery"
    ? requestedCollection
    : GALLERY_COLLECTIONS[0];
  const selectedCollection = collectionDefinition.key;
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.collectionKey, selectedCollection))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));

  return (
    <>
      <AdminPageHeader
        eyebrow="Medya kütüphanesi"
        title="Galeri ve Albümler"
        description="Site galerisi ve başarı arşivindeki tekil fotoğrafları yönetin. Faaliyetlerdeki toplu albümler ayrı ve daha kullanışlı bir alanda bulunur."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/faaliyetler"><Layers3 size={15} /> Faaliyet albümlerine git</Link>}
      />
      {saved ? <div className="admin-flash">Medya koleksiyonu kaydedildi.</div> : null}

      <nav className="admin-media-tabs" aria-label="Medya koleksiyonları">
        {GALLERY_COLLECTIONS.map((item) => (
          <Link
            className={item.key === selectedCollection ? "is-active" : undefined}
            href={`/admin/galeri?collection=${item.key}`}
            key={item.key}
          >
            <Images aria-hidden="true" size={17} />
            <span><strong>{item.displayName}</strong><small>{item.description}</small></span>
          </Link>
        ))}
      </nav>

      <div className="admin-page-section-heading">
        <div>
          <p className="admin-eyebrow">Seçili koleksiyon</p>
          <h2>{collectionDefinition.displayName}</h2>
          <p>{collectionDefinition.description}</p>
        </div>
        <span>{rows.length} görsel</span>
      </div>

      <div className="admin-card">
        <form className="admin-form admin-media-upload-form" action={uploadGalleryImageAction} encType="multipart/form-data">
          <input type="hidden" name="collectionKey" value={selectedCollection} />
          <label>
            Fotoğraf
            <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp" required />
          </label>
          <label>
            Görsel açıklaması (alt metin)
            <input type="text" name="alt" required placeholder="Örn. Öğrenciler laboratuvar uygulamasında" />
          </label>
          <label>
            Başlık
            <input type="text" name="caption" required placeholder="Örn. Kimya laboratuvarı" />
          </label>
          <label className="admin-form-full">
            Açıklama
            <textarea name="description" rows={3} placeholder="Fotoğraf veya albüm için kısa, anlaşılır açıklama" />
          </label>
          <label>
            Albüm kodu
            <input type="text" name="albumId" placeholder="Örn. bilim-senligi" />
            <small>Aynı albümdeki fotoğraflara aynı kısa kodu yazın.</small>
          </label>
          <label>
            Albüm adı
            <input type="text" name="albumTitle" placeholder="Örn. Bilim Şenliği" />
          </label>
          <label>
            Görsel yerleşimi
            <select name="fit" defaultValue="cover">
              <option value="cover">Alanı doldur</option>
              <option value="contain">Görselin tamamını göster</option>
            </select>
          </label>
          <label>
            Odak konumu
            <input type="text" name="objectPosition" placeholder="Örn. center 35%" />
            <small>Boş bırakılırsa görsel ortalanır.</small>
          </label>
          <div className="admin-actions admin-form-full">
            <button className="admin-btn" type="submit"><Upload aria-hidden="true" size={16} /> Görseli yükle</button>
          </div>
        </form>
      </div>

      <div className="admin-gallery-grid">
        {rows.map((row, index) => (
          <div className="admin-gallery-item" key={row.id}>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail, arbitrary uploaded image dimensions */}
            <img src={row.src} alt={row.alt} />
            <div className="admin-gallery-meta">
              <form className="admin-gallery-edit-form" action={updateGalleryImageAction}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="collectionKey" value={selectedCollection} />
                <label>Görsel açıklaması<input type="text" name="alt" defaultValue={row.alt} required /></label>
                <label>Başlık<input type="text" name="caption" defaultValue={row.caption ?? ""} required /></label>
                <label className="admin-form-full">Açıklama<textarea name="description" rows={3} defaultValue={row.description ?? ""} /></label>
                <label>Albüm kodu<input type="text" name="albumId" defaultValue={row.albumId ?? ""} /></label>
                <label>Albüm adı<input type="text" name="albumTitle" defaultValue={row.albumTitle ?? ""} /></label>
                <label>
                  Görsel yerleşimi
                  <select name="fit" defaultValue={row.fit}>
                    <option value="cover">Alanı doldur</option>
                    <option value="contain">Görselin tamamını göster</option>
                  </select>
                </label>
                <label>Odak konumu<input type="text" name="objectPosition" defaultValue={row.objectPosition ?? ""} /></label>
                <button className="admin-btn admin-btn-secondary admin-form-full" type="submit">
                  <Save aria-hidden="true" size={14} /> Kaydet
                </button>
              </form>
              <div className="admin-gallery-item-actions">
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="collectionKey" value={selectedCollection} />
                  <input type="hidden" name="direction" value="up" />
                  <button className="admin-btn admin-btn-secondary" type="submit" disabled={index === 0} aria-label="Görseli yukarı taşı"><ArrowUp size={14} /></button>
                </form>
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="collectionKey" value={selectedCollection} />
                  <input type="hidden" name="direction" value="down" />
                  <button className="admin-btn admin-btn-secondary" type="submit" disabled={index === rows.length - 1} aria-label="Görseli aşağı taşı"><ArrowDown size={14} /></button>
                </form>
                <form action={deleteGalleryImageAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="collectionKey" value={selectedCollection} />
                  <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage="Bu görsel koleksiyondan kaldırılsın mı?">
                    <Trash2 aria-hidden="true" size={14} /> Sil
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="admin-empty">Bu koleksiyonda henüz görsel yok. Yukarıdaki formdan ilk görseli ekleyebilirsiniz.</p>
        ) : null}
      </div>
    </>
  );
}
